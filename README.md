# Waimia · Monorepo

Site web + scheduling self-hosted + packages partagés.

## Status

| Composant     | État              | URL                                                          |
| ------------- | ----------------- | ------------------------------------------------------------ |
| `apps/web`    | ✅ Production      | <https://waimia-v2.vercel.app> (alias `waimia.com` à venir)  |
| `apps/cal`    | ⏳ Phase 5 (DNS)   | `cal.waimia.com` — code prêt, déploiement Vercel à finaliser |
| 5 forms API   | ✅ Production      | `/api/{contact,newsletter,lead-magnet,devis,academy}`        |
| Resend emails | ✅ Production      | DKIM + SPF configurés sur `waimia.fr`                        |
| Cal.com embed | ✅ Production      | iframe `cal.com/simonberos/audit` sur `/contact`             |

> **Bug upstream tracké** : `@astrojs/vercel@10` exclut les `export const POST`
> du bundle SSR sur monorepo pnpm. Workaround `export const ALL` appliqué sur
> les 5 forms — cf [`docs/known-issues.md`](docs/known-issues.md) et
> [`docs/astro-bug-report.md`](docs/astro-bug-report.md) (issue GitHub à
> ouvrir upstream).

## Structure

```
waimia-monorepo/
├── apps/
│   ├── web/                Astro 6 SSR · waimia.com (en prod sur Vercel)
│   └── cal/                Cal.com self-host · cal.waimia.com (Phase 5)
├── packages/
│   ├── db/                 Prisma client + types partagés (Cal.com / future Waimia DB)
│   └── lib/                Utils communs : Resend, types, helpers
├── docs/                   Docs transverses (cal-setup, known-issues, astro-bug-report)
├── package.json            Workspace root (pnpm workspaces + Turborepo)
├── pnpm-workspace.yaml     Définition workspaces (web + packages, cal isolé en yarn)
└── turbo.json              Pipeline tâches Turborepo
```

## Quickstart

### Pré-requis

- Node 22.12+ (CI utilise Node 24)
- pnpm 9.15+ (installé via `npx -y pnpm@9.15.0` sur Vercel)
- yarn 4.12 Berry (uniquement pour Cal.com, lockfile dans `apps/cal/yarn.lock`)

### Installation

```bash
# 1. Installer les workspaces pnpm (web + packages)
pnpm install

# 2. Installer Cal.com séparément (yarn isolé)
cd apps/cal && yarn install
```

### Dev

```bash
# Web Astro (waimia.com)
pnpm dev:web                # localhost:4321

# Cal.com (cal.waimia.com)
pnpm dev:cal                # localhost:3000

# Les deux en parallèle
pnpm dev
```

### Build

```bash
# Web
pnpm build:web

# Tout (Turborepo)
pnpm build
```

## Apps

### `apps/web` · waimia.com (Astro)

Site marketing principal. SSR via `@astrojs/vercel`. Templates atomic design (atoms / molecules / organisms / templates / pages).

→ Voir [`apps/web/README.md`](apps/web/README.md) pour les détails.

### `apps/cal` · cal.waimia.com (Cal.com self-host)

Scheduling self-hosted. Stack Next.js 15 + Prisma 5. Yarn 3 Berry isolé du reste du monorepo (convention upstream).

Source : `github.com/calcom/cal.com` cloné le 2026-04-27, sync upstream toutes les 4-6 semaines via `git remote upstream`.

## Packages

### `packages/db`

Prisma schemas + clients partagés.

### `packages/lib`

Utils communs (Resend client, types Bi, helpers i18n).

## Déploiement

2 projets Vercel séparés sur le même repo :

| Projet Vercel          | Root Directory | Domain           |
| ---------------------- | -------------- | ---------------- |
| `waimia-v2` (existant) | `apps/web`     | `waimia.com`     |
| `waimia-cal` (à créer) | `apps/cal`     | `cal.waimia.com` |

Variables d'environnement partagées (RESEND_API_KEY, OPENAI_API_KEY) au niveau team Vercel.

## Maintenance Cal.com upstream

`apps/cal` n'a pas de `.git` autonome — il vit dans le monorepo. La sync
upstream se fait donc via **git subtree merge depuis la racine** :

```bash
# Setup initial (une seule fois)
git remote add cal-upstream https://github.com/calcom/cal.com.git
git fetch cal-upstream

# Sync périodique (toutes les 4-6 semaines)
git fetch cal-upstream
git merge -s subtree -X subtree=apps/cal cal-upstream/main --squash
cd apps/cal && yarn install && yarn prisma migrate dev
# tester localement → commit → push → Vercel auto-deploy
```

→ Voir [`docs/cal-setup.md`](docs/cal-setup.md) pour le workflow complet
(setup initial, cherry-pick sélectif, rollback, points d'attention yarn /
Prisma / modifs locales).

## Documentation transverse

| Fichier                                                | Sujet                                                                |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| [`docs/architecture.md`](docs/architecture.md)         | Vue d'ensemble monorepo, isolation pnpm/yarn, dépendances inter-apps |
| [`docs/conventions.md`](docs/conventions.md)           | Conventions code (commit, branches, lint)                            |
| [`docs/deploy.md`](docs/deploy.md)                     | Pipeline Vercel : env vars, rootDirectory, install/build commands    |
| [`docs/adding-an-app.md`](docs/adding-an-app.md)       | Recette pour ajouter une 3ᵉ app au monorepo                          |
| [`docs/cal-setup.md`](docs/cal-setup.md)               | Cal.diy self-host : setup, sync upstream subtree, env vars Vercel    |
| [`docs/cal-deploy-runbook.md`](docs/cal-deploy-runbook.md) | Phase 5 step-by-step : projet Vercel, env vars, DNS, validation prod |
| [`docs/known-issues.md`](docs/known-issues.md)         | Bugs trackés (POST exclusion @astrojs/vercel@10, Vite 8 + Tailwind4) |
| [`docs/astro-bug-report.md`](docs/astro-bug-report.md) | Brouillon issue GitHub upstream Astro à ouvrir                       |
| [`docs/ci-template.md`](docs/ci-template.md)           | Template `.github/workflows/ci.yml` (lint + typecheck + e2e)         |

## License

- `apps/web` : propriétaire Waimia
- `apps/cal` : AGPL-3.0 (Cal.com upstream — usage non modifié, juste config)
- `packages/*` : propriétaire Waimia
