'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
  HeartPulse,
} from 'lucide-react';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = post.title?.toLowerCase().includes(q) ?? false;
      const excerptMatch = post.excerpt?.toLowerCase().includes(q) ?? false;
      const authorMatch = post.authorName?.toLowerCase().includes(q) ?? false;

      return !q || titleMatch || excerptMatch || authorMatch;
    });
  }, [posts, searchQuery]);

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      {/* Hero Header Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="max-w-4xl mx-auto px-6 space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
              Health Insights &amp; Clinical Updates
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Texas Primary &amp; Pediatric Care Blog
            </h1>

            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Trusted medical advice, pediatric guidance, and preventive wellness insights written by our physicians and healthcare providers.
            </p>

            {/* Interactive Search Bar */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative flex items-center shadow-md rounded-2xl bg-white border border-slate-200/80 p-1.5 focus-within:ring-2 focus-within:ring-[#2596be]/30 focus-within:border-[#2596be] transition-all">
                <Search size={18} className="text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search articles, symptoms, or health topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mr-2 text-xs font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
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
      <section className="py-12 md:py-16 max-w-[1240px] mx-auto px-6 w-full grow bg-white">
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            <div className="h-80 bg-slate-200/60 rounded-2xl" />
            <div className="h-80 bg-slate-200/60 rounded-2xl" />
            <div className="h-80 bg-slate-200/60 rounded-2xl" />
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/70 p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#eaf4f6] text-[#2596be] flex items-center justify-center mx-auto mb-4">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2596be] text-white text-xs font-semibold hover:bg-[#1f7da0] transition-colors"
              >
                <RefreshCw size={14} />
                Reset Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Health Articles
              </h3>
              <span className="text-xs text-slate-500">
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
                    className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div>
                      {/* Card Thumbnail */}
                      <Link
                        href={postUrl}
                        className="block relative overflow-hidden aspect-[16/10] bg-white"
                      >
                        <img
                          src={cover}
                          alt={post.title}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            target.src = FALLBACK_BLOG_IMAGE;
                          }}
                        />
                      </Link>

                      {/* Card Body */}
                      <div className="p-6 space-y-3 bg-white">
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar size={12} />
                          <span>{postDate}</span>
                        </div>

                        <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-[#2596be] transition-colors line-clamp-2">
                          <Link href={postUrl}>{post.title}</Link>
                        </h3>

                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-normal">
                          {excerpt}
                        </p>

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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2596be] group-hover:text-slate-900 transition-colors"
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
      <section className="bg-gradient-to-r from-[#2596be] via-[#3a99b4] to-[#4fa1b0] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto text-white">
            <HeartPulse size={26} />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Have Questions About Your Family&apos;s Health?
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Our experienced team of physicians and healthcare specialists are here to provide compassionate, personalized primary and pediatric care.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/booking"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#2596be] rounded-xl font-bold text-sm shadow-md hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.99]"
            >
              Book an Appointment
            </Link>
            <a
              href="tel:4694420202"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl font-bold text-sm backdrop-blur-sm transition-all text-center"
            >
              Call 469-442-0202
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}