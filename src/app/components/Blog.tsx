'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

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
      'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cb9?auto=format&fit=crop&q=80&w=600',
    slug: '/blog/summer-travel-kids-vaccines-up-to-date',
  },
];

export default function BlogSection() {
  return (
    <section className="py-24 bg-[#e0f2fe] font-sans">
      <div className="max-w-[1240px] mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
            Insights &amp; Articles
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Latest Health News
          </h2>
          <div className="w-12 h-0.5 bg-[#4fa1b0] mx-auto rounded-full mt-2" />
        </div>

        {/* 3-Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div>
                {/* Image Wrapper */}
                <Link href={post.slug} className="block relative overflow-hidden aspect-[16/10] bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </Link>

                {/* Content */}
                <div className="p-7 space-y-3">
                  <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-[#2596be] transition-colors">
                    <Link href={post.slug}>{post.title}</Link>
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-normal">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-7 pb-7 pt-0">
                <Link
                  href={post.slug}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2596be] group-hover:text-slate-900 transition-colors"
                >
                  Read Article
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}