import AboutSection from './components/AboutSection';
import DoctorsCarousel from './components/DoctorsCaraousel';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import Map from './components/Map';
import Footer from './components/Footer';
import Blog from './components/Blog';
import GoogleReviewCarousel from './components/GoogleReviewCarousel';
import AffiliationsSection from './components/Affilationsection';
import Contact from './components/Contact';
import MissionSection from './components/MissionSection';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <Hero />
      <MissionSection />
      <AboutSection />
      <DoctorsCarousel />
      {/* <AffiliationsSection /> */}
      <ServicesSection />
      <GoogleReviewCarousel />
      <Blog />
      <Map />
      <Contact />
      <Footer />
    </main>
  );
}