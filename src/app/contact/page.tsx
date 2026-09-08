"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Building2,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  MapPin,
  Clock,
  Printer,
  Navigation,
} from "lucide-react";
import Select from "../components/Select";
import { getPublicLocations, getPublicDoctors } from "../lib/api";

interface OutletOption {
  id: string;
  name: string;
  address?: string | null;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-mid focus:ring-4 focus:ring-brand-mid/10";

const CLINICS = [
  {
    city: "Irving",
    address: "7429 Las Colinas Blvd, Ste 101, Irving, TX 75063",
    hours: "Mon–Fri 8:30 am – 7:00 pm · Sat 10:00 am – 3:30 pm (by appt)",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=7429+Las+Colinas+Blvd+Ste+101,+Irving,+TX+75063",
  },
  {
    city: "Celina",
    address: "3925 S Preston Rd, Ste 100, Celina, TX 75009",
    hours: "Mon–Fri 8:30 am – 5:30 pm · Sat & Sun Closed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=3925+S+Preston+Rd+Ste+100,+Celina,+TX+75009",
  },
];

const labelClass =
  "block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5";

export default function ContactPage() {
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

  const [outlets, setOutlets] = useState<OutletOption[]>([]);
  const [doctors, setDoctors] = useState<string[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG?.trim() || "tpp";

  // 1. Fetch Outlets and All Doctors for the Organization on Mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        setLoadingDoctors(true);
        const [locationsRes, doctorsRes] = await Promise.allSettled([
          getPublicLocations(tenantSlug),
          getPublicDoctors({ tenantSlug }),
        ]);

        if (isMounted) {
          if (locationsRes.status === "fulfilled") {
            const locList: OutletOption[] =
              locationsRes.value?.data?.data?.locations ||
              locationsRes.value?.data?.locations ||
              [];
            if (locList.length > 0) {
              setOutlets(locList);
              setForm((prev) => ({
                ...prev,
                location: prev.location || locList[0].id,
              }));
            }
          }

          if (doctorsRes.status === "fulfilled") {
            const rawDoctors =
              doctorsRes.value?.data?.data?.doctors ||
              doctorsRes.value?.data?.doctors ||
              [];
            if (Array.isArray(rawDoctors)) {
              const docNames = rawDoctors
                .map((d: any) =>
                  typeof d === "string" ? d : d.name || d.fullName || d.title || ""
                )
                .filter(Boolean);
              setDoctors(docNames);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load clinic outlets and doctors:", err);
      } finally {
        if (isMounted) setLoadingDoctors(false);
      }
    }

    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, [tenantSlug]);

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
    <main className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      {/* Hero Header Section */}
      <div className="relative bg-surface-2">
        <div className="pt-50 pb-20">
          <div className="max-w-3xl mx-auto px-6 space-y-3 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Contact Us
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Get in touch with our team for questions, appointments, or general inquiries.
            </p>
          </div>
        </div>

        {/* Top Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[1px] leading-none overflow-hidden pointer-events-none z-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-[60px] md:h-[90px]"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,35 C320,110 720,-15 1080,75 C1260,115 1380,45 1440,30 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="pb-24 pt-8 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[42%_58%] gap-10 lg:gap-16 items-start">

          {/* LEFT: reach us directly */}
          <div className="space-y-8 lg:pt-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
                / get in touch /
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
                We&apos;re always ready to help and answer your questions
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Call us for appointments and urgent questions, or send a message
                and our team will get back to you.
              </p>
            </div>

            {/* Call + email */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Call Center</h3>
                <a
                  href="tel:4694420202"
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand transition-colors duration-300"
                >
                  <Phone size={14} className="shrink-0 text-brand-mid" />
                  469-442-0202
                </a>
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <Printer size={13} className="shrink-0 text-brand-mid" />
                  fax: 469-372-6188
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Email</h3>
                <a
                  href="mailto:admin@tppcare.com"
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand transition-colors duration-300 break-all"
                >
                  <Mail size={14} className="shrink-0 text-brand-mid" />
                  admin@tppcare.com
                </a>
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Our Locations</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                {CLINICS.map((clinic) => (
                  <div key={clinic.city} className="space-y-1.5">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                      <MapPin size={14} className="shrink-0 text-brand-mid" />
                      {clinic.city}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {clinic.address}
                    </p>
                    <p className="flex items-start gap-1.5 text-xs text-slate-500 leading-relaxed">
                      <Clock size={12} className="mt-0.5 shrink-0 text-brand-mid" />
                      {clinic.hours}
                    </p>
                    <a
                      href={clinic.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark transition-colors duration-300"
                    >
                      <Navigation size={11} />
                      Directions
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: the form */}
          <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg shadow-slate-100">
            {/* Form Header */}
            <div className="space-y-2 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Send Us A Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Questions, concerns, or comments about our services — fill out the
                form and we&apos;ll be in touch.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8 max-w-xl mx-auto">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Thank you for reaching out to Texas Primary &amp; Pediatric Care. A member of our team will review your inquiry and get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-brand-mid uppercase tracking-wider hover:underline pt-3 block mx-auto"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Dynamic Locations / Outlets Dropdown */}
                    <div>
                      <label className={labelClass}>
                        <Building2 size={13} className="text-brand-mid" /> LOCATION
                      </label>
                      <Select
                        required
                        value={form.location}
                        onChange={(v) => update("location", v)}
                        aria-label="Location"
                        placeholder={
                          outlets.length === 0
                            ? "Loading clinic outlets..."
                            : "Select a location"
                        }
                        options={outlets.map((o) => ({
                          value: o.id,
                          label: `${o.name}${o.address ? ` (${o.address})` : ""}`,
                        }))}
                      />
                    </div>

                    {/* Dynamic Doctors Dropdown */}
                    <div>
                      <label className={labelClass}>
                        <User size={13} className="text-brand-mid" /> DOCTOR
                      </label>
                      <Select
                        value={form.doctor}
                        onChange={(v) => update("doctor", v)}
                        disabled={loadingDoctors}
                        aria-label="Doctor"
                        placeholder={
                          loadingDoctors
                            ? "Loading doctors..."
                            : doctors.length === 0
                              ? "No doctors available for this outlet"
                              : "- Select Doctor -"
                        }
                        options={doctors.map((doc) => ({ value: doc, label: doc }))}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        <User size={13} className="text-brand-mid" /> NAME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        <Mail size={13} className="text-brand-mid" /> EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        <Phone size={13} className="text-brand-mid" /> PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(469) 000-0000"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        <MessageSquare size={13} className="text-brand-mid" /> COMMENTS
                      </label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Type your message or questions here..."
                        value={form.comments}
                        onChange={(e) => update("comments", e.target.value)}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* Disclosures */}
                    <div className="space-y-3 pt-1 text-[11px] text-slate-600 leading-snug">
                      <label className="flex items-start gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          required
                          checked={form.consent1}
                          onChange={(e) => update("consent1", e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-mid focus:ring-brand-mid shrink-0"
                        />
                        <span className="group-hover:text-slate-900 transition-colors">
                          I understand and agree that any information submitted will be forwarded to our office by email and not via a secure messaging system. This form should not be used to transmit private health information, and we disclaim all warranties with respect to confidentiality.
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.consent2}
                          onChange={(e) => update("consent2", e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-mid focus:ring-brand-mid shrink-0"
                        />
                        <span className="group-hover:text-slate-900 transition-colors">
                          By checking this box, I consent to receive text messages related to SMS from Texas Primary &amp; Pediatric Care. Reply &apos;STOP&apos; to opt-out at any time.
                        </span>
                      </label>

                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                        <p className="font-bold text-slate-700 mb-0.5">SMS Terms &amp; Privacy</p>
                        <p>
                          By opting in, you agree to receive SMS alerts regarding your appointment. Message and data rates may apply. Reply STOP to opt out. Call (469) 442-0202 with questions. Mobile details are kept confidential.
                        </p>
                      </div>
                    </div>

                    {/* Captcha Box */}
                    <div className="rounded-xl border border-slate-200 bg-surface p-3.5 flex items-center justify-between text-xs text-slate-600">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          className="h-5 w-5 rounded border-slate-300 text-brand-mid focus:ring-brand-mid"
                        />
                        <span className="font-medium text-slate-700">I&apos;m not a robot</span>
                      </label>
                      <div className="flex flex-col items-center justify-center text-[9px] text-slate-400 font-bold leading-tight">
                        <ShieldCheck size={16} className="text-brand-mid mb-0.5" />
                        <span>reCAPTCHA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-64 h-12 bg-gradient-to-r from-brand via-brand-mid to-brand-soft text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-brand/25 active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-60 uppercase tracking-wider cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        SENDING...
                      </span>
                    ) : (
                      "SEND MESSAGE"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
