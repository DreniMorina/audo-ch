import { Battery, BadgeCheck, Gauge, Zap } from "lucide-react";

export function TrustStrip() {
  const items = [
    { icon: Battery, label: "Batteriezustand in jedem Inserat" },
    { icon: Gauge, label: "Geprüfte WLTP-Reichweite" },
    { icon: Zap, label: "Reale Ladegeschwindigkeiten" },
    { icon: BadgeCheck, label: "Verbleibende Herstellergarantie" },
  ];
  return (
    <section className="border-y border-border/60 bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <Icon className="h-4 w-4 text-foreground/60" />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
