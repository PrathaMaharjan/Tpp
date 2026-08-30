'use client';

import { ShieldCheck } from 'lucide-react';

export default function AffiliationsSection() {
  return (
    <section className="py-10 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-5 px-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center sm:text-left">
          
          {/* Static Subtle Icon */}
          <div className="w-11 h-11 rounded-xl bg-[#2596be]/10 text-[#2596be] flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>

          {/* Statement */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4fa1b0]">
              Network Accreditation
            </span>
            <p className="text-sm md:text-base font-semibold text-slate-800 leading-snug">
              Proud Member of the{' '}
              <span className="text-[#2596be] font-bold">Southwestern Health Resources</span>{' '}
              Accountable Care Organization (ACO)
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}