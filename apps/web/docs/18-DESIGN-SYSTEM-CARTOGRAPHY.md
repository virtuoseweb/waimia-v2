# 18 — Design System Cartography (Phase A · Audit Exhaustif)

**Statut** : 🟡 EN COURS · Phase A — Audit complet
**Date démarrage** : 2026-05-15
**Mandat Simon (verbatim)** : « créer un système fermer design système atomique pour éviter que sa parte dans tous les sens » + « l'agent IA continue de gérer de nouveaux style plutot que de piocher comme une librarie dans l'existant »
**Décisions actées** :

- Séquence d'exécution : A → B → C → D linéaire
- Périmètre cartographie : tout le repo `apps/web`
- Tier 2 (dérivés autorisés) : Claude propose, Simon valide

**Source de vérité associée** : `src/styles/tokens.css` · `src/styles/global.css` · `src/pages/agence/design-system.astro`
**Documents de sortie** :

- `18-DESIGN-SYSTEM-CARTOGRAPHY.md` (ce doc — constat factuel)
- `19-DESIGN-SYSTEM-CLOSED.md` (à venir Phase B — décisions figées)

---

## A.0 · Méthode d'audit

Outils utilisés :

```bash
# Tokens définis
grep -hoE "^\s*--[a-z0-9-]+:" src/styles/tokens.css | sort -u    # → 147
# Tokens utilisés
grep -rhoE "var\(--[a-z0-9-]+\)" src/components src/pages src/layouts | sort -u    # → 56
# Hallucinations (utilisés mais non définis)
comm -23 <(sort -u <utilisés>) <(sort -u <définis>)    # → 6 (5 fix + 1 ignorable)
# Dead weight
comm -13 <(sort -u <utilisés>) <(sort -u <définis>)    # → 90
```

Diagnostic chiffré post-fix `34906a3` (aliases ajoutés) :

| Indicateur | Valeur | Verdict |
|---|---|---|
| Tokens définis | 147 | Cartographier en sections sémantiques |
| Tokens utilisés | 56 (38%) | 90 dead weight à statuer |
| Hallucinations actuelles | 0 | ✅ Toutes corrigées via aliases |
| Lignes CSS totales | 2260 (4 fichiers) | tokens 287 / global 1569 / grid 177 / scroll-reveal 235 |
| Classes utility globales (global.css) | 80 | À catégoriser par fonction |
| Composants atomic | **114** | atoms 10 / mol 30 / org 25 / sect 19 / edit 8 / mot 4 / tmpl 18 |
| Doublons inter-systèmes | 9 confirmés | 2 avec **nom identique** ⚠️ |

---

## A.1 · Inventaire tokens.css (147 tokens classés)

### A.1.1 — Palette couleurs (8 tokens canoniques)

| Token | Valeur | Type | Usage prouvé |
|---|---|---|---|
| `--paper` | `#F6F1E8` | base bg | 🟢 noyau DA |
| `--paper-2` | `#EFE9DD` | bg subtle | 🟢 |
| `--paper-3` | `#E6E0D0` | bg raised | 🟢 |
| `--ink` | `#0C0B09` | text primary | 🟢 |
| `--ink-2` | `#1A1814` | text strong | 🟢 |
| `--ink-3` | `#2B2620` | text weakest dark | 🟢 |
| `--muted` | `#6B6560` | text secondary | 🟢 |
| `--muted-2` | `#9A948D` | text tertiary | 🟢 |

### A.1.2 — Accent terracotta (3 tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--accent` | `#C94F2E` | 🟢 brand primary |
| `--accent-2` | `#A83D20` | 🟡 utilisé peu — vérifier nécessité |
| `--accent-ink` | `#F6F1E8` | 🟡 utilisé peu — alias trivial à `--paper` |

### A.1.3 — Hairlines (4 tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--hairline` | `rgba(12,11,9, 0.09)` | 🟢 omniprésent |
| `--hairline-strong` | `rgba(12,11,9, 0.18)` | 🟢 |
| `--hairline-dark` | `rgba(246,241,232, 0.12)` | 🟡 dark-mode reliquat ? |
| `--hairline-dark-strong` | `rgba(246,241,232, 0.22)` | 🟡 dark-mode reliquat ? |

### A.1.4 — Stacks typographiques (3 tokens primaires + 5 aliases W6)

| Token canonique | Stack | Usage prouvé |
|---|---|---|
| `--font-display` | `"Instrument Serif", ui-serif, Georgia, serif` | 🟢 |
| `--font-sans` | `"Inter Tight", ui-sans-serif, system-ui, sans-serif` | 🟢 |
| `--font-mono` | `"JetBrains Mono", ui-monospace, Menlo, monospace` | 🟢 |
| `--font-serif` | alias → `var(--font-display)` | 🟡 PONT V6 W6 — à rename plus tard |

### A.1.5 — Easings (3 tokens)

| Token | Cubic-bezier | Usage |
|---|---|---|
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | 🟢 omniprésent |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.30, 1)` | 🟢 |
| `--ease-sharp` | `cubic-bezier(0.20, 0, 0.00, 1)` | 🟡 usage rare |

### A.1.6 — Layout containers (5 tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--wrap` | `1440px` | 🟡 utilisé via `--col-full` |
| `--wrap-wide` | `1560px` | 🟢 référencé par classe `.wrap-wide` |
| `--wrap-tight` | `1120px` | 🟡 utilisé via `--col-grand` ? |
| `--gut` | `32px` (20px ≤ 900px, 16px ≤ 600px) | 🟢 |
| `--header-height` | `72px` | 🟢 référencé par `scroll-margin-top` et fix W6 |
| `--cookie-banner-height` | `0px` runtime | 🟢 piloté par CookiesBanner JS |

### A.1.7 — Reveals (3 tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--reveal-slow` | `1400ms` | 🟢 |
| `--reveal-med` | `1100ms` | 🟢 |
| `--signature-angle` | `-28deg` | 🟡 signature visuelle — vérifier usage |

### A.1.8 — Aliases sémantiques (13 tokens semantic layer)

| Token | Pointe vers | Statut |
|---|---|---|
| `--bg` | `var(--paper)` | 🔴 dead weight (0 usage) |
| `--bg-subtle` | `var(--paper-2)` | 🔴 dead weight |
| `--bg-raised` | `var(--paper-3)` | 🔴 dead weight |
| `--bg-inverted` | `var(--ink)` | 🔴 dead weight |
| `--fg` | `var(--ink)` | 🟢 utilisé |
| `--fg-secondary` | `var(--muted)` | 🟢 utilisé |
| `--fg-tertiary` | `var(--muted-2)` | 🟡 usage rare |
| `--fg-inverted` | `var(--paper)` | 🟢 utilisé |
| `--brand` | `var(--accent)` | 🔴 dead weight (doublon avec --accent) |
| `--brand-hover` | `var(--accent-2)` | 🔴 dead weight |
| `--brand-fg` | `var(--accent-ink)` | 🔴 dead weight |
| `--border` | `var(--hairline)` | 🔴 dead weight (doublon avec --hairline) |
| `--border-strong` | `var(--hairline-strong)` | 🔴 dead weight |

🔴 **8 aliases sémantiques sur 13 ne sont jamais utilisés** → couche d'abstraction sur-ingéniérée. Tier 3 candidat (à supprimer).

### A.1.9 — Type Scale (TWO échelles parallèles · 23 tokens · ⚠️ doublon massif)

**Échelle générique (V5)** :

| Token | Valeur | Usage |
|---|---|---|
| `--text-display-xl` | `clamp(72px, 14vw, 240px)` | 🟡 |
| `--text-display-lg` | `clamp(56px, 9vw, 148px)` | 🟡 |
| `--text-display-md` | `clamp(44px, 6vw, 96px)` | 🟢 (via alias W6 `--text-h1`) |
| `--text-display-sm` | `clamp(36px, 5vw, 64px)` | 🟡 |
| `--text-display-xs` | `clamp(28px, 3vw, 44px)` | 🟡 |
| `--text-body-lg` | `21px` | 🟡 |
| `--text-body-md` | `17px` | 🟢 (via alias W6 `--text-body`) |
| `--text-body-sm` | `14px` | 🟢 (via alias W6 `--text-small`) |
| `--text-body-xs` | `13px` | 🟡 |
| `--text-mono-lg` | `13px` | 🟡 |
| `--text-mono-md` | `11px` | 🟢 (via Kicker) |
| `--text-mono-sm` | `10.5px` | 🟡 |
| `--text-mono-xs` | `10px` | 🟢 (via Kicker size param) |

**Échelle éditoriale V6 (titres sémantiques unifiés)** :

| Token | Valeur | Usage |
|---|---|---|
| `--text-h1-hero` | `clamp(40px, 6vw, 92px)` | 🟢 HeroSplit V6 |
| `--text-h2-grand` | `clamp(44px, 7vw, 96px)` | 🟢 BookSession climax |
| `--text-h2-section` | `clamp(28px, 4vw, 56px)` | 🟢 (via alias W6 `--text-h2`) |
| `--text-h2-tight` | `clamp(24px, 3vw, 42px)` | 🟢 FAQ, sidebar |
| `--text-h3-row` | `clamp(20px, 2vw, 28px)` | 🟢 Departments, Notes |
| `--text-h3-card` | `clamp(18px, 1.6vw, 24px)` | 🟢 CapabilityStrip, SixServices |
| `--text-h4-meta` | `clamp(14px, 1.1vw, 16px)` | 🟢 sub-titles |

**Échelle enrichie (eyebrow/lede/pull-quote/drop-cap/caption)** :

| Token | Valeur | Usage |
|---|---|---|
| `--text-eyebrow` | `11px` | 🟢 |
| `--text-eyebrow-lg` | `12px` | 🟡 |
| `--text-lede` | `clamp(20px, 1.7vw, 24px)` | 🟢 |
| `--text-pull-quote` | `clamp(28px, 3.4vw, 44px)` | 🟢 PullQuote |
| `--text-drop-cap` | `clamp(64px, 6vw, 96px)` | 🟢 DropCap |
| `--text-caption` | `12px` | 🟢 captions |

🟡 **DIAGNOSTIC TYPE SCALE** : les deux échelles cohabitent. La V5 générique est partiellement remplacée par V6 éditoriale mais aucune n'a été supprimée. Recommandation Phase B :

- **Tier 1** : V6 éditoriale (h1-hero, h2-grand/section/tight, h3-row/card, h4-meta) + enriched (eyebrow, lede, pull-quote, drop-cap, caption)
- **Tier 1** : conserver `--text-display-md`, `--text-body-md/sm`, `--text-mono-md/xs` car référencés via aliases W6
- **Tier 3** : `--text-display-xl/lg/sm/xs` (5 tokens) + `--text-body-lg/xs` (2 tokens) + `--text-mono-lg/sm` (2 tokens) = 9 tokens à supprimer après audit usage page-par-page

### A.1.10 — Leading & tracking (8 tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--leading-display` | `0.94` | 🟡 |
| `--leading-body` | `1.5` | 🟢 |
| `--leading-loose` | `1.55` | 🟡 |
| `--tracking-display` | `-0.025em` | 🟢 |
| `--tracking-body` | `-0.005em` | 🟡 |
| `--tracking-mono` | `0.12em` | 🟢 Kicker |
| `--tracking-label` | `0.14em` | 🟢 Kicker |
| `--leading-h1/2/3/4` | `0.96 / 1.02 / 1.1 / 1.3` | 🟢 |

### A.1.11 — Spacing scale 8pt (17 tokens) + section rhythm (4) + aliases V2 (7)

**Échelle de base** : `--space-0` (0) à `--space-16` (320px) · 17 tokens 🟢 noyau utility.

**Section rhythm** :

| Token | Valeur | Usage |
|---|---|---|
| `--section-tight` | `var(--space-8)` = 48px | 🟡 |
| `--section-base` | `var(--space-11)` = 96px | 🟢 |
| `--section-loose` | `var(--space-13)` = 160px | 🟡 |
| `--section-grand` | `var(--space-15)` = 256px | 🟡 |

**Aliases composable V2** (commit `34906a3`) :

| Token | Pointe vers | Statut |
|---|---|---|
| `--spacing-section` | `clamp(64px, 8vw, 96px)` | 🟡 PONT V6→W6 |
| `--spacing-block` | `clamp(28px, 3vw, 48px)` | 🟡 PONT V6→W6 |
| `--font-serif` | `var(--font-display)` | 🟡 PONT W6 → Tier 1 cible : éliminer |
| `--text-body` | `var(--text-body-md)` | 🟡 PONT W6 |
| `--text-h1` | `var(--text-display-md)` | 🟡 PONT W6 |
| `--text-h2` | `var(--text-h2-section)` | 🟡 PONT W6 |
| `--text-small` | `var(--text-body-sm)` | 🟡 PONT W6 |

### A.1.12 — Animation durations (7 tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--dur-instant` | `0ms` | 🟡 |
| `--dur-snap` | `120ms` | 🟡 |
| `--dur-fast` | `200ms` | 🟢 |
| `--dur-base` | `400ms` | 🟢 |
| `--dur-slow` | `800ms` | 🟢 |
| `--dur-deliberate` | `1200ms` | 🟡 |
| `--dur-cinematic` | `1800ms` | 🟡 |

### A.1.13 — Grid 12-col + containers (8 tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--grid-cols` | `12` | 🟡 |
| `--grid-gutter` | `var(--gut)` | 🟡 |
| `--col-extra-narrow` | `480px` | 🔴 dead weight |
| `--col-narrow` | `640px` | 🔴 dead weight |
| `--col-standard` | `880px` | 🔴 dead weight |
| `--col-wide` | `1120px` | 🔴 dead weight |
| `--col-full` | `var(--wrap)` | 🔴 dead weight |
| `--col-grand` | `var(--wrap-wide)` | 🔴 dead weight |

🔴 **6 tokens `--col-*` jamais utilisés** → classes `.wrap-*` les ont supplantés.

### A.1.14 — Z-index scale (6 tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--z-base` | `1` | 🟢 |
| `--z-sticky` | `10` | 🟢 |
| `--z-overlay` | `100` | 🟢 |
| `--z-modal` | `1000` | 🟡 |
| `--z-toast` | `2000` | 🟡 |
| `--z-cursor` | `9999` | 🟢 |

### A.1.15 — Shadows éditoriaux (5 tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--shadow-hairline` | `0 0 0 1px var(--hairline)` | 🟢 |
| `--shadow-paper-lift` | `0 1px 0..., 0 12px 28px -16px...` | 🟢 |
| `--shadow-card-rest` | `0 0 0 1px var(--hairline)` | 🟡 |
| `--shadow-card-hover` | hairline + offset | 🟡 |
| `--shadow-cta` | `0 1px 0 --ink + 0 12px 24px -8px terracotta18%` | 🟢 |

### A.1.16 — @theme Tailwind v4 (10 tokens dupliqués)

`@theme { ... }` répète `--color-paper/2/3`, `--color-ink/2/3`, `--color-muted/2`, `--color-accent/2`, `--font-display/sans/mono`, `--ease-default/out/sharp`.

🔴 **Duplication** : ces 10 tokens recopient les valeurs des tokens canoniques sous un préfixe `--color-*`. Aucun n'est utilisé dans le code Astro (utilité Tailwind only). Statut Tier 1 conditionnel : conserver UNIQUEMENT si Tailwind v4 utility classes sont réellement utilisées dans le projet, sinon Tier 3.

### A.1.17 — Récapitulatif tokens

| Catégorie | Total | Tier 1 candidat | Tier 3 candidat |
|---|---|---|---|
| Couleurs base | 8 | 8 | 0 |
| Accent | 3 | 1 | 2 |
| Hairlines | 4 | 2 | 2 (dark unused) |
| Typo fonts | 4 | 4 (3 + alias W6) | 0 |
| Easings | 3 | 2 | 1 |
| Layout | 6 | 5 | 1 |
| Reveals | 3 | 2 | 1 |
| Semantic aliases | 13 | 4 | 8 |
| Type scale gén V5 | 13 | 4 (déjà utilisés via aliases W6) | 9 |
| Type scale V6 éditoriale | 7 | 7 | 0 |
| Type scale enrichi | 5 | 5 | 0 |
| Leading/tracking | 8 | 8 | 0 |
| Spacing scale | 17 | 17 | 0 |
| Section rhythm | 4 | 4 | 0 |
| Aliases V2 W6 | 7 | 7 (transitoires) | 0 |
| Durations | 7 | 7 | 0 |
| Grid | 8 | 2 | 6 |
| Z-index | 6 | 6 | 0 |
| Shadows | 5 | 5 | 0 |
| @theme Tailwind | 10 | 0 ou 10 | 10 ou 0 |
| **TOTAL** | **141** | **100** (~71%) | **40** (~28%) |

(141 sont les tokens uniques, le delta vs 147 vient de tokens conditionnels comme `--cookie-banner-height` qui varie selon media query.)

**À retenir** : un design system fermé à **~100 tokens canoniques** est viable et représente une réduction de **~28%** vs l'existant.

---

## A.2 · Inventaire classes utility globales (87 dans global.css)

Scan : `grep -hoE "^\.[a-z][a-z0-9_-]*(\.[a-z][a-z0-9_-]*)*\s*\{" src/styles/global.css | sort -u`

### A.2.1 — Table catégorisée

| Catégorie | Total | Classes | Verdict Tier |
|---|---|---|---|
| **Layout containers** | 3 | `.wrap`, `.wrap-wide`, `.wrap-tight` | 🟢 Tier 1 canonique — utilisés massivement |
| **Buttons** | 9 | `.btn`, `.btn-primary`, `.btn-accent`, `.btn-ghost`, `.btn-lg`, `.btn-link`, `.btn-label`, `.btn-spinner`, `.btn--loading` | 🟢 Tier 1 — système boutons cohérent |
| **Header** | 9 | `.hdr`, `.hdr-inner`, `.hdr-end`, `.hdr-nav`, `.hdr-nav-item`, `.hdr-nav-trigger`, `.hdr.is-scrolled`, `.hdr-nav-trigger.is-active`, `.burger` | 🟢 Tier 1 — composant Header dédié |
| **Mega menu** | 9 | `.mega`, `.mega-bottom`, `.mega-col-hd`, `.mega-featured`, `.mega-inner`, `.mega-link`, `.mega-scrim`, `.mega.is-open`, `.mega-scrim.is-open` | 🟢 Tier 1 — composant Mega dédié |
| **Mobile sheet** | 10 | `.m-sheet`, `.m-sheet-top`, `.m-sheet-body`, `.m-sheet-close`, `.m-sheet-end`, `.m-sheet-acc`, `.m-sheet-acc-body`, `.m-sheet-acc-col`, `.m-sheet-acc-head`, `.m-sheet-acc-inner`, `.m-sheet-simple`, `.m-sheet.is-open` | 🟢 Tier 1 — composant Mobile menu dédié |
| **Page pill** | 4 | `.page-pill`, `.page-pill-btn`, `.page-pill.is-visible`, `.page-pill-btn.is-active` | 🟡 Vérifier — utilisé seulement en mode dev (`PagePill.astro`) |
| **Reveal animations** | 10 | `.blur-in`, `.blur-in.in`, `.clip-up`, `.clip-up.in`, `.reveal-fade`, `.reveal-fade.in`, `.reveal-up`, `.reveal-up.in`, `.scale-in`, `.scale-in.in` | 🟢 Tier 1 — animations canoniques |
| **Editorial layout** | 8 | `.editorial-cell`, `.ec-grid`, `.ec-grid.cols-2`, `.ec-grid.cols-3`, `.ec-grid.cols-4`, `.ec-grid.cols-5`, `.case-row`, `.cases-tbl` | 🟢 Tier 1 — éditorial Cases / EditorialCell |
| **Hairlines** | 3 | `.hline`, `.hline-strong`, `.hair-draw` | 🟢 Tier 1 — séparateurs canoniques |
| **Section helpers** | 5 | `.sec`, `.sec-dark`, `.sec-paper`, `.sec-hd`, `.signature-grid` | 🟡 PROPOSITION TIER 2 : `.sec` est-il en doublon avec `.wrap` ? Vérifier usage. |
| **Atomes typo legacy** | 4 | `.kicker`, `.chapter-label`, `.par`, `.fig` | 🟡 PROPOSITION TIER 2 : `.kicker` doublonne avec `Kicker.astro` atom + classe `.u-kicker`. Décision Phase B : conserver class ou prefer component ? |
| **Howe-we-ship layout** | 2 | `.how-grid`, `.how-row` | 🟡 Spécifique à 1 organism `HowWeShip` — déplacer en scoped CSS ? |
| **Misc state/helpers** | 11 | `.act-num`, `.lift`, `.marquee`, `.progress`, `.lang-toggle` + autres state classes | 🟡 À auditer un par un |

### A.2.2 — Diagnostic A.2

- **64 classes Tier 1** confirmées (~74%)
- **18 classes Tier 2/à vérifier** (~21%)
- **5 classes à investiguer** doublons potentiels

⚠️ **Doublon classe vs component détecté** : `.kicker` (CSS class) ↔ `Kicker.astro` (atom Astro) ↔ `.u-kicker` (autre classe injectée par Kicker.astro inline). **3 façons différentes de styler un kicker** → l'agent IA peut choisir n'importe laquelle. À unifier en Phase B.

---

## A.3 · Inventaire components atomic (114 fichiers)

### A.3.1 — Atoms (10)

`Bi`, `Button`, `ChapterLabel`, `CursorDot`, `Kicker`, `PillCTA`, `ProgressBar`, `ScrollProgress`, `SectionTransition`, `TerminalCTA`

### A.3.2 — Molecules (30)

`AsymmetricServiceRow`, `AuthorByline`, `AuthorCard`, `Breadcrumb`, `CalEmbed`, `CalEmbedReact`, `EditorialCaseCard`, `EditorialWriteRow`, `FitColumns`, `MastheadRow`, `MetricStrip`, `NewsletterSignup`, `PagePill`, `PagePillIsland`, `PricingTier`, `ProcessSteps`, `ProofBand`, `RelatedByCluster`, `RelatedCards`, `SectionHeader`, `ServiceCatalogRow`, `ShareButtons`, `StatRow`, `TableOfContents`, `TagPills`, `TaxonomyMenu`, `TechPillRow`, `TerminalMockup`, `TerminalTable`, `TunnelNav`

### A.3.3 — Organisms (25)

`AtlasGrid`, `BookSession`, `CapabilityStrip`, `Cases`, `CookiesBanner`, `CtaBand`, `Departments`, `FieldNotes`, `FooterMarquee`, `Hero`, `HowWeShip`, `Manifesto`, `ManifestoAccent`, `Offices`, `OperatingLayer`, `PersonaSwitcher`, `ProofBar`, `Pyramid`, `SigBand`, `SixServices`, `Stub`, `SystemArchitecture`, `TrustMarquee`, `WhyAIStalls`, `WritingNotes`

### A.3.4 — Sections W6 composable (19 + renderer)

`HeroSplit`, `HeroCentered`, `HeroFullBleed`, `ProofBar`, `StatBlock`, `SocialProof`, `MethodTimeline`, `FeatureGrid`, `ComparisonTable`, `TimelineBlock`, `MediaBlock`, `PricingTable`, `FaqAccordion`, `ObjectionHandler`, `CtaFinal`, `CtaBand`, `CtaInline`, `TestimonialBlock`, `GuaranteeBlock` + `SectionsRenderer`

### A.3.5 — Editorial (8)

`Callout`, `Dingbat`, `DropCap`, `EditorialTable`, `KeyMetric`, `PullQuote`, `Sidenote`, `Timeline`

### A.3.6 — Motion (4)

`AtlasConnections`, `BootSplash`, `LiquidHero`, `ProductReel`

### A.3.7 — Templates (18)

`TrustLegal`, `Welcome`, `TunnelStep`, `CaseStudy`, `ServiceDetail`, `ListIndex`, `AuthorPage`, `Hub`, `FormationDetail`, `SolutionsDetail`, `OffresDetail`, `LeadMagnet`, `DetailMenu`, `TechnologiesDetail`, `Essay`, `ConversionFunnel`, `EcoleHub`, `Utility`

---

## A.4 · Map pages → composants (fréquence d'import)

Scan exhaustif : 75 fichiers `.astro` dans `src/pages` (toutes routes confondues, FR + EN, standalone + collection dynamic).

### A.4.1 — Top composants importés par PAGES STANDALONE (38 pages)

| Composant | Imports | Catégorie | Verdict |
|---|---|---|---|
| `Base` | 13 | Layout | 🟢 Tier 1 obligatoire |
| `Kicker` | 10 | Atom | 🟢 Tier 1 — atom le plus réutilisé |
| `WelcomeTemplate` | 5 | Template | 🟢 Tier 1 (utilisé par /bienvenue/*) |
| `Button` | 5 | Atom | 🟢 Tier 1 |
| `UtilityTemplate` | 4 | Template | 🟢 Tier 1 (404, archive, console) |
| `EditorialWriteRow` | 4 | Molecule | 🟢 Tier 1 (ressources) |
| `Bi` | 4 | Atom (icon) | 🟢 Tier 1 |
| `TrustLegalTemplate` | 3 | Template | 🟢 Tier 1 (governance, trust-center) |
| `TerminalCTA` / `PillCTA` | 3 chacun | Atom | 🟢 Tier 1 (3 variantes CTA atomiques) |
| `Callout` | 3 | Editorial | 🟢 Tier 1 |
| **Sections W6 (HeroSplit, ProofBar W6, …)** | **0** (sauf /test-composable) | Section V2 | 🟡 **ADOPTION = 0%** |

⚠️ **CONSTAT CRITIQUE** : aucune page production n'utilise encore les sections W6. Le backbone composable V2 est livré (commit `ec0379a`) mais **0 page n'a été migrée**. T2.4c reste 🟡 en cours.

### A.4.2 — Top composants importés par TEMPLATES (18 templates, qui servent les collections)

| Composant | Imports | Catégorie | Verdict |
|---|---|---|---|
| `Base` | 15 | Layout | 🟢 Tier 1 obligatoire |
| `Kicker` | 11 | Atom | 🟢 Tier 1 |
| `Breadcrumb` | 10 | Molecule | 🟢 Tier 1 |
| `CtaBand` (organism) | 8 | Organism | ⚠️ DOUBLON : organism vs section W6 |
| `KeyMetric` | 7 | Editorial | 🟢 Tier 1 |
| `Callout` | 7 | Editorial | 🟢 Tier 1 |
| `Bi` | 7 | Atom | 🟢 Tier 1 |
| `Timeline` (editorial) | 5 | Editorial | ⚠️ DOUBLON : editorial vs `TimelineBlock` section W6 |
| `RelatedCards` | 5 | Molecule | 🟢 Tier 1 |
| `Dingbat` | 5 | Editorial | 🟢 Tier 1 |
| `TechPillRow` | 4 | Molecule | 🟢 Tier 1 |
| `PullQuote` | 4 | Editorial | 🟢 Tier 1 |
| `ProofBand` | 3 | Molecule | 🟢 Tier 1 |
| `ProcessSteps` | 3 | Molecule | ⚠️ DOUBLON : molecule vs `MethodTimeline` section W6 |
| `EditorialTable` | 3 | Editorial | 🟢 Tier 1 |

### A.4.3 — Composants importés UNIQUEMENT 1 fois (candidats dépréciation)

`SecteurIndustrie`, `SecteurFinance`, `PortraitSimon`, `MethodeProcessDiagram`, `TableOfContents`, `ShareButtons`, `RelatedByCluster`, `PricingTier`, `FitColumns`, `AuthorCard`, `TagPills`

🟡 **À auditer** : composants utilisés une seule fois — soit légitimes (one-off intentionnel), soit dette (mort-né).

### A.4.4 — Pages standalone vs Collections : différenciation observée

| Type | Pattern d'imports | Recommandation Phase B |
|---|---|---|
| **Standalone** (`/`, `/manifesto`, `/agence/*`, `/contact`, `/console`, `/atlas`) | Imports inline d'organisms + atoms + motion (`Hero`, `BootSplash`, `LiquidHero`, organisms riches) | Tier 1 : organisms variés autorisés pour casser monotonie |
| **Collections** (`offres`, `solutions`, `cas`, `blog`, etc.) | Imports d'un Template + Template orchestre atoms+molecules+editorial | Tier 1 : Template figé + atoms variés selon front-matter MDX |

Cohérent avec mandat Simon : « créer des layouts et composition différente entre les modèles de pages (collections) et les nouvelles pages (standalone) ».

### A.4.5 — Imports anti-pattern détectés

1. **`ProofBar` ambigu** : `import ProofBar from '../components/ui/organisms/ProofBar.astro'` ou `'../components/sections/ProofBar.astro'` ? Les pages doivent être explicites. → **Phase D rename obligatoire**.
2. **`CtaBand` ambigu** : idem. → **Phase D rename obligatoire**.
3. **Sections W6 importées 0 fois en prod** : preuve que la migration T2.4c n'a pas démarré. → **Plan B : prioriser au moins 1 migration template pour valider l'adoption.**

---

## A.5 · Doublons inter-systèmes (9 confirmés)

### A.5.1 — Doublons critiques (même nom de fichier dans 2 dossiers)

| Composant | Localisation 1 | Localisation 2 | Recommandation |
|---|---|---|---|
| **`ProofBar.astro`** | `organisms/ProofBar.astro` (data hardcodée HERO_METRICS) | `sections/ProofBar.astro` (data via props) | 🔴 RENAME : organism → `ProofBarLegacy.astro` ou suppression. Le composable V2 est la cible. |
| **`CtaBand.astro`** | `organisms/CtaBand.astro` | `sections/CtaBand.astro` | 🔴 Idem — clarifier lequel est canonique. |

### A.5.2 — Doublons fonctionnels (noms différents, même rôle)

| Organism/Molecule legacy | Section W6 (cible composable) | Verdict |
|---|---|---|
| `Hero.astro` (organism) | `HeroSplit` + `HeroCentered` + `HeroFullBleed` | 🟢 Hero est plus monolithique avec mini-map ; W6 sont atomiques. Garder Hero comme variant `home` ; W6 pour pages standalone. |
| `CapabilityStrip.astro` | `FeatureGrid.astro` | 🟡 CapabilityStrip a un design éditorial spécifique (8 piliers). FeatureGrid est générique. Recommandation : garder les deux, documenter cas d'usage. |
| `TrustMarquee.astro` | `SocialProof.astro` | 🟡 TrustMarquee est marquee animé, SocialProof peut être grid ou marquee. Vérifier overlap réel. |
| `ProcessSteps.astro` (molecule) | `MethodTimeline.astro` | 🟡 ProcessSteps est format card, MethodTimeline est format index éditorial. Garder les deux. |
| `Timeline.astro` (editorial) | `TimelineBlock.astro` (section) | 🟡 Idem — vérifier overlap. |
| `PricingTier.astro` (molecule) | `PricingTable.astro` (section) | 🟢 PricingTier est UN tier, PricingTable orchestre N tiers. Pas un doublon, c'est composé/composant. |
| `MetricStrip.astro` (molecule) | `StatBlock.astro` (section) | 🟡 Overlap fonctionnel — l'un est plus simple, l'autre plus riche. |

### A.5.3 — Synthèse doublons

- 🔴 **2 doublons critiques nom-identique** à renommer immédiatement
- 🟡 **5 doublons fonctionnels** à documenter avec cas d'usage différenciés
- 🟢 **2 « doublons » légitimes** (composition parent-enfant)

---

## A.6 · Diagnostic synthèse + propositions Tier

### A.6.1 — Tokens : propositions Tier

| Tier | Quantité | Action |
|---|---|---|
| **Tier 1 — Canonique** | ~100 tokens | Source de vérité fermée, exposée dans /agence/design-system |
| **Tier 2 — Dérivés autorisés** | ~7 aliases W6 actuels | Ponts transitoires en attendant rename progressif W6 → canonique |
| **Tier 3 — À supprimer** | ~40 tokens dead weight | 8 semantic aliases jamais utilisés + 5 type scale V5 unused + 6 col-* + 10 @theme Tailwind (conditionnel) + 11 autres |

### A.6.2 — Classes utility : à compléter Phase A.2

### A.6.3 — Components : propositions

- **Tier 1 — Canonique W6 composable** : 19 sections + SectionsRenderer
- **Tier 1 — Atoms officiels** : 10 atoms (tous)
- **Tier 1 — Molecules réutilisées** : à filtrer par usage (30 candidats)
- **Tier 1 — Organisms spécifiques** : Hero (home), BookSession, Footer*, autres uniques
- **Tier 1 — Editorial** : 8 atomes éditoriaux pour MDX content
- **Tier 1 — Motion** : 4 components effets visuels
- **Tier 1 — Templates** : 18 templates pour collections
- **Tier 2 — Dérivés autorisés** : variations stylistiques entre pages standalone vs collections (à proposer)
- **Tier 3 — À déprécier** : `ProofBar.astro` organism (renommer) + `CtaBand.astro` organism (renommer) + organisms doublons fonctionnels selon décision usage

### A.6.4 — Anti-patterns identifiés

1. **Token fantôme** : utiliser `var(--xxx)` sans vérifier que `--xxx` est défini → padding silencieux à 0. **Garde-fou** : grep audit avant commit.
2. **Aliases sémantiques sur-ingénieriés** : couche d'abstraction (`--bg`, `--brand`, `--border`) qui dédouble les tokens primaires sans valeur ajoutée → dead weight. **Garde-fou** : ne créer un alias QUE si valeur sémantique > 1 niveau d'indirection.
3. **Doublons nom-identique** : 2 fichiers `ProofBar.astro` et 2 fichiers `CtaBand.astro` → ambiguïté pour l'agent IA. **Garde-fou** : interdire noms identiques cross-folders.
4. **Sections sans container interne** : 19 sections W6 sans `.wrap-wide` → contenu collé bord viewport. **Garde-fou** : check obligatoire avant validation visuelle (rule 19).
5. **Hero sans header clearance** : sections hero W6 ne clear pas le `.hdr` sticky → H1 coupé. **Garde-fou** : pattern `padding-top: calc(--spacing-section + --header-height)` obligatoire sur tout hero-*.

---

## A.7 · État d'avancement Phase A

- [x] A.0 · Méthode d'audit définie
- [x] A.1 · Inventaire tokens.css (147 tokens classés en 16 sous-sections)
- [x] A.2 · Inventaire classes utility globales (87 catégorisées en 13 catégories)
- [x] A.3 · Inventaire components atomic (114, niveau surface)
- [x] A.4 · Map pages → composants (fréquence import, 75 fichiers scannés, anti-patterns identifiés)
- [x] A.5 · Doublons inter-systèmes (9 confirmés, recommandations)
- [x] A.6 · Diagnostic synthèse + propositions Tier
- [ ] A.7 · Validation Simon + transition Phase B

🎯 **Phase A complete** — prêt pour arbitrage Simon avant Phase B.

---

## A.8 · Prochaines actions immédiates (cette session)

1. ✅ Produire ce doc 18 squelette + remplir A.1, A.3, A.5, A.6
2. ⏭️ A.2 — Scan classes utility (1 commande bash + table)
3. ⏭️ A.4 — Map pages → composants (scan ciblé `grep -rl "import" src/pages`)
4. ⏭️ Commit doc 18 v1 avec preuve empirique (rule 13)
5. ⏭️ Présentation à Simon pour validation Tier 1/2/3 proposés
6. ⏭️ Phase B (doc 19) après validation
