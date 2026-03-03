import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Quote className="w-10 h-10 text-primary mx-auto mb-8 opacity-60" />
          <blockquote className="text-lg md:text-xl font-display font-medium leading-relaxed mb-6">
            "Working with designers.guru was a game-changer for Jikona Evalora. They understood our vision
            from day one and delivered a brand presence that truly represents who we are. Professional, creative, and reliable."
          </blockquote>
          <div>
            <p className="font-semibold text-foreground">Ife</p>
            <p className="text-sm text-muted-foreground">Founder, Jikona Evalora</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
