import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function FooterCard() {
  return (
    <div className="hidden lg:block bg-surface-2 lg:max-w-[450px] xl:min-w-[550px] rounded-3xl px-8 py-8 mt-2 relative z-20 self-start">
      <h2 className="text-brand-deep font-semibold text-[24px] w-[95%] leading-[26px] mb-4">
        Comprehensive Primary & Pediatric Care, All In One Place
      </h2>
      <p className="text-slate-600 text-[14px]">
        Two Texas locations, same-day appointments, and providers who know your
        family by name.
      </p>
      <Link href="/booking">
        <button className="bg-brand hover:bg-brand-dark text-white rounded-sm px-[19px] py-[10px] mt-6 flex items-center gap-2 cursor-pointer transition-colors">
          Book Appointment
          <Calendar size={18} />
        </button>
      </Link>
    </div>
  );
}
