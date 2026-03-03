import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
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
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <a href="#home" className="font-display text-lg font-bold tracking-tight text-foreground">
          designers<span className="text-primary">.guru</span>
        </a>

        <div className="hidden md:flex items-center gap-0.5 glass-surface rounded-full px-1.5 py-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-full hover:bg-primary/10"
            >
              {link.label}
            </a>
          ))}
        </div>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          href="#contact"
          className="hidden md:inline-flex btn-ios px-5 py-2 bg-primary text-primary-foreground rounded-full text-[13px] font-semibold"
        >
          Get Started
        </motion.a>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl glass-surface text-foreground"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="md:hidden mt-3 mx-auto max-w-7xl glass-surface rounded-2xl p-4 space-y-1"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-[15px] font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.97 }}
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-6 py-3 mt-2 btn-ios bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
            >
              Get Started
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
