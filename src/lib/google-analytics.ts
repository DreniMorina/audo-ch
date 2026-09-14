const DEFAULT_GA_MEASUREMENT_ID = "G-7EYPB0J019";

export const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() ||
  DEFAULT_GA_MEASUREMENT_ID;

const GA_SCRIPT_ID = "google-analytics-gtag";

type GtagCommand =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["consent", "default" | "update", Record<string, string>]
  | ["event", string, Record<string, unknown>]
  | ["set", Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: GtagCommand[];
    gtag?: (...args: GtagCommand) => void;
  }
}

function getPageUrl(path: string) {
  if (typeof window === "undefined") return null;
  return new URL(path || "/", window.location.origin);
}

function getPagePath(path: string) {
  const pageUrl = getPageUrl(path);
  if (!pageUrl) return path || "/";
  return `${pageUrl.pathname}${pageUrl.search}${pageUrl.hash}`;
}

function getPageLocation(path: string) {
  return getPageUrl(path)?.toString() || path || "/";
}

function getPageTitle() {
  if (typeof document === "undefined") return undefined;
  return document.title || undefined;
}

function ensureGoogleAnalyticsGlobals() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: GtagCommand) => {
      window.dataLayer?.push(args);
    });
}

function ensureGoogleAnalyticsScript() {
  if (document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function isGoogleAnalyticsConfigured() {
  return Boolean(GA_MEASUREMENT_ID);
}

export function initializeGoogleAnalytics() {
  if (typeof window === "undefined" || !isGoogleAnalyticsConfigured()) return;

  ensureGoogleAnalyticsGlobals();

  window.gtag!("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: "500",
  });

  window.gtag!("set", {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ads_data_redaction: true,
  });

  ensureGoogleAnalyticsScript();

  window.gtag!("js", new Date());
  window.gtag!("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  enableGoogleAnalytics();
}

export function enableGoogleAnalytics() {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function disableGoogleAnalytics() {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function trackPageView(path: string) {
  if (typeof window === "undefined" || !window.gtag || !isGoogleAnalyticsConfigured()) return;

  window.gtag("event", "page_view", {
    page_path: getPagePath(path),
    page_location: getPageLocation(path),
    page_title: getPageTitle(),
    send_to: GA_MEASUREMENT_ID,
  });
}
