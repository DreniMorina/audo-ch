import { z } from "zod";

/** The filter values `/browse` accepts through the query string. */
export const browseSearchSchema = z.object({
  q: z.string().optional().catch(""),
  brand: z.string().optional().catch("Alle"),
  maxPrice: z.number().min(10000).max(150000).optional().catch(150000),
  minRange: z.number().min(0).max(600).optional().catch(0),
  seller: z.enum(["Alle", "Private", "Dealer"]).optional().catch("Alle"),
  warranty: z.enum(["Alle", "Ja", "Nein"]).optional().catch("Alle"),
  fastOnly: z.boolean().optional().catch(false),
  certificateOnly: z.boolean().optional().catch(false),
  page: z.number().int().positive().optional().catch(1),
});

export type BrowseSearch = z.infer<typeof browseSearchSchema>;

function optionalNumber(params: URLSearchParams, key: string) {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

function checkbox(params: URLSearchParams, key: string) {
  return ["1", "true", "on"].includes(params.get(key) ?? "");
}

/** Reads the browse filters off a URL. Malformed values fall back instead of throwing. */
export function parseBrowseSearch(params: URLSearchParams): BrowseSearch {
  return browseSearchSchema.parse({
    q: params.get("q") ?? undefined,
    brand: params.get("brand") ?? undefined,
    maxPrice: optionalNumber(params, "maxPrice"),
    minRange: optionalNumber(params, "minRange"),
    seller: params.get("seller") ?? undefined,
    warranty: params.get("warranty") ?? undefined,
    fastOnly: checkbox(params, "fastOnly"),
    certificateOnly: checkbox(params, "certificateOnly"),
    page: optionalNumber(params, "page"),
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
