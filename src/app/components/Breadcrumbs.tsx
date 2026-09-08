import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  /** Omit on the final crumb — the current page isn't a link. */
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Breadcrumb trail with BreadcrumbList structured data.
 *
 * The trailing item is rendered as plain text (with aria-current) since
 * linking to the page you're already on is a needless tab stop.
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  // Relative paths: the project has no canonical site URL configured
  // (no metadataBase / NEXT_PUBLIC_SITE_URL), and a wrong absolute URL
  // is worse for SEO than a relative one. Set metadataBase in
  // app/layout.tsx and these can become absolute.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs sm:text-[13px]">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;

            return (
              <li key={`${item.label}-${i}`} className="flex items-center gap-x-1.5">
                {i > 0 && (
                  <ChevronRight
                    size={13}
                    className="shrink-0 text-slate-400"
                    aria-hidden
                  />
                )}

                {isLast || !item.href ? (
                  <span
                    aria-current="page"
                    className="font-semibold text-slate-700 line-clamp-1"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-slate-500 hover:text-brand transition-colors duration-300"
                  >
                    {i === 0 && <Home size={13} className="shrink-0" aria-hidden />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
