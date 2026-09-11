"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Award } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import CtaSection from "../../components/CtaSection";
import { DetailSkeleton } from "../../components/Skeleton";
import HeroTitle from "../../components/HeroTitle";
import { getPublicDoctors, getPublicServices, slugify } from "../../lib/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TreatmentItem {
  id: string;
  name: string;
  category?: string | null;
  durationMinutes?: number | null;
  priceCents?: number | null;
  description?: string | null;
}

export interface DoctorItem {
  id: string;
  name: string;
  slug?: string;
  specialization?: string | null;
  specialty?: string | null;
  qualification?: string | null;
  yearsOfExperience?: number | null;
  imageUrl?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  about?: string | null;
  treatments?: TreatmentItem[];
}

const FALLBACK_DOCTOR_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1200";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

function resolveImageUrl(url?: string | null, fallback: string = FALLBACK_DOCTOR_AVATAR): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanBase = CMS_URL.replace(/\/$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

function formatDoctorNameFromId(id: string) {
  if (!id) return "Healthcare Provider";
  const cleaned = decodeURIComponent(id)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return cleaned.toLowerCase().startsWith("dr") ? cleaned : `Dr. ${cleaned}`;
}

import { parseEditorJs } from "../../lib/editorParser";

export default function DoctorDetailPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();

  // Support both [slug] and [id] parameter naming
  const doctorParam = (params?.id as string) || (params?.slug as string) || "";

  const [doctor, setDoctor] = useState<DoctorItem | null>(null);
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDoctorAndTreatments() {
      try {
        setLoading(true);

        const [doctorsRes, servicesRes] = await Promise.allSettled([
          getPublicDoctors(),
          getPublicServices ? getPublicServices() : Promise.resolve([]),
        ]);

        const rawDocs = doctorsRes.status === "fulfilled" ? doctorsRes.value : [];
        const docList: any[] = Array.isArray(rawDocs)
          ? rawDocs
          : (rawDocs as any)?.data?.data?.doctors || (rawDocs as any)?.data?.doctors || [];

        const rawServices = servicesRes.status === "fulfilled" ? servicesRes.value : [];
        const allServices: any[] = Array.isArray(rawServices)
          ? rawServices
          : (rawServices as any)?.data?.data?.treatments || (rawServices as any)?.data?.treatments || [];

        const decodedParam = decodeURIComponent(doctorParam).toLowerCase().trim();
        const targetSlug = slugify(decodedParam);

        // Match doctor by Slug, ID, or Name
        const found = docList.find((d) => {
          const dSlug = d.slug?.toLowerCase();
          const dNameSlug = slugify(d.name || "");
          const dId = String(d.id || "").toLowerCase();
          const dName = d.name?.toLowerCase().trim();

          return (
            dSlug === decodedParam ||
            dSlug === targetSlug ||
            dId === decodedParam ||
            dNameSlug === targetSlug ||
            dNameSlug === decodedParam ||
            dName === decodedParam
          );
        });

        const docName = found ? found.name : formatDoctorNameFromId(doctorParam);
        const docSpecialization =
          found?.specialty ||
          found?.specialization ||
          found?.qualification ||
          "Healthcare Provider";
        const rawPhoto = found?.imageUrl || found?.photoUrl || (found as any)?.image_url;
        const docPhoto = resolveImageUrl(rawPhoto, FALLBACK_DOCTOR_AVATAR);

        // Format procedures from CMS services
        const docTreatments: TreatmentItem[] = allServices.map((t: any) => ({
          id: String(t.id || t.slug || t.title),
          name: t.title || t.name || "Treatment Procedure",
          category: t.category || "Clinical Care",
          durationMinutes: t.durationMinutes || null,
          priceCents: t.price ? parseInt(t.price) * 100 : null,
          description: t.description || null,
        }));

        const defaultBio = `${docName} is a dedicated healthcare provider offering comprehensive, personalized care for patients and families.`;

        const doctorData: DoctorItem = {
          id: found?.id || doctorParam,
          name: docName,
          slug: found?.slug,
          specialization: docSpecialization,
          qualification: found?.qualification || null,
          yearsOfExperience: found?.yearsOfExperience || null,
          imageUrl: docPhoto,
          photoUrl: docPhoto,
          treatments: docTreatments,
          bio: parseEditorJs(found?.bio, defaultBio),
        };

        if (isMounted) {
          setDoctor(doctorData);
          setTreatments(docTreatments);
        }
      } catch (err) {
        console.error("Failed to load doctor details:", err);
        if (isMounted) {
          const fallbackName = formatDoctorNameFromId(doctorParam);
          setDoctor({
            id: doctorParam,
            name: fallbackName,
            specialization: "Healthcare Provider",
            imageUrl: FALLBACK_DOCTOR_AVATAR,
            photoUrl: FALLBACK_DOCTOR_AVATAR,
            bio: `${fallbackName} is committed to delivering comprehensive, personalized healthcare for patients and families across our community.`,
            treatments: [],
          });
          setTreatments([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (doctorParam) {
      fetchDoctorAndTreatments();
    }

    // These isMounted guards were read but never cleared, so
    // state could still be set after unmount.
    return () => {
      isMounted = false;
    };
  }, [doctorParam]);

  useGSAP(
    () => {
      gsap.fromTo(
        ".doctor-detail-header",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );

      gsap.fromTo(
        ".doctor-detail-body",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: "power2.out", clearProps: "all" }
      );

      if (treatments.length > 0) {
        gsap.fromTo(
          ".doctor-treatment-card",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: ".doctor-treatments-section",
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    },
    { scope: containerRef, dependencies: [loading, doctor?.id, treatments.length] }
  );

  if (loading && !doctor) {
    return (
      <main className="min-h-screen bg-white font-sans text-slate-900">
        <Header />
        <DetailSkeleton />
        <Footer />
      </main>
    );
  }

  const currentDoctor = doctor || {
    id: doctorParam,
    name: formatDoctorNameFromId(doctorParam),
    specialization: "Healthcare Provider",
    qualification: null,
    imageUrl: FALLBACK_DOCTOR_AVATAR,
    photoUrl: FALLBACK_DOCTOR_AVATAR,
    bio: "Dedicated healthcare provider committed to personalized patient care.",
    treatments: [],
  };

  const displayName = currentDoctor.name.toLowerCase().startsWith("dr")
    ? currentDoctor.name
    : `Dr. ${currentDoctor.name}`;

  return (
    <main ref={containerRef} className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      {/* Hero / Page Header: dual-tone diagonal split for a less flat band */}
      <section className="relative overflow-hidden bg-brand-deep min-h-[402px] md:min-h-[495px] pt-50 pb-[76px] md:pt-[250px] md:pb-[95px]">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-brand-deep via-brand-deep to-brand-dark"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-[65%] bg-gradient-to-bl from-brand-mid/70 via-brand/40 to-transparent [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]"
        />
        <div
          aria-hidden
          className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full bg-brand-soft/20 blur-3xl"
        />

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-10 space-y-5">
          <Breadcrumbs
            className="doctor-detail-header mb-2"
            tone="dark"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Providers', href: '/providers' },
              { label: currentDoctor.name },
            ]}
          />

          <div className="doctor-detail-header space-y-2 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-soft">
              {currentDoctor.specialization || "Healthcare Provider"}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              <HeroTitle text={currentDoctor.name} accentClassName="text-brand-soft" />
            </h1>
            {currentDoctor.qualification && (
              <p className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Award size={16} className="text-brand-soft" />
                <span>{currentDoctor.qualification}</span>
              </p>
            )}
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

      {/* Main Content Area: photo left, bio right */}
      <section className="doctor-detail-body pt-16 pb-4 max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-start">
          {/* Doctor Image */}
          <div className="w-full aspect-[4/5] lg:sticky lg:top-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm relative">
            <img
              src={currentDoctor.imageUrl || currentDoctor.photoUrl || FALLBACK_DOCTOR_AVATAR}
              alt={currentDoctor.name}
              crossOrigin="anonymous"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = FALLBACK_DOCTOR_AVATAR;
              }}
            />
          </div>

          {/* Overview / Bio Section */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              About {displayName}
            </h2>
            <div
              className="text-slate-600 text-base leading-relaxed space-y-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-1 [&_strong]:font-bold [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_li]:my-1"
              dangerouslySetInnerHTML={{ __html: currentDoctor.bio || "" }}
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <div className="doctor-cta-section max-w-[1400px] mx-auto px-6 pb-4">
        <CtaSection
          eyebrow="Book A Visit"
          title={`Ready to schedule with ${currentDoctor.name.split(" ")[0] || "our provider"}?`}
          description="Schedule an in-person or follow-up consultation at our clinic today."
          primary={{ label: 'Book Appointment', href: 'https://healow.com/apps/practice/texas-primary-pediatric-care-pllc-irving-tx-22218?v=2&t=1' }}
          secondary={{ label: 'Call 469-442-0202', href: 'tel:4694420202' }}
        />
      </div>

      <Footer />
    </main>
  );
}
