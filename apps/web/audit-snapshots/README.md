# Audit Snapshots — Preuves visuelles versionnées Phase 1 Design

## Purpose

Ce dossier conserve les **screenshots avant/après** de chaque migration effectuée durant Phase 1 Design (mandat Simon 2026-05-17 : *« placer les images dans des dossiers dans le projet pour garder le contexte avant/après et les preuves pour les agents afin de ne pas refaire ce qui est fait et pas tourner en rond »*).

Versioné dans git pour que tout agent IA (Claude, Codex, Sonnet, humain) puisse lire l'historique des décisions visuelles et ne pas réinventer.

## Convention

```
audit-snapshots/
├── batch-{ID}/
│   ├── README.md                    ← description du batch + verdicts
│   ├── before/
│   │   └── {page-slug}.png          ← état avant migration
│   └── after/
│       └── {page-slug}.png          ← état après migration
```

## Batchs ordonnés (du moins risqué au plus risqué)

| Batch | Périmètre | Risque | Statut |
|---|---|---|---|
| H | Legacy templates + dead code (FormationDetail, BreadcrumbSchema, MetricStrip) | 🟢 faible | en cours |
| F | ProcessSteps → MethodTimeline (3 templates) | 🟡 faible-moyen | à venir |
| D | TrustMarquee → SocialProof (home + tech) | 🟡 faible-moyen | à venir |
| G | FAQ/related/pricing arbitrage | 🟠 moyen | à venir |
| C | CapabilityStrip → FeatureGrid (home) | 🟠 moyen | à venir |
| B | Proof metrics (home en dernier) | 🔴 moyen-élevé | à venir |
| A | Hero family | 🔴 élevé | à venir |
| E | CTA family (27 consommateurs CtaBand) | 🔴 élevé | à venir |

## Lecture par les agents

Avant de modifier un composant déjà migré dans un batch passé, lire :
1. Le `README.md` du batch correspondant
2. Le diff visuel `before/` vs `after/`

Cela évite de refaire un travail déjà effectué et garantit la cohérence des décisions visuelles à travers les batchs.

## Source de vérité contractuelle

- `docs/28-DESIGN-SYSTEM-CONTRACT.md` — contrat formel 8 axes
- `docs/31-COMPONENTS-DOUBLONS-MAPPING.md` — verdicts canoniques composants
- `docs/32-TEMPLATES-DEEP-AUDIT.md` — verdicts templates
- `docs/33-PAGES-TAXONOMY-AUDIT.md` — drifts + batchs A-J
