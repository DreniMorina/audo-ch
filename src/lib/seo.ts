const SITE_URL = "https://audo.ch";

export function canonicalUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function seoMeta({
  title,
  description,
  path = "/",
  type = "website",
  robots = "index,follow",
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  robots?: string;
}) {
  const url = canonicalUrl(path);

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: robots },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:locale", content: "de_CH" },
    { property: "og:site_name", content: "Audo.ch" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function canonicalLink(path = "/") {
  return { rel: "canonical", href: canonicalUrl(path) };
}

export function jsonLdScript(data: unknown) {
  // Escape characters that could break out of the inline <script> tag
  // (the serialized JSON is injected unescaped into the SSR HTML).
  return {
    type: "application/ld+json",
    children: JSON.stringify(data)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029"),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Audo.ch",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/browse?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
