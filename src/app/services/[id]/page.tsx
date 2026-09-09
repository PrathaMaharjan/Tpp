"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import { DetailSkeleton } from "../../components/Skeleton";
import HeroTitle from "../../components/HeroTitle";
import { getPublicServices, slugify } from "../../lib/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceItem {
  id: string;
  name: string;
  slug?: string;
  category?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  price?: string | null;
}

const FALLBACK_TREATMENT_IMG =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200";

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

function formatServiceNameFromId(id: string) {
  if (!id) return "Healthcare Treatment";
  return decodeURIComponent(id)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

import { parseEditorJs } from "../../lib/editorParser";

export default function ServiceDetailPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();

  // Support both [slug] and [id] parameter naming
  const serviceParam = (params?.id as string) || (params?.slug as string) || "";

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchServiceDetails() {
      try {
        setLoading(true);
        const res: any = await getPublicServices();

        const list: any[] = Array.isArray(res)
          ? res
          : res?.data?.data?.treatments || res?.data?.treatments || res?.data || [];

        const decodedParam = decodeURIComponent(serviceParam).toLowerCase().trim();
        const targetSlug = slugify(decodedParam);

        // Match service by Slug, ID, or Title
        const found = list.find((s) => {
          const sSlug = s.slug?.toLowerCase();
          const sTitle = (s.title || s.name || "").toLowerCase();
          const sTitleSlug = slugify(sTitle);
          const sId = String(s.id || "").toLowerCase();

          return (
            sSlug === decodedParam ||
            sSlug === targetSlug ||
            sId === decodedParam ||
            sTitleSlug === targetSlug ||
            sTitleSlug === decodedParam ||
            sTitle === decodedParam
          );
        });

        const serviceName = found ? found.title || found.name : formatServiceNameFromId(serviceParam);
        const serviceCategory = found?.category || "Specialized Care";
        const rawPhoto = found?.imageUrl || (found as any)?.image_url;
        const defaultDesc = `Comprehensive and individualized ${serviceName.toLowerCase()} provided by our medical team to support your health and wellbeing.`;

        const serviceData: ServiceItem = {
          id: found?.id || serviceParam,
          name: serviceName,
          slug: found?.slug,
          category: serviceCategory,
          description: parseEditorJs(found?.description, defaultDesc),
          imageUrl: resolveImageUrl(rawPhoto, FALLBACK_TREATMENT_IMG),
          price: found?.price || null,
        };

        if (isMounted) {
          setService(serviceData);
        }
      } catch (err) {
        console.error("Failed to load service details:", err);
        if (isMounted) {
          const fallbackName = formatServiceNameFromId(serviceParam);
          setService({
            id: serviceParam,
            name: fallbackName,
            category: "Specialized Care",
            description: `Expert ${fallbackName.toLowerCase()} provided by our team to ensure the highest standard of patient care.`,
            imageUrl: FALLBACK_TREATMENT_IMG,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (serviceParam) {
      fetchServiceDetails();
    }

    // These isMounted guards were read but never cleared, so
    // state could still be set after unmount.
    return () => {
      isMounted = false;
    };
  }, [serviceParam]);

  useGSAP(
    () => {
      gsap.fromTo(
        ".service-detail-header",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );

      gsap.fromTo(
        ".service-detail-body",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: "power2.out", clearProps: "all" }
      );

      gsap.fromTo(
        ".service-cta-block",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".service-cta-section",
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [loading, service?.id] }
  );

  if (loading && !service) {
    return (
      <main className="min-h-screen bg-white font-sans text-slate-900">
        <Header />
        <DetailSkeleton />
        <Footer />
      </main>
    );
  }

  const currentService = service || {
    id: serviceParam,
    name: formatServiceNameFromId(serviceParam),
    category: "Specialized Care",
    description: "Comprehensive medical and clinical care delivered by dedicated healthcare providers.",
    imageUrl: FALLBACK_TREATMENT_IMG,
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      {/* Hero Header */}
      <section className="relative bg-brand-mid pt-40 pb-[121px]">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 space-y-4">
          <Breadcrumbs
            className="service-detail-header mb-2"
            tone="dark"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: currentService.name },
            ]}
          />

          <div className="service-detail-header space-y-2 max-w-3xl">
            {currentService.category && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-white">
                <Tag size={13} />
                {currentService.category}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              <HeroTitle text={currentService.name} />
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

      {/* Main Content Area */}
      <section className="service-detail-body py-12 max-w-[1000px] mx-auto px-6 md:px-10 space-y-8">
        {/* Treatment Image */}
        <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm relative">
          <img
            src={currentService.imageUrl || FALLBACK_TREATMENT_IMG}
            alt={currentService.name}
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = FALLBACK_TREATMENT_IMG;
            }}
          />
        </div>

        {/* Description & Clinical Content */}
        <div className="pt-2">
          <div
            className="text-slate-700 text-base sm:text-lg leading-relaxed space-y-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-1 [&_strong]:font-bold [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: currentService.description || "" }}
          />
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="service-cta-section bg-surface-2 py-20 mt-12">
        <div className="service-cta-block max-w-2xl mx-auto text-center space-y-4 px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Book an Appointment for {currentService.name}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Schedule an in-person consultation with our healthcare team today.
          </p>

          <Link
            href={`/booking?service=${encodeURIComponent(currentService.name)}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand via-brand-mid to-brand-soft text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-brand/25 active:scale-[0.99] transition-all duration-200 mt-2"
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
