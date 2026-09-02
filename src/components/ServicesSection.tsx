import { motion } from "framer-motion";
import { Globe, Bot, Palette } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Brand Identity",
    description:
      "A visual language that makes you the obvious expensive choice in the room. Logo, type, color, voice, guidelines, launch kit.",
    bgColor: "bg-pastel-peach",
    features: ["Logo system", "Brand guidelines", "Social templates", "Sales & marketing collateral"],
  },
  {
    icon: Globe,
    title: "Websites & Platforms",
    description:
      "Fast sites that turn attention into conversations. Built to load quickly, read clearly, and convert on mobile first.",
    bgColor: "bg-pastel-sand",
    features: ["UX and UI", "Conversion pages", "SEO foundation", "CMS / handoff"],
  },
  {
    icon: Bot,
    title: "AI Automations",
    description:
      "The unglamorous layer that protects the design investment: replies, routing, follow-up, scheduling, CRM.",
    bgColor: "bg-pastel-orange",
    features: ["Custom chat", "Workflow automation", "CRM integration", "Lead follow-up"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-3xl">
          <div className="tag-label bg-white border border-border text-foreground mb-6">Capabilities</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            One studio. The whole <span className="text-primary">digital presence</span>.
          </h2>
          <p className="text-lg text-foreground/70 font-medium">
            Brand, website, and AI systems designed as one product — not three disconnected invoices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`crescent-card ${service.bgColor} flex flex-col h-full hover:shadow-xl hover:shadow-black/5 group`}
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
                Book a strategy call
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
