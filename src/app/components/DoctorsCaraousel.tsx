"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { getPublicDoctors, slugify } from "../lib/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Doctor {
  id: string;
  name: string;
  specialization?: string | null;
  qualification?: string | null;
  imageUrl?: string | null;
  photoUrl?: string | null;
}

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800";

export default function DoctorsCarousel({ locationId }: { locationId?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
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

  useGSAP(
    () => {
      gsap.fromTo(
        ".doctors-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );

      if (!loading && doctors.length > 0) {
        gsap.fromTo(
          ".doctors-carousel-wrapper",
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [loading, doctors.length] }
  );

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

    const cardWidth = 336;
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
    <section ref={sectionRef} className="py-24 bg-slate-50 overflow-hidden relative font-sans">
      <div className="relative z-10 max-w-[1400px] mx-auto pb-4">

        {/* Header */}
        <div className="doctors-header px-6 text-center space-y-3 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Compassionate &amp; Experienced Healthcare Providers
          </h2>
          <div className="w-12 h-0.5 bg-[#4fa1b0] mx-auto rounded-full mt-2" />
        </div>

        {/* Carousel Outer Wrapper */}
        <div className="doctors-carousel-wrapper relative px-4 md:px-12">

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
                const specialization = doc.specialization || doc.qualification || "Primary Care & Pediatrics";

                return (
                  <Link
                    href={`/providers/${slugify(doc.name) || doc.id}`}
                    key={`${doc.id}-${idx}`}
                    className="group relative w-[280px] md:w-[300px] h-[400px] shrink-0 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 block cursor-pointer"
                  >
                    {/* Full-bleed image */}
                    <img
                      src={photo}
                      alt={doc.name}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                    {/* Accent line that grows on hover */}
                    <div className="absolute bottom-[76px] left-6 h-0.5 w-8 bg-[#4fa1b0] rounded-full transition-all duration-500 group-hover:w-14" />

                    {/* Name & specialization */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
                      <h3 className="text-lg font-bold text-white leading-snug drop-shadow-sm group-hover:text-[#67bed9] transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-white/75 text-xs leading-relaxed font-normal">
                        {specialization}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

        </div>

      </div>
    </section>
  );
}