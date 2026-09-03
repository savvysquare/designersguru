import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import TechMarquee from "@/components/TechMarquee";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import WorksSection from "@/components/WorkSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import GuruChat from "@/components/GuruChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <TechMarquee />
        <ProblemSection />
        <ServicesSection />
        <ProcessSection />
        <WorksSection />
        <StatsSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <GuruChat />
    </div>
  );
};

export default Index;
