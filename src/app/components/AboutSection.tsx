'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { HeartPulse, ShieldCheck, ArrowRight, Baby, User, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGES = [
  { label: 'Newborn', icon: Baby, tint: '#67bed9' },
  { label: 'Child', icon: Users, tint: '#4fa1b0' },
  { label: 'Adult', icon: User, tint: '#2596be' },
  { label: 'Senior', icon: User, tint: '#1d7a94' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Clean, single-pass trigger that avoids transition-all conflicts
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      tl.fromTo(
        '.about-header',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'transform,opacity' }
      )
        .fromTo(
          '.stage-item',
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          '-=0.2'
        )
        .fromTo(
          '.about-card-wrapper',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          '-=0.1'
        )
        .fromTo(
          '.about-cta',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform,opacity' },
          '-=0.2'
        );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 bg-[#67bed9]/10 overflow-hidden font-sans">

      {/* Signature background: a life-stages arc rather than decorative blobs */}
      <svg
        className="absolute inset-x-0 top-0 w-full h-[420px] opacity-[0.35] pointer-events-none"
        viewBox="0 0 1400 420"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M -50 380 C 300 380, 350 60, 700 60 C 1050 60, 1100 380, 1450 380"
          stroke="#4fa1b0"
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="about-header text-center space-y-3 mb-20 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Comprehensive Care for Every Stage of Life
          </h2>
          <div className="w-12 h-0.5 bg-[#4fa1b0] mx-auto rounded-full mt-2" />
        </div>

        {/* Life-stages strip */}
        <div className="stages-container relative mb-20">
          <div className="absolute left-0 right-0 top-6 h-px bg-gradient-to-r from-[#67bed9]/0 via-[#4fa1b0]/40 to-[#2596be]/0 hidden sm:block" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4">
            {STAGES.map(({ label, icon: Icon, tint }) => (
              <div key={label} className="stage-item group flex flex-col items-center text-center gap-3 cursor-pointer">
                <div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm ring-4 ring-[#67bed9]/10 transition-all duration-300 group-hover:scale-110 group-hover:ring-[#67bed9]/25 group-hover:shadow-md"
                  style={{ backgroundColor: tint }}
                >
                  <Icon size={20} />
                </div>
                <span className="text-sm font-semibold text-slate-600 transition-colors duration-300 group-hover:text-[#2596be]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature pair: wrapped in animation containers to prevent CSS transition conflicts */}
        <div className="about-features-grid grid grid-cols-1 md:grid-cols-5 gap-6 mb-14">

          {/* Left Card 3-cols */}
          <div className="about-card-wrapper md:col-span-3">
            <div className="group relative h-full bg-gradient-to-br from-white to-[#67bed9]/10 rounded-2xl border border-slate-200/80 p-8 sm:p-10 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-[#2596be]/30 transition-all duration-300">
              {/* Decorative glow */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#67bed9]/20 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125 pointer-events-none" />

              <div className="relative w-14 h-14 rounded-2xl bg-[#67bed9]/15 flex items-center justify-center text-[#2596be] mb-6 transition-all duration-300 group-hover:bg-[#2596be] group-hover:text-white group-hover:-rotate-6 group-hover:scale-110">
                <HeartPulse size={26} />
              </div>
              <h3 className="relative text-2xl font-bold text-slate-900 mb-3 tracking-tight">Pediatric &amp; adult care, under one roof</h3>
              <p className="relative text-slate-600 leading-relaxed max-w-md">
                From newborn checkups to adult wellness exams and chronic disease management,
                we cover your family's health needs at any age.
              </p>
            </div>
          </div>

          {/* Right Card 2-cols */}
          <div className="about-card-wrapper md:col-span-2">
            <div className="group relative h-full bg-gradient-to-br from-[#2596be] to-[#1d7a94] rounded-2xl p-8 sm:p-10 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Decorative rings */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full border border-white/10 pointer-events-none" />

              <div className="relative w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-white mb-6 transition-all duration-300 group-hover:bg-white group-hover:text-[#2596be] group-hover:rotate-6 group-hover:scale-110">
                <ShieldCheck size={26} />
              </div>
              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Board-certified team</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Physicians and staff who prioritize comfort, clear communication, and
                  preventive medicine.
                </p>
              </div>
            </div>
          </div>

        </div>
        
        <div className="about-cta flex justify-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2596be] hover:text-[#4fa1b0] transition-colors group shrink-0"
          >
            <span>Learn more about our practice</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}