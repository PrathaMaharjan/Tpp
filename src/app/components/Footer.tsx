'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin } from 'lucide-react';
import FooterCard from './FooterCard';

const footerMenu = [
  { name: 'Home', path: '/' },
  { name: 'Locations', path: '/locations' },
  { name: 'About Practice', path: '/about' },
  { name: 'Providers', path: '/providers' },
  { name: 'Insurance', path: '/insurance' },
  { name: 'Services', path: '/services' },
  { name: 'Health Blog', path: '/blog' },
  { name: 'Contact Us', path: '/contact' },
];

const footerLocations = [
  {
    name: 'Irving Location',
    address: '7429 Las Colinas Blvd, Ste 101, Irving, TX 75063',
    phone: '469-442-0202',
  },
  {
    name: 'Celina Location',
    address: '3925 S Preston Rd, Ste 100, Celina, TX 75009',
    phone: '469-442-0202',
  },
];

const footerSocialMedia = [
  {
    label: 'LinkedIn',
    link: '#',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  },
  {
    label: 'Facebook',
    link: '#',
    path: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z',
  },
  {
    label: 'Instagram',
    link: '#',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z',
  },
  {
    label: 'X',
    link: '#',
    path: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.44 7.2 5.87-7.2Zm-1.29 19.5h2.04L6.48 3.24H4.29l13.32 17.41Z',
  },
  {
    label: 'YouTube',
    link: '#',
    path: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z',
  },
];

const footerLegal = [
  { name: 'Terms & Conditions', path: '/terms-and-conditions' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Accessibility Notice', path: '/accessibility-notice' },
];

export default function Footer() {
  return (
    <footer className="w-full pt-16 lg:pt-0 pb-6 lg:pb-8 bg-brand-deep">
      <div className="relative w-full px-6 lg:px-24 xl:px-26 2xl:max-w-[1480px] 2xl:mx-auto lg:pt-[59px] overflow-hidden text-white">
        {/* Decorative faded brand watermark, bottom-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute z-0 hidden lg:block lg:right-[152px] xl:right-[208px] bottom-24 w-[300px] h-[300px] xl:w-[360px] xl:h-[360px] opacity-[0.07] select-none"
        >
          <Image
            src="/logo.png"
            alt=""
            width={420}
            height={420}
            className="object-contain h-full w-full"
          />
        </div>

        <div className="flex relative z-10">
          <div className="flex-1">
            <div className="w-16 h-16 mt-0 mb-10">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Texas Primary & Pediatric Care logo"
                  width={64}
                  height={64}
                  className="object-contain h-full w-full cursor-pointer"
                />
              </Link>
            </div>

            <div className="flex flex-col gap-8 mb-14">
              {/* Company links */}
              <div>
                <h2 className="my-4 text-[18px]">Company</h2>
                <ul className="flex gap-4 flex-row flex-wrap text-[16px] opacity-90">
                  {footerMenu.map((item, i) => (
                    <li key={i}>
                      <Link href={item.path} className="link-underline">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Locations */}
              <div>
                <h2 className="my-4 text-[18px]">Locations</h2>
                <ul className="flex gap-6 md:gap-10 flex-col md:flex-row text-[14px] opacity-90">
                  {footerLocations.map((loc, i) => (
                    <li key={i} className="space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <MapPin size={15} className="shrink-0 text-white/80" />
                        {loc.name}
                      </p>
                      <p className="text-white/90 pl-5">{loc.address}</p>
                      <p className="text-xs text-white/80 pl-5 pt-0.5 flex items-center gap-1">
                        <Phone size={12} />
                        <span>Appts &amp; General: </span>
                        <a
                          href={`tel:${loc.phone.replace(/[^0-9]/g, '')}`}
                          className="underline hover:text-white"
                        >
                          {loc.phone}
                        </a>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className="text-[18px] my-3">Social Media</h2>
            <ul className="flex gap-6 mb-10">
              {footerSocialMedia.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.link}
                    aria-label={item.label}
                    className="block opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition duration-300 ease-out"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d={item.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterCard />
        </div>

        <div className="border-b border-white/20 my-8 relative z-10"></div>

        <div className="flex justify-between flex-col lg:flex-row gap-4 relative z-10">
          <ul className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {footerLegal.map((item, i) => (
              <li key={i} className="text-[12px] lg:text-[14px] font-light">
                <Link href={item.path} className="link-underline">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-[12px] md:text-[14px] opacity-70">
            © {new Date().getFullYear()} Texas Primary &amp; Pediatric Care. All
            rights reserved.
          </p>
        </div>
      </div>

      {/* Accessibility Button Overlay */}
      <button
        aria-label="Accessibility Options"
        className="fixed bottom-4 left-4 z-50 w-11 h-11 bg-brand-deeper hover:bg-brand-deep text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105"
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
    </footer>
  );
}
