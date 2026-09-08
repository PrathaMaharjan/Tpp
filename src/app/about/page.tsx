'use client';

import { useEffect, useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Target, Compass, Sparkles, CheckCircle2, Award, Users, Heart } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
}

interface FeatureItem {
  title: string;
  description: string;
}

interface AboutData {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  story?: string | null;
  mission?: string | null;
  vision?: string | null;
  bannerImage?: string | null;
  secondaryImage?: string | null;
  stats?: StatItem[] | null;
  features?: FeatureItem[] | null;
}

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';
const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG || process.env.NEXT_PUBLIC_TENANT_SLUG || 'tpp';

// Helper to resolve Cloudinary full URLs vs local CMS uploads
function resolveImageUrl(url?: string | null, fallback: string = ''): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanBase = CMS_URL.replace(/\/$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

import { parseEditorJs } from '../lib/editorParser';

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAboutData() {
      try {
        const res = await fetch(`${CMS_URL}/api/${SITE_SLUG}/about`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json && Object.keys(json).length > 0) {
            setAboutData(json);
          }
        }
      } catch (err) {
        console.warn('Could not fetch About data from CMS, displaying default content:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAboutData();
    return () => {
      isMounted = false;
    };
  }, []);

  const storyHtml = useMemo(() => {
    return parseEditorJs(aboutData?.story);
  }, [aboutData?.story]);

  // Page Titles & Descriptions with Fallback
  const pageBadge = aboutData?.badge || 'About Our Practice';
  const pageTitle = aboutData?.title || 'About Texas Primary & Pediatric Care';
  const pageSubtitle =
    aboutData?.subtitle ||
    'Providing personalized, high-quality healthcare for patients and families across North Texas.';

  const bannerImgUrl = aboutData?.bannerImage ? resolveImageUrl(aboutData.bannerImage) : null;
  const secondaryImgUrl = aboutData?.secondaryImage ? resolveImageUrl(aboutData.secondaryImage) : null;

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />

      {/* Styled Header Title Matching Locations Page */}
      <div className="relative bg-surface-2">
        <div className="pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="max-w-3xl mx-auto px-6 space-y-3 text-center">
            {pageBadge && (
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
                {pageBadge}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              {pageTitle}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              {pageSubtitle}
            </p>
          </div>
        </div>

        {/* Enhanced Curvier Top Section Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[1px] leading-none overflow-hidden pointer-events-none z-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-[60px] md:h-[90px]"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,35 C320,110 720,-15 1080,75 C1260,115 1380,45 1440,30 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Facility Banner Image if provided in CMS */}
      {bannerImgUrl && (
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-16/9 max-h-[480px]">
            <img
              src={bannerImgUrl}
              alt={pageTitle}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Story / Narrative Section */}
      <section className="pb-16 pt-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Dynamic Story Render with Rich Formatting */}
          {storyHtml && (
            <div
              className="space-y-6 text-slate-600 text-base leading-relaxed font-normal
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-5 [&_h3]:mb-2
                [&_strong]:font-semibold [&_strong]:text-slate-900
                [&_blockquote]:border-l-4 [&_blockquote]:border-brand-mid [&_blockquote]:bg-surface [&_blockquote]:p-4 [&_blockquote]:rounded-r-xl [&_blockquote]:my-6
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4"
              dangerouslySetInnerHTML={{ __html: storyHtml }}
            />
          )}

          {/* Secondary Facility Image if available */}
          {secondaryImgUrl && (
            <div className="my-8 rounded-2xl overflow-hidden shadow-md border border-slate-100">
              <img
                src={secondaryImgUrl}
                alt="Clinic facilities"
                className="w-full h-auto object-cover max-h-[380px]"
              />
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Mission & Vision Cards */}
      {(aboutData?.mission || aboutData?.vision) && (
        <section className="py-12 bg-slate-50 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
            {aboutData.mission && (
              <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200/70 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-surface-2 text-brand-mid flex items-center justify-center mb-5">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {aboutData.mission}
                </p>
              </div>
            )}

            {aboutData.vision && (
              <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200/70 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {aboutData.vision}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Dynamic Key Metrics / Stats Section */}
      {aboutData?.stats && aboutData.stats.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900">Our Impact in Numbers</h2>
              <p className="text-slate-500 text-sm mt-1">Dedicated care backed by proven results</p>
            </div>
            <div className={`grid gap-6 ${aboutData.stats.length === 2 ? 'grid-cols-2 max-w-lg mx-auto' :
              aboutData.stats.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
                'grid-cols-2 md:grid-cols-4'
              }`}>
              {aboutData.stats.map((stat, idx) => (
                <div key={idx} className="text-center p-6 rounded-2xl bg-surface-2/40 border border-brand-mid/15">
                  <div className="text-3xl sm:text-4xl font-extrabold text-brand-dark mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Core Values / Features */}
      {aboutData?.features && aboutData.features.length > 0 && (
        <section className="py-14 bg-surface border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-mid block mb-1">
                What We Stand For
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Core Principles</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData.features.map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-mid/40 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-surface-2 text-brand-mid flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}