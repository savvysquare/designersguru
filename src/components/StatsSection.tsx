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
    <div ref={ref} className="text-5xl font-bold tracking-tight text-gradient-copper">
      {prefix}{count}{suffix}
    </div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const StatsSection = () => {
  return (
    <section id="results" className="py-24 px-6 md:px-[60px] bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row justify-between items-start gap-8"
        >
          <div className="space-y-6 max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block text-[11px] font-semibold tracking-[0.15em] text-primary uppercase"
            >
              Results
            </motion.span>
            <h2 className="text-[40px] md:text-[48px] leading-[1.1] tracking-[-0.02em] whitespace-pre-line font-semibold">
              <span className="opacity-50">Our focus is simple</span>{"\n"}
              Design to <span className="text-gradient-copper">convert</span>
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-muted-foreground text-base leading-relaxed max-w-[320px] md:pt-16"
          >
            We promise to deliver beyond your expectations for your business.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr] gap-5">
          {/* Column 1 */}
          <div className="flex flex-col gap-5">
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="border border-border rounded-3xl p-8 flex flex-col justify-between h-[220px]"
            >
              <span className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                20+ Clients Served
              </span>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
                    className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden"
                  >
                    <img
                      src={`https://picsum.photos/seed/guru${i}/100/100`}
                      alt="Client"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                Brands that trust us keep coming back — and send their friends.
              </p>
            </motion.div>

            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="bg-card rounded-3xl p-8 shadow-sm border border-border flex flex-col justify-between h-[300px]"
            >
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Completion rate
              </div>
              <div>
                <AnimatedCounter value={100} suffix="%" />
                <div className="text-[11px] font-bold text-foreground uppercase tracking-wider mt-1">
                  Every project, delivered
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                On time, on brief, no exceptions.
              </p>
            </motion.div>
          </div>

          {/* Column 2 */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="bg-card rounded-3xl p-8 shadow-sm border border-border flex flex-col justify-between h-auto md:h-[540px]"
          >
            <div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                What sets us apart
              </div>
              <p className="text-base font-medium leading-snug text-foreground">
                Design, marketing, AI automation & web — one studio, zero handoff friction. You get a team that thinks end-to-end, not in silos.
              </p>
            </div>
            <div className="space-y-8 mt-8 md:mt-0">
              <div>
                <AnimatedCounter value={30} suffix="+" />
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  Projects delivered
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full"
              >
                <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-foreground">
                  Taking on new projects
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Column 3 — Dark card */}
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="rounded-3xl p-10 flex flex-col justify-between h-auto md:h-[540px] relative overflow-hidden group"
            style={{ background: "hsl(0 0% 8%)", color: "hsl(0 0% 95%)" }}
          >
            <div className="relative z-10">
              <div className="text-[11px] font-semibold tracking-[0.15em] uppercase opacity-50 mb-6">
                What our clients say
              </div>
              <p className="text-2xl md:text-3xl font-semibold leading-snug italic">
                Brands leave us looking sharper, growing faster, and working smarter.
              </p>
            </div>

            <div className="relative z-10 mt-8 md:mt-0 space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex gap-1 items-center"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 300 }}
                  >
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  </motion.span>
                ))}
                <span className="text-2xl font-bold ml-2">5/5</span>
              </motion.div>
              <div className="text-[11px] font-medium tracking-[0.1em] opacity-50 uppercase">
                Trusted by clients worldwide
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
