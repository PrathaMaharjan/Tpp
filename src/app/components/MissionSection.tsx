'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BgMotif from './BgMotif';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MissionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate text column
      gsap.from('.mission-text-item', {
        scrollTrigger: {
          trigger: textColRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Animate image card with gentle scale
      gsap.from(imageColRef.current, {
        scrollTrigger: {
          trigger: imageColRef.current,
          start: 'top 80%',
        },
        x: 50,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
      });

      // Floating background glow pulse
      gsap.to('.mission-blob', {
        scale: 1.15,
        opacity: 0.18,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-white overflow-hidden font-sans">
      {/* Background Soft Organic Blob Accent (Top Right) */}
      <div
        className="mission-blob absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 rounded-bl-[120px] rounded-tl-[300px] pointer-events-none -z-0 blur-2xl transition-transform"
      />

      <BgMotif variant="stethoscope" side="left" position="bottom" opacity={0.04} />

      <div className="max-w-[1240px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Mission Text Content */}
          <div ref={textColRef} className="lg:col-span-6 space-y-6">
            <span className="mission-text-item inline-block text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-brand">
              Our Mission
            </span>

            <h2 className="mission-text-item font-display text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 leading-[1.2] tracking-tight">
              Personalized, high-quality care dedicated to your health
            </h2>

            <p className="mission-text-item text-slate-600 text-base md:text-lg leading-relaxed font-normal">
              Our mission is to provide you with personalized, high-quality care. We are dedicated to improving and maintaining your health through preventative care and treating chronic diseases.
            </p>
          </div>

          {/* Right Column: Local Image */}
          <div ref={imageColRef} className="lg:col-span-6 relative">
            {/* Decorative corner accents behind image */}
            <div aria-hidden className="absolute inset-0 translate-x-3 -translate-y-3 rounded-3xl bg-brand rotate-2" />
            <div aria-hidden className="absolute inset-0 -translate-x-3 translate-y-3 rounded-3xl bg-brand-soft -rotate-2" />

            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl bg-white">
              <Image
                src="/hero-2.webp"
                alt="Our Mission"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}