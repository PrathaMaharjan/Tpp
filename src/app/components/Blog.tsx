'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import BgMotif from './BgMotif';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogPost {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Not Just For Kids: Important Vaccines Every Adult Needs',
    description:
      'Vaccines aren’t just for kids. Learn which essential immunizations you need as an adult to protect your health, and how our primary care team in Texas can help you stay up to date.',
    imageUrl:
      'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=600',
    slug: '/blog/important-vaccines-every-adult-needs',
  },
  {
    id: 'post-2',
    title: 'Why A Sports Physical Is Important?',
    description:
      'A sports physical is far more than a checklist for school athletics. From screening for hidden cardiovascular risks to evaluating joint stability, learn why this annual exam is vital.',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
    slug: '/blog/why-a-sports-physical-is-important',
  },
  {
    id: 'post-3',
    title:
      'Are You Traveling This Summer? Make Sure Your Kids Are Up-To-Date On Vaccines',
    description:
      'Planning a summer getaway? Whether traveling internationally or crossing state lines, ensuring your children are up to date on immunizations is your best defense.',
    imageUrl:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=600',
    slug: '/blog/summer-travel-kids-vaccines-up-to-date',
  },
];

export default function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
      ).fromTo(
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
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative pt-20 pb-6 bg-white overflow-hidden font-sans">
      <BgMotif variant="cross" side="left" position="top" opacity={0.045} />
      <BgMotif variant="stethoscope" side="right" position="bottom" opacity={0.04} />

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="blog-header text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
            Insights &amp; Articles
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Latest Health News
          </h2>
          <div className="w-12 h-0.5 bg-brand-mid mx-auto rounded-full mt-2" />
        </div>

        {/* 3-Column Cards Grid */}
        <div className="blog-grid grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="blog-card reveal-card group relative flex flex-col"
            >
              {/* Image — shrinks on hover, pulling the title upward */}
              <Link
                href={post.slug}
                className="reveal-media relative block w-full h-[240px] shrink-0 overflow-hidden rounded-2xl bg-slate-100 transition-all duration-500 ease-in-out"
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Arrow badge, revealed on hover */}
                <span className="reveal-arrow absolute bottom-3 right-4 grid place-items-center w-10 h-10 rounded-full bg-white text-brand shadow-md transition-all duration-500 ease-in-out">
                  <ArrowUpRight size={18} />
                </span>
              </Link>

              {/* Content */}
              <div className="reveal-content pt-5">
                <Link href={post.slug}>
                  <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-brand transition-colors duration-300 line-clamp-3">
                    {post.title}
                  </h3>
                </Link>

                {/* Description — expands on hover via a collapsing grid
                    row, so it adapts to any title/description length.
                    On touch devices it simply stays visible. */}
                <div className="reveal-body">
                  <p className="reveal-body-inner text-sm text-slate-500 leading-relaxed line-clamp-4 font-normal">
                    {post.description}
                  </p>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}