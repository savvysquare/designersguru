const footerLinks = {
  Services: [
    { label: "Brand Identity", href: "#services" },
    { label: "Websites & Platforms", href: "#services" },
    { label: "AI Automations", href: "#services" },
  ],
  Company: [
    { label: "How we work", href: "#process" },
    { label: "Works", href: "#works" },
    { label: "Results", href: "#results" },
    { label: "About", href: "#about" },
  ],
  Start: [
    { label: "FAQ", href: "#faq" },
    { label: "Book a strategy call", href: "#contact" },
    { label: "Send a brief", href: "/brief" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8 mb-24">
          <div className="space-y-6 pr-8">
            <span className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              Guru<span className="text-primary"> Designers</span>
            </span>
            <p className="text-base text-foreground/60 max-w-sm font-medium">
              A senior studio for brand identity, websites and the AI systems that keep leads moving.
            </p>
            <div className="space-y-2 pt-2 text-sm font-semibold">
              <p>
                <a href="mailto:hello@designers.guru" className="hover:text-primary transition-colors">
                  hello@designers.guru
                </a>
              </p>
              <p>
                <a
                  href="https://wa.me/2349061989669"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp us
                </a>
              </p>
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
          <p className="text-sm font-medium text-foreground/50">© 2026 Guru Designers. All rights reserved.</p>
          <p className="text-sm font-medium text-foreground/50">Nigeria · Canada · United States</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
