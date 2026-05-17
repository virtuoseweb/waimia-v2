# Batch D · TrustMarquee → SocialProof

**Statut** : ✅ TERMINÉ 2026-05-17
**Worker** : Codex strict (recovery via reflog après collision agent)
**Commit** : `012ee9c` sur branche `feat/phase-1-design`
**Source** : `docs/31-COMPONENTS-DOUBLONS-MAPPING.md§3` ligne 279 · `docs/31§6 Batch D`

## Périmètre

Migration : `TrustMarquee.astro` (organism · 23 LoC · 0 token · marquee-only) → `SocialProof.astro` (section W6 · 77 LoC · prop-driven · FR/EN natif · variants marquee/statique).

## Fichiers modifiés

- `src/pages/index.astro` (FR : import + `socialProofData` + `<SocialProof lang="fr"/>`)
- `src/pages/en/index.astro` (idem `lang="en"`)
- `src/pages/technologies/index.astro` (FR)
- `src/pages/en/technologies/index.astro` (EN)
- `src/components/footer/Footer.astro` (cleanup textuel dev index lignes 138/144)
- `src/pages/agence/design-system.astro` (cleanup textuel)

## Fichier supprimé

- `src/components/ui/organisms/TrustMarquee.astro`

## Pages screenshots before/after

| Page | BEFORE | AFTER |
|---|---|---|
| `/` | `before/home-fr.png` | `after/home-fr.png` |
| `/en` | `before/home-en.png` | `after/home-en.png` |
| `/technologies` | `before/technologies-fr.png` | `after/technologies-fr.png` |
| `/en/technologies` | `before/technologies-en.png` | `after/technologies-en.png` |

## Validation empirique

- `pnpm build` → Server built in 6.29s, Complete!
- `grep -rn "TrustMarquee" apps/web/src` → 0 résultat
- 4 pages rendent SocialProof (Playwright Page Title préservé)
- Branche dédiée pour éviter collision avec autre agent travaillant migration API → Astro Actions sur main

## Incident workflow capitalisé

Cf [`feedback_multi_agent_branch_isolation.md`](../../../../../../.claude/projects/-Users-simonberos/memory/feedback_multi_agent_branch_isolation.md) — règle multi-agents : branche dédiée par scope, main = zone neutre.
