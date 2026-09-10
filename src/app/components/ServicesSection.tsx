"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getPublicServices, slugify } from "../lib/api";
import { CardSkeleton } from "./Skeleton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FALLBACK_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";
const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG || "tpp";

function resolveImageUrl(url?: string | null, fallback: string = FALLBACK_SERVICE_IMAGE): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanBase = CMS_URL.replace(/\/$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: string | null;
}

function parseServiceDescription(desc?: string | null): string {
  if (!desc) return "Expert clinical care and treatment provided by our experienced medical team.";
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
    // Plain text or HTML
  }
  return desc;
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const hasAnimatedRef = useRef(false);

  // 1. Fetch treatments and dynamic categories from CMS
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);

        // Fetch treatments and categories in parallel
        const [servicesRes, categoriesRes] = await Promise.allSettled([
          getPublicServices(),
          fetch(`${CMS_URL}/api/${SITE_SLUG}/service-categories`).then((r) =>
            r.ok ? r.json() : []
          ),
        ]);

        if (isMounted) {
          // Unpack services
          const rawServices: any[] =
            servicesRes.status === "fulfilled"
              ? Array.isArray(servicesRes.value)
                ? servicesRes.value
                : (servicesRes.value as any)?.data?.data?.treatments ||
                  (servicesRes.value as any)?.data?.treatments ||
                  []
              : [];

          const list: ServiceItem[] = rawServices.map((item) => ({
            id: item.id,
            name: item.title || item.name || "Specialized Treatment",
            slug: item.slug || slugify(item.title || item.name || item.id),
            // ✅ Read category directly from CMS with graceful fallback
            category: item.category?.trim() || "Specialized Care",
            description: parseServiceDescription(item.description),
            imageUrl: resolveImageUrl(item.imageUrl || item.image_url),
            price: item.price,
          }));

          setServices(list);

          // Unpack categories from DB
          if (categoriesRes.status === "fulfilled" && Array.isArray(categoriesRes.value)) {
            const catNames = categoriesRes.value
              .map((c: any) => c.name?.trim())
              .filter(Boolean);
            setDbCategories(catNames);
          }
        }
      } catch (err) {
        console.error("Failed to load treatments & categories from CMS:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Combine categories from DB and existing treatments
  const categories = useMemo(() => {
    const set = new Set<string>();

    // Add categories from categories table
    dbCategories.forEach((cat) => {
      if (cat) set.add(cat);
    });

    // Add categories assigned to existing services
    services.forEach((s) => {
      if (s.category?.trim()) set.add(s.category.trim());
    });

    const unique = Array.from(set);
    return unique.length > 0 ? ["All", ...unique] : ["All"];
  }, [dbCategories, services]);

  // 3. Filter services by active tab
  const filteredServices = useMemo(() => {
    if (activeCategory === "All") return services;
    return services.filter(
      (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [services, activeCategory]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  // Reset to the start and refresh arrow state when the list changes.
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0 });
    // Measure after layout so scrollWidth is final.
    const id = requestAnimationFrame(updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", updateArrows);
    };
  }, [filteredServices.length, loading]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  useGSAP(
    () => {
      // Guards against replaying the entrance reveal on every tab switch:
      // filteredServices.length changes when the category filter changes,
      // which would otherwise re-run this effect and reset opacity to 0.
      if (hasAnimatedRef.current || loading || filteredServices.length === 0) return;
      hasAnimatedRef.current = true;

      gsap.fromTo(
        ".services-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".services-carousel-wrapper",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );

      if (categories.length > 1) {
        gsap.fromTo(
          ".services-tabs",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [loading, categories.length, filteredServices.length] }
  );

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden font-sans">
      {/* SVG Background Wave */}
      <div className="absolute top-0 right-0 w-full h-[600px] pointer-events-none z-0">
        <svg
          className="absolute top-0 right-0 w-full h-full text-brand-mid"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M0,0 H1440 V420 C1050,580 550,300 0,520 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-12">
        {/* Header: title + description left, CTA right */}
        <div className="services-header px-6 md:px-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-deep">
              Our Specialties &amp; Treatments
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-200 tracking-tight">
              Comprehensive Care You Can Trust
            </h2>
            <p className="text-sm text-white/85 leading-relaxed font-normal">
              We provide a wide range of specialized healthcare and clinical procedures, covering all your family&apos;s needs.
            </p>
          </div>

          {!loading && filteredServices.length > 0 && (
            <Link
              href="/services"
              className="group relative inline-flex shrink-0 items-center gap-4 self-start overflow-hidden rounded-full bg-white pl-6 pr-2 py-2 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30 active:scale-[0.99] sm:self-auto"
            >
              <span className="absolute inset-0 h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand via-brand-mid to-brand-soft transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Explore All Services
              </span>
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white transition-colors duration-300 group-hover:bg-white/20">
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}
        </div>

        {/* Category Filter Tabs */}
        {/* Pill filters, matching the reference's rounded-full style but
            tuned for the teal band: solid white when active, translucent
            with a light border otherwise. */}
        {categories.length > 1 && (
          <div className="services-tabs px-6">
            <div
              role="tablist"
              aria-label="Filter services by category"
              className="mx-auto flex max-w-full items-center justify-start gap-2.5 overflow-x-auto pb-2 no-scrollbar sm:justify-center"
            >
              {categories.map((cat) => {
                const isActive =
                  activeCategory.toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-sm capitalize transition duration-300 ${
                      isActive
                        ? "border-white bg-white font-semibold text-brand-dark shadow-sm"
                        : "border-white/35 bg-white/10 font-medium text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Carousel Wrapper */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden py-6 px-4" aria-label="Loading">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-[320px] shrink-0">
                <CardSkeleton index={i} />
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm bg-white rounded-2xl border border-slate-200/60 p-8 max-w-md mx-auto">
            No treatments found in &ldquo;{activeCategory}&rdquo;.
          </div>
        ) : (
          <div className="services-carousel-wrapper relative px-4 md:px-12">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous Treatment"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-brand hover:border-brand/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next Treatment"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-brand hover:border-brand/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel Container */}
            <div
              ref={scrollRef}
              onScroll={updateArrows}
              className="flex gap-6 overflow-x-auto scroll-smooth py-6 px-4 no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredServices.map((service) => {
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug || service.id}`}
                    className="group relative w-[280px] md:w-[300px] h-[400px] shrink-0 rounded-3xl border border-slate-200/70 overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 p-6 flex flex-col justify-between cursor-pointer"
                  >
                    {/* Background image layer */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={service.imageUrl || FALLBACK_SERVICE_IMAGE}
                        alt={service.name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = FALLBACK_SERVICE_IMAGE;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-900/20 group-hover:from-slate-950/95 group-hover:via-slate-900/70 transition-colors duration-500" />
                    </div>

                    {/* Top Category Badge */}
                    <div className="relative z-10">
                      <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm text-[0.65rem] font-bold uppercase tracking-[0.18em] transition-all duration-300 group-hover:bg-brand/80 group-hover:border-brand/80">
                        {service.category}
                      </span>
                    </div>

                    {/* Title + Description */}
                    <div className="relative z-10 space-y-2 pr-12">
                      <h3 className="text-lg font-bold text-white leading-snug transition-colors duration-300">
                        {service.name}
                      </h3>
                      <p className="text-xs text-white/90 leading-relaxed max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom Action Indicator */}
                    <div className="absolute bottom-6 right-6 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white group-hover:bg-brand/80 group-hover:border-brand/80 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
