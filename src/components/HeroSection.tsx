import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="home" className="pt-28 pb-16 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24 items-start">
        {/* Left Side: Massive Typography */}
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="tag-label bg-pastel-orange text-primary mb-8"
          >
            Senior design studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[52px] leading-[1.05] md:text-[80px] lg:text-[100px] font-black tracking-[-0.04em] text-foreground mb-6"
          >
            Designs that <br /> <span className="text-primary">work.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-lg md:text-xl text-foreground/70 font-medium leading-relaxed max-w-xl mb-8"
          >
            We build the brand, the website, and the AI systems behind it — so your company stops
            looking cheaper than the work you actually do.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a href="#contact" className="btn-primary">
              Book a strategy call
            </a>
            <a href="#works" className="btn-outline">
              See the work
            </a>
          </motion.div>
        </div>

        {/* Right Side: Pastel Proof Cards Grid */}
        <div className="grid grid-cols-2 gap-4 w-full pt-8 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="crescent-card bg-pastel-orange aspect-square flex flex-col justify-between"
          >
            <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">01</span>
            <div>
              <p className="text-3xl md:text-4xl font-black leading-none mb-2">30+</p>
              <p className="text-sm font-medium text-foreground/70">Sites and brands shipped</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="crescent-card bg-pastel-sand aspect-square flex flex-col justify-between"
          >
            <span className="font-mono text-xs text-foreground/50 font-bold tracking-widest uppercase">02</span>
            <div>
              <p className="text-3xl md:text-4xl font-black leading-none mb-2">Senior team</p>
              <p className="text-sm font-medium text-foreground/70">No junior bench. Strategy to launch.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-span-2 crescent-card bg-pastel-gray flex flex-col justify-between p-8"
          >
            <span className="font-mono text-sm text-foreground/50 font-semibold mb-10">03</span>
            <div>
              <p className="text-xl md:text-2xl font-bold mb-3">Built for founders</p>
              <p className="text-base font-medium text-foreground/70">
                Brand, web and automation in one studio — so you are not managing three vendors.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
