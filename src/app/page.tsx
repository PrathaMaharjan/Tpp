import AboutSection from './components/AboutSection';
import DoctorsCarousel from './components/DoctorsCaraousel';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import Map from './components/Map';
import Footer from './components/Footer';
import Blog from './components/Blog';
import GoogleReviewCarousel from './components/GoogleReviewCarousel';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <Hero />
      <AboutSection />
      <DoctorsCarousel />
      
      <ServicesSection />
      <GoogleReviewCarousel  />
      <Blog/>
      <Map/>
      <Footer />
    </main>
  );
}