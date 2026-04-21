import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" aria-label="Hero — 10x your business with designs that work" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(0 0% 0% / 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(0 0% 0% / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-[60px] pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-[4rem] font-display font-bold leading-[1.08] tracking-tight mb-6"
            >
              10x{" "}
              <br className="hidden md:block" />
              <span className="text-gradient-copper">your business</span> with{" "}
              <br className="hidden md:block" />
              designs <em className="font-display italic not-italic font-bold" style={{ fontStyle: 'italic' }}>that work</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base md:text-lg text-muted-foreground max-w-md mb-10 leading-relaxed"
            >
              We build brands and AI systems
              that don't just look good — they work harder than
              your whole marketing team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => window.dispatchEvent(new Event("open-guru-chat"))}
                className="btn-ios inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold"
              >
                <Bot className="w-4 h-4" />
                Talk to Guru
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                href="#contact"
                className="btn-ios-ghost inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-foreground rounded-full text-sm font-medium"
              >
                Let's talk
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </div>

          {/* Right — Growth Chart Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg ml-auto">
              {/* Grid background */}
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-[0.08]">
                {[0, 80, 160, 240, 320, 400].map((pos) => (
                  <g key={pos}>
                    <line x1={pos} y1="0" x2={pos} y2="400" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="0" y1={pos} x2="400" y2={pos} stroke="currentColor" strokeWidth="0.5" />
                  </g>
                ))}
                {/* Y-axis labels */}
                <text x="8" y="328" fontSize="10" fill="currentColor" opacity="0.5">1k</text>
                <text x="8" y="248" fontSize="10" fill="currentColor" opacity="0.5">10k</text>
                <text x="8" y="168" fontSize="10" fill="currentColor" opacity="0.5">100k</text>
              </svg>

              {/* Growth curve */}
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="curveGrad" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(25, 85%, 55%)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="hsl(25, 85%, 55%)" />
                  </linearGradient>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(25, 85%, 55%)" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="hsl(25, 85%, 55%)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <path
                  d="M 40 360 Q 120 340 180 300 Q 250 250 290 180 Q 340 80 370 60 L 370 400 L 40 400 Z"
                  fill="url(#areaGrad)"
                />
                {/* Main curve */}
                <path
                  d="M 40 360 Q 120 340 180 300 Q 250 250 290 180 Q 340 80 370 60"
                  fill="none"
                  stroke="url(#curveGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* End dot */}
                <circle cx="370" cy="60" r="12" fill="hsl(25, 85%, 55%)" />
                <circle cx="370" cy="60" r="20" fill="hsl(25, 85%, 55%)" opacity="0.2" />
                <circle cx="370" cy="60" r="28" fill="hsl(25, 85%, 55%)" opacity="0.08" />
              </svg>

              {/* Stats card floating */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 left-1/4 bg-card rounded-2xl px-8 py-5 shadow-lg border border-border"
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-foreground">+320%</p>
                <p className="text-sm text-muted-foreground mt-1">Monthly revenue</p>
              </motion.div>

              {/* GD badge */}
              <div className="absolute bottom-8 right-8 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">GD</span>
              </div>

              {/* Brand watermark */}
              <div className="absolute bottom-8 left-8">
                <span className="font-display text-sm font-bold text-foreground opacity-30">designers.guru</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
