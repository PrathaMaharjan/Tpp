'use client';

import { MapPin, Phone } from 'lucide-react';

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
    id: 'bir-hospital',
    name: 'Bir Hospital Branch',
    address: 'Kanti Path, Kathmandu 44600, Nepal',
    phone: '+977 01-4221119',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.360157973713!2d85.3125219761168!3d27.706132976182103!2m3!1f0!f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1907b8b40885%3A0x2f60573719e782d4!2sBir%20Hospital!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp',
    directionsUrl: 'https://maps.google.com/?q=Bir+Hospital+Kathmandu',
  },
  {
    id: 'patan-branch',
    name: 'Patan Branch',
    address: 'Lagankhel, Lalitpur 44700, Nepal',
    phone: '+977 01-5522278',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.48624128031!2d85.3218523!3d27.6713331!2m3!1f0!f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19cd303e68e1%3A0x6b44f07a759e663a!2sPatan%20Hospital!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp',
    directionsUrl: 'https://maps.google.com/?q=Patan+Hospital+Lalitpur',
  },
];

export default function LocationsSection() {
  return (
    <section className="py-20 bg-slate-50/50 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 space-y-10">
        
        {/* Header (Matched exactly to Blog Section) */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#4fa1b0]">
            Our Locations
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Choose Your Preferred Location
          </h2>
          <div className="w-12 h-0.5 bg-[#4fa1b0] mx-auto rounded-full mt-2" />
        </div>

        {/* Scaled Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              
              {/* Map View Area */}
              <div className="relative w-full h-[400px] bg-slate-100">
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
                  href={`tel:${loc.phone.replace(/\s+/g, '')}`}
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