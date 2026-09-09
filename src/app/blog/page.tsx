'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Select from '../components/Select';
import CtaSection from '../components/CtaSection';
import { CardGridSkeleton } from '../components/Skeleton';
import { getPublicBlogPosts, type BlogPost } from '../lib/api';
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
} from 'lucide-react';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await getPublicBlogPosts();
        if (isMounted) {
          setPosts(data);
        }
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter posts by search query
  // The CMS type does not declare categories, but list responses can
  // carry them. Read defensively and hide the filter when absent.
  const categoryOptions = useMemo(() => {
    const names = new Set<string>();
    posts.forEach((p) => {
      const raw = (p as { categories?: unknown }).categories;
      if (Array.isArray(raw)) {
        raw.forEach((c) => {
          const name =
            typeof c === 'string'
              ? c
              : (c as { name?: string } | null)?.name;
          if (name) names.add(name);
        });
      }
    });
    return [
      { value: 'all', label: 'All Categories' },
      ...[...names].sort().map((n) => ({ value: n, label: n })),
    ];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = post.title?.toLowerCase().includes(q) ?? false;
      const excerptMatch = post.excerpt?.toLowerCase().includes(q) ?? false;
      const authorMatch = post.authorName?.toLowerCase().includes(q) ?? false;

      const searchOk = !q || titleMatch || excerptMatch || authorMatch;

      if (activeCategory === 'all') return searchOk;

      const raw = (post as { categories?: unknown }).categories;
      const names = Array.isArray(raw)
        ? raw.map((c) =>
            typeof c === 'string' ? c : (c as { name?: string } | null)?.name
          )
        : [];
      return searchOk && names.includes(activeCategory);
    });
  }, [posts, searchQuery, activeCategory]);

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      {/* Hero Header Section */}
      <section className="relative bg-brand-dark overflow-hidden">
        <div className="pt-32 pb-[37px] md:pt-40 md:pb-[46px]">
          <div className="max-w-[1240px] mx-auto px-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-soft">
              Health Insights &amp; Clinical Updates
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Our <span className="text-brand-soft">Blog</span>
            </h1>

            <p className="text-white/85 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
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
        ) : filteredPosts.length === 0 ? (
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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
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
                Showing {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const cover = resolveImageUrl(post.coverImage);
                const authorPhoto = resolveImageUrl(post.authorImage, '');
                const excerpt = parseExcerpt(post.excerpt, post.content, 140);
                const postDate = formatBlogDate(post.publishedAt || post.createdAt);
                const postUrl = `/blog/${post.slug}`;

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

                        <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-brand transition-colors line-clamp-2">
                          <Link href={postUrl}>{post.title}</Link>
                        </h3>

                        <div className="reveal-body">
                          <p className="reveal-body-inner text-sm text-slate-500 leading-relaxed line-clamp-3 font-normal">
                            {excerpt}
                          </p>
                        </div>

                        {/* Author Row */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            {authorPhoto ? (
                              <img
                                src={authorPhoto}
                                alt={post.authorName || 'Author'}
                                crossOrigin="anonymous"
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
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
                        </div>
                      </div>
                    </div>

                    {/* Card Link Action */}
                    <div className="px-6 pb-6 pt-0 bg-white">
                      <Link
                        href={postUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand group-hover:text-slate-900 transition-colors"
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