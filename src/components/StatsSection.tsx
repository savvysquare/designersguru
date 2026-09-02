import { motion } from "framer-motion";

const facts = [
  { big: "30+", label: "Launches shipped", sub: "Brands and sites live across four continents." },
  { big: "Senior team", label: "Concept to launch", sub: "The people on the call are the people who build." },
  {
    big: "Repeat clients",
    label: "Healthcare, wellness, property, logistics",
    sub: "Companies come back for the next brand or the next platform.",
  },
];

const cases = [
  {
    tag: "Corporate",
    body: "Jikona Evalora needed a corporate site that matched the calibre of the firm. We built the brand presence they now send prospects to.",
    attribution: "Jikona Evalora · Corporate",
  },
  {
    tag: "Healthcare",
    body: "Assistic Care Services sells trust before it sells care. We built a site that reads as credible to US and VA-sensitive families on first visit.",
    attribution: "Assistic Care Services · Healthcare",
  },
  {
    tag: "Wellness",
    body: "Avion Mobile Massage is a mobile practice, so the site had to do the booking. Clear services, clear pricing logic, and a path straight to a booked appointment.",
    attribution: "Avion Mobile Massage · Wellness",
  },
];

const StatsSection = () => {
  return (
    <section id="results" className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-3xl">
          <div className="tag-label bg-white border border-border text-foreground mb-6">Results</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            What the work actually <span className="text-primary">did</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
          {/* Left Col - Facts */}
          <div className="flex flex-col gap-6">
            {facts.map((f, i) => (
              <motion.div
                key={f.big}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`crescent-card flex-1 flex flex-col justify-center ${
                  i === 0 ? "bg-pastel-peach" : "bg-white border border-border"
                }`}
              >
                <p className="text-3xl md:text-[44px] font-black leading-none mb-4 tracking-tight">
                  {f.big}
                </p>
                <p className="text-lg font-bold">{f.label}</p>
                <p className="text-sm font-medium text-foreground/70 mt-2">{f.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Right Col - Case blurbs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="crescent-card bg-foreground text-background flex flex-col gap-10 justify-center"
          >
            {cases.map((c, i) => (
              <div key={c.attribution} className={i > 0 ? "pt-10 border-t border-background/15" : ""}>
                <div className="tag-label bg-background/10 text-background/80 mb-5">{c.tag}</div>
                <p className="text-xl md:text-2xl font-medium leading-snug text-background mb-4">
                  {c.body}
                </p>
                <p className="text-sm font-semibold text-background/60">{c.attribution}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
