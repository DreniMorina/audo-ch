import { BadgeCheck, Battery, Calendar, FileText, Gauge, MapPin, ShieldCheck, Zap } from "lucide-react";
import type { Listing } from "@/data/listings";
import { formatKm } from "@/lib/format";
import { sellerLabel } from "./seller-label";

export function ListingBody({ listing }: { listing: Listing }) {
  return (
    <>
      <div className="mt-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {sellerLabel(listing.sellerType)} · {listing.location}, {listing.country}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">
          {listing.brand} {listing.model}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {listing.year} · {formatKm(listing.mileage)}
        </p>
      </div>

      {listing.description ? (
        <section className="mt-8 max-w-2xl rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground">Beschreibung</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-8 text-foreground/90">
            {listing.description}
          </p>
        </section>
      ) : null}

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">EV-Specs</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <SpecBox
            icon={<Battery className="h-4 w-4" />}
            label="Batterie"
            value={`${listing.batteryKwh} kWh`}
          />
          <SpecBox
            icon={<Gauge className="h-4 w-4" />}
            label="WLTP-Reichweite"
            value={`${listing.rangeKm} km`}
          />
          <SpecBox
            icon={<Zap className="h-4 w-4" />}
            label="DC-Spitze"
            value={`${listing.chargingKw} kW`}
          />
          <SpecBox
            icon={<Calendar className="h-4 w-4" />}
            label="Baujahr"
            value={String(listing.year)}
          />
          <SpecBox
            icon={<MapPin className="h-4 w-4" />}
            label="Standort"
            value={`${listing.location}, ${listing.country}`}
          />
          <SpecBox
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Restgarantie"
            value={listing.warrantyMonths ? `${listing.warrantyMonths} Monate` : "—"}
          />
        </dl>
      </div>

      {(listing.batteryHealth ||
        listing.batteryCertificateDate ||
        listing.batteryCertificateProvider ||
        listing.batteryCertificatePdfUrl) && (
        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-foreground" />
            Batteriestatus
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            {listing.batteryHealth && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Batteriezustand (SoH)</dt>
                <dd className="font-medium text-foreground">{listing.batteryHealth} %</dd>
              </div>
            )}
            {listing.batteryCertificateDate && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Datum des Zertifikats</dt>
                <dd className="font-medium text-foreground">
                  {listing.batteryCertificateDate}
                </dd>
              </div>
            )}
            {listing.batteryCertificateProvider && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Prüfanbieter</dt>
                <dd className="font-medium text-foreground">
                  {listing.batteryCertificateProvider}
                </dd>
              </div>
            )}
          </dl>
          {listing.batteryCertificatePdfUrl && (
            <a
              href={listing.batteryCertificatePdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-all hover:border-foreground/40"
            >
              <FileText className="h-4 w-4" /> Offizielles Batteriezertifikat öffnen (PDF)
            </a>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Hinweis: audo.ch übernimmt keine Gewähr für die Richtigkeit oder Aktualität der
            Angaben und Zertifikate. Käuferinnen und Käufer müssen den aktuellen
            Batteriestatus vor dem Kauf selbst verifizieren.
          </p>
        </div>
      )}
    </>
  );
}

function SpecBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 font-display text-base font-semibold">{value}</p>
    </div>
  );
}

