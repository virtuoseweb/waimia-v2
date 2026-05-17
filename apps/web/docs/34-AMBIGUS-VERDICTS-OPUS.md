# 34 — Verdicts Opus sur les 5 doublons ambigus (arbitrage selon contrat)

**Statut** : ✅ FIGÉ 2026-05-17
**Source ambiguïtés** : `docs/31-COMPONENTS-DOUBLONS-MAPPING.md§4`
**Contrat appliqué** : `docs/28-DESIGN-SYSTEM-CONTRACT.md`
**Validation Simon** : Opus tranche selon contrat, audit visuel Playwright post-migration

---

## Méthode d'arbitrage

Pour chaque cas ambigu, application des 3 critères cumulatifs du contrat doc 28§1 :

1. **Meilleur rendu** (qualité visuelle perçue, alignement DA Waimia)
2. **Tokens propres** (zéro hardcoded, usage `var(--token)`)
3. **Accessibilité vérifiable** (rôles ARIA, contraste, sémantique)

Plus la doctrine doc 28§1 :
- **Sections W6** = cible par défaut pour nouveaux patterns
- **Organisms** = réservés signatures pages identitaires uniquement
- **Promotion** dès la 1ère utilisation si intent dépasse page locale

---

## Verdict 1 · ProofBand vs ProofBarSection / StatBlock

**Cas** : `ProofBand` combine quote + attribution + chiffres dans un même bloc. Intent "preuve" commun avec `ProofBarSection` (strip métriques) et `StatBlock` (stats riches), mais grammaire visuelle distincte.

**Décision Opus** : 🟡 **GARDER en Tier 2 conditionnel**

**Justification** :
- L'intent `quote + attribution + metrics` combinés n'est absorbé par aucune section W6 actuelle
- `ProofBarSection` reste strip métriques seules ; `StatBlock` reste stats monumentales
- `TestimonialBlock` (section W6 existante) pourrait absorber le quote-seul mais pas la combinaison quote+metrics
- Pas de canonique de remplacement immédiat → garder ProofBand

**Statut doc 19** : 🟡 **WIP — Tier 2 conditionnel · réservé pages standalone signature**

**Réévaluation** : si `TestimonialBlock` évolue avec slot metrics ou si un nouveau pattern combiné émerge → reconsidérer suppression.

---

## Verdict 2 · RelatedByCluster vs RelatedCards

**Cas** : `RelatedByCluster` agrège dynamiquement (cross-collection logic). `RelatedCards` présente en cartes. Même zone de page, intent adjacent mais sources de vérité distinctes.

**Décision Opus** : 🟢 **2 rôles distincts conservés · séparation de responsabilités**

**Justification** :
- `RelatedCards` = renderer canonique (pattern de présentation pur, prop-driven)
- `RelatedByCluster` = **data-loader** cross-collection (logique d'agrégation)
- Pas un doublon : c'est une séparation Presentation / Data Source correcte
- Doctrine SoC : ne pas fusionner brutalement deux responsabilités distinctes

**Statut doc 19** :
- `RelatedCards` 🟢 **STABLE** — renderer canonique
- `RelatedByCluster` 🟢 **STABLE** — data-loader (doit fournir un payload à `RelatedCards`)

**Action requise** : vérifier que `RelatedByCluster` délègue effectivement le rendu à `RelatedCards` (si actuellement il rend lui-même, refactor pour déléguer). À traiter dans Batch G.

---

## Verdict 3 · PricingTier vs PricingTable

**Cas** : `PricingTier` = card autonome sub-component. `PricingTable` = section tableau pricing.

**Décision Opus** : 🟡 **PricingTier sub-component non public · PricingTable canonique public**

**Justification** :
- `PricingTable` = section publique W6-like avec props `tiers: PricingTier[]`
- `PricingTier` = sub-component interne (atomique pricing card), pas exposé en showcase
- Si une page a besoin d'1 seul tier card → utiliser `PricingTable` avec `tiers` de longueur 1 (variant `single`)
- Pas de duplication, juste hiérarchie atomique correcte

**Statut doc 19** :
- `PricingTable` 🟢 **STABLE** — section publique (T6.x roadmap)
- `PricingTier` 🟡 **WIP — sub-component non public** (marker explicite)

**Action requise** : ne pas exposer `PricingTier` directement dans le showcase. Marker `@internal` dans le commentaire de tête.

---

## Verdict 4 · Pyramid vs MethodTimeline vs Timeline (editorial)

**Cas** : 3 composants racontent une méthode/progression. `Pyramid` signature home/atlas. `MethodTimeline` section composable W6. `Timeline` editorial MDX.

**Décision Opus** : 🟢 **3 rôles distincts conservés · scopes explicites**

**Justification** :
- `Pyramid` = signature pages identitaires standalone (`/`, `/atlas`) — autorisé doc 28§1 (organism réservé signature)
- `MethodTimeline` = **section canonique W6** pour détails offres/solutions/cas — défaut nouveau pattern
- `Timeline` (editorial) = outil MDX long-form (body articles, cookbooks)
- 3 niveaux d'usage = 3 grammaires visuelles attendues. Pas de doublon, juste taxonomie atomique correcte.

**Statut doc 19** :
- `Pyramid` 🟢 **STABLE — organism signature** (home + atlas uniquement)
- `MethodTimeline` 🟢 **STABLE — section canonique** (templates détail)
- `Timeline` (editorial) 🟢 **STABLE — atom editorial** (MDX body)

**Action requise** : aucune migration immédiate. Verrou doc 28§1 : si un agent veut introduire un 4e composant timeline-like, refuser et l'orienter vers l'un des 3 existants selon le contexte.

---

## Verdict 5 · HeroCentered / HeroFullBleed vs HeroSplit

**Cas** : 3 variants Hero dans sections W6. Doc 19 les traite comme variants Tier 2 autorisés pour pages standalone.

**Décision Opus** : 🟢 **Variants Tier 2 confirmés licites · HeroSplit canonique défaut**

**Justification** :
- `HeroSplit` = **canonique défaut Tier 1** (grille 58/42 voulue par Simon, doc 31§3)
- `HeroCentered` = Tier 2 dérivé autorisé (pages standalone à hiérarchie centrée — manifesto, atlas)
- `HeroFullBleed` = Tier 2 dérivé autorisé (pages signature impact visuel maximal)
- `Hero.astro` (organism legacy) = exception Tier 1 conditionnel pour `/` (home) uniquement
- Pas une dette à éliminer, juste un catalogue de variants à figer

**Statut doc 19** :
- `HeroSplit` 🟢 **STABLE — Tier 1 canonique défaut**
- `HeroCentered` 🟢 **STABLE — Tier 2 dérivé pages standalone hiérarchie centrée**
- `HeroFullBleed` 🟢 **STABLE — Tier 2 dérivé pages signature impact maximal**
- `Hero.astro` (organism) 🟡 **WIP — exception home-only · à reconsidérer si HeroSplit absorbe la home**

**Action requise** : verrouiller règle doc 28§1 : interdiction de réutiliser `Hero.astro` hors `/` et `/en/`. Tout nouvel usage hero doit choisir parmi les 3 variants W6 (Split par défaut).

---

## Synthèse statuts post-arbitrage

| Composant | Statut | Scope |
|---|---|---|
| `ProofBand` | 🟡 WIP | Tier 2 conditionnel · standalone signature |
| `RelatedCards` | 🟢 STABLE | Renderer canonique |
| `RelatedByCluster` | 🟢 STABLE | Data-loader (délègue à RelatedCards) |
| `PricingTable` | 🟢 STABLE | Section publique |
| `PricingTier` | 🟡 WIP | Sub-component interne `@internal` |
| `Pyramid` | 🟢 STABLE | Organism signature home + atlas |
| `MethodTimeline` | 🟢 STABLE | Section canonique W6 |
| `Timeline` (editorial) | 🟢 STABLE | Atom editorial MDX |
| `HeroSplit` | 🟢 STABLE | **Tier 1 canonique défaut** |
| `HeroCentered` | 🟢 STABLE | Tier 2 dérivé standalone centré |
| `HeroFullBleed` | 🟢 STABLE | Tier 2 dérivé signature impact |
| `Hero.astro` (organism) | 🟡 WIP | Exception home-only · à reconsidérer |

---

## Conséquences pour les batchs Phase 1 suivants

- **Batch A (Hero family)** : ne pas éliminer `HeroCentered`/`HeroFullBleed` (Tier 2 licites). Cible : verrouiller règle anti-réutilisation `Hero.astro` hors home.
- **Batch G (FAQ/related/pricing)** : refactor `RelatedByCluster` pour déléguer rendu à `RelatedCards`. Marquer `PricingTier` `@internal`.
- **Batch B (Proof metrics)** : ne pas éliminer `ProofBand` (intent quote+metrics non absorbable encore). Élimination `ProofBar` + `StatRow` + `MetricStrip` confirmée.

---

*Arbitrage Opus 4.7 · 2026-05-17 · clos doc 31§4 · update doc 19 prévu Batch suivant*
