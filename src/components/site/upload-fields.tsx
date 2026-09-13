import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import {
  MAX_LISTING_IMAGES,
  describeCertificateError,
  describeListingImageError,
  type ListingImage,
} from "@/data/listings";
import { cn } from "@/lib/utils";

const DROP_INPUT_CLASSES =
  "block w-full cursor-pointer rounded-md border-2 border-dashed border-border bg-secondary/50 p-8 text-sm text-muted-foreground transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-60";

function sameFile(a: File, b: File) {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

type ImageUploadFieldProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  /** Maximum number of files that may be selected in this field. */
  maxFiles: number;
  /** Total images allowed on the listing (used for messaging). */
  totalMax?: number;
  /** Marks the image upload as required in helper copy. */
  required?: boolean;
};

/** Controlled multi-image picker: previews every selection and lets the user remove each one. */
export function ImageUploadField({
  files,
  onFilesChange,
  maxFiles,
  totalMax = MAX_LISTING_IMAGES,
  required = false,
}: ImageUploadFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Array<{ name: string; url: string }>>([]);

  useEffect(() => {
    const next = files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    setPreviews(next);
    return () => next.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [files]);

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.target.files ?? []);
    // Reset so re-selecting the same file after a removal still fires onChange.
    event.target.value = "";
    if (incoming.length === 0) return;

    const messages: string[] = [];
    const next = [...files];
    for (const file of incoming) {
      const invalid = describeListingImageError(file);
      if (invalid) {
        messages.push(invalid);
        continue;
      }
      if (next.some((existing) => sameFile(existing, file))) continue;
      if (next.length >= maxFiles) {
        messages.push(
          maxFiles === 0
            ? `Du hast bereits die maximale Anzahl an Bildern (${totalMax}) erreicht. Entferne zuerst ein Bild.`
            : `Maximal ${totalMax} Bilder pro Inserat. Nicht alle ausgewählten Bilder wurden übernommen.`,
        );
        continue;
      }
      next.push(file);
    }

    onFilesChange(next);
    setError(messages.length > 0 ? Array.from(new Set(messages)).join(" ") : null);
  }

  function removeAt(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
    setError(null);
  }

  const reachedMax = files.length >= maxFiles;

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={reachedMax}
        onChange={handleSelect}
        className={DROP_INPUT_CLASSES}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {required ? "* Pflicht: mindestens 1 Foto. " : ""}Bis zu {totalMax} Bilder, jeweils max. 5
        MB (JPG, PNG oder WebP). Das erste Bild erscheint als Titelbild.
      </p>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {previews.length > 0 ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {previews.map((preview, index) => (
            <figure
              key={`${preview.name}-${preview.url}`}
              className="relative rounded-xl border border-border bg-background p-2"
            >
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Bild entfernen: ${preview.name}`}
                className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={preview.url}
                alt={`Ausgewähltes Bild ${index + 1}: ${preview.name}`}
                className="h-28 w-full rounded-lg object-cover"
              />
              <figcaption className="mt-2 truncate text-xs text-muted-foreground">
                {index === 0 ? "Titelbild: " : "Bild: "}
                {preview.name}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">Noch keine Bilder ausgewählt.</p>
      )}
    </div>
  );
}

type PdfUploadFieldProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Prefix shown in front of the selected file name, e.g. "Ausgewähltes PDF: ". */
  selectedLabel?: string;
};

/** Controlled single-PDF picker: only accepts one PDF and lets the user clear it. */
export function PdfUploadField({
  file,
  onFileChange,
  selectedLabel = "Ausgewähltes PDF: ",
}: PdfUploadFieldProps) {
  const [error, setError] = useState<string | null>(null);

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!selected) return;
    const invalid = describeCertificateError(selected);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    onFileChange(selected);
  }

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleSelect}
        className={DROP_INPUT_CLASSES}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {file ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-2">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {selectedLabel}
              <span className="font-medium text-foreground">{file.name}</span>
            </span>
          </span>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <X className="h-3.5 w-3.5" />
            Entfernen
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">Noch kein PDF ausgewählt.</p>
      )}
    </div>
  );
}

type ExistingImageGalleryProps = {
  images: ListingImage[];
  removedIds: string[];
  onToggleRemove: (id: string) => void;
};

/** Existing listing images with a one-click remove/restore toggle for the edit form. */
export function ExistingImageGallery({
  images,
  removedIds,
  onToggleRemove,
}: ExistingImageGalleryProps) {
  if (images.length === 0) {
    return <p className="mt-2 text-sm text-muted-foreground">Noch keine Bilder hochgeladen.</p>;
  }

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {images.map((image, index) => {
        const name = image.storagePath.split("/").pop() ?? `Bild ${index + 1}`;
        const removed = removedIds.includes(image.id);
        return (
          <figure
            key={image.id}
            className={cn(
              "relative rounded-xl border bg-background p-2",
              removed ? "border-destructive/60" : "border-border",
            )}
          >
            <img
              src={image.url}
              alt={`Bereits hochgeladenes Bild ${index + 1}: ${name}`}
              className={cn("h-28 w-full rounded-lg object-cover", removed && "opacity-40")}
            />
            <figcaption className="mt-2 truncate text-xs text-muted-foreground">
              {removed
                ? "Wird entfernt: "
                : index === 0
                  ? "Aktuelles Titelbild: "
                  : "Hochgeladen: "}
              {name}
            </figcaption>
            <button
              type="button"
              onClick={() => onToggleRemove(image.id)}
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                removed
                  ? "text-foreground hover:bg-secondary"
                  : "text-destructive hover:bg-destructive/10",
              )}
            >
              {removed ? (
                "Wiederherstellen"
              ) : (
                <>
                  <X className="h-3.5 w-3.5" />
                  Entfernen
                </>
              )}
            </button>
          </figure>
        );
      })}
    </div>
  );
}
