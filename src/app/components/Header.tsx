'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Phone, Calendar, Sparkles, ChevronRight } from 'lucide-react';

const BANNER_DISMISS_KEY = 'tpp-banner-celina-dismissed';

export default function Header() {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastY = useRef(0);

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

  // Show the announcement unless this visitor has dismissed it.
  // localStorage can throw in private modes, so it is guarded.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(BANNER_DISMISS_KEY) === '1';
    } catch {
      dismissed = false;
    }
    if (dismissed) return;
    // Deferred so the effect does not set state synchronously.
    const id = setTimeout(() => setShowBanner(true), 0);
    return () => clearTimeout(id);
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    try {
      localStorage.setItem(BANNER_DISMISS_KEY, '1');
    } catch {
      // Non-fatal: the banner simply returns on the next visit.
    }
  };

  useEffect(() => {
    lastY.current = window.scrollY;

    const handleScroll = () => {
      const y = window.scrollY;

      setIsScrolled(y > 50);

      // Reveal on scroll up (or near the top), hide on scroll down.
      // The 4px threshold ignores sub-pixel/elastic scroll jitter.
      if (y < 50 || y < lastY.current - 4) {
        setShowHeader(true);
      } else if (y > lastY.current + 4) {
        setShowHeader(false);
      }

      lastY.current = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        showHeader ? 'translate-y-0' : '-translate-y-full'
      } ${getHeaderBackground()}`}
    >
      {showBanner && (
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-deeper via-brand to-brand-mid text-white">
          {/* Soft highlight so the strip reads as depth, not a flat block */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_180%_at_15%_50%,rgba(255,255,255,0.16),transparent_60%)]"
          />

          <div className="relative mx-auto flex max-w-[1400px] items-center justify-center gap-3 px-12 py-2.5 sm:px-14">
            <Link
              href="/locations"
              className="group flex min-w-0 items-center gap-2.5 text-center"
            >
              {/* "New" tag carries the news, so the sentence can stay short */}
              <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-inset ring-white/25 backdrop-blur-sm sm:inline-flex">
                <Sparkles size={11} className="shrink-0" />
                New
              </span>

              <span className="truncate text-xs font-medium sm:text-[13px]">
                Our second location in{' '}
                <span className="font-bold">Celina</span> is now open
              </span>

              <span className="hidden shrink-0 items-center gap-1 text-[11px] font-semibold text-white/85 transition-colors duration-300 group-hover:text-white sm:inline-flex">
                <span className="underline decoration-white/40 underline-offset-2 group-hover:decoration-white">
                  See locations
                </span>
                <ChevronRight
                  size={12}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </div>

          <button
            onClick={dismissBanner}
            aria-label="Dismiss announcement"
            className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-white/70 transition-colors duration-300 hover:bg-white/15 hover:text-white sm:right-3"
          >
            <X size={15} />
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
            href="tel:4694420202"
            className={`hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${isTransparent
                ? 'border-white/40 bg-white/15 text-white backdrop-blur-sm hover:border-white hover:bg-white/25'
                : 'border-slate-200 bg-white/80 text-slate-800 hover:border-brand hover:text-brand'
              }`}
          >
            <Phone size={14} />
            <span>Call Us</span>
          </Link>

          <Link
            href="/booking"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand via-brand-mid to-brand-soft text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-brand/25 active:scale-[0.99] transition-all duration-200"
          >
            <Calendar size={14} />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>
    </header>
  );
}