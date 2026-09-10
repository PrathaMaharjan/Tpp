'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getPublicBlogPosts, type BlogPost } from '../lib/api';
import { CardGridSkeleton } from './Skeleton';

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

/**
 * Extracts and formats the excerpt from the CMS Meta tab (post.excerpt)
 * or falls back to extracting the first paragraph from the article content.
 */
function parseExcerpt(excerpt?: string | null, content?: string | null, maxLength: number = 145): string {
  // 1. If explicit excerpt is saved in CMS Meta tab, use it
  if (excerpt && typeof excerpt === 'string' && excerpt.trim()) {
    const clean = excerpt
      .replace(/<[^>]*>/g, '') // Strip HTML tags if any
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();
    if (clean.length > maxLength) {
      return clean.slice(0, maxLength).trim() + '...';
    }
    return clean;
  }

  // 2. If Meta excerpt was not provided, extract the first paragraph from Editor.js content
  if (content) {
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      if (Array.isArray(parsed?.blocks)) {
        // Prioritize paragraph blocks over headers
        const pBlock = parsed.blocks.find(
          (b: any) => b.type === 'paragraph' && typeof b.data?.text === 'string' && b.data.text.trim()
        );
        const targetBlock = pBlock || parsed.blocks[0];

        if (targetBlock?.data?.text) {
          const text = targetBlock.data.text
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();
          if (text) {
            return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text;
          }
        }
      }
    } catch {
      // Content is raw text / HTML string
      const text = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      if (text) {
        return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text;
      }
    }
  }

  // 3. Fallback if post is empty
  return 'Read our latest medical insights, health advice, and clinical news from Texas Primary & Pediatric Care.';
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
          // Filter to published posts if status is present
          const published = Array.isArray(data)
            ? data.filter((p: any) => !p.status || p.status === 'published')
            : [];
          setPosts(published);
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
    <section ref={sectionRef} className="pt-12 pb-24 bg-white font-sans">
      <div className="max-w-[1240px] mx-auto px-6 space-y-16">
        
        {/* Header: heading left, "view all" right, so the CTA sits with
            the section title instead of orphaned under the grid. */}
        <div className="blog-header flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
              Insights &amp; Articles
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
              Latest Health News
            </h2>
            <div className="h-0.5 w-12 rounded-full bg-brand-mid" />
          </div>

          {!loading && posts.length > 0 && (
            <Link
              href="/blog"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-200/80 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-xs transition-all hover:border-brand hover:text-brand hover:shadow-md sm:self-auto"
            >
              <span>Explore All Articles</span>
              <ArrowUpRight
                size={16}
                className="text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>

        {/* 3-Column Cards Grid */}
        {loading ? (
          <CardGridSkeleton count={3} className="blog-grid grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch" />
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
              
              // Reads post.excerpt (set in the CMS Meta tab)
              const excerpt = parseExcerpt(post.excerpt || (post as any).meta?.excerpt, post.content, 140);
              const postDate = formatDate(post.publishedAt || post.createdAt);
              const postUrl = `/blog/${post.slug}`;

              return (
                <article
                  key={post.id}
                  className="blog-card reveal-card group flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
                >
                  <div>
                    {/* Cover Image */}
                    <Link
                      href={postUrl}
                      className="reveal-media block relative overflow-hidden rounded-2xl bg-slate-100"
                    >
                      <img
                        src={cover}
                        alt={post.title}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = FALLBACK_IMAGE;
                        }}
                      />

                      <span className="reveal-arrow absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white text-brand shadow-md">
                        <ArrowUpRight size={18} />
                      </span>
                    </Link>

                    {/* Content & Excerpt */}
                    <div className="pt-5 space-y-3">
                      <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-brand transition-colors line-clamp-2">
                        <Link href={postUrl}>{post.title}</Link>
                      </h3>

                      {/* Excerpt from the CMS Meta tab */}
                      <div className="reveal-body">
                        <p className="reveal-body-inner text-sm text-slate-600 leading-relaxed line-clamp-3 font-normal">
                          {excerpt}
                        </p>
                      </div>

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
        )}

      </div>
    </section>
  );
}
