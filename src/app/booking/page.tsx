"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Stethoscope,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getPublicLocations,
  getPublicServices,
  getPublicDoctors,
  submitAppointmentBooking,
} from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NO_PREFERENCE = "No Preference";

interface OutletOption {
  id: string;
  name: string;
  address?: string | null;
}

const inputClass =
  "w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#2596be] focus:bg-white focus:ring-4 focus:ring-[#2596be]/10";

function BookingForm() {
  const searchParams = useSearchParams();
  const paramDentist = searchParams.get("dentist") || searchParams.get("provider") || "";
  const paramService = searchParams.get("service") || "";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOutletData, setLoadingOutletData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [outlets, setOutlets] = useState<OutletOption[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [dentists, setDentists] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    locationId: "",
    service: paramService,
    dentist: paramDentist || NO_PREFERENCE,
    date: "",
    time: "",
    notes: "",
  });

  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG?.trim() || "tpp";

  // 1. Fetch Outlets for the Clinic on Mount
  useEffect(() => {
    let isMounted = true;

    async function loadOutlets() {
      try {
        const res = await getPublicLocations(tenantSlug);
        const locList: OutletOption[] = res?.data?.data?.locations || [];

        if (isMounted && locList.length > 0) {
          setOutlets(locList);
          setForm((prev) => ({
            ...prev,
            locationId: prev.locationId || locList[0].id,
          }));
        }
      } catch (err) {
        console.error("Failed to load clinic outlets:", err);
      }
    }

    loadOutlets();
    return () => {
      isMounted = false;
    };
  }, [tenantSlug]);

  // 2. Fetch Services & Doctors specific to the selected Outlet
  useEffect(() => {
    let isMounted = true;

    async function loadOutletServicesAndDoctors() {
      if (!form.locationId) return;

      try {
        setLoadingOutletData(true);

        const [servicesRes, doctorsRes] = await Promise.allSettled([
          getPublicServices({ locationId: form.locationId, tenantSlug }),
          getPublicDoctors({ locationId: form.locationId, tenantSlug }),
        ]);

        let loadedServices: string[] = [];
        if (servicesRes.status === "fulfilled" && servicesRes.value?.data?.success) {
          const rawTreatments = servicesRes.value.data.data?.treatments || [];
          if (Array.isArray(rawTreatments)) {
            loadedServices = rawTreatments
              .map((t: any) => t.name || t.title || t)
              .filter(Boolean);
          }
        }

        let loadedDentists: string[] = [NO_PREFERENCE];
        if (doctorsRes.status === "fulfilled" && doctorsRes.value?.data?.success) {
          const rawDoctors = doctorsRes.value.data.data?.doctors || doctorsRes.value.data?.doctors || [];
          if (Array.isArray(rawDoctors)) {
            const docNames = rawDoctors
              .map((d: any) => (typeof d === "string" ? d : d.name || d.fullName || d.title || ""))
              .filter(Boolean);
            if (docNames.length > 0) {
              loadedDentists = [NO_PREFERENCE, ...docNames];
            }
          }
        }

        // If no doctors are tied specifically to this outlet, load all doctors for the organization
        if (loadedDentists.length <= 1) {
          try {
            const allDocRes = await getPublicDoctors({ tenantSlug });
            const allRaw = allDocRes?.data?.data?.doctors || allDocRes?.data?.doctors || [];
            if (Array.isArray(allRaw)) {
              const allNames = allRaw
                .map((d: any) => (typeof d === "string" ? d : d.name || d.fullName || d.title || ""))
                .filter(Boolean);
              if (allNames.length > 0) {
                loadedDentists = [NO_PREFERENCE, ...allNames];
              }
            }
          } catch (e) {
            console.error("Fallback load all doctors error in booking:", e);
          }
        }

        if (isMounted) {
          setServices(loadedServices);
          setDentists(loadedDentists);
          setForm((prev) => {
            let selectedService = prev.service;
            if (!loadedServices.includes(selectedService)) {
              const matchedSvc = loadedServices.find(
                (s) => paramService && s.toLowerCase().includes(paramService.toLowerCase())
              );
              selectedService = matchedSvc || loadedServices[0] || "";
            }

            let selectedDentist = prev.dentist;
            if (!loadedDentists.includes(selectedDentist)) {
              const matchedDoc = loadedDentists.find(
                (d) => paramDentist && d.toLowerCase().includes(paramDentist.toLowerCase())
              );
              selectedDentist = matchedDoc || loadedDentists[0] || NO_PREFERENCE;
            }

            return {
              ...prev,
              service: selectedService,
              dentist: selectedDentist,
            };
          });
        }
      } catch (err) {
        console.error("Failed to load services/doctors for outlet:", err);
        if (isMounted) {
          setServices([]);
          setDentists([NO_PREFERENCE]);
        }
      } finally {
        if (isMounted) setLoadingOutletData(false);
      }
    }

    loadOutletServicesAndDoctors();
    return () => {
      isMounted = false;
    };
  }, [form.locationId, tenantSlug]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const selectedDentist =
        form.dentist === NO_PREFERENCE || form.dentist === "None"
          ? undefined
          : form.dentist;

      const res = await submitAppointmentBooking({
        fullName: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        preferredDate: form.date,
        preferredTime: form.time,
        serviceName: form.service || undefined,
        dentistName: selectedDentist,
        tenantSlug,
        locationId: form.locationId || undefined,
        notes: form.notes
          ? `[Dentist: ${selectedDentist || "No Preference"}] ${form.notes}`
          : `[Dentist: ${selectedDentist || "No Preference"}]`,
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
          "Could not connect to server. Please make sure DMS is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedOutlet = outlets.find((o) => o.id === form.locationId);

  return (
    <main className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      {/* Styled Header Title Matching Locations/Services Page */}
      <div className="relative bg-[#eaf4f6]">
        <div className="pt-50 pb-25">
          <div className="max-w-3xl mx-auto px-6 space-y-3 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Let's Get Your Visit Scheduled
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Select your preferred clinic outlet, service, and time, and our staff will confirm your slot right away.
            </p>
          </div>
        </div>

        {/* Enhanced Curvier Top Section Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[1px] leading-none overflow-hidden pointer-events-none z-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-[60px] md:h-[90px]"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,35 C320,110 720,-15 1080,75 C1260,115 1380,45 1440,30 L1440,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      <section className="pb-20 max-w-3xl mx-auto px-6 lg:px-8">
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
                  <span className="font-medium text-[#2596be]">{form.service || "your visit"}</span>
                  {selectedOutlet ? ` at our ${selectedOutlet.name} branch` : ""}.
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
                
                {/* Outlet / Location Select */}
                <label className="block sm:col-span-2 space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-[#2596be]" strokeWidth={2} />
                    Select Clinic Outlet
                  </span>
                  <select
                    required
                    value={form.locationId}
                    onChange={(e) => update("locationId", e.target.value)}
                    className={inputClass}
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
                </label>

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
                    disabled={loadingOutletData}
                    className={inputClass}
                  >
                    {loadingOutletData ? (
                      <option value="">Loading outlet services...</option>
                    ) : services.length === 0 ? (
                      <option value="">No services available for this outlet</option>
                    ) : (
                      services.map((s, idx) => (
                        <option key={`service-${s}-${idx}`} value={s}>
                          {s}
                        </option>
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
                    disabled={loadingOutletData}
                    className={inputClass}
                  >
                    {loadingOutletData ? (
                      <option value="">Loading doctors...</option>
                    ) : (
                      dentists.map((d, idx) => (
                        <option key={`dentist-${d}-${idx}`} value={d}>
                          {d}
                        </option>
                      ))
                    )}
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
                disabled={loading || loadingOutletData}
                className="mt-8 w-full h-12 bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2596be]/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center disabled:opacity-60 cursor-pointer"
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

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white font-sans text-slate-700 flex items-center justify-center">
          <div className="text-slate-400 text-sm">Loading appointment form...</div>
        </main>
      }
    >
      <BookingForm />
    </Suspense>
  );
}