import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { ListingCard } from "@/components/site/ListingCard";
import { QueryProvider } from "@/components/site/QueryProvider";
import { fetchApprovedListings } from "@/data/listings";
import type { BrowseSearch } from "@/lib/browse-search";

export function BrowsePage({ search }: { search: BrowseSearch }) {
  return (
    <QueryProvider>
      <BrowseResults search={search} />
    </QueryProvider>
  );
}

function BrowseResults({ search }: { search: BrowseSearch }) {
  const [query, setQuery] = useState(search.q ?? "");
  const [brand, setBrand] = useState<string>(search.brand ?? "Alle");
  const [maxPrice, setMaxPrice] = useState<number>(search.maxPrice ?? 150000);
  const [minRange, setMinRange] = useState<number>(search.minRange ?? 0);
  const [seller, setSeller] = useState<string>("Alle");
  const [fastOnly, setFastOnly] = useState(false);
  const [certificateOnly, setCertificateOnly] = useState(false);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings", "approved"],
    queryFn: fetchApprovedListings,
  });

  const brands = useMemo(
    () => Array.from(new Set(listings.map((l) => l.brand))).sort(),
    [listings],
  );

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (brand !== "Alle" && l.brand !== brand) return false;
      if (l.price > maxPrice) return false;
      if (l.rangeKm < minRange) return false;
      if (seller !== "Alle") {
        const want: "Private" | "Dealer" = seller === "Händler" ? "Dealer" : "Private";
        if (l.sellerType !== want) return false;
      }
      if (fastOnly && !l.fastCharging) return false;
      if (certificateOnly && !l.batteryCertificatePdfUrl) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${l.brand} ${l.model} ${l.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [listings, brand, maxPrice, minRange, seller, fastOnly, certificateOnly, query]);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">Elektroautos kaufen</h1>
          <p className="mt-2 text-muted-foreground">
            {filtered.length} von {listings.length} Fahrzeugen passen zu deinen Filtern
          </p>
        </div>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Marke, Modell, Ort suchen…"
            className="h-11 w-80 rounded-md border border-border bg-card pl-9 pr-4 text-sm outline-none focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 rounded-2xl border border-border/70 bg-card p-5 shadow-card h-fit lg:sticky lg:top-20">
          <Filter label="Marke">
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40"
            >
              <option>Alle</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Filter>

          <Filter label={`Max. Preis · CHF ${maxPrice.toLocaleString("de-CH")}`}>
            <input
              type="range"
              min={10000}
              max={150000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-graphite"
            />
          </Filter>

          <Filter label={`Min. Reichweite · ${minRange} km`}>
            <input
              type="range"
              min={0}
              max={600}
              step={10}
              value={minRange}
              onChange={(e) => setMinRange(Number(e.target.value))}
              className="w-full accent-graphite"
            />
          </Filter>

          <Filter label="Verkäufertyp">
            <div className="grid grid-cols-3 gap-1 rounded-md bg-secondary p-1 text-xs">
              {["Alle", "Privat", "Händler"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeller(s)}
                  className={`h-8 rounded transition-all ${
                    seller === s
                      ? "bg-card font-medium text-foreground shadow-card"
                      : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Filter>

          <label className="flex cursor-pointer items-center justify-between text-sm">
            <span>Nur Schnellladen</span>
            <span
              onClick={() => setFastOnly((v) => !v)}
              className={`relative h-6 w-10 rounded-full transition-colors ${
                fastOnly ? "bg-graphite" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
                  fastOnly ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </span>
          </label>

          <label className="flex cursor-pointer items-center justify-between text-sm">
            <span>Nur mit Batteriezertifikat</span>
            <span
              onClick={() => setCertificateOnly((v) => !v)}
              className={`relative h-6 w-10 rounded-full transition-colors ${
                certificateOnly ? "bg-graphite" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
                  certificateOnly ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </span>
          </label>
        </aside>

        <div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-2xl border border-border/60 bg-secondary/60"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Keine Fahrzeuge passen zu diesen Filtern. Erweitere deine Suche.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
