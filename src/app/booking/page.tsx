"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { submitAppointmentBooking } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NO_PREFERENCE = "No Preference";

const inputClass =
  "w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#2596be] focus:bg-white focus:ring-4 focus:ring-[#2596be]/10";

const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG;

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [services, setServices] = useState<string[]>([]);
  const [dentists, setDentists] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    dentist: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const posUrl = (process.env.NEXT_PUBLIC_POS_API_URL || "http://localhost:3000").replace(/\/$/, "");
        const tenantSlug = TENANT_SLUG?.trim();
        const query = tenantSlug ? `?tenantSlug=${encodeURIComponent(tenantSlug)}` : "";

        const [servicesRes, doctorsRes] = await Promise.allSettled([
          fetch(`${posUrl}/api/public/treatments${query}`, { cache: "no-store" }).then((r) => r.json()),
          fetch(`${posUrl}/api/public/doctors${query}`, { cache: "no-store" }).then((r) => r.json()),
        ]);

        let loadedServices: string[] = [];
        if (servicesRes.status === "fulfilled" && servicesRes.value?.success) {
          const rawTreatments = servicesRes.value.data?.treatments || [];
          if (Array.isArray(rawTreatments) && rawTreatments.length > 0) {
            const names = rawTreatments.map((t: any) => t.name || t.title || t).filter(Boolean);
            if (names.length > 0) {
              loadedServices = names;
            }
          }
        }

        let loadedDentists: string[] = [NO_PREFERENCE];
        if (doctorsRes.status === "fulfilled" && doctorsRes.value?.success) {
          const rawDoctors = doctorsRes.value.data?.doctors || [];
          if (Array.isArray(rawDoctors) && rawDoctors.length > 0) {
            const names = rawDoctors.map((d: any) => d.name || d.fullName || d).filter(Boolean);
            if (names.length > 0) {
              loadedDentists = [NO_PREFERENCE, ...names];
            }
          }
        }

        if (isMounted) {
          setServices(loadedServices);
          setDentists(loadedDentists);
          setForm((prev) => ({
            ...prev,
            service: prev.service || loadedServices[0] || "",
            dentist: prev.dentist || loadedDentists[0] || "",
          }));
        }
      } catch (e) {
        if (isMounted) {
          setServices([]);
          setDentists([NO_PREFERENCE]);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const selectedDentist = form.dentist === NO_PREFERENCE || form.dentist === "None" ? undefined : form.dentist;

      if (!TENANT_SLUG?.trim()) {
        setError("Tenant is not configured. Please set NEXT_PUBLIC_TENANT_SLUG.");
        return;
      }

      const res = await submitAppointmentBooking({
        fullName: form.name,
        phone: form.phone,
        email: form.email || undefined,
        preferredDate: form.date,
        preferredTime: form.time,
        serviceName: form.service,
        dentistName: selectedDentist,
        tenantSlug: TENANT_SLUG.trim(),
        notes: form.notes ? `[Dentist: ${selectedDentist || "No Preference"}] ${form.notes}` : `[Dentist: ${selectedDentist || "No Preference"}]`,
        source: "online_booking",
      });

      if (res.data?.success) {
        setSubmitted(true);
      } else {
        setError(res.data?.error || "Failed to submit booking. Please try again.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Could not connect to server. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      <section className="pt-36 pb-20 max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header Section (Matched to other pages theme) */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">

          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4fa1b0]">
            Let's Get Your Visit Scheduled
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Select a service, pick your preferred time, and our staff will confirm your slot right away.
          </p>
        </div>

        {/* Form Outer Wrapper */}
        <div className="mt-10">
          {submitted ? (
            <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-xl shadow-slate-200/50 sm:p-14 space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4fa1b0]/10 text-[#2596be]">
                <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  Appointment Requested
                </h2>
                <p className="max-w-sm text-sm text-slate-600 leading-relaxed mx-auto">
                  Thanks, <span className="font-semibold text-slate-900">{form.name.split(" ")[0] || "there"}</span>. We'll reach
                  out at <span className="font-medium text-slate-900">{form.phone || form.email}</span> to confirm your{" "}
                  {form.date ? `${form.date} ` : ""}appointment for{" "}
                  <span className="font-medium text-[#2596be]">{form.service}</span>.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#67bed9]/30 bg-[#67bed9]/10 p-4 text-left text-xs text-slate-800 max-w-md">
                <Clock className="h-4 w-4 shrink-0 text-[#2596be] mt-0.5" strokeWidth={2} />
                <div>
                  <span className="font-bold block text-slate-900 text-xs mb-0.5">Early Arrival Preferred</span>
                  <span className="text-slate-600 leading-relaxed block">
                    Please arrive 15 minutes before your time to complete registration and check-in without delay.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-[#2596be] hover:text-[#4fa1b0] transition-colors uppercase tracking-wider pt-2"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/40 sm:p-10"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                
                {/* Full Name */}
                <label className="block space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <User className="h-3.5 w-3.5 text-[#2596be]" strokeWidth={2} />
                    Full name
                  </span>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Enter your name"
                    className={inputClass}
                  />
                </label>

                {/* Phone */}
                <label className="block space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-[#2596be]" strokeWidth={2} />
                    Phone number
                  </span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="Phone number"
                    className={inputClass}
                  />
                </label>

                {/* Email */}
                <label className="block sm:col-span-2 space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-[#2596be]" strokeWidth={2} />
                    Email address
                  </span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="Email address"
                    className={inputClass}
                  />
                </label>

                {/* Service Select */}
                <label className="block space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <Stethoscope className="h-3.5 w-3.5 text-[#2596be]" strokeWidth={2} />
                    Service
                  </span>
                  <select
                    value={form.service}
                    onChange={(e) => update("service", e.target.value)}
                    className={inputClass}
                  >
                    {services.length === 0 ? (
                      <option value="">Select Service</option>
                    ) : (
                      services.map((s, idx) => (
                        <option key={`service-${s}-${idx}`} value={s}>{s}</option>
                      ))
                    )}
                  </select>
                </label>

                {/* Preferred Provider */}
                <label className="block space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <User className="h-3.5 w-3.5 text-[#2596be]" strokeWidth={2} />
                    Preferred provider
                  </span>
                  <select
                    value={form.dentist}
                    onChange={(e) => update("dentist", e.target.value)}
                    className={inputClass}
                  >
                    {dentists.map((d, idx) => (
                      <option key={`dentist-${d}-${idx}`} value={d}>{d}</option>
                    ))}
                  </select>
                </label>

                {/* Preferred Date */}
                <label className="block space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-[#2596be]" strokeWidth={2} />
                    Preferred date
                  </span>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className={inputClass}
                  />
                </label>

                {/* Preferred Time */}
                <label className="block space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-[#2596be]" strokeWidth={2} />
                    Preferred time
                  </span>
                  <input
                    required
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    className={inputClass}
                  />
                </label>

                {/* Notes */}
                <label className="block sm:col-span-2 space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Additional notes (optional)
                  </span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Anything we should know prior to your appointment?"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </label>

                {error && (
                  <div className="sm:col-span-2 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full h-12 bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2596be]/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Confirm Appointment"
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}