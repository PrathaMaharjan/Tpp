'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TableOfContents from '../../components/TableOfContents';
import Breadcrumbs from '../../components/Breadcrumbs';
import { ArticleSkeleton } from '../../components/Skeleton';
import { getBlogPostBySlug, getPublicBlogPosts, type BlogPost } from '../../lib/api';
import {
  resolveImageUrl,
  formatBlogDate,
  calculateReadTime,
  parseRichBlogContent,
  parseExcerpt,
  FALLBACK_BLOG_IMAGE,
} from '../../lib/blogUtils';
import { ArrowLeft, ArrowRight, User, Copy, Check, BookOpen, ArrowUpRight, CalendarPlus, Phone, Share2 } from 'lucide-react';

export default function BlogPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPostData() {
      if (!slug) return;
      try {
        setLoading(true);
        // Try fetching direct post by slug
        let foundPost = await getBlogPostBySlug(slug);

        // Fallback: search within all public posts if direct slug returned null
        const allPosts = await getPublicBlogPosts();

        if (!foundPost && allPosts.length > 0) {
          foundPost =
            allPosts.find(
              (p) =>
                p.slug?.toLowerCase() === slug.toLowerCase() ||
                p.id === slug
            ) || null;
        }

        if (isMounted) {
          setPost(foundPost);
          // Set related posts excluding the current one
          if (foundPost && allPosts.length > 0) {
            setRelatedPosts(allPosts.filter((p) => p.id !== foundPost?.id).slice(0, 3));
          } else {
            setRelatedPosts(allPosts.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPostData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const contentHtml = useMemo(() => {
    return parseRichBlogContent(post?.content);
  }, [post?.content]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    if (typeof window === 'undefined' || !post) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);

    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      {loading ? (
        <ArticleSkeleton />
      ) : !post ? (
        /* Not Found State */
        <div className="max-w-md mx-auto px-6 py-28 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-surface-2 text-brand flex items-center justify-center mx-auto">
            <BookOpen size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            The article you are looking for might have been moved, unpublished, or does not exist.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand-dark transition-colors"
          >
            <ArrowLeft size={14} />
            Return to Blog
          </Link>
        </div>
      ) : (
        /* Article Body */
        <div className="max-w-[1240px] mx-auto px-6 pt-32 md:pt-40 pb-10 md:pb-14 w-full">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
            {/* Sticky table of contents */}
            <aside className="hidden lg:block lg:order-2 lg:w-[280px] lg:shrink-0 lg:sticky lg:top-28 lg:space-y-4">
              <TableOfContents contentRef={contentRef} contentKey={contentHtml} />

              {/* Share sits under the TOC: it is a secondary action, and
                  keeping it in the rail means it stays reachable while
                  reading rather than only at the top of the article. */}
              <div className="rounded-2xl border border-hairline bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                    Share this article
                  </p>
                  <Share2 size={14} className="text-slate-400" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    title="Share on X (Twitter)"
                    aria-label="Share on X"
                    className="grid h-9 w-9 place-items-center rounded-full border border-slate-200/80 text-slate-600 transition-colors duration-300 hover:border-brand hover:text-brand"
                  >
                    <span className="text-xs font-bold">𝕏</span>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    title="Share on Facebook"
                    aria-label="Share on Facebook"
                    className="grid h-9 w-9 place-items-center rounded-full border border-slate-200/80 text-slate-600 transition-colors duration-300 hover:border-brand hover:text-brand"
                  >
                    <span className="text-xs font-bold">f</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    title="Share on LinkedIn"
                    aria-label="Share on LinkedIn"
                    className="grid h-9 w-9 place-items-center rounded-full border border-slate-200/80 text-slate-600 transition-colors duration-300 hover:border-brand hover:text-brand"
                  >
                    <span className="text-xs font-bold">in</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    title="Copy link"
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors duration-300 hover:border-brand hover:text-brand"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-500" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </aside>

            <article className="min-w-0 flex-1 lg:order-1">
          {/* Article Header */}
          {/* Breadcrumb + back, inside the content column */}
          <Breadcrumbs
            className="mb-5"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              ...(post ? [{ label: post.title }] : []),
            ]}
          />

          <header className="space-y-5">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.18]">
              {post.title}
            </h1>

            {/* Meta line: category, date, read time */}
            <p className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">Blog</span>
              <span className="text-slate-300">•</span>
              <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
              <span className="text-slate-300">•</span>
              <span>{calculateReadTime(post.content)}</span>
            </p>

            {/* Author byline */}
            <div className="flex items-center gap-3 pt-1">
              {post.authorImage ? (
                <img
                  src={resolveImageUrl(post.authorImage)}
                  alt={post.authorName || 'Author'}
                  crossOrigin="anonymous"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-mid/25"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-400">
                  <User size={18} />
                </div>
              )}
              <span className="text-sm font-semibold text-slate-800">
                By {post.authorName || 'Medical Staff Contributor'}
              </span>
            </div>
          </header>

          {/* Cover Hero Image */}
          <div className="my-8 md:my-10 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[16/10] md:aspect-[16/9] max-h-[520px] bg-slate-100">
            <img
              src={resolveImageUrl(post.coverImage)}
              alt={post.title}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = FALLBACK_BLOG_IMAGE;
              }}
            />
          </div>

          {/* Article Main Text / Rich Content */}
          {/* Mobile TOC — inline, above the content */}
          <details className="lg:hidden mt-8 rounded-2xl border border-hairline bg-white">
            <summary className="cursor-pointer list-none px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-brand">
              On this page
            </summary>
            <div className="px-2 pb-2">
              <TableOfContents contentRef={contentRef} contentKey={contentHtml} />
            </div>
          </details>

          <div className="pt-2" ref={contentRef}>
            {contentHtml ? (
              <div
                className="article-content leading-relaxed text-slate-700 font-normal"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <p className="text-slate-600 text-base leading-relaxed">
                {post.excerpt || 'No content provided for this article.'}
              </p>
            )}


            {/* Next Steps / In-Clinic Consultation Box */}
            <div className="mt-10 p-8 rounded-3xl bg-gradient-to-br from-surface-2 to-surface-2 border border-brand-mid/30 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Need Medical Care?
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Schedule a Visit with Our Physicians
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Whether you need a routine annual physical, pediatric wellness exam, or consultation regarding your symptoms, our clinics in Irving and Celina are here for you.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="https://healow.com/apps/practice/texas-primary-pediatric-care-pllc-irving-tx-22218?v=2&t=1 "
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand-dark transition-colors shadow-xs"
                >
                  <CalendarPlus size={15} />
                  Book Appointment
                </Link>
                <a
                  href="tel:4694420202"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:text-brand hover:border-brand transition-colors"
                >
                  <Phone size={14} />
                  469-442-0202
                </a>
              </div>
            </div>
          </div>
            </article>
          </div>
        </div>
      )}

      {/* Related / More Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200/70 py-16 px-6 mt-12">
          <div className="max-w-[1240px] mx-auto space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand">
                  Continue Reading
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Related Health Articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rPost) => {
                const cover = resolveImageUrl(rPost.coverImage);
                const excerpt = parseExcerpt(rPost.excerpt, rPost.content, 120);
                const postDate = formatBlogDate(rPost.publishedAt || rPost.createdAt);
                const postUrl = `/blog/${rPost.slug}`;

                return (
                  <article
                    key={rPost.id}
                    className="reveal-card reveal-card-sm group flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div>
                      <Link
                        href={postUrl}
                        className="reveal-media block relative overflow-hidden rounded-2xl bg-slate-100"
                      >
                        <img
                          src={cover}
                          alt={rPost.title}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            target.src = FALLBACK_BLOG_IMAGE;
                          }}
                        />

                        <span className="reveal-arrow absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-brand shadow-md">
                          <ArrowUpRight size={16} />
                        </span>
                      </Link>

                      <div className="pt-4 space-y-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {postDate}
                        </span>
                        <h3 className="text-base font-bold leading-snug text-slate-900 group-hover:text-brand transition-colors line-clamp-2">
                          <Link href={postUrl}>{rPost.title}</Link>
                        </h3>
                        <div className="reveal-body">
                          <p className="reveal-body-inner text-xs text-slate-500 line-clamp-3 leading-relaxed">
                            {excerpt}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <Link
                        href={postUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand group-hover:text-slate-900 transition-colors"
                      >
                        Read Article
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}