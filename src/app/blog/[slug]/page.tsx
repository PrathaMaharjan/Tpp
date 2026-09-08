'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getBlogPostBySlug, getPublicBlogPosts, type BlogPost } from '../../lib/api';
import {
  resolveImageUrl,
  formatBlogDate,
  calculateReadTime,
  parseRichBlogContent,
  parseExcerpt,
  FALLBACK_BLOG_IMAGE,
} from '../../lib/blogUtils';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Share2,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
  ArrowUpRight,
  CalendarPlus,
  Phone,
} from 'lucide-react';

export default function BlogPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
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

      {/* Top Banner / Breadcrumbs Wrapper */}
      <div className="pt-28 md:pt-36 bg-slate-50/70 border-b border-slate-200/60 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#2596be] transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-400 shrink-0" />
            <Link href="/blog" className="hover:text-[#2596be] transition-colors">
              Blog
            </Link>
            {post && (
              <>
                <ChevronRight size={13} className="text-slate-400 shrink-0" />
                <span className="text-slate-800 font-medium truncate max-w-[280px]">
                  {post.title}
                </span>
              </>
            )}
          </nav>

          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#2596be] transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Back to All Articles
          </Link>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="max-w-3xl mx-auto px-6 py-16 w-full space-y-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-96 bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>
        </div>
      ) : !post ? (
        /* Not Found State */
        <div className="max-w-md mx-auto px-6 py-28 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#eaf4f6] text-[#2596be] flex items-center justify-center mx-auto">
            <BookOpen size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            The article you are looking for might have been moved, unpublished, or does not exist.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2596be] text-white text-xs font-semibold hover:bg-[#1e7c9e] transition-colors"
          >
            <ArrowLeft size={14} />
            Return to Blog
          </Link>
        </div>
      ) : (
        /* Article Body */
        <article className="max-w-4xl mx-auto px-6 py-10 md:py-14 w-full">
          {/* Article Header */}
          <header className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2596be] bg-[#eaf4f6] rounded-full">
                Health &amp; Wellness
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={13} className="text-[#2596be]" />
                {calculateReadTime(post.content)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.18]">
              {post.title}
            </h1>

            {/* Author & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100">
              <div className="flex items-center gap-3">
                {post.authorImage ? (
                  <img
                    src={resolveImageUrl(post.authorImage)}
                    alt={post.authorName || 'Author'}
                    crossOrigin="anonymous"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#4fa1b0]/25"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {post.authorName || 'Medical Staff Contributor'}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatBlogDate(post.publishedAt || post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share actions */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">
                  Share:
                </span>
                <button
                  onClick={() => handleShare('twitter')}
                  title="Share on X (Twitter)"
                  className="w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-[#2596be] hover:border-[#2596be] transition-colors"
                >
                  <span className="text-xs font-bold">𝕏</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  title="Share on Facebook"
                  className="w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-[#2596be] hover:border-[#2596be] transition-colors"
                >
                  <span className="text-xs font-bold">f</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  title="Share on LinkedIn"
                  className="w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-[#2596be] hover:border-[#2596be] transition-colors"
                >
                  <span className="text-xs font-bold">in</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  title="Copy link"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/80 text-xs font-semibold text-slate-600 hover:text-[#2596be] hover:border-[#2596be] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
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
          <div className="max-w-3xl mx-auto pt-2">
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
            <div className="mt-10 p-8 rounded-3xl bg-gradient-to-br from-[#eaf4f6] to-[#d6eff2] border border-[#4fa1b0]/30 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2596be]">
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
                  href="/booking"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2596be] text-white text-xs font-semibold hover:bg-[#1e7c9e] transition-colors shadow-xs"
                >
                  <CalendarPlus size={15} />
                  Book Appointment
                </Link>
                <a
                  href="tel:4694420202"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:text-[#2596be] hover:border-[#2596be] transition-colors"
                >
                  <Phone size={14} />
                  469-442-0202
                </a>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* Related / More Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200/70 py-16 px-6 mt-12">
          <div className="max-w-[1240px] mx-auto space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2596be]">
                  Continue Reading
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Related Health Articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-semibold text-[#2596be] hover:underline flex items-center gap-1"
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
                    className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      <Link
                        href={postUrl}
                        className="block relative overflow-hidden aspect-[16/10] bg-slate-100"
                      >
                        <img
                          src={cover}
                          alt={rPost.title}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            target.src = FALLBACK_BLOG_IMAGE;
                          }}
                        />
                      </Link>

                      <div className="p-6 space-y-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {postDate}
                        </span>
                        <h3 className="text-base font-bold leading-snug text-slate-900 group-hover:text-[#2596be] transition-colors line-clamp-2">
                          <Link href={postUrl}>{rPost.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0">
                      <Link
                        href={postUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2596be] group-hover:text-slate-900 transition-colors"
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