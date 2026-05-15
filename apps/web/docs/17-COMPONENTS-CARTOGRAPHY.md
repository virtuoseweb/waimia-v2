# Waimia · Cartographie complète components 2026-05-15

> Inventaire exhaustif de TOUS les components du repo + détection doublons + plan consolidation.
> Cf docs/15-STRATEGIC-AUDIT.md Tier 2 architecture composable.

---

## Inventaire actuel (114 components répertoriés)

### Atoms (10) — `src/components/ui/atoms/`

| Component | Usage | Statut |
|---|---|---|
| `Bi.astro` | Bilingual text helper | ✅ Garder |
| `Button.astro` | Bouton CTA (variants: primary/accent/ghost/ghost-dark) | ✅ Garder |
| `ChapterLabel.astro` | Label chapitre éditorial | ✅ Garder |
| `CursorDot.astro` | Curseur custom terracotta | ✅ Garder |
| `Kicker.astro` | Label mono uppercase (variants: muted/accent/dim) | ✅ Garder |
| `PillCTA.astro` | CTA pilule | ✅ Garder |
| `ProgressBar.astro` | Barre progression générique | ✅ Garder |
| `ScrollProgress.astro` | Barre progression scroll fixée top | ✅ Garder |
| `SectionTransition.astro` | Phrase narrative entre sections | ✅ Garder |
| `TerminalCTA.astro` | CTA terminal style (console) | ✅ Garder |

### Molecules (30) — `src/components/ui/molecules/`

Tous OK ou à statuer :

| Component | Usage | Statut |
|---|---|---|
| `AsymmetricServiceRow` | Row service alterné gauche/droite | ✅ Garder |
| `AuthorByline`, `AuthorCard` | Affichage auteur | ✅ Garder |
| `Breadcrumb` | Fil d'Ariane | ✅ Garder |
| `CalEmbed.astro` / `CalEmbedReact.tsx` | Cal.com embed (React island) | ✅ Garder |
| `EditorialCaseCard` | Card cas client | ✅ Garder |
| `EditorialWriteRow` | Row chronologique éditorial | ✅ Garder |
| `FitColumns` | Layout col fit-content | ✅ Garder |
| `MastheadRow` | Bande mono 4 colonnes | ✅ Garder |
| `MetricStrip` / `StatRow` / `ProofBand` | 3 variants stats inline | ⚠️ Rationaliser en 1 (utiliser `ProofBar` section) |
| `NewsletterSignup` | Form newsletter inline | ✅ Garder |
| `PagePill` / `PagePillIsland` (React) | Pill page nav | ✅ Garder |
| `PricingTier` | 1 tier pricing | ⚠️ Sub-component de `PricingTable` section |
| `ProcessSteps` | Steps numérotés | 🚨 **DOUBLON** avec `MethodTimeline` section |
| `RelatedByCluster` / `RelatedCards` | Cross-link articles | ⚠️ Rationaliser |
| `SectionHeader` | Header section générique | ✅ Garder (utilisé par sections) |
| `ServiceCatalogRow` | Row catalogue service | ✅ Garder |
| `ShareButtons` | Boutons partage social | ✅ Garder |
| `TableOfContents` | TOC sticky article | ✅ Garder |
| `TagPills` | Pills tags inline | ✅ Garder |
| `TaxonomyMenu` | Menu taxonomique | ✅ Garder |
| `TechPillRow` | Pills technologies | ✅ Garder |
| `TerminalMockup` / `TerminalTable` | Console UI | ✅ Garder (signature) |
| `TunnelNav` | Nav tunnel multi-step | ✅ Garder (utilisé `TunnelStepTemplate`) |

### Organisms (25) — `src/components/ui/organisms/` — 🚨 DOUBLONS MAJEURS

**Sections-equivalent organisms (à transformer en sections futures)** :

| Organism | Doublon section | Décision |
|---|---|---|
| `Hero.astro` | `HeroSplit.astro` (sections, W6) | 🚨 **CONFLIT** — Hero home est dépendant d'org-specific (ProofBar, CapabilityStrip). Garder pour home seule, migrer offres/solutions sur `HeroSplit` section |
| `ProofBar.astro` | `ProofBar.astro` (sections, W6) | 🚨 **CONFLIT NOM IDENTIQUE** — Renommer organism `ProofBarLegacy.astro` OU section `ProofBarSection.astro`. Décision : section reste canonique, organism deprecate |
| `CapabilityStrip.astro` | `FeatureGrid.astro` (sections, W6) | ⚠️ Migration vers section, organism deprecated |
| `TrustMarquee.astro` | `SocialProof.astro` (sections, W6) | ⚠️ Migration |
| `CtaBand.astro` | `CtaBand.astro` (sections, futur) | 🚨 **DOUBLON NOM** — section future = canonique |
| `Pyramid.astro` | `MethodTimeline.astro` (sections, W6) | ⚠️ Migration ou garder pour `/atlas` spécifique |

**Organisms uniques (à garder en l'état)** :

| Organism | Rationale |
|---|---|
| `AtlasGrid` | Spécifique `/atlas` (grille 4 piliers) |
| `BookSession` | Spécifique CTA booking |
| `Cases` | Grille cas pour home |
| `CookiesBanner` | Cookie consent |
| `Departments` | Liste départements home |
| `FieldNotes` | Liste notes terrain |
| `FooterMarquee` | Marquee footer |
| `HowWeShip` | Section "comment on livre" |
| `Manifesto` / `ManifestoAccent` | Spécifique `/manifesto` |
| `Offices` | Bureaux Paris/Genève |
| `OperatingLayer` | Layer signature Waimia |
| `PersonaSwitcher` | Switcher CEO/CTO/DSI |
| `SigBand` | Bande signature |
| `SixServices` | 6 services Waimia |
| `Stub` | Placeholder |
| `SystemArchitecture` | SVG architecture canonique |
| `WhyAIStalls` | Section explicative |
| `WritingNotes` | Notes éditoriales |

### Editorial (8) — `src/components/editorial/`

Tous **micro-components body** (pas en doublon avec sections) :
- Callout, Dingbat, DropCap, PullQuote, Sidenote
- EditorialTable, KeyMetric, Timeline

✅ Tous garder, utilisables dans body MDX ou wrappés par sections.

### Motion (4) — `src/components/motion/`

- `AtlasConnections.astro` — SVG animé connexions (unique)
- `BootSplash.astro` (CSS pur depuis V2 2026-05-15)
- `LiquidHero.tsx` — React canvas RAF (unique, justifié)
- `ProductReel.tsx` — React sticky scroll (unique, justifié)

✅ Tous garder.

### Sections (8 livrées par W6 partial) — `src/components/sections/`

- `HeroSplit.astro` ✅
- `HeroCentered.astro` ✅
- `HeroFullBleed.astro` ✅
- `ProofBar.astro` ✅
- `StatBlock.astro` ✅
- `SocialProof.astro` ✅
- `MethodTimeline.astro` ✅
- `FeatureGrid.astro` ✅
- `SectionsRenderer.astro` ✅
- Manquant (W6 doit livrer) : ComparisonTable, TimelineBlock, MediaBlock, PricingTable, FaqAccordion, ObjectionHandler, CtaFinal, CtaBand, CtaInline, TestimonialBlock, GuaranteeBlock (11 restants)

### Templates (18) — `src/components/templates/`

À phase out progressivement, remplacés par `SectionsRenderer` data-driven :
- AuthorPageTemplate · CaseStudyTemplate · ConversionFunnelTemplate · DetailMenuTemplate · EcoleHubTemplate · EssayTemplate · FormationDetailTemplate · HubTemplate · LeadMagnetTemplate · ListIndexTemplate · OffresDetailTemplate · ServiceDetailTemplate · SolutionsDetailTemplate · TechnologiesDetailTemplate · TrustLegalTemplate · TunnelStepTemplate · UtilityTemplate · WelcomeTemplate

### SVG (geometric + sumie subdirs)

À auditer en détail. Probablement `GrowthSystemDiagram`, `RevOpsFunnel`, etc.

### Autres (4)

- `footer/Footer.astro`
- `seo/FAQ.astro` ⚠️ peut-être doublon avec `FaqAccordion` section future
- `seo/JsonLd.astro`
- `header/Header.astro`

---

## 🚨 Doublons critiques détectés (5)

| # | Doublon | Action |
|---|---|---|
| 1 | `organisms/Hero.astro` ↔ `sections/HeroSplit.astro` | Hero home reste pour cas spécifique (déps custom), HeroSplit canonique pour offres/solutions/tech |
| 2 | `organisms/ProofBar.astro` ↔ `sections/ProofBar.astro` | **Renommer organism en `ProofBarLegacy.astro` immédiatement** pour éviter import collision |
| 3 | `organisms/CapabilityStrip.astro` ↔ `sections/FeatureGrid.astro` | Migration pages → FeatureGrid, organism deprecated |
| 4 | `organisms/TrustMarquee.astro` ↔ `sections/SocialProof.astro` | Migration → SocialProof |
| 5 | `organisms/CtaBand.astro` ↔ `sections/CtaBand.astro` (futur W6) | Idem |
| 6 | `molecules/ProcessSteps.astro` ↔ `sections/MethodTimeline.astro` | Migration |

## Plan consolidation

### Étape 1 · Immédiate (cette session)

- [ ] Renommer `organisms/ProofBar.astro` → `organisms/ProofBarLegacy.astro` (éviter conflit import)
- [ ] Renommer `organisms/CtaBand.astro` → `organisms/CtaBandLegacy.astro`

### Étape 2 · Post W6 (quand 19 sections livrées)

- [ ] Diff exhaustif `organisms/Hero` vs `sections/HeroSplit` : props alignées ?
- [ ] Si props alignées → SearchReplace `import Hero` → `import HeroSplit` dans pages, deprecate organism
- [ ] Idem pour CapabilityStrip, TrustMarquee, Pyramid

### Étape 3 · Phase migration pages → composable (Tier 2.4)

- [ ] Pages offres/[slug] : migrer en `sections[]` array consommé par `SectionsRenderer`
- [ ] Templates monolithiques deprecated quand migration complète

---

## ✅ Q2 audit traduction content (deleted → MDX)

**Verdict** : 13/15 pages OK ou enrichies. 2/15 pages avec **FAQ perdues** restaurées :

| Page | Hardcoded LoC | MDX LoC | FAQ original | FAQ MDX | Action |
|---|---|---|---|---|---|
| activation-ia | 52 | 127 | 0 | 0 | ✅ enrichie (244%) |
| application-ia-pme | 187 | 132 + 7 FAQ restorées | 7 | 7 ✅ | ✅ FAQ ajoutées |
| claude-cowork | 145 | 131 | 0 | 0 | 🟡 90% (acceptable, pas de FAQ originale) |
| growth-intelligence | 55 | 138 | 0 | 0 | ✅ enrichie (250%) |
| **growth-system-ia** | **262** | **138 + 8 FAQ restorées** | **8** | **8 ✅** | ✅ **FAQ critiques ajoutées** |
| infrastructure-ia | 93 | 136 | 0 | 0 | ✅ enrichie (146%) |
| productivite-operationnelle-ia | 55 | 138 | 0 | 0 | ✅ enrichie (250%) |
| Solutions (8 pages) | 68-200 | 173-217 | n/a | n/a | ✅ Toutes enrichies ou ratio > 86% |

**Pas de FAQ perdues sur Solutions** (les pages hardcoded n'utilisaient pas pattern `{ q, a }`).

Pour les pages avec ratio LoC < 100% (claude-cowork 90%, finance 86%, growth-system-ia 52%) : audit content détaillé à faire si Simon constate manque sur ces pages spécifiques. Le worker a peut-être trimé du copy non-essentiel.

---

_Doc maintenu par Opus. À update après chaque livraison W6+ et phase de consolidation._
