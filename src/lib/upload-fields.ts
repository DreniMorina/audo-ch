import {
  MAX_LISTING_IMAGES,
  describeCertificateError,
  describeListingImageError,
  type ListingImage,
} from "@/data/listings";

function sameFile(a: File, b: File) {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

function show(element: HTMLElement, visible: boolean) {
  element.hidden = !visible;
}

/** Controlled multi-image picker: previews every selection and lets the user remove each one. */
export function createImagePicker(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>("[data-image-input]")!;
  const previews = root.querySelector<HTMLElement>("[data-image-previews]")!;
  const empty = root.querySelector<HTMLElement>("[data-image-empty]")!;
  const errorBox = root.querySelector<HTMLElement>("[data-image-error]")!;
  const template = root.querySelector<HTMLTemplateElement>("[data-image-preview-template]")!;
  const totalMax = Number(root.dataset.totalMax ?? MAX_LISTING_IMAGES);

  let files: File[] = [];
  let maxFiles = totalMax;
  let objectUrls: string[] = [];

  function setError(message: string | null) {
    errorBox.textContent = message ?? "";
    show(errorBox, message !== null);
  }

  function render() {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls = [];
    previews.replaceChildren();

    files.forEach((file, index) => {
      const node = template.content.cloneNode(true) as DocumentFragment;
      const figure = node.querySelector<HTMLElement>("figure")!;
      const image = node.querySelector<HTMLImageElement>("[data-preview-image]")!;
      const caption = node.querySelector<HTMLElement>("[data-preview-caption]")!;
      const remove = node.querySelector<HTMLButtonElement>("[data-remove]")!;

      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      image.src = url;
      image.alt = `Ausgewähltes Bild ${index + 1}: ${file.name}`;
      caption.textContent = `${index === 0 ? "Titelbild: " : "Bild: "}${file.name}`;
      remove.setAttribute("aria-label", `Bild entfernen: ${file.name}`);
      remove.addEventListener("click", () => {
        files = files.filter((_, i) => i !== index);
        setError(null);
        render();
      });

      previews.append(figure);
    });

    show(previews, files.length > 0);
    show(empty, files.length === 0);
    input.disabled = files.length >= maxFiles;
  }

  input.addEventListener("change", () => {
    const incoming = Array.from(input.files ?? []);
    // Reset so re-selecting the same file after a removal still fires change.
    input.value = "";
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

    files = next;
    setError(messages.length > 0 ? Array.from(new Set(messages)).join(" ") : null);
    render();
  });

  render();

  return {
    getFiles: () => files,
    /** Keeps pending uploads within the total limit as existing images are removed or restored. */
    setMaxFiles(next: number) {
      maxFiles = Math.max(0, next);
      if (files.length > maxFiles) files = files.slice(0, maxFiles);
      render();
    },
  };
}

/** Controlled single-PDF picker: only accepts one PDF and lets the user clear it. */
export function createPdfPicker(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>("[data-pdf-input]")!;
  const selected = root.querySelector<HTMLElement>("[data-pdf-selected]")!;
  const nameLabel = root.querySelector<HTMLElement>("[data-pdf-name]")!;
  const empty = root.querySelector<HTMLElement>("[data-pdf-empty]")!;
  const errorBox = root.querySelector<HTMLElement>("[data-pdf-error]")!;
  const clear = root.querySelector<HTMLButtonElement>("[data-pdf-clear]")!;

  let file: File | null = null;

  function render() {
    nameLabel.textContent = file?.name ?? "";
    show(selected, file !== null);
    show(empty, file === null);
  }

  function setError(message: string | null) {
    errorBox.textContent = message ?? "";
    show(errorBox, message !== null);
  }

  input.addEventListener("change", () => {
    const picked = input.files?.[0] ?? null;
    input.value = "";
    if (!picked) return;

    const invalid = describeCertificateError(picked);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError(null);
    file = picked;
    render();
  });

  clear.addEventListener("click", () => {
    file = null;
    render();
  });

  render();

  return { getFile: () => file };
}

/** Existing listing images with a one-click remove/restore toggle for the edit form. */
export function createExistingImageGallery(root: HTMLElement, onChange: () => void) {
  const grid = root.querySelector<HTMLElement>("[data-existing-grid]")!;
  const empty = root.querySelector<HTMLElement>("[data-existing-empty]")!;
  const template = root.querySelector<HTMLTemplateElement>("[data-existing-template]")!;

  const removedIds = new Set<string>();
  let images: ListingImage[] = [];

  function render() {
    grid.replaceChildren();

    images.forEach((image, index) => {
      const name = image.storagePath.split("/").pop() ?? `Bild ${index + 1}`;
      const removed = removedIds.has(image.id);

      const node = template.content.cloneNode(true) as DocumentFragment;
      const figure = node.querySelector<HTMLElement>("[data-figure]")!;
      const img = node.querySelector<HTMLImageElement>("[data-existing-image]")!;
      const caption = node.querySelector<HTMLElement>("[data-existing-caption]")!;
      const toggle = node.querySelector<HTMLButtonElement>("[data-toggle-remove]")!;
      const icon = node.querySelector<HTMLElement>("[data-remove-icon]")!;
      const label = node.querySelector<HTMLElement>("[data-remove-label]")!;

      figure.classList.toggle("border-destructive/60", removed);
      figure.classList.toggle("border-border", !removed);
      img.src = image.url;
      img.alt = `Bereits hochgeladenes Bild ${index + 1}: ${name}`;
      img.classList.toggle("opacity-40", removed);
      caption.textContent = `${
        removed ? "Wird entfernt: " : index === 0 ? "Aktuelles Titelbild: " : "Hochgeladen: "
      }${name}`;

      toggle.classList.toggle("text-foreground", removed);
      toggle.classList.toggle("hover:bg-secondary", removed);
      toggle.classList.toggle("text-destructive", !removed);
      toggle.classList.toggle("hover:bg-destructive/10", !removed);
      icon.hidden = removed;
      label.textContent = removed ? "Wiederherstellen" : "Entfernen";

      toggle.addEventListener("click", () => {
        if (removedIds.has(image.id)) removedIds.delete(image.id);
        else removedIds.add(image.id);
        render();
        onChange();
      });

      grid.append(figure);
    });

    show(grid, images.length > 0);
    show(empty, images.length === 0);
  }

  return {
    setImages(next: ListingImage[]) {
      images = next;
      removedIds.clear();
      render();
    },
    getRemovedIds: () => Array.from(removedIds),
    getKeptCount: () => images.length - removedIds.size,
  };
}
