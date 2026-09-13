import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { ListingCard } from "@/components/site/ListingCard";
import { QueryProvider } from "@/components/site/QueryProvider";
import { fetchApprovedListings } from "@/data/listings";

export function Featured() {
  return (
    <QueryProvider>
      <FeaturedListings />
    </QueryProvider>
  );
}

function FeaturedListings() {
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings", "approved"],
    queryFn: fetchApprovedListings,
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Neueste Inserate</h2>
        </div>
        <a
          href="/browse"
          className="hidden items-center gap-1 text-sm font-medium text-foreground hover:gap-2 transition-all md:inline-flex"
        >
          Alle anzeigen
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl border border-border/60 bg-secondary/60"
              />
            ))
          : listings.slice(0, 6).map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
    </section>
  );
}
