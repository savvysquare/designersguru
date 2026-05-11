import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Results", href: "#results" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6 pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-6 py-3 rounded-full transition-all duration-500 border ${
          scrolled 
            ? "glass-card shadow-2xl shadow-black/10 scale-95" 
            : "bg-background/50 backdrop-blur-md border-transparent"
        }`}
      >
        <div className="flex items-center gap-12">
          <a href="#home" className="group flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-lg transition-transform group-hover:rotate-12">
              D
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground hidden sm:block">
              designers<span className="text-primary">guru</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[12px] font-medium tracking-wide text-muted-foreground hover:text-primary transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-[12px] font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
          >
            Let's Talk
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-24 left-6 right-6 p-6 glass-card rounded-[2rem] md:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-medium p-4 rounded-2xl hover:bg-primary/5 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <hr className="border-border/50 my-2" />
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                href="#contact"
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground text-center font-bold text-lg"
                onClick={() => setIsOpen(false)}
              >
                Start a Project
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
