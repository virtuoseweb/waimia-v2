# Batch H · Legacy templates + dead code

**Statut** : ✅ TERMINÉ 2026-05-17
**Worker** : Codex (exit 0)
**Source** : `docs/31-COMPONENTS-DOUBLONS-MAPPING.md§6 Batch H` + `docs/32-TEMPLATES-DEEP-AUDIT.md§2.3`

## Périmètre

### Éliminations (suite verdicts canoniques)

1. **`templates/FormationDetailTemplate.astro`** → **DEPRECATED**
   - Verdict : `CourseDetailTemplate` (union polymorphe 4 types) canonique
   - Migration : `src/pages/ecole/cours/[slug].astro` consomme désormais `CourseDetailTemplate`

2. **`seo/BreadcrumbSchema.astro`** → **DEPRECATED**
   - Verdict : `Breadcrumb.astro` (molecule) génère déjà `BreadcrumbList` JSON-LD
   - Migration : aucun consommateur (composant orphelin créé par erreur Opus 2026-05-17 commit d3f319a)

3. **`ui/molecules/MetricStrip.astro`** → **DEPRECATED**
   - Verdict : `sections/ProofBarSection.astro` canonique (prop-driven, FR/EN, tokens propres)
   - Migration : aucun consommateur direct

### Dead code à arbitrer (NE PAS supprimer dans ce batch)

Les 20 SVG geometric + 6 organisms (HowWeShip, Offices, OperatingLayer, SigBand, WhyAIStalls, WritingNotes) marqués 🟡 WIP dans doc 31 nécessitent arbitrage Simon avant suppression (peut-être réservés pour features futures).

→ **Action Batch H** : marquer statut dans `docs/19-DESIGN-SYSTEM-CLOSED.md` mais ne pas supprimer.

## Pages impactées (visuel)

| Page | Avant (FormationDetail) | Après (CourseDetail) |
|---|---|---|
| `/ecole/cours/intro-ia-pme-b2b` | `before/ecole-cours-intro-ia-pme-b2b.png` | `after/ecole-cours-intro-ia-pme-b2b.png` |
| `/ecole/cours/prompter-claude-pour-les-non-tech` | `before/ecole-cours-prompter-claude.png` | `after/ecole-cours-prompter-claude.png` |
| `/ecole/cours/automatiser-relances-crm-en-4-heures` | `before/ecole-cours-automatiser-relances.png` | `after/ecole-cours-automatiser-relances.png` |

## Critères de validation

- 0 référence `<FormationDetailTemplate` dans `src/pages/`
- 0 référence `BreadcrumbSchema` dans `src/`
- 0 référence `MetricStrip` dans `src/`
- `pnpm build` succès complet
- 3 pages `/ecole/cours/*` rendent correctement en `CourseDetailTemplate`
- Pas de 404 sur les routes existantes

## Résultat livré

### Worker Codex Batch H

- 1 page migrée : `src/pages/ecole/cours/[slug].astro` (18 LoC modifs)
  - Avant : `<Base><FormationDetailTemplate data={data}>` (wrapper Base externe)
  - Après : `<CourseDetailTemplate entry={entry} lang={lang}>` (Base inclus dans template)
- 3 fichiers supprimés :
  - `src/components/templates/FormationDetailTemplate.astro` (484 LoC)
  - `src/components/seo/BreadcrumbSchema.astro` (doublon orphelin)
  - `src/components/ui/molecules/MetricStrip.astro` (0 consommateur)
- Total : 667 LoC modifiées · 0 régression build

### Validation empirique

- `pnpm build` → Server built in 6.37s, Complete!
- 0 erreur Astro check / Zod sur la migration
- 3 routes `/ecole/cours/*` rendent en `CourseDetailTemplate` (Playwright Page Title préservé)
- `grep -rn "FormationDetailTemplate\|BreadcrumbSchema\|MetricStrip" src/` → 0 résultat
- 3 screenshots AFTER capturés (Playwright fullPage 1440x900, dev server actif)

### Comparaison visuelle (à valider Simon)

| Page | BEFORE (FormationDetail) | AFTER (CourseDetail) | Delta taille |
|---|---|---|---|
| intro-ia-pme-b2b | 843 KB | 813 KB | -30 KB |
| prompter-claude | 822 KB | 790 KB | -32 KB |
| automatiser-relances | 925 KB | 942 KB | +17 KB |

Variations faibles attendues (deux templates différents). Comparaison visuelle pixel-à-pixel disponible en ouvrant les paires `before/X.png` vs `after/X.png`.

### Commits

- Code Worker Batch H : commit dans la même session
- Screenshots BEFORE : `64cb585`
- Screenshots AFTER + result : commit pending
