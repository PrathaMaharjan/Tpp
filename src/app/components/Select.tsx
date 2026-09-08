'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Styled single-select.
 *
 * Replaces the native <select>, whose dropdown list is rendered by the
 * OS and cannot be themed. Keeps full keyboard support (Enter/Space to
 * open, arrows to move, Home/End, Escape to close, type-ahead) plus a
 * hidden native input so form validation and submission still work.
 */
export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  id,
  className = '',
  'aria-label': ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeAhead = useRef({ query: '', at: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  // Keep the active option in view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    node?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const openList = () => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        commit(activeIndex);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      default: {
        // Type-ahead: jump to the first option starting with what was typed.
        if (e.key.length !== 1) return;
        const now = Date.now();
        const t = typeAhead.current;
        t.query = now - t.at > 700 ? e.key : t.query + e.key;
        t.at = now;
        const match = options.findIndex((o) =>
          o.label.toLowerCase().startsWith(t.query.toLowerCase())
        );
        if (match >= 0) setActiveIndex(match);
      }
    }
  };

  const listboxId = id ? `${id}-listbox` : undefined;

  return (
    <div ref={rootRef} className="relative">
      {/* Keeps native form validation/submission behaviour. */}
      <select
        aria-hidden
        tabIndex={-1}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute h-px w-px opacity-0 pointer-events-none"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3 text-left text-sm transition duration-300 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
          open
            ? 'border-brand ring-2 ring-brand/20'
            : 'border-slate-200 hover:border-brand-mid/60'
        } ${className}`}
      >
        <span
          className={`truncate ${selected ? 'text-slate-800 font-medium' : 'text-slate-400'}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={17}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${
            open ? 'rotate-180 text-brand' : ''
          }`}
        />
      </button>

      {/* Options */}
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-hairline bg-white p-1.5 shadow-[0_18px_40px_rgba(15,58,74,0.16)] transition-all duration-200 ease-out ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        {options.length === 0 ? (
          <li className="px-3 py-2.5 text-sm text-slate-400">
            No options available
          </li>
        ) : (
          options.map((option, i) => {
            const isSelected = option.value === value;
            const isActive = i === activeIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => commit(i)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                  isActive ? 'bg-surface-2 text-brand-deeper' : 'text-slate-700'
                } ${isSelected ? 'font-semibold' : ''}`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check size={15} className="shrink-0 text-brand" />
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
