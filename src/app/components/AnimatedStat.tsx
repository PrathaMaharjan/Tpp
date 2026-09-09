'use client';

import { useEffect, useRef, useState } from 'react';

interface ParsedStat {
  num: number;
  decimals: number;
  prefix: string;
  suffix: string;
}

/** Split "10,000+" into { num: 10000, decimals: 0, prefix: "", suffix: "+" }. */
function parseStatValue(raw: string): ParsedStat {
  const m = raw.trim().match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return { num: 0, decimals: 0, prefix: '', suffix: raw };
  const [, prefix, numPart, suffix] = m;
  const decimals = numPart.includes('.') ? numPart.split('.')[1].length : 0;
  return { num: parseFloat(numPart.replace(/,/g, '')), decimals, prefix, suffix };
}

function formatNum(n: number, decimals: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

interface AnimatedStatProps {
  value: string;
  label: string;
  index?: number;
  duration?: number;
}

export default function AnimatedStat({
  value,
  label,
  index = 0,
  duration = 1800,
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const parsed = parseStatValue(value);
  const [display, setDisplay] = useState(() => formatNum(0, parsed.decimals));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(formatNum(parsed.num, parsed.decimals));
      return;
    }
    // Stagger matches the entrance delay so numbers count as they fade in.
    const t0 = performance.now() + index * 120;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - t0) / duration, 0), 1);
      setDisplay(formatNum(parsed.num * easeOutExpo(t), parsed.decimals));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ease-out will-change-transform ${
        started ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <p className="text-4xl font-bold tabular-nums tracking-tight text-brand md:text-[44px]">
        {parsed.prefix}
        {display}
        {parsed.suffix}
      </p>
      <p className="mt-2 text-sm text-slate-600">{label}</p>
    </div>
  );
}
