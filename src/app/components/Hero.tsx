'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const HERO_IMAGES = [
  '/hero-1.jpeg',
  '/hero-2.jpeg',
  '/hero-3.png',
  '/hero-4.png',
  '/hero-5.jpeg',
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-headline', {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
      })
        .from(
          '.hero-subtext',
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        .from(
          '.hero-btn',
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.7,
            ease: 'back.out(1.7)',
          },
          '-=0.4'
        );
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image Carousel */}
      {HERO_IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />

      {/* Manual Arrow Controls */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-[#4fa1b0] hover:text-white text-slate-700 transition-all duration-300 border border-slate-200 shadow-sm hidden md:flex"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-[#4fa1b0] hover:text-white text-slate-700 transition-all duration-300 border border-slate-200 shadow-sm hidden md:flex"
      >
        <ChevronRight size={20} />
      </button>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-36 pb-20">
        <div className="max-w-2xl space-y-6">
          <h1 className="hero-headline text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            Texas Primary & <br />
            <span className="text-[#67bed9]">Pediatric Care</span>
          </h1>

          <p className="hero-subtext text-lg md:text-xl text-white/90 font-normal leading-relaxed">
            Dedicated primary care providers and pediatric specialists located in Las Colinas, Irving, and Celina, TX.
          </p>

          <div className="hero-btn">
            <Link
              href="/booking"
              className="group relative inline-flex items-center gap-4 pl-6 pr-2 py-2 rounded-full bg-white text-slate-900 text-sm font-semibold shadow-lg hover:shadow-lg hover:shadow-[#2596be]/30 active:scale-[0.99] transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Gradient Fill Background Overlay on Hover */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left rounded-full" />

              {/* Button Text */}
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Book an Appointment
              </span>

              {/* Arrow Circle Icon Badge */}
              <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#2596be] group-hover:bg-white/20 text-white transition-colors duration-300">
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-[#4fa1b0]' : 'w-2 bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}