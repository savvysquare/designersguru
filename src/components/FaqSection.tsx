import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do we start?",
    a: "A strategy call. We look at the current brand and site, send 3 specific changes, and only then talk scope.",
  },
  {
    q: "How long does a site take?",
    a: "Most brand and marketing sites ship in 2–6 weeks once scope is signed. Larger platforms take longer. We will not promise 48 hours for work that has to last.",
  },
  {
    q: "Do you only design, or do you build?",
    a: "Both. Identity, UI, and production sites — plus the automations that sit behind them.",
  },
  {
    q: "What do you charge?",
    a: "Brand and site work starts in the mid four figures. Ongoing design and automation retainers sit above that. The first call exists to see if the range and the problem match.",
  },
  {
    q: "Who is this not for?",
    a: "Anyone shopping the cheapest vendor. We are expensive compared to a freelancer. We are inexpensive compared to a year of a site that does not convert.",
  },
  {
    q: "Where are you based?",
    a: "We work with clients in Nigeria, Canada, the US and elsewhere. Communication is English, async-friendly.",
  },
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-24 px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 max-w-2xl">
          <div className="tag-label bg-white border border-border text-foreground mb-6">FAQ</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Straight <span className="text-primary">answers</span>.
          </h2>
        </div>

        <div className="crescent-card bg-white border border-border p-6 md:p-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-lg md:text-xl font-bold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-base font-medium text-foreground/70 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
