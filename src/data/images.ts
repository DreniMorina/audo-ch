import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import car5 from "@/assets/car-5.jpg";
import car6 from "@/assets/car-6.jpg";
import heroCar from "@/assets/hero-car.jpg";

// Astro resolves `src/assets` imports to an ImageMetadata object rather than to a
// plain URL string, so the built asset URL is read from `.src`.
const map: Record<string, string> = {
  "car-1.jpg": car1.src,
  "car-2.jpg": car2.src,
  "car-3.jpg": car3.src,
  "car-4.jpg": car4.src,
  "car-5.jpg": car5.src,
  "car-6.jpg": car6.src,
  "hero-car.jpg": heroCar.src,
};

export function resolveImage(name: string | null | undefined): string {
  if (!name) return car1.src;
  if (name.startsWith("http") || name.startsWith("/")) return name;
  return map[name] ?? car1.src;
}
