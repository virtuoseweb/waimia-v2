# Waimia · v2

Refonte v2 du site Waimia — agence IA experte Claude. Pacing manifeste 5 actes + 4 directions interchangeables via DirectionSwitcher bottom-left.

## Stack

- **Astro 6** · `output: 'server'` SSR via `@astrojs/vercel@10` adapter
- **React 19** · îlots minimaux uniquement (Pattern Slots privilégié)
- **Tailwind v4** · CSS-first via `@theme` (tokens DS dans `src/styles/tokens.css`)
- **MDX** · content collections typées via Zod
- **i18n** · `/` FR · `/en/*` EN · hreflang automatique
- **Resend (fetch direct)** · emails transactionnels sans SDK (cf [`src/lib/resend.ts`](src/lib/resend.ts))
- **Cal.com embed** · iframe `cal.com/simonberos/audit` sur `/contact` (cf [`src/components/ui/molecules/CalEmbed.astro`](src/components/ui/molecules/CalEmbed.astro))

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
pnpm install         # depuis racine monorepo
pnpm dev:web         # localhost:4321
pnpm build:web       # → dist/ + .vercel/output (Build Output API)
pnpm typecheck       # = pnpm astro check : 0 errors, 0 warnings
pnpm test:e2e        # Playwright tests E2E (templates + API)
pnpm test:e2e:prod   # Tests contre https://waimia-v2.vercel.app
```

> **Bug local connu** : `pnpm build` peut échouer en local sur Node 25 +
> Tailwind v4 + Vite 8 + Rolldown rc.17 (`Missing field tsconfigPaths`).
> Workaround : laisser Vercel builder (Node 24 stable). En local, valider
> via `pnpm typecheck` uniquement. Cf
> [`../../docs/known-issues.md`](../../docs/known-issues.md) #2.

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
- **Vercel root directory** : `apps/web`
- **Install command** : `cd ../.. && npx -y pnpm@9.15.0 install --no-frozen-lockfile`
  (force pnpm 9.15 — Vercel installe pnpm 6.35 par défaut, incompatible)
- **Build command** : `npx astro build`

## API routes (5 forms)

| Endpoint              | Use case                              | Notes                                                       |
| --------------------- | ------------------------------------- | ----------------------------------------------------------- |
| `/api/contact`        | Form contact `/contact`               | redirect `/bienvenue/contact` après POST                    |
| `/api/newsletter`     | Signup newsletter footer              | déclenche email welcome via Resend                          |
| `/api/lead-magnet`    | Download gated `/ressources/...`      | redirect `/bienvenue/livre-blanc` + email PDF link          |
| `/api/devis`          | Configurateur devis                   | redirect `/bienvenue/devis` + alerte interne                |
| `/api/academy`        | Diagnostic 12 questions               | scoring + tag hot lead si score < 12/24                     |
| `/api/healthcheck`    | Health check sans imports             | endpoint trivial pour valider que SSR routing fonctionne    |

> **Workaround actif** : tous les endpoints utilisent `export const ALL`
> avec dispatch méthode interne au lieu de `export const POST`, à cause du
> bug `@astrojs/vercel@10` qui exclut les `POST` du bundle SSR sur monorepo
> pnpm. Cf [`../../docs/known-issues.md`](../../docs/known-issues.md) #1
> et [`../../docs/astro-bug-report.md`](../../docs/astro-bug-report.md).

## Branches

- `main` — production
- `feat/*` — nouvelles features
- `refactor/*` — refactor architectural
- `fix/*` — corrections
- `docs/*` — documentation seule

## Licence

Propriétaire — Waimia 2026.
