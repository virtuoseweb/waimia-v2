// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// Waimia · Astro 6 config · SSR hybrid pour API routes Resend
// - output: 'server' avec prerender:true en défaut → toutes les pages sont SSG
//   sauf opt-in `export const prerender = false` (API routes, /api/*)
// - i18n: FR default at /, EN at /en/* — content-routed for proper SEO/GEO
// - Tailwind v4 CSS-first (tokens declared in src/styles/tokens.css via @theme)
// - Sitemap auto-generated with hreflang
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
