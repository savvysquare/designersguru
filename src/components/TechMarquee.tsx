import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const TechMarquee = () => {
  return (
    <section className="py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-10 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Why Choose Us</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3 max-w-2xl mx-auto">
            We Don't Just Build — We Help You{" "}
            <span className="text-gradient-copper">Grow</span>
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            From stunning websites to smart automations, we give small businesses the tools 
            big companies use — at prices that make sense.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default TechMarquee;
