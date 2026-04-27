# 01 · Architecture

## Stack

| Couche         | Choix                                        | Raison                                                                    |
|----------------|----------------------------------------------|---------------------------------------------------------------------------|
| Framework      | **Astro 6**                                  | SSG par défaut, contenu rendu côté serveur → SEO/GEO/AIO optimal.         |
| UI islands     | **React 19** (hydratation à la demande)      | Pour les composants motion (KineticHeadline, MegaMenu, ProductReel).      |
| Styling        | **Tailwind v4** CSS-first (`@theme`)         | Tokens DS exposés sans dupliquer ; classes legacy préservées.             |
| Contenu        | **Astro content collections** + **MDX**      | Type-safe via Zod schemas, supporte composants React dans le markdown.    |
| CMS git-based  | **Pages CMS** (pagescms.org)                 | Branch-aware, GitHub OAuth, config YAML simple, état de l'art 2026.       |
| i18n           | **Astro i18n natif** (`/` FR · `/en/*`)      | URLs propres, hreflang automatique, meilleur que un toggle DOM.           |
| Hébergement    | **Vercel** (adapter `@astrojs/vercel`)       | Edge cache + ISR si besoin, preview deployments, bon support Astro.       |

## Arborescence cible

```
waimia-site/
├── docs/                          ← cette doc, lue par Claude/Codex
├── handoff/                       ← réf. handoff Claude Design (read-only)
└── site/                          ← le repo Astro
    ├── public/
    │   ├── admin/                 ← Pages CMS / Decap admin (config.yml)
    │   ├── llms.txt               ← GEO/AIO · résumé pour LLM crawlers
    │   ├── robots.txt
    │   └── fonts/                 ← optionnel, fonts self-hosted
    ├── src/
    │   ├── styles/
    │   │   ├── tokens.css         ← @theme DS tokens (Tailwind v4)
    │   │   └── global.css         ← classes legacy portées du handoff
    │   ├── data/
    │   │   ├── sitemap.ts         ← portage de sitemap-data.jsx (typed)
    │   │   └── home-content.ts    ← contenu home (metrics, pyramid, etc.)
    │   ├── lib/
    │   │   ├── i18n.ts            ← helpers Bi(), useLang()
    │   │   └── seo.ts             ← builders JSON-LD
    │   ├── components/
    │   │   ├── header/
    │   │   │   ├── Header.astro
    │   │   │   ├── MegaMenu.tsx   ← React island (hover state)
    │   │   │   └── MobileSheet.tsx
    │   │   ├── footer/Footer.astro
    │   │   ├── motion/            ← React islands client:visible
    │   │   │   ├── KineticHeadline.tsx
    │   │   │   ├── BootSplash.tsx
    │   │   │   ├── Reveal.tsx
    │   │   │   └── StickyPin.tsx
    │   │   ├── seo/
    │   │   │   ├── JsonLd.astro   ← Organization/Service/FAQ/Article
    │   │   │   └── FAQ.astro      ← bloc FAQ visible (GEO-ready)
    │   │   ├── sections/          ← sections homepage v1
    │   │   │   ├── Hero.astro
    │   │   │   ├── TrustMarquee.astro
    │   │   │   ├── Silence.astro
    │   │   │   ├── Thesis.astro
    │   │   │   ├── Pyramid.astro
    │   │   │   ├── Departments.astro
    │   │   │   ├── HowWeShip.astro
    │   │   │   ├── Cases.astro
    │   │   │   ├── FieldNotes.astro
    │   │   │   ├── Offices.astro
    │   │   │   ├── CtaBand.astro
    │   │   │   └── SigBand.astro
    │   │   └── ui/                ← Button.astro, Bi.astro, ChapterLabel.astro
    │   ├── content/
    │   │   ├── config.ts          ← Zod schemas par collection
    │   │   ├── cases/*.mdx        ← études de cas
    │   │   ├── blog/*.mdx
    │   │   ├── field-notes/*.mdx
    │   │   ├── offres/*.mdx
    │   │   ├── solutions/*.mdx
    │   │   └── technologies/*.mdx
    │   ├── layouts/
    │   │   └── Base.astro         ← layout principal (head, header, footer)
    │   └── pages/
    │       ├── index.astro        ← homepage FR
    │       ├── en/index.astro     ← homepage EN
    │       ├── offres/[...slug].astro
    │       ├── solutions/[...slug].astro
    │       ├── technologies/[...slug].astro
    │       ├── ressources/blog/[...slug].astro
    │       └── ressources/cas/[...slug].astro
    ├── astro.config.mjs
    ├── tailwind.config.* (n/a en CSS-first v4)
    └── tsconfig.json
```

## Décisions clés

### 1. Sitemap data en TypeScript, pas en JSX

Le handoff a `sitemap-data.jsx` qui mute `window`. On porte vers `src/data/sitemap.ts`
exports typés. Plus de DX, type-safety dans les composants Astro.

### 2. Bilingue par routes

Chaque page existe en `/page` (FR) et `/en/page` (EN). Le composant `<Bi en="" fr="" />` reste utile pour les **inserts** mais la page principale est une route séparée. Mieux pour SEO/GEO car chaque langue a un URL canonique distinct.

### 3. Hydration progressive

- Header `client:load` (mega-menu interactif au mount)
- KineticHeadline `client:visible` (charge quand le hero entre dans le viewport)
- BootSplash `client:only="react"` (pas de SSR pour éviter flash)
- Sections statiques restent en pur Astro (zéro JS livré)

### 4. CMS · Pages CMS

Config dans `.pages.yml` à la racine du repo. Permet à Simon (ou un éditeur) d'ajouter
une étude de cas, un article de blog, un témoignage via UI sans toucher au code.
Authentification GitHub OAuth, branche `main` ou PR auto.

Alternative documentée : Decap CMS (legacy) si Pages CMS n'est pas dispo.

### 5. Build & déploiement

- `pnpm build` → SSG complet, output statique sauf API routes futures.
- Vercel preview à chaque PR.
- Production = `main` → `waimia.com`.
- ISR pas nécessaire au démarrage (contenu peu fréquent), à activer si on rajoute du dynamique.
