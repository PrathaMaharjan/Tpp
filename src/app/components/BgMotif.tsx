type MotifVariant = 'cross' | 'stethoscope' | 'family';

interface BgMotifProps {
  variant: MotifVariant;
  /** Which edge the motif bleeds off. */
  side: 'left' | 'right';
  /** Vertical placement within the section. */
  position?: 'top' | 'center' | 'bottom';
  /** Tailwind size classes; defaults to a large decorative scale. */
  size?: string;
  /** Opacity, 0–1. Applied inline: a dynamic Tailwind class would not compile. */
  opacity?: number;
  /** 'dark' tints with brand teal (default, for light sections);
   *  'light' tints white, for use on dark backgrounds. */
  tone?: 'dark' | 'light';
}

const sideClasses = {
  left: '-left-16 md:-left-24',
  right: '-right-16 md:-right-24',
} as const;

/**
 * Anchored from the TOP with fixed offsets — never `bottom`, and never
 * a percentage. Sections containing hover-expanding cards change height,
 * and anything measured from the bottom (or as a % of height) visibly
 * slides when that happens. Fixed top offsets are immune.
 */
const positionClasses = {
  top: 'top-0 md:-top-12',
  center: 'top-[220px] md:top-[260px]',
  bottom: 'top-[420px] md:top-[520px]',
} as const;

/**
 * Decorative medical motif that bleeds off a section edge.
 *
 * Inline SVG rather than an image so it costs no bytes, inherits the
 * brand teal via currentColor, and stays crisp at any size. The parent
 * section needs `relative overflow-hidden`, and its content needs a
 * stacking context above this (e.g. `relative z-10`).
 */
export default function BgMotif({
  variant,
  side,
  position = 'center',
  size = 'w-[280px] h-[280px] md:w-[420px] md:h-[420px]',
  opacity = 0.05,
  tone = 'dark',
}: BgMotifProps) {
  return (
    <div
      aria-hidden
      style={{ opacity }}
      className={`pointer-events-none absolute z-0 select-none transition-none ${
        tone === 'light' ? 'text-white' : 'text-brand'
      } ${sideClasses[side]} ${positionClasses[position]} ${size}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {variant === 'cross' && (
          <path
            d="M78 20h44a8 8 0 0 1 8 8v42h42a8 8 0 0 1 8 8v44a8 8 0 0 1-8 8h-42v42a8 8 0 0 1-8 8H78a8 8 0 0 1-8-8v-42H28a8 8 0 0 1-8-8V78a8 8 0 0 1 8-8h42V28a8 8 0 0 1 8-8Z"
            fill="currentColor"
          />
        )}

        {variant === 'stethoscope' && (
          <g
            stroke="currentColor"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="58" cy="38" r="15" fill="currentColor" stroke="none" />
            <circle cx="112" cy="38" r="15" fill="currentColor" stroke="none" />
            <path d="M58 53v28a27 27 0 0 0 54 0V53" />
            <path d="M85 108v22a34 34 0 0 0 68 0v-14" />
            <circle cx="153" cy="98" r="20" />
            <circle cx="153" cy="98" r="7" fill="currentColor" stroke="none" />
          </g>
        )}

        {variant === 'family' && (
          <g fill="currentColor">
            {/* adult left */}
            <circle cx="72" cy="46" r="17" />
            <path d="M72 68c-14 0-22 9-22 22v40a6 6 0 0 0 12 0v-26h4v54a7 7 0 0 0 14 0v-54h4v26a6 6 0 0 0 12 0V90c0-13-8-22-22-22Z" />
            {/* adult right */}
            <circle cx="128" cy="46" r="17" />
            <path d="M128 68c-13 0-21 8-24 21l-8 32a6 6 0 0 0 11 3l7-25v25l-8 32a7 7 0 0 0 13 3l9-30 9 30a7 7 0 0 0 13-3l-8-32V99l7 25a6 6 0 0 0 11-3l-8-32c-3-13-11-21-24-21Z" />
            {/* child */}
            <circle cx="34" cy="104" r="12" />
            <path d="M34 120c-10 0-16 6-16 16v26a5 5 0 0 0 10 0v-16h2v36a5 5 0 0 0 10 0v-36h2v16a5 5 0 0 0 10 0v-26c0-10-6-16-18-16Z" />
          </g>
        )}
      </svg>
    </div>
  );
}
