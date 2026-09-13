import { BadgeCheck } from "lucide-react";

export function BatteryTrust() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-semibold md:text-4xl text-balance">
            Die Batterie ist das Herzstück. Wir behandeln sie auch so.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Vergleiche Batterieinformationen dort, wo sie verfügbar sind: State of Health,
            Batteriegarantie und Ladeverhalten stehen klar im Inserat. Fahrzeuge mit Batteriebericht
            kannst du gezielt filtern und schneller einschätzen.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "State of Health (%) auf einen Blick",
              "Gezielt nach Batteriebericht filtern",
              "AC-Bordlader und DC-Spitzenleistung",
              "Optional unabhängige Batterieprüfung",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric/30 text-graphite">
                  <BadgeCheck className="h-3 w-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-elevated">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl font-semibold">94</span>
            <span className="text-lg text-muted-foreground">% SoH</span>
          </div>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-electric" style={{ width: "94%" }} />
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-6 text-sm">
            <Stat label="Nutzbare Kapazität" value="70.5 kWh" />
            <Stat label="Originale Kapazität" value="75 kWh" />
            <Stat label="DC-Spitze" value="250 kW" />
            <Stat label="Restgarantie" value="28 Monate" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-lg font-semibold">{value}</dd>
    </div>
  );
}
