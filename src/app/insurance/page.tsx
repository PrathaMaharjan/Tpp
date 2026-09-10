"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, HelpCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CtaSection from "../components/CtaSection";
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
        ".insurance-cta-section",
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
      <div className="relative bg-brand-mid">
        {/* Flanking line-art illustrations, melted into the band */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[3%] top-1/2 hidden w-[700px] max-w-[45vw] -translate-y-1/2 select-none mix-blend-screen xl:block"
        >
          <Image
            src="/images/hero-images/insurance-hero-left.png"
            alt=""
            width={1024}
            height={1024}
            className="h-auto w-full"
            priority
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute right-[3%] top-1/2 hidden w-[700px] max-w-[45vw] -translate-y-1/2 -scale-x-100 select-none mix-blend-screen xl:block"
        >
          <Image
            src="/images/hero-images/insurance-hero-right.png"
            alt=""
            width={1024}
            height={1024}
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="pt-[250px] pb-[151px]">
          <div className="insurance-header-content max-w-3xl mx-auto px-6 space-y-3 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight text-brand-deep">
              Insurance <span className="text-slate-200">Plans</span>
            </h1>
            <p className="text-brand-deep text-[15px] sm:text-base leading-relaxed max-w-xl mx-auto">
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
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Search */}
          <div className="relative max-w-sm mx-auto">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your insurance plan..."
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition-colors focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20"
            />
          </div>

          {/* Insurance Logos Grid */}
          {filteredInsurances.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-slate-400 text-sm">
                No health plans found matching &quot;{searchTerm}&quot;.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
              >
                <HelpCircle size={16} />
                <span>Ask us if we accept your plan</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredInsurances.map((plan, idx) => (
                <div key={idx} className="insurance-card-wrapper">
                  <div className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 h-40 flex flex-col items-center justify-center gap-3 shadow-sm hover:border-brand-mid/50 hover:shadow-lg transition-all duration-300">
                    <div className="relative w-full h-14">
                      <Image
                        src={plan.logoUrl}
                        alt={plan.name}
                        fill
                        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 text-center leading-snug">
                      {plan.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inline nudge: catches visitors before they reach the bottom CTA */}
          {filteredInsurances.length > 0 && (
            <div className="text-center pt-2">
              <p className="text-sm text-slate-500">
                Don&apos;t see your plan?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                  Ask us
                </Link>{" "}
                — we work with many networks not pictured here.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* Bottom CTA Section */}
      <div className="insurance-cta-section max-w-[1400px] mx-auto px-6 pb-4">
        <CtaSection
          eyebrow="We Can Still Help"
          title="Not Covered By Any Of These Plans?"
          description="Contact us and we will find the best solution to suit your healthcare needs."
          primary={{ label: 'Contact Us', href: '/contact' }}
          secondary={{ label: 'Book Appointment', href: 'https://healow.com/apps/practice/texas-primary-pediatric-care-pllc-irving-tx-22218?v=2&t=1' }}
        />
      </div>

      <Footer />
    </main>
  );
}