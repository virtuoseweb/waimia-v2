# Architecture du monorepo Waimia

Vue d'ensemble pour comprendre le projet en 5 minutes et savoir où ajouter du code.

## Layout

```
waimia-monorepo/                ← repo GitHub (dossier local : site/)
│
├── apps/                       Applications déployables (= 1 sous-domaine = 1 projet Vercel)
│   ├── web/                    waimia.com         · Astro 6 SSR · pnpm
│   └── cal/                    cal.waimia.com     · Cal.com self-host · yarn 4 berry (isolé)
│
├── packages/                   Librairies partagées entre apps (workspace pnpm)
│   ├── db/                     @waimia/db         · Prisma schemas + clients
│   └── lib/                    @waimia/lib        · Resend, types, helpers i18n
│
├── docs/                       Documentation interne
├── .github/                    CI/CD GitHub Actions + templates PR
├── package.json                Workspace root (pnpm)
├── pnpm-workspace.yaml         Définition workspaces (apps/web + packages/*)
├── turbo.json                  Pipeline tâches Turborepo
├── tsconfig.base.json          TS config partagée (extends-able)
├── .npmrc                      Politique pnpm (dev-friendly, lockfile non-strict)
├── .nvmrc                      Pin Node 22.12.0
├── .prettierrc                 Format unifié racine
└── .editorconfig               Cohérence éditeur racine
```

## Principes d'isolation

1. **Runtime** · 1 app = 1 sous-domaine = 1 projet Vercel = 1 rootDirectory.
   Quand un visiteur charge `waimia.com`, **0 byte** de Cal.com n'est servi.
   Déploiements immutables séparés, aucun cross-loading possible.

2. **Build** · `pnpm --filter waimia-web build` ne touche que `apps/web` + ses
   dépendances internes (`@waimia/db`, `@waimia/lib` si importées).
   Cache Turborepo distribué (Vercel Remote Cache si `vercel link`).

3. **Stacks hétérogènes** · `apps/web` est en pnpm + Astro,
   `apps/cal` est en yarn 4 berry + Next 16. Lockfiles séparés, `node_modules`
   séparés. Aucun risque de pollution croisée.

## Diagramme dépendances internes

```
apps/web ────depends-on────▶ @waimia/lib (futur · quand 3 usages cross-app)
apps/web ────depends-on────▶ @waimia/db  (futur · quand business DB activée)
apps/cal ────isolé────▶ (yarn workspace upstream Cal.com, pas de cross-import)
```

Tant qu'`@waimia/*` ne contient que des skeletons, `apps/web` est autonome.
Règle d'extraction (best practice 2025) : **3 usages = promotion** vers
`packages/*`. En dessous, le code reste dans l'app qui l'utilise.

## Pourquoi pas une seule app monolithique ?

- **Cycles d'évolution différents** · Cal.com sync upstream toutes les 4-6
  semaines (suivre la communauté), waimia.com push features chaque jour.
- **Stacks incompatibles** · Cal.com = Next 16/yarn 4, waimia.com = Astro 6/pnpm.
  Un seul `package.json` créerait des résolutions de versions impossibles.
- **Surface de bugs séparée** · Un crash de Cal.com self-host n'impacte pas
  waimia.com (et inversement). C'est exactement ce qu'on veut.

## Pourquoi un monorepo plutôt que 2 repos GitHub ?

- **Code partagé sans publication npm** · `@waimia/lib` consommable directement
  via workspace, pas besoin de versioning/publish.
- **PRs cross-cutting** · Une feature qui touche à la fois web + lib ne demande
  qu'1 PR, pas 2 PRs synchronisés (cauchemar à reviewer).
- **CI unifiée** · `turbo run test` lance tous les tests pertinents en un seul
  workflow GitHub Actions.
- **Cache Turborepo** · Build d'`apps/web` cached côté Vercel = re-deploy
  d'`apps/cal` ne re-build pas web (et inversement).

## Évolutions prévues

| Sous-domaine futur | App envisagée | Stack candidate           |
| ------------------ | ------------- | ------------------------- |
| `app.waimia.com`   | apps/app      | À définir (Next ? Astro ?) |
| `blog.waimia.com`  | apps/blog     | Astro Content Collections |
| `docs.waimia.com`  | apps/docs     | Astro Starlight ?         |

Convention : 1 app = 1 sous-domaine = 1 projet Vercel.

## Lectures complémentaires

- [adding-an-app.md](./adding-an-app.md) · procédure pour ajouter `apps/<nouveau>`
- [conventions.md](./conventions.md) · naming, commits, branches, lockfiles
- [deploy.md](./deploy.md) · Vercel projects, DNS, sous-domaines
