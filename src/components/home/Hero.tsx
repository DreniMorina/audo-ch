import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Battery, MapPin, Search, Zap } from "lucide-react";
import { QueryProvider } from "@/components/site/QueryProvider";
import { fetchApprovedListings } from "@/data/listings";
import { browseHref, type BrowseSearch } from "@/lib/browse-search";
import heroCar from "@/assets/hero-car.jpg";

export function Hero() {
  return (
    <QueryProvider>
      <HeroSection />
    </QueryProvider>
  );
}

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: listings = [] } = useQuery({
    queryKey: ["listings", "approved"],
    queryFn: fetchApprovedListings,
  });

  const locations = new Set(listings.map((l) => l.location));

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    window.location.assign(browseHref(q ? { q } : {}));
  }

  const quickFilters: Array<{ label: string; search: BrowseSearch }> = [
    { label: "Tesla", search: { brand: "Tesla" } },
    { label: "VW", search: { brand: "VW" } },
    { label: "BMW", search: { brand: "BMW" } },
    { label: "Audi", search: { brand: "Audi" } },
    { label: "Unter 40 000 CHF", search: { maxPrice: 40000 } },
    { label: "> 500 km Reichweite", search: { minRange: 500 } },
  ];


  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-16 md:grid-cols-[1.05fr_1fr] md:gap-8 md:pt-20 lg:pb-20">
        <div>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
            Elektroautos kaufen und verkaufen.
          </h1>
          <h2 className="mt-5 max-w-xl text-lg font-normal text-muted-foreground">
            Der Schweizer Marktplatz für Elektroautos. Vergleiche Reichweite, Batterie, Ladeleistung
            und weitere wichtige Fahrzeugdaten – alles auf einer Plattform.
          </h2>

          <form onSubmit={handleSearch} className="mt-7">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Marke, Modell oder Ort suchen…"
                  className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-base outline-none shadow-card transition-all focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-14 items-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-card transition-all hover:opacity-90"
              >
                Suchen
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickFilters.map((f) => (
              <a
                key={f.label}
                href={browseHref(f.search)}
                className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/40 hover:text-foreground"
              >
                {f.label}
              </a>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric/20 text-graphite">
                <Zap className="h-3 w-3" />
              </span>
              {listings.length} Elektroautos verfügbar
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric/20 text-graphite">
                <MapPin className="h-3 w-3" />
              </span>
              {locations.size} Orte in der Schweiz
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
            <img
              src={heroCar.src}
              alt="Elektrische Premium-Limousine"
              width={1600}
              height={1100}
              className="aspect-[16/11] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-elevated sm:block">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric/20 text-graphite">
                <Battery className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Batteriezustand</p>
                <p className="font-display text-lg font-semibold">94 % SoH</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
