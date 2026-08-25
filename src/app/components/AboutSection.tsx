'use client';

import Link from 'next/link';
import { HeartPulse, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="relative py-24 bg-[#67bed9]/10 overflow-hidden font-sans">
      
      {/* Fully Contained Opaque Circles Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* Top-Left Opaque Circle */}
        <div className="absolute top-10 left-8 md:left-16 w-64 h-64 md:w-80 md:h-80 bg-[#67bed9]/20 rounded-full border border-[#4fa1b0]/20" />

        {/* Bottom-Right Opaque Circle */}
        <div className="absolute bottom-10 right-8 md:right-16 w-72 h-72 md:w-96 md:h-96 bg-[#4fa1b0]/15 rounded-full border border-[#2596be]/20" />

        {/* Small Decorative Floating Circles */}
        <div className="absolute top-1/3 right-24 w-16 h-16 bg-[#2596be]/15 rounded-full border border-[#2596be]/20 hidden sm:block" />
        <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-[#67bed9]/30 rounded-full hidden sm:block" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 space-y-16">
        
        {/* Header (Single-line title layout) */}
        <div className="text-center space-y-3 w-full mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight whitespace-nowrap">
            Comprehensive Care for Every Stage of Life
          </h2>
          <div className="w-12 h-0.5 bg-[#4fa1b0] mx-auto rounded-full mt-2" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="group bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 text-center flex flex-col items-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#67bed9]/15 flex items-center justify-center text-[#2596be] group-hover:bg-[#2596be] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
              <HeartPulse size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Pediatric &amp; Adult Care</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-normal">
              From newborn checkups to adult wellness exams and chronic disease management, we cover all your family’s health needs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 text-center flex flex-col items-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#67bed9]/15 flex items-center justify-center text-[#2596be] group-hover:bg-[#2596be] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Board-Certified Team</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-normal">
              Our experienced physicians and medical staff prioritize patient comfort, clear communication, and preventive medicine.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 text-center flex flex-col items-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#67bed9]/15 flex items-center justify-center text-[#2596be] group-hover:bg-[#2596be] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Multiple Locations</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-normal">
              Conveniently serving Las Colinas, Irving, and our newly opened 2nd location in Celina, TX with easy online booking.
            </p>
          </div>

        </div>

        {/* Bottom CTA Link */}
        <div className="text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2596be] hover:text-[#4fa1b0] transition-colors group"
          >
            <span>Learn more about our practice</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}