import { z } from "zod";

/** The filter values `/browse` accepts through the query string. */
export const browseSearchSchema = z.object({
  q: z.string().optional().catch(""),
  brand: z.string().optional().catch("Alle"),
  maxPrice: z.number().optional().catch(150000),
  minRange: z.number().optional().catch(0),
});

export type BrowseSearch = z.infer<typeof browseSearchSchema>;

function optionalNumber(params: URLSearchParams, key: string) {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

/** Reads the browse filters off a URL. Malformed values fall back instead of throwing. */
export function parseBrowseSearch(params: URLSearchParams): BrowseSearch {
  return browseSearchSchema.parse({
    q: params.get("q") ?? undefined,
    brand: params.get("brand") ?? undefined,
    maxPrice: optionalNumber(params, "maxPrice"),
    minRange: optionalNumber(params, "minRange"),
  });
}

/** Builds a `/browse` link, e.g. `browseHref({ brand: "Tesla" })`. */
export function browseHref(search: BrowseSearch = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `/browse?${query}` : "/browse";
}
