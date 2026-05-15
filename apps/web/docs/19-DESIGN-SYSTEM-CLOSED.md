# 19 — Design System Closed (Phase B · Système fermé atomique)

**Statut** : 🟡 EN COURS · Phase B — Système fermé, propositions Claude pour validation Simon
**Date** : 2026-05-15
**Précédent** : `18-DESIGN-SYSTEM-CARTOGRAPHY.md` (Phase A audit exhaustif)
**Suivant** : `20-DESIGN-SYSTEM-CATALOGUE.md` (Phase C enrichissement /agence/design-system)

**Décisions Simon actées (AskUserQuestion 2026-05-15)** :

- Tier 2 dérivés autorisés : Claude propose, Simon valide
- Séquence : Phase B figé avant Phase C démarrage
- Critère collections (templates) vs standalone (pages) : différencier patterns autorisés

---

## B.0 · Principes du système fermé

### B.0.1 — Trois tiers fermés

| Tier | Définition | Politique |
|---|---|---|
| **Tier 1 — Canonique obligatoire** | Source de vérité unique. Tout token/composant ici est figé, exposé en catalogue. | L'agent IA pioche ICI en premier. Aucune création nouvelle sans procédure §B.5. |
| **Tier 2 — Dérivés autorisés** | Variations stylistiques intentionnelles pour casser monotonie entre pages standalone. | Listées explicitement avec cas d'usage. Pas de création ad-hoc. |
| **Tier 3 — Interdit / Déprécié** | À supprimer, archiver, ou marquer @deprecated. | Aucun nouvel usage autorisé. Migration progressive Phase D. |

### B.0.2 — Distinction Collections vs Standalone

| Type | Liberté stylistique | Patterns autorisés |
|---|---|---|
| **Collections** (`offres`, `solutions`, `cas`, `blog`, etc. via templates) | **Faible** — cohérence visuelle entre items | Templates figés Tier 1 + atoms + editorial Tier 1 |
| **Standalone** (`/`, `/manifesto`, `/agence/*`, `/contact`, etc.) | **Élevée** — chaque page = identité forte | Tier 1 + Tier 2 dérivés autorisés (organisms variés, motion components) |

### B.0.3 — Loi anti-hallucination

L'agent IA (Claude, Sonnet, Codex, ou humain) qui produit du code doit :

1. **Piocher** dans Tier 1 en premier (catalogue `/agence/design-system`)
2. **Évaluer** si un Tier 2 dérivé existant convient avant d'ajouter un nouveau style
3. **Si nouveau pattern nécessaire** : suivre §B.5 (procédure ajout) — jamais ad-hoc inline
4. **Avant tout commit** : grep audit `var(--xxx)` vs tokens définis (rule garde-fou §B.6.1)

---

## B.1 · Tier 1 Tokens canoniques (100 tokens)

### B.1.1 — Palette couleurs (8) ✅ FIGÉ

`--paper`, `--paper-2`, `--paper-3`, `--ink`, `--ink-2`, `--ink-3`, `--muted`, `--muted-2`

**Usage** : exclusif via ces noms. Aucun hex direct dans le code.

### B.1.2 — Accent terracotta (3) ✅ FIGÉ

`--accent` (primaire), `--accent-2` (hover), `--accent-ink` (texte sur accent)

### B.1.3 — Hairlines (4) ✅ FIGÉ

`--hairline`, `--hairline-strong`, `--hairline-dark`, `--hairline-dark-strong`

⚠️ **Question Simon** : les deux dark sont-ils encore utiles ? Si pas de dark mode prévu, supprimer (économise 2 tokens).

### B.1.4 — Stacks typographiques (4) ✅ FIGÉ (3 canoniques + 1 alias W6)

`--font-display` (Instrument Serif), `--font-sans` (Inter Tight), `--font-mono` (JetBrains Mono)

Plus alias W6 transitoire : `--font-serif` → `var(--font-display)` (à éliminer en Phase D — rename W6 sections).

### B.1.5 — Easings (3) ✅ FIGÉ

`--ease`, `--ease-out`, `--ease-sharp`

### B.1.6 — Layout containers (6) ✅ FIGÉ

`--wrap`, `--wrap-wide`, `--wrap-tight`, `--gut` (responsive), `--header-height`, `--cookie-banner-height`

### B.1.7 — Reveals (3) ✅ FIGÉ

`--reveal-slow`, `--reveal-med`, `--signature-angle`

### B.1.8 — Type Scale V6 éditoriale (7) ✅ FIGÉ (source de vérité titres)

`--text-h1-hero`, `--text-h2-grand`, `--text-h2-section`, `--text-h2-tight`, `--text-h3-row`, `--text-h3-card`, `--text-h4-meta`

### B.1.9 — Type Scale enrichi (5) ✅ FIGÉ

`--text-eyebrow`, `--text-eyebrow-lg`, `--text-lede`, `--text-pull-quote`, `--text-drop-cap`, `--text-caption`

### B.1.10 — Type Scale V5 partielle (5) ✅ FIGÉ (référencés via aliases W6)

`--text-display-md`, `--text-body-md`, `--text-body-sm`, `--text-mono-md`, `--text-mono-xs`

🟡 **PROPOSITION TIER 3** : `--text-display-xl`, `--text-display-lg`, `--text-display-sm`, `--text-display-xs`, `--text-body-lg`, `--text-body-xs`, `--text-mono-lg`, `--text-mono-sm` (8 tokens jamais utilisés) → à supprimer §B.3.

### B.1.11 — Leading & tracking (8) ✅ FIGÉ

`--leading-display`, `--leading-body`, `--leading-loose`, `--leading-h1/h2/h3/h4`, `--tracking-display`, `--tracking-body`, `--tracking-mono`, `--tracking-label`

### B.1.12 — Spacing scale 8pt (17) ✅ FIGÉ

`--space-0` à `--space-16` (échelle complète 0/4/8/12/16/24/32/40/48/64/80/96/120/160/200/256/320)

### B.1.13 — Section rhythm (4) ✅ FIGÉ

`--section-tight`, `--section-base`, `--section-loose`, `--section-grand`

### B.1.14 — Aliases composable V2 (7) 🟡 TRANSITOIRE → cible Tier 3 long terme

`--spacing-section`, `--spacing-block`, `--font-serif`, `--text-body`, `--text-h1`, `--text-h2`, `--text-small`

**Plan** : rename progressif sections W6 vers tokens canoniques en Phase D, puis supprimer ces 7 aliases.

### B.1.15 — Animation durations (7) ✅ FIGÉ

`--dur-instant`, `--dur-snap`, `--dur-fast`, `--dur-base`, `--dur-slow`, `--dur-deliberate`, `--dur-cinematic`

### B.1.16 — Grid 12-col minimal (2) ✅ FIGÉ

`--grid-cols`, `--grid-gutter`

🟡 **PROPOSITION TIER 3** : `--col-extra-narrow`, `--col-narrow`, `--col-standard`, `--col-wide`, `--col-full`, `--col-grand` (6 tokens jamais utilisés — supplantés par classes `.wrap-*`) → §B.3.

### B.1.17 — Z-index scale (6) ✅ FIGÉ

`--z-base`, `--z-sticky`, `--z-overlay`, `--z-modal`, `--z-toast`, `--z-cursor`

### B.1.18 — Shadows (5) ✅ FIGÉ

`--shadow-hairline`, `--shadow-paper-lift`, `--shadow-card-rest`, `--shadow-card-hover`, `--shadow-cta`

### B.1.19 — @theme Tailwind v4 (10) 🟡 CONDITIONNEL

`--color-paper/2/3`, `--color-ink/2/3`, `--color-muted/2`, `--color-accent/2`, `--font-display/sans/mono`, `--ease-*`

**Décision Simon requise** : Tailwind v4 utility classes utilisées en prod ?

- Si **OUI** → Tier 1 (garde valeur de compatibilité)
- Si **NON** → Tier 3 (supprimer le bloc `@theme`)

**Compteur Tier 1 figé** : ~100 tokens (132 si @theme et hairlines dark conservés, 92 si supprimés)

---

## B.2 · Tier 2 Dérivés autorisés (PROPOSITIONS pour validation Simon)

Patterns identifiés dans `docs/18-DESIGN-SYSTEM-CARTOGRAPHY.md §A.4.4` comme variations stylistiques intentionnelles. Marqués `🟡 PROPOSITION_TIER_2` pour ton arbitrage.

### B.2.1 — Sections d'accueil variées (pages standalone) 🟡

Justification : chaque page standalone a une identité forte → variation hero autorisée.

| Variant | Usage canonique | Décision |
|---|---|---|
| `Hero` (organism) | `/` (home FR/EN) avec mini-map + CTAs orchestrés | 🟡 PROPOSITION_TIER_2 |
| `HeroSplit` (section W6) | Pages composables / templates futurs | 🟢 Tier 1 cible composable |
| `HeroCentered` (section W6) | Pages standalone simples (manifesto, console) | 🟡 PROPOSITION_TIER_2 |
| `HeroFullBleed` (section W6) | Pages signature (cas, livres-blancs hero visuel) | 🟡 PROPOSITION_TIER_2 |
| `ManifestoAccent` (organism) | `/manifesto` exclusivement | 🟡 PROPOSITION_TIER_2 (unique justifié) |
| `LiquidHero` (motion .tsx) | Page console / atlas (signature visuelle) | 🟡 PROPOSITION_TIER_2 |

**Question Simon** : tous ces variants survivent en Tier 2, ou consolidation préférée vers les 3 W6 ?

### B.2.2 — Sections preuves/stats variées 🟡

| Variant | Usage | Décision |
|---|---|---|
| `ProofBar` (organism) | Home FR/EN — 4 métriques canoniques avec disclaimer | 🟡 PROPOSITION_TIER_2 (gardée pour home) |
| `ProofBarSection` (section W6) | Templates composables — data via props | 🟢 Tier 1 cible composable |
| `ProofBand` (molecule) | Templates collections (8 imports) | 🟡 PROPOSITION_TIER_2 |
| `StatBlock` (section W6) | Stats riches avec layout grid-3/grid-4/rows | 🟢 Tier 1 |
| `MetricStrip` (molecule) | Stats inline minimaliste | 🟡 PROPOSITION_TIER_2 |
| `KeyMetric` (editorial) | Mise en valeur 1 métrique dans MDX (7 imports) | 🟢 Tier 1 (rôle distinct) |

### B.2.3 — Sections call-to-action variées 🟡

| Variant | Usage | Décision |
|---|---|---|
| `CtaBand` (organism) | Templates collections (8 imports) — band fluo | 🟡 PROPOSITION_TIER_2 |
| `CtaBandSection` (section W6) | Templates composables — data via props | 🟢 Tier 1 cible composable |
| `CtaFinal` (section W6) | Cinématique fin de page (ink ou accent bg) | 🟢 Tier 1 |
| `CtaInline` (section W6) | CTA discret en milieu de page | 🟢 Tier 1 |
| `BookSession` (organism) | Section dédiée booking — home FR/EN | 🟡 PROPOSITION_TIER_2 |

### B.2.4 — Atomes CTA variés (3 variants) ✅ FIGÉ Tier 1

`Button`, `PillCTA`, `TerminalCTA` — 3 styles atomiques distincts intentionnels (générique / signature pill / signature terminal).

### B.2.5 — Variations editorial pour MDX 🟡

| Atome | Usage | Décision |
|---|---|---|
| `Callout` | Block d'avertissement/note dans articles | 🟢 Tier 1 |
| `PullQuote` | Citation breakout | 🟢 Tier 1 |
| `DropCap` | Initiale magnifiée | 🟢 Tier 1 |
| `Sidenote` | Note marginale | 🟡 PROPOSITION_TIER_2 (peu utilisé) |
| `Dingbat` | Séparateur ornement | 🟢 Tier 1 |
| `KeyMetric` | Mise en valeur métrique | 🟢 Tier 1 |
| `EditorialTable` | Tableau éditorial | 🟢 Tier 1 |
| `Timeline` (editorial) | Timeline narrative MDX | 🟡 PROPOSITION_TIER_2 (5 imports — vérifier overlap avec TimelineBlock) |

---

## B.3 · Tier 3 À supprimer / Déprécier (40 tokens + 11 components candidats)

### B.3.1 — Tokens "morts" sécurisés (24 tokens) ✅ SUPPRESSION SAFE

Tokens **définis ET jamais utilisés** dans tout le repo. Suppression sans risque.

| Catégorie | Tokens | Compteur |
|---|---|---|
| Semantic aliases unused | `--bg`, `--bg-subtle`, `--bg-raised`, `--bg-inverted`, `--brand`, `--brand-hover`, `--brand-fg`, `--border`, `--border-strong` | 9 |
| Grid containers unused | `--col-extra-narrow`, `--col-narrow`, `--col-standard`, `--col-wide`, `--col-full`, `--col-grand` | 6 |
| Type scale V5 unused | `--text-display-xl`, `--text-display-lg`, `--text-display-sm`, `--text-display-xs`, `--text-body-lg`, `--text-body-xs`, `--text-mono-lg`, `--text-mono-sm` | 8 |
| Dark mode tokens unused | `--hairline-dark`, `--hairline-dark-strong` | 2 (si pas de dark mode prévu) |

**Économie** : -24 tokens (~16% du système)

### B.3.2 — Tokens conditionnels (10 @theme Tailwind) ⚠️ DÉCISION SIMON

Bloc `@theme {}` à la fin de tokens.css redéfinit `--color-*`, `--font-*`, `--ease-*` pour Tailwind v4. Si Tailwind utility classes non utilisées en prod → Tier 3, sinon Tier 1.

### B.3.3 — Components doublons (4 candidats) ⚠️ DÉCISION SIMON

| Composant historique | Composant cible | Justification |
|---|---|---|
| `organisms/Hero.astro` | `sections/HeroSplit.astro` (composable) | Si home migrée vers sections array, déprécier Hero. Sinon → Tier 2. |
| `molecules/ProcessSteps.astro` | `sections/MethodTimeline.astro` | Si pattern similaire, fusionner. Sinon → Tier 2. |
| `molecules/MetricStrip.astro` | `sections/StatBlock.astro` | Idem. |
| `organisms/CapabilityStrip.astro` | `sections/FeatureGrid.astro` | Idem. |

### B.3.4 — Components mort-nés (11 candidats) 🟡 AUDIT INDIVIDUEL

11 composants importés exactement 1 fois (doc 18 §A.4.3). Pour chacun :

- Soit l'usage est légitime (one-off intentionnel) → Tier 1 ou 2
- Soit c'est dette mort-née → Tier 3 à supprimer

Liste : `SecteurIndustrie`, `SecteurFinance`, `PortraitSimon`, `MethodeProcessDiagram`, `TableOfContents`, `ShareButtons`, `RelatedByCluster`, `PricingTier`, `FitColumns`, `AuthorCard`, `TagPills`.

### B.3.5 — Classes utility candidates dépréciation 🟡 À ÉTUDIER

Doublons CSS détectés en doc 18 §A.2 :

- `.kicker` (class) vs `Kicker.astro` (atom) vs `.u-kicker` (inline class) → unifier vers `Kicker.astro` atom + retirer les classes
- `.how-grid`, `.how-row` → spécifiques à `HowWeShip` → déplacer en scoped CSS du composant

---

## B.4 · Classes utility canoniques (87 → ~70 prévu)

### B.4.1 — Tier 1 figé (64 classes)

Confirmées dans doc 18 §A.2.1 :

- **Layout** : `.wrap`, `.wrap-wide`, `.wrap-tight` (3)
- **Buttons** : `.btn`, `.btn-primary`, `.btn-accent`, `.btn-ghost`, `.btn-lg`, `.btn-link`, `.btn-label`, `.btn-spinner`, `.btn--loading` (9)
- **Header / Nav** : 9 classes Header + 9 mega menu
- **Mobile sheet** : 10 classes
- **Reveal animations** : 10 classes
- **Editorial layout** : 8 classes (`.editorial-cell`, `.ec-grid`, `.cases-tbl`, etc.)
- **Hairlines** : 3 classes (`.hline`, `.hline-strong`, `.hair-draw`)

### B.4.2 — Tier 2 propositions (18 classes) 🟡

`.kicker`, `.chapter-label`, `.par`, `.fig` (typo legacy) → soit Tier 1 si décision « class + component », soit Tier 3 si décision « component only ».

`.sec`, `.sec-dark`, `.sec-paper`, `.sec-hd`, `.signature-grid` → vérifier usage vs `.wrap`.

`.page-pill*` (4) → seulement mode dev, garder en Tier 1 dev-only.

### B.4.3 — Tier 3 candidats (5 classes) 🟡

`.how-grid`, `.how-row` → migrer en scoped CSS de `HowWeShip.astro`

`.act-num` → vérifier usage, sinon supprimer.

---

## B.5 · Procédures (anti-hallucination)

### B.5.1 — Comment ajouter un NOUVEAU token CSS

**Étapes obligatoires** :

1. **Vérifier qu'il n'existe pas déjà** :

   ```bash
   grep -n "<nom-token>" src/styles/tokens.css
   ```

2. **Vérifier qu'il n'y a pas déjà un alias proche** :

   ```bash
   grep -B1 -A1 "var(--<token-proche>)" src/styles/tokens.css
   ```

3. **Choisir la bonne catégorie** dans tokens.css (cf doc 18 §A.1 sous-sections)
4. **Ajouter** avec commentaire qui explique le pourquoi
5. **Documenter dans doc 20 catalogue** (Phase C — page /agence/design-system)
6. **Mettre à jour doc 18 §A.1 et doc 19 §B.1** dans le même commit

### B.5.2 — Comment ajouter un NOUVEAU composant atomique

**Étapes obligatoires** :

1. **Vérifier qu'il n'existe pas déjà** :

   ```bash
   find src/components -name "*<nom>*" -type f
   ```

2. **Vérifier qu'il n'y a pas de doublon fonctionnel** (cf doc 18 §A.5)
3. **Choisir la bonne couche atomique** (atoms / molecules / organisms / sections W6 / editorial / motion)
4. **Pattern Astro 6 strict** :

   ```astro
   ---
   import type { ... } from '...';
   interface Props { /* typed */ }
   const { ... } = Astro.props;
   ---
   <element class="component-name">
     <div class="wrap-wide"> <!-- si section -->
       <slot />
     </div>
   </element>
   <style>
     .component-name {
       /* uniquement var(--xxx) tokens canoniques */
     }
   </style>
   ```

5. **Tokens canoniques uniquement** — aucun hex direct
6. **Documenter dans doc 20 catalogue** avec showcase visual
7. **Validation visuelle Playwright** obligatoire (rule 19 triangulation)

### B.5.3 — Comment proposer une variation Tier 2

1. **Justifier l'écart** : « pour casser monotonie » n'est pas suffisant — donner cas d'usage précis
2. **Mettre à jour doc 19 §B.2** avec entrée `🟡 PROPOSITION_TIER_2`
3. **Demander validation Simon**
4. **Si validé** : promote en `🟢 Tier 2` dans doc 19 + doc 20

---

## B.6 · Anti-patterns documentés (garde-fous)

### B.6.1 — Token fantôme

**Symptôme** : `padding: var(--xxx)` rend 0 silencieusement.

**Détection** : grep audit avant commit

```bash
# Tokens utilisés
grep -rhoE "var\(--[a-z0-9-]+\)" src/components src/pages src/layouts | sort -u | sed 's/var(\(.*\))/\1/' > /tmp/used.txt
# Tokens définis
grep -hoE "^\s*--[a-z0-9-]+:" src/styles/tokens.css | sed 's/[: ]*$//;s/^[ \t]*//' | sort -u > /tmp/defined.txt
# Hallucinations
comm -23 /tmp/used.txt /tmp/defined.txt
```

Doit retourner **0 ligne**.

### B.6.2 — Aliases sur-ingéniérés

**Symptôme** : couche d'abstraction (`--bg`, `--brand`, `--border`) qui dédouble les tokens primaires sans valeur ajoutée → dead weight.

**Règle** : ne créer un alias QUE si :

- Valeur sémantique multi-niveau (ex: `--brand-primary` qui pointe vers `--accent` ET sert à des cas legacy)
- OU pont transitoire documenté avec date de retrait (ex: aliases W6 actuels)

### B.6.3 — Doublons nom-identique cross-folders

**Symptôme** : `organisms/ProofBar.astro` ↔ `sections/ProofBar.astro` → import ambigu.

**Règle** : noms identiques **interdits** entre dossiers. Suffixer le rôle (e.g. `Section`).

### B.6.4 — Section sans container interne

**Symptôme** : contenu collé au bord viewport quand consommé par `<SectionsRenderer>`.

**Règle** : toute section composable doit wrapper son contenu structuré dans `<div class="wrap-wide">` (sauf exceptions explicites edge-to-edge documentées).

### B.6.5 — Hero sans header clearance

**Symptôme** : H1 coupé par `.hdr` sticky 72px.

**Règle** : toute section qui peut être PREMIÈRE d'une page :

```css
padding-top: calc(var(--spacing-section) + var(--header-height));
```

---

## B.7 · Plan migration Phase D (figé après validation B)

| Étape | Action | Impact |
|---|---|---|
| D.1 | Supprimer 24 tokens dead weight sécurisés (§B.3.1) | -16% tokens |
| D.2 | Décision Simon : @theme Tailwind Tier 1/3 | ±10 tokens |
| D.3 | Décision Simon : hairlines dark Tier 1/3 | ±2 tokens |
| D.4 | Audit 11 composants 1-import (§B.3.4) | -X components |
| D.5 | Rename progressif W6 sections : `--font-serif` → `--font-display`, etc. | Supprime 7 aliases |
| D.6 | Patcher 14 sections W6 restantes avec `.wrap-wide` + header clearance | Stabilise composable |
| D.7 | Migration progressive 1 template pilote vers SectionsRenderer | Prouve adoption composable |
| D.8 | Décision Simon : organisms doublons (Hero, ProcessSteps, MetricStrip, CapabilityStrip) | -0 ou -4 components |
| D.9 | Unifier `.kicker` class vs `Kicker.astro` atom | -3 patterns redondants |

---

## B.8 · État d'avancement Phase B

- [x] B.0 · Principes du système fermé (3 tiers + collections vs standalone)
- [x] B.1 · Tier 1 Tokens canoniques (~100 tokens listés et figés)
- [x] B.2 · Tier 2 Dérivés autorisés (PROPOSITIONS pour validation Simon)
- [x] B.3 · Tier 3 À supprimer / Déprécier (24 tokens sécurisés + propositions)
- [x] B.4 · Classes utility canoniques (3 tiers proposés)
- [x] B.5 · Procédures (ajout token / ajout composant / proposition Tier 2)
- [x] B.6 · Anti-patterns documentés (5 garde-fous opérationnels)
- [x] B.7 · Plan migration Phase D (9 étapes séquencées)
- [ ] B.9 · Validation Simon Tier 1/2/3 → fige Phase B → démarre Phase C

---

## B.9 · Arbitrages Simon attendus

Avant Phase C démarrage, décisions nécessaires :

1. **Hairlines dark** (§B.1.3) : conserver pour dark mode futur OU supprimer (-2 tokens) ?
2. **@theme Tailwind v4** (§B.1.19) : utility classes utilisées en prod (Tier 1) OU bloc à supprimer (Tier 3 -10 tokens) ?
3. **Sections d'accueil variées** (§B.2.1) : tous les variants survivent en Tier 2 OU consolidation vers 3 W6 ?
4. **11 composants 1-import** (§B.3.4) : audit individuel ou suppression en bloc ?
5. **Organisms doublons** (§B.3.3) : déprécier Hero/ProcessSteps/MetricStrip/CapabilityStrip OU les garder en Tier 2 ?
6. **Sidenote, Timeline editorial** (§B.2.5) : Tier 1 ou Tier 2 ?
7. **`.kicker` class vs `Kicker.astro` atom** (§B.4.2) : unifier vers atom seul ?

Après validation, doc 19 passe en statut ✅ FIGÉ et Phase C peut démarrer (catalogue exposable sur `/agence/design-system`).
