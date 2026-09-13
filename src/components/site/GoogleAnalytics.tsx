import { useEffect, useRef } from "react";
import {
  disableGoogleAnalytics,
  enableGoogleAnalytics,
  initializeGoogleAnalytics,
  trackPageView,
} from "@/lib/google-analytics";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export function GoogleAnalytics() {
  const { consent, ready } = useCookieConsent();
  const initialized = useRef(false);

  useEffect(() => {
    if (!ready) return;

    if (!consent.analytics) {
      disableGoogleAnalytics();
      initialized.current = false;
      return;
    }

    if (!initialized.current) {
      initializeGoogleAnalytics();
      initialized.current = true;
    } else {
      enableGoogleAnalytics();
    }

    // Astro serves a multi-page app: every navigation is a document load, so the
    // page view is sent once per mount instead of on router location changes.
    trackPageView(window.location.href);
  }, [consent.analytics, ready]);

  return null;
}
