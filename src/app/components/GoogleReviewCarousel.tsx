'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Star, ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
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

const GOOGLE_REVIEW_URL = 'https://maps.google.com/?cid=YOUR_GOOGLE_MAPS_CID';

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

      // Ambient Floating Bubbles
      gsap.to('.review-bubble-1', {
        y: -15,
        x: 10,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.review-bubble-2', {
        y: 20,
        x: -12,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 bg-[#67bed9]/10 overflow-hidden font-sans">

      {/* Fully Contained Opaque Circles Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="review-bubble-1 absolute top-10 left-8 md:left-16 w-64 h-64 md:w-80 md:h-80 bg-[#67bed9]/20 rounded-full border border-[#4fa1b0]/20" />
        <div className="review-bubble-2 absolute bottom-10 right-8 md:right-16 w-72 h-72 md:w-96 md:h-96 bg-[#4fa1b0]/15 rounded-full border border-[#2596be]/20" />
        <div className="absolute top-1/3 right-24 w-16 h-16 bg-[#2596be]/15 rounded-full border border-[#2596be]/20 hidden sm:block" />
        <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-[#67bed9]/30 rounded-full hidden sm:block" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 space-y-16">

        {/* Header */}
        <div className="reviews-header text-center space-y-3 w-full mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2596be]">
            Patient Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight whitespace-nowrap">
            Trusted by Families Across the Community
          </h2>
          <div className="w-12 h-0.5 bg-[#4fa1b0] mx-auto rounded-full mt-2" />
        </div>

        {/* Carousel Container with Side Navigation Arrows */}
        <div className="reviews-carousel relative group/carousel">

          {/* Left Side Arrow Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 z-20 w-12 h-12 rounded-full bg-white/95 border border-slate-200/80 shadow-md flex items-center justify-center text-slate-700 hover:text-[#2596be] hover:border-[#2596be]/40 hover:scale-110 transition-all active:scale-95 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Side Arrow Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 z-20 w-12 h-12 rounded-full bg-white/95 border border-slate-200/80 shadow-md flex items-center justify-center text-slate-700 hover:text-[#2596be] hover:border-[#2596be]/40 hover:scale-110 transition-all active:scale-95 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>

          {/* Horizontally Scrollable Reviews Wrapper */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scroll-smooth py-4 no-scrollbar px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {staticReviews.map((review) => (
              <Link
                key={review.id}
                href={review.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between items-center text-center space-y-6 shrink-0 w-[320px] md:w-[380px]"
              >
                <div className="flex flex-col items-center space-y-4 w-full">
                  {/* Initials Circle */}
                  <div className="w-14 h-14 rounded-full bg-[#67bed9]/15 border border-[#2596be]/20 flex items-center justify-center text-[#2596be] font-bold text-base tracking-wide group-hover:bg-[#2596be] group-hover:text-white transition-colors duration-300 shadow-sm">
                    {review.initials}
                  </div>

                  {/* Reviewer Name */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2596be] transition-colors">
                    {review.name}
                  </h3>

                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Review Body */}
                  <p className="text-slate-600 text-sm leading-relaxed font-normal max-w-sm">
                    "{review.text}"
                  </p>
                </div>

                {/* Card Footer Link */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2596be] group-hover:text-[#4fa1b0] transition-colors pt-4 border-t border-slate-100 w-full">
                  <span>Read review on Google</span>
                  <ExternalLink size={13} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA Link */}
        <div className="text-center">
          <Link
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2596be] hover:text-[#4fa1b0] transition-colors group"
          >
            <span>Leave us a review on Google</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}