'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />

      <section className="pt-36 pb-20 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Header Accent & Bold Title */}
          <div className="text-center space-y-3">
           \
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4fa1b0]">
              About Texas Primary & Pediatric Care
            </h1>
          </div>

          {/* Clean Narrative Flow - Uniform Font Size & Weight */}
          <div className="space-y-6 text-slate-600 text-base leading-relaxed font-normal">
            
            {/* Lead Paragraph */}
            <p>
              At <strong className="font-semibold text-slate-900">Texas Primary & Pediatric Care</strong>, 
              Amit Bajaj, MD, Bishwas Upadhyay, MD, and the team provide adult primary care and pediatric services 
              at their clinic in Irving & Celina, Texas, and serve the surrounding cities and counties. Dr. Bajaj and 
              Dr. Upadhyay speak English, Nepali, Hindi, and Urdu fluently, and their team speaks Spanish fluently as well, 
              allowing them to effectively serve the area's diverse population.
            </p>

            <p>
              This is a multi-specialty practice. The team's mission is to provide personalized, high-quality care using 
              evidence-based medicine. Each doctor is board-certified and boasts years of knowledge and expertise.
            </p>

            {/* Structured Highlight Block */}
            <div className="my-8 space-y-5 border-l-2 border-[#4fa1b0]/30 pl-6 py-1">
              <p>
                <strong className="text-[#4fa1b0] font-semibold uppercase tracking-wider text-xs block mb-1">
                  Adult Care Services
                </strong>
                The team offers a variety of medical services on-site, including adult primary care, chronic disease management, 
                endocrinology, women's health, mental and behavioral health. Patients can receive vaccinations, undergo an annual 
                physical, schedule labs and diagnostic tests. The team also offers sick visits, travel medicine consultation, 
                immigration physicals, and in-office procedures.
              </p>

              <p>
                <strong className="text-[#4fa1b0] font-semibold uppercase tracking-wider text-xs block mb-1">
                  Pediatric Care Services
                </strong>
                Children and teenagers can receive comprehensive pediatric care, including pediatric growth and developmental 
                screenings, vaccinations/immunizations, well-child visits, newborn visits, sick visits, and immigration physicals.
              </p>
            </div>

            <p>
              Each provider gets to know their patients. They listen carefully to an individual's unique symptoms and concerns 
              and develop custom care plans that improve health and quality of life.
            </p>

            <p>
              To receive all-inclusive health care for you and each member of your family, partner with the team at 
              Texas Primary & Pediatric Care. To schedule an appointment, book online, or call the office today.
            </p>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}