import { motion } from "framer-motion";
import { ArrowRight, Globe, Bot, Palette, Check } from "lucide-react";
import ElectricBorderCard from "./ElectricBorderCard";

const services = [
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
      "Free support for 30 days",
    ],
    popular: false,
  },
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
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            What We <span className="text-gradient-copper">Offer</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Three powerful services to get your business online, automated, and looking amazing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const cardContent = (
              <div className="relative p-7">
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest z-10">
                    Most Popular
                  </div>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                  service.popular ? "bg-primary/15" : "bg-secondary group-hover:bg-primary/10"
                }`}>
                  <service.icon className="w-5 h-5 text-primary" />
                </div>

                <h3 className="text-lg font-bold mb-1">{service.title}</h3>
                <p className="text-xs text-primary font-medium mb-3">{service.tagline}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{service.description}</p>

                <div className="mb-5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Starting from</span>
                  <p className="text-3xl font-bold text-gradient-copper">{service.price}</p>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  href="#contact"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    service.popular
                      ? "btn-ios bg-primary text-primary-foreground"
                      : "btn-ios-ghost text-foreground"
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            );

            return (
              <motion.div
                key={service.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className={`group relative rounded-3xl transition-all duration-300 cursor-pointer ${
                  service.popular
                    ? ""
                    : "p-0 bg-card border border-border hover:border-primary/20"
                }`}
              >
                {service.popular ? (
                  <div className="relative">
                    <ElectricBorderCard>{cardContent}</ElectricBorderCard>
                  </div>
                ) : (
                  cardContent
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
