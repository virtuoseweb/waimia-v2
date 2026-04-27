# Waimia · Monorepo

Site web + scheduling self-hosted + packages partagés.

## Structure

```
waimia-monorepo/
├── apps/
│   ├── web/                Astro 6 SSR · waimia.com (en prod sur Vercel)
│   └── cal/                Cal.com self-host · cal.waimia.com (à venir)
├── packages/
│   ├── db/                 Prisma client + types partagés (Cal.com / future Waimia DB)
│   └── lib/                Utils communs : Resend, types, helpers
├── package.json            Workspace root (pnpm workspaces + Turborepo)
├── pnpm-workspace.yaml     Définition workspaces (web + packages, cal isolé en yarn)
└── turbo.json              Pipeline tâches Turborepo
```

## Quickstart

### Pré-requis

- Node 22.12+
- pnpm 9.0+
- yarn 3+ (uniquement pour Cal.com)

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

```bash
cd apps/cal
git remote add upstream https://github.com/calcom/cal.com.git  # une seule fois
git fetch upstream
git checkout -b sync/v4.x.0
git merge upstream/main
yarn install
yarn prisma migrate dev
# tester localement
git push origin sync/v4.x.0  # → PR review → merge → deploy Vercel
```

## License

- `apps/web` : propriétaire Waimia
- `apps/cal` : AGPL-3.0 (Cal.com upstream — usage non modifié, juste config)
- `packages/*` : propriétaire Waimia
