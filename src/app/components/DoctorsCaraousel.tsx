"use client";

import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getPublicDoctors, slugify, type Doctor } from "../lib/api";
import { DoctorCardSkeleton } from "./Skeleton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

function resolveImageUrl(url?: string | null, fallback: string = FALLBACK_AVATAR): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanBase = CMS_URL.replace(/\/$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

export default function DoctorsCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Suspends the auto-scroll rAF loop entirely while the user drags or the
  // browser is mid-flight on a native/programmatic scroll animation, so the
  // two never fight over scrollLeft in the same frame.
  const userInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStateRef = useRef({ startX: 0, startScrollLeft: 0, moved: false });

  // Fetch active doctors from your CMS
  useEffect(() => {
    let isMounted = true;

    async function loadDoctors() {
      try {
        setLoading(true);
        const res: any = await getPublicDoctors();

        // Safe unpack for direct array or object wrappers
        const docList: Doctor[] = Array.isArray(res)
          ? res
          : res?.data?.data?.doctors || res?.data?.doctors || [];

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
  }, []);

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

  // Repeat for continuous smooth scroll
  const displayList = doctors.length > 0 ? [...doctors, ...doctors, ...doctors] : [];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || displayList.length === 0) return;

    let animationId: number;
    const maxSpeed = 0.8;
    const ease = 0.06;
    let currentSpeed = 0;

    const scroll = () => {
      if (container && !userInteractingRef.current) {
        const targetSpeed = isPaused ? 0 : maxSpeed;
        currentSpeed += (targetSpeed - currentSpeed) * ease;

        if (Math.abs(currentSpeed) > 0.01) {
          container.scrollLeft += currentSpeed;

          const maxScroll = container.scrollWidth / 3;
          if (container.scrollLeft >= maxScroll * 2) {
            container.scrollLeft -= maxScroll;
          } else if (container.scrollLeft <= 0) {
            container.scrollLeft += maxScroll;
          }
        }
      } else {
        // Keep the eased speed primed at 0 so resuming after an interaction
        // ramps back up smoothly instead of snapping to maxSpeed.
        currentSpeed = 0;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, displayList.length]);

  // Normalizes scrollLeft back into the middle copy of the tripled list so
  // dragging or clicking near either end never runs out of content. Uses a
  // modulo instead of a single fixed-size step so an unusually large drag
  // (e.g. a very fast trackpad flick) still lands back in range.
  const normalizeLoop = () => {
    const container = scrollRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth / 3;
    if (maxScroll <= 0) return;
    if (container.scrollLeft >= maxScroll * 2 || container.scrollLeft <= 0) {
      container.scrollLeft = maxScroll + (((container.scrollLeft - maxScroll) % maxScroll) + maxScroll) % maxScroll;
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    userInteractingRef.current = true;
    setIsPaused(true);

    const cardWidth = 336;
    const startX = container.scrollLeft;
    const targetX = startX + (direction === "left" ? -cardWidth : cardWidth);
    const duration = 450;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      container.scrollLeft = startX + (targetX - startX) * easeOutCubic(t);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        normalizeLoop();
        userInteractingRef.current = false;
        setIsPaused(false);
      }
    };

    requestAnimationFrame(step);
  };

  // Click-and-drag support (trackpad two-finger drag on the container also
  // works natively via horizontal scroll; this adds mouse click-drag).
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    userInteractingRef.current = true;
    dragStateRef.current = {
      startX: e.clientX,
      startScrollLeft: container.scrollLeft,
      moved: false,
    };
    container.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || !isDraggingRef.current) return;

    const dx = e.clientX - dragStateRef.current.startX;
    if (Math.abs(dx) > 3) dragStateRef.current.moved = true;

    container.scrollLeft = dragStateRef.current.startScrollLeft - dx;
  };

  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    normalizeLoop();
    userInteractingRef.current = false;
    setIsPaused(false);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    scrollRef.current?.releasePointerCapture(e.pointerId);
    endDrag();
  };

  return (
    <section ref={sectionRef} className="pt-8 pb-24 bg-surface overflow-hidden relative font-sans">
      <div className="relative z-10 max-w-[1400px] mx-auto pb-4">

        {/* Header: title + description left, "view all" right */}
        <div className="doctors-header px-6 md:px-12 mb-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-black">
              Our Team
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
              Compassionate &amp; <span className="text-brand">Experienced</span> Healthcare Providers
            </h2>
            <p className="text-sm text-slate-500 sm:text-base">
              Meet the physicians and pediatric specialists caring for your family.
            </p>
          </div>

          <Link
            href="/about"
            className="group relative inline-flex shrink-0 items-center gap-4 self-start overflow-hidden rounded-full bg-white pl-6 pr-2 py-2 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30 active:scale-[0.99] sm:self-auto"
          >
            <span className="absolute inset-0 h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand via-brand-mid to-brand-soft transition-transform duration-300 ease-out group-hover:scale-x-100" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              View all
            </span>
            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white transition-colors duration-300 group-hover:bg-white/20">
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        {/* Carousel Outer Wrapper: full-bleed, breaks out of the max-w container */}
        <div className="doctors-carousel-wrapper relative w-screen left-1/2 right-1/2 -translate-x-1/2">

          {/* Left Arrow Button */}
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-brand hover:border-brand/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous Doctor"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-brand hover:border-brand/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next Doctor"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Container */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              endDrag();
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="flex gap-6 overflow-x-auto py-6 px-4 md:px-12 no-scrollbar cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <div className="flex gap-6 py-6 px-4" aria-label="Loading">
                {[0, 1, 2].map((i) => (
                  <DoctorCardSkeleton key={i} index={i} />
                ))}
              </div>
            ) : displayList.length === 0 ? (
              <div className="w-full py-16 flex justify-center text-slate-400 text-sm">
                No doctors available at this time.
              </div>
            ) : (
              displayList.map((doc, idx) => {
                const photo = resolveImageUrl(doc.imageUrl || (doc as any).image_url, FALLBACK_AVATAR);
                const specialization = doc.specialty || (doc as any).specialization || "Specialist Provider";
                // Generates the correct target slug matching your /providers/[slug] route
                const targetSlug = doc.slug || slugify(doc.name) || doc.id;

                return (
                  <Link
                    key={`${doc.id}-${idx}`}
                    href={`/providers/${targetSlug}`}
                    onClick={(e) => {
                      if (dragStateRef.current.moved) e.preventDefault();
                    }}
                    className="group relative w-[280px] md:w-[300px] h-[400px] shrink-0 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 block cursor-pointer z-10"
                  >
                    {/* Doctor Photo */}
                    <img
                      src={photo}
                      alt={doc.name}
                      crossOrigin="anonymous"
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = FALLBACK_AVATAR;
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Accent line that grows on hover */}
                    <div className="absolute bottom-[76px] left-6 h-0.5 w-8 bg-brand-mid rounded-full transition-all duration-500 group-hover:w-14" />

                    {/* Name & specialization */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1 pointer-events-none">
                      <h3 className="text-lg font-bold text-white leading-snug drop-shadow-sm group-hover:text-brand-soft transition-colors">
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
