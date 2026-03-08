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

      {/* ── Industry background: design · code · AI craft ── */}
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
              <stop offset="0%" stopColor="hsl(25,85%,55%)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="hsl(25,85%,55%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bgGlow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(217,91%,60%)" stopOpacity="0.09" />
              <stop offset="100%" stopColor="hsl(217,91%,60%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bgGlow3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(25,85%,55%)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(25,85%,55%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient glows — richer, more defined */}
          <ellipse cx="120"  cy="160" rx="520" ry="360" fill="url(#bgGlow1)" />
          <ellipse cx="1320" cy="750" rx="460" ry="320" fill="url(#bgGlow2)" />
          <ellipse cx="780"  cy="480" rx="320" ry="240" fill="url(#bgGlow3)" />

          {/* ── Browser / website wireframe — top right ── */}
          <g opacity="0.09" transform="translate(1100, 48) rotate(-5)">
            <rect x="0" y="0" width="230" height="168" rx="13" stroke="hsl(25,85%,65%)" strokeWidth="2" fill="none" />
            <line x1="0" y1="36" x2="230" y2="36" stroke="hsl(25,85%,65%)" strokeWidth="1.5" />
            {/* Traffic lights */}
            <circle cx="18" cy="18" r="5.5" fill="hsl(0,75%,60%)" opacity="0.7" />
            <circle cx="36" cy="18" r="5.5" fill="hsl(40,90%,60%)" opacity="0.7" />
            <circle cx="54" cy="18" r="5.5" fill="hsl(142,70%,50%)" opacity="0.7" />
            {/* URL bar */}
            <rect x="74" y="10" width="120" height="16" rx="8" fill="hsl(25,85%,65%)" opacity="0.12" />
            {/* Content skeleton */}
            <rect x="16" y="52" width="96" height="10" rx="5" fill="hsl(25,85%,65%)" opacity="0.55" />
            <rect x="16" y="70" width="138" height="6" rx="3" fill="hsl(25,85%,65%)" opacity="0.3" />
            <rect x="16" y="83" width="112" height="6" rx="3" fill="hsl(25,85%,65%)" opacity="0.22" />
            <rect x="16" y="96" width="80"  height="6" rx="3" fill="hsl(25,85%,65%)" opacity="0.16" />
            {/* Image placeholder */}
            <rect x="132" y="52" width="82" height="104" rx="8" stroke="hsl(25,85%,65%)" strokeWidth="1.2" fill="hsl(25,85%,65%)" fillOpacity="0.07" />
            <line x1="132" y1="52" x2="214" y2="156" stroke="hsl(25,85%,65%)" strokeWidth="0.8" opacity="0.3" />
            <line x1="214" y1="52" x2="132" y2="156" stroke="hsl(25,85%,65%)" strokeWidth="0.8" opacity="0.3" />
            {/* CTA button */}
            <rect x="16" y="134" width="68" height="22" rx="11" fill="hsl(25,85%,55%)" opacity="0.35" />
          </g>

          {/* ── Figma-style design frame — top left ── */}
          <g opacity="0.078" transform="translate(38, 80) rotate(4)">
            {/* Outer frame */}
            <rect x="0" y="0" width="160" height="120" rx="4" stroke="hsl(25,85%,65%)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
            {/* Inner component boxes */}
            <rect x="12" y="14" width="60" height="42" rx="3" stroke="hsl(25,85%,65%)" strokeWidth="1" fill="hsl(25,85%,65%)" fillOpacity="0.06" />
            <rect x="84" y="14" width="64" height="20" rx="3" stroke="hsl(25,85%,65%)" strokeWidth="1" fill="hsl(25,85%,65%)" fillOpacity="0.06" />
            <rect x="84" y="40" width="64" height="16" rx="3" stroke="hsl(25,85%,65%)" strokeWidth="1" fill="hsl(25,85%,65%)" fillOpacity="0.04" />
            {/* Alignment guides */}
            <line x1="12" y1="75" x2="148" y2="75" stroke="hsl(25,85%,65%)" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.5" />
            <rect x="12" y="82" width="136" height="24" rx="3" stroke="hsl(25,85%,65%)" strokeWidth="1" fill="hsl(25,85%,65%)" fillOpacity="0.08" />
            {/* Corner handles */}
            <rect x="-3" y="-3"   width="7" height="7" rx="1.5" fill="hsl(217,91%,70%)" opacity="0.8" />
            <rect x="156" y="-3"  width="7" height="7" rx="1.5" fill="hsl(217,91%,70%)" opacity="0.8" />
            <rect x="-3" y="116"  width="7" height="7" rx="1.5" fill="hsl(217,91%,70%)" opacity="0.8" />
            <rect x="156" y="116" width="7" height="7" rx="1.5" fill="hsl(217,91%,70%)" opacity="0.8" />
          </g>

          {/* ── Neural network / AI — right mid ── */}
          <g opacity="0.082" transform="translate(1370, 380)">
            {/* Central node */}
            <circle cx="0"   cy="0"   r="10" fill="hsl(25,85%,65%)" />
            <circle cx="0"   cy="0"   r="16" stroke="hsl(25,85%,65%)" strokeWidth="1" fill="none" opacity="0.4" />
            {/* Satellite nodes */}
            <circle cx="68"  cy="-50" r="7"  fill="hsl(25,85%,65%)" />
            <circle cx="72"  cy="52"  r="8"  fill="hsl(25,85%,65%)" />
            <circle cx="-60" cy="28"  r="6"  fill="hsl(25,85%,65%)" />
            <circle cx="24"  cy="-88" r="5"  fill="hsl(25,85%,65%)" opacity="0.7" />
            <circle cx="-30" cy="-62" r="5"  fill="hsl(25,85%,65%)" opacity="0.7" />
            <circle cx="90"  cy="8"   r="4"  fill="hsl(217,91%,70%)" opacity="0.7" />
            {/* Connections */}
            <line x1="0"  y1="0"   x2="68"  y2="-50" stroke="hsl(25,85%,65%)" strokeWidth="1.5" opacity="0.6" />
            <line x1="0"  y1="0"   x2="72"  y2="52"  stroke="hsl(25,85%,65%)" strokeWidth="1.5" opacity="0.6" />
            <line x1="0"  y1="0"   x2="-60" y2="28"  stroke="hsl(25,85%,65%)" strokeWidth="1.5" opacity="0.6" />
            <line x1="68" y1="-50" x2="24"  y2="-88" stroke="hsl(25,85%,65%)" strokeWidth="1" opacity="0.4" />
            <line x1="0"  y1="0"   x2="-30" y2="-62" stroke="hsl(25,85%,65%)" strokeWidth="1" opacity="0.4" />
            <line x1="68" y1="-50" x2="90"  y2="8"   stroke="hsl(217,91%,70%)" strokeWidth="1" opacity="0.4" />
            <line x1="72" y1="52"  x2="90"  y2="8"   stroke="hsl(217,91%,70%)" strokeWidth="1" opacity="0.4" />
          </g>

          {/* ── Bezier pen path — design craft, bottom left ── */}
          <g opacity="0.075" transform="translate(48, 600)">
            <path d="M0,100 C40,20 80,80 140,30 C180,0 220,60 270,40" stroke="hsl(25,85%,65%)" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Control point handles */}
            <line x1="0"   y1="100" x2="40"  y2="20"  stroke="hsl(25,85%,65%)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <line x1="80"  y1="80"  x2="140" y2="30"  stroke="hsl(25,85%,65%)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <line x1="180" y1="0"   x2="220" y2="60"  stroke="hsl(25,85%,65%)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            {/* Anchor points */}
            <rect x="-4"  y="96"  width="9" height="9" rx="2" fill="none" stroke="hsl(25,85%,65%)" strokeWidth="1.5" />
            <rect x="136" y="26"  width="9" height="9" rx="2" fill="none" stroke="hsl(25,85%,65%)" strokeWidth="1.5" />
            <rect x="266" y="36"  width="9" height="9" rx="2" fill="none" stroke="hsl(25,85%,65%)" strokeWidth="1.5" />
            {/* Control diamonds */}
            <circle cx="40"  cy="20"  r="4" fill="hsl(217,91%,70%)" opacity="0.7" />
            <circle cx="80"  cy="80"  r="4" fill="hsl(217,91%,70%)" opacity="0.7" />
            <circle cx="180" cy="0"   r="4" fill="hsl(217,91%,70%)" opacity="0.7" />
            <circle cx="220" cy="60"  r="4" fill="hsl(217,91%,70%)" opacity="0.7" />
          </g>

          {/* ── Code block — left mid ── */}
          <g opacity="0.07" transform="translate(14, 400) rotate(-3)">
            <rect x="0" y="0" width="172" height="96" rx="8" fill="hsl(0,0%,100%)" fillOpacity="0.03" stroke="hsl(25,85%,65%)" strokeWidth="1" />
            {/* Syntax highlight lines */}
            <rect x="12" y="14" width="28" height="5" rx="2.5" fill="hsl(217,91%,70%)" opacity="0.7" />
            <rect x="48" y="14" width="52" height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.6" />
            <rect x="12" y="26" width="16" height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.4" />
            <rect x="36" y="26" width="44" height="5" rx="2.5" fill="hsl(142,70%,55%)" opacity="0.5" />
            <rect x="24" y="38" width="60" height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.35" />
            <rect x="24" y="50" width="80" height="5" rx="2.5" fill="hsl(217,91%,70%)" opacity="0.4" />
            <rect x="12" y="62" width="36" height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.3" />
            <rect x="12" y="76" width="22" height="5" rx="2.5" fill="hsl(25,85%,65%)" opacity="0.4" />
            <rect x="42" y="76" width="14" height="5" rx="2.5" fill="hsl(142,70%,55%)" opacity="0.4" />
            {/* Line numbers */}
            <rect x="0" y="0" width="6" height="96" rx="3" fill="hsl(25,85%,65%)" opacity="0.08" />
          </g>

          {/* ── Colour palette swatches — bottom right ── */}
          <g opacity="0.08" transform="translate(1260, 780) rotate(-8)">
            <rect x="0"   y="0" width="30" height="30" rx="6" fill="hsl(25,85%,55%)" />
            <rect x="36"  y="0" width="30" height="30" rx="6" fill="hsl(217,91%,60%)" />
            <rect x="72"  y="0" width="30" height="30" rx="6" fill="hsl(142,70%,45%)" />
            <rect x="108" y="0" width="30" height="30" rx="6" fill="hsl(0,0%,20%)" />
            <rect x="144" y="0" width="30" height="30" rx="6" fill="hsl(35,100%,70%)" />
          </g>

          {/* ── Subtle dashed grid lines ── */}
          <line x1="0" y1="225" x2="1440" y2="225" stroke="hsl(25,85%,55%)" strokeWidth="0.6" opacity="0.055" strokeDasharray="10 20" />
          <line x1="0" y1="450" x2="1440" y2="450" stroke="hsl(25,85%,55%)" strokeWidth="0.6" opacity="0.04"  strokeDasharray="10 20" />
          <line x1="0" y1="675" x2="1440" y2="675" stroke="hsl(25,85%,55%)" strokeWidth="0.6" opacity="0.03"  strokeDasharray="10 20" />
          <line x1="360"  y1="0" x2="360"  y2="900" stroke="hsl(25,85%,55%)" strokeWidth="0.5" opacity="0.025" strokeDasharray="8 18" />
          <line x1="720"  y1="0" x2="720"  y2="900" stroke="hsl(25,85%,55%)" strokeWidth="0.5" opacity="0.025" strokeDasharray="8 18" />
          <line x1="1080" y1="0" x2="1080" y2="900" stroke="hsl(25,85%,55%)" strokeWidth="0.5" opacity="0.02"  strokeDasharray="8 18" />
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
