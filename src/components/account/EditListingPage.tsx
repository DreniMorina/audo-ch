import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import {
  ExistingImageGallery,
  ImageUploadField,
  PdfUploadField,
} from "@/components/site/upload-fields";
import {
  MAX_LISTING_IMAGES,
  fetchEditableListing,
  fetchListingImages,
  removeBatteryCertificate,
  removeListingImages,
  updateListing,
  uploadBatteryCertificate,
  uploadListingImages,
  validateListingImageFiles,
} from "@/data/listings";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { germanErrorMessage } from "@/lib/german-error";
import { cn } from "@/lib/utils";
import { POPULAR_EV_BRANDS } from "@/data/vehicle-brands";

/** The page chrome around the form; the Astro layout supplies header and footer. */
function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">{children}</main>;
}

export function EditListingPage({ id }: { id: string }) {
  const { user, loading: authLoading } = useSupabaseUser();
  const [listing, setListing] = useState<Awaited<ReturnType<typeof fetchEditableListing>>>(null);
  const [existingImages, setExistingImages] = useState<
    Awaited<ReturnType<typeof fetchListingImages>>
  >([]);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<File | null>(null);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [removeCertificate, setRemoveCertificate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const keptExistingCount = existingImages.length - removedImageIds.length;
  const maxNewPhotos = Math.max(0, MAX_LISTING_IMAGES - keptExistingCount);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([fetchEditableListing(id, user.id), fetchListingImages(id)])
      .then(([editableListing, images]) => {
        setListing(editableListing);
        setExistingImages(images);
      })
      .catch((err) => setError(germanErrorMessage(err, "Inserat konnte nicht geladen werden")))
      .finally(() => setLoading(false));
  }, [authLoading, id, user]);

  // Keep the pending uploads within the total limit as existing images are
  // removed or restored (each restored image frees one fewer new slot).
  useEffect(() => {
    setSelectedPhotos((prev) => (prev.length > maxNewPhotos ? prev.slice(0, maxNewPhotos) : prev));
  }, [maxNewPhotos]);

  function toggleRemoveImage(imageId: string) {
    setRemovedImageIds((prev) =>
      prev.includes(imageId) ? prev.filter((existing) => existing !== imageId) : [...prev, imageId],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setError(null);

    const finalImageCount = existingImages.length - removedImageIds.length + selectedPhotos.length;
    if (finalImageCount === 0) {
      setError("Bitte behalte oder lade mindestens 1 Foto hoch.");
      return;
    }

    // Validate the pending image uploads before touching the listing.
    try {
      validateListingImageFiles(selectedPhotos);
    } catch (err) {
      setError(germanErrorMessage(err, "Bitte prüfe die ausgewählten Bilder."));
      return;
    }

    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const num = (k: string) => Number(fd.get(k) || 0);
    const str = (k: string) => String(fd.get(k) || "").trim();
    const bool = (k: string) => str(k) === "Ja";

    const hasNewCertificate = selectedCertificate !== null;
    const certificateMetadata = {
      battery_certificate_date: str("certificateDate") || null,
      battery_certificate_provider: str("certificateProvider") || null,
    };

    try {
      await updateListing(
        id,
        {
          brand: str("brand"),
          model: str("model"),
          year: num("year"),
          mileage: num("mileage"),
          battery_kwh: num("battery"),
          range_km: num("range"),
          charging_kw: num("charging"),
          fast_charging: bool("fastCharging"),
          battery_health: fd.get("soh") ? num("soh") : null,
          ...(!hasNewCertificate ? certificateMetadata : {}),
          warranty_months: fd.get("warranty") ? num("warranty") : null,
          seller_type: str("sellerType") === "Händler" ? "Dealer" : "Private",
          price: num("price"),
          location: str("location"),
          seller_name: str("name"),
          seller_email: str("email"),
          seller_phone: str("phone") || null,
          description: str("description") || null,
        },
        user.id,
      );
      if (removedImageIds.length > 0) await removeListingImages(id, removedImageIds);

      if (selectedPhotos.length > 0) await uploadListingImages(id, user.id, selectedPhotos);

      if (removeCertificate && !hasNewCertificate) {
        await removeBatteryCertificate(id, user.id, listing?.batteryCertificatePdfPath ?? null);
      }
      if (hasNewCertificate && selectedCertificate) {
        await uploadBatteryCertificate(
          id,
          user.id,
          selectedCertificate,
          certificateMetadata,
          listing?.batteryCertificatePdfPath ?? null,
        );
      }
      window.location.assign("/account");
    } catch (err) {
      setError(germanErrorMessage(err, "Speichern fehlgeschlagen"));
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading) {
    return (
      <Shell>
        <p className="text-muted-foreground">Wird geladen…</p>
      </Shell>
    );
  }
  if (!user) {
    return (
      <Shell>
        <p>
          Bitte melde dich im{" "}
          <a href="/account" className="underline">
            Konto
          </a>{" "}
          an.
        </p>
      </Shell>
    );
  }
  if (!listing) {
    return (
      <Shell>
        <p>Inserat nicht gefunden.</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Inserat bearbeiten
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold">
        {listing.brand} {listing.model}
      </h1>
      <p className="mt-3 rounded-2xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
        Du bearbeitest dein Inserat für{" "}
        <span className="font-medium text-foreground">
          {listing.brand} {listing.model} ({listing.year})
        </span>{" "}
        in {listing.location}. Alle aktuell gespeicherten Werte sind unten vorausgefüllt. Felder mit
        * sind Pflicht.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-3xl border border-border bg-card p-8 shadow-card"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <BrandSelect defaultValue={listing.brand} />
          <Field name="model" label="Modell" defaultValue={listing.model} required />
          <Field name="year" label="Baujahr" type="number" defaultValue={listing.year} required />
          <Field
            name="mileage"
            label="Kilometerstand"
            type="number"
            defaultValue={listing.mileage}
            required
          />
          <Field
            name="battery"
            label="Batterie (kWh)"
            type="number"
            defaultValue={listing.batteryKwh}
            required
          />
          <Field
            name="range"
            label="Reichweite (km)"
            type="number"
            defaultValue={listing.rangeKm}
            required
          />
          <Field
            name="charging"
            label="DC-Laden (kW)"
            type="number"
            defaultValue={listing.chargingKw}
            required
          />
          <label className="space-y-2 text-sm font-medium">
            <span>Schnellladen *</span>
            <select
              name="fastCharging"
              required
              defaultValue={listing.fastCharging ? "Ja" : "Nein"}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm font-normal"
            >
              <option>Ja</option>
              <option>Nein</option>
            </select>
          </label>
          <Field
            name="soh"
            label="Batteriezustand (% SoH)"
            type="number"
            defaultValue={listing.batteryHealth ?? ""}
          />
          <Field
            name="certificateDate"
            label="Datum des Zertifikats"
            defaultValue={listing.batteryCertificateDate ?? ""}
          />
          <Field
            name="certificateProvider"
            label="Prüfanbieter"
            defaultValue={listing.batteryCertificateProvider ?? ""}
          />
          <Field
            name="warranty"
            label="Restgarantie (Monate)"
            type="number"
            defaultValue={listing.warrantyMonths ?? ""}
          />
          <Field
            name="price"
            label="Preis (CHF)"
            type="number"
            defaultValue={listing.price}
            required
          />
          <Field name="location" label="Ort" defaultValue={listing.location} required />
          <label className="space-y-2 text-sm font-medium">
            <span>Verkäufertyp</span>
            <select
              name="sellerType"
              defaultValue={listing.sellerType === "Dealer" ? "Händler" : "Privat"}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              <option>Privat</option>
              <option>Händler</option>
            </select>
          </label>
          <Field name="name" label="Kontaktname" defaultValue={listing.sellerName} required />
          <Field
            name="email"
            label="E-Mail"
            type="email"
            defaultValue={listing.sellerEmail ?? ""}
            required
          />
          <Field name="phone" label="Telefon" type="tel" defaultValue={listing.sellerPhone ?? ""} />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Bilder *</h2>
          <ExistingImageGallery
            images={existingImages}
            removedIds={removedImageIds}
            onToggleRemove={toggleRemoveImage}
          />
          <div className="mt-4">
            <ImageUploadField
              files={selectedPhotos}
              onFilesChange={setSelectedPhotos}
              maxFiles={maxNewPhotos}
              required={keptExistingCount === 0}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Mindestens 1 Foto ist Pflicht. Insgesamt bis zu {MAX_LISTING_IMAGES} Bilder. Neue Bilder
            werden angehängt. Entfernst du oben ein Bild, wird wieder Platz für ein neues frei.
          </p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Batteriezertifikat</h2>
          {listing.batteryCertificatePdfUrl ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm">
              <a
                href={listing.batteryCertificatePdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 hover:underline"
              >
                <FileText className="h-4 w-4" />
                Aktuelles Batteriezertifikat ansehen
              </a>
              {!selectedCertificate && (
                <button
                  type="button"
                  onClick={() => setRemoveCertificate((prev) => !prev)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                    removeCertificate
                      ? "text-foreground hover:bg-secondary"
                      : "text-destructive hover:bg-destructive/10",
                  )}
                >
                  {removeCertificate ? "Entfernen rückgängig machen" : "PDF entfernen"}
                </button>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Noch kein Batteriezertifikat hochgeladen.
            </p>
          )}
          {removeCertificate && !selectedCertificate && (
            <p className="mt-2 text-xs text-destructive">
              Das Zertifikat wird beim Speichern entfernt.
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {listing.batteryCertificatePdfUrl
              ? "Neues PDF hochladen, um das bestehende zu ersetzen (max. 1 Datei)."
              : "Optional: Batteriezertifikat als PDF hochladen (max. 1 Datei)."}
          </p>
          <PdfUploadField
            file={selectedCertificate}
            onFileChange={setSelectedCertificate}
            selectedLabel="Neues PDF: "
          />
        </div>
        <label className="block space-y-2 text-sm font-medium">
          <span>Beschreibung</span>
          <textarea
            name="description"
            rows={6}
            defaultValue={listing.description ?? ""}
            placeholder="Beschreibe Zustand, Servicehistorie, Ausstattung, Batterie und was Käufer sonst wissen sollten."
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-normal leading-6 text-foreground shadow-sm outline-none placeholder:text-muted-foreground/75 focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
          />
          <span className="block text-xs font-normal leading-5 text-muted-foreground">
            Kurze Absätze mit den wichtigsten Details machen dein Inserat vertrauenswürdiger.
          </span>
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          disabled={busy}
          className="h-11 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Speichert…" : "Speichern"}
        </button>
      </form>
    </Shell>
  );
}

function BrandSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>Marke *</span>
      <select
        name="brand"
        required
        defaultValue={
          POPULAR_EV_BRANDS.includes(defaultValue as (typeof POPULAR_EV_BRANDS)[number])
            ? defaultValue
            : ""
        }
        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm font-normal"
      >
        <option value="" disabled>
          Marke auswählen
        </option>
        {POPULAR_EV_BRANDS.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </label>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{props.required ? `${label} *` : label}</span>
      <input
        {...props}
        placeholder={label}
        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm font-normal"
      />
    </label>
  );
}
