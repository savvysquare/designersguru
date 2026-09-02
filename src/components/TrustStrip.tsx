const wordmarks = [
  "Holistic Care Foundation",
  "Premium HVA",
  "Prefab World Cabin",
  "Assistic Care Services",
  "House Fada",
  "Containeryard",
  "Avion Mobile Massage",
  "Jikona Evalora",
];

const TrustStrip = () => {
  return (
    <section aria-label="Selected clients" className="px-6 md:px-[60px] pb-8">
      <div className="max-w-7xl mx-auto border-y border-border py-10">
        <p className="tag-label text-foreground/50 mb-6 px-0">Selected work</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-4 md:gap-x-12">
          {wordmarks.map((name) => (
            <li key={name}>
              <a
                href="#works"
                className="text-base md:text-lg font-bold tracking-tight text-foreground/45 hover:text-foreground transition-colors"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustStrip;
