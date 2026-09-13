export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="font-display text-[1.35rem] font-extrabold text-primary">Audo.ch</span>
            <span className="ml-2 text-sm text-muted-foreground">EV-Marktplatz · Schweiz</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="/browse" className="hover:text-foreground">
              Entdecken
            </a>
            <a href="/#why" className="hover:text-foreground">
              Warum nur EVs
            </a>
            <a href="mailto:hallo@audo.ch" className="hover:text-foreground">
              Kontakt
            </a>
            <a href="/impressum" className="hover:text-foreground">
              Impressum
            </a>
            <a href="/datenschutz" className="hover:text-foreground">
              Datenschutz
            </a>
            <a href="/elektroauto-kaufen-schweiz" className="hover:text-foreground">
              Elektroauto kaufen
            </a>
            <a href="/gebrauchte-elektroautos-schweiz" className="hover:text-foreground">
              E-Auto Occasion
            </a>
            <a href="/agb" className="hover:text-foreground">
              AGB
            </a>
          </nav>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} audo.ch — Der Schweizer Marktplatz für Elektroautos:
          Reichweite, Batterie und Vertrauen.
        </p>
      </div>
    </footer>
  );
}
