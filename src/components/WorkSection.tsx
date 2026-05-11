import { motion } from "framer-motion";
import portfolioPrepper from "@/assets/portfolio-prepper.png";
import portfolioJikona from "@/assets/portfolio-jikona.png";
import portfolioFastforward from "@/assets/portfolio-fastforward.png";
import portfolioOlacv from "@/assets/portfolio-olacv.png";

const projects = [
  {
    title: "Prepper Learning",
    category: "EdTech Platform",
    image: portfolioPrepper,
    url: "https://prepperlearning.com",
    bgColor: "bg-[#EAEAEA]", // Soft neutral backgrounds for images
  },
  {
    title: "Jikona Evalora",
    category: "Corporate Website",
    image: portfolioJikona,
    url: "https://jikonaevalora.com",
    bgColor: "bg-pastel-gray",
  },
  {
    title: "FastForward Fund",
    category: "Venture Studio",
    image: portfolioFastforward,
    url: "https://fastforward.fund",
    bgColor: "bg-pastel-peach",
  },
  {
    title: "Ola.cv",
    category: "Domain Registrar",
    image: portfolioOlacv,
    url: "https://ola.cv",
    bgColor: "bg-[#EAEAEA]",
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="mb-16">
        <div className="tag-label bg-white border border-border text-foreground mb-6">Our Works</div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-2xl">
          Selected <span className="text-primary">projects</span>.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {projects.map((project, i) => (
          <motion.a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
            className="group cursor-pointer block"
          >
            <div className={`w-full aspect-[4/3] rounded-[24px] overflow-hidden ${project.bgColor} mb-6 p-8 md:p-12 transition-transform duration-500 group-hover:scale-[1.02]`}>
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover rounded-xl shadow-xl shadow-black/10 group-hover:-translate-y-2 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-sm font-medium text-foreground/50 uppercase tracking-wider">{project.category}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default WorkSection;
