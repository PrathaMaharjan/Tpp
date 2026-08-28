"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPublicServices, slugify } from "../lib/api";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  imageUrl?: string | null;
}

const FALLBACK_TREATMENT_IMG =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600";

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
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedServices.map((service) => {
              const photo = service.imageUrl || FALLBACK_TREATMENT_IMG;

              return (
                <Link
                  key={service.id}
                  href={`/services/${slugify(service.name) || service.id}`}
                  className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 p-6 hover:border-[#4fa1b0]/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div>
                    {/* Image with Fallback */}
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-slate-50 mb-5 border border-slate-100 shadow-sm relative">
                      <img
                        src={photo}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_TREATMENT_IMG;
                        }}
                      />
                    </div>

                                       {/* Content */}
                    <div className="space-y-2">
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#4fa1b0]">
                        {service.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#2596be] transition-colors">
                        {service.name}
                      </h3>
                      <div
                        className="text-sm text-slate-600 leading-relaxed line-clamp-2 [&_p]:inline [&_strong]:font-semibold [&_h2]:hidden [&_h3]:hidden"
                        dangerouslySetInnerHTML={{
                          __html: service.description || "Comprehensive clinical care tailored to your health and smile.",
                        }}
                      />
                    </div>

                  </div>

                  {/* View Details Link Footer */}
                  <div className="flex items-center justify-between pt-4 text-xs font-semibold text-[#4fa1b0] group-hover:text-[#2596be] border-t border-slate-100 mt-5 transition-colors">
                    <span>View Treatment Details</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
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
          
          <Link 
            href="/booking"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2596be]/25 active:scale-[0.99] transition-all duration-200 mt-2"
          >
            <Calendar size={16} />
            <span>Book Appointment</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}