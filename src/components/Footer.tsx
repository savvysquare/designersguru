import { Twitter, Instagram, Linkedin, Dribbble } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "Brand Identity", href: "#services" },
    { label: "Web Design", href: "#services" },
    { label: "Development", href: "#services" },
    { label: "AI Automation", href: "#services" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Our Work", href: "#work" },
    { label: "Results", href: "#results" },
    { label: "Contact", href: "#contact" },
  ],
  Resources: [
    { label: "Blog", href: "#" },
    { label: "Case Studies", href: "#work" },
    { label: "FAQ", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer role="contentinfo" className="bg-foreground text-background pt-14 pb-8 px-6 md:px-[60px] rounded-t-[32px]">
      <div className="mx-auto max-w-7xl">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 md:gap-8 mb-14">
          {/* Brand column */}
          <div className="space-y-4">
            <span className="font-display text-xl font-bold text-background">
              designers<span className="text-primary">.guru</span>
            </span>
            <p className="text-[13px] leading-relaxed text-background/60 max-w-[260px]">
              We're designers, marketers, developers & AI strategists — one studio for your entire digital presence.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[Twitter, Instagram, Linkedin, Dribbble].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[13px] font-semibold mb-4 text-background/90">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-background/50 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Badges + newsletter row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-background/10 pt-8 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-medium tracking-wide border border-background/15 rounded-full px-3.5 py-1.5 text-background/60">
              ⭐ 4.9/5 Rating
            </span>
            <span className="text-[11px] font-medium tracking-wide border border-background/15 rounded-full px-3.5 py-1.5 text-background/60">
              ✦ Premium Quality
            </span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Get product updates..."
              className="bg-background/10 border border-background/15 rounded-lg px-4 py-2 text-[13px] text-background placeholder:text-background/40 outline-none focus:border-primary/50 transition-colors flex-1 md:w-[220px]"
            />
            <button className="bg-primary text-primary-foreground text-[12px] font-semibold rounded-lg px-5 py-2 hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-background/40">
          <p>© 2026 designers.guru · Made with ♥</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-background/70 transition-colors">Privacy</a>
            <a href="#" className="hover:text-background/70 transition-colors">Terms</a>
            <a href="#" className="hover:text-background/70 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
