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
    <footer className="bg-foreground text-background pt-20 pb-10 px-6 rounded-t-[3rem] mt-12 relative overflow-hidden">
      {/* Decorative gradient in footer */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 md:gap-8 mb-20">
          <div className="space-y-6 pr-8">
            <span className="font-display text-2xl font-black text-background flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
                D
              </div>
              designers<span className="text-primary">guru</span>
            </span>
            <p className="text-sm leading-relaxed text-background/60 max-w-xs font-medium">
              We're designers, marketers, developers & AI strategists — one premium studio for your entire digital presence.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {[Twitter, Instagram, Linkedin, Dribbble].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold mb-6 text-background/90 tracking-wider uppercase">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-background/50 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-background/10 pt-10">
          <div className="flex items-center gap-4 text-xs font-medium text-background/40">
            <p>© 2026 designers.guru. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium text-background/40">
            <a href="#" className="hover:text-background/80 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background/80 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
