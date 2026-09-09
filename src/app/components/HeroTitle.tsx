interface HeroTitleProps {
  text: string;
  accentClassName?: string;
}

/**
 * Hero heading with the last word in the accent color,
 * e.g. "Meet Our Providers" (Providers in deep navy).
 * Used for CMS-driven titles that can't be split statically.
 */
export default function HeroTitle({
  text,
  accentClassName = 'text-brand-deep',
}: HeroTitleProps) {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return <>{text}</>;
  const last = words.pop();
  return (
    <>
      {words.join(' ')}{' '}
      <span className={accentClassName}>{last}</span>
    </>
  );
}
