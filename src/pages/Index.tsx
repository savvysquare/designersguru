import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TechMarquee from "@/components/TechMarquee";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import TestimonialSection from "@/components/TestimonialSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import GuruChat from "@/components/GuruChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <main>
        <HeroSection />
        <TechMarquee />
        <ServicesSection />
        <WorkSection />
        <StatsSection />
        <AboutSection />
        <TestimonialSection />
        <ContactSection />
      </main>
      <Footer />
      <GuruChat />
    </div>
  );
};

export default Index;
