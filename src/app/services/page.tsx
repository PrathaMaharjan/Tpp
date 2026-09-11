"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CardGridSkeleton } from "../components/Skeleton";
import { getPublicServices, slugify } from "../lib/api";
import { stripHtmlAndDecode } from "../lib/htmlEntities";
import { useHeaderOffset } from "../lib/useHeaderOffset";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  imageUrl?: string | null;
}

const FALLBACK_TREATMENT_IMG =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

function resolveImageUrl(url?: string | null, fallback: string = FALLBACK_TREATMENT_IMG): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanBase = CMS_URL.replace(/\/$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

// Parses preview snippet from Editor.js JSON or plain text
function parsePreviewText(desc?: string | null): string {
  if (!desc) return "Comprehensive clinical care tailored to your health and wellness.";
  try {
    const parsed = JSON.parse(desc);
    if (Array.isArray(parsed?.blocks)) {
      const texts: string[] = [];
      for (const b of parsed.blocks) {
        if (typeof b.data?.text === "string" && b.data.text.trim()) {
          texts.push(stripHtmlAndDecode(b.data.text));
        }
      }
      if (texts.length > 0) return texts.join(" ");
    }
  } catch {
    // Already plain text or HTML
  }
  return stripHtmlAndDecode(desc);
}

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const hasAnimatedHeaderRef = useRef(false);
  const headerOffset = useHeaderOffset();

  // Fetch treatments dynamically from CMS
  useEffect(() => {
    let isMounted = true;

    async function loadTreatments() {
      try {
        setLoading(true);
        const res: any = await getPublicServices();

        // Support both direct array and nested response structures
        const rawList: any[] = Array.isArray(res)
          ? res
          : res?.data?.data?.treatments || res?.data?.treatments || res?.data || [];

        if (isMounted) {
          const list: ServiceItem[] = rawList.map((item) => ({
            id: item.id,
            name: item.title || item.name || "Specialized Procedure",
            slug: item.slug || slugify(item.title || item.name || item.id),
            category: item.category?.trim() || "Specialized Care",
            description: parsePreviewText(item.description),
            imageUrl: resolveImageUrl(item.imageUrl || (item as any).image_url),
          }));
          setServices(list);
        }
      } catch (err) {
        console.error("Failed to load treatments:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTreatments();
    return () => {
      isMounted = false;
    };
  }, []);

  // Extract categories dynamically from treatments
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.category?.trim()) set.add(s.category.trim());
    });
    const unique = Array.from(set);
    return unique.length > 0 ? ["All", ...unique] : ["All"];
  }, [services]);

  const displayedServices = useMemo(() => {
    if (activeCategory === "All") return services;
    return services.filter(
      (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [services, activeCategory]);

  useGSAP(
    () => {
      // Runs once, on first mount only, so switching category tabs never
      // replays the page-header entrance.
      if (hasAnimatedHeaderRef.current) return;
      hasAnimatedHeaderRef.current = true;

      gsap.fromTo(
        ".services-page-header",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      // Re-runs on every tab switch: the new set of cards gets its own
      // reveal, but this is scoped to just the grid, not the page header.
      if (!loading && displayedServices.length > 0) {
        gsap.fromTo(
          ".service-card-wrapper",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    },
    { scope: containerRef, dependencies: [loading, activeCategory, displayedServices.length] }
  );

  return (
    <main ref={containerRef} className="min-h-screen bg-white font-sans">
      <Header />

      {/* Header Section */}
      <div className="relative bg-brand-mid min-h-[402px] md:min-h-[495px] overflow-hidden">
        {/* Corner line-art illustrations, melted into the band */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[107px] top-[14px] hidden w-[337px] select-none opacity-70 mix-blend-screen xl:block xl:top-[17px] xl:left-[130px] xl:w-[412px]"
        >
          <Image src="/images/hero-images/services/microscope.png" alt="" width={1536} height={1024} className="h-auto w-full" priority />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute right-[131px] top-[14px] hidden w-[337px] select-none opacity-70 mix-blend-screen xl:block xl:top-[17px] xl:right-[159px] xl:w-[412px]"
        >
          <Image src="/images/hero-images/services/clipboard.png" alt="" width={1536} height={1024} className="h-auto w-full" priority />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-112px] bottom-[-26px] hidden w-[337px] select-none opacity-70 mix-blend-screen xl:block xl:left-[-137px] xl:bottom-[-33px] xl:w-[412px]"
        >
          <Image src="/images/hero-images/services/mother-baby.png" alt="" width={1536} height={1024} className="h-auto w-full" priority />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-105px] bottom-[-40px] hidden w-[337px] select-none opacity-70 mix-blend-screen xl:block xl:right-[-129px] xl:bottom-[-50px] xl:w-[412px]"
        >
          <Image src="/images/hero-images/services/stethoscope.png" alt="" width={1536} height={1024} className="h-auto w-full" priority />
        </div>

        <div className="pt-50 pb-[76px] md:pt-[250px] md:pb-[95px]">
          <div className="services-page-header max-w-3xl mx-auto px-6 space-y-3 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight text-brand-deep">
              Our Services &amp; <span className="text-slate-200">Treatments</span>
            </h1>
            <p className="text-brand-deep text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Comprehensive healthcare services and specialized medical procedures tailored to your family&apos;s needs.
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

      {/* Category Tabs: sticky, tracks the live header height so it docks
          right under the nav whether the header banner/nav is showing or
          has slid away on scroll. */}
      {categories.length > 1 && (
        <div
          className="sticky z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-sm"
          style={{ top: headerOffset }}
        >
          <div
            className="max-w-[1400px] mx-auto px-6 md:px-10 overflow-x-auto no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-center justify-start sm:justify-center gap-2.5 py-3.5 min-w-max mx-auto">
              {categories.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-sm capitalize transition-colors duration-300 ${
                      isActive
                        ? "border-brand bg-brand font-semibold text-white shadow-sm"
                        : "border-slate-200 bg-white font-medium text-slate-600 hover:border-brand/40 hover:text-brand"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <section className="pb-24 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Services Grid */}
        {loading ? (
          <CardGridSkeleton count={3} className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" />
        ) : displayedServices.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            No treatments found for this category.
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedServices.map((service) => {
              const photo = service.imageUrl || FALLBACK_TREATMENT_IMG;

              return (
                <div key={service.id} className="service-card-wrapper">
                  <Link
                    href={`/services/${service.slug || service.id}`}
                    className="group flex flex-col justify-between h-full rounded-2xl bg-white border border-slate-200/90 overflow-hidden hover:border-brand-mid/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-xs"
                  >
                    <div>
                      {/* Image with Fallback and Hover Overlay */}
                      <div className="w-full aspect-[4/3] overflow-hidden bg-slate-50 relative">
                        <img
                          src={photo}
                          alt={service.name}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            target.src = FALLBACK_TREATMENT_IMG;
                          }}
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/65 to-transparent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                          <span className="text-[0.6rem] font-bold uppercase tracking-wider text-brand-soft mb-1">
                            About Treatment
                          </span>
                          <p className="text-xs text-white/95 leading-relaxed line-clamp-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 font-normal">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 pb-2 space-y-1.5">
                        <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-mid">
                          {service.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-brand transition-colors">
                          {service.name}
                        </h3>
                      </div>
                    </div>

                    {/* View Details Link Footer */}
                    <div className="px-6 pb-6 pt-0">
                      <div className="flex items-center justify-between pt-4 text-xs font-semibold text-brand-mid group-hover:text-brand border-t border-slate-100 transition-colors">
                        <span>View Treatment Details</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
