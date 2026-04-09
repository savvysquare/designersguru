import { motion } from "framer-motion";
import { Users, Sparkles } from "lucide-react";

const team = [
  {
    name: "Favour",
    role: "Design & Branding Lead",
    bio: "A creative powerhouse with a sharp eye for aesthetics. Favour turns brand visions into stunning visual identities and pixel-perfect interfaces.",
  },
  {
    name: "Ola",
    role: "Development & Automation Lead",
    bio: "A builder at heart who loves clean code and smart systems. Ola brings designs to life with fast, reliable websites and intelligent automations.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Meet the <span className="text-gradient-copper">Team</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            We're a tight-knit duo who believe great design and great technology should always go hand in hand.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="p-8 rounded-3xl bg-card border border-border hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-5">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-1">{member.name}</h3>
              <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="p-8 rounded-3xl bg-primary/5 border border-primary/15 text-center"
        >
          <Users className="w-8 h-8 text-primary mx-auto mb-4 opacity-70" />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Together, Favour and Ola cover every angle — from brand strategy and visual design to web development and AI automation. They collaborate closely on every project, ensuring each client gets a seamless experience from concept to launch.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
