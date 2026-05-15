# Waimia · QA Finale Audit — Tier 13

> Audit statique produit le 2026-05-15 (lecture seule, sans build ni server).
> CWD : `apps/web` · Réf : `docs/16-EXECUTION-TRACKER.md`

---

## 1 · HTTP Status Audit

### 1.1 Méthode

Audit statique : vérification de l'existence des fichiers `.astro` (routes statiques) et des entrées MDX dans les collections (routes dynamiques). Un `✅ 200` statique indique que la route existe structurellement ; la validation empirique HTTP réelle est listée sous T13.10 (non encore exécutée).

### 1.2 Routes principales

| Route | Mécanisme | Fichier / Entrée | Statut attendu |
|---|---|---|---|
| `/` | Static | `src/pages/index.astro` | ✅ 200 |
| `/en` | Static | `src/pages/en/index.astro` | ✅ 200 |
| `/manifesto` | Static | `src/pages/manifesto.astro` | ✅ 200 |
| `/en/manifesto` | Static | `src/pages/en/manifesto.astro` | ✅ 200 |
| `/contact` | Static | `src/pages/contact.astro` | ✅ 200 |
| `/en/contact` | Static | `src/pages/en/contact.astro` | ✅ 200 |

### 1.3 Offres

| Route | Mécanisme | Fichier / Entrée | Statut attendu |
|---|---|---|---|
| `/offres` | Static | `src/pages/offres/index.astro` | ✅ 200 |
| `/offres/composable-pilot` | Dynamic `[...slug]` | `content/offres/composable-pilot.mdx` | ✅ 200 |
| `/offres/conseil` | Static | `src/pages/offres/conseil.astro` | ✅ 200 |
| `/offres/revops` | Static | `src/pages/offres/revops.astro` | ✅ 200 |
| `/offres/growth-system-ia` | Dynamic `[...slug]` ¹ | `content/offres/growth-system-ia.mdx` | ✅ 200 |
| `/offres/activation-ia` | Dynamic `[...slug]` ¹ | `content/offres/activation-ia.mdx` | ✅ 200 |

> ¹ Pages statiques supprimées intentionnellement en T1.2b (7 fichiers) — route dynamique `offres/[...slug].astro` prend le relais. Validé empiriquement T1.2e.

### 1.4 Solutions, Cas, Agence

| Route | Mécanisme | Fichier / Entrée | Statut attendu |
|---|---|---|---|
| `/solutions` | Static | `src/pages/solutions/index.astro` | ✅ 200 |
| `/solutions/acquisition-ia` | Dynamic `[...slug]` ¹ | `content/solutions/acquisition-ia.mdx` | ✅ 200 |
| `/cas` | Static | `src/pages/cas/index.astro` | ✅ 200 |
| `/agence/design-system` | Static | `src/pages/agence/design-system.astro` | ✅ 200 |

> ¹ Pages statiques supprimées en T1.2c (8 fichiers) — route dynamique `solutions/[...slug].astro` prend le relais.

### 1.5 Glossaire, Ressources, Commerce, École

| Route | Mécanisme | Fichier / Entrée | Statut attendu |
|---|---|---|---|
| `/glossaire` | Static | `src/pages/glossaire/index.astro` | ✅ 200 |
| `/glossaire/agent-ia` | Dynamic `[slug]` | `content/glossary/agent-ia.mdx` | ✅ 200 |
| `/ressources/personas` | Static | `src/pages/ressources/personas/index.astro` | ✅ 200 |
| `/commerce` | Static | `src/pages/commerce/index.astro` | ✅ 200 |
| `/commerce/product/audit-maturite-ia-guide` | Dynamic `[type]/[slug]` | `content/commerce/audit-maturite-ia-guide.mdx` | ✅ 200 |
| `/ecole/cours/intro-ia-pme-b2b` | Dynamic `cours/[slug]` | `content/ecole/courses/intro-ia-pme-b2b.mdx` | ⚠️ À vérifier ² |

> ² Route `ecole/cours/[slug].astro` et `ecole/[type]/[slug].astro` coexistent. L'accès via `/ecole/cours/intro-ia-pme-b2b` dépend du mapping exact entre la route statique `cours/[slug]` et la collection `courses`. Valider empiriquement lors de T13.10.

---

## 2 · Schemas Zod Audit — Collections Content

### 2.1 Inventaire complet

| Collection | Type | Entrées | État |
|---|---|---|---|
| `authors` | Profil | 1 | ✅ Nominal |
| `blog` | Discriminated union (type enum) | 6 | ✅ Nominal |
| `brand-voice` | Singleton | 1 | ✅ Nominal |
| `cases` | MDX enrichi | 2 | 🟡 Léger (2/5 cas narrés livrés — T9.5) |
| `commerce` | Discriminated union (product/subscription) | 5 | ✅ Nominal |
| `cookbooks` | MDX | 1 | 🟡 Léger (1 entrée) |
| `ecole/formations` | MDX | 3 | 🟡 Migration vers `courses` en cours (T3.1b) |
| `ecole/courses` | Polymorphe (4 variants) | 3 | ✅ Nominal |
| `ecole/parcours` | MDX | 0 | ⚠️ Vide — collection à supprimer (T3.1f) |
| `ecole/ateliers` | MDX | 0 | ⚠️ Vide — collection à supprimer (T3.1f) |
| `field-notes` | MDX | 0 | ⚠️ Vide — migration blog prévue (T3.3b) |
| `glossary` | MDX SEO | 15 | ✅ Nominal (cible 50 — T5.1b) |
| `livres-blancs` | MDX avec PDF | 1 | 🟡 Léger (1 entrée) |
| `newsletter` | MDX | 0 | ⚠️ Vide — archives non implémentées |
| `offres` | MDX étendu V2 | 8 | ✅ Complet |
| `outils` | Paramétrique | 1 | 🟡 Léger |
| `pages` | Standalone | 1 | 🟡 Léger |
| `personas` | MDX bilingue | 3 | ✅ Nominal |
| `ressources` | Répertoire parent | 0 | ⚠️ Pas de collection Astro définie |
| `secteurs` | MDX | 3 | ✅ Complet (3 secteurs) |
| `solutions` | MDX étendu V2 | 8 | ✅ Complet |
| `technologies` | MDX | 2 | 🟡 Léger (2 entrées) |
| `testimonials` | MDX | 5 | ✅ Nominal |
| `tunnels` | Conversion V2 | 4 | 🟡 16 restants prévus (T9.7) |
| `veille-ia` | MDX | 1 | 🟡 Migration blog prévue (T3.3c) |

### 2.2 Collections vides — risques

| Collection | Risque | Résolution |
|---|---|---|
| `ecole/parcours` | Route `/ecole/parcours/*` génère 0 page | T3.1f : supprimer post-migration |
| `ecole/ateliers` | Route `/ecole/ateliers/*` génère 0 page | T3.1f : supprimer post-migration |
| `field-notes` | Route `/ressources/field-notes/*` mène à pages vides | T3.3b : migrer vers `blog` |
| `newsletter` | Route `/ressources/newsletter/*` vide | Archiver ou documenter statut |
| `ressources/` | Répertoire parent sans loader Astro | Clarifier intentionnalité |

---

## 3 · Composants Atomic Audit

### 3.1 Compteur par couche

| Couche | Composants | Fichiers clés |
|---|---|---|
| **Atoms** | **10** | Button, Bi, ChapterLabel, CursorDot, Kicker, PillCTA, ProgressBar, ScrollProgress, SectionTransition, TerminalCTA |
| **Molecules** | **30** | AsymmetricServiceRow, AuthorByline, Breadcrumb, CalEmbed, EditorialCaseCard, FitColumns, MastheadRow, MetricStrip, NewsletterSignup, PagePill, PricingTier, ProcessSteps, ProofBand, RelatedByCluster, RelatedCards, SectionHeader, ServiceCatalogRow, ShareButtons, StatRow, TableOfContents, TagPills, TaxonomyMenu, TechPillRow, TerminalMockup, TerminalTable, TunnelNav… |
| **Organisms** | **25** | AtlasGrid, BookSession, CapabilityStrip, Cases, CookiesBanner, CtaBand, Departments, FieldNotes, FooterMarquee, Hero, HowWeShip, Manifesto, ManifestoAccent, Offices, OperatingLayer, PersonaSwitcher, ProofBar, Pyramid, SigBand, SixServices, Stub, SystemArchitecture, TrustMarquee, WhyAIStalls, WritingNotes |
| **Sections** | **20** | ComparisonTable, CtaBandSection, CtaFinal, CtaInline, FaqAccordion, FeatureGrid, GuaranteeBlock, HeroCentered, HeroFullBleed, HeroSplit, MediaBlock, MethodTimeline, ObjectionHandler, PricingTable, ProofBarSection, SectionsRenderer, SocialProof, StatBlock, TestimonialBlock, TimelineBlock |
| **Editorial** | **8** | Callout, Dingbat, DropCap, EditorialTable, KeyMetric, PullQuote, Sidenote, Timeline |
| **Motion** | **4** | AtlasConnections, BootSplash, LiquidHero (React), ProductReel (React) |
| **Templates** | **19** | AuthorPageTemplate, CaseStudyTemplate, ConversionFunnelTemplate, CourseDetailTemplate, DetailMenuTemplate, EcoleHubTemplate, EssayTemplate, FormationDetailTemplate, HubTemplate, LeadMagnetTemplate, ListIndexTemplate, OffresDetailTemplate, ServiceDetailTemplate, SolutionsDetailTemplate, TechnologiesDetailTemplate, TrustLegalTemplate, TunnelStepTemplate, UtilityTemplate, WelcomeTemplate |
| **Total UI** | **116** | Hors svg/, header/, footer/, seo/ |
| **Total global** | **~147** | Avec svg/geometric (25+), svg/sumie (6), header, footer, seo |

### 3.2 Observations

- **Doublons** : 0 — tous les 147 composants ont des noms uniques.
- **React islands** : 4 (CalEmbedReact, PagePillIsland, LiquidHero, ProductReel) — hydration client justifiée.
- **T2.4e** (14 sections sans `.wrap-wide`) : toujours en attente. HeroCentered, HeroFullBleed, StatBlock, SocialProof, ComparisonTable, TimelineBlock, MediaBlock, PricingTable, FaqAccordion, ObjectionHandler, CtaBand, CtaInline, TestimonialBlock, GuaranteeBlock.

---

## 4 · Anti-Patterns Checklist

### 4.1 Tokens fantômes

```bash
# Tokens utilisés dans global.css mais absents de tokens.css
var(--text-display-xl)   → ❌ NON DÉFINI (global.css:62 · h1)
var(--text-display-lg)   → ❌ NON DÉFINI (global.css:69 · h2)
var(--text-display-sm)   → ❌ NON DÉFINI (global.css:76 · h3)
var(--text-mono-lg)      → ❌ NON DÉFINI (global.css:98 · code)

# Définis dans tokens.css
var(--text-display-md)   → ✅ clamp(44px, 6vw, 96px)
var(--text-mono-md)      → ✅ 11px
var(--text-mono-xs)      → ✅ 10px
```

**Verdict : 4 tokens fantômes actifs** → h1, h2, h3, `code` reçoivent `undefined`, fallback navigateur, **rupture typographique en production**.

**Correction requise avant deploy** (T13.1 bloqué par ce problème) :
```css
/* global.css — proposition de fix */
h1   { font-size: var(--text-display-md); }         /* ou ajouter --text-display-xl dans tokens */
h2   { font-size: clamp(32px, 4vw, 64px); }         /* ou ajouter --text-display-lg */
h3   { font-size: clamp(24px, 3vw, 48px); }         /* ou ajouter --text-display-sm */
code { font-size: var(--text-mono-md); }             /* ou ajouter --text-mono-lg */
```

### 4.2 Doublons nom-identique

**Verdict : 0 doublon** — audit `find | basename | sort | uniq -d` : résultat vide. ✅

### 4.3 Classe `.kicker`

**Verdict : Usage normalisé.** ✅

- `.kicker` défini dans `global.css:127` (règle canonique)
- Composant atom `Kicker.astro` dans `ui/atoms/`
- 55 usages dans les fichiers sources : usage cohérent du design system, pas d'anti-pattern.

### 4.4 Sections W6 sans `.wrap-wide`

**Verdict : 0 section *livrée validée* sans `.wrap-wide`**. ✅ (5 premières sections patchées en T2.4d)

**Cependant** : 14 sections W6 restantes (T2.4e) n'ont **pas encore reçu** le patch `.wrap-wide`. Elles ne sont pas en production active mais sont dans le registry. À patcher avant intégration content.

| Sections sans `.wrap-wide` confirmé | État |
|---|---|
| HeroCentered, HeroFullBleed | ☐ T2.4e + T2.4f |
| StatBlock, SocialProof, ComparisonTable | ☐ T2.4e |
| TimelineBlock, MediaBlock, PricingTable | ☐ T2.4e |
| FaqAccordion, ObjectionHandler, CtaBand | ☐ T2.4e |
| CtaInline, TestimonialBlock, GuaranteeBlock | ☐ T2.4e |

---

## 5 · Recommandations Pré-Deploy Production

### 5.1 Bloquants critiques (deploy impossible sans)

| # | Problème | Fichier | Action |
|---|---|---|---|
| B1 | **Tokens fantômes h1/h2/h3/code** | `src/styles/global.css:62-98` | Ajouter 4 tokens manquants dans `tokens.css` OU corriger les références dans `global.css` |
| B2 | **T13.1 — `pnpm exec astro check` non exécuté** | — | Lancer check et corriger 0-errors |
| B3 | **T13.2 — `pnpm build` non exécuté** | — | Build complet requis avant preview deploy |
| B4 | **T2.4e — 14 sections sans `.wrap-wide`** | `src/components/sections/*.astro` | Patcher les 14 sections avant tout usage content |

### 5.2 Importants (à traiter sprint post-deploy)

| # | Problème | Impact | Action |
|---|---|---|---|
| I1 | Collections vides actives (`field-notes`, `newsletter`, `ecole/parcours`, `ecole/ateliers`) | Pages vides si routées | Supprimer collections ou ajouter garde-fou 404 |
| I2 | **T3.1f** — `formations`, `parcours`, `ateliers` non supprimés de `content.config.ts` | Double-routing risqué | Supprimer après migration complète |
| I3 | **T1.5b/c** — Self-hosting fonts (Google CDN actif) | Perf LCP | Passer woff2 auto-hébergé |
| I4 | **T5.5a** — BreadcrumbList Schema.org non validé | SEO/GEO | Audit + fix sur tous templates |
| I5 | **T11.1** — Pages `/en/` non synchro avec refactor FR | UX EN dégradée | Sync 6 pages EN post-deploy FR |
| I6 | **T12.6/T12.7** — Bundle JS et LCP non mesurés | Perf | Vérifier bundle < 80 KB gzip, LCP < 1.5s |

### 5.3 Souhaitables (backlog)

| # | Action |
|---|---|
| S1 | T1.6a/b — OG image dynamique Vercel endpoint |
| S2 | T1.7 — Migration images vers `astro:assets` |
| S3 | T5.2 → T5.6 — SEO programmatique (intégrations, comparaisons, tags, hreflang) |
| S4 | T6.1 → T6.6 — Infrastructure conversion (A/B, quiz, forms, proof-points) |
| S5 | T8.3 — MegaMenu intégré au Header.astro |
| S6 | T9.1 → T9.4 — Contenu amorçage (pillar, clusters, cookbooks, field notes) |
| S7 | T10.2 → T10.12 — SVG custom restants |
| S8 | T4.2c — Linter custom forbidden_words brand voice |

---

## 6 · Avancement Tiers du Tracker

> Source : `docs/16-EXECUTION-TRACKER.md` — 135 sous-tâches totales.
> **Note** : le compteur global du tracker affiche `0 / 135 (0%)` — il n'a jamais été mis à jour. Le compte réel ci-dessous est basé sur les [✅] / [🟡] / [☐] des sous-tâches.

### 6.1 Tiers avec livraisons ✅

| Tier | Intitulé | ✅ Livrés | 🟡 Partiel | ☐ Restants | Total |
|---|---|---|---|---|---|
| **T1** | Quick wins | 6 | 1 | 7 | 14 |
| **T2** | Composable architecture | 9 actions + 19 sections | 1 | 4 | ~24 |
| **T3** | Fusion collections | 6 | 1 | 9 | 16 |
| **T4** | AI-first collections | 6 | 0 | 9 | 15 |
| **T5** | SEO programmatique | 2 | 1 | 11 | 14 |
| **T9** | Contenu amorçage | 0 | 1 | 9 | 10 |
| **T10** | SVG custom | 1 | 0 | 11 | 12 |
| **T12** | ISR + Performance | 1 | 4 | 2 | 7 |

### 6.2 Tiers non démarrés ☐

| Tier | Intitulé | Actions | Bloquant ? |
|---|---|---|---|
| **T6** | Conversion infrastructure | 15 | Non (post-content) |
| **T7** | Templates restants Wave 6-12 | 12 | Non (amélioration) |
| **T8** | Routes restantes Wave 4 | 9 | Non (post-deploy) |
| **T11** | Sync EN | 4 | Non (post-FR) |
| **T13** | QA finale | 10 | **OUI — c'est le tier courant** |

### 6.3 État T13 — QA finale (0/10 avant ce doc)

| Tâche | Description | État |
|---|---|---|
| T13.1 | `pnpm exec astro check` : 0 errors | ☐ Non exécuté |
| T13.2 | `pnpm build` succès complet | ☐ Non exécuté |
| T13.3 | Lighthouse 5 pages (perf, a11y, SEO, best practices) | ☐ Non exécuté |
| T13.4 | Schema.org validator (Article/Service/FAQPage/Product/Course/BreadcrumbList) | ☐ Non exécuté |
| T13.5 | Liens cross-collection sans 404 | ☐ Non exécuté |
| T13.6 | Hreflang FR/EN consistency | ☐ Non exécuté |
| T13.7 | Triangulation visuelle screenshots (Simon valide) | ☐ Non exécuté |
| T13.8 | Update doc 12 statuses avec ✅ final | ☐ Non exécuté |
| T13.9 | Commit + push final → Vercel deploy preview | ☐ Non exécuté |
| T13.10 | Validation Vercel preview HTTP 200 sur 50+ URLs | ☐ Non exécuté |

> **Ce doc accomplit T13.0 (audit statique pré-build)** — non listé dans le tracker d'origine.

### 6.4 Estimation progression réelle

| Périmètre | Estimation |
|---|---|
| Actions ✅ livrées | ~47 / 135 (~35%) |
| Actions 🟡 partielles | ~9 (~7%) |
| Actions ☐ restantes | ~79 (~58%) |
| **Score pre-deploy bloquants** | B1→B4 requis avant T13.9 |

---

## 7 · Synthèse Exécutive

### Ce qui est solide ✅

- Architecture composable V2 fonctionnelle (19 sections + SectionsRenderer + registry)
- 8 offres + 8 solutions consommées en MDX (delete hardcoded T1.2b/c validé)
- Collections discriminated union (courses × 4, commerce × 2) opérationnelles
- 147 composants sans doublon, design system tokens centralisés
- Personas (3), glossaire (15), testimonials (5), tunnels (4) prêts
- ISR adapter Vercel configuré (T12.0)

### Ce qui bloque le deploy ⚠️

1. **Tokens fantômes global.css** — rupture typographique h1/h2/h3/code
2. **Astro check + build** non exécutés — 0 garantie zéro erreur type/build
3. **14 sections sans `.wrap-wide`** — visuels cassés si utilisées en content
4. **Collections vides en double-routing** — risque pages vides ou 404 silencieux

### Ordre d'exécution recommandé pre-deploy

```
1. Fix tokens fantômes global.css (B1) — ~15min
2. Patch .wrap-wide 14 sections (B4) — ~2h Codex
3. pnpm exec astro check → fix 0 errors (T13.1)
4. pnpm build → succès (T13.2)
5. Supprimer collections vides du routing (I1)
6. Commit + Vercel preview deploy (T13.9)
7. Validation HTTP 200 50+ URLs (T13.10)
8. Lighthouse 5 pages (T13.3)
```

---

*Audit produit par Claude Sonnet 4.6 · 2026-05-15 · Lecture seule, aucun fichier modifié*
