# Batch H · Legacy templates + dead code

**Statut** : en cours
**Date** : 2026-05-17
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

## Résultat

À compléter après livraison Worker Codex + audit visuel Playwright.
