'use client';

import { useState } from 'react';
import { 
  Activity, 
  Baby, 
  Flame, 
  ArrowUpRight 
} from 'lucide-react';

type CategoryType = 'internal' | 'pediatrics' | 'endocrinology';

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const SERVICES: Record<CategoryType, Service[]> = {
  internal: [
    {
      id: 'im-1',
      title: 'Annual Physical & Wellness',
      description: 'Comprehensive annual preventative checkups to maintain long-term vital health.',
      imageUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'im-2',
      title: 'Adult Primary Care',
      description: 'Personalized ongoing medical management and routine preventative care.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'im-3',
      title: 'Chronic Disease Management',
      description: 'Dedicated treatments for high blood pressure, cholesterol, and diabetes.',
      imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'im-4',
      title: 'Labs & Diagnostics',
      description: 'In-house diagnostic testing and rapid bloodwork screening.',
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'im-5',
      title: 'Sick Visits & Urgent Care',
      description: 'Prompt evaluation and same-day scheduling for sudden illnesses.',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'im-6',
      title: "Women's Health",
      description: 'Tailored healthcare services including routine exams and preventive screenings.',
      imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a0d0a7a3b3?auto=format&fit=crop&q=80&w=600',
    },
  ],
  pediatrics: [
    {
      id: 'ped-1',
      title: 'Well Child Visits',
      description: 'Comprehensive checkups tracking developmental progress from infant to teen.',
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'ped-2',
      title: 'Newborn Care',
      description: 'Gentle, expert physical evaluations for new additions to your family.',
      imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'ped-3',
      title: 'Developmental Screening',
      description: 'In-depth assessments monitoring motor, speech, and cognitive milestones.',
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'ped-4',
      title: 'Pediatric Vaccinations',
      description: 'Protecting your child against preventable diseases with updated immunizations.',
      imageUrl: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cb9?auto=format&fit=crop&q=80&w=600',
    },
  ],
  endocrinology: [
    {
      id: 'endo-1',
      title: 'Diabetes Management',
      description: 'Comprehensive glucose monitoring, insulin planning, and lifestyle guidance.',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'endo-2',
      title: 'Thyroid Care',
      description: 'Diagnostics and targeted therapies for hypothyroidism and hyperthyroidism.',
      imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'endo-3',
      title: 'Metabolic & Obesity Care',
      description: 'Personalized programs focused on sustainable weight and health management.',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'endo-4',
      title: 'Osteoporosis Treatment',
      description: 'Advanced bone health evaluations and preventative bone density therapies.',
      imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600',
    },
  ],
};

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState<CategoryType>('internal');

  return (
    <section className="py-24 bg-slate-50/40 relative overflow-hidden font-sans">
      
      {/* SVG Background Wave with exact #4fa1b0 fill */}
      <div className="absolute top-0 right-0 w-full h-[600px] pointer-events-none z-0">
        <svg
          className="absolute top-0 right-0 w-full h-full text-[#4fa1b0]"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 H1440 V420 C1050,580 550,300 0,520 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 relative z-10 space-y-12">
        
        {/* Header - Styled for high legibility over #4fa1b0 */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-100/90">
            Our Specialties
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Comprehensive Medical Care
          </h2>
          <div className="w-12 h-0.5 bg-white/80 mx-auto rounded-full mt-2" />
        </div>

        {/* Minimal Floating Pills */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white shadow-sm border border-slate-200/80">
            <button
              onClick={() => setActiveTab('internal')}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'internal'
                  ? 'bg-[#2596be] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Internal Medicine
            </button>

            <button
              onClick={() => setActiveTab('pediatrics')}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'pediatrics'
                  ? 'bg-[#2596be] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Baby className="w-3.5 h-3.5" />
              Pediatrics
            </button>

            <button
              onClick={() => setActiveTab('endocrinology')}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'endocrinology'
                  ? 'bg-[#2596be] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Endocrinology
            </button>
          </div>
        </div>

        {/* Sleek 3-Column Grid with Full-Bleed Top Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {SERVICES[activeTab].map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Full-Bleed Top Image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#2596be] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs font-semibold text-[#2596be]">
                <span className="group-hover:text-slate-900 transition-colors">View details</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}