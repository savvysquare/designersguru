import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="home" className="pt-40 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24 items-start">
        {/* Left Side: Massive Typography */}
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="tag-label bg-pastel-orange text-primary mb-8"
          >
            Digital Agency
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[56px] leading-[1.05] md:text-[80px] lg:text-[100px] font-black tracking-[-0.04em] text-foreground mb-8"
          >
            Designs that <br /> <span className="text-primary">work.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a href="#contact" className="btn-primary">
              Book a Strategy Call
            </a>
            <button onClick={() => window.dispatchEvent(new Event("open-guru-chat"))} className="btn-outline">
              Chat with Guru
            </button>
          </motion.div>
        </div>

        {/* Right Side: Pastel Stat Cards Grid */}
        <div className="grid grid-cols-2 gap-4 w-full pt-8 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="crescent-card bg-pastel-orange aspect-square flex flex-col justify-between"
          >
            <span className="font-mono text-sm text-primary font-semibold">01</span>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">10x</p>
              <p className="text-sm font-medium text-foreground/70">Average ROI for clients</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="crescent-card bg-pastel-sand aspect-square flex flex-col justify-between"
          >
            <span className="font-mono text-sm text-foreground/50 font-semibold">02</span>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">30+</p>
              <p className="text-sm font-medium text-foreground/70">Successful Launches</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-span-2 crescent-card bg-pastel-gray flex flex-col justify-between p-8"
          >
            <div className="flex justify-between items-start mb-12">
              <span className="font-mono text-sm text-foreground/50 font-semibold">03</span>
              <div className="flex -space-x-2">
                 {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white">
                    <img src={`https://picsum.photos/seed/guru${i}/100/100`} alt="Client" className="w-full h-full object-cover" />
                  </div>
                 ))}
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold">Trusted by 20+ forward-thinking brands globally.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
