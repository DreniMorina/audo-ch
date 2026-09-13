const FALLBACK_ERROR_MESSAGE = "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.";

const KNOWN_ERROR_MESSAGES: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "Die Anmeldedaten sind ungültig."],
  [/email rate limit exceeded/i, "Zu viele E-Mails gesendet. Bitte versuche es später erneut."],
  [
    /for security purposes, you can only request this after/i,
    "Aus Sicherheitsgründen kannst du erst später erneut einen Login-Link anfordern.",
  ],
  [/signup is disabled/i, "Registrierungen sind derzeit deaktiviert."],
  [/user already registered/i, "Diese E-Mail-Adresse ist bereits registriert."],
  [/invalid email/i, "Bitte gib eine gültige E-Mail-Adresse ein."],
  [/network/i, "Netzwerkfehler. Bitte prüfe deine Verbindung und versuche es erneut."],
  [/fetch failed/i, "Die Anfrage konnte nicht gesendet werden. Bitte versuche es erneut."],
  [/failed to fetch/i, "Die Anfrage konnte nicht gesendet werden. Bitte versuche es erneut."],
  [/jwt expired/i, "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an."],
  [/invalid token/i, "Deine Sitzung ist ungültig. Bitte melde dich erneut an."],
  [/row level security/i, "Du hast keine Berechtigung für diese Aktion."],
  [/permission denied/i, "Du hast keine Berechtigung für diese Aktion."],
  [/not found/i, "Der angeforderte Eintrag wurde nicht gefunden."],
  [/duplicate key/i, "Dieser Eintrag existiert bereits."],
];

function isGermanMessage(message: string) {
  return (
    /[äöüÄÖÜß]/.test(message) ||
    /\b(Bitte|Inserat|Fehler|Anmeldung|Sitzung|Berechtigung|gesendet|geladen|fehlgeschlagen|verwalten|verfügbar|prüfen)\b/.test(
      message,
    )
  );
}

function errorMessage(error: unknown) {
  if (typeof error === "string") return error.trim();
  if (error instanceof Error) return error.message.trim();
  if (typeof error !== "object" || error === null) return "";

  const fields = ["message", "details", "hint", "code"]
    .map((field) => {
      const value = (error as Record<string, unknown>)[field];
      return typeof value === "string" ? value.trim() : "";
    })
    .filter(Boolean);

  return fields.join(" ").trim();
}

export function germanErrorMessage(error: unknown, fallback = FALLBACK_ERROR_MESSAGE) {
  const message = errorMessage(error);
  if (!message) return fallback;

  if (isGermanMessage(message)) return message;

  const knownMessage = KNOWN_ERROR_MESSAGES.find(([pattern]) => pattern.test(message));
  return knownMessage?.[1] ?? fallback;
}

export function germanErrorMessageWithCause(error: unknown, prefix: string) {
  const cause = germanErrorMessage(error, "") || errorMessage(error);
  if (!cause || cause === prefix) return prefix;

  return `${prefix}: ${cause}`;
}
