export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
}

const STORAGE_KEY = "audo_cookie_consent";

function defaultConsent(): ConsentState {
  return { necessary: true, analytics: true };
}

/** The stored decision, or null when the visitor has not decided yet. */
export function readConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return { necessary: true, analytics: parsed.analytics === true };
  } catch {
    return null;
  }
}

const listeners = new Set<(consent: ConsentState) => void>();

export function onConsentChange(listener: (consent: ConsentState) => void) {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener(readConsent() ?? defaultConsent());
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function setConsent(analytics: boolean) {
  const next: ConsentState = { necessary: true, analytics };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // If storage is unavailable, keep the in-memory decision so the page stays usable.
  }

  for (const listener of listeners) listener(next);
}
