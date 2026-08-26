"use client";

import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { getPublicDoctors } from "../lib/api";

interface Doctor {
  id: string;
  name: string;
  specialization?: string | null;
  qualification?: string | null;
  imageUrl?: string | null;
  photoUrl?: string | null;
}

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400";

export default function DoctorsCarousel({ locationId }: { locationId?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors dynamically from DMS
  useEffect(() => {
    let isMounted = true;

    async function loadDoctors() {
      try {
        setLoading(true);
        const res = await getPublicDoctors({ locationId });
        const docList: Doctor[] = res?.data?.data?.doctors || [];

        if (isMounted) {
          setDoctors(docList);
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDoctors();
    return () => {
      isMounted = false;
    };
  }, [locationId]);

  // Repeat for continuous scroll if items exist
  const displayList = doctors.length > 0 ? [...doctors, ...doctors, ...doctors] : [];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || displayList.length === 0) return;

    let animationId: number;
    const speed = 0.8;

    const scroll = () => {
      if (!isPaused && container) {
        container.scrollLeft += speed;

        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll * 2) {
          container.scrollLeft -= maxScroll;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += maxScroll;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, displayList.length]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    setIsPaused(true);

    const cardWidth = 344;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => {
      setIsPaused(false);
    }, 400);
  };

  return (
    <section className="py-24 bg-white overflow-hidden relative font-sans">
      <div className="relative z-10 max-w-[1400px] mx-auto pb-12">
        
        {/* Header */}
        <div className="px-6 text-center space-y-3 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Compassionate &amp; Experienced Healthcare Providers
          </h2>
          <div className="w-12 h-0.5 bg-[#4fa1b0] mx-auto rounded-full mt-2" />
        </div>

        {/* Carousel Outer Wrapper */}
        <div className="relative px-4 md:px-12">
          
          {/* Left Arrow Button */}
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-[#2596be] hover:border-[#2596be]/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous Doctor"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-[#2596be] hover:border-[#2596be]/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next Doctor"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Container */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-6 overflow-x-auto scroll-smooth py-6 px-4 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <div className="w-full py-16 flex justify-center text-slate-400 text-sm">
                Loading doctors...
              </div>
            ) : displayList.length === 0 ? (
              <div className="w-full py-16 flex justify-center text-slate-400 text-sm">
                No doctors available at this time.
              </div>
            ) : (
              displayList.map((doc, idx) => {
                const photo = doc.imageUrl || doc.photoUrl || FALLBACK_AVATAR;
                const specialization = doc.specialization || doc.qualification || "General Dentistry";

                return (
                  <div
                    key={`${doc.id}-${idx}`}
                    className="w-[300px] md:w-[320px] bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-8 shrink-0 text-center space-y-5 transform hover:-translate-y-1"
                  >
                    {/* Circular Avatar with Fallback */}
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
                      <img
                        src={photo}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                        }}
                      />
                    </div>

                    {/* Name & Title */}
                    <div className="space-y-1.5 min-h-[72px] flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {doc.name}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-[240px] mx-auto font-normal">
                        {specialization}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* SVG Background Wave */}
      <div className="absolute bottom-0 left-0 w-full h-[480px] pointer-events-none z-0">
        <svg
          className="absolute bottom-0 left-0 w-full h-full text-[#4fa1b0]"
          viewBox="0 0 1440 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160 C320,40 720,240 1440,80 V480 H0 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
