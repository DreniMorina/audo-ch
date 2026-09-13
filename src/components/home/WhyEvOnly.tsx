import { Battery, BadgeCheck, Filter, Zap } from "lucide-react";

export function WhyEvOnly() {
  const features = [
    {
      icon: Filter,
      title: "Nur Elektro, nichts anderes",
      body: "Jedes Fahrzeug auf audo.ch ist vollelektrisch. Keine Verbrenner, die deine Suche verzögern — nur das, was du suchst.",
    },
    {
      icon: Battery,
      title: "Batterie zuerst",
      body: "State of Health, nutzbare Kapazität und Degradationsverlauf — nicht nur Preis und Kilometerstand.",
    },
    {
      icon: Zap,
      title: "Laden, das zählt",
      body: "DC-Spitzenleistung, AC-Bordlader und echte 10–80 %-Zeiten — für reale Reiseplanung statt Marketingzahlen.",
    },
    {
      icon: BadgeCheck,
      title: "Transparente Garantie",
      body: "Restgarantie für Batterie und Antrieb in Monaten — klar sichtbar, nicht versteckt in Anhängen.",
    },
  ];
  return (
    <section id="why" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Ein Marktplatz, der Elektroautos{" "}
            <span className="text-foreground/60">wirklich versteht.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-card"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-electric/15 text-graphite">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
