const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="mx-auto max-w-7xl flex flex-col items-center gap-5 text-center">
        <span className="font-display text-lg font-bold">
          designers<span className="text-primary">.guru</span>
        </span>
        <div className="flex items-center gap-8">
          <a href="#services" className="text-[11px] tracking-[0.15em] uppercase font-semibold text-muted-foreground hover:text-foreground transition-colors">Services</a>
          <a href="#work" className="text-[11px] tracking-[0.15em] uppercase font-semibold text-muted-foreground hover:text-foreground transition-colors">Work</a>
          <a href="#contact" className="text-[11px] tracking-[0.15em] uppercase font-semibold text-muted-foreground hover:text-foreground transition-colors">Contact</a>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 designers.guru</p>
      </div>
    </footer>
  );
};

export default Footer;
