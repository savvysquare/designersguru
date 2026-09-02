import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Diagnose",
    body: "A 20-minute review of the current brand and site. You leave with 3 specific changes even if we never work together.",
  },
  {
    n: "02",
    title: "Scope",
    body: "One written plan. What ships, what does not, timeline, fee. No surprise invoices.",
  },
  {
    n: "03",
    title: "Build",
    body: "Brand and/or site in focused sprints. You see work weekly, not at the end.",
  },
  {
    n: "04",
    title: "Install",
    body: "Launch, training, and optional AI follow-up systems so the site does not go quiet.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 max-w-3xl">
          <div className="tag-label bg-white border border-border text-foreground mb-6">How we work</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            A strategy call. Then we <span className="text-primary">build</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="crescent-card bg-pastel-sand flex flex-col"
            >
              <span className="font-mono text-sm text-foreground/50 font-semibold mb-8">{s.n}</span>
              <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
              <p className="text-base font-medium text-foreground/70 leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 crescent-card bg-white border border-border">
          <p className="text-base md:text-lg font-medium text-foreground/70 leading-relaxed max-w-3xl">
            Typical brand and site engagements start in the mid four figures. Retainers for ongoing design
            and automation sit above that. If that is not your range, we will say so on the first call.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
