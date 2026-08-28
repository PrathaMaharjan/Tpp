"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Activity, 
  Stethoscope, 
  ArrowUpRight,
  ArrowRight 
} from "lucide-react";
import { getPublicServices, slugify } from "../lib/api";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  imageUrl?: string | null;
}

export default function ServicesSection({ locationId }: { locationId?: string }) {
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

  // 4. Cap displayed services to 6
  const displayedServices = useMemo(
    () => filteredServices.slice(0, 6),
    [filteredServices]
  );

  return (
    <section className="py-24 bg-slate-50/40 relative overflow-hidden font-sans">
      
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

      <div className="max-w-[1240px] mx-auto px-6 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-100/90">
            Our Specialties &amp; Treatments
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Comprehensive Dental &amp; Clinical Care
          </h2>
          <div className="w-12 h-0.5 bg-white/80 mx-auto rounded-full mt-2" />
        </div>

        {/* Dynamic Category Filter Pills */}
        {categories.length > 1 && (
          <div className="flex justify-center overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-white shadow-sm border border-slate-200/80">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#2596be] text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3-Column Grid with Real Images from DMS (capped at 6) */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading treatments...
          </div>
        ) : displayedServices.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm bg-white rounded-2xl border border-slate-200/60 p-8 max-w-md mx-auto">
            No treatments found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {displayedServices.map((service) => {
              return (
                <Link
                  key={service.id}
                  href={`/services/${slugify(service.name) || service.id}`}
                  className="group bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Full-Bleed Top Image (only if a real image exists) */}
                    {service.imageUrl && (
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-2">
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#4fa1b0]">
                        {service.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#2596be] transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                        {service.description || "Expert clinical care and treatment provided by our experienced medical team."}
                      </p>
                    </div>
                  </div>

                  {/* Action Link Footer */}
                  <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs font-semibold text-[#2596be] group-hover:text-slate-900 transition-colors">
                    <span>View Treatment Details</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Link */}
        {!loading && filteredServices.length > 0 && (
          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2596be] hover:text-[#4fa1b0] transition-colors group"
            >
              <span>Explore More</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}