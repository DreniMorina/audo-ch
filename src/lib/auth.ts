import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_LOGIN_REDIRECT_PATH = "/elektroauto-verkaufen-schweiz";
const LOGIN_LINK_COOLDOWN_SECONDS = 60;
const LOGIN_LINK_COOLDOWN_KEY_PREFIX = "audo-login-link-sent-at";

function normalizeOrigin(origin: string | undefined) {
  if (!origin) return undefined;
  return origin.replace(/\/$/, "");
}

function getLoginRedirectUrl() {
  if (typeof window === "undefined") return undefined;

  const configuredOrigin = normalizeOrigin(import.meta.env.VITE_PUBLIC_SITE_URL);
  const origin = configuredOrigin ?? window.location.origin;
  const path = window.location.pathname || DEFAULT_LOGIN_REDIRECT_PATH;
  const search = window.location.search || "";

  return `${origin}${path}${search}`;
}

function normalizedEmail(email: string) {
  return email.trim().toLowerCase();
}

function loginLinkCooldownKey(email: string) {
  return `${LOGIN_LINK_COOLDOWN_KEY_PREFIX}:${normalizedEmail(email)}`;
}

function readLastLoginLinkSentAt(email: string) {
  if (typeof window === "undefined") return 0;

  const value = window.localStorage.getItem(loginLinkCooldownKey(email));
  return value ? Number(value) || 0 : 0;
}

function rememberLoginLinkSentAt(email: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(loginLinkCooldownKey(email), String(Date.now()));
}

export function getLoginLinkCooldownSeconds(email: string) {
  if (!normalizedEmail(email)) return 0;

  const elapsedSeconds = Math.floor((Date.now() - readLastLoginLinkSentAt(email)) / 1000);
  return Math.max(LOGIN_LINK_COOLDOWN_SECONDS - elapsedSeconds, 0);
}

/**
 * Calls back with the current user and on every later auth change. Returns an
 * unsubscribe function.
 */
export function onUserChange(listener: (user: User | null) => void) {
  let active = true;

  supabase.auth.getUser().then(({ data }) => {
    if (active) listener(data.user ?? null);
  });

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    listener(session?.user ?? null);
  });

  return () => {
    active = false;
    data.subscription.unsubscribe();
  };
}

/** Ticks once a second with the remaining cooldown for the address `getEmail()` returns. */
export function watchLoginLinkCooldown(
  getEmail: () => string,
  onTick: (remainingSeconds: number) => void,
) {
  const update = () => onTick(getLoginLinkCooldownSeconds(getEmail()));
  update();
  const interval = window.setInterval(update, 1000);

  return { update, stop: () => window.clearInterval(interval) };
}

export async function sendLoginLink(email: string) {
  const cleanEmail = normalizedEmail(email);
  const cooldownSeconds = getLoginLinkCooldownSeconds(cleanEmail);

  if (cooldownSeconds > 0) {
    throw new Error(
      `Ein Login-Link wurde gerade bereits gesendet. Bitte warte noch ${cooldownSeconds} Sekunden, bevor du einen neuen Link anforderst.`,
    );
  }

  const redirectTo = getLoginRedirectUrl();
  const { error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
  });
  if (error) throw error;

  rememberLoginLinkSentAt(cleanEmail);
}
