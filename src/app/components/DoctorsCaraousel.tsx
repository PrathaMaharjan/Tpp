'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface Doctor {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
}

const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Bishwas Upadhyay, MD',
    title: 'Primary Care Doctor',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'Amit Bajaj, MD',
    title: 'Board Certified Pediatrician',
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    name: 'Priyanka Agarwal, MD',
    title: 'Endocrinology, Diabetes and Thyroid Specialist',
    imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a0d0a7a3b3?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '4',
    name: 'Leena Shrestha, APRN, FNP-C',
    title: 'Board-Certified Family Nurse Practitioner',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '5',
    name: 'Charulata Seshadri, APRN, FNP-C',
    title: 'Board-Certified Family Nurse Practitioner',
    imageUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '6',
    name: 'Suja Indira, APRN, FNP-C',
    title: 'Certified Family Nurse Practitioner',
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
  },
];

export default function DoctorsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const duplicatedDoctors = [...DOCTORS, ...DOCTORS, ...DOCTORS];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

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
  }, [isPaused]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    setIsPaused(true);

    const cardWidth = 344;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
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
            onClick={() => handleScroll('left')}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-[#2596be] hover:border-[#2596be]/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Previous Doctor"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-md hover:shadow-lg text-slate-700 hover:text-[#2596be] hover:border-[#2596be]/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
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
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {duplicatedDoctors.map((doc, idx) => (
              <div
                key={`${doc.id}-${idx}`}
                className="w-[300px] md:w-[320px] bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-8 shrink-0 text-center space-y-5 transform hover:-translate-y-1"
              >
                {/* Circular Avatar */}
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm bg-slate-50">
                  <img
                    src={doc.imageUrl}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Name & Title */}
                <div className="space-y-1.5 min-h-[72px] flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {doc.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-[240px] mx-auto font-normal">
                    {doc.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* SVG Background Wave with exact #4fa1b0 fill */}
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