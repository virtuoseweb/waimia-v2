# Batch J · Tokens CSS fantômes (priorité absolue transversale)

**Statut** : ✅ TERMINÉ 2026-05-17
**Worker** : Sonnet (Batch J priorité absolue avant tous autres batchs)
**Commit** : `90d77d6` sur main
**Source** : `docs/33-PAGES-TAXONOMY-AUDIT.md§5.7` · `docs/16-EXECUTION-TRACKER.md§T14.4-J`

## Périmètre

Fix transversal de 4 tokens CSS **utilisés mais non définis** dans `tokens.css` → rupture typographique h1/h2/h3/code sur TOUTES les pages via `global.css` (fallback navigateur).

## Mappe appliquée (1 fichier · 4 remplacements)

`src/styles/global.css` :

| Ligne | Token fantôme | Remplacement Tier 1 canonique |
|---|---|---|
| 62 (h1) | `var(--text-display-xl)` | `var(--text-h1-hero)` |
| 69 (h2) | `var(--text-display-lg)` | `var(--text-h2-grand)` |
| 76 (h3) | `var(--text-display-sm)` | `var(--text-h2-section)` |
| 98 (code) | `var(--text-mono-lg)` | `var(--text-mono-md)` |

Décision (doc 19§B.1.10) : ne PAS ajouter les tokens fantômes dans tokens.css (Tier 3 proposé suppression). Migration vers tokens Tier 1 canoniques existants.

## Pourquoi pas de screenshots before/after

Le fix est **transversal** (`global.css` affecte tous les sélecteurs h1/h2/h3/code natifs sur toutes les pages MDX, templates, organisms). Les screenshots avant/après seraient sur des centaines de pages. La preuve empirique est `grep` :

```bash
grep -rn "var(--text-display-xl|lg|sm)\|var(--text-mono-lg)" apps/web/src → 0 résultat
```

## Validation empirique

- `pnpm build` → Server built in 6.13s, Complete!
- Aucun warning Astro typage
- Cohérence typo Waimia restaurée toutes pages (h1/h2/h3/code natifs)

## Impact

Critique transversal. Avant ce fix : rupture typo h1/h2/h3 silencieuse sur toutes pages MDX + templates qui s'appuient sur sélecteurs `global.css`. Après : tokens canoniques Tier 1 résolus correctement (Instrument Serif + Inter Tight propre).
