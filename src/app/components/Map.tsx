'use client';

import { useRef } from 'react';
import { MapPin, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapEmbedUrl: string;
  directionsUrl: string;
}

const LOCATIONS: Location[] = [
  {
    id: 'irving-clinic',
    name: 'Las Colinas / Irving Clinic',
    address: '7429 Las Colinas Blvd Ste 101, Irving, TX 75063',
    phone: '469-442-0202',
    mapEmbedUrl:
      'https://www.google.com/maps?ll=32.908927,-96.954422&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=9990946045983830915&output=embed',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=7429+Las+Colinas+Blvd+Ste+101,+Irving,+TX+75063',
  },
  {
    id: 'celina-clinic',
    name: 'Celina Clinic',
    address: '3925 S Preston Rd Ste 100, Celina, TX 75009',
    phone: '469-442-0202',
    mapEmbedUrl:
      'https://www.google.com/maps?ll=33.270973,-96.785839&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=13749425199604245598&output=embed',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=3925+S+Preston+Rd+Ste+100,+Celina,+TX+75009',
  },
];

export default function LocationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 88%',
          once: true,
        },
      });

      tl.fromTo(
        '.locations-header',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }
      ).fromTo(
        '.location-card',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          clearProps: 'all',
        },
        '-=0.3'
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 bg-slate-50/50 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 space-y-10">

        {/* Header */}
        <div className="locations-header text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#4fa1b0]">
            Our Locations
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Choose Your Preferred Location
          </h2>
          <div className="w-12 h-0.5 bg-[#4fa1b0] mx-auto rounded-full mt-2" />
        </div>

        {/* Scaled Cards Grid */}
        <div className="locations-grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="location-card bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Map View Area */}
              <div className="relative w-full h-[360px] bg-slate-100">
                <iframe
                  title={loc.name}
                  src={loc.mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Footer Bar */}
              <div className="p-5 bg-white flex items-center justify-between gap-4 border-t border-slate-100">
                <div className="space-y-0.5">
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {loc.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <MapPin size={13} className="text-[#4fa1b0] shrink-0" />
                    <span>{loc.address}</span>
                  </div>
                </div>

                <a
                  href={`tel:${loc.phone.replace(/[^0-9]/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#4fa1b0]/40 text-[#4fa1b0] hover:bg-[#4fa1b0] hover:text-white transition-all text-xs font-semibold shrink-0"
                >
                  <Phone size={13} />
                  <span>{loc.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}