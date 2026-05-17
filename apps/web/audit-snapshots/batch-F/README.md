# Batch F · ProcessSteps → MethodTimeline

**Statut** : ✅ TERMINÉ 2026-05-17
**Worker** : Sonnet 4.6 (fallback Codex rate-limited, commit `83e8098`)
**Source** : `docs/31-COMPONENTS-DOUBLONS-MAPPING.md§3` ligne 281 · `docs/31§6 Batch F`

## Périmètre

Migration : remplacer `ProcessSteps.astro` (molecule legacy grille fixe rigide) par `MethodTimeline.astro` (section W6 canonique, step semantics nettes, meilleures métadonnées) dans 3 templates :

- `src/components/templates/CaseStudyTemplate.astro`
- `src/components/templates/ServiceDetailTemplate.astro`
- `src/components/templates/DetailMenuTemplate.astro`

Puis supprimer `src/components/ui/molecules/ProcessSteps.astro`.

## Pages représentatives pour screenshots

| Template | Page représentative | URL |
|---|---|---|
| CaseStudyTemplate | Plateau | `/cas/plateau` |
| ServiceDetailTemplate | RevOps | `/offres/revops` |
| DetailMenuTemplate | Audit Maturité IA | `/offres/audit-maturite-ia` |

## Critères validation

- 0 référence `ProcessSteps` dans `apps/web/src/`
- `pnpm build` succès
- Rendu fonctionnel des 3 pages préservé (data identique affichée)
- Screenshots BEFORE/AFTER versionnés

## Résultat livré

### Worker Sonnet Batch F (commit `83e8098`)

- 3 templates migrés : CaseStudy, ServiceDetail, DetailMenu
  - Mapping props : `sn → num`, `title → label`, `kicker → meta`, `body → body`
  - `langFromPath` ajouté sur ServiceDetail et DetailMenu (cohérence bilingue)
- 1 section enrichie : `MethodTimeline.astro` · header conditionnel (h2 vide → mode headless, pas de doublon)
- 1 fichier supprimé : `ProcessSteps.astro` (124 LoC legacy)

### Validation empirique

- `pnpm build` → Server built in 6.35s, Complete!
- `grep -rn "import.*ProcessSteps" apps/web/src` → exit 1 (0 résultat)
- 3 pages rendent correctement (Playwright Page Title préservé sur cas/plateau, offres/revops, offres/audit-maturite-ia)
- 6 screenshots before/after capturés

### Comparaison visuelle

| Page | BEFORE (ProcessSteps) | AFTER (MethodTimeline) | Delta taille |
|---|---|---|---|
| /cas/plateau | 858 KB | 862 KB | +4 KB |
| /offres/revops | 1033 KB | 1059 KB | +26 KB |
| /offres/audit-maturite-ia | 1212 KB | 1248 KB | +36 KB |

Variations modérées (MethodTimeline expose plus de métadonnées : kicker, meta, hiérarchie narrative plus claire). Audit visuel pixel-à-pixel disponible en ouvrant les paires before/after.

### Note workflow

Codex Worker hit usage limit (reset 17:32) → fallback automatique Claude Sonnet selon rule globale. Mission cadrée par brief identique, qualité équivalente.
