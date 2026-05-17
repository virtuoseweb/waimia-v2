// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// Waimia · Astro 6 config · Static-first + API routes SSR via Vercel Functions
// - output: 'static' : 100 % SSG par défaut, fichiers CDN immuables (T1.1 activé 2026-05-17)
// - adapter: vercel() · Vercel Functions on-demand pour /api/* (prerender=false)
// - i18n: FR default at /, EN at /en/* — content-routed for proper SEO/GEO
// - Tailwind v4 CSS-first
// - Sitemap auto-generated with hreflang
//
// Note · Astro 6 dev server a un bug avec les `<script>` de composants servis
// via virtual paths Vite (`?astro&type=script&index=0&lang.ts` → 500). Notre
// Header.astro contourne via `<script is:inline>` (cf commentaire Header).
// En build/prod, ce comportement est identique : `is:inline` produit du JS
// embed dans le HTML statique (~3KB), pas de bundle supplémentaire mais pas de hop
// HTTP non plus. Trade-off net neutre pour ce cas.
export default defineConfig({
  site: 'https://waimia.com',
  // T1.1 activé 2026-05-17 — output static (95 % contenu evergreen → fichiers CDN immuables)
  // SSR opt-in via `export const prerender = false` sur les routes dynamiques.
  // Exceptions SSR justifiées (prerender=false) :
  //   · /api/healthcheck — healthcheck Vercel, données live (timestamp + sha)
  //   · /api/og.png     — génération OG image dynamique par titre/kicker (query params)
  // Toutes les autres pages déclarent explicitement `prerender = true` → SSG garanti.
  output: 'static',
  // ISR Vercel — conservé pour les futures routes SSR (prerender=false) non exclues.
  // En mode static, les pages SSG (prerender=true) sont déjà des fichiers CDN ; l'ISR
  // ne s'applique qu'aux routes prerender=false absentes de la liste exclude.
  // API routes actuelles : toutes dans exclude → toujours fresh, jamais cachées ISR.
  // cf /tmp/codex-missions/tier12-isr-perf/DONE.md pour le guide ISR complet (Tier 12).
  adapter: vercel({
    isr: {
      expiration: 3600, // TTL par défaut 1h pour les futures routes SSR cachables
      bypassToken: process.env.ISR_BYPASS_TOKEN, // secret Vercel env var (preview bypass)
      // API routes exclues de l'ISR : données live, webhooks, forms — toujours fresh
      exclude: ['/api/contact', '/api/newsletter', '/api/academy', '/api/devis', '/api/lead-magnet', '/api/healthcheck'],
    },
  }),
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
  // ssr.noExternal : force le bundling SSR pour les routes prerender=false (/api/*).
  // Resend + @react-email ont des exports ESM/CJS incompatibles sans bundling explicite ;
  // ce flag s'applique uniquement aux Vercel Functions générées (prerender=false),
  // pas aux pages SSG. Conservé pour les futures API routes qui consommeront Resend.
  // (validé empiriquement le 2026-04-27 via /api/healthcheck OK post-bascule monorepo)
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
    ssr: {
      noExternal: ['resend', '@react-email/components', '@react-email/render'],
    },
  },
});
