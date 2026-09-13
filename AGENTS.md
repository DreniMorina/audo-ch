# audo.ch Agent Notes

Keep this file lean. It exists to save tokens by summarizing the product, data model, and working assumptions for future agents.

## Product goal

Build a Swiss EV marketplace. Buyers browse and contact sellers without creating an account. Sellers authenticate, create listings, upload listing assets, and manage their own offers.

## Stack

- Astro with React islands / TypeScript frontend, deployed on Vercel.
- Supabase Auth for seller login via magic link / OTP email.
- Supabase Postgres for marketplace data.
- Supabase Storage for listing images and optional battery-certificate PDFs.

## Architecture

- `src/pages/**` are Astro routes: they own routing, the `<head>`, and where an island starts.
- `src/components/**` are React components carried over from the previous app. Astro renders
  them to plain HTML; only components a page mounts with a `client:*` directive ship JavaScript.
- Pages are prerendered by default. `export const prerender = false` marks the routes that
  genuinely depend on the request: `/listings/[id]`, `/browse`, `/account/listings/[id]/edit`
  and `/sitemap.xml`.
- `src/middleware.ts` holds the www-to-apex redirect and the per-IP rate limit. It runs for
  on-demand routes only — prerendered pages are served from the CDN and never reach it.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Roles

Application roles live in Supabase as `app_role`:

- `user`: default role for authenticated sellers; can create, edit, and delete their own listings and assets.
- `admin`: privileged operator role; can read/manage profiles and listings through RLS helper policies.

Marketplace personas:

- Buyer: anonymous visitor; no account required; can read approved listings and public listing assets.
- Seller: authenticated Supabase user; logs in by magic link; owns listings through `seller_user_id`.
- Admin: authenticated user with `profiles.role = 'admin'`.

Seller type is separate from auth roles and is stored per listing as `seller_type`:

- `Private`
- `Dealer`

## Listing states

Listing status is the `listing_status` enum:

- `approved`: visible publicly and used by browse/detail/sitemap queries.
- `pending`: legacy/review state retained in the enum, but current seller-created listings publish immediately.
- `rejected`: retained for moderation workflows.

Current behavior: new and updated seller listings are saved as `approved`. Public reads always filter to `approved`; owner account reads use `seller_user_id`.

## Data and access patterns

- Public marketplace pages should read only approved listings.
- Seller account pages should require a Supabase user and query by `seller_user_id`.
- Listing images are in the `listing-images` bucket under `{userId}/{listingId}/...`.
- Battery certificates are optional PDFs in the `listing-documents` bucket under `{userId}/{listingId}/...`.
- Keep RLS as the source of truth for ownership/admin access; do not rely only on client-side checks.

## Implementation notes

- Do not add buyer auth unless the product direction changes.
- Prefer small, direct changes and keep German UI copy consistently informal: address users with "du/dein" instead of formal "Sie/Ihr" in German product UI copy.
- Never put try/catch blocks around imports.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
