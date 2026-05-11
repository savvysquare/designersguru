import { motion, useInView } from "framer-motion";
import { Star, Circle } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const AnimatedCounter = ({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
      {prefix}{count}<span className="text-primary">{suffix}</span>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section id="results" className="py-24 px-6 md:px-[60px] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row justify-between items-start gap-8"
        >
          <div className="space-y-6 max-w-2xl">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-background/50 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-primary"
            >
              Results
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Design built to <span className="text-gradient-copper">convert</span>.
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-muted-foreground text-lg leading-relaxed max-w-md lg:pt-16 font-medium"
          >
            We don't just build beautiful things. We build systems that perform, scale, and deliver measurable ROI beyond your expectations.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Left - Clients */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bento-card col-span-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-6">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">20+ Clients Served</h3>
              <p className="text-muted-foreground font-medium">
                Brands that trust us keep coming back — and send their friends.
              </p>
            </div>
            
            <div className="flex -space-x-4 mt-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 rounded-full border-2 border-card bg-secondary overflow-hidden shadow-sm"
                >
                  <img
                    src={`https://picsum.photos/seed/guru${i}/100/100`}
                    alt="Client avatar"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Center - Completion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bento-card col-span-1 flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold tracking-widest text-primary uppercase mb-6">
                Completion Rate
              </div>
              <AnimatedCounter value={100} suffix="%" />
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">Every project, delivered.</h3>
              <p className="text-muted-foreground font-medium">
                On time, on brief, no exceptions. We guarantee our timelines.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bento-card col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-between bg-foreground text-background"
          >
            <div>
              <div className="text-xs font-bold tracking-widest text-primary uppercase mb-6 opacity-80">
                The Advantage
              </div>
              <p className="text-2xl font-bold leading-tight mb-8">
                Design, marketing, AI & web — one studio, zero handoff friction.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <AnimatedCounter value={30} suffix="+" />
                <div className="text-sm font-medium opacity-80 mt-2">
                  Successful launches
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring" }}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-background/10 rounded-full border border-background/20 backdrop-blur-sm"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold tracking-widest uppercase">
                  Available for work
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
