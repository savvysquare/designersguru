import { motion } from "framer-motion";
import { Mail, MessageCircle, Bot, ArrowRight } from "lucide-react";

const EMAIL_SUBJECT = encodeURIComponent("I'd like to work with Guru Designers");
const EMAIL_BODY = encodeURIComponent(
  "Hi Guru Designers,\n\nI came across your website and I'm interested in working with you.\n\nHere's a bit about what I'm looking for:\n\n[Please describe your project or goals here]\n\nLooking forward to hearing from you!\n\nBest regards,"
);
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I just visited designers.guru and I'd love to discuss a project with your team. 🙌"
);

const ContactSection = () => {
  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border rounded-[3rem] p-12 md:p-20 shadow-2xl glass-card relative overflow-hidden"
        >
          {/* Subtle grid background inside card */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
            <div className="w-full h-full" style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }} />
          </div>

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Ready to <span className="text-gradient-copper">scale</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
              Have a project in mind? Let's make it happen. We usually respond within 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.dispatchEvent(new Event("open-guru-chat"))}
                className="btn-premium inline-flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <Bot className="w-5 h-5" />
                Talk to Guru
              </motion.button>
              
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`mailto:hello@designers.guru?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`}
                className="btn-premium-outline inline-flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <Mail className="w-5 h-5" />
                Send an Email
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/2349061989669?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium-outline inline-flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
