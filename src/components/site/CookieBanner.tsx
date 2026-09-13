import { BarChart3 } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export function CookieBanner() {
  const { decided, ready, acceptAll, acceptNecessaryOnly } = useCookieConsent();

  if (!ready || decided) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Google-Analytics-Zustimmung"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-2xl backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 md:max-w-2xl">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric/15 text-graphite">
              <BarChart3 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Google Analytics?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Darf Audo.ch Google Analytics für unpersonalisierte Nutzungsstatistiken verwenden?
                Es gibt nur Ja oder Nein: Mit Ja stimmst du Google Analytics zu, mit Nein nicht. Du
                kannst deine Entscheidung jederzeit ändern.{" "}
                <a href="/datenschutz" className="underline underline-offset-2 hover:text-foreground">
                  Datenschutzerklärung
                </a>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
            <button
              onClick={acceptNecessaryOnly}
              className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Nein
            </button>
            <button
              onClick={acceptAll}
              className="inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
