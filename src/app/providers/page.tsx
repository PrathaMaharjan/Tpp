"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight, Stethoscope } from "lucide-react";
import { getPublicDoctors, slugify } from "../lib/api";

interface ProviderItem {
  id: string;
  name: string;
  specialization?: string | null;
  qualification?: string | null;
  imageUrl?: string | null;
  photoUrl?: string | null;
}

const FALLBACK_DOCTOR_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors dynamically from DMS
  useEffect(() => {
    let isMounted = true;

    async function loadProviders() {
      try {
        setLoading(true);
        const res = await getPublicDoctors();
        const docList: ProviderItem[] = res?.data?.data?.doctors || [];

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

  return (
    <main className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      {/* Styled Header Title */}
      <div className="relative bg-[#eaf4f6]">
        <div className="pt-50 pb-20">
          <div className="max-w-3xl mx-auto px-6 space-y-4 text-center">
            <h1 className="text-3xl pb-10 sm:text-4xl font-bold tracking-tight text-slate-900">
              Meet Our Providers
            </h1>
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
            <div className="text-center py-20 text-slate-400 text-sm">
              Loading healthcare providers from DMS...
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">
              No doctors listed at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {providers.map((provider) => {
                const photo = provider.imageUrl || provider.photoUrl || FALLBACK_DOCTOR_AVATAR;
                const specialization = provider.specialization || provider.qualification || "Primary Care & Pediatrics";

                return (
                  <div
                    key={provider.id}
                    className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 text-center flex flex-col items-center justify-between transition-all duration-300 hover:border-[#4fa1b0]/50 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Subtle Teal Line on Hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#4fa1b0] transition-colors duration-300" />

                    <Link
                      href={`/providers/${slugify(provider.name) || provider.id}`}
                      className="flex flex-col items-center space-y-4 w-full pt-2 cursor-pointer focus:outline-none"
                    >
                      {/* Avatar Container with Image Fallback */}
                      <div className="relative w-32 h-32 rounded-full p-1 bg-[#4fa1b0]/10 group-hover:bg-[#4fa1b0]/30 transition-all duration-300">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <img
                            src={photo}
                            alt={provider.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = FALLBACK_DOCTOR_AVATAR;
                            }}
                          />
                        </div>
                      </div>

                      {/* Provider Info */}
                      <div className="space-y-1.5 px-2">
                        <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#2596be] transition-colors">
                          {provider.name}
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {specialization}
                        </p>
                      </div>
                    </Link>

                    {/* Card Actions */}
                    <div className="w-full pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/providers/${slugify(provider.name) || provider.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#2596be] transition-colors"
                      >
                        <span>View Profile</span>
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      <Link
                        href={`/booking?dentist=${encodeURIComponent(provider.name)}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#eaf4f6] text-[#2596be] hover:bg-[#2596be] hover:text-white transition-all"
                      >
                        <span>Book Visit</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
