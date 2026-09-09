'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CtaSection from '../components/CtaSection';
import { Stethoscope, HeartPulse, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { parseEditorJs } from '../lib/editorParser';

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

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3002';
const SITE_SLUG =
  process.env.NEXT_PUBLIC_SITE_SLUG || process.env.NEXT_PUBLIC_TENANT_SLUG || 'tpp';

/** Photos for the hero strip. Not provided by the CMS about endpoint. */
const STRIP_PHOTOS = [
  '/images/about/istockphoto-1633320190-2048x2048.jpg',
  '/images/about/istockphoto-1319031310-612x612.jpg',
  '/images/about/istockphoto-1903424167-2048x2048.jpg',
  '/images/about/istockphoto-1388254153-612x612.jpg',
];

/** Static because the CMS `features` array is empty. */
const PILLARS: { icon: typeof Stethoscope; title: string; description: string }[] = [
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

  // CMS values with copy that stands on its own when a field is blank.
  const pageBadge = aboutData?.badge || 'Who We Are';
  const pageTitle = aboutData?.title || 'About Texas Primary & Pediatric Care';
  const pageSubtitle =
    aboutData?.subtitle ||
    'Personalized primary and pediatric care for families across North Texas, at both our Irving and Celina clinics.';

  const bannerImgUrl = resolveImageUrl(aboutData?.bannerImage, STRIP_PHOTOS[0]);
  const secondaryImgUrl = resolveImageUrl(aboutData?.secondaryImage, STRIP_PHOTOS[2]);
  const stats = aboutData?.stats?.length ? aboutData.stats : [];
  const features = aboutData?.features?.length ? aboutData.features : [];

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />

      {/* ── Hero: tinted band, decorative marks, photo strip breaking out ── */}
      <section className="relative pt-28 md:pt-32">
        {/* Tinted band. Height stops partway down the photo strip so the
            photos straddle the tint/white boundary, as in the reference. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[calc(100%-126px)] bg-brand-dark md:h-[calc(100%-160px)]"
        />

        {/* Decorative shapes, as in the reference */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-126px)] overflow-hidden opacity-[0.28] invert md:h-[calc(100%-160px)]"
        >
          <Image
            src="/images/shapes/shape-1.webp"
            alt=""
            width={400}
            height={296}
            className="absolute left-[8%] top-[18%] hidden w-[150px] md:block lg:w-[190px]"
          />
          <Image
            src="/images/shapes/shape-3.webp"
            alt=""
            width={162}
            height={179}
            className="absolute right-[12%] top-[14%] hidden w-[44px] md:block"
          />
          <Image
            src="/images/shapes/shape-2.webp"
            alt=""
            width={150}
            height={162}
            className="absolute right-[7%] top-[38%] hidden w-[34px] lg:block"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            {pageBadge && (
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                {pageBadge}
              </span>
            )}
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[56px]">
              {pageTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base">
              {pageSubtitle}
            </p>
          </div>

          {/* Photo strip: sits half on the tint, half on white */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-4 md:gap-5">
            {STRIP_PHOTOS.map((src) => (
              <div
                key={src}
                className="relative overflow-hidden rounded-2xl bg-white shadow-xl"
              >
                {/* Fixed height so the band's cut-off lands exactly halfway
                    down the strip on every breakpoint. */}
                <div className="relative h-[252px] md:h-[320px]">
                  <Image
                    src={src}
                    alt="Our team caring for patients"
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

      {/* ── Intro: heading left, story in two columns right ── */}
      <section className="mx-auto max-w-[1240px] px-6 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <h2 className="text-3xl font-semibold leading-[1.2] tracking-tight text-slate-900 md:text-4xl lg:text-[42px]">
            Family medicine and pediatrics, delivered with care
          </h2>

          <div className="space-y-5 text-[15px] leading-relaxed text-slate-600">
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

      {/* ── Photo with overlapping quote card, copy on the right ── */}
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

            {/* Quote card, overlapping the photo's lower-left corner */}
            <div className="relative z-10 mx-4 -mt-12 rounded-2xl bg-white p-5 shadow-xl lg:ml-8 lg:mr-16">
              <p className="text-[15px] font-semibold text-slate-900">
                &ldquo;Every family, treated like our own.&rdquo;
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Texas Primary &amp; Pediatric Care
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold leading-[1.2] tracking-tight text-slate-900 md:text-4xl lg:text-[42px]">
              Care that follows your family through every stage
            </h2>

            <p className="text-[15px] leading-relaxed text-slate-600">
              {aboutData?.mission ||
                'Preventive visits, sick care, vaccinations, school and sports physicals, and ongoing management of chronic conditions, all handled by providers who know your history.'}
            </p>

            <blockquote className="border-l-4 border-brand bg-surface-2 py-4 pl-5 pr-4 text-[15px] italic leading-relaxed text-slate-700">
              {aboutData?.vision ||
                'We want to be the practice a family stays with for decades, not the one they visit once and forget.'}
            </blockquote>

            <Link
              href="/providers"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors duration-300 hover:text-brand-dark"
            >
              Meet our providers
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pillars: centred heading, three icon cards ── */}
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
              Why families choose our practice
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-slate-600">
              Two convenient North Texas locations, providers who listen, and
              scheduling that works around your week.
            </p>
          </div>

          {/* CMS features when present, otherwise the static pillars */}
          <div className="mt-14 grid gap-10 sm:grid-cols-3 md:mt-16 md:gap-12">
            {(features.length
              ? features.map((f, i) => ({
                  title: f.title,
                  description: f.description,
                  icon: PILLARS[i % PILLARS.length].icon,
                }))
              : PILLARS
            ).map((item) => {
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
        <section className="mx-auto max-w-[1240px] px-6 py-20 md:py-24">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold tracking-tight text-brand md:text-[44px]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Facility banner ── */}
      {bannerImgUrl && (
        <section className="mx-auto max-w-[1240px] px-6 pb-20 md:pb-28">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] bg-slate-100 md:aspect-[21/9]">
            <Image
              src={bannerImgUrl}
              alt="Our clinic"
              fill
              sizes="(min-width: 1240px) 1240px, 100vw"
              className="object-cover"
            />
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1400px] px-6 pb-4">
        <CtaSection
          eyebrow="Ready When You Are"
          title="Accepting New Patients at Both Texas Locations"
          description="Book online in under a minute, or send us a message and our team will help you find a time that works."
          primary={{ label: 'Book Appointment', href: '/booking' }}
          secondary={{ label: 'Contact Us', href: '/contact' }}
        />
      </div>

      <Footer />
    </main>
  );
}
