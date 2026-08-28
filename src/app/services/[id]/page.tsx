"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getPublicServices, slugify } from "../../lib/api";

interface ServiceItem {
  id: string;
  name: string;
  category?: string;
  description?: string | null;
  imageUrl?: string | null;
}

const FALLBACK_TREATMENT_IMG =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200";

// Helper to format clean title from any ID or slug
function formatServiceNameFromId(id: string) {
  if (!id) return "Healthcare Treatment";
  return decodeURIComponent(id)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = (params?.id as string) || "";

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchServiceDetails() {
      try {
        setLoading(true);
        const res = await getPublicServices();
        const list: ServiceItem[] = res?.data?.data?.treatments || [];
        const decodedParam = decodeURIComponent(serviceId).toLowerCase().trim();
        const targetSlug = slugify(decodedParam);

        const found = list.find((s) => {
          const nameSlug = slugify(s.name);
          return (
            String(s.id).toLowerCase() === decodedParam ||
            nameSlug === targetSlug ||
            nameSlug === decodedParam ||
            s.name.toLowerCase() === decodedParam ||
            s.name.toLowerCase().replace(/\s+/g, "-") === decodedParam
          );
        });

        const serviceName = found ? found.name : formatServiceNameFromId(serviceId);
        const serviceCategory = found?.category || "Clinical Care";

        const serviceData: ServiceItem = {
          id: found?.id || serviceId,
          name: serviceName,
          category: serviceCategory,
          description:
            found?.description ||
            `Comprehensive and individualized ${serviceName.toLowerCase()} provided by our board-certified medical team to support your health and wellbeing.`,
          imageUrl: found?.imageUrl || FALLBACK_TREATMENT_IMG,
        };

        if (isMounted) {
          setService(serviceData);
        }
      } catch (err) {
        console.error("Failed to load service details:", err);
        if (isMounted) {
          const fallbackName = formatServiceNameFromId(serviceId);
          setService({
            id: serviceId,
            name: fallbackName,
            category: "General Practice",
            description: `Expert ${fallbackName.toLowerCase()} provided by our medical team to ensure the highest standard of patient care.`,
            imageUrl: FALLBACK_TREATMENT_IMG,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  if (loading && !service) {
    return (
      <main className="min-h-screen bg-white font-sans text-slate-900">
        <Header />
        <div className="pt-48 pb-32 text-center text-slate-400 text-sm font-medium">
          Loading treatment details...
        </div>
        <Footer />
      </main>
    );
  }

  const currentService = service || {
    id: serviceId,
    name: formatServiceNameFromId(serviceId),
    category: "Clinical Care",
    description: "Comprehensive medical and clinical care delivered by dedicated healthcare providers.",
    imageUrl: FALLBACK_TREATMENT_IMG,
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      {/* Hero / Page Header */}
      <section className="relative bg-[#eaf4f6] pt-40 pb-20">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 space-y-4">


          <div className="space-y-2 max-w-3xl">
            {currentService.category && (
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#4fa1b0]">
                {currentService.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {currentService.name}
            </h1>
          </div>
        </div>

        {/* Dynamic Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[1px] leading-none overflow-hidden pointer-events-none z-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-[50px] md:h-[80px]"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,35 C320,110 720,-15 1080,75 C1260,115 1380,45 1440,30 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Main Content Area - Image & Description Only */}
      <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-10 space-y-8">
        {/* Treatment Image */}
        <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm relative">
          <img
            src={currentService.imageUrl || FALLBACK_TREATMENT_IMG}
            alt={currentService.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_TREATMENT_IMG;
            }}
          />
        </div>

            {/* Description */}
        <div className="pt-2">
          <div
            className="text-slate-700 text-base sm:text-lg leading-relaxed space-y-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-1 [&_strong]:font-bold [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: currentService.description || "" }}
          />
        </div>

      </section>

      {/* Bottom CTA Section */}
      <section className="bg-[#eaf4f6] py-20 mt-12">
        <div className="max-w-2xl mx-auto text-center space-y-4 px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Book an Appointment for {currentService.name}
          </h2>

          <Link
            href={`/booking?service=${encodeURIComponent(currentService.name)}`}
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