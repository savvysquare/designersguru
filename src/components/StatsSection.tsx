import { motion } from "framer-motion";

const stats = [
  { value: "15+", label: "Projects Delivered", description: "Websites and brands shipped for clients across different industries." },
  { value: "10+", label: "Happy Clients", description: "Growing a base of satisfied clients who trust us with their digital presence." },
  { value: "100%", label: "Completion Rate", description: "Every project we take on gets delivered — on time and beyond expectations." },
];

const StatsSection = () => {
  return (
    <section id="results" className="py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Real <span className="text-gradient-copper">Results</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Numbers don't lie. Here's what we've achieved.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="p-7 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300"
            >
              <span className="text-[10px] font-semibold tracking-widest text-primary uppercase">{stat.label}</span>
              <p className="text-4xl md:text-5xl font-bold mt-3 mb-3 text-gradient-copper">{stat.value}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
