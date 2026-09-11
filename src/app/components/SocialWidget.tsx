'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Calendar, MapPin } from 'lucide-react';

/** Rotating pill prompts. */
const PROMPTS = [
  { text: 'Need a same-day appointment?', href: 'https://healow.com/apps/practice/texas-primary-pediatric-care-pllc-irving-tx-22218?v=2&t=1' },
  { text: 'Looking for a clinic near you?', href: '/locations' },
  { text: 'Questions about your insurance?', href: '/insurance' },
  { text: 'Not sure which service you need?', href: '/services' },
];

/** Quick links inside the expanded panel. */
const CHIPS = [
  { label: 'Book an appointment', href: 'https://healow.com/apps/practice/texas-primary-pediatric-care-pllc-irving-tx-22218?v=2&t=1' },
  { label: 'Find a location & hours', href: '/locations' },
  { label: 'Check accepted insurance', href: '/insurance' },
];

const SOCIAL_LINKS = [
  {
    icon: Calendar,
    href: 'https://healow.com/apps/practice/texas-primary-pediatric-care-pllc-irving-tx-22218?v=2&t=1',
    label: 'Book appointment',
    tooltip: 'Book an appointment',
    bg: 'bg-brand hover:bg-brand-dark',
    external: true,
  },
  {
    icon: Phone,
    href: 'tel:4694420202',
    label: 'Call us',
    tooltip: 'Call 469-442-0202',
    bg: 'bg-brand-mid hover:bg-brand',
    external: false,
  },
  {
    icon: Mail,
    href: 'mailto:admin@tppcare.com',
    label: 'Email us',
    tooltip: 'admin@tppcare.com',
    bg: 'bg-brand-deeper hover:bg-brand-deep',
    external: false,
  },
  {
    icon: MapPin,
    href: '/locations',
    label: 'Locations',
    tooltip: 'Our locations',
    bg: 'bg-brand-deep hover:bg-brand-deeper',
    external: false,
  },
];

const TYPING_MS = 650;
const SHOWN_MS = 3200;
const HIDE_MS = 280;
const GAP_MS = 400;

function ChatFabIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
      <path
        d="M4 4h16v12H8l-4 4V4z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SocialWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'shown' | 'hiding'>('typing');
  const pathname = usePathname();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // Held in a ref so the cycle can re-enter itself without the
  // callback referencing its own binding before initialisation.
  const runCycleRef = useRef<(index: number) => void>(() => {});

  const runCycle = useCallback(
    (index: number) => {
      setPromptIndex(index);
      setPillVisible(true);
      setPhase('typing');
      schedule(() => {
        setPhase('shown');
        schedule(() => {
          setPhase('hiding');
          schedule(() => {
            setPillVisible(false);
            schedule(
              () => runCycleRef.current((index + 1) % PROMPTS.length),
              GAP_MS
            );
          }, HIDE_MS);
        }, SHOWN_MS);
      }, TYPING_MS);
    },
    [schedule]
  );

  useEffect(() => {
    runCycleRef.current = runCycle;
  }, [runCycle]);

  useEffect(() => {
    // Every state change here is deferred into a timer, so the effect
    // never sets state synchronously during render.
    if (panelOpen) {
      clearTimers();
      const id = setTimeout(() => setPillVisible(false), 0);
      timersRef.current.push(id);
      return clearTimers;
    }
    const id = setTimeout(() => runCycleRef.current(0), 1000);
    timersRef.current.push(id);
    return clearTimers;
  }, [panelOpen, pathname, clearTimers]);

  // Collapse everything on navigation. Deferred so the effect does not
  // set state synchronously (which can cascade renders).
  useEffect(() => {
    const id = setTimeout(() => {
      setIsOpen(false);
      setPanelOpen(false);
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  useEffect(() => clearTimers, [clearTimers]);

  const openPanel = () => {
    setPanelOpen(true);
    setIsOpen(false);
  };

  const closePanel = () => setPanelOpen(false);
  const currentPrompt = PROMPTS[promptIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-sm:right-3 max-sm:bottom-3">
      <style>{`
        @keyframes tppWidgetPulseRing {
          0% { transform: scale(1); opacity: .45; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes tppWidgetTypingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: .4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tpp-widget-ring { animation: none !important; }
          .tpp-widget-dot { animation: none !important; }
        }
      `}</style>

      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="Texas Primary & Pediatric Care quick links"
        aria-hidden={!panelOpen}
        className={`absolute right-0 bottom-[72px] w-[320px] max-w-[calc(100vw-48px)] rounded-[20px] border border-hairline bg-white p-[18px_18px_16px] shadow-[0_18px_40px_rgba(15,58,74,0.18)] transition-all duration-300 ease-out ${
          panelOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-[0.97] pointer-events-none'
        }`}
      >
        <button
          onClick={closePanel}
          aria-label="Dismiss"
          className="absolute top-3 right-3 w-6 h-6 rounded-full text-slate-400 text-lg leading-none hover:bg-surface-2 hover:text-slate-700 transition-colors cursor-pointer"
        >
          ×
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-[34px] h-[34px] rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm flex-none">
            T
          </span>
          <div>
            <p className="font-bold text-[14px] text-slate-900 m-0">
              Texas Primary &amp; Pediatric
            </p>
            <p className="text-[12px] text-slate-500 m-0 flex items-center gap-1">
              <span className="text-[#39b678] text-[9px]">●</span>
              Mon–Fri, 8:30 am – 7:00 pm
            </p>
          </div>
        </div>

        <p className="text-[14.5px] leading-[1.5] text-slate-800 mb-3.5">
          👋 How can we help you today?
        </p>

        <div className="flex flex-col gap-2">
          {CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              onClick={closePanel}
              className="text-left bg-surface-2 border border-hairline text-brand-deeper font-semibold text-[13.5px] px-3.5 py-2.5 rounded-xl transition-all duration-300 hover:bg-hairline hover:translate-x-0.5"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Expanding action icons */}
      <div
        className={`flex flex-col-reverse gap-3 items-end ${
          isOpen ? 'h-fit mb-6' : 'h-0'
        }`}
      >
        {SOCIAL_LINKS.map((social, index) => (
          <div key={social.label} className="relative group">
            <Link
              href={social.href}
              aria-label={social.label}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
              className={`w-12 p-1 rounded-full ${social.bg} flex items-center justify-center text-white shadow-lg transition-all duration-300 ease-out ${
                isOpen
                  ? 'opacity-100 translate-y-0 scale-100 h-12'
                  : 'opacity-0 translate-y-4 scale-75 h-0 pointer-events-none'
              }`}
              style={{
                transitionDelay: isOpen
                  ? `${index * 100}ms`
                  : `${(SOCIAL_LINKS.length - 1 - index) * 50}ms`,
              }}
            >
              <social.icon size={20} />
            </Link>

            {/* Tooltip */}
            <div
              className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none transition-opacity duration-300 ${
                isOpen ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
              }`}
            >
              {social.tooltip}
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-800 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: rotating pill + FAB */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={openPanel}
          aria-label="Open quick links"
          aria-live="polite"
          tabIndex={pillVisible ? 0 : -1}
          className={`flex items-center gap-2.5 bg-white rounded-full p-[6px_6px_6px_8px] max-w-[270px] max-sm:max-w-[58vw] text-left cursor-pointer shadow-[0_10px_24px_rgba(15,58,74,0.14),0_0_0_1px_#cfe6ec] transition-all duration-300 ease-out hover:shadow-[0_14px_30px_rgba(15,58,74,0.2),0_0_0_1.5px_#2596be] ${
            pillVisible
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-1 pointer-events-none'
          }`}
        >
          <span className="flex-none w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center text-[12px] font-bold">
            T
          </span>

          <span className="relative flex-1 min-w-0 h-[18px] flex items-center">
            {phase === 'typing' ? (
              <span className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <i
                    key={i}
                    className="tpp-widget-dot w-1.5 h-1.5 rounded-full bg-slate-400 opacity-45 not-italic"
                    style={{
                      animation: 'tppWidgetTypingBounce 1s infinite ease-in-out',
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </span>
            ) : (
              <span
                className={`text-[13.5px] font-medium text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 ${
                  phase === 'shown'
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-1'
                }`}
              >
                {currentPrompt.text}
              </span>
            )}
          </span>

          <span
            aria-hidden
            className="flex-none w-[34px] h-[34px] rounded-full bg-surface-2 text-brand-deeper flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path
                d="M12 19V5M5 12l7-7 7 7"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {/* FAB */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setPanelOpen(false);
          }}
          aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={isOpen}
          className={`relative w-14 h-14 rounded-full cursor-pointer flex-none flex items-center justify-center text-white shadow-[0_10px_24px_rgba(15,58,74,0.28)] transition-all duration-300 ease-out hover:scale-105 ${
            isOpen ? 'bg-brand-deeper' : 'bg-brand hover:bg-brand-dark'
          }`}
        >
          {!isOpen && (
            <span
              aria-hidden
              className="tpp-widget-ring absolute inset-0 rounded-full bg-brand -z-10"
              style={{ animation: 'tppWidgetPulseRing 2.4s ease-out infinite' }}
            />
          )}
          <ChatFabIcon />
        </button>
      </div>

      {/* Prompt position dots */}
      <div className="flex gap-[5px] justify-end mt-[9px] pr-[6px]">
        {PROMPTS.map((_, i) => (
          <span
            key={i}
            className={`w-[5px] h-[5px] rounded-full transition-all duration-300 ${
              pillVisible && i === promptIndex
                ? 'bg-brand scale-[1.4]'
                : 'bg-hairline'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
