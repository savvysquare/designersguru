import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import teamOla from "@/assets/team-ola.png";
import teamTimi from "@/assets/team-timi.png";

const team = [
  {
    name: "Ola",
    role: "Marketing & Creative Director",
    image: teamOla,
    xProfile: "#",
  },
  {
    name: "Timi oye",
    role: "Head of Design",
    image: teamTimi,
    xProfile: "#",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.92, rotateX: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-[60px] bg-background" style={{ perspective: "1200px" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 max-w-xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase"
            >
              The Team
            </motion.span>
            <h2 className="text-[36px] md:text-[48px] font-semibold leading-[1.1] tracking-[-0.02em]">
              <span className="text-muted-foreground">Meet the team</span>
              <br />
              behind <span className="text-gradient-copper">designers.guru</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="group relative rounded-[24px] overflow-hidden cursor-pointer bg-card border border-border"
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex items-end p-6 md:p-7">
                <div className="w-full flex items-end justify-between">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                  >
                    <h3 className="text-[17px] font-semibold text-white mb-0.5">
                      {member.name}
                    </h3>
                    <p className="text-[13px] font-medium text-white/60">
                      {member.role}
                    </p>
                  </motion.div>
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
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
