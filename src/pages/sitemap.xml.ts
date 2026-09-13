import type { APIRoute } from "astro";
import { fetchApprovedListingSitemapEntries, type ListingSitemapEntry } from "@/data/listings";
import { canonicalUrl } from "@/lib/seo";

// Built per request so newly published listings appear without a redeploy.
export const prerender = false;

const staticPages = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/browse", changefreq: "daily", priority: "0.9" },
  { path: "/elektroauto-verkaufen-schweiz", changefreq: "monthly", priority: "0.8" },
  { path: "/elektroauto-kaufen-schweiz", changefreq: "monthly", priority: "0.9" },
  { path: "/gebrauchte-elektroautos-schweiz", changefreq: "monthly", priority: "0.9" },
  { path: "/elektroauto-verkaufen", changefreq: "monthly", priority: "0.85" },
  { path: "/impressum", changefreq: "yearly", priority: "0.2" },
  { path: "/datenschutz", changefreq: "yearly", priority: "0.2" },
  { path: "/agb", changefreq: "yearly", priority: "0.2" },
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatDate(value: string | Date) {
  return new Date(value).toISOString().split("T")[0];
}

function urlEntry({
  loc,
  lastmod,
  changefreq,
  priority,
}: {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}) {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export const GET: APIRoute = async () => {
  const today = formatDate(new Date());

  // A failing listings query must never take the whole sitemap down. Google reports
  // an unreadable sitemap as an error and stops discovering URLs through it, so
  // degrade to the static pages instead of returning a 500, and re-check sooner.
  let listings: ListingSitemapEntry[] = [];
  let isDegraded = false;
  try {
    listings = await fetchApprovedListingSitemapEntries();
  } catch (error) {
    console.error("[sitemap] Failed to load listing entries", error);
    isDegraded = true;
  }

  const urls = [
    ...staticPages.map((page) =>
      urlEntry({ loc: canonicalUrl(page.path), lastmod: today, ...page }),
    ),
    ...listings.map((listing) =>
      urlEntry({
        loc: canonicalUrl(`/listings/${listing.id}`),
        lastmod: formatDate(listing.updatedAt),
        changefreq: "weekly",
        priority: "0.7",
      }),
    ),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
    {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": isDegraded ? "public, max-age=300" : "public, max-age=3600",
      },
    },
  );
};
