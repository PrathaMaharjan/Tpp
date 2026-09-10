'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CtaSection from '../components/CtaSection';
import AnimatedStat from '../components/AnimatedStat';
import HeroTitle from '../components/HeroTitle';
import {
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Award,
  Clock,
  Users,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { parseEditorJs } from '../lib/editorParser';

interface StatItem {
  label: string;
  value: string;
}

interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

interface CtaData {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryText?: string;
  primaryUrl?: string;
  secondaryText?: string;
  secondaryUrl?: string;
}

interface AboutData {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  storyTitle?: string | null;
  story?: string | null;
  missionTitle?: string | null;
  mission?: string | null;
  vision?: string | null;
  quoteText?: string | null;
  quoteAuthor?: string | null;
  providersButtonText?: string | null;
  providersButtonUrl?: string | null;
  secondaryImage?: string | null;
  stripPhotos?: string[] | null;
  featuresTitle?: string | null;
  featuresSubtitle?: string | null;
  features?: FeatureItem[] | null;
  stats?: StatItem[] | null;
  cta?: CtaData | null;
}

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3002';
const SITE_SLUG =
  process.env.NEXT_PUBLIC_SITE_SLUG || process.env.NEXT_PUBLIC_TENANT_SLUG || 'tpp';

/** Default fallback photos for the hero strip */
const DEFAULT_STRIP_PHOTOS = [
  '/images/about/istockphoto-1633320190-2048x2048.jpg',
  '/images/about/istockphoto-1319031310-612x612.jpg',
  '/images/about/istockphoto-1903424167-2048x2048.jpg',
  '/images/about/istockphoto-1388254153-612x612.jpg',
];

/** Default secondary clinic photo */
const LOCAL_SECONDARY = '/images/about/istockphoto-1633320190-2048x2048.jpg';

/** Icon map for dynamic pillars configured in the CMS */
const ICON_MAP: Record<string, LucideIcon> = {
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Award,
  Clock,
  Users,
  Sparkles,
};

/** Default pillars when CMS has no features defined */
const DEFAULT_PILLARS = [
  {
    icon: Stethoscope,
    title: 'Experienced Providers',
    description:
      'Board-certified physicians and nurse practitioners who treat both adults and children.',
  },
  {
    icon: HeartPulse,
    title: 'Whole-Family Care',
    description:
      'One practice for every age, from newborn checkups to ongoing adult primary care.',
  },
  {
    icon: ShieldCheck,
    title: 'Insurance Accepted',
    description:
      'We work with most major networks and confirm your coverage before every visit.',
  },
];

function resolveImageUrl(url?: string | null, fallback: string = ''): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const cleanBase = CMS_URL.replace(/\/$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Ensures CMS image is large enough for display slots before rendering.
 */
function useImageAtLeast(src: string, minWidth: number): boolean {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let active = true;

    if (!src) {
      const id = setTimeout(() => {
        if (active) setOk(false);
      }, 0);
      return () => {
        active = false;
        clearTimeout(id);
      };
    }

    const img = new window.Image();
    img.onload = () => {
      if (active) setOk(img.naturalWidth >= minWidth);
    };
    img.onerror = () => {
      if (active) setOk(false);
    };
    img.src = src;
    return () => {
      active = false;
    };
  }, [src, minWidth]);

  return ok;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAboutData() {
      try {
        const res = await fetch(`${CMS_URL}/api/${SITE_SLUG}/about`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          const payload = json?.data ?? json;
          if (isMounted && payload && Object.keys(payload).length > 0) {
            setAboutData(payload);
          }
        }
      } catch (err) {
        console.warn('Could not fetch About data from CMS:', err);
      }
    }

    loadAboutData();
    return () => {
      isMounted = false;
    };
  }, []);

  const storyHtml = useMemo(() => parseEditorJs(aboutData?.story), [aboutData?.story]);

  // Dynamic values with sensible defaults
  const pageTitle = aboutData?.title || 'About Us';
  const pageSubtitle =
    aboutData?.subtitle ||
    'Personalized primary and pediatric care for families across North Texas, at both our Irving and Celina clinics.';

  // Hero strip photos: use CMS uploads if provided, else fallback to defaults
  const stripPhotos = useMemo(() => {
    const cmsPhotos = aboutData?.stripPhotos;
    return DEFAULT_STRIP_PHOTOS.map((fallback, idx) => {
      const cmsUrl = cmsPhotos?.[idx];
      return cmsUrl ? resolveImageUrl(cmsUrl, fallback) : fallback;
    });
  }, [aboutData?.stripPhotos]);

  // Secondary clinic photo
  const secondaryFromCms = resolveImageUrl(aboutData?.secondaryImage);
  const secondaryOk = useImageAtLeast(secondaryFromCms, 700);
  const secondaryImgUrl = secondaryOk ? secondaryFromCms : LOCAL_SECONDARY;

  // Story section heading
  const storyTitle =
    aboutData?.storyTitle || 'Family medicine and pediatrics, delivered with care';

  // Overlapping quote card
  const quoteText = aboutData?.quoteText || 'Every family, treated like our own.';
  const quoteAuthor = aboutData?.quoteAuthor || 'Texas Primary & Pediatric Care';

  // Mission & Vision section
  const missionTitle =
    aboutData?.missionTitle || 'Care that follows your family through every stage';
  const missionText =
    aboutData?.mission ||
    'Preventive visits, sick care, vaccinations, school and sports physicals, and ongoing management of chronic conditions, all handled by providers who know your history.';
  const visionText =
    aboutData?.vision ||
    'We want to be the practice a family stays with for decades, not the one they visit once and forget.';
  const providersButtonText = aboutData?.providersButtonText || 'Meet our providers';
  const providersButtonUrl = aboutData?.providersButtonUrl || '/providers';

  // Pillars & Features
  const featuresTitle = aboutData?.featuresTitle || 'Why families choose our practice';
  const featuresSubtitle =
    aboutData?.featuresSubtitle ||
    'Two convenient North Texas locations, providers who listen, and scheduling that works around your week.';

  const resolvedFeatures = useMemo(() => {
    if (aboutData?.features && aboutData.features.length > 0) {
      return aboutData.features.map((f, i) => {
        const IconComponent =
          (f.icon && ICON_MAP[f.icon]) || DEFAULT_PILLARS[i % DEFAULT_PILLARS.length].icon;
        return {
          title: f.title,
          description: f.description,
          icon: IconComponent,
        };
      });
    }
    return DEFAULT_PILLARS;
  }, [aboutData?.features]);

  // Key stats
  const stats = aboutData?.stats?.length ? aboutData.stats : [];

  // CTA
  const cta = aboutData?.cta;

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />

      {/* ── Hero: tinted band, decorative marks, photo strip breaking out ── */}
      <section className="relative pt-28 md:pt-32">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[calc(100%-122px)] bg-brand-mid md:h-[calc(100%-144px)]"
        >
          <div className="absolute bottom-0 left-0 w-full translate-y-[1px] overflow-hidden leading-none">
            <svg
              viewBox="0 0 1440 120"
              className="h-[40px] w-full md:h-[70px]"
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

        {/* Decorative shapes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-122px)] overflow-hidden md:h-[calc(100%-144px)]"
        >
          <Image
            src="/images/shapes/shape-3.webp"
            alt=""
            width={162}
            height={179}
            className="absolute left-1/2 top-[21%] w-[19px] translate-x-[46px] opacity-70 md:w-[23px] md:translate-x-[55px]"
          />
          <Image
            src="/images/shapes/shape-4.webp"
            alt=""
            width={278}
            height={333}
            className="absolute left-1/2 top-[19%] w-[30px] translate-x-[102px] opacity-70 md:w-[38px] md:translate-x-[128px]"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            {aboutData?.badge && (
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-deep/75 mb-2">
                {aboutData.badge}
              </span>
            )}
            <h1 className="font-display mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-brand-deep sm:text-5xl lg:text-[56px]">
              <HeroTitle text={pageTitle} accentClassName="text-slate-200" />
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-brand-deep sm:text-base">
              {pageSubtitle}
            </p>
          </div>

          {/* Photo strip: dynamic from CMS with graceful fallback */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-4 md:gap-5">
            {stripPhotos.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative overflow-hidden rounded-2xl bg-white shadow-xl"
              >
                <div className="relative h-[290px] md:h-[368px]">
                  <Image
                    src={src}
                    alt="Our clinical team and facilities"
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro: heading & story ── */}
      <section className="mx-auto max-w-[1240px] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold leading-[1.2] tracking-tight text-slate-900 md:text-4xl lg:text-[42px]">
            {storyTitle}
          </h2>

          <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-slate-600">
            {storyHtml ? (
              <div
                className="prose-cms [&_p]:mb-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-slate-600"
                dangerouslySetInnerHTML={{ __html: storyHtml }}
              />
            ) : (
              <>
                <p>
                  We opened Texas Primary &amp; Pediatric Care so families would
                  not have to split their care across separate practices. From a
                  newborn&apos;s first checkup to managing an adult&apos;s
                  long-term condition, everyone is seen under one roof.
                </p>
                <p>
                  Our providers take the time to explain what they find and why
                  it matters, and our Irving and Celina clinics both offer
                  same-day appointments when something cannot wait.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Photo with overlapping quote card, mission & vision copy ── */}
      <section className="mx-auto max-w-[1240px] px-6 pb-20 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={secondaryImgUrl}
                alt="Inside our clinic"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Overlapping Quote Card */}
            <div className="relative z-10 mx-4 -mt-12 rounded-2xl bg-white p-5 shadow-xl lg:ml-8 lg:mr-16">
              <p className="text-[15px] font-semibold text-slate-900">
                &ldquo;{quoteText}&rdquo;
              </p>
              <p className="mt-1 text-xs text-slate-500">{quoteAuthor}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold leading-[1.2] tracking-tight text-slate-900 md:text-4xl lg:text-[42px]">
              {missionTitle}
            </h2>

            <p className="text-[15px] leading-relaxed text-slate-600">
              {missionText}
            </p>

            <blockquote className="border-l-4 border-brand bg-surface-2 py-4 pl-5 pr-4 text-[15px] italic leading-relaxed text-slate-700">
              {visionText}
            </blockquote>

            <Link
              href={providersButtonUrl}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors duration-300 hover:text-brand-dark"
            >
              {providersButtonText}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pillars: heading, subtitle, dynamic cards ── */}
      <section className="relative overflow-hidden bg-surface py-20 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.14]"
        >
          <Image
            src="/images/shapes/shape-3.webp"
            alt=""
            width={162}
            height={179}
            className="absolute right-[10%] top-[12%] hidden w-[48px] md:block"
          />
          <Image
            src="/images/shapes/shape-2.webp"
            alt=""
            width={150}
            height={162}
            className="absolute left-[9%] top-[26%] hidden w-[36px] md:block"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold leading-[1.2] tracking-tight text-slate-900 md:text-4xl lg:text-[42px]">
              {featuresTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-slate-600">
              {featuresSubtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3 md:mt-16 md:gap-12">
            {resolvedFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft/25 text-brand">
                    <Icon size={26} strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats from the CMS ── */}
      {stats.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-6 pt-20 pb-10 md:pt-24 md:pb-12">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
            {stats.map((stat, i) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Dynamic CTA Section ── */}
      <div className="mx-auto max-w-[1400px] px-6 pb-4">
        <CtaSection
          eyebrow={cta?.eyebrow || 'Ready When You Are'}
          title={cta?.title || 'Accepting New Patients at Both Texas Locations'}
          description={
            cta?.description ||
            'Book online in under a minute, or send us a message and our team will help you find a time that works.'
          }
          primary={{
            label: cta?.primaryText || 'Book Appointment',
            href:
              cta?.primaryUrl ||
              'https://healow.com/apps/practice/texas-primary-pediatric-care-pllc-irving-tx-22218?v=2&t=1',
          }}
          secondary={{
            label: cta?.secondaryText || 'Contact Us',
            href: cta?.secondaryUrl || '/contact',
          }}
        />
      </div>

      <Footer />
    </main>
  );
}
