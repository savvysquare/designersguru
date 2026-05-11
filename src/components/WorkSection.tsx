import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
    colSpan: "lg:col-span-2",
  },
  {
    title: "Jikona Evalora",
    category: "Corporate Website",
    description: "Research & analytics firm turning data into decisions across Africa.",
    image: portfolioJikona,
    url: "https://jikonaevalora.com",
    colSpan: "lg:col-span-1",
  },
  {
    title: "FastForward Fund",
    category: "Venture Studio",
    description: "A venture fund backing African founders building transformational companies.",
    image: portfolioFastforward,
    url: "https://fastforward.fund",
    colSpan: "lg:col-span-1",
  },
  {
    title: "Ola.cv",
    category: "Domain Registrar",
    description: "The go-to platform for .cv domains trusted by professionals in 150+ countries.",
    image: portfolioOlacv,
    url: "https://ola.cv",
    colSpan: "lg:col-span-2",
  },
];

const WorkSection = () => {
  return (
    <section id="work" aria-label="Our portfolio of client work" className="py-24 px-6 md:px-[60px] relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Proof of <span className="text-gradient-copper">Work</span>.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            See what we've built. Every project is crafted to look great, convert visitors, and perform flawlessly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group bento-card p-4 sm:p-6 flex flex-col h-full cursor-pointer"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl mb-6 bg-secondary/50">
                <img
                  src={project.image}
                  alt={`${project.title} — ${project.category} project`}
                  className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                
                {/* Hover overlay with icon */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-end p-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 shadow-lg shadow-primary/30">
                    <ArrowUpRight className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-grow px-2 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-widest text-primary uppercase">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
