const PLACEHOLDER_IMAGE = "/vehicle-placeholder.svg";

export function resolveImage(name: string | null | undefined): string {
  if (!name) return PLACEHOLDER_IMAGE;
  if (name.startsWith("http") || name.startsWith("/")) return name;
  return PLACEHOLDER_IMAGE;
}
