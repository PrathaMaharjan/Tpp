import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MessageSquare, Phone } from 'lucide-react';

interface CtaSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Primary action; defaults to booking. */
  primary?: { label: string; href: string };
  /** Optional secondary action. */
  secondary?: { label: string; href: string };
}

export default function CtaSection({
  eyebrow,
  title,
  description,
 primary = { label: 'Book Appointment', href: 'https://healow.com/apps/practice/texas-primary-pediatric-care-pllc-irving-tx-22218?v=2&t=1' },
  secondary,
}: CtaSectionProps) {
  return (
    <section className="w-full flex justify-center lg:pt-40 lg:pb-16">
      <div className="w-full lg:pt-12 overflow-hidden lg:overflow-visible">
        <div className="relative w-full bg-surface-2 rounded-[24px] px-6 py-10 md:px-12 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-0">
          {/* Copy */}
          <div className="flex-2 grid gap-3 md:pr-6">
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
                {eyebrow}
              </span>
            )}

            <h2 className="font-display text-2xl md:text-[28px] xl:text-[32px] font-bold tracking-tight text-slate-900 leading-snug lg:w-[80%]">
              {title}
            </h2>

            {description && (
              <p className="text-slate-600 text-base md:text-[18px] leading-relaxed w-[90%] lg:w-[75%]">
                {description}
              </p>
            )}

            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={primary.href}
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm md:text-base font-semibold py-[14px] px-[20px] rounded-lg w-full sm:w-[240px] shadow-md transition duration-300 hover:-translate-y-0.5"
              >
                <span>{primary.label}</span>
                <ArrowUpRight size={18} />
              </Link>

              {secondary &&
                (() => {
                  // tel:/mailto: must be a plain anchor — next/link is for
                  // in-app routes — and the icon should match the action.
                  const isTel = secondary.href.startsWith('tel:');
                  const isExternal = isTel || secondary.href.startsWith('mailto:');
                  const Icon = isTel ? Phone : MessageSquare;
                  const cls =
                    'inline-flex items-center justify-center gap-2 border border-brand/30 bg-white/70 hover:bg-white text-brand text-sm md:text-base font-semibold py-[14px] px-[20px] rounded-lg transition duration-300 hover:-translate-y-0.5';

                  return isExternal ? (
                    <a href={secondary.href} className={cls}>
                      <Icon size={17} />
                      <span>{secondary.label}</span>
                    </a>
                  ) : (
                    <Link href={secondary.href} className={cls}>
                      <Icon size={17} />
                      <span>{secondary.label}</span>
                    </Link>
                  );
                })()}
            </div>
          </div>

          {/* Tilted breakout card */}
          <div className="flex-1 flex justify-center md:justify-end relative w-full md:w-auto">
            <Image
              src="/images/tpp-care-card.webp"
              alt="TPP Care — private health insurance, dental protection, Medicare specialists, and primary care"
              width={900}
              height={1022}
              sizes="(min-width: 1280px) 420px, (min-width: 1024px) 380px, (min-width: 768px) 300px, 320px"
              className="max-w-none w-[300px] md:w-[290px] lg:w-[380px] xl:w-[420px] h-auto object-contain drop-shadow-2xl lg:absolute lg:right-[-16px] xl:right-[-8px] lg:top-[-233px] xl:top-[-263px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
