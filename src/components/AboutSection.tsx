import { motion } from "framer-motion";
import teamOla from "@/assets/team-ola.png";
import teamTimi from "@/assets/team-timi.png";

const team = [
  {
    name: "Ola Awo",
    role: "Marketing & Creative Director",
    owns: "Owns strategy, positioning and the words that do the selling.",
    image: teamOla,
    xProfile: "https://olayemiawoyemi.cv",
  },
  {
    name: "Timi Oye",
    role: "Head of Design",
    owns: "Owns identity, interface and everything that ships to production.",
    image: teamTimi,
    xProfile: "https://timistudio.lovable.app",
  },
];

const fit = {
  yes: [
    "Founders and teams with a real offer and real customers",
    "Companies whose brand no longer matches the quality of the work",
    "Teams that want a system, not a one-off logo",
  ],
  no: [
    "Anyone shopping purely on price",
    "Projects that need to ship in 48 hours",
    "Work with no decision-maker in the room",
  ],
};

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <div className="tag-label bg-white border border-border text-foreground mb-6">The studio</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Two seniors. No <span className="text-primary">hand-offs</span>.
          </h2>
          <p className="text-lg text-foreground/70 font-medium leading-relaxed">
            The people you meet on the first call are the people who do the work. No juniors, no account
            layer, no work passed down the chain.
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
                  alt={`${member.name}, ${member.role} at Guru Designers`}
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
                <p className="text-primary font-bold uppercase tracking-wider text-sm mb-3">
                  {member.role}
                </p>
                <p className="text-base font-medium text-foreground/70 leading-relaxed mb-4">{member.owns}</p>
                <a
                  href={member.xProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold underline underline-offset-4 hover:text-primary transition-colors"
                >
                  View Profile
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="crescent-card bg-pastel-sand">
            <h3 className="text-xl font-bold mb-4">Who we take</h3>
            <ul className="space-y-3">
              {fit.yes.map((f) => (
                <li key={f} className="text-base font-medium text-foreground/70 leading-relaxed">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="crescent-card bg-white border border-border">
            <h3 className="text-xl font-bold mb-4">Who we don't</h3>
            <ul className="space-y-3">
              {fit.no.map((f) => (
                <li key={f} className="text-base font-medium text-foreground/70 leading-relaxed">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
