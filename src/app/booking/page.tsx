'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPublicDoctors, getPublicServices, type Doctor, type Service } from '../lib/api';
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
  CalendarCheck,
} from 'lucide-react';

const LOCATIONS = [
  { id: 'irving', name: 'Irving Location (7429 Las Colinas Blvd, Ste 101, Irving, TX)' },
  { id: 'celina', name: 'Celina Location (3925 S Preston Rd, Ste 100, Celina, TX)' },
];

const inputClass =
  'w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10';

function BookingForm() {
  const searchParams = useSearchParams();
  const initialDoctor = searchParams.get('doctor') || searchParams.get('provider') || '';
  const initialService = searchParams.get('service') || '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: LOCATIONS[0].id,
    service: initialService,
    doctor: initialDoctor,
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [docs, svcs] = await Promise.all([getPublicDoctors(), getPublicServices()]);
        if (isMounted) {
          setDoctors(docs);
          setServices(svcs);
          if (initialService && !form.service) {
            setForm((p) => ({ ...p, service: initialService }));
          }
          if (initialDoctor && !form.doctor) {
            setForm((p) => ({ ...p, doctor: initialDoctor }));
          }
        }
      } catch (e) {
        console.error('Error loading booking dropdown data:', e);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [initialService, initialDoctor]);

  function update<K extends keyof typeof form>(key: K, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate confirmation or submit to backend
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } catch (err: any) {
      setError('An error occurred while submitting your appointment request. Please call 469-442-0202.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      {/* Styled Header Title */}
      <div className="relative bg-[#eaf4f6]">
        <div className="pt-36 pb-20 md:pt-40 md:pb-24">
          <div className="max-w-3xl mx-auto px-6 space-y-3 text-center">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2596be] bg-white/80 backdrop-blur rounded-full border border-[#4fa1b0]/20 shadow-xs">
              Schedule An Appointment
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Let&apos;s Get Your Visit Scheduled
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              Select your preferred clinic location, provider, and service, and our team will confirm your visit.
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[1px] leading-none overflow-hidden pointer-events-none z-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-[50px] md:h-[80px]"
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

      <section className="pb-24 pt-8 max-w-3xl mx-auto px-6 lg:px-8">
        {submitted ? (
          <div className="flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-xl shadow-slate-200/50 sm:p-14 space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4fa1b0]/10 text-[#2596be]">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Appointment Requested Successfully!
              </h2>
              <p className="max-w-md text-sm text-slate-600 leading-relaxed mx-auto">
                Thank you, <span className="font-semibold text-slate-900">{form.name}</span>. Our clinic staff will contact you at <span className="font-medium text-slate-900">{form.phone || form.email}</span> to confirm your visit.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-[#4fa1b0]/30 bg-[#eaf4f6]/60 p-4 text-left text-xs text-slate-800 max-w-md">
              <Clock className="h-4 w-4 shrink-0 text-[#2596be] mt-0.5" strokeWidth={2} />
              <div>
                <span className="font-bold block text-slate-900 text-xs mb-0.5">Prompt Confirmation</span>
                <span className="text-slate-600 leading-relaxed block">
                  For immediate assistance or urgent appointment scheduling, you can also call us directly at <strong>(469) 442-0202</strong>.
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
            className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/40 sm:p-10 space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Location */}
              <label className="block sm:col-span-2 space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-[#2596be]" />
                  Clinic Location
                </span>
                <select
                  required
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  className={inputClass}
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Full Name */}
              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <User className="h-3.5 w-3.5 text-[#2596be]" />
                  Full Name
                </span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className={inputClass}
                />
              </label>

              {/* Phone */}
              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <Phone className="h-3.5 w-3.5 text-[#2596be]" />
                  Phone Number
                </span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="e.g. (469) 442-0202"
                  className={inputClass}
                />
              </label>

              {/* Email */}
              <label className="block sm:col-span-2 space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <Mail className="h-3.5 w-3.5 text-[#2596be]" />
                  Email Address
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="e.g. patient@example.com"
                  className={inputClass}
                />
              </label>

              {/* Service */}
              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <Stethoscope className="h-3.5 w-3.5 text-[#2596be]" />
                  Service Needed
                </span>
                <select
                  value={form.service}
                  onChange={(e) => update('service', e.target.value)}
                  className={inputClass}
                >
                  <option value="">General Consultation / Wellness</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title || s.name}>
                      {s.title || s.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Provider */}
              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <User className="h-3.5 w-3.5 text-[#2596be]" />
                  Preferred Provider
                </span>
                <select
                  value={form.doctor}
                  onChange={(e) => update('doctor', e.target.value)}
                  className={inputClass}
                >
                  <option value="">No Preference (Next Available)</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} {d.specialty ? `(${d.specialty})` : ''}
                    </option>
                  ))}
                </select>
              </label>

              {/* Date */}
              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <Calendar className="h-3.5 w-3.5 text-[#2596be]" />
                  Preferred Date
                </span>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  className={inputClass}
                />
              </label>

              {/* Time */}
              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-[#2596be]" />
                  Preferred Time
                </span>
                <input
                  required
                  type="time"
                  value={form.time}
                  onChange={(e) => update('time', e.target.value)}
                  className={inputClass}
                />
              </label>

              {/* Notes */}
              <label className="block sm:col-span-2 space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Reason for Visit or Symptoms (Optional)
                </span>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Tell us about the purpose of your appointment or any questions..."
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

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full h-12 bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2596be]/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Request...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CalendarCheck size={16} />
                  Confirm Appointment Request
                </span>
              )}
            </button>
          </form>
        )}
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
