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
// Note · Astro 6 dev server a un bug avec les `<script>` de composants servis
// via virtual paths Vite (`?astro&type=script&index=0&lang.ts` → 500). Notre
// Header.astro contourne via `<script is:inline>` (cf commentaire Header).
// En build/prod, ce comportement est identique : `is:inline` produit du JS
// embed dans le HTML SSR (~3KB), pas de bundle supplémentaire mais pas de hop
// HTTP non plus. Trade-off net neutre pour ce cas.
export default defineConfig({
  site: 'https://waimia.com',
  // V2 2026-05-15 — Migration prévue server → static (T1.1 EXECUTION-TRACKER) :
  // ⚠️ Le passage à `output: 'static'` nécessite un restart dev complet
  // (HMR ne reload pas les routes statiques). À activer au prochain redémarrage.
  // 95 % du contenu est evergreen. SSG par défaut (`prerender = true`).
  // SSR opt-in via `export const prerender = false` sur API routes (/api/*).
  // ISR à activer page-par-page via Vercel adapter config (Tier 12).
  // TODO[T1.1-activate]: passer à 'static' au prochain restart dev/build Vercel.
  output: 'server',
  adapter: vercel(),
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  // Pattern redirections · single source of truth pour les renames d'URL.
  // Cf docs/11-url-redirects.md pour le workflow complet et les cas d'usage.
  // Ajoute ici toute redirection AVANT de renommer une URL en prod, sinon
  // Google perd le ranking de l'ancienne. Astro émet 308 par défaut (=301 SEO).
  redirects: {
    // Exemples (à dé-commenter si rename) :
    // '/ancienne-url': '/nouvelle-url',
    // '/old-blog-slug': { status: 301, destination: '/ressources/blog/new-slug' },
    // A4 cleanup 2026-05-10 · /ressources/cas/* → /cas/* (canonical) — doublon SEO supprimé
    '/ressources/cas': '/cas',
    '/ressources/cas/plateau': '/cas/plateau',
    '/ressources/cas/halcyon': '/cas/halcyon',
    '/ressources/cas/northbound': '/cas/northbound',
    '/ressources/cas/caserne': '/cas/caserne',
    '/ressources/cas/virtuoseos': { status: 301, destination: '/archive' },
    // W4 2026-05-15 · Tunnel site-web-ia : anciennes URLs → nouvelle architecture collection
    '/offres/site-web-ia-tunnel': '/offres/site-web-ia/tunnel/1',
    '/offres/site-web-ia-tunnel/mecanique': '/offres/site-web-ia/tunnel/2',
    '/offres/site-web-ia-tunnel/preuves': '/offres/site-web-ia/tunnel/3',
    '/offres/site-web-ia-tunnel/conversion': '/offres/site-web-ia/tunnel/4',
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en-US' } },
      // Filtre sitemap.xml :
      //  · /bienvenue/* : thank-you pages post-conversion (déjà noindex sur la page,
      //    pas de raison qu'elles soient crawlables/indexées)
      //  · /agence/design-system : showcase interne (déjà noindex)
      filter: (page) =>
        !page.includes('/bienvenue/') &&
        !page.includes('/agence/design-system'),
    }),
  ],
  // Cast `as any` parce que tailwindcss/vite et Astro embarquent leur propre
  // version de Vite — TS détecte un mismatch nominal mais runtime OK.
  //
  // ssr.noExternal : force le bundling SSR de packages spécifiques. Sans ça,
  // resend / @react-email/components ont des exports ESM/CJS qui plantaient
  // silencieusement le bundle Astro (404 sur toutes /api/* en prod post-bascule
  // monorepo, validé empiriquement le 2026-04-27 via /api/healthcheck OK).
  // En forçant noExternal, Vite inline ces deps dans entry.mjs proprement.
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
    ssr: {
      noExternal: ['resend', '@react-email/components', '@react-email/render'],
    },
  },
});
