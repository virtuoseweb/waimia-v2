# Waimia · v2

Refonte v2 du site Waimia — agence IA experte Claude. Pacing manifeste 5 actes + 4 directions interchangeables via DirectionSwitcher bottom-left.

## Stack

- **Astro 6** · SSG par défaut, contenu rendu côté serveur
- **React 19** · îlots minimaux uniquement (Pattern Slots privilégié)
- **Tailwind v4** · CSS-first via `@theme` (tokens DS dans `src/styles/tokens.css`)
- **MDX** · content collections typées via Zod
- **i18n** · `/` FR · `/en/*` EN · hreflang automatique

## Documentation projet

> **Lecture obligatoire** au début de chaque session de code (pour Claude ou tout dev).

| #      | Fichier                                                              | Sujet                                    |
| ------ | -------------------------------------------------------------------- | ---------------------------------------- |
| 00     | [docs/00-design-system-mapping.md](docs/00-design-system-mapping.md) | Mapping DS tokens (handoff → tokens.css) |
| 01     | [docs/01-architecture.md](docs/01-architecture.md)                   | Stack + arborescence projet              |
| 02     | [docs/02-geo-aio-strategy.md](docs/02-geo-aio-strategy.md)           | GEO/AIO 6 piliers · llms.txt · JSON-LD   |
| 03     | [docs/03-content-models.md](docs/03-content-models.md)               | Frontmatters par modèle de page          |
| 04     | [docs/04-motion-system.md](docs/04-motion-system.md)                 | Famille d'effets motion + règles d'usage |
| 05     | [docs/05-deployment.md](docs/05-deployment.md)                       | Stratégie git + déploiement Vercel       |
| **06** | **[docs/06-coding-standards.md](docs/06-coding-standards.md)**       | **Charte projet · 15 règles strictes**   |
| **07** | **[docs/07-component-patterns.md](docs/07-component-patterns.md)**   | **Pattern Slots · arbre de décision**    |

## Démarrage

```bash
pnpm install
pnpm dev          # localhost:4321
pnpm build        # → dist/ (128 pages, ~1.4s)
pnpm astro check  # TypeScript + Astro check
```

## Routes principales

| Route        | Direction     | Description                                |
| ------------ | ------------- | ------------------------------------------ |
| `/`          | A · Apparatus | Manifeste linéaire 5 actes + intercalaires |
| `/manifesto` | B · Manifesto | LiquidHero canvas + asymmetric services    |
| `/console`   | C · Console   | Terminal hero + ProductReel sticky scroll  |
| `/atlas`     | ✦ Atlas       | Cartographie 4 piliers + persona switcher  |
| `/en/*`      | EN mirror     | Toutes les routes EN en miroir             |

## Pattern Slots · règle d'or

Tout React island reçoit son **contenu via `children`** (rendu par Astro côté serveur), JAMAIS via data props pour du contenu éditorial.

```astro
<MyIsland client:visible>
  <a href="/lien">Texte indexable</a>   ← rendu par Astro
</MyIsland>
```

Cf [docs/07-component-patterns.md](docs/07-component-patterns.md) pour l'arbre de décision complet et les 4 patterns autorisés.

## Composants par pattern

| Pattern            | Composant                           | Justification                    |
| ------------------ | ----------------------------------- | -------------------------------- |
| 1 · Pure Astro     | Hero, Manifesto, Cases, etc. (20+)  | Aucune interactivité             |
| 2 · Astro + script | Header.astro                        | State léger sans framework JS    |
| 3 · Slots          | PagePill + PagePillIsland.tsx       | Contenu éditorial + scroll state |
| 4 · React props    | LiquidHero, BootSplash, ProductReel | Animation pure (canvas, RAF)     |

## Déploiement

- **Production** : <https://waimia-v2.vercel.app>
- **Repo** : <https://github.com/virtuoseweb/waimia-v2>
- **Auto-deploy** : `git push origin main` → Vercel build → live

## Branches

- `main` — production
- `feat/*` — nouvelles features
- `refactor/*` — refactor architectural
- `fix/*` — corrections
- `docs/*` — documentation seule

## Licence

Propriétaire — Waimia 2026.
