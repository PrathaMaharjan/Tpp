'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  /** ISO date string, `YYYY-MM-DD`. */
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  /** Earliest selectable date as `YYYY-MM-DD`. Defaults to today. */
  min?: string;
  id?: string;
  'aria-label'?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Local `YYYY-MM-DD` — avoids the UTC shift of toISOString(). */
function toISO(d: Date) {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function parseISO(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export default function DatePicker({
  value,
  onChange,
  required = false,
  min,
  id,
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = min ? parseISO(min) : today;
  const selected = value ? parseISO(value) : null;

  const [viewMonth, setViewMonth] = useState(
    () => selected ?? minDate ?? today
  );

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Re-centre the calendar when the value changes, without an effect:
  // tracking the last-seen value and adjusting during render avoids the
  // cascading-render warning that setState-in-effect triggers.
  const [seenValue, setSeenValue] = useState(value);
  if (value !== seenValue) {
    setSeenValue(value);
    if (selected) setViewMonth(selected);
  }

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const isDisabled = (d: Date) => (minDate ? d < minDate : false);

  const label = selected
    ? selected.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Select a date';

  return (
    <div ref={rootRef} className="relative">
      {/* Native input keeps form validation working. */}
      <input
        type="date"
        aria-hidden
        tabIndex={-1}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute h-px w-px opacity-0 pointer-events-none"
      />

      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3 text-left text-sm transition duration-300 ${
          open
            ? 'border-brand ring-2 ring-brand/20'
            : 'border-slate-200 hover:border-brand-mid/60'
        }`}
      >
        <span className={selected ? 'font-medium text-slate-800' : 'text-slate-400'}>
          {label}
        </span>
        <Calendar
          size={16}
          className={`shrink-0 ${open ? 'text-brand' : 'text-slate-400'}`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a date"
          className="absolute left-0 z-50 mt-2 w-[300px] max-w-[calc(100vw-3rem)] rounded-2xl border border-hairline bg-white p-4 shadow-[0_18px_40px_rgba(15,58,74,0.16)]"
        >
          {/* Month navigation */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewMonth(new Date(year, month - 1, 1))}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors duration-300 hover:bg-surface-2 hover:text-brand"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="text-sm font-bold text-slate-800">
              {MONTHS[month]} {year}
            </span>

            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth(new Date(year, month + 1, 1))}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors duration-300 hover:bg-surface-2 hover:text-brand"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          {/* Weekday header */}
          <div className="mb-1 grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className="grid h-8 place-items-center text-[11px] font-semibold uppercase text-slate-400"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((date, i) => {
              if (!date) return <span key={`pad-${i}`} className="h-9" />;

              const iso = toISO(date);
              const isSelected = iso === value;
              const isToday = iso === toISO(today);
              const disabled = isDisabled(date);

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  aria-label={date.toDateString()}
                  aria-current={isToday ? 'date' : undefined}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={`grid h-9 place-items-center rounded-lg text-[13px] transition-colors duration-150 ${
                    disabled
                      ? 'cursor-not-allowed text-slate-300'
                      : isSelected
                        ? 'bg-brand font-bold text-white'
                        : isToday
                          ? 'font-bold text-brand hover:bg-surface-2'
                          : 'text-slate-700 hover:bg-surface-2 hover:text-brand-deeper'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="text-xs font-semibold text-slate-500 transition-colors duration-300 hover:text-slate-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(toISO(today));
                setViewMonth(today);
                setOpen(false);
              }}
              className="text-xs font-semibold text-brand transition-colors duration-300 hover:text-brand-dark"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
