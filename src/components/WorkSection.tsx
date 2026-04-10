import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import portfolioPrepper from "@/assets/portfolio-prepper.png";
import portfolioJikona from "@/assets/portfolio-jikona.png";
import portfolioFastforward from "@/assets/portfolio-fastforward.png";
import portfolioOlacv from "@/assets/portfolio-olacv.png";

const projects = [
  {
    title: "Prepper Learning",
    category: "EdTech Platform",
    description: "A chat-based learning platform helping 93k+ users learn faster.",
    image: portfolioPrepper,
    url: "https://prepperlearning.com",
  },
  {
    title: "Jikona Evalora",
    category: "Corporate Website",
    description: "Research & analytics firm turning data into decisions across Africa.",
    image: portfolioJikona,
    url: "https://jikonaevalora.com",
  },
  {
    title: "FastForward Fund",
    category: "Venture Studio",
    description: "A venture fund backing African founders building transformational companies.",
    image: portfolioFastforward,
    url: "https://fastforward.fund",
  },
  {
    title: "Ola.cv",
    category: "Domain Registrar",
    description: "The go-to platform for .cv domains trusted by professionals in 150+ countries.",
    image: portfolioOlacv,
    url: "https://ola.cv",
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Our <span className="text-gradient-copper">Work</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            See what we've built. Every project is crafted to look great and perform even better.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/20 cursor-pointer transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-black text-[11px] font-semibold">
                    Visit Site <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-semibold tracking-widest text-primary uppercase">
                  {project.category}
                </span>
                <h3 className="text-base font-bold mt-1.5 mb-1">{project.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
