import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bento-card relative bg-foreground text-background p-10 md:p-16 text-center shadow-2xl"
        >
          {/* Decorative quotes */}
          <Quote className="w-16 h-16 text-primary/20 absolute top-8 left-8" />
          <Quote className="w-16 h-16 text-primary/20 absolute bottom-8 right-8 rotate-180" />

          <div className="relative z-10">
            <h2 className="text-xl md:text-3xl font-display font-medium leading-relaxed mb-10">
              "Working with designers.guru was a game-changer for Jikona Evalora. They understood our vision
              from day one and delivered a brand presence that truly represents who we are. Professional, creative, and reliable."
            </h2>
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="font-bold text-lg text-primary">I</span>
              </div>
              <div>
                <p className="font-bold text-lg text-background">Ife</p>
                <p className="text-sm font-semibold tracking-widest text-background/70 uppercase mt-1">Founder, Jikona Evalora</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
