import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const team = [
  {
    name: "Ola",
    role: "Marketing & Creative Director",
    image: "https://picsum.photos/seed/sarah/600/800",
    xProfile: "#",
  },
  {
    name: "Timi oye",
    role: "Head of Design",
    image: "https://picsum.photos/seed/konrad/600/800",
    xProfile: "#",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-[60px] bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-xl"
          >
            <span className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              The Team
            </span>
            <h2 className="text-[36px] md:text-[48px] font-semibold leading-[1.1] tracking-[-0.02em]">
              <span className="text-muted-foreground">Meet the team</span>
              <br />
              behind <span className="text-gradient-copper">designers.guru</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-muted-foreground text-[15px] leading-relaxed max-w-[450px] md:pt-14"
          >
            We're designers, marketers, developers & AI strategists — a single studio that handles every layer of your digital presence, from brand identity to intelligent automation
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 max-w-3xl mx-auto">
          {team.map((member, i) => (
            <motion.a
              key={member.name}
              href={member.xProfile}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-[24px] overflow-hidden cursor-pointer bg-card border border-border"
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex items-end p-6 md:p-7">
                <div className="w-full flex items-end justify-between">
                  <div>
                    <h3 className="text-[17px] font-semibold text-white mb-0.5">
                      {member.name}
                    </h3>
                    <p className="text-[13px] font-medium text-white/60">
                      {member.role}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-[20px] border border-border bg-card p-8 md:p-10 text-center"
        >
          <p className="text-[14px] md:text-[15px] leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            From brand strategy and visual design to web development and AI automation — we collaborate closely on every project, ensuring each client gets a seamless experience from <span className="text-gradient-copper font-semibold">concept to launch</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
