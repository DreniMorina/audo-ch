import { ArrowRight } from "lucide-react";

export function SellCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-2xl bg-graphite p-10 text-primary-foreground md:p-16">
        <div className="absolute right-0 top-0 h-72 w-72 -translate-y-1/4 translate-x-1/4 rounded-full bg-electric/15" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl text-balance">
              Erreiche Käufer, die nur Elektro wollen.
            </h2>
            <p className="mt-4 max-w-xl text-primary-foreground/70">
              Inseriere dein Elektroauto in wenigen Minuten. Wir heben die technischen Daten hervor,
              die den Verkauf beschleunigen — Reichweite, Ladeleistung und Batteriezustand.
            </p>
          </div>
          <div className="flex md:justify-end">
            <a
              href="/elektroauto-verkaufen-schweiz"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-electric px-6 text-sm font-semibold text-graphite transition-all hover:opacity-90"
            >
              Kostenlos inserieren
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
