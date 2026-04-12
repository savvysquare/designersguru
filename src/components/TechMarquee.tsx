import { motion } from "framer-motion";

const TechMarquee = () => {
  return (
    <section className="py-24 px-6 md:px-[60px] bg-background">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl lg:text-[56px] font-bold leading-[1.15] tracking-tight text-foreground"
        >
          We help businesses{" "}
          <motion.span
            className="inline-block w-7 h-7 md:w-9 md:h-9 rounded-lg bg-primary align-middle mx-1 cursor-pointer"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />{" "}
          to innovate
          <br className="hidden md:block" />{" "}
          and{" "}
          <motion.span
            className="inline-block w-7 h-7 md:w-9 md:h-9 rounded-lg bg-foreground align-middle mx-1 cursor-pointer"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />{" "}
          remain highly relevant to
          <br className="hidden md:block" />{" "}
          their customers by developing{" "}
          <motion.span
            className="inline-block w-7 h-7 md:w-9 md:h-9 rounded-lg bg-foreground align-middle mx-1 cursor-pointer"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <br className="hidden md:block" />{" "}
          edge digital products
        </motion.h2>
      </div>
    </section>
  );
};

export default TechMarquee;
