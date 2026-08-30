'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.contact-anim', {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/hero-1.jpeg"
        alt="Contact background"
        fill
        className="object-cover object-center z-0 scale-105"
        priority
      />

      {/* Dark Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-black/55 z-[1]" />

      {/* Main Content */}
      <div ref={contentRef} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 text-center space-y-6">
        <h2 className="contact-anim text-3xl md:text-5xl font-bold text-white tracking-tight">
          Ready to Visit Us?
        </h2>
        <p className="contact-anim text-white/90 max-w-xl mx-auto text-base md:text-lg">
          We are accepting new patients at all of our locations. Schedule your appointment online today.
        </p>

        <div className="contact-anim flex items-center justify-center pt-2">
          <Link
            href="/contact"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2596be]/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Calendar size={16} />
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
}