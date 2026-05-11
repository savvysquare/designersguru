import { motion } from "framer-motion";
import { Star } from "lucide-react";

const StatsSection = () => {
  return (
    <section id="results" className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        
        {/* Left Col - Stats */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="crescent-card bg-pastel-peach flex-1 flex flex-col justify-center"
          >
            <p className="text-[56px] md:text-[80px] font-black leading-none mb-4">100<span className="text-primary">%</span></p>
            <p className="text-lg font-bold">Project Completion Rate</p>
            <p className="text-sm font-medium text-foreground/70 mt-2">Delivered on time, every time.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="crescent-card bg-white border border-border flex-1 flex flex-col justify-center"
          >
             <div className="flex gap-1 mb-4">
               {[1, 2, 3, 4, 5].map((i) => (
                 <Star key={i} className="w-6 h-6 fill-primary text-primary" />
               ))}
             </div>
             <p className="text-2xl font-bold mb-2">5.0 / 5.0</p>
             <p className="text-sm font-medium text-foreground/70">Average client rating globally</p>
          </motion.div>
        </div>

        {/* Right Col - Massive Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="crescent-card bg-foreground text-background flex flex-col justify-between min-h-[500px]"
        >
          <div>
            <div className="tag-label bg-background/10 text-background/80 mb-12">Customer Story</div>
            <h3 className="text-3xl md:text-5xl font-medium leading-tight mb-12 text-background">
              "Working with Guru Designers was a game-changer. They understood our vision from day one and delivered a brand presence that truly represents who we are. Professional, creative, and remarkably reliable."
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary font-bold text-xl">
              I
            </div>
            <div>
              <p className="font-bold text-lg text-background">Ife</p>
              <p className="text-sm font-medium text-background/60">Founder, Jikona Evalora</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default StatsSection;
