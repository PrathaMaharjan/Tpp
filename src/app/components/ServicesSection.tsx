"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
  category: string;
  description?: string | null;
  imageUrl?: string | null;
}

export default function ServicesSection({ locationId }: { locationId?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // 1. Fetch treatments from DMS
  useEffect(() => {
    let isMounted = true;

    async function loadTreatments() {
      try {
        setLoading(true);
        const res = await getPublicServices({ locationId });
        const list: ServiceItem[] = res?.data?.data?.treatments || [];

        if (isMounted) {
          setServices(list);
        }
      } catch (err) {
        console.error("Failed to load services from DMS:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTreatments();
    return () => {
      isMounted = false;
    };
  }, [locationId]);

  // 2. Extract dynamic categories from actual DMS treatments
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    const unique = Array.from(set);
    return unique.length > 0 ? ["All", ...unique] : ["All"];
  }, [services]);

  // 3. Filter services by active tab
  const filteredServices = useMemo(() => {
    if (activeCategory === "All") return services;
    return services.filter(
      (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [services, activeCategory]);

  const scrollRef = useRef<HTMLDivElement>(null);

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
      // Header Animation
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

      // Animate carousel once data is loaded and rendered
      if (!loading && filteredServices.length > 0) {
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
      }

      // Animate tabs if they exist
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
    <section ref={sectionRef} className="py-24 bg-slate-50/40 relative overflow-hidden font-sans">
      
      {/* SVG Background Wave with #4fa1b0 fill */}
      <div className="absolute top-0 right-0 w-full h-[600px] pointer-events-none z-0">
        <svg
          className="absolute top-0 right-0 w-full h-full text-[#4fa1b0]"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 H1440 V420 C1050,580 550,300 0,520 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-12">
        
        {/* Header - Aligned with Doctors Carousel width & spacing */}
        <div className="services-header px-6 md:px-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-100/90">
              Our Specialties &amp; Treatments
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Comprehensive Care You Can Trust
            </h2>
            <div className="w-12 h-0.5 bg-white/80 rounded-full mt-2" />
          </div>

          <p className="text-sm text-white/85 leading-relaxed max-w-sm md:text-right font-normal">
            We provide a wide range of pediatric and adult health services, covering all your family's medical needs.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="services-tabs flex justify-center px-6">
            <div className="relative flex items-center gap-6 sm:gap-8 border-b border-white/20 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative shrink-0 pb-3 text-sm tracking-wide whitespace-nowrap transition-colors duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? "text-white font-semibold"
                      : "text-white/70 hover:text-white font-medium"
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Carousel Wrapper */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading treatments...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm bg-white rounded-2xl border border-slate-200/60 p-8 max-w-md mx-auto">
            No treatments found for this category.
          </div>
        ) : (
          <div className="services-carousel-wrapper relative px-4 md:px-12">
            {/* Left Arrow Button */}
            <button
              onClick={() => scroll("left")}
              aria-label="Previous Treatment"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-[#2596be] hover:border-[#2596be]/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={() => scroll("right")}
              aria-label="Next Treatment"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-[#2596be] hover:border-[#2596be]/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel Container */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth py-6 px-4 no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredServices.map((service) => {
                return (
                  <Link
                    key={service.id}
                    href={`/services/${slugify(service.name) || service.id}`}
                    className="group relative w-[280px] md:w-[300px] h-[400px] shrink-0 rounded-3xl border border-slate-200/70 overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 p-6 flex flex-col justify-between cursor-pointer"
                  >
                    {/* Always visible background image layer */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={
                          service.imageUrl ||
                          "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600"
                        }
                        alt={service.name}
                        className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-900/20 group-hover:from-slate-950/95 group-hover:via-slate-900/70 transition-colors duration-500" />
                    </div>

                    {/* Top Category Badge */}
                    <div className="relative z-10">
                      <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm text-[0.65rem] font-bold uppercase tracking-[0.18em] transition-all duration-300 group-hover:bg-[#2596be] group-hover:border-[#2596be]">
                        {service.category}
                      </span>
                    </div>

                    {/* Title + Description (Revealed smoothly on hover) */}
                    <div className="relative z-10 space-y-2 pr-12">
                      <h3 className="text-lg font-bold text-white leading-snug transition-colors duration-300">
                        {service.name}
                      </h3>
                      <div
                        className="text-xs text-white/90 leading-relaxed max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden line-clamp-3 [&_*]:text-inherit [&_p]:inline [&_strong]:font-semibold [&_h2]:hidden [&_h3]:hidden"
                        dangerouslySetInnerHTML={{
                          __html:
                            service.description ||
                            "Expert clinical care and treatment provided by our experienced medical team.",
                        }}
                      />
                    </div>

                    {/* Bottom Action Indicator */}
                    <div className="absolute bottom-6 right-6 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white group-hover:bg-[#2596be] group-hover:border-[#2596be] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom CTA Link */}
        {!loading && filteredServices.length > 0 && (
          <div className="text-center pt-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2596be] hover:text-[#4fa1b0] transition-colors group"
            >
              <span>Explore All Services</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}