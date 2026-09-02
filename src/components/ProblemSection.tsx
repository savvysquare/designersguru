import { motion } from "framer-motion";

const problems = [
  {
    n: "01",
    title: "Looks cheaper than the work",
    body: "The quality of the delivery never shows up in the brand, so buyers price you like a freelancer.",
  },
  {
    n: "02",
    title: "The site cannot explain the offer in 8 seconds",
    body: "Visitors land, skim, and leave without ever understanding what you actually sell.",
  },
  {
    n: "03",
    title: "Leads die because nothing follows up",
    body: "Enquiries arrive, sit unanswered, and go cold while the team is busy delivering.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 max-w-3xl">
          <div className="tag-label bg-white border border-border text-foreground mb-6">The real problem</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Most companies don't have a <span className="text-primary">design</span> problem.
          </h2>
          <p className="text-lg text-foreground/70 font-medium leading-relaxed">
            They have a trust problem that looks like design. Traffic lands. Visitors bounce. Sales teams
            discount. Leadership assumes the brand is "fine."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="crescent-card bg-white border border-border"
            >
              <span className="font-mono text-sm text-primary font-semibold">{p.n}</span>
              <h3 className="text-2xl font-bold mt-6 mb-3">{p.title}</h3>
              <p className="text-base font-medium text-foreground/70 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-xl md:text-2xl font-bold tracking-tight max-w-3xl">
          Guru Designers fixes the system — identity, site, and the automations that keep a lead moving.
        </p>
      </div>
    </section>
  );
};

export default ProblemSection;
