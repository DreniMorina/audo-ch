import { Battery, Gauge, MapPin, Zap } from "lucide-react";
import type { Listing } from "@/data/listings";
import { formatEUR, formatKm } from "@/lib/format";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <a
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-silver-light">
        <img
          src={listing.image}
          alt={`${listing.brand} ${listing.model}`}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
            {listing.sellerType === "Dealer" ? "Händler" : "Privat"}
          </span>
          {listing.fastCharging && (
            <span className="inline-flex items-center gap-1 rounded-full bg-graphite px-2.5 py-1 text-[11px] font-medium text-electric">
              <Zap className="h-3 w-3" strokeWidth={2.5} />
              {listing.chargingKw} kW
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-semibold leading-tight">
              {listing.brand} {listing.model}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {listing.year} · {formatKm(listing.mileage)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-lg font-semibold">{formatEUR(listing.price)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-xs">
          <Spec icon={<Battery className="h-3.5 w-3.5" />} label={`${listing.batteryKwh} kWh`} />
          <Spec icon={<Gauge className="h-3.5 w-3.5" />} label={`${listing.rangeKm} km`} />
          <Spec icon={<MapPin className="h-3.5 w-3.5" />} label={listing.location} />
        </div>
      </div>
    </a>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className="text-foreground/70">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
