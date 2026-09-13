# audo.ch

Der Schweizer Marktplatz für Elektroautos — Astro-Frontend mit React-Islands, Supabase als Backend.

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

Astro übernimmt Routing, `<head>` und Server-Rendering; die UI-Komponenten sind React und
werden standardmässig zu statischem HTML gerendert. Nur Komponenten, die eine Seite mit einer
`client:*`-Direktive einbindet, laden JavaScript im Browser.

```
src/
├── pages/            Astro-Routen: URL, SEO-Head, Island-Grenzen
│   ├── listings/[id].astro          SSR – lädt das Inserat serverseitig (SEO, echte 404)
│   ├── browse.astro                 SSR – Filter kommen aus der Query-String
│   ├── account/                     Konto & Inserat bearbeiten
│   └── sitemap.xml.ts               SSR – statische Seiten + alle freigegebenen Inserate
├── layouts/Layout.astro             HTML-Shell, Meta-Tags, Canonical, JSON-LD, Header/Footer
├── components/       React-Komponenten (site, home, browse, listing, sell, account, legal)
├── data/             Supabase-Zugriff auf Inserate, Bilder und Zertifikate
├── hooks/            Supabase-Session, Login-Link-Cooldown, Cookie-Consent
├── integrations/     Supabase-Client
├── lib/              SEO, Formatierung, Fehlermeldungen, Google Analytics
├── middleware.ts     www→Apex-Redirect und Rate-Limit (nur für SSR-Routen)
└── styles/global.css Design-System (Tailwind v4 Theme)
```

### Rendering-Modus

Alle Seiten werden vorgerendert, ausser:

| Route                            | Grund                                              |
| :------------------------------- | :------------------------------------------------- |
| `/listings/[id]`                 | Inserat serverseitig laden, 404 für gelöschte Inserate |
| `/browse`                        | Startfilter kommen aus `?q=`, `?brand=`, …          |
| `/account/listings/[id]/edit`    | Dynamische ID ohne bekannte Pfadliste               |
| `/sitemap.xml`                   | Enthält alle aktuell freigegebenen Inserate         |

## Umgebungsvariablen

Siehe `.env.example`. Die `VITE_*`-Namen aus dem bisherigen Deployment funktionieren weiter:
`astro.config.mjs` setzt `envPrefix: ['PUBLIC_', 'VITE_']`.

## Datenbank

Die Supabase-Migrationen liegen unter `supabase/migrations/`.
