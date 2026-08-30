"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Printer,
  Mail,
  ExternalLink,
  Navigation,
} from "lucide-react";

interface LocationData {
  id: string;
  name: string;
  shortName: string;
  address1: string;
  address2: string;
  cityStateZip: string;
  fullAddress: string;
  phone: string;
  fax: string;
  email: string;
  mapEmbedUrl: string;
  mapUrl: string;
  directionsUrl: string;
  hours: { day: string; time: string; note?: string }[];
}

const locations: LocationData[] = [
  {
    id: "irving",
    name: "Texas Primary & Pediatric Care - Irving",
    shortName: "Las Colinas / Irving Clinic",
    address1: "7429 Las Colinas Blvd",
    address2: "Ste 101",
    cityStateZip: "Irving, TX 75063",
    fullAddress: "7429 Las Colinas Blvd Ste 101, Irving, TX 75063",
    phone: "469-442-0202",
    fax: "469-372-6188",
    email: "admin@tppcare.com",
    mapEmbedUrl:
      "https://www.google.com/maps?ll=32.908927,-96.954422&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=9990946045983830915&output=embed",
    mapUrl:
      "https://www.google.com/maps?ll=32.908927,-96.954422&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=9990946045983830915",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=7429+Las+Colinas+Blvd+Ste+101,+Irving,+TX+75063",
    hours: [
      { day: "Monday", time: "8:30 am - 7:00 pm" },
      { day: "Tuesday", time: "8:30 am - 7:00 pm" },
      { day: "Wednesday", time: "8:30 am - 7:00 pm" },
      { day: "Thursday", time: "8:30 am - 7:00 pm" },
      { day: "Friday", time: "8:30 am - 7:00 pm" },
      { day: "Saturday", time: "10:00 am to 3:30 pm", note: "(by appt only)" },
      { day: "Sunday", time: "Closed" },
    ],
  },
  {
    id: "celina",
    name: "Texas Primary & Pediatric Care - Celina",
    shortName: "Celina Clinic",
    address1: "3925 S Preston Rd",
    address2: "Ste 100",
    cityStateZip: "Celina, TX 75009",
    fullAddress: "3925 S Preston Rd Ste 100, Celina, TX 75009",
    phone: "469-442-0202",
    fax: "469-372-6188",
    email: "admin@tppcare.com",
    mapEmbedUrl:
      "https://www.google.com/maps?ll=33.270973,-96.785839&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=13749425199604245598&output=embed",
    mapUrl:
      "https://www.google.com/maps?ll=33.270973,-96.785839&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=13749425199604245598",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=3925+S+Preston+Rd+Ste+100,+Celina,+TX+75009",
    hours: [
      { day: "Monday", time: "8:30 am - 5:30 pm" },
      { day: "Tuesday", time: "8:30 am - 5:30 pm" },
      { day: "Wednesday", time: "8:30 am - 5:30 pm" },
      { day: "Thursday", time: "8:30 am - 5:30 pm" },
      { day: "Friday", time: "8:30 am - 5:30 pm" },
      { day: "Saturday", time: "Closed" },
      { day: "Sunday", time: "Closed" },
    ],
  },
];

export default function LocationsPage() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-700 flex flex-col justify-between">
      <div>
        {/* Fixed Navbar Component */}
        <Header />

        {/* Styled Header Title */}
        <div className="relative bg-[#eaf4f6]">
          <div className="pt-50 pb-20">
            <div className="max-w-3xl mx-auto px-6 space-y-3 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
                Clinic Directory
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Our Locations
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Providing personalized healthcare across North Texas. View clinic details, hours, and directions below.
              </p>
            </div>
          </div>

          {/* Curved Wave Divider */}
          <div className="absolute bottom-0 left-0 w-full translate-y-[1px] leading-none overflow-hidden pointer-events-none z-0">
            <svg
              viewBox="0 0 1440 120"
              className="w-full h-[60px] md:h-[90px]"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,35 C320,110 720,-15 1080,75 C1260,115 1380,45 1440,30 L1440,120 L0,120 Z"
                fill="#f8fafc"
              />
            </svg>
          </div>
        </div>

        {/* Main Content Area: Side by Side Grid */}
        <div className="max-w-[1400px] mx-auto px-6 pb-20 pt-4 space-y-12">
          
          {/* Side-by-Side 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {locations.map((loc) => {
              const isHovered = hoveredLocation === loc.id;

              return (
                <div
                  key={loc.id}
                  onMouseEnter={() => setHoveredLocation(loc.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-2xl flex flex-col justify-between ${
                    isHovered
                      ? "border-[#2596be]/40 ring-4 ring-[#2596be]/10 -translate-y-1"
                      : "border-slate-200/90"
                  }`}
                >
                  <div>
                    {/* Top: Embedded Map */}
                    <div className="relative w-full h-[280px] sm:h-[320px] bg-slate-100 border-b border-slate-100">
                      <iframe
                        title={loc.name}
                        width="100%"
                        height="100%"
                        className="border-0"
                        loading="lazy"
                        allowFullScreen
                        src={loc.mapEmbedUrl}
                      />
                    </div>

                    {/* Driving Directions bar */}
                    <div className="px-6 sm:px-8 pt-4 pb-2 flex items-center justify-between">
                      <a
                        href={loc.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2596be] hover:text-[#1d7a94] transition-colors"
                      >
                        <Navigation size={13} />
                        <span>Driving Directions</span>
                      </a>
                    </div>

                    {/* Clinic Title & Header */}
                    <div className="px-6 sm:px-8 pb-6 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                          {loc.name}
                        </h2>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#4fa1b0] mt-0.5">
                          {loc.shortName}
                        </p>
                      </div>

                      <a
                        href={`tel:${loc.phone.replace(/[^0-9]/g, "")}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2596be]/10 text-[#2596be] hover:bg-[#2596be] hover:text-white transition-all text-xs font-bold shrink-0 self-start sm:self-auto"
                      >
                        <Phone size={14} />
                        <span>Call Clinic</span>
                      </a>
                    </div>

                    {/* Info Down Below: 2 Sub-columns (Hours + Contact) */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                      
                      {/* Left Sub-Column: Opening Hours (7 cols) */}
                      <div className="sm:col-span-7 space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2596be]">
                          <Clock size={14} />
                          <span>Opening Hours</span>
                        </div>

                        <div className="divide-y divide-slate-200/60 text-xs sm:text-[13px]">
                          {loc.hours.map((h) => (
                            <div
                              key={h.day}
                              className="py-1.5 flex items-start justify-between gap-2"
                            >
                              <span className="font-semibold text-slate-700 w-24 shrink-0">
                                {h.day}
                              </span>
                              <span className="text-slate-600 text-right leading-tight">
                                {h.time}{" "}
                                {h.note && (
                                  <span className="block text-[11px] text-slate-400 font-normal">
                                    {h.note}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Sub-Column: Get In Touch (5 cols) */}
                      <div className="sm:col-span-5 space-y-4">
                        <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#2596be]">
                          Get In Touch
                        </span>

                        {/* Phone Button */}
                        <a
                          href={`tel:${loc.phone.replace(/[^0-9]/g, "")}`}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 border-[#67bed9]/40 hover:border-[#2596be] text-[#2596be] hover:bg-[#2596be]/5 transition-all text-xs font-bold shadow-xs"
                        >
                          <Phone size={14} />
                          <span>{loc.phone}</span>
                        </a>

                        {/* Address */}
                        <div className="space-y-0.5 text-xs sm:text-sm text-slate-700">
                          <p className="font-medium text-slate-900">{loc.address1}</p>
                          <p className="text-slate-500 text-xs">{loc.address2}</p>
                          <p className="text-slate-600 text-xs">{loc.cityStateZip}</p>
                        </div>

                        {/* Fax & Email */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Printer size={13} className="text-slate-400 shrink-0" />
                            <span>
                              <strong className="text-slate-500">fax:</strong> {loc.fax}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mail size={13} className="text-slate-400 shrink-0" />
                            <a
                              href={`mailto:${loc.email}`}
                              className="text-[#2596be] hover:underline truncate max-w-[170px]"
                            >
                              {loc.email}
                            </a>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Texting Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] py-6 px-6 text-center text-white text-base font-medium shadow-md flex items-center justify-center gap-3">
            <MessageSquare size={22} className="shrink-0" />
            <span>
              Have a quick question? Our texting number is{" "}
              <strong className="underline underline-offset-4 decoration-white/50">
                469-442-3344
              </strong>
            </span>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}