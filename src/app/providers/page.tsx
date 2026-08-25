"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight, Stethoscope } from "lucide-react";

const providers = [
  {
    id: "bishwas-upadhyay",
    name: "Bishwas Upadhyay, MD",
    title: "Primary Care Doctor",
    image: "/providers/bishwas-upadhyay.jpg",
  },
  {
    id: "amit-bajaj",
    name: "Amit Bajaj, MD",
    title: "Board Certified Pediatrician",
    image: "/providers/amit-bajaj.jpg",
  },
  {
    id: "priyanka-agarwal",
    name: "Priyanka Agarwal, MD",
    title: "Endocrinology, Diabetes & Thyroid Specialist",
    image: "/providers/priyanka-agarwal.jpg",
  },
  {
    id: "leena-shrestha",
    name: "Leena Shrestha, APRN, FNP-C",
    title: "Board-Certified Family Nurse Practitioner",
    image: "/providers/leena-shrestha.jpg",
  },
  {
    id: "charulata-seshadri",
    name: "Charulata Seshadri, APRN, FNP-C",
    title: "Board-Certified Family Nurse Practitioner",
    image: "/providers/charulata-seshadri.jpg",
  },
  {
    id: "suja-indira",
    name: "Suja Indira, APRN, FNP-C",
    title: "Certified Family Nurse Practitioner",
    image: "/providers/suja-indira.jpg",
  },
];

export default function ProvidersPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      <section className="pt-36 pb-20 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Decorative Accent & Header Title */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">

            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4fa1b0]">
              Meet Our Providers
            </h1>
             <span className="w-10 h-0.5 bg-[#4fa1b0]/80 rounded-full" />
           
          </div>

          {/* Provider Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="group relative bg-white border border-slate-200/90 rounded-none p-6 text-center flex flex-col items-center justify-between transition-all duration-300 hover:border-[#4fa1b0]/50 hover:shadow-md"
              >
                {/* Subtle Teal Line on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#4fa1b0] transition-colors duration-300" />

                <div className="flex flex-col items-center space-y-4 w-full pt-2">
                  {/* Avatar Container */}
                  <div className="relative w-32 h-32 rounded-full p-1 bg-[#4fa1b0]/10 group-hover:bg-[#4fa1b0]/30 transition-all duration-300">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Image
                        src={provider.image}
                        alt={provider.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <Stethoscope size={36} className="text-[#4fa1b0]/60 opacity-60" />
                    </div>
                  </div>

                  {/* Provider Info */}
                  <div className="space-y-1.5 px-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#4fa1b0] transition-colors">
                      {provider.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {provider.title}
                    </p>
                  </div>
                </div>

                {/* Card Link Action */}
                <div className="w-full pt-6 mt-6 border-t border-slate-100">
                  <Link
                    href={`/providers/${provider.id}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#4fa1b0] hover:text-[#2596be] transition-colors"
                  >
                    <span>View Full Profile</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}