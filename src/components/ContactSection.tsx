import { motion } from "framer-motion";

const EMAIL_SUBJECT = encodeURIComponent("I'd like to work with Guru Designers");
const EMAIL_BODY = encodeURIComponent(
  "Hi Guru Designers,\n\nI came across your website and I'm interested in working with you.\n\nHere's a bit about what I'm looking for:\n\n[Please describe your project or goals here]\n\nLooking forward to hearing from you!\n\nBest regards,"
);
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I just visited Guru Designers and I'd love to discuss a project with your team. 🙌"
);

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="crescent-card bg-pastel-sand p-12 md:p-24 text-center flex flex-col items-center"
      >
        <div className="tag-label bg-white text-primary mb-8">Get Started</div>
        
        <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
          Ready to scale?
        </h2>
        
        <p className="text-xl text-foreground/70 mb-12 max-w-2xl mx-auto font-medium">
          Have a project in mind? Let's make it happen. We usually respond within 24 hours.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => window.dispatchEvent(new Event("open-guru-chat"))}
            className="btn-primary w-full sm:w-auto"
          >
            Talk to Guru
          </button>
          
          <a
            href={`mailto:hello@designers.guru?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`}
            className="btn-outline w-full sm:w-auto"
          >
            Send an Email
          </a>

          <a
            href={`https://wa.me/2349061989669?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full sm:w-auto"
          >
            WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
