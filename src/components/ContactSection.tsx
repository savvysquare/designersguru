import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const EMAIL_SUBJECT = encodeURIComponent("Strategy call — Guru Designers");
const EMAIL_BODY = encodeURIComponent(
  "Hi Guru Designers,\n\nI'd like to book a strategy call.\n\nCompany:\nWebsite:\nWhat I need:\n\nBest regards,"
);
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I'd like to book a strategy call with Guru Designers."
);

const needs = ["Brand identity", "Website / platform", "AI follow-up system", "Not sure yet"];

const ContactSection = () => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("company") || ""),
      website: String(fd.get("website") || ""),
      need: String(fd.get("need") || ""),
      notes: String(fd.get("notes") || ""),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't send that", description: "Please email hello@designers.guru instead.", variant: "destructive" });
      return;
    }
    setDone(true);
  };

  const field =
    "w-full rounded-xl border border-border bg-white px-4 py-3 text-base font-medium outline-none focus:border-primary transition-colors";

  return (
    <section id="contact" className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="crescent-card bg-pastel-sand p-8 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <div>
            <div className="tag-label bg-white text-primary mb-6">Get started</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Book the strategy call.
            </h2>
            <p className="text-lg text-foreground/70 font-medium leading-relaxed mb-8">
              20 minutes. We review the current brand and site, and you leave with 3 specific changes —
              whether or not we work together. We reply within one business day.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-guru-chat"))}
                className="btn-primary w-full sm:w-auto"
              >
                Talk to Guru
              </button>
              <a
                href={`mailto:hello@designers.guru?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`}
                className="btn-outline w-full sm:w-auto"
              >
                Email us
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
          </div>

          <div className="crescent-card bg-white border border-border">
            {done ? (
              <div className="h-full flex flex-col justify-center text-center py-10">
                <h3 className="text-2xl font-bold mb-3">Got it.</h3>
                <p className="text-base font-medium text-foreground/70">
                  We'll be in touch within one business day. If it's urgent, WhatsApp us.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="name" required placeholder="Name" className={field} />
                  <input name="email" type="email" required placeholder="Email" className={field} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="company" placeholder="Company" className={field} />
                  <input name="website" placeholder="Current website" className={field} />
                </div>
                <select name="need" required defaultValue="" className={field}>
                  <option value="" disabled>
                    What do you need?
                  </option>
                  {needs.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="What's the problem you're trying to solve?"
                  className={field}
                />
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                  {submitting ? "Sending…" : "Request the call"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
