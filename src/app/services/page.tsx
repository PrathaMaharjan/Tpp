"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPublicServices } from "../lib/api";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  priceCents?: number | null;
  durationMinutes?: number | null;
  imageUrl?: string | null;
}

const FALLBACK_TREATMENT_IMG =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600";

function formatPrice(cents?: number | null) {
  if (!cents || cents <= 0) return "";
  return `NPR ${(cents / 100).toLocaleString()}`;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // Fetch treatments dynamically from DMS
  useEffect(() => {
    let isMounted = true;

    async function loadTreatments() {
      try {
        setLoading(true);
        const res = await getPublicServices();
        const list: ServiceItem[] = res?.data?.data?.treatments || [];

        if (isMounted) {
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
      if (s.category) set.add(s.category);
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

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />

      {/* Header Section */}
      <div className="relative bg-[#eaf4f6]">
        <div className="pt-50 pb-28">
          <div className="max-w-3xl mx-auto px-6 space-y-4 text-center">
            <h1 className="text-3xl pb-10 sm:text-4xl font-bold tracking-tight text-slate-900">
              Our Services &amp; Treatments
            </h1>
          </div>

          {/* Category Tabs */}
          <div
            className="relative z-10 mt-10 border-b border-slate-300/50 overflow-x-auto max-w-[1400px] mx-auto px-6 md:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex justify-center gap-8 min-w-max mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative pb-4 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#4fa1b0]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Section Wave Divider */}
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
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading treatments from DMS...
          </div>
        ) : displayedServices.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            No treatments found for this category.
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {displayedServices.map((service) => {
              const photo = service.imageUrl || FALLBACK_TREATMENT_IMG;
              const formattedPrice = formatPrice(service.priceCents);

              return (
                <div key={service.id} className="group flex flex-col justify-between">
                  <div>
                    {/* Image with Fallback */}
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-slate-50 mb-5 border border-slate-100 shadow-sm">
                      <img
                        src={photo}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_TREATMENT_IMG;
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#4fa1b0]">
                        {service.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {service.description || "Comprehensive clinical care tailored to your oral health and smile."}
                      </p>
                    </div>
                  </div>

                  {/* Pricing / Duration */}
                  <div className="flex items-center gap-4 pt-3 text-xs font-medium text-slate-500 border-t border-slate-100 mt-4">
                    {formattedPrice && <span>{formattedPrice}</span>}
                    {formattedPrice && service.durationMinutes && (
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                    )}
                    {service.durationMinutes ? (
                      <span>{service.durationMinutes} min</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-[#eaf4f6] py-20">
        <div className="max-w-2xl mx-auto text-center space-y-4 px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Not sure which treatment is right for you?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Schedule a consultation and our team will help you find the right care
            plan for your needs.
          </p>
          
            <a 
  href="/booking"
  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2596be]/25 active:scale-[0.99] transition-all duration-200 mt-2"
>
  <Calendar size={16} />
  <span>Book Appointment</span>
</a>
        </div>
      </section>

      <Footer />
    </main>
  );
}