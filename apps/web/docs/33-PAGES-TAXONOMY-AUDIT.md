# Waimia · Audit Pages par Taxonomie — Doc 33

> **Mission** : Phase 1 Design · Audit observationnel READ-ONLY.
> **Auteur** : Worker Sonnet 4.6 · Session 2026-05-17.
> **Sources** : docs 12, 13, 15, 22 + lecture directe `src/pages/` + `src/components/templates/`.
> **Périmètre** : 110 fichiers `.astro` pages + 19 templates + 116 composants UI.

---

## Sommaire

1. [Inventaire exhaustif par bloc taxonomie](#section-1)
2. [Cohérence intra-taxonomie](#section-2)
3. [Cohérence inter-taxonomie](#section-3)
4. [Composants/sections sous-utilisés mais excellents](#section-4)
5. [Drift design détectés](#section-5)
6. [Plan de remédiation par batch](#section-6)
7. [Recommandation Phase 1 finale](#section-7)

---

## Section 1 · Inventaire exhaustif par bloc taxonomie {#section-1}

### Compteur global réel (find 2026-05-17)

| Bloc | Pages .astro | Routes dynamiques | Templates utilisés |
|---|---|---|---|
| Accueil | 2 (FR + EN) | — | Custom (Hero organism) |
| Solutions | 2 | `[...slug]` → 8 MDX | SolutionsDetailTemplate |
| Secteurs | 5 | `[...slug]` → 3 MDX + 2 statiques | **Mixte : custom inline pour statiques** |
| Offres | 6 + tunnel | `[...slug]` → 8 MDX + `[offre]/tunnel/[step]` | **Mixte : 4 templates différents** |
| Cas client | 6 | `[...slug]` → 2 MDX | CaseStudyTemplate |
| Ressources | 20+ | Multiple | **Mixte : ListIndexTemplate + EssayTemplate + custom** |
| Agence | 8 | — | UtilityTemplate + TrustLegalTemplate + custom |
| École | 3 | `cours/[slug]` + `[type]/[slug]` | EcoleHubTemplate + CourseDetailTemplate |
| Commerce | 2 | `[type]/[slug]` | Custom (Base inline) |
| Glossaire | 2 | `[slug]` → 15 MDX | Custom (Base inline) |
| Comparer | 2 | `[slug]` | Custom (Base inline) |
| Intégrations | 2 | `[slug]` | Custom (Base inline) |
| Bienvenue | 5 | `[...slug]` | WelcomeTemplate |
| Utility | 4 | `[...slug]` catch-all | Custom |
| EN mirror | 20 | Multiple | Miroirs FR |
| **TOTAL** | **~110** | **~67 routes dynamiques** | **19 templates** |

---

### Bloc 1 · Accueil

#### `/` (FR)

| Axe | Valeur observée |
|---|---|
| **Template** | Custom — composition directe d'organisms |
| **Sections / Organisms** | Hero → ProofBar → TrustMarquee → CapabilityStrip → SystemArchitecture → SixServices → Pyramid → Departments → Cases → FAQ → FieldNotes → BookSession → FooterMarquee |
| **Composants clés** | Hero.astro, ProofBar.astro, TrustMarquee.astro, SystemArchitecture.astro, BootSplash, ScrollProgress |
| **Qualité 14 axes** | **5/5** — refactor complet V5-V7 (cf. doc 12 status matrix) |
| **Notes éditoriales** | 8 organisms scannables. Narratif business-first PME clairement positionné. Hero col-gauche 58-62% respecté. FAQ 8 questions. GrainOverlay supprimé. CursorDot corrigé. |
| **SSG** | `prerender = true` ✅ |
| **Collection** | — (données hardcodées FAQ + organismes) |
| **GEO/Schema** | Organization JSON-LD ✅, FAQPage ✅ |

#### `/en` (EN)

| Axe | Valeur |
|---|---|
| **Template** | Miroir FR (hérite refactor) |
| **Qualité 14 axes** | 🟡 4/5 — sync contenu EN non validé individuellement |
| **Gap** | Contenu EN non traduit post-V7 (doc 12 : « Sync content EN avec FR refactor ») |

---

### Bloc 2 · Solutions

#### `/solutions` (hub)

| Axe | Valeur observée |
|---|---|
| **Template** | Custom — Base + sections inline hardcodées |
| **Sections** | Masthead (kicker + H1 + lede + canonical) → Grid 5 solutions cards → Section secteurs satellites (3) → CtaBand |
| **Pattern hero** | `.hub-h1` + `.hub-lede` + `.hub-canonical` + SVG géométrique background (rect + line) |
| **Data** | **Hardcodé** — tableau `horizontalSolutions` 5 items + `sectorSatellites` 3 items. Pas de `getCollection('solutions')` |
| **Qualité 14 axes** | ❌ 2/5 — pas audité individuellement. Hub correct mais col droite absente, CTA basique, stats absentes |
| **Notes** | `Cinq problèmes business. Une méthode.` — H1 fort mais pas de stats hero. ViewTransition `reveal-mask-up` présent. |

#### `/solutions/[...slug]` (détail — 8 pages via collection)

| Axe | Valeur observée |
|---|---|
| **Template** | SolutionsDetailTemplate ✅ (collection-driven, Zod-validated) |
| **Sections** (template) | Hero (breadcrumb + dept badge + H1 + lead + tags + meta + SVG rect 15°) → Pain Points (3 cards) → Workflows Table (5 cols) → ROI Band Dark (4 chiffres 88px) → Case Study Split (dark/light 50/50) → Department Stack (3×2 cards) → CTA dept-augmented dark |
| **Entrées actives** | 8 MDX : acquisition-ia, contenu-seo-geo-ia, crm-relances-ia, finance, fintech, productivite-ia, site-web-ia-pme, support-client-ia |
| **Qualité 14 axes** | 🟡 3/5 — template refactoré V5, pages individuelles non auditées. Pains/ROI/Stack viennent du frontmatter MDX. |
| **Drift risque** | `solutions/finance` et `solutions/fintech` répertoriées dans `archive.astro` comme « à migrer vers /secteurs » → double présence possible dans collections ET dans le hub secteurs |
| **GEO/Schema** | `buildService()` inclus dans template ✅ |

---

### Bloc 2bis · Secteurs (sous-taxonomie Solutions)

#### `/secteurs` (hub)

| Axe | Valeur observée |
|---|---|
| **Template** | Custom — Base + sections inline |
| **Sections** | Masthead (kicker + H1 + lede) → Grid 3 secteurs cards → Section « À venir » (5 secteurs futurs) → CtaBand |
| **Pattern hero** | `.hub-h1` ✅ — cohérent avec solutions/index |
| **Data** | Hardcodé — 3 secteurs live + 5 futurs |
| **Qualité 14 axes** | ❌ 2/5 — pas audité. Hub minimal mais pas de stats ni de col droite |

#### `/secteurs/[...slug]` (via collection — 3 MDX)

| Axe | Valeur observée |
|---|---|
| **Template** | SolutionsDetailTemplate (collection-driven) |
| **Entrées** | 3 MDX (services-b2b, industrie, finance-compta dans `/content/secteurs/`) |
| **Qualité** | 🟡 3/5 — hérite SolutionsDetailTemplate refactoré |

#### ⚠️ `/secteurs/services-b2b.astro` et `/secteurs/finance-compta.astro` — PAGES STATIQUES LEGACY

| Axe | Valeur observée |
|---|---|
| **Template** | **AUCUN** — Base + sections hardcodées inline |
| **Pattern hero** | `.mast-h1` (≠ `.hub-h1` du hub) → **classe CSS ad-hoc non-système** |
| **Sections** | Masthead → Pain Points grid (`.problems-grid`) → Solutions grid → CTA band |
| **SVG** | Inline SVG custom hardcodé dans le fichier page (≠ SVG sumie/ du système) |
| **Composants** | Kicker + CtaBand uniquement. Pas de SolutionsDetailTemplate. |
| **CTA** | `<a href="/secteurs" class="back-link">← Tous les secteurs</a>` — CTA texte basique non-système |
| **Collection** | **Non** — pas de `getCollection()` |
| **Qualité 14 axes** | ❌ **1/5** — CSS hardcodé, pas dans le système de tokens, pattern hero divergent, pas de Breadcrumb, pas de Schema.org, pas de stats bloc |
| **Verdict** | **DRIFT DESIGN SÉVÈRE** — ces pages coexistent avec la route dynamique `[...slug]` qui génère correctement via SolutionsDetailTemplate. Duplication architecturale + incohérence visuelle. |

---

### Bloc 3 · Offres

#### `/offres` (hub)

| Axe | Valeur observée |
|---|---|
| **Template** | Custom — Base + sections inline |
| **Sections** | Breadcrumb → Masthead (kicker + H1 « Trois niveaux. Une méthode. » + lede) → Pyramide SVG signature → Tier III cards → Tier II cards → Tier I cards → Section secteurs → CtaBand |
| **Pattern hero** | `.hub-h1` ✅. Pyramide SVG custom (`viewBox 0 0 800 440`) — **brique signature unique** |
| **Data** | JSON-LD ItemList hardcodé (11 offres). Pas de `getCollection('offres')` pour le hub |
| **Qualité 14 axes** | ❌ 2/5 — Hub non audité individuellement. Structure tiered claire mais stats hero absentes |

#### `/offres/[...slug]` (détail — 8 entrées via collection)

| Axe | Valeur observée |
|---|---|
| **Template** | OffresDetailTemplate ✅ (collection-driven, refactoré V5) |
| **Sections** (template) | Hero (kicker + H1 + tagline + CTA + stats + SVG col droite) → Method Timeline (3-col éditoriales) → FAQ slot → Inclusions slot → Pricing table slot → Related cards → CtaBand |
| **Entrées actives** | 8 MDX : growth-system-ia, activation-ia, claude-cowork, growth-intelligence, productivite-operationnelle-ia, infrastructure-ia, application-ia-pme, composable-pilot |
| **Qualité 14 axes** | 🟡 3/5 — template refactoré, content individuel non audité |
| **Bug fixé** | Slot guard `?? ''` corrigé (7 pages étaient en HTTP 500) |

#### `/offres/conseil.astro` — HubTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | HubTemplate |
| **Sections** | Hero stats (4 metrics) → Catalogue 7 services (ServiceCatalogRow × 7) → EditorialTable comparatif → SVG ConseilAuditDiagram → Related → CtaBand |
| **Qualité 14 axes** | ❌ 2/5 — template non refactoré. Riche en données (7 services, table éditoriale) mais 14 axes hero non vérifiés |

#### `/offres/revops.astro` — ServiceDetailTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | ServiceDetailTemplate |
| **Sections** | Hero (problem stats × 4) → Steps 4 phases → SVG RevOpsFunnel → Proof metrics → Tech pills → Related cards → CtaBand |
| **Qualité 14 axes** | ❌ 2/5 — template non refactoré. Structure solide (funnel SVG, proof metrics) mais 14 axes non vérifiés |

#### `/offres/audit-maturite-ia.astro` — DetailMenuTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | DetailMenuTemplate |
| **Sections** | Annotations × 3 (10j/47 critères/1 grille) → Steps 4 phases J1-J10 → SVG AuditMaturityTimeline → Proof metrics → Tech pills → Related cards |
| **Qualité 14 axes** | ❌ 2/5 — template non refactoré |

#### `/offres/site-web-ia.astro` — ConversionFunnelTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | ConversionFunnelTemplate |
| **Sections** | Hero stats (4) → Steps 4 phases → Pricing tiers (3 tiers avec features) → CtaBand |
| **Qualité 14 axes** | ❌ 2/5 — template non refactoré. Présence pricing — pépite potentielle |

#### `/offres/[offre]/tunnel/[step]` — TunnelStepTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | TunnelStepTemplate (collection tunnels — 4 entrées MDX) |
| **Usage** | Tunnel multi-étapes (conversion) |
| **Qualité** | Non audité individuellement |

#### `/offres/site-web-ia-landing.astro` — custom

| Axe | Valeur observée |
|---|---|
| **Template** | **Custom** — non audité. Probablement landing page dérivée de `site-web-ia.astro` |
| **Qualité** | ❌ Non audité |

---

### Bloc 4 · Cas client

#### `/cas` (hub)

| Axe | Valeur observée |
|---|---|
| **Template** | Custom — Base + sections inline |
| **Sections** | Masthead (kicker + H1 « Pas de marketing. Des chiffres. » + lede) → Featured case (large card) → Grid 3 autres cas → CtaBand |
| **Pattern hero** | `.hub-h1` ✅. i18n FR/EN via `langFromPath`. ViewTransition `transition:name` |
| **Data** | Hardcodé — 4 cas (plateau, halcyon, northbound, caserne). Pas de `getCollection('cases')` |
| **Qualité 14 axes** | ❌ 2/5 — structurellement solide (featured + grid), mais stats hub absentes, H1 non-14-axes |

#### `/cas/plateau.astro`, `/cas/halcyon.astro`, `/cas/northbound.astro`, `/cas/caserne.astro` — CaseStudyTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | CaseStudyTemplate ✅ (props typées) |
| **Sections** (template) | Breadcrumb → Masthead (caseNum + H1 client + kicker + specs bar) → Steps 4 phases (ProcessSteps) → ProofBand (quote + metrics) → Tech pills (TechPillRow) → Related cards → CtaBand |
| **Composants** | ProcessSteps, ProofBand, TechPillRow, RelatedCards, ChapterLabel, KeyMetric, Breadcrumb |
| **Data** | Hardcoded dans chaque `.astro` page (specs, steps, proofMetrics, techPills) |
| **Qualité 14 axes** | ❌ 2/5 — CaseStudyTemplate non refactoré. Template solide structurellement mais 14 axes hero à appliquer. |
| **Architecture** | Double route : 4 pages statiques hardcodées + `cas/[...slug].astro` via collection (2 entrées MDX). **Duplication architecturale.** |

#### `/cas/[...slug].astro` — CaseStudyTemplate via collection

| Axe | Valeur observée |
|---|---|
| **Template** | CaseStudyTemplate (collection `cases`) |
| **Entrées MDX** | 2 (plateau + halcyon selon doc 22) |
| **Risque** | Les 4 pages statiques doublonnent avec la route dynamique → confusion maintenance |

---

### Bloc 5 · Ressources

#### `/ressources` (hub)

| Axe | Valeur observée |
|---|---|
| **Template** | **Custom** — Base + composition manuelle (pas ListIndexTemplate) |
| **Sections** | Masthead → Featured tools (3 cards hardcodées) → Cookbooks section (3 cards) → Cases section (5 cards hardcodées) → Blog section (1 card) → Livres blancs section → Newsletter band → CtaBand |
| **Composants** | Kicker, CtaBand, RelatedCards, Button, Bi |
| **Data** | **Hardcodé** — `tools`, `cookbookCards`, `caseCards`, `blogCards` en static arrays. **Stale data risk élevé.** |
| **Qualité 14 axes** | ❌ 2/5 — Hub fonctionnel mais pas d'organisme systémique. `caseCards` reference `/ressources/cas/plateau` (URL incorrecte — le vrai chemin est `/cas/plateau`) |
| **Bug potentiel** | `caseCards[0].href = '/ressources/cas/plateau'` → 404 probablement (route réelle = `/cas/plateau`) |

#### `/ressources/blog/index.astro` — ListIndexTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | ListIndexTemplate ✅ (variant writing-index) |
| **Sections** (template) | Kicker + H1 slot (`Notes lentes du terrain`) + lede slot → EditorialWriteRow list |
| **Data** | `FIELD_NOTES` static import (`src/data/sitemap`) — **pas `getCollection('blog')`** |
| **Gap** | Data sitemap static ≠ collection dynamic. Articles ajoutés en MDX n'apparaissent pas automatiquement |

#### `/ressources/blog/[...slug].astro` — EssayTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | EssayTemplate ✅ (collection `blog`) |
| **Composants** | AuthorByline, TableOfContents (via headings), RelatedByCluster |
| **Note** | `brain-circuit.astro` = page statique en doublon → anti-pattern (devrait être purement dynamique) |

#### `/ressources/cookbooks/index.astro` — ListIndexTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | ListIndexTemplate ✅ |
| **Note** | 3 pages cookbooks statiques (claude-cowork-rollout, claude-skills-tutorial, mcp-server-deploy) coexistent avec `[...slug].astro` dynamique |

#### `/ressources/cookbooks/[...slug].astro` — EssayTemplate

| Axe | Valeur observée |
|---|---|
| **Template** | EssayTemplate ✅ (collection `cookbooks`) |

#### `/ressources/livres-blancs/` — LeadMagnetTemplate

| Axe | Valeur observée |
|---|---|
| **Templates** | ListIndexTemplate (index) + LeadMagnetTemplate (détail) |
| **Note** | `ai-act-readiness.astro` statique en doublon du dynamique |

#### `/ressources/veille-ia/` — ListIndexTemplate + EssayTemplate

| Axe | Valeur observée |
|---|---|
| **Templates** | ListIndexTemplate (index) + EssayTemplate (détail) |
| **Collection** | `veille-ia` — 1 entrée. Collection sparse. |

#### `/ressources/field-notes/` — COLLECTION VIDE

| Axe | Valeur observée |
|---|---|
| **Collection** | `field-notes` — 0 entrées (doc 22 : ⚠️ vide) |
| **Routes** | `field-notes/index.astro` + `field-notes/[slug].astro` → génèrent 0 page |
| **Note** | Migration vers `blog` prévue T3.3b. Pages inutiles jusqu'à migration. |

#### `/ressources/personas/`, `/ressources/testimonials/`

| Axe | Valeur observée |
|---|---|
| **Templates** | Custom (Base inline) |
| **Note** | Hubs secondaires peu mis en avant dans la nav |

#### `/ressources/categorie/[...slug]`, `/ressources/silo/[...slug]`, `/ressources/tag/[...slug]`

| Axe | Valeur observée |
|---|---|
| **Usage** | Routes SEO taxonomiques — non auditées individuellement |
| **Risque** | Peuvent générer des pages vides si collections non peuplées |

#### Glossaire, Comparer, Intégrations (hors /ressources)

| Page | Template | Note |
|---|---|---|
| `glossaire/index.astro` | Custom Base inline | 15 termes, groupés par catégorie, filtres alphabétiques |
| `glossaire/[slug].astro` | Custom (collection `glossary`) | ✅ Collection peuplée 15 entrées |
| `comparer/index.astro` | Custom Base inline | Collection `comparisons` |
| `comparer/[slug].astro` | Custom collection-driven | Versus pages |
| `integrations/index.astro` | Custom Base inline | Filtres JS côté client |
| `integrations/[slug].astro` | Custom collection-driven | |

**Observation** : glossaire, comparer et intégrations utilisent tous des layouts inline (Base + sections CSS) sans template dédié. Pattern Hub-Custom répété 3× sans abstraction.

---

### Bloc 6 · Agence

| Page | Template | Sections clés | Qualité 14 axes | Notes |
|---|---|---|---|---|
| `agence/about.astro` | UtilityTemplate (align=left) | Story grid 1.6fr/1fr + Facts aside + CTA final | ❌ 2/5 | Solide narrativement. Grid about-grid custom. Pas de ProofBar. |
| `agence/methode.astro` | UtilityTemplate (align=left) | Timeline 5 phases + MethodeProcessDiagram SVG + WhyAIStalls slot | ❌ 2/5 | Timeline editorial bon usage. Pas de stats hero. |
| `agence/governance.astro` | TrustLegalTemplate | 6 sections + TOC sticky + Callout warn | ❌ 2/5 | Template approprié (légal). Pas des 14 axes (nature différente). |
| `agence/trust-center.astro` | TrustLegalTemplate | 6 sections RGPD/AI Act/ISO/SOC + EditorialTable | ❌ 2/5 | Idem governance. |
| `agence/design-system.astro` | Custom showcase | Showcase composants — non audité | ❌ Non audité | |
| `agence/docs.astro` | Unknown | Non audité | ❌ | |
| `agence/careers.astro` | Unknown | Non audité | ❌ | |
| `agence/prompts.astro` | Unknown | Non audité | ❌ | |

**Observation** : 4 pages agence non auditées. UtilityTemplate bien utilisé sur about/methode. TrustLegalTemplate cohérent sur governance/trust-center. Design-system showcase non audité — critique pour vérifier l'auto-documentation du design system.

---

### Bloc 7 · École

| Page | Template | Sections | Qualité | Notes |
|---|---|---|---|---|
| `ecole/index.astro` | EcoleHubTemplate | getCollection('courses') → formations/parcours/ateliers | ❌ 2/5 | Collection-driven ✅. EcoleHubTemplate non refactoré. |
| `ecole/cours/[slug].astro` | CourseDetailTemplate | collection `courses` | ❌ 2/5 | Polymorphe 4 variants (doc 22) |
| `ecole/[type]/[slug].astro` | FormationDetailTemplate? | collection `courses` filtré par type | ⚠️ | Coexistence avec `cours/[slug]` — collision potentielle route (doc 22 signale) |

---

### Bloc 8 · Commerce

| Page | Template | Sections | Qualité | Notes |
|---|---|---|---|---|
| `commerce/index.astro` | Custom (Base inline) | Hub products + subscriptions — collection-driven | ❌ 2/5 | 5 entrées commerce. Pas de template dédié. |
| `commerce/[type]/[slug].astro` | Custom collection-driven | Produit/abonnement detail | ❌ Non audité | |

---

### Bloc 9 · Pages identitaires / utilitaires

| Page | Template | Qualité | Notes |
|---|---|---|---|
| `manifesto.astro` | Custom (LiquidHero) | ✅ 5/5 | Refactor complet V7. H1 108px, viewport 100vh. |
| `atlas.astro` | Custom (AtlasGrid + AtlasConnections) | ✅ 5/5 | Refactor complet. |
| `console.astro` | Custom (TerminalMockup + ProductReel) | ✅ 5/5 | Refactor complet. |
| `contact.astro` | UtilityTemplate (centered) | ❌ 2/5 | Form + CalEmbed. Template correct, 14 axes hero non vérifiés. |
| `404.astro` | Custom (Base inline) | ❌ 2/5 | 3 portes de navigation. i18n. Pas de UtilityTemplate. |
| `archive.astro` | **Custom (Base + Header + Footer directs)** | ❌ 1/5 | **Anti-pattern : importe Header + Footer directement (doublon avec Base.astro)** |
| `[...slug].astro` | Catch-all racine | ❌ Non audité | Fallback inconnu |
| `test-composable.astro` | **Page test résiduelle** | ❌ | À supprimer |

---

### Bloc 10 · Bienvenue (welcome pages)

| Page | Template | Qualité | Notes |
|---|---|---|---|
| `bienvenue/audit.astro` | WelcomeTemplate | ❌ 2/5 | 3 next steps, lien vers /offres/conseil |
| `bienvenue/contact.astro` | WelcomeTemplate | ❌ Non audité | |
| `bienvenue/livre-blanc.astro` | WelcomeTemplate | ❌ Non audité | |
| `bienvenue/newsletter.astro` | WelcomeTemplate | ❌ Non audité | |
| `bienvenue/[...slug].astro` | WelcomeTemplate | ❌ Non audité | Catch-all |

**Observation** : bienvenue = taxonomie la plus cohérente (5/5 pages WelcomeTemplate). Template non refactoré V5 mais au moins uniforme.

---

### Bloc 11 · Pages EN (miroir)

| Groupe | Pages FR correspondantes | Statut sync |
|---|---|---|
| Core (index, atlas, console, manifesto) | ✅ V7 | 🟡 Contenu EN non traduit post-V7 |
| Bienvenue EN (3 pages) | Bienvenue FR | ❌ Non synchronisé |
| Agence EN (about, design-system, methode, prompts) | Agence FR | ❌ Non audité |
| Cas EN (index + slug) | Cas FR | ❌ Non audité |
| Comparer EN | Comparer FR | ❌ Non audité |
| Contact EN | Contact FR | ❌ Non audité |
| Intégrations EN | Intégrations FR | ❌ Non audité |
| Offres EN (index + slug) | Offres FR | 🟡 Hérite OffresDetailTemplate |
| Ressources EN (index + blog slug) | Ressources FR | ❌ Non audité |
| Solutions EN (index + slug) | Solutions FR | 🟡 Hérite SolutionsDetailTemplate |
| Technologies EN (index) | Technologies FR | ❌ Non audité |

---

## Section 2 · Cohérence intra-taxonomie {#section-2}

### 2.1 Solutions par problème (8 pages)

**Verdict : ✅ COHÉRENTES**

Toutes les 8 pages via `solutions/[...slug].astro` + `SolutionsDetailTemplate` + `content/solutions/*.mdx`. Pattern uniforme, Zod-validé, CTA cohérent (`/contact`). Seul gap : hub `/solutions/index.astro` ne consomme pas `getCollection('solutions')` — data hub et collection peuvent diverger.

### 2.2 Solutions par secteur — via SolutionsDetailTemplate (3 pages MDX)

**Verdict : ✅ COHÉRENTES (route dynamique)**

Les 3 entrées MDX dans `content/secteurs/` passent par `secteurs/[...slug].astro` → `SolutionsDetailTemplate`. Cohérentes avec les solutions par problème.

### 2.3 Secteurs statiques legacy (2 pages : services-b2b, finance-compta)

**Verdict : ❌ INCOHÉRENTES — drift sévère**

`services-b2b.astro` et `finance-compta.astro` utilisent un pattern hero `.mast-h1` + SVG inline + sections `problems-grid` hardcodées. Pattern complètement différent de `SolutionsDetailTemplate`. Ces pages coexistent avec la route dynamique — créant une **architecture duale incohérente**.

### 2.4 Offres pillier (8 pages via collection)

**Verdict : ✅ COHÉRENTES**

Toutes via `OffresDetailTemplate`. Template refactoré V5. Cohérence forte.

### 2.5 Offres niveaux (conseil, revops, audit-maturite)

**Verdict : ❌ INCOHÉRENTES — 3 templates différents**

| Page | Template | Hero pattern |
|---|---|---|
| `/offres/conseil` | HubTemplate | Catalogue 7 services |
| `/offres/revops` | ServiceDetailTemplate | Steps 4 phases + funnel SVG |
| `/offres/audit-maturite-ia` | DetailMenuTemplate | Steps 4 phases + timeline SVG |

Trois pages qui devraient raconter le même type de valeur (services Waimia premium) utilisent trois structures narratives différentes. `revops` et `audit-maturite-ia` sont proches (steps + SVG + proof metrics) mais via des templates différents → duplication code.

### 2.6 Cas client (4 pages statiques + route dynamique)

**Verdict : 🟡 TEMPLATES COHÉRENTS — architecture dupliquée**

Les 4 pages statiques utilisent toutes `CaseStudyTemplate` ✅. La route dynamique aussi. Cohérence visuelle attendue. Mais coexistence double architecture (statique + dynamique) → maintenance confuse. Qui prime ? Laquelle indexe ?

### 2.7 Ressources (blog, cookbooks, livres-blancs, veille-ia)

**Verdict : ✅ COHÉRENTES (index) — 🟡 PARTIELS (pages statiques doublons)**

Les 4 index utilisent `ListIndexTemplate` ✅. Les 4 détail utilisent `EssayTemplate` ou `LeadMagnetTemplate` ✅. Mais des pages statiques doublonnent la route dynamique (`brain-circuit.astro`, `claude-cowork-rollout.astro`, `ai-act-readiness.astro`).

### 2.8 Agence (pages identitaires)

**Verdict : 🟡 PARTIELLEMENT COHÉRENTES**

| Sous-groupe | Template | Cohérence |
|---|---|---|
| about + methode | UtilityTemplate (align=left) | ✅ Cohérent |
| governance + trust-center | TrustLegalTemplate | ✅ Cohérent |
| design-system, docs, careers, prompts | Inconnu | ❌ Non audité |

### 2.9 Bienvenue (5 pages)

**Verdict : ✅ COHÉRENTES**

Toutes `WelcomeTemplate`. Taxonomie la plus uniforme du site.

---

## Section 3 · Cohérence inter-taxonomie {#section-3}

### 3.1 Solutions hub vs Offres hub

| Critère | Solutions hub | Offres hub |
|---|---|---|
| Layout hero | `.hub-h1` + `.hub-lede` + SVG géométrique | `.hub-h1` + `.hub-lede` + Pyramide SVG tiers |
| Structure body | Grid 5 cards horizontales | Pyramide tiers 3 niveaux |
| Pattern nav | Kicker + H1 + lede + grid | Kicker + H1 + lede + pyramid + tier sections |
| CTA | `Voir la solution →` | Per-tier |

**Verdict : Intentionnellement différents.** Solutions = catalogue plat horizontal. Offres = hiérarchie tiers. Différence justifiée par la nature des contenus. Mais la pyramide SVG est une brique signature haut niveau (non accessible depuis mobile petit écran potentiellement). À vérifier.

### 3.2 Cas hub vs Ressources hub

| Critère | Cas hub | Ressources hub |
|---|---|---|
| Template | Custom Base inline | Custom Base inline |
| Structure body | Featured card + grid 3 | Sections multiples (tools/cases/blog/cookbooks) |
| Data | Hardcodé 4 cas | Hardcodé multi-collections |

**Verdict : Non standardisés.** Deux hubs custom qui auraient pu partager un pattern `HubTemplate` avec slots. Chaque fois réinventé.

### 3.3 Blog index vs Cookbooks index vs Veille-IA index

| Critère | Blog | Cookbooks | Veille-IA |
|---|---|---|---|
| Template | ListIndexTemplate | ListIndexTemplate | ListIndexTemplate |
| Data source | `FIELD_NOTES` static | `getCollection('cookbooks')` | `getCollection('veille-ia')` |
| Row component | EditorialWriteRow | ? | ? |

**Verdict : ✅ Templates cohérents** — ListIndexTemplate utilisé uniformément. Gap : blog/index.astro consomme un sitemap static au lieu de `getCollection('blog')` → **incohérence dans la source de données**.

### 3.4 Agence pages vs Utility pages

| Critère | Agence about/methode | Contact | 404 |
|---|---|---|---|
| Template | UtilityTemplate (left) | UtilityTemplate (centered) | Custom Base inline |
| Pattern slots | headline + lede + body | headline + lede + body | Inline |

**Verdict : ✅ Cohérent sur about/methode/contact (UtilityTemplate).** `404.astro` aurait pu utiliser UtilityTemplate mais la décision de l'auteur (commentaire inline) était délibérée (1 instance, surcoût > bénéfice). Accepté.

### 3.5 Glossaire vs Comparer vs Intégrations (hubs taxonomiques)

| Critère | Glossaire | Comparer | Intégrations |
|---|---|---|---|
| Template | Custom Base inline | Custom Base inline | Custom Base inline (+ JS filtres) |
| Pattern hero | `glossary-index__hd` + Kicker | `comparisons-index__hd` + Kicker | `integrations-index__hd` + Kicker |
| Data source | `getCollection('glossary')` ✅ | `getCollection('comparisons')` ✅ | `getCollection('integrations')` ✅ |

**Verdict : Pattern hub-custom répété 3× avec CSS ad-hoc** (`.glossary-index__*`, `.comparisons-index__*`, `.integrations-index__*`). Candidats idéaux pour un `ListIndexTemplate` variant ou un nouveau template `TaxonomicHubTemplate`. La structure est quasi-identique (header + groupes par catégorie + grid cards). Seul différenciateur : filtres JS côté client pour intégrations.

---

## Section 4 · Composants/sections sous-utilisés mais excellents {#section-4}

### 4.1 ProofBar (organism) — pépite sous-utilisée

| Attribut | Valeur |
|---|---|
| **Lieu d'origine** | `index.astro` (home) |
| **Structure** | 4 métriques massives Instrument Serif + accent terracotta. Style éditorial FT/Bloomberg. |
| **Pages qui l'utilisent** | Home uniquement |
| **Pages qui DEVRAIENT l'utiliser** | `/cas/*` (Acte IV chiffres), `/offres/conseil`, `/offres/revops`, `/offres/audit-maturite-ia` |
| **Pourquoi c'est mieux** | Stats massives 88px + typographie Instrument Serif = hiérarchie visuelle maximale (axe 6 + 13). Contraste avec ProofBand molecule (texte citation + metrics smaller scale). |
| **Note** | `CaseStudyTemplate` utilise `ProofBand` (molecule, plus discret) au lieu de `ProofBar` (organism, impact maximal). Choix probablement délibéré pour équilibre narratif long-form, mais mérite discussion. |

### 4.2 SystemArchitecture (organism) — pépite méconnue

| Attribut | Valeur |
|---|---|
| **Lieu d'origine** | `index.astro` (home) |
| **Structure** | Diagramme architectural SVG/composant — représentation visuelle des systèmes câblés |
| **Pages qui l'utilisent** | Home uniquement |
| **Pages qui DEVRAIENT l'utiliser** | `/agence/methode` (montrer l'architecture de Process Intelligence), `/offres/conseil` (montrer l'architecture audit), `/offres/revops` (funnel + système) |
| **Pourquoi c'est mieux** | Axe 7 (col droite démo visuelle workflow). L'agence/methode utilise Timeline + SVG MethodeProcessDiagram — mais SystemArchitecture est plus systémique et montre la profondeur technique. |

### 4.3 PersonaSwitcher (organism) — inexploité

| Attribut | Valeur |
|---|---|
| **Lieu d'origine** | Listé dans la librairie composants (doc 22) |
| **Pages qui l'utilisent** | **Aucune visible dans l'audit** |
| **Pages idéales** | `/solutions/index.astro` (switch entre types de douleurs), `/offres/index.astro` (switch entre tiers acheteur), `/ressources/personas/index.astro` |
| **Pourquoi c'est mieux** | Interaction contextuelle sans chargement page. Permettrait à `/ressources/personas` d'avoir une vraie UX de discovery. |

### 4.4 TaxonomyMenu (molecule) — sous-utilisé

| Attribut | Valeur |
|---|---|
| **Lieu d'origine** | Librairie molecules (doc 22) |
| **Pages idéales** | `/ressources/index.astro`, `/ressources/blog/index.astro`, `/glossaire/index.astro` |
| **Pourquoi c'est mieux** | Navigation taxonomique native — permettrait de filtrer blog par type (essai/notes/avis/post) sans JS custom. |

### 4.5 AtlasConnections (motion) — pépite visible uniquement sur /atlas

| Attribut | Valeur |
|---|---|
| **Lieu d'origine** | `/atlas.astro` |
| **Structure** | SVG animé — réseau de connexions (React island) |
| **Pages idéales** | `/agence/about` (réseau expertise + clients), `/solutions/index.astro` (connexions solutions ↔ secteurs) |
| **Pourquoi c'est mieux** | Axe 7 — démo visuelle unique qui montre la pensée systémique Waimia. Actuellement enfermé dans /atlas. |

### 4.6 ConversionFunnelTemplate — template potentiellement réutilisable

| Attribut | Valeur |
|---|---|
| **Lieu d'origine** | `/offres/site-web-ia.astro` |
| **Structure** | Hero stats → Steps → Pricing tiers 3 niveaux (features + CTA par tier) |
| **Pages candidates** | D'autres offres avec pricing explicite. Actuellement, `conseil/revops/audit-maturite-ia` n'ont pas de pricing tiers structuré. |
| **Pourquoi c'est mieux** | Structure narrative complète (découverte → décision → achat) avec pricing table NYT-style |

### 4.7 EditorialTable (editorial) — sous-utilisé

| Attribut | Valeur |
|---|---|
| **Lieu d'origine** | `/offres/conseil.astro` (tableau comparatif 7 services) |
| **Pages idéales** | `/cas/*` (tableau Constat/Cause/Levier mentionné dans doc 12 brief CaseStudyTemplate), `/agence/trust-center` (tables conformité) |
| **Pourquoi c'est mieux** | Meilleure hiérarchie visuelle que bullet lists. Lecture rapide décisionnaire. |

---

## Section 5 · Drift design détectés {#section-5}

### 5.1 CRITIQUE — Secteurs statiques legacy (services-b2b, finance-compta, industrie)

| Critère | Situation observée | Sévérité |
|---|---|---|
| **Template** | Aucun — Base + sections hardcodées inline | 🔴 CRITIQUE |
| **Hero class** | `.mast-h1` (custom) au lieu de `.hub-h1` (système) | 🔴 |
| **SVG** | Inline brut dans le fichier page — pas de composant svg/sumie/ ou svg/geometric/ | 🟠 |
| **CTA** | `<a class="back-link">← Tous les secteurs</a>` — lien texte sans composant Button | 🟠 |
| **Schema.org** | Absent | 🟠 |
| **Breadcrumb** | Absent | 🟡 |
| **14 axes hero** | Axes 4 (catégories), 5 (CTA), 6 (stats), 7 (col droite), 8 (espacement strict) = tous violés | 🔴 |
| **Coexistence** | Route dynamique `secteurs/[...slug].astro` → SolutionsDetailTemplate correcte. Pages statiques créent une ambiguïté (laquelle affiche en prod ?) | 🔴 |

**Impact** : 2 (potentiellement 3) pages secteurs affichent un design de niveau 2019 aux côtés de pages SolutionsDetailTemplate niveau 2026. Rupture de perception de marque majeure.

### 5.2 ÉLEVÉ — `ressources/index.astro` hardcode des données stale

| Critère | Situation observée | Sévérité |
|---|---|---|
| **Data** | `caseCards` liste 5 cas avec href `/ressources/cas/plateau` — URL probablement 404 (vraie URL = `/cas/plateau`) | 🔴 |
| **Anti-pattern** | Hub agrégateur qui copie-colle les données des collections sans les consommer → drift garanti à chaque ajout de contenu | 🟠 |
| **Architecture** | Devrait utiliser `getCollection('cases')` + `getCollection('blog')` + `getCollection('cookbooks')` pour rester en sync | 🟠 |

### 5.3 ÉLEVÉ — Pages statiques doublonnent les routes dynamiques

| Page statique | Route dynamique | Collection source |
|---|---|---|
| `ressources/blog/brain-circuit.astro` | `ressources/blog/[...slug].astro` | `blog` |
| `ressources/cookbooks/claude-cowork-rollout.astro` | `ressources/cookbooks/[...slug].astro` | `cookbooks` |
| `ressources/cookbooks/claude-skills-tutorial.astro` | idem | idem |
| `ressources/cookbooks/mcp-server-deploy.astro` | idem | idem |
| `ressources/livres-blancs/ai-act-readiness.astro` | `ressources/livres-blancs/[...slug].astro` | `livres-blancs` |
| `cas/plateau.astro` | `cas/[...slug].astro` | `cases` |
| `cas/halcyon.astro` | idem | idem |
| `cas/northbound.astro` | idem | idem |
| `cas/caserne.astro` | idem | idem |

**Impact** : 9 pages statiques qui doublonnent les routes dynamiques. Maintenance 2× (modifier contenu en 2 endroits). Risk 404 si slug static ≠ slug MDX.

### 5.4 MODÉRÉ — `archive.astro` importe Header + Footer directement

| Critère | Situation observée | Sévérité |
|---|---|---|
| **Anti-pattern** | `import Header from '../components/header/Header.astro'` + `import Footer from '../components/footer/Footer.astro'` dans une page qui utilise déjà `import Base` — `Base.astro` inclut déjà Header/Footer | 🟠 |
| **Impact** | Header/Footer dupliqués sur `/archive` → problème UX potentiel (double nav) | 🟠 |

### 5.5 MODÉRÉ — `test-composable.astro` page résiduelle

| Critère | Situation observée |
|---|---|
| **Problème** | Page de test en production (accessible via `/test-composable`) |
| **Impact** | Indexation potentielle par bots, contenu non-éditorial exposé |

### 5.6 MODÉRÉ — Incohérence CTA final cross-templates

| Template / Page | CTA final pattern |
|---|---|
| `SolutionsDetailTemplate` | CTA dept-augmented dark (H2 personnalisé + body) |
| `OffresDetailTemplate` | CtaBand organism standard |
| `CaseStudyTemplate` | CtaBand organism standard |
| `ServiceDetailTemplate` | CtaBand organism standard |
| `HubTemplate` | Non vérifié |
| Secteurs statiques | `<a>` texte inline non-système |

**Verdict** : SolutionsDetailTemplate a un CTA final plus riche (H2 personnalisé « Votre équipe X, augmentée. »). Les autres templates utilisent CtaBand générique. Pas forcément un drift (SolutionsDetail est spécialisé) mais à documenter.

### 5.7 MODÉRÉ — 4 tokens CSS fantômes actifs (doc 22)

```css
var(--text-display-xl)   → ❌ NON DÉFINI → h1 reçoit undefined → fallback navigateur
var(--text-display-lg)   → ❌ NON DÉFINI → h2
var(--text-display-sm)   → ❌ NON DÉFINI → h3
var(--text-mono-lg)      → ❌ NON DÉFINI → code
```

**Impact** : Rupture typographique en production sur TOUTES les pages qui utilisent les sélecteurs h1/h2/h3 natifs via `global.css`. Sévérité élévée transversale.

### 5.8 MODÉRÉ — `ressources/blog/index.astro` consomme `FIELD_NOTES` statique

Blog index n'utilise pas `getCollection('blog')` mais un tableau `FIELD_NOTES` importé de `src/data/sitemap`. Les articles ajoutés en MDX à la collection `blog` n'apparaissent pas automatiquement dans l'index.

### 5.9 FAIBLE — Hubs glossaire/comparer/intégrations réinventent le même pattern

Trois hubs avec structure identique (header + groupes catégories + grid) et CSS custom spécifique (`.glossary-index__*`, `.comparisons-index__*`, `.integrations-index__*`). Candidats à une abstraction commune.

---

## Section 6 · Plan de remédiation par batch {#section-6}

### Batch A · Pages signature standalone (Home + Manifesto + Atlas + Console)
**Statut** : ✅ FAIT — refactor complet V5-V7.
**Pages** : 4 FR + 4 EN (sync contenu EN à finaliser).
**Effort résiduel** : 2-4h (sync contenu EN).
**Risque visuel** : Faible.
**Dépendances** : Aucune.

---

### Batch B · Solutions par problème — homogénéisation hubs + data

**Pages impactées** : 2 pages (solutions/index + solutions/[...slug])
**Problèmes** : Hub hardcodé (pas getCollection). Data potentiellement stalée.
**Actions** :
1. Migrer `solutions/index.astro` vers `getCollection('solutions')` + slot sections
2. Vérifier cohérence des 8 MDX solutions vs liste hub
3. Audit contenu 14 axes sur les 8 pages detail (hors template)

**Effort estimé** : 80 LoC modifications
**Risque visuel** : Faible (template déjà refactoré)
**Dépendances** : Aucune (independant des autres blocs)

---

### Batch C · Secteurs — ÉLIMINATION DRIFT CRITIQUE

**Pages impactées** : 5 pages (`secteurs/index`, `secteurs/services-b2b`, `secteurs/finance-compta`, `secteurs/industrie`, `secteurs/[...slug]`)
**Problèmes** : 2-3 pages statiques legacy avec CSS ad-hoc, `.mast-h1` non-système, SVG inline.

**Actions** :
1. **Supprimer** `secteurs/services-b2b.astro` et `secteurs/finance-compta.astro` (route dynamique via collection existe déjà)
2. Vérifier `secteurs/industrie.astro` (TS error documenté ligne 105) — probablement aussi à supprimer
3. Vérifier que les 3 MDX dans `content/secteurs/` couvrent les 3 secteurs (services-b2b, finance-compta, industrie)
4. Migrer `secteurs/index.astro` vers `getCollection('secteurs')` si pertinent

**Effort estimé** : 40 LoC modifications + 3 fichiers supprimés
**Risque visuel** : Faible (remplacement par SolutionsDetailTemplate meilleur visuellement)
**Dépendances** : Vérifier content/secteurs/ avant suppression des statiques

---

### Batch D · Offres niveaux — harmonisation templates

**Pages impactées** : 3 pages (`offres/conseil`, `offres/revops`, `offres/audit-maturite-ia`)
**Problèmes** : 3 templates différents pour des offres Tier II/III. `revops` et `audit-maturite-ia` ont des structures proches mais pas le même template.

**Actions** :
1. Décider si `revops` et `audit-maturite-ia` peuvent migrer vers `OffresDetailTemplate` ou `ServiceDetailTemplate`
2. Refactorer `DetailMenuTemplate` et `HubTemplate` avec les 14 axes Simon (hero)
3. CTA final standardisé sur les 3 pages

**Effort estimé** : 200 LoC modifications
**Risque visuel** : Modéré (changement structurel des 3 pages)
**Dépendances** : Décision architecturale Simon requise (template unique vs templates spécialisés)

---

### Batch E · Offres pillier — audit contenu 14 axes

**Pages impactées** : 8 pages via `offres/[...slug].astro` + `OffresDetailTemplate`
**Problèmes** : Template refactoré mais contenu MDX individuel non audité (14 axes hero). Slot `faq` / `inclusions` / `pricing` pas peuplés sur toutes les offres.

**Actions** :
1. Audit contenu des 8 MDX offres (title_fr, description_fr, pains, roi_metrics, stack)
2. Vérifier que chaque offre a au minimum : hero complet + pains + ROI + stack + CTA
3. Ajouter pricing table aux offres qui n'en ont pas (composable-pilot, infrastructure-ia)

**Effort estimé** : 120 LoC modifications MDX (contenu éditorial)
**Risque visuel** : Faible (modifications contenu, pas template)
**Dépendances** : Aucune

---

### Batch F · Cas client — migration architecture + refonte template

**Pages impactées** : 6 pages (`cas/index`, `cas/plateau`, `cas/halcyon`, `cas/northbound`, `cas/caserne`, `cas/[...slug]`)
**Problèmes** : 4 pages statiques hardcodées doublonnent la route dynamique. CaseStudyTemplate non refactoré V5 (14 axes hero).

**Actions** :
1. Refactorer `CaseStudyTemplate` selon brief doc 12 (Hero éditorial 14 axes + Acte I-V + ProofBar)
2. Migrer les 4 cas statiques vers collection `cases` (MDX) + supprimer les `.astro` statiques
3. Refactorer `cas/index.astro` vers `getCollection('cases')`
4. Vérifier/créer les 4 MDX manquants dans `content/cases/` (northbound, caserne restent à créer)

**Effort estimé** : 400 LoC modifications (template + migration 4 cas)
**Risque visuel** : Modéré-élevé (refonte template complet)
**Dépendances** : Refonte CaseStudyTemplate d'abord, puis migration MDX

---

### Batch G · Ressources hubs + blog par taxonomie

**Pages impactées** : 20+ pages ressources + blog/cookbooks/livres-blancs/veille-ia
**Problèmes** :
- `ressources/index.astro` hardcode data stale + URLs incorrectes (`/ressources/cas/*`)
- `ressources/blog/index.astro` consomme FIELD_NOTES static au lieu de getCollection
- Pages statiques doublons (brain-circuit, 3 cookbooks, ai-act-readiness)
- `field-notes/` vide — routes inutiles

**Actions** :
1. Migrer `ressources/index.astro` vers `getCollection()` multi-collections (cases, blog, cookbooks)
2. Corriger URLs `/ressources/cas/*` → `/cas/*`
3. Migrer `ressources/blog/index.astro` vers `getCollection('blog')`
4. Supprimer pages statiques doublons (garder uniquement route dynamique)
5. Supprimer `ressources/field-notes/` (collection vide, migration blog prévue T3.3b)
6. Refactorer `ListIndexTemplate` si gaps 14 axes détectés

**Effort estimé** : 200 LoC modifications + 5 suppressions
**Risque visuel** : Faible à modéré
**Dépendances** : Vérifier que MDX collections couvrent les slugs des pages statiques avant suppression

---

### Batch H · Agence — pages identitaires

**Pages impactées** : 8 pages agence
**Problèmes** : 4 pages non auditées (design-system, docs, careers, prompts). 2 pages UtilityTemplate sans 14 axes hero vérifiés.

**Actions** :
1. Auditer `agence/design-system.astro`, `agence/docs.astro`, `agence/careers.astro`, `agence/prompts.astro`
2. Refactorer `agence/about.astro` et `agence/methode.astro` selon 14 axes hero
3. Ajouter ProofBar ou stats block sur `agence/about.astro` (43 missions, 18 M€+ pipeline)
4. Refactorer `TrustLegalTemplate` pour governance et trust-center (14 axes hero adaptés)

**Effort estimé** : 250 LoC modifications
**Risque visuel** : Modéré
**Dépendances** : Audit d'abord, puis refonte

---

### Batch I · École + Commerce + Bienvenue

**Pages impactées** : 10 pages
**Problèmes** :
- `EcoleHubTemplate` non refactoré V5
- `ecole/[type]/[slug].astro` collision potentielle avec `ecole/cours/[slug].astro`
- `commerce/index.astro` hub custom non-template
- `WelcomeTemplate` non refactoré V5

**Actions** :
1. Résoudre la collision routes École (cours/[slug] vs [type]/[slug])
2. Refactorer `EcoleHubTemplate` selon 14 axes
3. Créer template commerce ou utiliser existant
4. Refactorer `WelcomeTemplate` (post-conversion — 14 axes adaptés)

**Effort estimé** : 300 LoC modifications
**Risque visuel** : Faible (école et commerce peu visités en phase de growth)
**Dépendances** : Résoudre collision routes École d'abord

---

### Batch J · Utility + Hubs taxonomiques secondaires + Tokens CSS

**Pages impactées** : 8 pages + tokens CSS globaux
**Problèmes** :
- 4 tokens CSS fantômes (`--text-display-xl/lg/sm`, `--text-mono-lg`) → rupture typographique h1/h2/h3 en production
- `archive.astro` double import Header/Footer
- `test-composable.astro` à supprimer
- Glossaire/comparer/intégrations — 3 hubs custom à uniformiser
- `contact.astro` 14 axes hero à vérifier

**Actions** :
1. **URGENT** : Définir les 4 tokens fantômes dans `tokens.css`
2. Supprimer `test-composable.astro`
3. Corriger `archive.astro` (retirer Header/Footer directs, utiliser Base layout)
4. Uniformiser glossaire/comparer/intégrations (même pattern CSS ou nouveau `TaxonomicHubTemplate`)
5. Refactorer `contact.astro` selon 14 axes hero

**Effort estimé** : 150 LoC modifications (dont tokens = 10 LoC prioritaires)
**Risque visuel** : **ÉLEVÉ pour les tokens** (fix global h1/h2/h3 toutes pages)
**Dépendances** : Tokens CSS = fix à livrer AVANT tous les autres batchs (transversal)

---

## Section 7 · Recommandation Phase 1 finale {#section-7}

### Bilan drift design

| Catégorie | Nombre pages | Sévérité |
|---|---|---|
| Pages avec drift design critique (tokens fantômes) | ~89 (toutes pages) | 🔴 |
| Secteurs statiques legacy hors système | 2-3 pages | 🔴 |
| Hub ressources URLs incorrectes | 1 hub (5 URLs) | 🟠 |
| Pages statiques doublonnant routes dynamiques | 9 pages | 🟠 |
| 3 templates offres niveaux incohérents | 3 pages | 🟠 |
| Hubs hardcodés non-collection-driven | 5 hubs | 🟡 |
| Pages non auditées (agence 4, utility 3) | 7 pages | 🟡 |
| Test page résiduelle | 1 page | 🟡 |

### Première action : Batch J tokens CSS (15 minutes, impact max)

**4 tokens fantômes = rupture typographique h1/h2/h3 sur TOUTES les pages en production.** Ce fix de ~10 LoC dans `tokens.css` débloque l'expression typographique correcte de tous les autres batchs. À faire avant tout le reste.

```css
/* tokens.css — à ajouter */
--text-display-xl: clamp(64px, 9vw, 132px);
--text-display-lg: clamp(40px, 5.5vw, 80px);
--text-display-sm: clamp(28px, 3.5vw, 48px);
--text-mono-lg: 14px;
```

### Batch prioritaire recommandé : Batch C (Secteurs legacy) + Batch J (tokens) en parallèle

**Raisonnement** :
- Batch J = fix tokens (faible risque, impact maximal, 10 LoC)
- Batch C = élimination du drift design le plus visible (secteurs vs solutions côte-à-côte sur le site)

Ces deux batchs sont **indépendants** (pas de fichiers partagés) et peuvent être lancés en parallèle par deux workers.

### Séquence recommandée complète

```
URGENT (avant tout) :
  1. Batch J partiel — tokens CSS (10 LoC, fix global)
  2. Batch J partiel — supprimer test-composable.astro

SEMAINE 1 :
  3. Batch C — Secteurs legacy (élimination drift critique)
  4. Batch G partiel — Corriger URLs /ressources/cas/* → /cas/*

SEMAINE 2 :
  5. Batch B — Solutions hubs + data (migration getCollection)
  6. Batch F — CaseStudyTemplate refonte + migration MDX

SEMAINE 3 :
  7. Batch E — Offres contenu 14 axes (MDX éditorial)
  8. Batch D — Offres niveaux harmonisation (décision archi requise)

SEMAINE 4 :
  9. Batch H — Agence identitaires
  10. Batch G final — Ressources migration collection-driven

SEMAINE 5-6 :
  11. Batch I — École + Commerce + Bienvenue
  12. Batch A résiduel — Sync contenu EN
```

### Lien avec Worker 1 (doc 31) et Worker 2 (doc 32)

Ce document (W3) documente **où** les drifts apparaissent par taxonomie. Il doit être croisé avec :
- **Doc 31** (Worker 1 — doublons composants) : quels composants sont dupliqués inline dans les pages secteurs statiques vs les vrais composants SVG/sumie
- **Doc 32** (Worker 2 — doublons templates) : quels templates pourraient fusionner (`DetailMenuTemplate` + `ServiceDetailTemplate` → un seul template avec variants)

**Synthèse** : Le site Waimia présente une architecture en deux vitesses — les pages refactorées V5-V7 (home, manifesto, atlas, console, solutions via collection, offres via collection) sont excellentes et au niveau benchmark design international ; les pages legacy (secteurs statiques, cas hardcodés, ressources hub statique) créent une rupture de perception notable. Le plan de remédiation en 10 batchs permet d'atteindre 100% de cohérence sans jamais compromettre les pages qui fonctionnent.

---

*Fin du document 33 · Audit Taxonomique Pages Waimia · 2026-05-17*
