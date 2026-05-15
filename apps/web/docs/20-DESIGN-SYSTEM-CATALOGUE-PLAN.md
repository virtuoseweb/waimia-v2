# 20 — Design System Catalogue Plan (Phase C · Page exposable)

**Statut** : 🟡 PLAN — exécution en sessions futures
**Date** : 2026-05-15
**Précédents** : `18-DESIGN-SYSTEM-CARTOGRAPHY.md` · `19-DESIGN-SYSTEM-CLOSED.md`
**Cible** : enrichir `/agence/design-system.astro` pour exposer 100% du système fermé

**Mandat Simon (verbatim)** : « créer un système fermer design système atomique [...] que l'agent IA comprenne toujours tous se qu'il a à disposition facilement sans halluciner et sans rien oublier »

---

## C.0 · Audit page `/agence/design-system.astro` actuelle

| Indicateur | Valeur | Verdict |
|---|---|---|
| Lignes totales | 218 | Léger |
| Composants importés | 11 / 114 (~10%) | ⚠️ Couverture extrêmement faible |
| Sections couvertes | atoms partiels + molecules partielles | Aucune section tokens / classes utility / sections W6 / motion / templates |
| URL | `/agence/design-system` | 🟢 noindex meta défini |
| Architecture page | linéaire (1 section par couche atomique) | À enrichir avec navigation interne + recherche |

### C.0.1 — Couverture actuelle par couche

| Couche | Total | Exposés | Couverture |
|---|---|---|---|
| Tokens (147) | 147 | 0 | **0%** ⚠️ |
| Classes utility (87) | 87 | 0 | **0%** ⚠️ |
| Atoms (10) | 10 | 6 (Kicker, ChapterLabel, Button, PillCTA, TerminalCTA, Bi) | 60% |
| Molecules (30) | 30 | 5 (SectionHeader, StatRow, TechPillRow, RelatedCards, …) | ~17% |
| Organisms (25) | 25 | 0 | **0%** ⚠️ |
| Sections W6 (19) | 19 | 0 | **0%** ⚠️ |
| Editorial (8) | 8 | 0 | **0%** ⚠️ |
| Motion (4) | 4 | 0 | **0%** ⚠️ |
| Templates (18) | 18 | 0 | **0%** ⚠️ |

**Verdict** : page actuelle = squelette atoms+molecules partiels. Aucun catalogue exhaustif des tokens, classes, sections composables, motion, ou templates. **Impossible pour un agent IA de "piocher" car la librairie n'est pas exposée**.

---

## C.1 · Architecture cible — page enrichie

### C.1.1 — Navigation interne (sticky TOC)

Sticky TOC à gauche avec sections numérotées :

```
1. Tokens
   1.1 Palette couleurs
   1.2 Typographie (fonts + scale + leading/tracking)
   1.3 Spacing scale 8pt
   1.4 Shadows
   1.5 Easings + Durations
   1.6 Z-index
2. Classes utility
   2.1 Layout containers
   2.2 Buttons
   2.3 Header / Nav / Mega menu
   2.4 Mobile sheet
   2.5 Reveal animations
   2.6 Editorial layout
   2.7 Hairlines + Helpers
3. Atoms (10)
4. Molecules (30)
5. Organisms (25)
6. Sections composable V2 (19)
7. Editorial (8)
8. Motion (4)
9. Templates (18) — preview links
10. Patterns courants (compositions)
```

### C.1.2 — Recherche par tag (anti-hallucination)

Champ de recherche input qui filtre les blocks par tags :

- `hero`, `cta`, `proof`, `content`, `editorial`, `motion`, `nav`, `form`, `tabular`
- Plus filtres par couche : `atom`, `molecule`, `organism`, `section`, `template`
- Plus filtre statut : `tier-1`, `tier-2`, `deprecated`

L'agent IA scanne la page, applique les filtres mentaux, et identifie le composant le plus adapté.

### C.1.3 — Pattern de showcase par composant

Pour chaque composant exposé, block standardisé :

```markdown
<ShowcaseBlock
  name="ProofBarSection"
  layer="section"
  tags={['proof', 'metrics', 'tier-1']}
  description="4-6 métriques en grille horizontale ou vertical-stack..."
  importPath="components/sections/ProofBarSection.astro"
>
  {/* Demo live */}
  <ProofBarSection data={mockData} lang="fr" />

  {/* Code snippet copy-paste */}
  <CodeBlock language="astro">
{`<ProofBarSection
  data={{
    type: 'proof-bar',
    metrics: [...],
    layout: 'horizontal'
  }}
  lang="fr"
/>`}
  </CodeBlock>

  {/* Props table */}
  <PropsTable schema={proofBarSchema} />
</ShowcaseBlock>
```

### C.1.4 — Sections détaillées attendues

#### Section 1 · Tokens (à créer)

- **1.1 Palette couleurs** : 11 swatches (paper, paper-2, paper-3, ink, ink-2, ink-3, muted, muted-2, accent, accent-2, accent-ink) avec hex visible
- **1.2 Typographie** :
  - 3 stacks (Instrument Serif, Inter Tight, JetBrains Mono) en exemple visible
  - Échelle V6 éditoriale (h1-hero, h2-grand, h2-section, h2-tight, h3-row, h3-card, h4-meta) en rendu visuel
  - Eyebrow, lede, pull-quote, drop-cap, caption en exemple
- **1.3 Spacing 8pt** : visualisation des 17 niveaux 0-320px en boxes
- **1.4 Section rhythm** : tight 48px / base 96px / loose 160px / grand 256px (visuel)
- **1.5 Shadows** : 5 shadows en cards
- **1.6 Easings + durations** : démo animée des 3 easings + 7 durations
- **1.7 Z-index** : pyramide visuelle

#### Section 2 · Classes utility (à créer)

- **2.1 Layout** : .wrap, .wrap-wide, .wrap-tight (rendu avec viewport markers)
- **2.2 Buttons** : .btn-primary / -accent / -ghost / -lg / -link (9 variants)
- **2.3 Reveal animations** : .blur-in, .clip-up, .reveal-fade, .reveal-up, .scale-in (démos)
- **2.4 Hairlines** : .hline, .hline-strong, .hair-draw

#### Section 6 · Sections composable V2 (à créer entièrement)

19 sections W6 exposées avec mock data pour chacune :

- 3× Hero (Split, Centered, FullBleed)
- ProofBarSection, StatBlock, SocialProof
- MethodTimeline, FeatureGrid, ComparisonTable, TimelineBlock, MediaBlock
- PricingTable, FaqAccordion, ObjectionHandler
- CtaFinal, CtaBandSection, CtaInline
- TestimonialBlock, GuaranteeBlock

#### Section 9 · Templates (preview links)

18 templates pas démo-ables in-page (trop lourds) — au lieu de ça, **preview link vers une page utilisant le template** :

- `OffresDetailTemplate` → `/offres/audit-maturite-ia` (live preview)
- `CaseStudyTemplate` → `/cas/halcyon`
- `EcoleHubTemplate` → `/ecole`
- etc.

---

## C.2 · Composants helpers à créer

Pour la page enrichie, créer ces molecules dédiées :

| Composant | Rôle | Localisation proposée |
|---|---|---|
| `ShowcaseBlock` | Container standardisé par composant exposé | `src/components/ui/molecules/ShowcaseBlock.astro` |
| `CodeBlock` | Code snippet copy-paste avec syntax highlight | Existant ? À vérifier |
| `PropsTable` | Table des props acceptées par un composant (lit Zod schema) | Nouveau |
| `TokenSwatch` | Swatch couleur avec hex visible + nom token | Nouveau |
| `SpacingBox` | Box visuel pour montrer un --space-N | Nouveau |
| `ShadowCard` | Card avec un --shadow-X appliqué | Nouveau |
| `EasingDemo` | Animation interactive pour easing/duration | Nouveau |

---

## C.3 · Estimation effort Phase C

| Sous-phase | Description | Effort estimé |
|---|---|---|
| C.1 | Architecture page (sticky TOC + recherche tags) | 2-3h |
| C.2 | Composants helpers (ShowcaseBlock, PropsTable, etc.) | 3-4h |
| C.3 | Section Tokens (1.1 à 1.7) | 2-3h |
| C.4 | Section Classes utility (2.1 à 2.4) | 2h |
| C.5 | Section Sections W6 (showcase 19 sections avec mock data) | 4-5h |
| C.6 | Section Atoms / Molecules / Organisms / Editorial / Motion (compléter) | 3-4h |
| C.7 | Section Templates (preview links) | 1h |
| C.8 | Tests visuels Playwright systématiques | 1h |

**Total estimé** : 18-24h sur plusieurs sessions.

---

## C.4 · Plan séquencé (suggestion)

### Session N+1 (prochaine)

1. C.1 — Architecture sticky TOC + recherche tags
2. C.3 — Section Tokens complète (couleurs, typo, spacing, shadow, easing)

### Session N+2

3. C.2 — Composants helpers (ShowcaseBlock, TokenSwatch, etc.)
4. C.4 — Section Classes utility

### Session N+3

5. C.5 — Section Sections W6 (gros morceau)

### Session N+4

6. C.6 — Compléter Atoms / Molecules / Organisms / Editorial / Motion
7. C.7 — Templates preview links
8. C.8 — Tests visuels finaux

---

## C.5 · Garde-fous pour la page

Pour éviter que la page elle-même devienne dette (cf rule 19) :

1. **Auto-test de cohérence** : un script Node qui vérifie que tous les composants de `src/components/` apparaissent dans la page design-system. Tout nouveau composant non-référencé = warning.
2. **Auto-test tokens** : un script qui vérifie que tous les tokens de `tokens.css` apparaissent dans la section tokens. Différence = warning.
3. **noindex** : déjà appliqué ✅
4. **Pas de logique métier** : la page n'utilise jamais d'état dynamique, juste du showcase static.

---

## C.6 · État d'avancement Phase C

- [x] C.0 · Audit page actuelle (couverture ~10%)
- [ ] C.1 · Architecture sticky TOC + recherche tags
- [ ] C.2 · Composants helpers
- [ ] C.3 · Section Tokens
- [ ] C.4 · Section Classes utility
- [ ] C.5 · Section Sections W6
- [ ] C.6 · Section Atoms/Molecules/Organisms/Editorial/Motion complétée
- [ ] C.7 · Section Templates preview links
- [ ] C.8 · Tests visuels Playwright

**Prérequis** : Phase B validée par Simon (Tier 1/2/3 figés, sinon le catalogue va exposer du Tier 3 par erreur).

---

## C.7 · Bénéfice attendu

Une fois Phase C complète, l'agent IA (Claude, Sonnet, Codex, humain) qui produit du code Waimia :

1. **Visite** `/agence/design-system` en premier réflexe
2. **Recherche par tag** (e.g. "cta" pour trouver toutes les variantes CTA)
3. **Copie le snippet** de la variation Tier 1 la plus adaptée
4. **Adapte** les data dans le frontmatter MDX ou les props du composant
5. **Ne réinvente jamais** un pattern qui existe déjà

L'élimination des hallucinations et des doublons devient **structurelle** plutôt que **discipline manuelle**.
