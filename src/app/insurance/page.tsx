"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShieldCheck, Phone } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface InsuranceProvider {
  name: string;
  logoUrl: string;
}

const ACCEPTED_INSURANCES: InsuranceProvider[] = [
  {
    name: "Blue Cross Blue Shield",
    logoUrl: "/texas.png", // Points directly to public/texas.png
  },
  {
    name: "Cigna",
    logoUrl: "/cigna.png", // Ensure cigna.png is added to public/
  },
  {
    name: "Aetna",
    logoUrl: "/aetna.png", // Ensure aetna.png is added to public/
  },
  {
    name: "UnitedHealthcare",
    logoUrl: "/united.png", // Points directly to public/united.png
  },
  {
    name: "Humana",
    logoUrl: "/humana.png", // Points directly to public/humana.png
  },
  {
    name: "Medicare",
    logoUrl: "/medicare.png", // Points directly to public/medicare.png
  },
];

export default function InsurancePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInsurances = ACCEPTED_INSURANCES.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      {/* Header Section */}
      <div className="relative bg-[#eaf4f6]">
        <div className="pt-50 pb-20">
          <div className="max-w-3xl mx-auto px-6 space-y-4 text-center">
            <h1 className="text-3xl pb-10 sm:text-4xl font-bold tracking-tight text-slate-900">
              Insurance Plans
            </h1>
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

      {/* Main Insurance Grid Section */}
      <section className="pb-24 pt-8 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Insurance Logos Grid */}
          {filteredInsurances.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No health plans found matching &quot;{searchTerm}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredInsurances.map((plan, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 h-36 flex items-center justify-center shadow-sm hover:border-[#4fa1b0]/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative w-full h-14">
                    <Image
                      src={plan.logoUrl}
                      alt={plan.name}
                      fill
                      className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-[#eaf4f6] py-20">
        <div className="max-w-2xl mx-auto text-center space-y-4 px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Not covered by any of these plans? 
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Contact us and we will find the best solution to suit you.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2596be]/25 active:scale-[0.99] transition-all duration-200 mt-2"
          >
            <Phone size={16} />
            <span>Contact Us</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}