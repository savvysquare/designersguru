import { motion } from "framer-motion";

const projects = [
  { title: "Holistic Care Foundation", category: "Nonprofit", url: "https://holisticcarefoundation.com", bgColor: "bg-[#EAEAEA]" },
  { title: "Premium UHVA", category: "Healthcare", url: "https://premiumhva.com", bgColor: "bg-pastel-gray" },
  { title: "Green People", category: "Sustainability", url: "https://greenpeople.ng", bgColor: "bg-pastel-peach" },
  { title: "Osun Watch", category: "News & Media", url: "https://osunwatch.com", bgColor: "bg-[#EAEAEA]" },
  { title: "Prefab World Cabin", category: "Architecture", url: "https://prefabworldcabin.com", bgColor: "bg-pastel-gray" },
  { title: "Jikona Evalora", category: "Corporate Website", url: "https://jikonaevalora.com", bgColor: "bg-pastel-peach" },
  { title: "Olayemi Awoyemi", category: "Personal Portfolio", url: "https://olayemiawoyemi.cv", bgColor: "bg-[#EAEAEA]" },
  { title: "Assistic Care Services", category: "Healthcare", url: "https://assisticcareservices.com", bgColor: "bg-pastel-gray" },
  { title: "House Fada", category: "Real Estate", url: "https://housefada.com", bgColor: "bg-pastel-peach", refresh: "20250710" },
  { title: "Avion Mobile Massage", category: "Wellness", url: "https://avionmobilemassage.com", bgColor: "bg-[#EAEAEA]" },
  { title: "Finetune Music", category: "Music & Entertainment", url: "https://finetunemusic.com.ng", bgColor: "bg-pastel-gray" },
  { title: "Boot Party Ife Central", category: "Community", url: "https://bootpartyifecentral.org", bgColor: "bg-pastel-peach" },
];

const screenshotUrl = (url: string, refresh?: string) => {
  const clean = url.replace(/^https?:\/\//, "");
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent("https://" + clean)}?w=1200&h=900${refresh ? `&refresh=${refresh}` : ""}`;
};

const WorkSection = () => {
  return (
    <section id="work" className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <div className="tag-label bg-white border border-border text-foreground mb-6 inline-block">Our Works</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Selected <span className="text-primary">projects</span>.
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            A snapshot of brands we've helped shape across industries and continents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
              className="group cursor-pointer block"
            >
              <div className="w-full aspect-[4/3] rounded-[24px] overflow-hidden mb-6 transition-transform duration-500 group-hover:scale-[1.02]">
                <img
                  src={screenshotUrl(project.url, project.refresh)}
                  alt={`${project.title} — ${project.category} website by Guru Designers`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-sm font-medium text-foreground/50 uppercase tracking-wider">{project.category}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-45">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H8M17 7V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
