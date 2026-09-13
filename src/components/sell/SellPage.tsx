import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ImageUploadField, PdfUploadField } from "@/components/site/upload-fields";
import {
  MAX_LISTING_IMAGES,
  submitListing,
  uploadBatteryCertificate,
  uploadListingImages,
  validateListingImageFiles,
} from "@/data/listings";
import { sendLoginLink, useLoginLinkCooldown, useSupabaseUser } from "@/hooks/useSupabaseUser";
import { germanErrorMessage, germanErrorMessageWithCause } from "@/lib/german-error";
import { POPULAR_EV_BRANDS } from "@/data/vehicle-brands";

export function SellPage() {
  const [submitted, setSubmitted] = useState(false);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [loginLinkSent, setLoginLinkSent] = useState(false);
  const loginCooldownSeconds = useLoginLinkCooldown(authEmail);
  const { user, loading: authLoading } = useSupabaseUser();

  async function handleLoginLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await sendLoginLink(authEmail);
      setLoginLinkSent(true);
    } catch (err) {
      setError(germanErrorMessage(err, "Login-Link konnte nicht gesendet werden"));
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    if (fd.get("termsAccepted") !== "on") {
      setError("Bitte bestätige die AGB, bevor du dein Inserat veröffentlichst.");
      return;
    }

    // At least one photo is required so every public listing has a visual preview.
    if (selectedPhotos.length === 0) {
      setError("Bitte lade mindestens 1 Foto hoch.");
      return;
    }

    // Validate the selected files up front so we never publish a listing when a
    // file is clearly invalid (wrong type, too large or too many).
    try {
      validateListingImageFiles(selectedPhotos);
    } catch (err) {
      setError(germanErrorMessage(err, "Bitte prüfe die ausgewählten Bilder."));
      return;
    }

    setBusy(true);
    const num = (k: string) => Number(fd.get(k) || 0);
    const str = (k: string) => String(fd.get(k) || "").trim();
    const bool = (k: string) => str(k) === "Ja";

    let listing: { id: string };
    try {
      listing = await submitListing(
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
          battery_certificate_date: str("certificateDate") || null,
          battery_certificate_provider: str("certificateProvider") || null,
          warranty_months: fd.get("warranty") ? num("warranty") : null,
          seller_type: (str("sellerType") === "Händler" ? "Dealer" : "Private") as
            "Private" | "Dealer",
          price: num("price"),
          location: str("location"),
          seller_name: str("name"),
          seller_email: str("email"),
          seller_phone: str("phone") || null,
          description: str("description") || null,
        },
        user?.id,
      );
    } catch (err) {
      // The listing itself could not be created — this is a real submission failure.
      setError(germanErrorMessageWithCause(err, "Übermittlung fehlgeschlagen"));
      setBusy(false);
      return;
    }

    // The listing is published at this point. Image and certificate uploads are a
    // best-effort follow-up: if they fail we still confirm the listing and let the
    // seller retry the assets from their account instead of wrongly reporting that
    // the whole submission failed.
    let warning: string | null = null;
    try {
      if (selectedPhotos.length > 0 && user?.id) {
        await uploadListingImages(listing.id, user.id, selectedPhotos);
      }
      if (selectedCertificate && user?.id) {
        await uploadBatteryCertificate(listing.id, user.id, selectedCertificate);
      }
    } catch (err) {
      warning = germanErrorMessage(
        err,
        "Einige Dateien konnten nicht hochgeladen werden. Du kannst sie in deinem Konto ergänzen.",
      );
    }

    setUploadWarning(warning);
    setSubmitted(true);
    setBusy(false);
  }

  if (submitted) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-24 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-electric/20 text-graphite">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold">Inserat erhalten</h1>
        <p className="mt-3 text-muted-foreground">
          Danke — dein Inserat ist veröffentlicht und du kannst es in deinem Konto jederzeit
          bearbeiten.
        </p>
        {uploadWarning && (
          <p className="mx-auto mt-4 max-w-md rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {uploadWarning}
          </p>
        )}
        <a
          href="/account"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Meine Inserate
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          EV inserieren
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-balance">
          Verkaufe dein Elektroauto an die richtigen Käufer.
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Im Early Access kostenlos. Melde dich per Magic Link an, veröffentliche dein Inserat
          direkt und bearbeite es später in deinem Konto.
        </p>
      </div>

      {!authLoading && !user ? (
        <form
          onSubmit={handleLoginLink}
          className="mt-10 max-w-3xl space-y-4 rounded-3xl border border-border bg-card p-8 shadow-card"
        >
          <div>
            <h2 className="font-display text-xl font-semibold">Mit E-Mail anmelden</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Wir senden dir einen sicheren Link. Danach kannst du Inserate erstellen, Fotos
              hochladen und deine Angebote bearbeiten.
            </p>
          </div>
          <input
            type="email"
            required
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            placeholder="deine@email.ch"
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
          />
          {loginLinkSent && (
            <p className="text-sm text-muted-foreground">
              Link gesendet. Bitte öffne ihn in deiner E-Mail. Falls er nicht ankommt, kannst du
              nach kurzer Wartezeit einen neuen Link anfordern.
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy || loginCooldownSeconds > 0}
            className="h-11 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {busy
              ? "Wird gesendet…"
              : loginCooldownSeconds > 0
                ? `Erneut senden in ${loginCooldownSeconds}s`
                : loginLinkSent
                  ? "Link erneut senden"
                  : "Link senden"}
          </button>
        </form>
      ) : null}

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mt-10 max-w-3xl space-y-8 rounded-3xl border border-border bg-card p-8 shadow-card"
        >
          <FormSection title="Fahrzeug">
            <RequiredHint />
            <div className="grid gap-4 md:grid-cols-2">
              <BrandSelect />
              <Field name="model" placeholder="Modell, z. B. Model 3 Long Range" required />
              <Field name="year" type="number" placeholder="Baujahr, z. B. 2022" required />
              <Field
                name="mileage"
                type="number"
                placeholder="Kilometerstand, z. B. 41200"
                required
              />
            </div>
          </FormSection>

          <FormSection title="EV-Details">
            <RequiredHint />
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                name="battery"
                type="number"
                placeholder="Batterie (kWh), z. B. 75"
                required
              />
              <Field
                name="range"
                type="number"
                placeholder="Reichweite (km), z. B. 480"
                required
              />
              <Field
                name="charging"
                type="number"
                placeholder="DC-Laden (kW), z. B. 250"
                required
              />
              <SelectField
                name="fastCharging"
                label="Schnellladen"
                options={["Ja", "Nein"]}
                required
              />
              <Field
                name="soh"
                type="number"
                placeholder="Batteriezustand (% SoH), z. B. 94 (optional)"
              />
              <Field
                name="certificateDate"
                placeholder="Datum des Zertifikats, z. B. 12.04.2026 (optional)"
              />
              <Field
                name="certificateProvider"
                placeholder="Prüfanbieter, z. B. Aviloo / TÜV (optional)"
              />
              <Field
                name="warranty"
                type="number"
                placeholder="Restgarantie (Monate), z. B. 28"
              />
              <div>
                <select
                  name="sellerType"
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
                >
                  <option>Privat</option>
                  <option>Händler</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-xs text-muted-foreground">
                Optional: offizielles Batteriezertifikat als PDF (max. 1 Datei).
              </p>
              <PdfUploadField file={selectedCertificate} onFileChange={setSelectedCertificate} />
            </div>
          </FormSection>

          <FormSection title="Preis & Bilder">
            <RequiredHint />
            <div className="grid gap-4 md:grid-cols-2">
              <Field name="price" type="number" placeholder="Preis (CHF), z. B. 32900" required />
              <Field name="location" placeholder="Ort, z. B. Zürich" required />
            </div>
            <div className="mt-4">
              <ImageUploadField
                files={selectedPhotos}
                onFilesChange={setSelectedPhotos}
                maxFiles={MAX_LISTING_IMAGES}
                required
              />
            </div>
          </FormSection>

          <FormSection title="Kontakt">
            <RequiredHint />
            <div className="grid gap-4 md:grid-cols-2">
              <Field name="name" placeholder="Dein Name" required />
              <Field name="email" type="email" placeholder="E-Mail" required />
              <Field name="phone" type="tel" placeholder="Telefon" />
            </div>
          </FormSection>

          <FormSection title="Beschreibung">
            <label className="block space-y-2">
              <span className="sr-only">Beschreibung</span>
              <textarea
                name="description"
                rows={6}
                placeholder="Erzähl kurz, was dein E-Auto besonders macht: Zustand, Servicehistorie, Ausstattung, Batterie, Ladeverhalten oder kleine Gebrauchsspuren."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground shadow-sm outline-none placeholder:text-muted-foreground/75 focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
              />
            </label>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Tipp: Ein ehrlicher, gut lesbarer Text schafft Vertrauen und hilft Käufern schneller
              zu entscheiden.
            </p>
          </FormSection>

          <div className="space-y-4 border-t border-border pt-6">
            <label className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4 text-sm text-foreground">
              <input
                name="termsAccepted"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
              <span>
                Ich bestätige die AGB und akzeptiere, dass mein Inserat direkt veröffentlicht
                wird.
                <a href="/agb" className="ml-1 underline underline-offset-2 hover:text-primary">
                  AGB lesen
                </a>
              </span>
            </label>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                {error ? (
                  <span className="text-destructive">{error}</span>
                ) : (
                  <>
                    Mit dem Absenden bestätigst du die Richtigkeit der Angaben. Felder mit * und
                    mindestens 1 Foto sind Pflicht. Angaben zum Batteriestatus und ein
                    PDF-Zertifikat sind optional. Dein Inserat wird direkt veröffentlicht.
                  </>
                )}
              </p>
              <button
                type="submit"
                disabled={busy}
                className="h-11 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Wird gesendet…" : "Inserat einreichen"}
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </main>
  );
}


function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function RequiredHint() {
  return <p className="mb-3 text-xs text-muted-foreground">* Pflichtfeld</p>;
}

function BrandSelect() {
  return (
    <select
      name="brand"
      required
      defaultValue=""
      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
    >
      <option value="" disabled>
        Marke auswählen *
      </option>
      {POPULAR_EV_BRANDS.map((brand) => (
        <option key={brand} value={brand}>
          {brand}
        </option>
      ))}
    </select>
  );
}

function SelectField({
  name,
  label,
  options,
  required,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <select
      name={name}
      required={required}
      defaultValue=""
      aria-label={label}
      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
    >
      <option value="" disabled>
        {required ? `${label} *` : label}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Field({
  name,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={required && placeholder ? `${placeholder} *` : placeholder}
      aria-label={required && placeholder ? `${placeholder} Pflichtfeld` : placeholder}
      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
    />
  );
}
