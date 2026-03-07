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

      {/* ── Subtle full-page background: design · code · AI ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="bgGlow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(25,85%,55%)" stopOpacity="0.13" />
              <stop offset="100%" stopColor="hsl(25,85%,55%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bgGlow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(217,91%,60%)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="hsl(217,91%,60%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient glows */}
          <ellipse cx="160"  cy="180" rx="480" ry="340" fill="url(#bgGlow1)" />
          <ellipse cx="1300" cy="740" rx="420" ry="300" fill="url(#bgGlow2)" />
          <ellipse cx="720"  cy="450" rx="300" ry="220" fill="url(#bgGlow1)" fillOpacity="0.3" />

          {/* ── Browser / website frame — top right ── */}
          <g opacity="0.048" transform="translate(1148, 52) rotate(-6)">
            <rect x="0" y="0" width="200" height="145" rx="12" stroke="hsl(25,85%,65%)" strokeWidth="2.5" fill="none" />
            <line x1="0" y1="32" x2="200" y2="32" stroke="hsl(25,85%,65%)" strokeWidth="2" />
            <circle cx="16" cy="16" r="5" fill="hsl(25,85%,65%)" />
            <circle cx="34" cy="16" r="5" fill="hsl(25,85%,65%)" />
            <circle cx="52" cy="16" r="5" fill="hsl(25,85%,65%)" />
            <rect x="14" y="46" width="80" height="7" rx="3.5" fill="hsl(25,85%,65%)" />
            <rect x="14" y="62" width="110" height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.6" />
            <rect x="14" y="75" width="90"  height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.4" />
            <rect x="14" y="88" width="65"  height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.3" />
            <rect x="115" y="46" width="72" height="88" rx="6" fill="hsl(25,85%,65%)" opacity="0.12" />
          </g>

          {/* ── Design pen tool — bottom left ── */}
          <g opacity="0.042" transform="translate(52, 645) rotate(10)">
            <path d="M40 110 L75 18 L95 18 L130 110 Z" stroke="hsl(25,85%,65%)" strokeWidth="2.5" fill="none" />
            <line x1="85" y1="18" x2="85" y2="-4" stroke="hsl(25,85%,65%)" strokeWidth="3" />
            <circle cx="85" cy="-10" r="7" fill="hsl(25,85%,65%)" />
            <line x1="52" y1="78" x2="118" y2="78" stroke="hsl(25,85%,65%)" strokeWidth="1.5" strokeDasharray="5 3" />
            <path d="M40 110 L12 132 L28 118 Z" fill="hsl(25,85%,65%)" />
          </g>

          {/* ── AI neural network — right mid ── */}
          <g opacity="0.042" transform="translate(1360, 390)">
            <circle cx="0"   cy="0"   r="9"  fill="hsl(25,85%,65%)" />
            <circle cx="62"  cy="-44" r="6"  fill="hsl(25,85%,65%)" />
            <circle cx="70"  cy="46"  r="7"  fill="hsl(25,85%,65%)" />
            <circle cx="-54" cy="30"  r="5"  fill="hsl(25,85%,65%)" />
            <circle cx="26"  cy="-86" r="5"  fill="hsl(25,85%,65%)" />
            <circle cx="-28" cy="-58" r="4"  fill="hsl(25,85%,65%)" />
            <line x1="0"  y1="0"   x2="62"  y2="-44" stroke="hsl(25,85%,65%)" strokeWidth="1.5" opacity="0.7" />
            <line x1="0"  y1="0"   x2="70"  y2="46"  stroke="hsl(25,85%,65%)" strokeWidth="1.5" opacity="0.7" />
            <line x1="0"  y1="0"   x2="-54" y2="30"  stroke="hsl(25,85%,65%)" strokeWidth="1.5" opacity="0.7" />
            <line x1="62" y1="-44" x2="26"  y2="-86" stroke="hsl(25,85%,65%)" strokeWidth="1.5" opacity="0.7" />
            <line x1="0"  y1="0"   x2="-28" y2="-58" stroke="hsl(25,85%,65%)" strokeWidth="1.5" opacity="0.7" />
          </g>

          {/* ── Small AI cluster — lower left ── */}
          <g opacity="0.032" transform="translate(195, 715)">
            <circle cx="0"   cy="0"   r="7" fill="hsl(25,85%,65%)" />
            <circle cx="50"  cy="-30" r="5" fill="hsl(25,85%,65%)" />
            <circle cx="-40" cy="-20" r="4" fill="hsl(25,85%,65%)" />
            <circle cx="30"  cy="40"  r="5" fill="hsl(25,85%,65%)" />
            <line x1="0" y1="0" x2="50"  y2="-30" stroke="hsl(25,85%,65%)" strokeWidth="1.2" opacity="0.7" />
            <line x1="0" y1="0" x2="-40" y2="-20" stroke="hsl(25,85%,65%)" strokeWidth="1.2" opacity="0.7" />
            <line x1="0" y1="0" x2="30"  y2="40"  stroke="hsl(25,85%,65%)" strokeWidth="1.2" opacity="0.7" />
          </g>

          {/* ── Code brackets — left mid ── */}
          <text
            x="18" y="515"
            fontFamily="monospace"
            fontSize="100"
            fill="hsl(25,85%,65%)"
            opacity="0.038"
            transform="rotate(-4, 18, 515)"
          >&lt;/&gt;</text>

          {/* ── Subtle dashed guide lines (design grid feel) ── */}
          <line x1="0" y1="225" x2="1440" y2="225" stroke="hsl(25,85%,55%)" strokeWidth="0.5" opacity="0.04"  strokeDasharray="12 22" />
          <line x1="0" y1="450" x2="1440" y2="450" stroke="hsl(25,85%,55%)" strokeWidth="0.5" opacity="0.03"  strokeDasharray="12 22" />
          <line x1="0" y1="675" x2="1440" y2="675" stroke="hsl(25,85%,55%)" strokeWidth="0.5" opacity="0.024" strokeDasharray="12 22" />
        </svg>
      </div>

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
