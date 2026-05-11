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
    { label: "Our Works", href: "#work" },
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
    <footer className="bg-white pt-24 pb-12 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8 mb-24">
          <div className="space-y-6 pr-8">
            <span className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              Guru<span className="text-primary"> Designers</span>
            </span>
            <p className="text-base text-foreground/60 max-w-sm font-medium">
              We're designers, marketers, developers & AI strategists — one premium studio for your entire digital presence.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {[Twitter, Instagram, Linkedin, Dribbble].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all hover:scale-110 text-foreground/70"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold mb-6 text-foreground tracking-wider uppercase">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border pt-8">
          <div className="flex items-center gap-4 text-sm font-medium text-foreground/50">
            <p>© 2026 Guru Designers. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-foreground/50">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
