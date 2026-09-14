# audo.ch

Der Schweizer Marktplatz für Elektroautos. Reines Astro — kein UI-Framework, keine Hydration.

## Setup

```sh
npm install
cp .env.example .env   # Supabase-Keys eintragen
npm run dev
```

| Befehl            | Aktion                                     |
| :---------------- | :----------------------------------------- |
| `npm run dev`     | Dev-Server auf http://localhost:4321       |
| `npm run build`   | Production-Build (Vercel-Output)           |
| `npm run preview` | Build lokal ansehen                        |
| `npm run astro`   | Astro-CLI (`astro check`, `astro add`, …)  |

## Architektur

Jede Seite und jede Komponente ist `.astro`. Interaktive Teile bekommen ein `<script>`,
das sein Markup über `data-*`-Attribute findet und Zustände umschaltet — es gibt kein
Client-Rendering und keine Hydration.

Marktplatzdaten werden serverseitig im Frontmatter geladen, die Inserate stehen also im
HTML. Supabase-Aufrufe im Browser gibt es nur dort, wo eine Session nötig ist: Login,
Inserat anlegen/bearbeiten/löschen und Datei-Uploads.

```
src/
├── pages/            Astro-Routen: URL, SEO-Head
│   ├── index.astro                  Statisch – Inserate zur Build-Zeit, Zähler als Server-Island
│   ├── elektroauto-*.astro          Statisch – SEO-Landingpages (kaufen/verkaufen/Occasionen)
│   ├── browse.astro                 SSR – Inserate + Filter aus der Query-String
│   ├── listings/[id].astro          SSR – Inserat serverseitig, echte 404
│   ├── account/                     Konto & Inserat bearbeiten
│   └── sitemap.xml.ts               SSR – statische Seiten + alle freigegebenen Inserate
├── layouts/Layout.astro             HTML-Shell, Meta-Tags, Canonical, JSON-LD, Header/Footer
├── components/
│   ├── icons/                       Inline-SVG-Icons (Icon.astro + icons.ts)
│   ├── forms/                       Felder und Upload-Widgets
│   ├── site/                        Header, Footer, Karte, Consent, Analytics, SEO-Landingpage
│   ├── home/ browse/ listing/ sell/ account/ legal/
├── data/             Supabase-Zugriff auf Inserate, Bilder und Zertifikate
├── lib/              SEO, Auth, Consent, Formatierung, Fehlermeldungen, Upload-Verhalten
├── middleware.ts     www→Apex-Redirect und Rate-Limit (nur für SSR-Routen)
└── styles/global.css Design-System (Tailwind v4 Theme)
```

### Rendering-Modus

Alle Seiten werden vorgerendert, ausser:

| Route                            | Grund                                                  |
| :------------------------------- | :----------------------------------------------------- |
| `/browse`                        | Inserate + Startfilter aus `?q=`, `?brand=`, …          |
| `/listings/[id]`                 | Inserat serverseitig laden, 404 für gelöschte Inserate  |
| `/account/listings/[id]/edit`    | Dynamische ID ohne bekannte Pfadliste                   |
| `/sitemap.xml`                   | Enthält alle aktuell freigegebenen Inserate             |

Die Startseite bleibt bewusst statisch: Die Inserate kommen aus einer Build-Zeit-Abfrage,
die Live-Zähler liefert ein `server:defer`-Island mit statischem Fallback nach.

### Client-JavaScript

| Seiten                              | JS     |
| :---------------------------------- | :----- |
| Statische Seiten (AGB, SEO, 404, …) | 2,5 kB |
| Konto, Inserat erstellen/bearbeiten | 225 kB (davon 224 kB Supabase-Client für Auth und Uploads) |

### Schrift und Analytics

- Die Oberfläche verwendet ausschliesslich die lokal ausgelieferte variable **DM Sans**.
  `src/styles/global.css` registriert den normalen Schriftschnitt für alle Gewichte mit
  `font-display: swap`; `Layout.astro` lädt genau diese Above-the-fold-Schrift vor. Der
  Hash im Dateinamen verhindert, dass eine später aktualisierte Schrift unter einem alten
  Browser-Cache weiterverwendet wird. Externe Google-Fonts-Stylesheets oder Preconnects sind
  nicht erforderlich.
- Der kursive Font wird aktuell nirgends verwendet und wird deshalb nicht ausgeliefert oder
  vorgeladen. Zusätzliche Schriftschnitte sollten nur ergänzt werden, wenn die Oberfläche sie
  tatsächlich nutzt.
- Google Analytics wird clientseitig erst nach `window.load` in einer Idle-Phase initialisiert.
  Die Measurement-ID kommt optional aus `VITE_GA_MEASUREMENT_ID`; ohne Override wird die
  produktive Standard-ID `G-7EYPB0J019` verwendet. Analytics respektiert die Auswahl aus dem
  Cookie-Banner, bricht eine noch ausstehende Initialisierung beim Opt-out ab und aktualisiert bei
  einer späteren Änderung den Consent-Status. Werbesignale und Ads-Speicherung bleiben deaktiviert.

Bei Änderungen an diesen Integrationen sollten `npm run astro -- check`, `npm run build` und
eine erneute Lighthouse-Messung auf dem bereitgestellten Preview ausgeführt werden.

## Umgebungsvariablen

Siehe `.env.example`. Die `VITE_*`-Namen aus dem bisherigen Deployment funktionieren weiter:
`astro.config.mjs` setzt `envPrefix: ['PUBLIC_', 'VITE_']`.

## Datenbank

Die Supabase-Migrationen liegen unter `supabase/migrations/`.
