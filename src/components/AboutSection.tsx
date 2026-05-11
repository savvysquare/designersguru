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

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute -top-1/4 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Meet the <span className="text-gradient-copper">Team</span>.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're a small, senior team of designers, marketers, and developers. No juniors, no bloat, just experts delivering premium work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, i) => (
            <motion.a
              key={member.name}
              href={member.xProfile}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group bento-card p-4 flex flex-col h-full cursor-pointer relative overflow-hidden"
            >
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-6 bg-secondary/30">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transform group-hover:scale-105 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-foreground" />
                </div>
              </div>

              <div className="px-4 pb-2 text-center">
                <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                  {member.role}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
