'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Phone, Calendar } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Locations', href: '/locations' },
    { name: 'About Practice', href: '/about' },
    { name: 'Providers', href: '/providers' },
    { name: 'Insurance', href: '/insurance' },
    { name: 'Services', href: '/services' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Background styling for top-level header shell
  const getHeaderBackground = () => {
    if (isScrolled) {
      return 'bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200/50';
    }
    if (isHomePage) {
      return 'bg-transparent';
    }
    return 'bg-white shadow-sm border-b border-slate-200/60';
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${getHeaderBackground()}`}
    >
      {showBanner && (
        <div className="bg-[#4fa1b0] text-white text-xs md:text-sm px-6 py-2 relative flex items-center justify-center font-medium">
          <div className="text-center space-y-0.5 md:space-y-0 md:space-x-4">
            <span>Our 2nd location in Celina is now open!</span>
            <span className="hidden md:inline">•</span>
            <span>Fax Number: 469-372-6188</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Close banner"
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0 z-10">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full overflow-hidden hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Texas Primary & Pediatric Care logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Floating Glass Bar Navigation */}
        <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-10">
          <div
            className={`flex items-center gap-1 p-1.5 rounded-full backdrop-blur-md border transition-all duration-300 ${isTransparent
                ? 'bg-black/25 border-white/20 shadow-lg'
                : 'bg-slate-900/10 border-slate-200/60 shadow-sm'
              }`}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ease-in-out whitespace-nowrap ${isActive
                      ? 'bg-white text-slate-900 shadow-md scale-100'
                      : isTransparent
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          <Link
            href="tel:4693726188"
            className={`hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${isTransparent
                ? 'border-white/40 bg-white/15 text-white backdrop-blur-sm hover:border-white hover:bg-white/25'
                : 'border-slate-200 bg-white/80 text-slate-800 hover:border-[#2596be] hover:text-[#2596be]'
              }`}
          >
            <Phone size={14} />
            <span>Call Us</span>
          </Link>

          <Link
            href="/booking"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2596be] via-[#4fa1b0] to-[#67bed9] text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2596be]/25 active:scale-[0.99] transition-all duration-200"
          >
            <Calendar size={14} />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>
    </header>
  );
}