"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface InsuranceProvider {
  name: string;
  logoUrl: string;
}

const ACCEPTED_INSURANCES: InsuranceProvider[] = [
  {
    name: "Blue Cross Blue Shield",
    logoUrl: "/texas.png",
  },
  {
    name: "Cigna",
    logoUrl: "/cigna.png",
  },
  {
    name: "Aetna",
    logoUrl: "/aetna.png",
  },
  {
    name: "UnitedHealthcare",
    logoUrl: "/united.png",
  },
  {
    name: "Humana",
    logoUrl: "/humana.png",
  },
  {
    name: "Medicare",
    logoUrl: "/medicare.png",
  },
];

export default function InsurancePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInsurances = ACCEPTED_INSURANCES.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useGSAP(
    () => {
      // Header Animation
      gsap.fromTo(
        ".insurance-header-content",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );

      // Logo Cards Grid Stagger on separate animation wrappers
      gsap.fromTo(
        ".insurance-card-wrapper",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "all",
        }
      );

      // Bottom CTA Section ScrollTrigger
      gsap.fromTo(
        ".insurance-cta-content",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".insurance-cta-section",
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <main ref={containerRef} className="min-h-screen bg-white font-sans text-slate-700">
      <Header />

      {/* Header Section */}
      <div className="relative bg-[#eaf4f6]">
        <div className="pt-50 pb-20">
          <div className="insurance-header-content max-w-3xl mx-auto px-6 space-y-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
              Coverage &amp; Networks
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Insurance Plans
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              We accept most major insurance networks to keep your care accessible and seamless.
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
                <div key={idx} className="insurance-card-wrapper">
                  <div className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 h-36 flex items-center justify-center shadow-sm hover:border-[#4fa1b0]/50 hover:shadow-lg transition-all duration-300">
                    <div className="relative w-full h-14">
                      <Image
                        src={plan.logoUrl}
                        alt={plan.name}
                        fill
                        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="insurance-cta-section bg-[#eaf4f6] py-20">
        <div className="insurance-cta-content max-w-2xl mx-auto text-center space-y-4 px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Not covered by any of these plans? 
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Contact us and we will find the best solution to suit your healthcare needs.
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