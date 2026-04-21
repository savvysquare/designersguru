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
    <section id="contact" className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Ready to <span className="text-gradient-copper">scale</span>?
          </h2>
          <p className="text-base text-muted-foreground mb-10 max-w-md mx-auto">
            Have a project in mind? Let's make it happen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              href={`mailto:hello@designers.guru?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`}
              className="btn-ios-ghost inline-flex items-center gap-2.5 px-8 py-3.5 text-foreground rounded-full text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              Send Us an Email
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => window.dispatchEvent(new Event("open-guru-chat"))}
              className="btn-ios inline-flex items-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold"
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
              className="btn-ios-ghost inline-flex items-center gap-2.5 px-8 py-3.5 text-foreground rounded-full text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </motion.a>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
