import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ListingGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeImage = images[activeImageIndex % images.length];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="relative">
        <img
          src={activeImage}
          alt={alt}
          width={1200}
          height={800}
          className="aspect-[4/3] w-full object-cover"
        />
        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="Vorheriges Bild"
              onClick={() =>
                setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-card backdrop-blur hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Nächstes Bild"
              onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-card backdrop-blur hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-foreground shadow-card backdrop-blur">
              {activeImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
