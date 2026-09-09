'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Select from '../components/Select';
import CtaSection from '../components/CtaSection';
import { CardGridSkeleton } from '../components/Skeleton';
import { getPublicBlogPosts, getPublicBlogCategories, type BlogPost } from '../lib/api';
import {
  resolveImageUrl,
  formatBlogDate,
  parseExcerpt,
  FALLBACK_BLOG_IMAGE,
} from '../lib/blogUtils';
import {
  Search,
  Calendar,
  User,
  ArrowUpRight,
  BookOpen,
  RefreshCw,
  Loader2,
} from 'lucide-react';

/**
 * First category name for a post, if any.
 *
 * The CMS blog endpoint is presently returning an error, so the exact
 * shape is unconfirmed; accept both a plain string and a { name } object
 * and fall back to no badge rather than rendering something wrong.
 */
function firstCategory(post: BlogPost): string | null {
  const raw = (post as { categories?: unknown; category?: unknown }).categories
    ?? (post as { category?: unknown }).category;

  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  for (const entry of list) {
    const name =
      typeof entry === 'string' ? entry : (entry as { name?: string } | null)?.name;
    if (name && name.trim()) return name.trim();
  }
  return null;
}

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([{ value: 'all', label: 'All Categories' }]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const firstLoad = useRef(true);

  // Hydrate initial state from the URL once, client-side only.
  // Shareable searches look like /blog?q=teeth&category=oral-health
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') ?? '';
    setSearchQuery(q);
    setDebouncedQuery(q.trim());
    setActiveCategory(params.get('category') ?? 'all');
    setHydrated(true);
  }, []);

  // Debounce typing so we fetch only once the user pauses.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // Category tabs: server list first, merged with any names the CMS
  // attaches inline to posts (defensive — the type omits categories).
  useEffect(() => {
    let on = true;

    async function loadCategories() {
      const merged = new Map<string, string>();
      try {
        const rows = await getPublicBlogCategories();
        rows.forEach((r) => merged.set(r.value, r.label));
      } catch (err) {
        console.error('Failed to load blog categories:', err);
      }
      try {
        const data = await getPublicBlogPosts();
        data.forEach((p) => {
          const raw = (p as { categories?: unknown }).categories;
          if (Array.isArray(raw)) {
            raw.forEach((c) => {
              const name =
                typeof c === 'string'
                  ? c
                  : (c as { name?: string } | null)?.name;
              if (name && ![...merged.values()].includes(name)) {
                merged.set(name, name);
              }
            });
          }
        });
      } catch (err) {
        console.error('Failed to derive blog categories:', err);
      }
      if (on && merged.size > 0) {
        const opts = [...merged.entries()]
          .map(([value, label]) => ({ value, label }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCategoryOptions([{ value: 'all', label: 'All Categories' }, ...opts]);
      }
    }

    loadCategories();
    return () => {
      on = false;
    };
  }, []);

  // Server-side search: every committed query/category hits the CMS,
  // which matches title/slug/excerpt. Stale requests are aborted so a
  // slow earlier keystroke can never overwrite newer results.
  useEffect(() => {
    if (!hydrated) return;
    const ctrl = new AbortController();
    const isFirst = firstLoad.current;

    async function fetchPosts() {
      try {
        if (isFirst) setLoading(true);
        else setSearching(true);
        const data = await getPublicBlogPosts({
          search: debouncedQuery || undefined,
          category: activeCategory,
          signal: ctrl.signal,
        });
        if (!ctrl.signal.aborted) setPosts(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error('Failed to load blog posts:', err);
      } finally {
        if (!ctrl.signal.aborted) {
          setLoading(false);
          setSearching(false);
          firstLoad.current = false;
        }
      }
    }

    fetchPosts();

    // Mirror the committed state into the URL for shareability.
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (activeCategory !== 'all') params.set('category', activeCategory);
    const suffix = params.size ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState(null, '', suffix);

    return () => {
      ctrl.abort();
    };
  }, [hydrated, debouncedQuery, activeCategory]);

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      {/* Hero Header Section */}
      <section className="relative bg-brand-mid overflow-hidden">
        <div className="pt-32 pb-[49px] md:pt-40 md:pb-[61px]">
          <div className="max-w-[1240px] mx-auto px-6 space-y-4">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Our <span className="text-brand-deep">Blog</span>
            </h1>

            <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
              Trusted medical advice, pediatric guidance, and preventive wellness insights written by our physicians and healthcare providers.
            </p>

            {/* Search + category filter, on an offset-shadow bar */}
            <div className="pt-6 text-left">
              <div className="relative">
                {/* Offset brand slab behind the bar */}
                <div
                  aria-hidden
                  className="absolute left-2.5 top-2.5 -z-10 h-full w-full rounded-xl bg-brand-mid"
                />

                <div className="relative z-10 flex flex-col gap-3 rounded-xl border border-hairline bg-white p-3 sm:h-[70px] sm:flex-row sm:items-center sm:gap-4 sm:py-0 sm:pl-5 sm:pr-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Search size={18} className="shrink-0 text-brand" />
                    <input
                      type="text"
                      placeholder="Articles, keywords, health topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                        className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors duration-300 hover:bg-slate-200"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {categoryOptions.length > 1 && (
                    <div className="w-full shrink-0 sm:w-[210px]">
                      <Select
                        value={activeCategory}
                        onChange={setActiveCategory}
                        aria-label="Filter by category"
                        options={categoryOptions}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Section Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[1px] leading-none overflow-hidden pointer-events-none z-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-[50px] md:h-[80px]"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,35 C320,110 720,-15 1080,75 C1260,115 1380,45 1440,30 L1440,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="pt-8 pb-16 md:pt-10 md:pb-20 max-w-[1240px] mx-auto px-6 w-full grow bg-white">
        {loading ? (
          /* Loading Skeletons */
          <CardGridSkeleton count={3} />
        ) : posts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/70 p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 text-brand flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Found</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {searchQuery
                ? `We couldn't find any articles matching "${searchQuery}". Try a different search term.`
                : 'There are currently no published articles. Please check back soon!'}
            </p>
            {(searchQuery || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand-dark transition-colors"
              >
                <RefreshCw size={14} />
                Reset Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="text-base text-slate-600">
                  Explore insights and stay ahead of your family&apos;s health
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                  <span className="text-brand">Health Library:</span> Guidance,
                  Prevention &amp; Care
                </h2>
              </div>
              <span className="shrink-0 text-xs text-slate-500">
                {searching ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin text-brand" />
                    Searching…
                  </span>
                ) : (
                  <>Showing {posts.length} article{posts.length > 1 ? 's' : ''}</>
                )}
              </span>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${searching ? 'opacity-50 pointer-events-none' : ''}`}>
              {posts.map((post) => {
                const cover = resolveImageUrl(post.coverImage);
                const authorPhoto = resolveImageUrl(post.authorImage, '');
                const excerpt = parseExcerpt(post.excerpt, post.content, 140);
                const postDate = formatBlogDate(post.publishedAt || post.createdAt);
                const postUrl = `/blog/${post.slug}`;
                const category = firstCategory(post);

                return (
                  <article
                    key={post.id}
                    className="reveal-card group flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div>
                      {/* Card Thumbnail */}
                      <Link
                        href={postUrl}
                        className="reveal-media block relative overflow-hidden rounded-2xl bg-white"
                      >
                        <img
                          src={cover}
                          alt={post.title}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            target.src = FALLBACK_BLOG_IMAGE;
                          }}
                        />

                        {/* Arrow badge, revealed on hover */}
                        <span className="reveal-arrow absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white text-brand shadow-md">
                          <ArrowUpRight size={18} />
                        </span>
                      </Link>

                      {/* Card Body */}
                      <div className="pt-5 space-y-3">
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar size={12} />
                          <span>{postDate}</span>
                        </div>

                        {category && (
                          <span className="inline-block rounded-md bg-brand px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                            {category}
                          </span>
                        )}

                        <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-brand transition-colors line-clamp-2">
                          <Link href={postUrl}>{post.title}</Link>
                        </h3>

                        <div className="reveal-body">
                          <p className="reveal-body-inner text-sm text-slate-500 leading-relaxed line-clamp-3 font-normal">
                            {excerpt}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Bottom group: author and action sit at the card's
                        foot, so the reveal reserve shows as slack above
                        them rather than a gap under the title. */}
                    <div className="pt-4">
                      <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                        {authorPhoto ? (
                          <img
                            src={authorPhoto}
                            alt={post.authorName || 'Author'}
                            crossOrigin="anonymous"
                            className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <User size={15} className="text-slate-400" />
                        )}
                        <span className="font-medium text-slate-700">
                          {post.authorName || 'Medical Staff'}
                        </span>
                      </div>

                      <Link
                        href={postUrl}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors group-hover:text-slate-900"
                      >
                        Read Article
                        <ArrowUpRight
                          size={15}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Practice Consultation & Booking Call to Action */}
      <div className="max-w-[1400px] mx-auto px-6 pb-4">
        <CtaSection
          title="Have Questions About Your Family's Health?"
          description="Our experienced team of physicians and healthcare specialists are here to provide compassionate, personalized primary and pediatric care."
          primary={{ label: 'Book an Appointment', href: '/booking' }}
          secondary={{ label: 'Call 469-442-0202', href: 'tel:4694420202' }}
        />
      </div>

      <Footer />
    </main>
  );
}