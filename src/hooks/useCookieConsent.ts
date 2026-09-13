import { useCallback, useEffect, useSyncExternalStore } from "react";

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
}

type ConsentStatus = "undecided" | "partial" | "full";

type ConsentSnapshot = {
  state: ConsentState;
  decided: boolean;
  ready: boolean;
};

const STORAGE_KEY = "audo_cookie_consent";

function getDefaultConsent(): ConsentState {
  return {
    necessary: true,
    analytics: false,
  };
}

function getDefaultSnapshot(): ConsentSnapshot {
  return {
    state: getDefaultConsent(),
    decided: false,
    ready: false,
  };
}

function readStoredConsent(): Omit<ConsentSnapshot, "ready"> {
  if (typeof window === "undefined") {
    return { state: getDefaultConsent(), decided: false };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: getDefaultConsent(), decided: false };

    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      state: {
        necessary: true,
        analytics: parsed.analytics === true,
      },
      decided: true,
    };
  } catch {
    return { state: getDefaultConsent(), decided: false };
  }
}

function persistConsent(state: ConsentState) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        necessary: true,
        analytics: state.analytics,
      }),
    );
  } catch {
    // If storage is unavailable, keep the in-memory state so the banner remains usable.
  }
}

let snapshot: ConsentSnapshot = getDefaultSnapshot();
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function setSnapshot(next: ConsentSnapshot) {
  snapshot = next;
  emitChange();
}

function hydrateConsent() {
  const stored = readStoredConsent();
  setSnapshot({ ...stored, ready: true });
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return getDefaultSnapshot();
}

function updateConsent(state: ConsentState) {
  const next = { necessary: true, analytics: state.analytics === true };
  persistConsent(next);
  setSnapshot({ state: next, decided: true, ready: true });
}

export function useCookieConsent() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateConsent();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) hydrateConsent();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setConsent = useCallback((state: ConsentState) => {
    updateConsent(state);
  }, []);

  const acceptAll = useCallback(() => {
    setConsent({ necessary: true, analytics: true });
  }, [setConsent]);

  const acceptNecessaryOnly = useCallback(() => {
    setConsent({ necessary: true, analytics: false });
  }, [setConsent]);

  const revoke = useCallback(() => {
    setConsent({ necessary: true, analytics: false });
  }, [setConsent]);

  const status: ConsentStatus = current.decided
    ? current.state.analytics
      ? "full"
      : "partial"
    : "undecided";

  return {
    consent: current.state,
    decided: current.decided,
    ready: current.ready,
    status,
    setConsent,
    acceptAll,
    acceptNecessaryOnly,
    revoke,
  };
}
