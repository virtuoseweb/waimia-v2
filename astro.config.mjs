// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// Waimia · Astro 6 config · SSR pour API routes Resend
// - output: 'server' : tout SSR par défaut, sera caché edge par Vercel
// - adapter: vercel() · Vercel Functions on-demand pour /api/*
// - i18n: FR default at /, EN at /en/* — content-routed for proper SEO/GEO
// - Tailwind v4 CSS-first
// - Sitemap auto-generated with hreflang
//
// Note · Playwright utilise `pnpm build && pnpm preview` (vs `pnpm dev`) parce
// que le dev server Astro 6 + adapter Vercel a un bug qui empêche le chargement
// des modules `astro:scripts/before-hydration.js` (500 error). Le preview server
// utilise le build statique, fidèle à la prod.
export default defineConfig({
  site: 'https://waimia.com',
  output: 'server',
  adapter: vercel(),
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en-US' } },
    }),
  ],
  // Cast `as any` parce que tailwindcss/vite et Astro embarquent leur propre
  // version de Vite — TS détecte un mismatch nominal mais runtime OK.
  vite: { plugins: [/** @type {any} */ (tailwindcss())] },
});
