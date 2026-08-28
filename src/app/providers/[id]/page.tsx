"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Stethoscope } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getPublicDoctors, slugify } from "../../lib/api";

interface DoctorItem {
  id: string;
  name: string;
  specialization?: string | null;
  qualification?: string | null;
  imageUrl?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  about?: string | null;
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
  const params = useParams();
  const doctorId = (params?.id as string) || "";

  const [doctor, setDoctor] = useState<DoctorItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDoctorDetails() {
      try {
        setLoading(true);
        const res = await getPublicDoctors();
        const docList: any[] = res?.data?.data?.doctors || [];
        const decodedParam = decodeURIComponent(doctorId).toLowerCase().trim();
        const targetSlug = slugify(decodedParam);

        const found = docList.find((d) => {
          const nameSlug = slugify(d.name);
          return (
            String(d.id).toLowerCase() === decodedParam ||
            nameSlug === targetSlug ||
            nameSlug === decodedParam ||
            d.name.toLowerCase() === decodedParam ||
            d.name.toLowerCase().replace(/\s+/g, "-") === decodedParam
          );
        });

        const docName = found ? found.name : formatDoctorNameFromId(doctorId);
        const docSpecialization =
          found?.specialization || found?.qualification || "Primary Care & Pediatrics";
        const docPhoto = found?.imageUrl || found?.photoUrl || FALLBACK_DOCTOR_AVATAR;

        const doctorData: DoctorItem = {
          id: found?.id || doctorId,
          name: docName,
          specialization: docSpecialization,
          qualification: found?.qualification || null,
          imageUrl: docPhoto,
          photoUrl: docPhoto,
          bio:
            found?.bio ||
            found?.about ||
            `${docName} is a compassionate healthcare provider at Texas Primary & Pediatric Care, dedicated to delivering patient-centered, high-quality medical care. ${docName} works closely with individuals and families to support long-term wellness, preventive health, and personalized care plans.`,
        };

        if (isMounted) {
          setDoctor(doctorData);
        }
      } catch (err) {
        console.error("Failed to load doctor details:", err);
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
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

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
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      {/* Hero / Page Header */}
      <section className="relative bg-[#eaf4f6] pt-40 pb-20">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 space-y-5">


          <div className="space-y-2 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#4fa1b0]">
              {currentDoctor.specialization || "Healthcare Provider"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {currentDoctor.name}
            </h1>
            {currentDoctor.qualification && (
              <p className="text-sm font-medium text-slate-600">
                {currentDoctor.qualification}
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
      <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-10 space-y-10">
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
            About {currentDoctor.name.toLowerCase().startsWith("dr") ? currentDoctor.name : `Dr. ${currentDoctor.name}`}
          </h2>
          <div
            className="text-slate-600 text-base leading-relaxed space-y-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-1 [&_strong]:font-bold [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: currentDoctor.bio || "" }}
          />
        </div>

      </section>

      {/* Bottom CTA Section (Matching Services Page) */}
      <section className="bg-[#eaf4f6] py-20 mt-12">
        <div className="max-w-2xl mx-auto text-center space-y-4 px-6">
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
