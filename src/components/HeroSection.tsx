import { motion } from "framer-motion";
import { Mail, MessageCircle, Bot } from "lucide-react";

const EMAIL_SUBJECT = encodeURIComponent("I'd like to work with Guru Designers");
const EMAIL_BODY = encodeURIComponent(
  "Hi Guru Designers,\n\nI came across your website and I'm interested in working with you.\n\nHere's a bit about what I'm looking for:\n\n[Please describe your project or goals here]\n\nLooking forward to hearing from you!\n\nBest regards,"
);
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I just visited designers.guru and I'd love to discuss a project with your team. 🙌"
);

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 gradient-radial" />

      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/8 blur-[80px]"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -20, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-copper-glow/6 blur-[100px]"
        />
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 left-1/2 w-48 h-48 rounded-full bg-primary/5 blur-[60px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 pt-32 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-surface rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground tracking-wide uppercase">Only 20 spots left this quarter</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6 max-w-4xl"
        >
          We Build{" "}
          <span className="text-gradient-copper">Websites</span>
          <br />
          That Get Results
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
        >
          Beautiful designs. Smart technology. Real growth.
          We help businesses stand out online and turn visitors into customers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            href={`mailto:hello@designers.guru?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`}
            className="btn-ios inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold tracking-wide"
          >
            <Mail className="w-4 h-4" />
            Send Us an Email
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => window.dispatchEvent(new Event("open-guru-chat"))}
            className="btn-ios-ghost inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-foreground rounded-2xl text-sm font-medium tracking-wide"
          >
            <Bot className="w-4 h-4" />
            Talk to Guru
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            href={`https://wa.me/2349061989669?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ios-ghost inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-foreground rounded-2xl text-sm font-medium tracking-wide"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
