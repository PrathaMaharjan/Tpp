"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CardGridSkeleton } from "../components/Skeleton";
import { getPublicServices, slugify } from "../lib/api";
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
          texts.push(b.data.text.replace(/<[^>]*>/g, ""));
        }
      }
      if (texts.length > 0) return texts.join(" ");
    }
  } catch {
    // Already plain text or HTML
  }
  return desc.replace(/<[^>]*>/g, "");
}

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

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
      gsap.fromTo(
        ".services-page-header",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );

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
      <div className="relative bg-brand-mid">
        <div className="pt-40 pb-[170px]">
          <div className="services-page-header max-w-3xl mx-auto px-6 space-y-3 text-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-brand-deep">
              Our Services &amp; <span className="text-white">Treatments</span>
            </h1>
            <p className="text-brand-deep text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Comprehensive healthcare services and specialized medical procedures tailored to your family&apos;s needs.
            </p>
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div
              className="relative z-10 mt-10 border-b border-white/25 overflow-x-auto max-w-[1400px] mx-auto px-6 md:px-10"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex justify-center gap-8 min-w-max mx-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative pb-4 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      activeCategory.toLowerCase() === cat.toLowerCase()
                        ? "text-white font-semibold"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {cat}
                    {activeCategory.toLowerCase() === cat.toLowerCase() && (
                      <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
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
