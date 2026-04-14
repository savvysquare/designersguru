import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const TechMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);

  const box1Rotate = useTransform(scrollYProgress, [0.15, 0.45], [0, 360]);
  const box2Rotate = useTransform(scrollYProgress, [0.25, 0.55], [0, 360]);
  const box3Rotate = useTransform(scrollYProgress, [0.35, 0.65], [0, 360]);

  const box1Scale = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const box2Scale = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0]);
  const box3Scale = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-6 md:px-[60px] bg-background"
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          style={{ opacity, y }}
          className="text-3xl md:text-5xl lg:text-[56px] font-semibold leading-[1.15] tracking-tight text-foreground"
        >
          We help businesses{" "}
          <motion.span
            className="inline-block w-7 h-7 md:w-9 md:h-9 rounded-lg bg-primary align-middle mx-1 cursor-pointer"
            style={{ rotate: box1Rotate, scale: box1Scale }}
          />{" "}
          to innovate
          <br className="hidden md:block" />{" "}
          and{" "}
          <motion.span
            className="inline-block w-7 h-7 md:w-9 md:h-9 rounded-lg bg-foreground align-middle mx-1 cursor-pointer"
            style={{ rotate: box2Rotate, scale: box2Scale }}
          />{" "}
          remain highly relevant to
          <br className="hidden md:block" />{" "}
          their customers by developing{" "}
          <motion.span
            className="inline-block w-7 h-7 md:w-9 md:h-9 rounded-lg bg-foreground align-middle mx-1 cursor-pointer"
            style={{ rotate: box3Rotate, scale: box3Scale }}
          />
          <br className="hidden md:block" />{" "}
          edge digital products
        </motion.h2>
      </div>
    </section>
  );
};

export default TechMarquee;
