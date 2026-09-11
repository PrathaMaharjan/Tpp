"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ProviderSkeleton } from "../components/Skeleton";
import { ArrowRight, ChevronDown } from "lucide-react";
import { getPublicDoctors, slugify } from "../lib/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INITIAL_VISIBLE_COUNT = 9;

interface ProviderItem {
  id: string;
  name: string;
  slug?: string;
  specialization?: string | null;
  specialty?: string | null;
  qualification?: string | null;
  imageUrl?: string | null;
  photoUrl?: string | null;
}

const FALLBACK_DOCTOR_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

function resolveImageUrl(url?: string | null, fallback: string = FALLBACK_DOCTOR_AVATAR): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanBase = CMS_URL.replace(/\/$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

export default function ProvidersPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Fetch doctors dynamically from CMS
  useEffect(() => {
    let isMounted = true;

    async function loadProviders() {
      try {
        setLoading(true);
        const res: any = await getPublicDoctors();

        // Support both direct array and nested response formats
        const docList: ProviderItem[] = Array.isArray(res)
          ? res
          : res?.data?.data?.doctors || res?.data?.doctors || [];

        if (isMounted) {
          setProviders(docList);
        }
      } catch (err) {
        console.error("Failed to load providers:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProviders();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleProviders = providers.slice(0, visibleCount);
  const hasMore = visibleCount < providers.length;

  useGSAP(
    () => {
      gsap.fromTo(
        ".providers-header-content",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );
    },
    { scope: containerRef }
  );

  // Each card reveals individually as it scrolls into view, rather than a
  // single stagger tied to page load — so cards revealed later via "Show
  // more" still get their own scroll-in animation.
  useGSAP(
    () => {
      if (loading || visibleProviders.length === 0) return;

      const cards = gsap.utils.toArray<HTMLElement>(".provider-card-wrapper");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    },
    { scope: containerRef, dependencies: [loading, visibleProviders.length] }
  );

  return (
    <main ref={containerRef} className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      {/* Styled Header Title */}
      <div className="relative bg-brand-mid min-h-[402px] md:min-h-[495px]">
        <div className="pt-50 pb-[76px] md:pt-[250px] md:pb-[95px]">
          <div className="providers-header-content max-w-3xl mx-auto px-6 space-y-3 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight text-brand-deep">
              Meet Our <span className="text-slate-200">Providers</span>
            </h1>
            <p className="text-brand-deep text-[15px] sm:text-base leading-relaxed max-w-xl mx-auto">
              Meet our board-certified healthcare professionals dedicated to your family&apos;s health and wellness.
            </p>
          </div>
        </div>

        {/* Top Wave Divider */}
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

      <section className="pb-24 pt-8 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Provider Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" aria-label="Loading">
              {[0, 1, 2].map((i) => (
                <ProviderSkeleton key={i} index={i} />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">
              No doctors listed at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visibleProviders.map((provider) => {
                const rawPhoto = provider.imageUrl || provider.photoUrl || (provider as any).image_url;
                const photo = resolveImageUrl(rawPhoto, FALLBACK_DOCTOR_AVATAR);
                const specialization =
                  provider.specialty ||
                  provider.specialization ||
                  provider.qualification ||
                  "Healthcare Specialist";
                const profileSlug = provider.slug || slugify(provider.name) || provider.id;

                return (
                  <div key={provider.id} className="provider-card-wrapper">
                    <div className="group relative h-full overflow-hidden rounded-2xl bg-slate-900 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      {/* Whole-card link to the profile; Book Visit sits above it */}
                      <Link
                        href={`/providers/${profileSlug}`}
                        aria-label={`View ${provider.name}'s profile`}
                        className="absolute inset-0 z-10 focus:outline-none"
                      >
                        <span className="sr-only">View {provider.name}&apos;s profile</span>
                      </Link>

                      {/* Photo */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden">
                        <img
                          src={photo}
                          alt={provider.name}
                          crossOrigin="anonymous"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            target.src = FALLBACK_DOCTOR_AVATAR;
                          }}
                        />
                        {/* Dark gradient so the overlaid text stays legible */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

                        {/* Arrow chip: signals the card is clickable */}
                        <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors duration-300 group-hover:bg-brand">
                          <ArrowRight size={18} />
                        </div>

                        {/* Name + specialty */}
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <h3 className="text-lg font-bold leading-snug text-white">
                            {provider.name}
                          </h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                            {specialization}
                          </p>
                        </div>
                      </div>

                      {/* Book action: always visible on touch, reveals on hover on desktop */}
                      <div className="absolute bottom-5 right-5 z-20 transition-all duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                        <Link
                          href={`/booking?dentist=${encodeURIComponent(provider.name)}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-brand hover:text-white"
                        >
                          <span>Book Visit</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setVisibleCount((count) => count + INITIAL_VISIBLE_COUNT)}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-brand/40 hover:text-brand hover:shadow-md"
              >
                <span>Show More</span>
                <ChevronDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
