import { motion } from "framer-motion";
import { Users } from "lucide-react";

const team = [
  {
    name: "Sarah Farine",
    role: "Founder of LogoFolio",
    image: "https://picsum.photos/seed/sarah/600/700",
    xProfile: "#",
  },
  {
    name: "Konrad Cheung",
    role: "Head of Design",
    image: "https://picsum.photos/seed/konrad/600/700",
    xProfile: "#",
  },
  {
    name: "Carla Lopez",
    role: "Head of Marketing",
    image: "https://picsum.photos/seed/carla/600/700",
    xProfile: "#",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-[60px]" style={{ background: "hsl(0 0% 8%)", color: "hsl(0 0% 95%)" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Our team.
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "hsl(0 0% 65%)" }}>
            Meet our talented team proud in delivering your brand's logo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Hover overlay with view profile */}
              <div className="absolute inset-0 flex items-end p-6">
                <div className="w-full">
                  <motion.a
                    href={member.xProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mb-3 px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "hsl(25 85% 55%)", color: "white" }}
                  >
                    View X profile
                  </motion.a>
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-sm font-medium" style={{ color: "hsl(0 0% 65%)" }}>
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Arrow button */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "hsl(25 85% 55%)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
                  <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="p-8 rounded-3xl text-center border"
          style={{ borderColor: "hsl(0 0% 16%)", background: "hsl(0 0% 10%)" }}
        >
          <Users className="w-8 h-8 mx-auto mb-4 opacity-70" style={{ color: "hsl(25 85% 55%)" }} />
          <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: "hsl(0 0% 65%)" }}>
            Together, our team covers every angle — from brand strategy and visual design to web development and AI automation. We collaborate closely on every project, ensuring each client gets a seamless experience from concept to launch.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
