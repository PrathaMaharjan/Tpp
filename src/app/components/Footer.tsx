'use client';

import Link from 'next/link';
import { Star, MessageSquare, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4a93a1] text-white pt-14 pb-10 px-6 relative font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-8 border-b border-white/20">
          
          {/* Column 1: Brand & Ratings (4 cols) */}
          <div className="md:col-span-4 space-y-4 text-center md:text-left">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Texas Primary & Pediatric Care
            </h3>
            
            {/* Rating Display (Unboxed) */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
              <span className="text-3xl font-light tracking-tight">
                4.91 <span className="text-sm opacity-80">/ 5</span>
              </span>
              <div className="h-7 w-px bg-white/30" />
              <div className="flex flex-col items-start">
                <div className="flex gap-1 text-amber-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" className="stroke-none" />
                  ))}
                </div>
                <span className="text-xs text-white/80 mt-0.5">(104 reviews)</span>
              </div>
            </div>

           
          </div>

          {/* Column 2: Locations (5 cols) */}
          <div className="md:col-span-5 space-y-6 text-sm">
            {/* Irving Location */}
            <div className="space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5 justify-center md:justify-start">
                <MapPin size={15} className="shrink-0 text-white/80" />
                Irving Location
              </p>
              <p className="text-white/90 pl-5">7429 Las Colinas Blvd, Ste 101, Irving, TX 75063</p>
              <p className="text-xs text-white/80 pl-5 pt-0.5 flex items-center gap-1">
                <Phone size={12} />
                <span>Appts & General: </span>
                <a href="tel:469-442-0202" className="underline hover:text-white">469-442-0202</a>
              </p>
            </div>

            {/* Celina Location */}
            <div className="space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5 justify-center md:justify-start">
                <MapPin size={15} className="shrink-0 text-white/80" />
                Celina Location
              </p>
              <p className="text-white/90 pl-5">3925 S Preston Rd, Ste 100, Celina, TX 75009</p>
              <p className="text-xs text-white/80 pl-5 pt-0.5 flex items-center gap-1">
                <Phone size={12} />
                <span>Appts & General: </span>
                <a href="tel:469-442-0202" className="underline hover:text-white">469-442-0202</a>
              </p>
            </div>
          </div>

          {/* Column 3: Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-center md:text-right text-sm text-white/90">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Quick Links</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="hover:underline transition-all">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:underline transition-all">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/accessibility-notice" className="hover:underline transition-all">
                  Accessibility Notice
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:underline transition-all">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="text-center text-xs text-white/70">
          <p>© Copyright {currentYear} </p>
        </div>

      </div>

      {/* Accessibility Button Overlay */}
      <button 
        aria-label="Accessibility Options"
        className="fixed bottom-4 left-4 z-50 w-11 h-11 bg-[#1d5c80] hover:bg-[#164864] text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-6 h-6"
        >
          <circle cx="12" cy="5" r="1.7" />
          <path d="M12 7v6" />
          <path d="M5 9h14" />
          <path d="M9 21l3-8 3 8" />
        </svg>
      </button>

      {/* Floating Chat Button Overlay */}
      <button 
        aria-label="Open Chat"
        className="fixed bottom-4 right-4 z-50 w-11 h-11 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-xl border border-white/30 transition-all hover:scale-105"
      >
        <MessageSquare size={20} fill="currentColor" />
      </button>
    </footer>
  );
}