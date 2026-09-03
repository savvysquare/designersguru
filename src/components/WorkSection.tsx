import { motion } from "framer-motion";

const projects = [
  { title: "Assistic Care Services", category: "Healthcare", outcome: "Healthcare brand and site built to clear US/VA trust barriers", url: "https://assisticcareservices.com" },
  { title: "Avion Mobile Massage", category: "Wellness", outcome: "Calgary wellness practice, booked directly from the site", url: "https://avionmobilemassage.com" },
  { title: "Prefab World Cabin", category: "Architecture", outcome: "Product story for kit and cabin homes", url: "https://prefabworldcabin.com" },
  { title: "House Fada", category: "Real Estate", outcome: "Property brand presence for listings and enquiries", url: "https://housefada.com", refresh: "20250710a" },
  { title: "Containeryard", category: "Logistics", outcome: "Logistics company, Nigeria — services made legible to buyers", url: "https://containeryard.com.ng" },
  { title: "Premium HVA", category: "Healthcare", outcome: "Clinical services site built for referral confidence", url: "https://premiumhva.com" },
  { title: "Holistic Care Foundation", category: "Nonprofit", outcome: "Nonprofit, donation-ready presence", url: "https://holisticcarefoundation.com" },
  { title: "Jikona Evalora", category: "Corporate", outcome: "Corporate site that matches the calibre of the firm", url: "https://jikonaevalora.com" },
  { title: "Green People", category: "Civic movement", outcome: "Civic platform for organising and outreach", url: "https://greenpeople.ng" },
  { title: "Osun Watch", category: "Civic Tech", outcome: "Citizen election platform — polling unit results sealed in a public hash chain for Osun State", url: "https://osunwatch.com" },
  { title: "findjob.ng", category: "Jobs & Services", outcome: "Nigeria job and workmen directory — find work or call a plumber, tailor or mechanic, no login needed", url: "https://findjob.ng" },
  { title: "prepare.ng", category: "EdTech", outcome: "Exam study app for Nigerian students — short lessons and instant practice for WASSCE, NECO, UTME and NABTEB", url: "https://prepare.ng" },
  { title: "Finetune Music", category: "Music & Entertainment", outcome: "Artist and label presence for releases and bookings", url: "https://finetunemusic.com.ng" },
  { title: "Boot Party Ife Central", category: "Political / community", outcome: "Community campaign presence and mobilisation hub", url: "https://bootpartyifecentral.org" },
];

const personal = [
  { title: "Olayemi Awoyemi", category: "Personal portfolio", outcome: "Founder portfolio and CV site", url: "https://olayemiawoyemi.cv" },
];

const screenshotUrl = (url: string, refresh?: string) => {
  const clean = url.replace(/^https?:\/\//, "");
  const cacheBuster = refresh ? `?mshots_refresh=${refresh}` : "";
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent("https://" + clean + cacheBuster)}?w=1200&h=900${refresh ? `&refresh=${refresh}` : ""}`;
};

type Project = { title: string; category: string; outcome: string; url: string; refresh?: string };

const ProjectTile = ({ project, i }: { project: Project; i: number }) => (
  <motion.a
    href={project.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
    className="group cursor-pointer block"
  >
    <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden mb-6 transition-transform duration-500 group-hover:scale-[1.02]">
      <img
        src={screenshotUrl(project.url, project.refresh)}
        alt={`${project.title} — ${project.category} website by Guru Designers`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
        <p className="tag-label bg-white/10 text-white mb-3 self-start">{project.category}</p>
        <p className="text-white text-lg md:text-xl font-bold leading-snug">{project.outcome}</p>
      </div>
    </div>

    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-sm font-medium text-foreground/60">{project.outcome}</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-45">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 17L17 7M17 7H8M17 7V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  </motion.a>
);

const WorksSection = () => {
  return (
    <section id="works" className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-3xl">
          <div className="tag-label bg-white border border-border text-foreground mb-6">Selected work</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Work that has to <span className="text-primary">perform</span>, not just look finished.
          </h2>
          <p className="text-lg text-foreground/70 font-medium">
            Live sites. Real categories. Click through.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {projects.map((project, i) => (
            <ProjectTile key={project.title} project={project} i={i} />
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-border">
          <p className="tag-label text-foreground/50 mb-8 px-0">Personal</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {personal.map((project, i) => (
              <ProjectTile key={project.title} project={project} i={i} />
            ))}
          </div>
        </div>

        <p className="mt-16 text-lg font-medium text-foreground/70">
          Want the 3-point teardown on your site instead?{" "}
          <a href="#contact" className="font-bold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
            Book a call.
          </a>
        </p>
      </div>
    </section>
  );
};

export default WorksSection;
