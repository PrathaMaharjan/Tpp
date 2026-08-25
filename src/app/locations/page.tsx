"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import {
  MapPin,
  Phone,
  MessageSquare,
  Building2,
  User,
  Mail,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Contact,
} from "lucide-react";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";

const inputClass =
  "w-full rounded-none border border-slate-200/90 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10";

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5";

const locations = [
  {
    id: "irving",
    name: "Texas Primary & Pediatric Care - Irving",
    address: "7429 Las Colinas Blvd Ste 101, Irving, TX 75063",
    phone: "469-442-0202",
    mapQuery: "7429+Las+Colinas+Blvd+Ste+101,+Irving,+TX+75063",
  },
  {
    id: "celina",
    name: "Texas Primary & Pediatric Care - Celina",
    address: "3925 S Preston Rd Ste 100, Celina, TX 75009",
    phone: "469-442-0202",
    mapQuery: "3925+S+Preston+Rd+Ste+100,+Celina,+TX+75009",
  },
];

export default function LocationsPage() {
  const [form, setForm] = useState({
    location: "",
    doctor: "",
    name: "",
    email: "",
    phone: "",
    comments: "",
    consent1: false,
    consent2: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-700 pt-20">
      {/* Fixed Navbar Component */}
      <Header />

      {/* Styled Header Title Matching About Page */}
      <div className="pt-20 pb-4 text-center space-y-3">
        <div className="flex justify-center">

        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4fa1b0]">
          Locations

        </h1>

      </div>

      {/* Content Container */}
      <div className="max-w-[1400px] mx-auto px-6 pb-16 pt-2 space-y-12">
        {/* TOP SECTION: Side-by-Side Sharp Cards */}
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white border border-slate-200/90 rounded-none overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {/* Embedded Map Container */}
                <div className="relative w-full h-[340px] bg-slate-100">
                  <iframe
                    title={loc.name}
                    width="100%"
                    height="100%"
                    className="border-0 rounded-none"
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${loc.mapQuery}&output=embed`}
                  />

                  {/* Top-Right Custom Overlay Button */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm border border-slate-200 text-sky-600 px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-white hover:text-sky-700 transition-all flex items-center gap-1.5 rounded-none"
                  >
                    <span>Open in Maps</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                {/* Card Footer Details */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-t border-slate-100">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {loc.name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span>{loc.address}</span>
                    </p>
                  </div>

                  {/* Phone Pill Button */}
                  <a
                    href={`tel:${loc.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-teal-200 text-teal-600 hover:bg-teal-50 text-xs font-medium rounded-none transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <Phone size={13} />
                    <span>+{loc.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Texting Banner */}
        <div className="rounded-none bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] py-6 text-center text-white text-base font-medium shadow-md flex items-center justify-center gap-2">
          <MessageSquare size={20} />
          <span>
            Our texting number is <strong>469-442-3344</strong>
          </span>
        </div>
      </div>

      <Footer />
    </main>
  );
}