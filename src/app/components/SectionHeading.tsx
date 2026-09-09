interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={`space-y-3 ${isCentered ? 'text-center mx-auto max-w-xl' : ''} ${className}`}
    >
      {eyebrow && (
        <span className="block text-xs font-bold uppercase tracking-[0.25em] text-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      {description && (
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
