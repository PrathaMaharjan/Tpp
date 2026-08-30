"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Stethoscope,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
  specialization?: string | null;
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

// Helper to format clean doctor name from any ID or slug
function formatDoctorNameFromId(id: string) {
  if (!id) return "Healthcare Provider";
  const cleaned = decodeURIComponent(id)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return cleaned.toLowerCase().startsWith("dr") ? cleaned : `Dr. ${cleaned}`;
}

export default function DoctorDetailPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const doctorId = (params?.id as string) || "";

  const [doctor, setDoctor] = useState<DoctorItem | null>(null);
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDoctorAndTreatments() {
      try {
        setLoading(true);

        // Fetch doctors and all public treatments in parallel
        const [doctorsRes, servicesRes] = await Promise.allSettled([
          getPublicDoctors(),
          getPublicServices ? getPublicServices() : Promise.resolve(null),
        ]);

        const docList: any[] =
          doctorsRes.status === "fulfilled"
            ? doctorsRes.value?.data?.data?.doctors || doctorsRes.value?.data?.doctors || []
            : [];

        const allServices: any[] =
          servicesRes.status === "fulfilled" && servicesRes.value
            ? servicesRes.value?.data?.data?.treatments ||
              servicesRes.value?.data?.treatments ||
              servicesRes.value?.data ||
              []
            : [];

        const decodedParam = decodeURIComponent(doctorId).toLowerCase().trim();
        const targetSlug = slugify(decodedParam);

        // Match doctor by ID or Slug or Name
        const found = docList.find((d) => {
          const nameSlug = slugify(d.name || "");
          return (
            String(d.id).toLowerCase() === decodedParam ||
            nameSlug === targetSlug ||
            nameSlug === decodedParam ||
            d.name?.toLowerCase() === decodedParam ||
            d.name?.toLowerCase().replace(/\s+/g, "-") === decodedParam
          );
        });

        const docName = found ? found.name : formatDoctorNameFromId(doctorId);
        const docSpecialization =
          found?.specialization || found?.qualification || "Primary Care & Pediatrics";
        const docPhoto = found?.imageUrl || found?.photoUrl || FALLBACK_DOCTOR_AVATAR;

        // Resolve treatments assigned to this doctor
        let docTreatments: TreatmentItem[] = [];

        // 1. Check if treatments are directly attached to doctor object
        if (Array.isArray(found?.treatments) && found.treatments.length > 0) {
          docTreatments = found.treatments.map((t: any) => ({
            id: String(t.id || t.treatmentId || t.name),
            name: t.name || t.title || "Treatment Procedure",
            category: t.category || null,
            durationMinutes: t.durationMinutes || null,
            priceCents: t.priceCents || null,
            description: t.description || null,
          }));
        }
        // 2. Cross-reference from public treatments list if doctorIds match
        else if (found?.id && Array.isArray(allServices) && allServices.length > 0) {
          const matchedFromServices = allServices.filter((service: any) => {
            const hasDoctorId = service.doctorIds?.includes(found.id);
            const hasDoctorObj = service.doctors?.some(
              (doc: any) => doc.id === found.id || doc.name === found.name
            );
            return hasDoctorId || hasDoctorObj;
          });

          if (matchedFromServices.length > 0) {
            docTreatments = matchedFromServices.map((t: any) => ({
              id: String(t.id || t.name),
              name: t.name || t.title,
              category: t.category || null,
              durationMinutes: t.durationMinutes || null,
              priceCents: t.priceCents || null,
              description: t.description || null,
            }));
          }
        }

        const doctorData: DoctorItem = {
          id: found?.id || doctorId,
          name: docName,
          specialization: docSpecialization,
          qualification: found?.qualification || null,
          yearsOfExperience: found?.yearsOfExperience || null,
          imageUrl: docPhoto,
          photoUrl: docPhoto,
          treatments: docTreatments,
          bio:
            found?.bio ||
            found?.bioHtml ||
            found?.about ||
            `${docName} is a compassionate healthcare provider at Texas Primary & Pediatric Care, dedicated to delivering patient-centered, high-quality medical care. ${docName} works closely with individuals and families to support long-term wellness, preventive health, and personalized care plans.`,
        };

        if (isMounted) {
          setDoctor(doctorData);
          setTreatments(docTreatments);
        }
      } catch (err) {
        console.error("Failed to load doctor details & treatments:", err);
        if (isMounted) {
          const fallbackName = formatDoctorNameFromId(doctorId);
          setDoctor({
            id: doctorId,
            name: fallbackName,
            specialization: "Primary Care & Pediatrics",
            qualification: null,
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

    if (doctorId) {
      fetchDoctorAndTreatments();
    }
  }, [doctorId]);

  useGSAP(
    () => {
      // Header Animation
      gsap.fromTo(
        ".doctor-detail-header",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );

      // Body Image & Bio Animation
      gsap.fromTo(
        ".doctor-detail-body",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: "power2.out", clearProps: "all" }
      );

      // Treatments Grid Animation
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

      // Bottom CTA Section ScrollTrigger
      gsap.fromTo(
        ".doctor-cta-block",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".doctor-cta-section",
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [loading, doctor?.id, treatments.length] }
  );

  if (loading && !doctor) {
    return (
      <main className="min-h-screen bg-white font-sans text-slate-900">
        <Header />
        <div className="pt-48 pb-32 text-center text-slate-400 text-sm font-medium">
          Loading provider profile...
        </div>
        <Footer />
      </main>
    );
  }

  const currentDoctor = doctor || {
    id: doctorId,
    name: formatDoctorNameFromId(doctorId),
    specialization: "Primary Care & Pediatrics",
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

      {/* Hero / Page Header */}
      <section className="relative bg-[#eaf4f6] pt-40 pb-20">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 space-y-5">
          <div className="doctor-detail-header space-y-2 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#4fa1b0]">
              {currentDoctor.specialization || "Healthcare Provider"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {currentDoctor.name}
            </h1>
            {currentDoctor.qualification && (
              <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Award size={16} className="text-[#2596be]" />
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

      {/* Main Content Area */}
      <section className="doctor-detail-body py-12 max-w-[1000px] mx-auto px-6 md:px-10 space-y-12">
        {/* Doctor Image */}
        <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm relative">
          <img
            src={currentDoctor.imageUrl || currentDoctor.photoUrl || FALLBACK_DOCTOR_AVATAR}
            alt={currentDoctor.name}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_DOCTOR_AVATAR;
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

        {/* Treatments & Specialized Procedures Section */}
        <div className="doctor-treatments-section pt-6 border-t border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
             
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Treatments & Procedures
              </h2>
            </div>
      
          </div>

          {treatments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {treatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className="doctor-treatment-card group relative bg-white border border-slate-200/90 hover:border-[#4fa1b0] rounded-xl p-5 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#eaf4f6] text-[#2596be] group-hover:bg-[#2596be] group-hover:text-white flex items-center justify-center transition-colors duration-200">
                        <Stethoscope size={20} />
                      </div>
                      {treatment.durationMinutes && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          <Clock size={12} />
                          {treatment.durationMinutes} mins
                        </span>
                      )}
                    </div>

                    <div>
                      {treatment.category && (
                        <span className="text-[11px] font-semibold tracking-wider text-[#4fa1b0] uppercase block mb-1">
                          {treatment.category}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2596be] transition-colors leading-snug">
                        {treatment.name}
                      </h3>
                      {treatment.description && (
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {treatment.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                 
                    <Link
                      href={`/booking?dentist=${encodeURIComponent(currentDoctor.name)}&service=${encodeURIComponent(treatment.name)}`}
                      className="inline-flex items-center gap-1 text-[#2596be] group-hover:text-[#1e7898] transition-colors"
                    >
                      <span>Book Treatment</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-8 text-center space-y-3">
              <Stethoscope className="mx-auto text-slate-400" size={32} />
              <p className="text-sm font-medium text-slate-700">
                {displayName} provides comprehensive primary care, pediatric health consultations, and preventive treatments.
              </p>
              
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="doctor-cta-section bg-[#eaf4f6] py-20 mt-12">
        <div className="doctor-cta-block max-w-2xl mx-auto text-center space-y-4 px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Ready to schedule with {currentDoctor.name.split(" ")[0] || "our provider"}?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Schedule an in-person or follow-up consultation at our clinic today.
          </p>

          <Link
            href={`/booking?dentist=${encodeURIComponent(currentDoctor.name)}`}
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
