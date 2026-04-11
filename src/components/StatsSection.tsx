import { motion } from "framer-motion";
import { ArrowUpRight, Star, Circle } from "lucide-react";

const StatsSection = () => {
  return (
    <section id="results" className="py-24 px-6 md:px-[60px] bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start gap-8"
        >
          <div className="space-y-6 max-w-2xl">
            <span className="text-[11px] font-semibold tracking-[0.15em] text-primary uppercase">
              Results
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-display font-bold leading-[1.08] tracking-tight">
              <span className="opacity-50">Our focus is simple</span>{"\n"}
              Design to <span className="text-gradient-copper">convert</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-[320px] md:pt-16">
            We promise to deliver beyond your expectations for your business.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr] gap-5">
          {/* Column 1 */}
          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border border-border rounded-3xl p-8 flex flex-col justify-between h-[180px]"
            >
              <span className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                10+ Partners
              </span>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/guru${i}/100/100`}
                      alt="Partner"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-card rounded-3xl p-8 shadow-sm border border-border flex flex-col justify-between h-[280px]"
            >
              <p className="text-base font-medium leading-snug max-w-[200px] text-foreground">
                Results that keep clients coming back for more
              </p>
              <div>
                <div className="text-5xl font-bold tracking-tight text-gradient-copper">100%</div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  Completion rate
                </div>
              </div>
            </motion.div>
          </div>

          {/* Column 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="bg-card rounded-3xl p-8 shadow-sm border border-border flex flex-col justify-between h-auto md:h-[480px]"
          >
            <p className="text-base font-medium leading-snug max-w-[220px] text-foreground">
              Through our custom-tailored design systems
            </p>
            <div className="space-y-8 mt-8 md:mt-0">
              <div>
                <div className="text-5xl font-bold tracking-tight text-gradient-copper">15+</div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  Projects delivered
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-foreground">
                  Available now
                </span>
              </div>
            </div>
          </motion.div>

          {/* Column 3 — Dark card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-3xl p-10 flex flex-col justify-between h-auto md:h-[480px] relative overflow-hidden group"
            style={{ background: "hsl(0 0% 8%)", color: "hsl(0 0% 95%)" }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <ArrowUpRight size={240} strokeWidth={1} />
            </div>

            <div className="relative z-10 space-y-8">
              <p className="text-xl md:text-2xl font-medium leading-snug opacity-90">
                We've helped businesses across industries ship faster, look better, and convert more
              </p>
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} className="fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <div className="text-2xl font-bold">5/5</div>
              </div>
            </div>

            <div className="relative z-10 mt-8 md:mt-0">
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
