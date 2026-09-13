// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://audo.ch',

  // Static by default. Only the pages that genuinely depend on the request opt out
  // via `export const prerender = false`: the listing detail page, /browse (its
  // filters come from the query string) and /sitemap.xml.
  adapter: vercel(),

  // `/sell` only ever redirected to the sell landing page.
  redirects: {
    '/sell': '/elektroauto-verkaufen-schweiz',
  },

  vite: {
    plugins: [tailwindcss()],
    // Astro exposes `PUBLIC_*` to the browser. The Supabase and GA variables are
    // named `VITE_*` in the existing deployment, so keep that prefix working too
    // instead of forcing every environment to be renamed.
    envPrefix: ['PUBLIC_', 'VITE_'],
  },
});
