'use client';

import { useRef, useState } from 'react';
import { MapPin, Phone, Printer, Clock, Navigation } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BgMotif from './BgMotif';
import Select from './Select';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Location {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  fax: string;
  hours: string;
  mapEmbedUrl: string;
  directionsUrl: string;
}

const LOCATIONS: Location[] = [
  {
    id: 'irving-clinic',
    name: 'Las Colinas / Irving Clinic',
    city: 'Irving',
    address: '7429 Las Colinas Blvd Ste 101, Irving, TX 75063',
    phone: '469-442-0202',
    fax: '469-372-6188',
    hours: 'Mon–Fri 8:30 am – 7:00 pm · Sat 10:00 am – 3:30 pm (by appt)',
    mapEmbedUrl:
      'https://www.google.com/maps?ll=32.908927,-96.954422&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=9990946045983830915&output=embed',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=7429+Las+Colinas+Blvd+Ste+101,+Irving,+TX+75063',
  },
  {
    id: 'celina-clinic',
    name: 'Celina Clinic',
    city: 'Celina',
    address: '3925 S Preston Rd Ste 100, Celina, TX 75009',
    phone: '469-442-0202',
    fax: '469-372-6188',
    hours: 'Mon–Fri 8:30 am – 5:30 pm · Sat & Sun Closed',
    mapEmbedUrl:
      'https://www.google.com/maps?ll=33.270973,-96.785839&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=13749425199604245598&output=embed',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=3925+S+Preston+Rd+Ste+100,+Celina,+TX+75009',
  },
];

export default function LocationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState(LOCATIONS[0].id);

  const selected =
    LOCATIONS.find((loc) => loc.id === selectedId) ?? LOCATIONS[0];

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
        '.locations-body',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', clearProps: 'all' },
        '-=0.3'
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative pt-20 pb-10 bg-surface overflow-hidden font-sans">
      <BgMotif variant="family" side="right" position="center" opacity={0.05} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 space-y-10">

        {/* Header */}
        <div className="locations-header text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-mid">
            Our Locations
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Choose Your Preferred Location
          </h2>
          <div className="w-12 h-0.5 bg-brand-mid mx-auto rounded-full mt-2" />
        </div>

        <div className="locations-body max-w-4xl mx-auto space-y-8">

          {/* Location switcher — tabs on desktop */}
          <div
            role="tablist"
            aria-label="Select a clinic location"
            className="hidden sm:grid grid-cols-2 gap-3 max-w-lg mx-auto"
          >
            {LOCATIONS.map((loc) => {
              const isActive = loc.id === selected.id;

              return (
                <button
                  key={loc.id}
                  role="tab"
                  id={`tab-${loc.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${loc.id}`}
                  onClick={() => setSelectedId(loc.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-brand border-brand text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-brand-mid/50 hover:text-brand'
                  }`}
                >
                  <MapPin size={15} className="shrink-0" />
                  <span>{loc.city}</span>
                </button>
              );
            })}
          </div>

          {/* Location switcher — native select on mobile */}
          <div className="sm:hidden max-w-xs mx-auto">
            <label htmlFor="location-select" className="sr-only">
              Select a clinic location
            </label>
            <Select
              id="location-select"
              value={selected.id}
              onChange={setSelectedId}
              aria-label="Select a clinic location"
              options={LOCATIONS.map((loc) => ({
                value: loc.id,
                label: `${loc.city} — ${loc.name}`,
              }))}
            />
          </div>

          {/* Details panel */}
          <div
            role="tabpanel"
            id={`panel-${selected.id}`}
            aria-labelledby={`tab-${selected.id}`}
            className="grid md:grid-cols-[20%_44%_36%] gap-6 md:gap-10 border-t border-slate-200 pt-8"
          >
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
                Details
              </h3>
              <p className="mt-1.5 text-sm font-semibold text-slate-800">
                {selected.name}
              </p>
            </div>

            {/* Address & hours */}
            <div className="grid gap-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-mid"
                  strokeWidth={1.75}
                />
                <span className="leading-relaxed">{selected.address}</span>
              </div>

              <div className="flex items-start gap-3">
                <Clock
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-mid"
                  strokeWidth={1.75}
                />
                <span className="leading-relaxed">{selected.hours}</span>
              </div>

              <a
                href={selected.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
              >
                <Navigation size={13} />
                <span>Driving Directions</span>
              </a>
            </div>

            {/* Contact */}
            <div className="grid gap-2.5 content-start text-sm text-slate-700">
              <a
                href={`tel:${selected.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-3 hover:text-brand transition-colors"
              >
                <Phone
                  size={18}
                  className="shrink-0 text-brand-mid"
                  strokeWidth={1.75}
                />
                <span className="font-semibold">{selected.phone}</span>
              </a>

              <div className="flex items-center gap-3 text-slate-500">
                <Printer
                  size={18}
                  className="shrink-0 text-brand-mid"
                  strokeWidth={1.75}
                />
                <span className="text-xs">fax: {selected.fax}</span>
              </div>
            </div>
          </div>

          {/* Map for the selected location */}
          <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-sm">
            <iframe
              key={selected.id}
              title={selected.name}
              src={selected.mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
