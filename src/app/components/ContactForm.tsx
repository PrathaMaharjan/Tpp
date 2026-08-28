"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { getPublicLocations, getPublicDoctors } from "../lib/api";

interface OutletOption {
  id: string;
  name: string;
  address?: string | null;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10";

const labelClass =
  "block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5";

export default function ContactForm() {
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
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/50">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#2596be]">
          CONTACT US
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Send A Message To Texas Primary & Pediatric Care
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          If you have any questions, concerns, or comments regarding Texas Primary & Pediatric Care, please fill out the short contact form below.
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
            Thank you for reaching out to Texas Primary & Pediatric Care. A member of our team will review your inquiry and get back to you shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold text-[#2596be] uppercase tracking-wider hover:underline pt-3 block mx-auto"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Form Grid (Matching Image Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Selects & Personal Info */}
            <div className="space-y-4">
              {/* Dynamic Locations / Outlets Dropdown */}
              <div>
                <label className={labelClass}>
                  <Building2 size={13} className="text-[#2596be]" /> LOCATION
                </label>
                <select
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className={inputClass}
                  required
                >
                  {outlets.length === 0 ? (
                    <option value="">Loading clinic outlets...</option>
                  ) : (
                    outlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} {o.address ? `(${o.address})` : ""}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Dynamic Doctors Dropdown */}
              <div>
                <label className={labelClass}>
                  <User size={13} className="text-[#2596be]" /> DOCTOR
                </label>
                <select
                  value={form.doctor}
                  onChange={(e) => update("doctor", e.target.value)}
                  disabled={loadingDoctors}
                  className={inputClass}
                >
                  {loadingDoctors ? (
                    <option value="">Loading doctors...</option>
                  ) : doctors.length === 0 ? (
                    <option value="">No doctors available for this outlet</option>
                  ) : (
                    <>
                      <option value="">- Select Doctor -</option>
                      {doctors.map((doc, idx) => (
                        <option key={`doc-${doc}-${idx}`} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  <User size={13} className="text-[#2596be]" /> NAME
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
                  <Mail size={13} className="text-[#2596be]" /> EMAIL ADDRESS
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
                  <Phone size={13} className="text-[#2596be]" /> PHONE NUMBER
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

            {/* Right Column: Comments & Legal Disclosures */}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  <MessageSquare size={13} className="text-[#2596be]" /> COMMENTS
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

              {/* Consent Disclosures */}
              <div className="space-y-3 pt-1 text-[11px] text-slate-600 leading-snug">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={form.consent1}
                    onChange={(e) => update("consent1", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2596be] focus:ring-[#2596be] shrink-0"
                  />
                  <span className="group-hover:text-slate-900 transition-colors">
                    I understand and agree that any information submitted will be forwarded to our office by email and not via a secure messaging system. This form should not be used to transmit private health information, and we disclaim all warranties with respect to the privacy and confidentiality of any information submitted through this form.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.consent2}
                    onChange={(e) => update("consent2", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2596be] focus:ring-[#2596be] shrink-0"
                  />
                  <span className="group-hover:text-slate-900 transition-colors">
                    By checking this box, I consent to receive text messages related to SMS from Texas Primary & Pediatric Care. You can reply 'STOP' at any time to opt-out. Message and data rates may apply. Message frequency may vary; text HELP for assistance.
                  </span>
                </label>

                {/* SMS Terms Notice */}
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                  <p className="font-bold text-slate-700 mb-0.5">SMS Terms & Privacy</p>
                  <p>
                    By opting in, you agree to receive SMS alerts regarding your appointment and care from Texas Primary & Pediatric Care. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time. For questions, please call 469-442-0202. Your mobile information will not be shared with third parties.
                  </p>
                </div>
              </div>

              {/* reCAPTCHA Widget Placeholder */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="h-5 w-5 rounded border-slate-300 text-[#2596be] focus:ring-[#2596be]"
                  />
                  <span className="font-medium text-slate-700">I'm not a robot</span>
                </label>
                <div className="flex flex-col items-center justify-center text-[9px] text-slate-400 font-bold leading-tight">
                  <ShieldCheck size={16} className="text-[#2596be] mb-0.5" />
                  <span>reCAPTCHA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-64 h-12 bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-[#2596be]/25 active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-60 uppercase tracking-wider"
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
  );
}