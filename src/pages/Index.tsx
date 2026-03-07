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
      {/* Subtle decorative SVG background — expresses design, code & AI */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(25,85%,55%)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="hsl(25,85%,55%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(217,91%,60%)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="hsl(217,91%,60%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Warm copper glow — top left hero area */}
          <ellipse cx="10%" cy="18%" rx="420" ry="320" fill="url(#glow1)" />
          {/* Cool blue glow — bottom right */}
          <ellipse cx="90%" cy="82%" rx="380" ry="280" fill="url(#glow2)" />
          {/* Faint mid glow */}
          <ellipse cx="55%" cy="52%" rx="260" ry="200" fill="url(#glow1)" fillOpacity="0.4" />

          {/* ── Browser / website icon — top right ── */}
          <g opacity="0.045" transform="translate(calc(100vw - 280), 60) rotate(-8)">
            <rect x="0" y="0" width="180" height="130" rx="12" stroke="hsl(25,85%,65%)" strokeWidth="3" fill="none" />
            <line x1="0" y1="30" x2="180" y2="30" stroke="hsl(25,85%,65%)" strokeWidth="2" />
            <circle cx="16" cy="15" r="5" fill="hsl(25,85%,65%)" />
            <circle cx="34" cy="15" r="5" fill="hsl(25,85%,65%)" />
            <circle cx="52" cy="15" r="5" fill="hsl(25,85%,65%)" />
            <rect x="14" y="44" width="70" height="7" rx="3.5" fill="hsl(25,85%,65%)" />
            <rect x="14" y="58" width="100" height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.6" />
            <rect x="14" y="70" width="85" height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.4" />
            <rect x="100" y="44" width="66" height="70" rx="6" fill="hsl(25,85%,65%)" opacity="0.15" />
          </g>

          {/* ── Pen / design tool icon — bottom left ── */}
          <g opacity="0.04" transform="translate(60, calc(100vh - 240)) rotate(12)">
            <path d="M40 100 L70 20 L90 20 L120 100 Z" stroke="hsl(25,85%,65%)" strokeWidth="3" fill="none" />
            <line x1="80" y1="20" x2="80" y2="0" stroke="hsl(25,85%,65%)" strokeWidth="3" />
            <circle cx="80" cy="0" r="6" fill="hsl(25,85%,65%)" />
            <line x1="50" y1="70" x2="110" y2="70" stroke="hsl(25,85%,65%)" strokeWidth="2" strokeDasharray="4 3" />
          </g>

          {/* ── AI neural node cluster — center right ── */}
          <g opacity="0.038" transform="translate(calc(100vw - 180), 45%)">
            <circle cx="0"   cy="0"   r="8" fill="hsl(25,85%,65%)" />
            <circle cx="60"  cy="-40" r="6" fill="hsl(25,85%,65%)" />
            <circle cx="70"  cy="40"  r="7" fill="hsl(25,85%,65%)" />
            <circle cx="-50" cy="30"  r="5" fill="hsl(25,85%,65%)" />
            <circle cx="30"  cy="-80" r="5" fill="hsl(25,85%,65%)" />
            <line x1="0" y1="0" x2="60"  y2="-40" stroke="hsl(25,85%,65%)" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="70"  y2="40"  stroke="hsl(25,85%,65%)" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="-50" y2="30"  stroke="hsl(25,85%,65%)" strokeWidth="1.5" />
            <line x1="60" y1="-40" x2="30" y2="-80" stroke="hsl(25,85%,65%)" strokeWidth="1.5" />
          </g>

          {/* ── Code brackets — mid left ── */}
          <g opacity="0.04" transform="translate(30, 45%)">
            <text fontFamily="monospace" fontSize="90" fill="hsl(25,85%,65%)" transform="rotate(-5)">&lt;/&gt;</text>
          </g>
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
