'use client';

import { useEffect, useRef, useState } from 'react';
import { List, X } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  /** Container holding the rendered article HTML. */
  contentRef: React.RefObject<HTMLElement | null>;
  /** Re-scan when this changes (e.g. the post HTML). */
  contentKey?: string;
  /** Pixels to offset for the fixed header when scrolling to a heading. */
  scrollOffset?: number;
  onNavigate?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

function slugify(text: string, index: number) {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  return `${slug || 'heading'}-${index}`;
}

/**
 * Table of contents with scroll-spy, built from the rendered article.
 *
 * Uses IntersectionObserver rather than a MutationObserver + toc library:
 * fewer moving parts, no dependency, and a single TOC instance that CSS
 * repositions, so resizing across breakpoints can't leave it orphaned.
 */
export default function TableOfContents({
  contentRef,
  contentKey,
  scrollOffset = 100,
  onNavigate,
  showCloseButton,
  onClose,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const listRef = useRef<HTMLOListElement>(null);

  // Collect headings, assigning ids where the CMS output lacks them.
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>('h2, h3')
    ).filter((el) => (el.textContent || '').trim().length > 0);

    const collected: Heading[] = nodes.map((el, i) => {
      if (!el.id) el.id = slugify(el.textContent || '', i);
      // Keep the fixed header from covering the target on anchor jumps.
      el.style.scrollMarginTop = `${scrollOffset}px`;
      return {
        id: el.id,
        text: (el.textContent || '').trim(),
        level: el.tagName === 'H3' ? 3 : 2,
      };
    });

    setHeadings(collected);
  }, [contentRef, contentKey, scrollOffset]);

  // Scroll-spy: the last heading to cross the offset line wins.
  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      () => {
        const line = scrollOffset + 24;
        let current = elements[0];
        for (const el of elements) {
          if (el.getBoundingClientRect().top <= line) current = el;
          else break;
        }
        setActiveId(current.id);
      },
      {
        rootMargin: `-${scrollOffset}px 0px -70% 0px`,
        threshold: [0, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, scrollOffset]);

  // Keep the active item visible inside the TOC's own scroll area.
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const link = listRef.current.querySelector<HTMLElement>(
      `[data-toc-id="${activeId}"]`
    );
    link?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Reflect the jump in the URL without adding a history entry.
    window.history.replaceState(null, '', `#${id}`);
    onNavigate?.();
  };

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="w-full rounded-2xl border border-hairline bg-white p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">
          <List size={14} className="shrink-0" />
          On this page
        </p>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            aria-label="Close table of contents"
            className="grid h-7 w-7 place-items-center rounded-full text-slate-400 transition-colors duration-300 hover:bg-surface-2 hover:text-slate-700"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="mb-3 h-px w-full bg-slate-200" />

      <ol
        ref={listRef}
        className="flex max-h-[calc(100vh-260px)] flex-col gap-1 overflow-y-auto pr-1 text-sm"
      >
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${h.id}`}
                data-toc-id={h.id}
                onClick={(e) => go(e, h.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`block border-l-2 py-1.5 pl-3 leading-snug transition-colors duration-300 ${
                  isActive
                    ? 'border-brand font-semibold text-brand'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
                } ${h.level === 3 ? 'text-[13px]' : ''}`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
