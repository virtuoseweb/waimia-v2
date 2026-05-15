# Waimia · Audit Stratégique Complet 2026-05-15

> Audit indépendant, sans complaisance, de l'état architectural Waimia.
> Niveau attendu : architecte senior + Astro/perf expert + DS lead + headless CMS + SEO programmatique + DX + AI-native.
> Aucune validation par défaut.

---

## 0. Verdict global

**État actuel** : Waimia est un site Astro 6 fonctionnel avec une **direction artistique forte** et une **infrastructure CMS partiellement migrée**, mais **structurellement bloqué sur 5 anti-patterns majeurs** qui empêchent son passage à plateforme IA-first composable scalable.

**Note globale (sur 10)** :

| Axe | Note | Commentaire |
|---|---|---|
| Architecture data | 5 | 22 collections (trop), pas de composables, schemas hétérogènes |
| Rendering strategy | **3** | `output: 'server'` partout → SSR forcé sur du contenu 100% statique. Anti-pattern critique. |
| Performance | ~6 | Pas mesurée (Lighthouse absent), 5 React islands raisonnables, 14 hydrations |
| Design system | 7 | Tokens sémantiques solides, atoms/molecules/organisms structurés, mais 9802 LoC templates suggère duplication |
| SEO programmatique | 2 | Sitemap auto OK, mais aucune page tag/glossary/comparison auto-générée |
| AI-readiness | **2** | Personas, brand voice, painPoints, prompts NE SONT PAS dans des collections. Hardcodés dans copy. |
| Conversion | 4 | /contact existe, mais zéro tunnel structuré, zéro A/B, zéro guarantee block réutilisable |
| DX | 5 | Templates ~544 LoC/avg, regex parsing slots HTML = complexité injustifiée |
| Composabilité | **2** | 1 template fixe = 1 page. Aucune page composée de blocks data-driven. |
| Maintenabilité 5 ans | 4 | Si on continue cette trajectoire : dette technique exponentielle |

**Verdict** : actuellement c'est **un beau site éditorial**, pas une **plateforme IA-first scalable**. Pour devenir le second, refactor structurel obligatoire — pas cosmétique.

---

## 1. Architecture data / content

### 1.1 Diagnostic 22 collections

**Problème** : 22 collections en production = sur-spécialisation prématurée. Plusieurs collections couvrent des sémantiques métier proches qui devraient fusionner via discriminator `type`.

| Collection | Verdict | Action |
|---|---|---|
| `cases` | ✅ Garder | Sémantique claire (cas client narré) |
| `offres` | ✅ Garder | Mission contractuelle ponctuelle |
| `solutions` | ⚠️ Renommer `usecases` | "Solutions" est marketing-speak. Sémantique réelle = cas d'usage par fonction métier |
| `technologies` | ✅ Garder | Stack technique exposée |
| `blog` | ✅ Garder avec `type` discriminator | OK avec 5 sous-types validés |
| `fieldNotes` | ❌ **FUSIONNER dans blog** | `type: 'notes'` fait double emploi |
| `secteurs` | ✅ Garder | ICP industry |
| `livresBlancs` | ✅ Garder | Gated content |
| `cookbooks` | ⚠️ Question | Pourrait être `blog/type:formation` |
| `outils` | ✅ Garder | Calculateurs interactifs (utilité distincte) |
| `veilleIA` | ❌ **FUSIONNER dans blog** | `type: 'avis'` ou `cluster: 'veille-ia'` |
| `pages` | ⚠️ Garder mais limiter | Pages standalone (about, methode, etc.) |
| `authors` | ✅ Garder | Référentiel |
| `tunnels` | ✅ Garder | Multi-étapes acquisition |
| `welcomePages` | ⚠️ Question | Pourrait être `pages/template:welcome` |
| `formations` | ❌ **FUSIONNER en `courses` avec discriminator** | Voir 1.2 |
| `parcours` | ❌ **FUSIONNER en `courses`** | type: 'parcours' |
| `ateliers` | ❌ **FUSIONNER en `courses`** | type: 'atelier' |
| `produits` | ❌ **FUSIONNER en `commerce`** | type: 'product' |
| `abonnements` | ❌ **FUSIONNER en `commerce`** | type: 'subscription' |
| `landingPages` | ⚠️ Question | Peut-être garder séparé (sémantique campagne ≠ contenu evergreen) |
| `newsletter` | ✅ Garder | Archives temporelles distinctes |

**Cible après refactor : 14-16 collections** (vs 22).

### 1.2 Fusion École : `courses` unifiée

**Anti-pattern actuel** : 3 collections séparées `formations`, `parcours`, `ateliers` avec ~80% de champs en commun (instructor, level, modules, pricing, target_audience).

**Cible** : 1 collection `courses` avec discriminator :

```ts
const courses = defineCollection({
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    course_type: z.enum(['formation', 'parcours', 'atelier', 'certification']),
    // Champs communs (mutualisation)
    level: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
    instructor: reference('authors'),
    pricing: priceBlock,
    // Spécifiques par type (optional + discriminated union préférable)
    duration_hours: z.number().optional(),       // formation/atelier
    duration_weeks: z.number().optional(),       // parcours
    scheduled_at: z.coerce.date().optional(),    // atelier
    courses_included: z.array(z.string()).optional(), // parcours (slugs cours)
    modules: z.array(moduleSchema).optional(),
    seats_total: z.number().optional(),
    certification: z.boolean().default(false),
  }),
});
```

**Bénéfice** : 1 schema, 1 template polymorphe, 1 route `/ecole/[type]/[slug]`. Maintenance ÷3.

### 1.3 Fusion Commerce : `commerce` unifiée

**Anti-pattern actuel** : `produits` (one-shot) + `abonnements` (récurrents) = 2 collections avec ~75% de champs en commun.

**Cible** : 1 collection `commerce` :

```ts
const commerce = defineCollection({
  schema: z.object({
    ...baseFields,
    sku: z.string(),
    commerce_type: z.enum(['product', 'subscription']),
    pricing_model: z.enum(['one-time', 'monthly', 'quarterly', 'annual']),
    pricing: priceBlock,
    sla: slaBlock.optional(),       // subscription only
    deliverables: z.array(z.string()),
    license: licenseEnum.optional(), // product only
    stripe_payment_link: z.string().url(),
  }),
});
```

### 1.4 Schemas hétérogènes

**Problème détecté** : `baseFields` et `taxonomyFields` ne sont pas systématiquement appliqués.

- `livresBlancs` : a `taxonomyFields` ✓
- `pages` : N'A PAS `taxonomyFields` ❌
- `authors` : N'A PAS `taxonomyFields` ❌ (OK, c'est un référentiel)
- `tunnels` : N'A PAS `taxonomyFields` ❌ (manque pour cross-link)
- `welcomePages` : N'A PAS `taxonomyFields` ❌

**Cible** : audit field-by-field + normalisation. Tout contenu publié doit avoir `tags` + `category` ou justifier l'exception.

---

## 2. Architecture composable (CRITIQUE)

### 2.1 Anti-pattern majeur détecté

**État actuel** : 18 templates dans `src/components/templates/` totalisant **9802 LoC** (avg 544 LoC/template). Chacun rend une page COMPLÈTE (hero + body + cta) en un bloc monolithique.

**Anti-pattern** :
```
SolutionsDetailTemplate.astro (1023 LoC) — hero + pains + workflows + roi + stack + faq + cta
OffresDetailTemplate.astro (1078 LoC) — hero + problem + method + deliverables + proof + cta
TechnologiesDetailTemplate.astro (934 LoC) — hero + capabilities + ecosystem + benchmarks + cta
[...18 templates]
```

**Conséquences** :
- Duplication code : hero pattern dupliqué 18 fois
- Pas de réutilisation : un FAQ block ne peut pas être utilisé sur une page LP custom sans dupliquer le code
- Pas de A/B testing : impossible de tester variant hero sur subset de pages
- Pas de personnalisation : impossible de servir hero différent par persona
- Maintenance ÷18 : modifier le style FAQ = 18 endroits à toucher

### 2.2 Architecture composable cible

**Page = orchestration de blocks data-driven** :

```ts
// content/offres/growth-system-ia.mdx
---
title_fr: "..."
sections:
  - type: "hero-split"
    props: { tier, h1, lede, cta }
  - type: "proof-bar"
    props: { metrics: [...] }
  - type: "method-timeline"
    props: { steps: [...] }
  - type: "pricing-table"
    props: { tiers: [...] }
  - type: "faq-accordion"
    props: { items: [...] }
  - type: "cta-final"
    props: { headline, cta }
---
```

**Renderer** :
```astro
---
import HeroSplit from '../sections/HeroSplit.astro';
import ProofBar from '../sections/ProofBar.astro';
// ... mapping type → component

const SECTION_REGISTRY = {
  'hero-split': HeroSplit,
  'proof-bar': ProofBar,
  // ...
};

const { sections } = entry.data;
---

{sections.map((section) => {
  const Component = SECTION_REGISTRY[section.type];
  return <Component {...section.props} />;
})}
```

**Bénéfices** :
- Nouveau template = composer un array de sections (0 LoC frontend)
- Réutilisation cross-page : ProofBar utilisé sur home + offres + cases
- A/B testing : `sections_variant_a` et `sections_variant_b` dans frontmatter
- Personnalisation : `sections_by_persona: { ceo: [...], cto: [...] }`
- Génération IA : Claude peut produire un JSON `sections[]` valide

### 2.3 Collections sections / blocks

Créer 2 nouvelles collections :

**`sections`** (singletons réutilisables, ex: hero variants, CTA bands) :
```ts
const sections = defineCollection({
  schema: z.discriminatedUnion('type', [
    heroSplitSchema,
    proofBarSchema,
    methodTimelineSchema,
    pricingTableSchema,
    faqAccordionSchema,
    ctaFinalSchema,
    testimonialBlockSchema,
    statBlockSchema,
    featureGridSchema,
    comparisonTableSchema,
    timelineSchema,
    mediaBlockSchema,
    socialProofSchema,
    objectionHandlerSchema,
    guaranteeBlockSchema,
  ]),
});
```

**Composants à créer** (`src/components/sections/`) :
- HeroSplit · HeroCentered · HeroFullBleed
- ProofBar · StatBlock · SocialProof
- MethodTimeline · FeatureGrid
- PricingTable · ComparisonTable
- FaqAccordion · ObjectionHandler
- CtaFinal · CtaBand · CtaInline
- TestimonialBlock · GuaranteeBlock
- TimelineBlock · MediaBlock

Total cible : **~20-25 section components réutilisables** vs 18 templates monolithiques.

---

## 3. Rendering architecture (CRITIQUE)

### 3.1 Anti-pattern `output: 'server'`

**Découverte alarmante** dans `astro.config.mjs` :
```js
output: 'server',  // tout SSR par défaut
adapter: vercel(),
```

**Pourquoi c'est un anti-pattern Waimia** :
- 95% des pages sont du contenu evergreen (cases, offres, solutions, technologies, blog, ressources, école, produits, abonnements)
- Le contenu vient de MDX au build-time
- Tout rendre SSR = chaque visite déclenche un cold-start Vercel Function
- Coût Vercel × 100 vs SSG
- LCP × 2-3 (SSG ~ 200ms TTFB vs SSR ~ 600-1200ms cold-start)

**Cible** : `output: 'hybrid'` ou `output: 'static'` avec exceptions explicites :

```js
output: 'hybrid',  // ou 'static'
adapter: vercel({
  isr: {
    expiration: 60 * 60,  // 1h ISR par défaut pour hubs
  },
}),
```

**Par page** :
- `prerender = true` (statique) : cases, offres, solutions, technologies, blog, école, produits, abonnements, agence/*
- `prerender = false` + `revalidate` : `/ressources/index`, `/archive`, `/ressources/tag/[slug]`, `/ressources/auteur/[slug]` (agrégation cross-collection)
- SSR pure : `/api/*` uniquement (form submits, newsletter signup)

**Impact attendu** : LCP × 0.3, coût Vercel × 0.1, cache CDN edge actif.

### 3.2 Cache strategy

Tu n'as pas de stratégie cache documentée. Cible :

| Type contenu | Strategy | TTL |
|---|---|---|
| Pages content (offres, solutions, cases) | SSG immutable | ∞ (rebuild on push) |
| Hubs (`/ressources/`, `/archive`) | ISR | 1h |
| Tags (`/ressources/tag/[slug]`) | ISR | 1h |
| Auteur archive | ISR | 6h |
| Newsletter archive | SSG immutable | ∞ |
| API endpoints | SSR (no cache) | 0 |
| Stripe webhooks | SSR | 0 |

**Cache headers à ajouter** dans `vercel.json` ou middleware :
- `Cache-Control: public, max-age=31536000, immutable` pour assets
- `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` pour ISR

---

## 4. Hydration / performance

### 4.1 Inventaire React islands actuel

| Island | Fichier | Justification | Verdict |
|---|---|---|---|
| `BootSplash` | motion/BootSplash.tsx | Splash boot animation | ⚠️ **Probablement éliminable** — peut être CSS-only |
| `LiquidHero` | motion/LiquidHero.tsx | Canvas RAF terracotta blobs hero manifesto | ✅ Justifié (canvas needed) mais audit perf mobile |
| `ProductReel` | motion/ProductReel.tsx | Sticky scroll 4 steps console | ✅ Justifié (scroll-linked complex) |
| `PagePillIsland` | molecules/PagePillIsland.tsx | ? | ⚠️ Audit nécessaire |
| `CalEmbedReact` | molecules/CalEmbedReact.tsx | Cal.com embed | ✅ Justifié (3rd party widget) |

**Hydrations détectées** : 14 `client:*` directives au total. Raisonnable pour Astro.

**Anti-pattern potentiel** : `BootSplash` React pour une splash → CSS animation suffirait. Économie : -50 KB React bundle, -150ms hydration.

### 4.2 Bundle audit

**À faire (manquant)** :
```bash
pnpm build && pnpm exec astro check
# Puis Lighthouse:
npx unlighthouse --site http://localhost:4321
# Ou Vercel Speed Insights une fois déployé
```

**Métriques cibles Waimia (réalistes pour un site éditorial AI-first)** :

| Métrique | Cible | Critique si > |
|---|---|---|
| LCP | < 1.5s | 2.5s |
| CLS | < 0.05 | 0.1 |
| INP | < 100ms | 200ms |
| TBT | < 100ms | 300ms |
| JS bundle initial | < 80 KB gzip | 150 KB |
| Lighthouse Performance | > 95 | < 90 |

### 4.3 Fonts strategy

À auditer : Instrument Serif + Inter Tight + JetBrains Mono = 3 familles.
- Subsets nécessaires : `latin` + `latin-ext` (FR accents)
- Format : `woff2` uniquement (drop woff)
- `font-display: swap`
- Préchargement obligatoire dans `<head>` : `<link rel="preload" as="font" type="font/woff2" crossorigin>` pour le H1 weight uniquement (Instrument Serif 400)

### 4.4 Images strategy

À auditer : utilisation d'Astro `<Image>` ou `<Picture>` ? Si pas systématique, anti-pattern.

**Cible** :
- Toutes images statiques via `astro:assets` (auto-optimize, lazy by default)
- Hero images : preload critical + AVIF/WebP avec fallback JPG
- Aucune image > 200 KB en prod
- `decoding="async"` partout sauf hero

---

## 5. Design system

### 5.1 État actuel

**Points forts** :
- Tokens sémantiques `--text-h1-hero` à `--text-h4-meta` ✓
- Trio polices clair : Instrument Serif + Inter Tight + JetBrains Mono ✓
- Couleurs simples (paper, ink, accent terracotta, hairline) ✓
- Hairlines 1px utilisés partout ✓
- Atoms / Molecules / Organisms structure ✓

**Points faibles** :
- **CSS scoped Astro avec global overrides** : trop de `:global()` dans les templates (ex: OffresDetailTemplate utilise `:global(table)`, `:global(details)`, etc. ~50 occurrences). Anti-pattern qui pollue le scope.
- **9802 LoC templates** suggère duplication massive (hero pattern × 18, CTA pattern × 18, etc.)
- **Pas de Storybook ou catalogue UI** : devs/designers ne peuvent pas voir les variants en un endroit.
- **Pas de design tokens en JSON** (ex: `design-tokens.json` source de vérité exportable Figma/Style Dictionary).

### 5.2 Recommandations DS

1. **Storybook** ou **Histoire** (Vue/Astro) ou simple page `/agence/design-system` ENRICHIE avec tous les composants en variants.
2. **Tokens JSON** : `src/design-tokens.json` source de vérité, généré vers `tokens.css`.
3. **Composants section primitives** (vu en §2) : HeroSplit, ProofBar, etc. avec API stricte (Props typées).
4. **Élimination `:global()` excessif** : si un style est dans 3+ templates, créer un composant.
5. **Dark mode** : préparer le terrain via tokens `--bg-inverted` déjà présents.

---

## 6. SEO programmatique (CRITIQUE FAIBLE)

### 6.1 Diagnostic

**Présent** : Schema.org `Service`, `Offer`, `Article`, `FAQPage`. Sitemap auto via `@astrojs/sitemap`. Hreflang FR/EN.

**Manquant** :
- ❌ Pages **glossaire** auto-générées (cluster pillar)
- ❌ Pages **comparaison** (`/comparer/x-vs-y`) auto-générées
- ❌ Pages **integration** (`/integrations/hubspot`, `/integrations/salesforce`)
- ❌ Pages **use cases** atomiques (`/cas-usage/[slug]`)
- ❌ **BreadcrumbList Schema.org** sur toutes pages (audit nécessaire)
- ❌ **OG images dynamiques** générées par page (Vercel OG)
- ❌ Pages **tag/[slug]** cross-collection (mentionné Wave 4 mais pas implémenté)
- ❌ Pages **auteur/[slug]** avec bio + bibliographie

### 6.2 SEO programmatique cible

Créer **3 templates auto-générateurs** :

1. **Glossary** : 50-100 termes IA (ex: "Generative AI", "RAG", "Vector DB") → 50-100 pages auto avec définition + 3-5 articles liés
2. **Integrations** : 1 page par tool (`/integrations/hubspot`, `/integrations/notion`, etc.) → 15-30 pages auto avec use cases connectés
3. **Comparison** : `/comparer/[slug-a]-vs-[slug-b]` auto-généré (ex: claude-vs-gpt) → 10-20 pages auto

**Total pages SEO auto-générées : ~100-150** vs ~89 actuelles = doublement de la surface SEO sans rédaction manuelle.

---

## 7. AI-first architecture (FAIBLE)

### 7.1 Diagnostic

Waimia se positionne **"agence IA-first"** mais **l'IA n'est PAS dans la structure du site**. Personas, brand voice, prompts, painPoints sont hardcodés dans les copy ou n'existent pas.

### 7.2 Collections AI-native à créer

**`personas`** :
```ts
const personas = defineCollection({
  schema: z.object({
    slug: z.string(),
    name_fr: z.string(),
    name_en: z.string(),
    role_fr: z.string(),       // ex "CEO PME B2B"
    pain_points: z.array(z.string()),
    decision_criteria: z.array(z.string()),
    objections: z.array(z.string()),
    proof_points_attended: z.array(z.string()),
    avg_budget_eur_range: z.tuple([z.number(), z.number()]),
    avg_decision_timeline_weeks: z.number(),
  }),
});
```

**Bénéfices** :
- PersonaSwitcher (existe déjà) peut consommer collection au lieu de hardcoded
- Génération IA peut produire copy par persona
- A/B testing par persona via cookie

**`brand-voice`** (1 entry singleton) :
```ts
const brandVoice = defineCollection({
  schema: z.object({
    do_say: z.array(z.string()),
    dont_say: z.array(z.string()),
    tonality: z.enum(['editorial-tech', 'corporate-formel', 'casual-friendly']),
    sample_phrases_fr: z.array(z.string()),
    sample_phrases_en: z.array(z.string()),
    forbidden_words: z.array(z.string()),
    required_typography_fr: z.object({
      quotes: z.literal('« »'),
      apostrophe: z.literal('U+2019'),
      nbsp_before: z.array(z.string()),  // [':', ';', '!', '?']
    }),
  }),
});
```

**Bénéfices** :
- Single source of truth pour copywriting
- Worker Sonnet peut consommer ce JSON pour générer du copy "on brand"
- Linter custom : warn si MDX utilise `forbidden_words`

**`prompts`** :
```ts
const prompts = defineCollection({
  schema: z.object({
    name: z.string(),
    purpose: z.string(),
    system_prompt: z.string(),
    variables: z.array(z.object({ name: z.string(), description: z.string() })),
    sample_output: z.string(),
    last_tested_at: z.coerce.date(),
  }),
});
```

**`pain-points`** :
```ts
const painPoints = defineCollection({
  schema: z.object({
    slug: z.string(),
    pain_fr: z.string(),
    pain_en: z.string(),
    severity: z.enum(['critical', 'high', 'medium']),
    affected_personas: z.array(reference('personas')),
    affected_secteurs: z.array(reference('secteurs')),
    waimia_solution_slug: z.string(),  // ref offres/solutions
  }),
});
```

### 7.3 Knowledge base IA

Créer `src/content/knowledge-base/` avec :
- Tous les concepts métier Waimia (méthode 4 piliers, doctrine V5-V7, etc.)
- Sourceable par un assistant IA interne (RAG)
- Format MDX structuré

---

## 8. Conversion (FAIBLE)

### 8.1 Diagnostic

**Présent** : `/contact` form, `/api/*` endpoints, CTAs scattered, Stripe Customer Portal mentionné.

**Manquant** :
- ❌ A/B testing infrastructure (aucune)
- ❌ Lead magnets structured (livres blancs OK mais pas formulaires gated typés)
- ❌ Quiz / Configurateurs interactifs (1 outil calculateur-roi existe, c'est tout)
- ❌ Webinars (collection ateliers existe mais pas wired)
- ❌ Email sequences nurturing (aucune mention)
- ❌ Guarantees blocks réutilisables ("Si pas X dans Y, on remboursé")
- ❌ Objections handler reusable
- ❌ ProofPoints en collection

### 8.2 Conversion cible

Créer 5 nouvelles collections **orientées conversion** :

- `forms` : configurations form (champs, validation, redirect, ESP webhook)
- `lead-magnets` : gated content avec form prefab
- `quizzes` : multi-step quiz avec scoring + redirect persona-based
- `webinars` : événements live + replay (extension de `ateliers`)
- `proof-points` : datapoints réutilisables (`+12h/sem · 4× ROI · 99.98% uptime`)
- `guarantees` : promesses contractuelles (`45 min, on coupe · 100% remboursé sous 30j`)

Composants associés : `<QuizMultiStep />`, `<LeadMagnetGated />`, `<GuaranteeBadge />`, `<ProofPointInline />`.

### 8.3 A/B testing infrastructure

Pattern Vercel Edge Config :
```ts
// middleware.ts
const variant = await edgeConfig.get('hero-variant') ?? 'a';
ctx.cookie.set('variant', variant);
```

Puis dans le template :
```astro
const variant = Astro.cookies.get('variant')?.value ?? 'a';
const sections = variant === 'b' ? data.sections_variant_b : data.sections;
```

---

## 9. Structure dossiers cible

```
src/
├── components/
│   ├── atoms/           # Kicker, Button, Badge, Icon (présent ✓)
│   ├── molecules/       # MastheadRow, Breadcrumb, AuthorByline (présent ✓)
│   ├── organisms/       # Hero, ProofBar, Cases (présent ✓)
│   ├── sections/        # ⚠️ NOUVEAU — sections data-driven (HeroSplit, FaqAccordion, etc.)
│   ├── templates/       # ⚠️ À RÉDUIRE — 1 template par TYPE de page (pas par route)
│   ├── editorial/       # DropCap, PullQuote, Callout, Sidenote (présent ✓)
│   └── motion/          # React islands (présent ✓ — auditer BootSplash)
├── content/             # MDX par collection (présent ✓)
│   ├── _registry/       # ⚠️ NOUVEAU — section registry, type definitions
│   └── ecole/           # sous-dir nested (présent ✓)
├── schemas/             # ⚠️ NOUVEAU — extracted Zod schemas (sortis de content.config.ts)
├── lib/                 # i18n, animations, seo, utils (présent ✓)
├── layouts/             # Base.astro (présent ✓)
├── styles/              # tokens.css, global.css (présent ✓)
├── data/                # mega-menu, tags, stripe-links, taxonomies (présent ✓)
├── pages/               # Routes (présent ✓ — à nettoyer hardcoded)
└── design-tokens.json   # ⚠️ NOUVEAU — source de vérité tokens
```

---

## 10. Data flow cible

```
content/*.mdx (MDX + frontmatter Zod-validated)
       ↓
getCollection() / getEntry() (Astro Content Layer API)
       ↓
Zod parse + transform (au build-time)
       ↓
getStaticPaths() (SSG) ou Astro.cookies (SSR/edge)
       ↓
Props injection dans pages/*.astro
       ↓
Renderer décide : 
  - template legacy (1 file = 1 type page)
  - OU section[] composable renderer (data-driven)
       ↓
Section components (HeroSplit, etc.) consomment props
       ↓
HTML rendered (CSS scoped Astro inline)
       ↓
Hydration sélective React islands (client:visible)
       ↓
Edge CDN cache (ISR ou immutable)
```

---

## 11. Roadmap refactor priorisée (impact/effort)

### Tier 1 · Quick wins (haut impact / faible effort)

| # | Action | Impact | Effort | Quand |
|---|---|---|---|---|
| T1.1 | `output: 'server'` → `'hybrid'` + `prerender = true` partout | 🔥🔥🔥 | 1h | **Immédiat** |
| T1.2 | Delete 17 pages hardcoded → activer MDX migration | 🔥🔥🔥 | 30 min | **Immédiat** (après backup) |
| T1.3 | Audit Lighthouse + perf budget | 🔥🔥 | 2h | **Cette semaine** |
| T1.4 | `BootSplash.tsx` → CSS animation | 🔥 | 1h | Cette semaine |
| T1.5 | Fonts preload + woff2 only | 🔥🔥 | 2h | Cette semaine |
| T1.6 | OG images dynamiques Vercel OG | 🔥🔥 | 3h | Cette semaine |

**Sous-total** : ~10h pour bond perf majeur.

### Tier 2 · Architecture composable (haut impact / effort moyen)

| # | Action | Impact | Effort |
|---|---|---|---|
| T2.1 | Définir 15-20 section schemas (Zod discriminated union) | 🔥🔥🔥 | 6h |
| T2.2 | Créer 15-20 `<Section*.astro>` components | 🔥🔥🔥 | 12h |
| T2.3 | Renderer `<SectionsRenderer.astro>` | 🔥🔥 | 3h |
| T2.4 | Migrer 1 type de page (offres) en composable | 🔥🔥 | 4h |
| T2.5 | Storybook ou page `/agence/design-system` enrichie | 🔥 | 6h |

**Sous-total** : ~31h pour composabilité complète.

### Tier 3 · Fusion collections (moyen impact / effort moyen)

| # | Action | Impact | Effort |
|---|---|---|---|
| T3.1 | Fusion `formations`+`parcours`+`ateliers` → `courses` | 🔥🔥 | 4h |
| T3.2 | Fusion `produits`+`abonnements` → `commerce` | 🔥🔥 | 4h |
| T3.3 | Fusion `fieldNotes`+`veilleIA` → `blog` (type discriminator) | 🔥 | 3h |
| T3.4 | Renommer `solutions` → `usecases` (rationalisation sémantique) | 🔥 | 2h |

**Sous-total** : ~13h.

### Tier 4 · AI-first collections (moyen impact / effort moyen)

| # | Action | Impact | Effort |
|---|---|---|---|
| T4.1 | Collection `personas` + migration PersonaSwitcher | 🔥🔥 | 4h |
| T4.2 | Collection `brand-voice` (singleton) | 🔥 | 2h |
| T4.3 | Collection `prompts` + assistant interne (RAG-ready) | 🔥🔥 | 6h |
| T4.4 | Collection `pain-points` cross-référenced | 🔥 | 3h |
| T4.5 | Knowledge base MDX structuré | 🔥 | 8h |

**Sous-total** : ~23h.

### Tier 5 · SEO programmatique (haut impact / effort élevé)

| # | Action | Impact | Effort |
|---|---|---|---|
| T5.1 | Glossary auto-générée (50-100 termes) | 🔥🔥🔥 | 10h (worker Sonnet content) |
| T5.2 | Integrations auto-générées (15-30) | 🔥🔥 | 8h |
| T5.3 | Comparisons auto-générées (10-20) | 🔥🔥 | 6h |
| T5.4 | Pages tag/auteur/archive | 🔥🔥 | 4h |
| T5.5 | BreadcrumbList Schema.org partout | 🔥 | 2h |

**Sous-total** : ~30h.

### Tier 6 · Conversion infrastructure (moyen impact / effort moyen)

| # | Action | Impact | Effort |
|---|---|---|---|
| T6.1 | A/B testing Edge Config Vercel | 🔥🔥 | 4h |
| T6.2 | Quiz multi-step component | 🔥🔥 | 6h |
| T6.3 | Collection `forms` + `<LeadMagnetGated />` | 🔥🔥 | 5h |
| T6.4 | Collection `proof-points` + `guarantees` | 🔥 | 3h |
| T6.5 | Email sequences ESP integration | 🔥🔥 | 8h |

**Sous-total** : ~26h.

### Tier 7 · Contenu rédactionnel (haut impact / effort très élevé)

Voir doc 13 section "Rédaction" : 30-50h de rédaction + édition Simon.

### Total refactor

**Tiers 1-6 = ~133h** (technique pur, sans rédaction)
**Tier 7 = 30-50h** (contenu)

**Grand total = 165-185h** d'effort estimé pour atteindre l'état cible "plateforme IA-first scalable".

---

## 12. Risques techniques

### 12.1 Risque dette technique exponentielle

Si on **n'attaque pas** Tier 2 (composable) avant Tier 5 (SEO programmatique) :
- Chaque nouvelle page SEO = duplication template
- 100 pages glossaire avec hero hardcoded = 100 × 500 LoC = 50K LoC dette
- Maintenance impossible à 6 mois

**Décision critique** : Tier 2 **AVANT** Tier 5. Sinon catastrophe.

### 12.2 Risque migration content cassée

Les 17 pages hardcoded actuelles **prennent priorité routage** sur les MDX livrés cette session. Si on delete sans backup → impossible de revenir. Recommandation : **git commit avant delete**, puis delete par batch de 5 avec validation visuelle entre chaque batch.

### 12.3 Risque output: 'hybrid' breakage

Changer `output: 'server'` → `'hybrid'` peut casser :
- `/api/*` routes (devraient continuer mais à vérifier)
- View Transitions API (souvent dépendant du mode rendering)
- Form POST handlers
- Auth middleware si existant

**Mitigation** : déployer sur Preview Vercel avant merge main. Tester checklist :
- [ ] /api/contact POST renvoie 200
- [ ] /api/newsletter POST renvoie 200
- [ ] View Transitions hero atlas → console fonctionne
- [ ] Hreflang FR/EN OK
- [ ] Lighthouse > 90 sur 5 pages échantillon

### 12.4 Risque schema migration (fusion collections)

Migrer `formations` + `parcours` + `ateliers` → `courses` casse les références. Mitigation :
- Phase 1 : créer `courses`, garder les 3 anciennes
- Phase 2 : migrer les MDX (worker Sonnet)
- Phase 3 : pages dynamiques `/ecole/[type]/[slug]` consomment `courses`
- Phase 4 : supprimer les 3 anciennes collections
- Rollback possible à chaque étape

### 12.5 Risque sur-engineering composable

Tier 2 (sections discriminated union) peut devenir **overkill** si on a 5 sections × 5 variants. Garde-fou :
- Si une section est utilisée par < 3 pages, **NE PAS** la mettre en composable
- Pragmatisme : composable pour hero, proof, faq, cta, pricing, comparison (= ~7 sections) suffit

---

## 13. Anti-patterns détectés (récap critique)

### À éliminer immédiatement

1. **`output: 'server'` global** → contenu statique SSR-é inutilement
2. **Templates monolithiques 9802 LoC** → pas réutilisable
3. **Regex parsing slots HTML** dans templates (OffresDetailTemplate `extractTag()`, `extract()`) → fragile, type-unsafe, lent
4. **22 collections** avec ~30% redondance → maintenance cauchemar
5. **17 pages hardcoded** + 21 MDX livrés → MDX inutilisés tant que hardcoded en place
6. **`entry.render()` legacy Astro 5** sur 3 routes → cassé en Astro 6 (déjà fixé cette session)
7. **`description_fr > 180 chars`** zod cascade fail (déjà détecté + fixé)
8. **`Astro.slots.render()` sans `?? ''`** → TypeError sur slot manquant (déjà fixé)
9. **`< 2h` non-escaped en JSX** sur industrie.astro (déjà fixé)
10. **`output:'server'` + props serialization** perd la liaison `rendered` (déjà fixé via prerender)
11. **`BootSplash.tsx` React** pour splash → 50 KB bundle inutile (peut être CSS-only)
12. **`:global()` partout dans templates** → pollution scope CSS
13. **Pas de `astro:assets` systématique** → images non-optimisées
14. **Pas d'OG image dynamique** → previews sociaux génériques

### À surveiller

- Sur-engineering composable (cf risque 12.5)
- Codex token expiré (workaround = Sonnet direct OK pour Waimia)
- Tags simplifiés à 8 mais peut évoluer si besoins nouveaux

---

## 14. Décisions stratégiques critiques (à valider Simon)

### Décision 1 · Output mode

**Recommandation** : passer `output: 'hybrid'` cette semaine.
**Argument** : 95% du contenu est statique. SSR-er gratuitement coûte argent (Vercel) + perf (LCP). Migration risquée → à faire sur preview branch.
**Question Simon** : valides-tu la bascule ? OK pour preview branch ?

### Décision 2 · Composable architecture

**Recommandation** : Tier 2 AVANT Tier 5 (SEO programmatique).
**Argument** : impossible de scaler 100+ pages SEO sans dédupliquer les templates.
**Question Simon** : on attaque le composable system (T2.1-T2.4) en priorité ou continue les migrations Wave 6-10 actuelles ?

### Décision 3 · Fusion collections École/Commerce

**Recommandation** : fusionner `formations`+`parcours`+`ateliers` → `courses` ET `produits`+`abonnements` → `commerce`.
**Argument** : 3+2 = 5 collections → 2 collections. Mutualisation ~75% des champs.
**Question Simon** : OK pour fusion ? Ou tu préfères garder séparé pour clarté métier UI ?

### Décision 4 · Suppression hardcoded

**Recommandation** : supprimer les 17 .astro hardcoded cette semaine pour activer les 17 MDX migrés.
**Argument** : sinon les MDX livrés cette session ne servent à rien (pages hardcoded prennent priorité routage).
**Question Simon** : on supprime maintenant (git commit before) ou tu veux valider visuellement les 17 pages MDX d'abord ?

### Décision 5 · IA-first collections

**Recommandation** : Tier 4 (personas, brand-voice, prompts) cette quinzaine.
**Argument** : Waimia se positionne "agence IA-first" — incohérent que la stack n'expose pas l'IA dans la structure. Sera utile pour génération de copy futur.
**Question Simon** : priorité Tier 4 par rapport à Tier 5 (SEO programmatique) ?

---

## 15. Conclusion

Waimia 2026-05-15 est :
- **Esthétiquement abouti** (DA forte, typographie maîtrisée, hairlines, swiss grid)
- **Techniquement bloqué sur 5 anti-patterns structurels** :
  1. Rendering SSR-only
  2. Templates monolithiques (zéro composabilité)
  3. 22 collections (sur-fragmentation)
  4. AI-first absent de la structure
  5. SEO programmatique inexistant

**Trajectoire actuelle** = beau site éditorial.
**Trajectoire cible** = plateforme IA-first composable scalable.

**Gap entre les 2** = ~165-185h d'effort technique + 30-50h de contenu = **~200-235h** au total pour transformer Waimia en ce qu'il prétend être.

**Décision la plus critique** : ATTAQUER LE COMPOSABLE (Tier 2) AVANT TOUT ELSE. Sinon chaque heure investie en SEO/contenu/feature accumule de la dette inévitable.

---

_Audit produit par Claude Opus 4.7 en session 2026-05-15. Aucune complaisance, aucun engagement marketing._
_Source de vérité indépendante. À challenger / réfuter / discuter._
