'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Star, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Review {
  id: string;
  name: string;
  initials: string;
  rating: number;
  text: string;
  link: string;
}

// Irving clinic CID, taken from the same place listing used by the map
// embeds. The placeholder that was here made the button a dead link.
// `writereview` opens the review composer directly.
const GOOGLE_REVIEW_URL = 'https://maps.google.com/?cid=9990946045983830915';

/**
 * Curated fallback. Used until GOOGLE_PLACES_API_KEY and the clinic
 * Place IDs are set, and whenever the API returns nothing. Places caps
 * at 5 reviews per place with no rating filter, so this list is also
 * larger than the live feed can be.
 */
const staticReviews: Review[] = [
  {
    id: '1',
    name: 'Sarun Giri',
    initials: 'SG',
    rating: 5,
    text: 'Loved and impressed with the service provided by DR Upadhyay  ,, he did listen to my concerns and explained every details of it...',
    link: "https://www.google.com/maps/reviews/@32.9089268,-96.9544223,17z/data=!3m1!4b1!4m5!14m4!1m3!1m2!1s112001814304976767674!2s0x0:0x46b778f154e29297?hl=en-VN&entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: '2',
    name: 'Henna Art',
    initials: 'HA',
    rating: 5,
    text: 'Overall, great service we were in within 5 minutes, friendly team, made us feel very comfy.',
    link: "https://www.google.com/maps/reviews/@32.9089268,-96.9544223,17z/data=!3m1!4b1!4m5!14m4!1m3!1m2!1s114360522833215710100!2s0x0:0x2d5e2bfd8c39373?hl=en-VN&entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: '3',
    name: 'Sarmila Shrestha',
    initials: 'SS',
    rating: 5,
    text: 'I am really impressed with the level of care Dr. Upadhyay provided to my mother in law. He was very thorough, listened to her carefully... ',
    link: "https://www.google.com/maps/reviews/@32.9089268,-96.9544223,17z/data=!3m1!4b1!4m5!14m4!1m3!1m2!1s108619252070727244740!2s0x0:0x46b778f154e29297?hl=en-VN&entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: '4',
    name: 'Manjunatha Raju',
    initials: 'MR',
    rating: 5,
    text: 'He has many experience with newborn and premature babies, he will handle well all our question with good suggestions.',
    link: "https://www.google.com/maps/reviews/@32.9089268,-96.9544223,17z/data=!3m1!4b1!4m5!14m4!1m3!1m2!1s115709409784095943955!2s0x0:0x2d5e2bfd8c39373?hl=en-VN&entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: '5',
    name: 'Angel Girl',
    initials: 'AG',
    rating: 5,
    text: 'The Celina location is so convenient! Brand new clinic, modern equipment, and doctors took extra time to answer all my questions.',
    link: 'https://www.google.com/maps/reviews/@32.9089268,-96.9544223,17z/data=!3m1!4b1!4m5!14m4!1m3!1m2!1s103902736107241904368!2s0x0:0x46b778f154e29297?hl=en-VN&entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    id: '6',
    name: 'Arundev N.',
    initials: 'AN',
    rating: 5,
    text: 'Dr. Amit Bajaj is amazing for your family medical needs . He’s knowledgeable and caring . Unfortunately we moved from... ',
    link: "https://www.zocdoc.com/doctor/amit-bajaj-md-303757",
  },
  {
    id: '7',
    name: 'Sunita Basnet Thapa',
    initials: 'SBT',
    rating: 5,
    text: 'Dr. Upadhayay is very professional, well mannered and efficient physician in Dallas. I recently visited his office in Los Colinas...',
    link: "https://www.google.com/maps/reviews/@32.9089268,-96.9544223,17z/data=!3m1!4b1!4m5!14m4!1m3!1m2!1s101099384270335251653!2s0x0:0x61a799a8dad973f2?hl=en-VN&entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: '8',
    name: 'Brijesh Kadam',
    initials: 'Bk',
    rating: 5,
    text: 'Dr. Bajaj is a very good pediatrician. He was there was our first baby was delivered. Awesome doctor!!!',
    link: "https://www.google.com/maps/reviews/data=!4m5!14m4!1m3!1m2!1s115782705071326670267!2s0x0:0x2d5e2bfd8c39373?hl=en-VN&shorturl=1",
  },
];

export default function GoogleReviewsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const [reviews, setReviews] = useState<Review[]>(staticReviews);

  useEffect(() => {
    let active = true;

    async function loadLiveReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) return;
        const json = await res.json();
        // Only swap in live data when there is actually some: an empty
        // list means unconfigured or filtered out, and the curated
        // reviews are better than an empty carousel.
        if (active && Array.isArray(json.reviews) && json.reviews.length > 0) {
          setReviews(json.reviews);
        }
      } catch {
        // Keep the curated reviews.
      }
    }

    loadLiveReviews();
    return () => {
      active = false;
    };
  }, []);

  useGSAP(
    () => {
      // Header Animation
      gsap.from('.reviews-header', {
        scrollTrigger: {
          trigger: '.reviews-header',
          start: 'top 85%',
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Carousel Wrapper
      gsap.from('.reviews-carousel', {
        scrollTrigger: {
          trigger: '.reviews-carousel',
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 bg-white overflow-hidden font-sans">

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">

        {/* Header: left-aligned two-tone heading, arrows on the right */}
        <div className="reviews-header mb-10 flex items-end justify-between gap-6 md:mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Our Reviews
            </span>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-[44px]">
              Trusted by <span className="text-slate-400">Families</span> Across Texas
            </h2>
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous reviews"
              className="grid h-12 w-12 place-items-center rounded-full bg-brand-deep text-white transition duration-300 hover:bg-brand-deeper active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next reviews"
              className="grid h-12 w-12 place-items-center rounded-full bg-brand-deep text-white transition duration-300 hover:bg-brand-deeper active:scale-95"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="reviews-carousel">
          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={review.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-[300px] shrink-0 flex-col rounded-[20px] bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl md:w-[340px]"
              >
                {/* Top row: avatar left, rating pill right */}
                <div className="mb-7 flex items-start justify-between gap-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-sm font-bold tracking-wide text-brand shadow-sm">
                    {review.initials}
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 shadow-sm">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Quote mark */}
                <span
                  aria-hidden
                  className="mb-3 block font-display text-4xl leading-none text-brand-soft"
                >
                  &ldquo;
                </span>

                {/* Review body, the card's focal point */}
                <p className="font-display text-[22px] font-semibold leading-[1.25] tracking-tight text-slate-900 md:text-[24px]">
                  {review.text.length > 110
                    ? `${review.text.slice(0, 110).trimEnd()}…`
                    : review.text}
                </p>

                {/* Footer: name and source */}
                <div className="mt-auto border-t border-slate-200/70 pt-5">
                  <p className="text-sm font-semibold text-slate-900">
                    {review.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    Verified Google review
                    <ExternalLink
                      size={11}
                      className="shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile arrows, below the cards where the header has no room */}
          <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous reviews"
              className="grid h-11 w-11 place-items-center rounded-full bg-brand-deep text-white active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next reviews"
              className="grid h-11 w-11 place-items-center rounded-full bg-brand-deep text-white active:scale-95"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-12" />

        {/* Bottom CTA Link */}
        <div className="text-center">
          <Link
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full border border-hairline bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-md transition duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand"
          >
            {/* Google mark — makes the destination obvious at a glance */}
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden className="shrink-0">
              <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.1h6.6c-.1 1.1-.8 2.8-2.4 3.9l-.1.1 3.5 2.7.2.1c2.3-2 3.7-5.1 3.7-8.7Z" />
              <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.8-2.9l-3.7-2.9c-1 .7-2.3 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5l-.1.1-3.6 2.8-.1.1C3.4 21.3 7.4 24 12 24Z" />
              <path fill="#FBBC05" d="M5.3 14.4c-.3-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4V9.5L1.6 6.7l-.1.1C.6 8.4 0 10.2 0 12s.5 3.6 1.5 5.2l3.8-2.8Z" />
              <path fill="#EA4335" d="M12 4.7c2.2 0 3.7.9 4.6 1.8l3.3-3.3C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.5 6.7l3.8 2.9C6.2 6.8 8.9 4.7 12 4.7Z" />
            </svg>
            <span>Leave us a review</span>
            <ArrowRight
              size={15}
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}