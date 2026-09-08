'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getPublicBlogPosts, type BlogPost } from '../lib/api';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=800';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';

function resolveImageUrl(url?: string | null, fallback: string = FALLBACK_IMAGE): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanBase = CMS_URL.replace(/\/$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

function parseExcerpt(excerpt?: string | null, content?: string | null): string {
  if (excerpt && excerpt.trim()) return excerpt.trim();
  if (!content) return 'Read our latest medical insights, health advice, and clinical news.';
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed?.blocks)) {
      for (const b of parsed.blocks) {
        if (typeof b.data?.text === 'string' && b.data.text.trim()) {
          return b.data.text.replace(/<[^>]*>/g, '').trim();
        }
      }
    }
  } catch {
    return content.replace(/<[^>]*>/g, '').trim();
  }
  return 'Read our latest medical insights, health advice, and clinical news.';
}

function formatDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

export default function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch published blog posts from CMS
  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        setLoading(true);
        const data = await getPublicBlogPosts();
        if (isMounted) {
          setPosts(data);
        }
      } catch (err) {
        console.error('Failed to load blog posts from CMS:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP Animations
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 88%',
          once: true,
        },
      });

      tl.fromTo(
        '.blog-header',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }
      );

      if (!loading && posts.length > 0) {
        tl.fromTo(
          '.blog-card',
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            clearProps: 'all',
          },
          '-=0.3'
        );
      }
    },
    { scope: sectionRef, dependencies: [loading, posts.length] }
  );

  return (
    <section ref={sectionRef} className="py-24 bg-[#e0f2fe] font-sans">
      <div className="max-w-[1240px] mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="blog-header text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
            Insights &amp; Articles
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Latest Health News
          </h2>
          <div className="w-12 h-0.5 bg-[#4fa1b0] mx-auto rounded-full mt-2" />
        </div>

        {/* 3-Column Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            Loading latest articles...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm bg-white/70 rounded-2xl p-8 max-w-md mx-auto">
            No published articles at this time. Check back soon!
          </div>
        ) : (
          <div className="blog-grid grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {posts.slice(0, 3).map((post) => {
              const rawCover = post.coverImage || (post as any).cover_image || (post as any).imageUrl;
              const cover = resolveImageUrl(rawCover, FALLBACK_IMAGE);
              const authorPhoto = resolveImageUrl(post.authorImage || (post as any).author_image, '');
              const excerpt = parseExcerpt(post.excerpt, post.content);
              const postDate = formatDate(post.publishedAt || post.createdAt);
              const postUrl = `/blog/${post.slug}`;

              return (
                <article
                  key={post.id}
                  className="blog-card group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div>
                    {/* Cover Image Wrapper */}
                    <Link
                      href={postUrl}
                      className="block relative overflow-hidden aspect-[16/10] bg-slate-100"
                    >
                      <img
                        src={cover}
                        alt={post.title}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = FALLBACK_IMAGE;
                        }}
                      />
                    </Link>

                    {/* Content */}
                    <div className="p-7 space-y-3">
                      <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-[#2596be] transition-colors line-clamp-2">
                        <Link href={postUrl}>{post.title}</Link>
                      </h3>

                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-normal">
                        {excerpt}
                      </p>

                      {/* Author & Date Bar */}
                      {(post.authorName || postDate) && (
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                          {/* Author */}
                          <div className="flex items-center gap-2">
                            {authorPhoto ? (
                              <img
                                src={authorPhoto}
                                alt={post.authorName || 'Author'}
                                crossOrigin="anonymous"
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                                onError={(e) => {
                                  // Hide avatar if image broken
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <User size={14} className="text-slate-400" />
                            )}
                            <span className="font-medium text-slate-700">
                              {post.authorName || 'Medical Staff'}
                            </span>
                          </div>

                          {/* Published Date */}
                          {postDate && (
                            <div className="flex items-center gap-1">
                              <Calendar size={13} />
                              <span>{postDate}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="px-7 pb-7 pt-0">
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
        )}

        {/* View All Articles CTA */}
        {!loading && posts.length > 0 && (
          <div className="text-center pt-2">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-200/80 text-sm font-semibold text-slate-800 hover:text-[#2596be] hover:border-[#2596be] shadow-xs hover:shadow-md transition-all group"
            >
              <span>Explore All Health Articles</span>
              <ArrowUpRight
                size={16}
                className="text-[#2596be] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
