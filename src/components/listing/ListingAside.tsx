import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import type { Listing } from "@/data/listings";
import { formatCHF } from "@/lib/format";
import { sellerLabel } from "./seller-label";

export function ListingAside({ listing }: { listing: Listing }) {
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);

  return (
    <aside className="lg:sticky lg:top-20 h-fit space-y-4">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Preis</p>
        <p className="mt-1 font-display text-4xl font-semibold">{formatCHF(listing.price)}</p>
        <p className="mt-1 text-xs text-muted-foreground">inkl. MwSt., sofern anwendbar</p>

        <div className="mt-6 space-y-2">
          {listing.sellerEmail && (
            <a
              href={`mailto:${listing.sellerEmail}`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Mail className="h-4 w-4" /> E-Mail öffnen
            </a>
          )}
          {listing.sellerPhone && (
            <button
              type="button"
              onClick={() => setIsPhoneVisible(true)}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-medium text-foreground transition-all hover:border-foreground/40"
            >
              <Phone className="h-4 w-4" />{" "}
              {isPhoneVisible ? listing.sellerPhone : "Kontaktieren"}
            </button>
          )}
        </div>

        <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
          <p>
            Verkäufer: <span className="text-foreground">{listing.sellerName}</span>
          </p>
          <p className="mt-1">
            Typ: <span className="text-foreground">{sellerLabel(listing.sellerType)}</span>
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-secondary/60 p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">audo.ch-Vertrauen</p>
        <p className="mt-2">
          Batterie-, Reichweiten- und Ladedaten helfen bei der Einschätzung. Angaben zum
          Batteriestatus oder ein Zertifikat sind freiwillig und müssen vom Käufer aktuell
          verifiziert werden.
        </p>
      </div>
    </aside>
  );
}
