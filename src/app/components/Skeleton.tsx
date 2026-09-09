interface ShimmerProps {
  className?: string;
  /** Stagger the sweep so sibling blocks cascade. */
  delay?: number;
}

/** Base shimmer block. Pass sizing/rounding via className. */
export function Shimmer({ className = '', delay = 0 }: ShimmerProps) {
  return (
    <div
      aria-hidden
      className={`skeleton-shimmer ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    />
  );
}

function stagger(i: number, step = 120): number {
  return i * step;
}

/** Generic content card: media block, title lines, footer row. */
export function CardSkeleton({ index = 0 }: { index?: number }) {
  const d = (i: number) => stagger(index * 3 + i);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xs">
      <Shimmer className="aspect-[4/3] w-full" delay={d(0)} />
      <div className="space-y-3 p-5">
        <Shimmer className="h-4 w-1/3 rounded-md" delay={d(1)} />
        <Shimmer className="h-5 w-11/12 rounded-md" delay={d(2)} />
        <Shimmer className="h-5 w-3/4 rounded-md" delay={d(2)} />
        <div className="flex items-center gap-3 pt-2">
          <Shimmer className="h-9 w-9 rounded-full" delay={d(3)} />
          <Shimmer className="h-3.5 w-1/3 rounded-md" delay={d(3)} />
        </div>
      </div>
    </div>
  );
}

/** Tall portrait card matching the doctors carousel (280x400). */
export function DoctorCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div className="relative h-[400px] w-[280px] shrink-0 overflow-hidden rounded-3xl md:w-[300px]">
      <Shimmer className="absolute inset-0" delay={stagger(index)} />
      <div className="absolute inset-x-5 bottom-5 space-y-2.5">
        <Shimmer className="h-5 w-2/3 rounded-md" delay={stagger(index, 120) + 60} />
        <Shimmer className="h-3.5 w-1/2 rounded-md" delay={stagger(index, 120) + 120} />
      </div>
    </div>
  );
}

/** Centered provider card: avatar circle + name + specialty + button. */
export function ProviderSkeleton({ index = 0 }: { index?: number }) {
  const d = (i: number) => stagger(index * 3 + i);
  return (
    <div className="flex h-full flex-col items-center rounded-2xl border border-slate-200/70 bg-white p-6 text-center shadow-xs">
      <Shimmer className="h-32 w-32 rounded-full" delay={d(0)} />
      <Shimmer className="mt-4 h-5 w-2/3 rounded-md" delay={d(1)} />
      <Shimmer className="mt-2 h-3.5 w-1/2 rounded-md" delay={d(2)} />
      <Shimmer className="mt-5 h-10 w-2/3 rounded-xl" delay={d(3)} />
    </div>
  );
}

/** Article reading view: eyebrow, title, meta row, hero, paragraphs. */
export function ArticleSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-16">
      <Shimmer className="h-4 w-28 rounded-full" />
      <Shimmer className="h-9 w-3/4 rounded-lg" delay={80} />
      <Shimmer className="h-9 w-1/2 rounded-lg" delay={140} />
      <div className="flex items-center gap-3 pt-1">
        <Shimmer className="h-10 w-10 rounded-full" delay={200} />
        <Shimmer className="h-3.5 w-40 rounded-md" delay={260} />
      </div>
      <Shimmer className="h-72 rounded-3xl md:h-96" delay={320} />
      <div className="space-y-4 pt-2">
        <Shimmer className="h-4 w-full rounded" delay={400} />
        <Shimmer className="h-4 w-full rounded" delay={460} />
        <Shimmer className="h-4 w-11/12 rounded" delay={520} />
        <Shimmer className="h-4 w-full rounded" delay={580} />
        <Shimmer className="h-4 w-4/6 rounded" delay={640} />
      </div>
    </div>
  );
}

/** Detail page (service / provider): breadcrumbs, title, banner, rows. */
export function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1000px] space-y-5 px-6 pb-24 pt-40 md:px-10">
      <Shimmer className="h-4 w-56 rounded-md" />
      <Shimmer className="h-10 w-2/3 rounded-lg" delay={100} />
      <Shimmer className="h-4 w-1/3 rounded-md" delay={180} />
      <Shimmer className="aspect-[21/9] w-full rounded-[24px]" delay={280} />
      <div className="grid gap-10 pt-4 md:grid-cols-2">
        <div className="space-y-4">
          <Shimmer className="h-4 w-full rounded" delay={380} />
          <Shimmer className="h-4 w-full rounded" delay={440} />
          <Shimmer className="h-4 w-5/6 rounded" delay={500} />
        </div>
        <div className="space-y-4">
          <Shimmer className="h-4 w-full rounded" delay={420} />
          <Shimmer className="h-4 w-4/6 rounded" delay={480} />
          <Shimmer className="h-11 w-48 rounded-xl" delay={560} />
        </div>
      </div>
    </div>
  );
}

/** Responsive grid of card skeletons. */
export function CardGridSkeleton({
  count = 3,
  className = 'grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
