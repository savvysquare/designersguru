import { motion } from "framer-motion";
import { Globe, Bot, Palette } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Websites & Platforms",
    description: "Fast, beautiful websites that turn visitors into paying customers. Mobile-ready and built to scale with your ambition.",
    bgColor: "bg-pastel-sand",
    features: ["Custom UI/UX Design", "Performance Optimization", "SEO Foundation", "CMS Integration"],
  },
  {
    icon: Bot,
    title: "AI Automations",
    description: "Let AI handle the boring stuff — customer replies, scheduling, data entry — so your team can focus on creative growth.",
    bgColor: "bg-pastel-orange",
    features: ["Custom Chatbots", "Workflow Automation", "CRM Integration", "Data Analysis"],
  },
  {
    icon: Palette,
    title: "Brand Identity",
    description: "A complete visual language that makes people remember you — logo, typography, color systems, and brand guidelines.",
    bgColor: "bg-pastel-peach",
    features: ["Logo Design", "Style Guides", "Social Templates", "Marketing Collateral"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="mb-16">
        <div className="tag-label bg-white border border-border text-foreground mb-6">Capabilities</div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-2xl">
          Everything you need to <span className="text-primary">grow</span>.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`crescent-card ${service.bgColor} flex flex-col h-full hover:shadow-xl hover:shadow-black/5 cursor-pointer group`}
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <service.icon className="w-6 h-6 text-foreground" />
            </div>

            <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
            <p className="text-base text-foreground/70 mb-12 flex-grow font-medium leading-relaxed">
              {service.description}
            </p>

            <ul className="space-y-3 mb-12">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-semibold">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
                  {feature}
                </li>
              ))}
            </ul>

            <a 
              href="#contact" 
              className="mt-auto inline-flex items-center justify-center px-6 py-4 rounded-full bg-white text-foreground font-bold hover:bg-foreground hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Start a Project
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
