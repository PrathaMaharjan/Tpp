'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Select from '../components/Select';
import { getPublicDoctors, type Doctor } from '../lib/api';
import {
  Building2,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Send,
} from 'lucide-react';

const LOCATIONS = [
  { id: 'irving', name: 'Irving Clinic - 7429 Las Colinas Blvd, Ste 101, Irving, TX 75063' },
  { id: 'celina', name: 'Celina Clinic - 3925 S Preston Rd, Ste 100, Celina, TX 75009' },
];

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-mid focus:ring-4 focus:ring-brand-mid/10';

const labelClass =
  'block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5';

export default function ContactPage() {
  const [form, setForm] = useState({
    location: LOCATIONS[0].id,
    doctor: '',
    name: '',
    email: '',
    phone: '',
    comments: '',
    consent1: false,
    consent2: false,
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDocs() {
      try {
        const data = await getPublicDoctors();
        if (isMounted) setDoctors(data);
      } catch (e) {
        console.error('Error fetching doctors:', e);
      }
    }
    loadDocs();
    return () => {
      isMounted = false;
    };
  }, []);

  function update<K extends keyof typeof form>(key: K, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <main className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      {/* Hero Header Section */}
      <div className="relative bg-brand-mid min-h-[402px] md:min-h-[495px]">
        <div className="pt-50 pb-[76px] md:pt-[250px] md:pb-[95px]">
          <div className="max-w-3xl mx-auto px-6 space-y-3 text-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Contact Texas Primary &amp; Pediatric <span className="text-brand-deep">Care</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Get in touch with our team for questions, clinic inquiries, or general healthcare assistance.
            </p>
          </div>
        </div>

        {/* Top Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[1px] leading-none overflow-hidden pointer-events-none z-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-[50px] md:h-[80px]"
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
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg shadow-slate-100">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div>
                    <label className={labelClass}>
                      <Building2 size={13} className="text-brand-mid" /> Clinic Location
                    </label>
                    <Select
                      required
                      value={form.location}
                      onChange={(v) => update('location', v)}
                      aria-label="Clinic location"
                      placeholder="Select a clinic"
                      options={LOCATIONS.map((o) => ({
                        value: o.id,
                        label: o.name,
                      }))}
                    />
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className={labelClass}>
                      <User size={13} className="text-brand-mid" /> Provider (Optional)
                    </label>
                    <Select
                      value={form.doctor}
                      onChange={(v) => update('doctor', v)}
                      aria-label="Provider"
                      placeholder="- Any Provider -"
                      options={doctors.map((doc) => ({
                        value: doc.name,
                        label: doc.name,
                      }))}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      <User size={13} className="text-brand-mid" /> Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      <Mail size={13} className="text-brand-mid" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      <Phone size={13} className="text-brand-mid" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(469) 442-0202"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      <MessageSquare size={13} className="text-brand-mid" /> Message or Question
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="How can our primary and pediatric care team assist you today?"
                      value={form.comments}
                      onChange={(e) => update('comments', e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex justify-center">
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
                      <span className="flex items-center gap-2">
                        <Send size={14} />
                        SEND MESSAGE
                      </span>
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
