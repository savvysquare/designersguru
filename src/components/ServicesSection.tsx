import { motion } from "framer-motion";
import { ArrowRight, Globe, Bot, Palette, Check } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "AI Automations",
    tagline: "Work smarter, not harder",
    description: "Let AI handle the boring stuff — customer replies, scheduling, data entry — so you can focus on what matters.",
    price: "$299",
    features: [
      "Custom AI chatbots",
      "Workflow automation",
      "Smart email & messaging",
      "Monthly performance reports",
    ],
    popular: true,
    colSpan: "lg:col-span-4",
  },
  {
    icon: Globe,
    title: "Websites",
    tagline: "Your 24/7 salesperson",
    description: "Fast, beautiful websites that turn visitors into paying customers. Mobile-ready and built to grow with you.",
    price: "$499",
    features: [
      "Custom design & development",
      "Mobile-friendly & fast",
      "SEO-ready from day one",
    ],
    popular: false,
    colSpan: "lg:col-span-2",
  },
  {
    icon: Palette,
    title: "Branding & Design",
    tagline: "Look like a million bucks",
    description: "A complete brand identity that makes people remember you — logo, colors, fonts, and everything in between.",
    price: "$399",
    features: [
      "Logo & visual identity",
      "Brand style guide",
      "Social media templates",
      "Business card & stationery",
    ],
    popular: false,
    colSpan: "lg:col-span-6",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" aria-label="Our services — Websites, AI Automations, Branding" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-copper-glow/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Services that <span className="text-gradient-copper">Scale</span>.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Everything you need to build a premium digital presence and automate your growth, packaged into simple subscriptions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`bento-card group flex flex-col ${service.colSpan} ${service.title === 'Branding & Design' ? 'lg:flex-row' : ''}`}
            >
              {service.popular && (
                <div className="absolute top-6 right-8 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                  Most Popular
                </div>
              )}

              <div className={`flex flex-col ${service.title === 'Branding & Design' ? 'lg:w-1/2 lg:pr-8' : ''}`}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-secondary text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <service.icon className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-primary font-semibold mb-4">{service.tagline}</p>
                <p className="text-muted-foreground text-base leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>

                <div className="mb-8">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Starting from</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-black text-foreground">{service.price}</span>
                  </div>
                </div>
              </div>

              <div className={`flex flex-col justify-end ${service.title === 'Branding & Design' ? 'lg:w-1/2 lg:pl-8 lg:border-l lg:border-border/50' : ''}`}>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    service.popular
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]"
                      : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground hover:scale-[1.02]"
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
