import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" aria-label="Hero — 10x your business with designs that work" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Stage Glow Background */}
      <div className="absolute inset-0 pointer-events-none hero-stage-glow opacity-60 dark:opacity-100" />
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 flex flex-col items-center text-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mb-8 px-4 py-1.5 rounded-full border border-border bg-background/50 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Creative Agency
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-black leading-[1.05] tracking-tight mb-8"
        >
          10x <span className="text-gradient-copper">your business</span> <br className="hidden md:block" />
          with designs <em className="font-display italic not-italic font-black text-muted-foreground/80">that work</em>.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          We build brands and AI systems that don't just look good — they work harder than your whole marketing team. Every story deserves a digital stage.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => window.dispatchEvent(new Event("open-guru-chat"))}
            className="btn-premium inline-flex items-center justify-center gap-2"
          >
            <Bot className="w-5 h-5" />
            Talk to Guru
          </button>
          <a
            href="#contact"
            className="btn-premium-outline inline-flex items-center justify-center gap-2"
          >
            Let's Talk
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
