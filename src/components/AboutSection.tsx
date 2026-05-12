import { motion } from "framer-motion";
import teamOla from "@/assets/team-ola.png";
import teamTimi from "@/assets/team-timi.png";

const team = [
  {
    name: "Ola Awo",
    role: "Marketing & Creative Director",
    image: teamOla,
    xProfile: "#",
  },
  {
    name: "Timi Oye",
    role: "Head of Design",
    image: teamTimi,
    xProfile: "#",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="mb-16 max-w-2xl">
        <div className="tag-label bg-white border border-border text-foreground mb-6">Our Team</div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Meet the <span className="text-primary">experts</span>.
        </h2>
        <p className="text-lg text-foreground/70 font-medium">
          We're a small, senior team. No juniors, no bloat, just experts delivering premium work from concept to launch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="crescent-card bg-white border border-border flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-pastel-gray shrink-0">
              <img
                src={member.image}
                alt={member.name}
                className={`w-full h-full ${
                  member.name === "Ola Awo" 
                    ? "object-cover object-top scale-[1.5] translate-y-[26.6px] md:translate-y-10" 
                    : "object-cover object-top scale-[1.1] translate-y-[-5.3px] md:-translate-y-2"
                }`}
                loading="lazy"
              />
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold mb-2">{member.name}</h3>
              <p className="text-primary font-bold uppercase tracking-wider text-sm mb-4">
                {member.role}
              </p>
              <a href={member.xProfile} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold underline underline-offset-4 hover:text-primary transition-colors">
                View Profile
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
