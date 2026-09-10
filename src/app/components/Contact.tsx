'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CtaSection from './CtaSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.contact-anim', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="w-full bg-surface px-6 md:px-10 pt-4 pb-8">
      <div className="contact-anim max-w-[1240px] mx-auto">
        <CtaSection
          eyebrow="Ready When You Are"
          title="Accepting New Patients at Both Texas Locations"
          description="Book online in under a minute, or send us a message and our team will help you find a time that works."
          primary={{ label: 'Book Appointment', href: 'https://healow.com/apps/practice/texas-primary-pediatric-care-pllc-irving-tx-22218?v=2&t=1' }}
          secondary={{ label: 'Contact Us', href: '/contact' }}
        />
      </div>
    </div>
  );
}
