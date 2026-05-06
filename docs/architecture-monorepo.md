# Architecture monorepo Waimia v2

**Source de vérité** pour l'organisation du repo `waimia-v2`, le mapping Vercel ↔ domaines, et le partitioning entre projets (apps), monorepo principal et side-projects.

Dernière mise à jour : 2026-05-06 (post PR #4 hotfix Resend HTTPS).

## 1. Vue d'ensemble

```
virtuoseweb/waimia-v2 (PUBLIC, GitHub)
├── apps/
│   ├── web/                    # Site marketing waimia.com (Astro 6.1.9 + React 19 + Tailwind 4)
│   └── cal/                    # cal.diy self-host cal.waimia.com (Next.js + Yarn Berry + Prisma)
├── packages/
│   ├── db/                     # (placeholder)
│   └── lib/                    # Utilities shared (à enrichir)
├── docs/                       # Documentation canonique
├── scripts/                    # Scripts opérationnels (deploy-validate, etc.)
├── package.json                # workspace pnpm root
├── pnpm-workspace.yaml         # apps/web + packages/* (apps/cal exclu, Yarn Berry)
├── turbo.json                  # Orchestration build/dev
├── tsconfig.base.json          # Config TS partagée
├── .prettierrc + .editorconfig + .gitignore
└── README.md
```

## 2. Mapping projets Vercel ↔ domaines

| Vercel project | Root dir | Framework | Domaine production | Source GitHub | Status |
|---|---|---|---|---|---|
| **waimia-v2** | `apps/web` | Astro | **waimia.com** | `waimia-v2/apps/web` | ✅ ACTIVE |
| **waimia-v2-web** | `apps/cal` | Next.js | **cal.waimia.com** | `waimia-v2/apps/cal` | ⚠️ TO RENAME → `waimia-v2-cal` |

**⚠️ Confusion nommage** : le project Vercel `waimia-v2-web` héberge en réalité l'app `apps/cal` (le `web` réfère à `apps/cal/apps/web` interne — le web Next.js de cal.diy upstream). À renommer en `waimia-v2-cal`.

## 3. Stratégie pnpm vs Yarn Berry

`pnpm-workspace.yaml` :
- **Inclus** : `apps/web` + `packages/*` (gestion via pnpm)
- **Exclu** : `apps/cal` (utilise Yarn 3 Berry par convention upstream cal.diy)

**Justification** :
- Cal.diy upstream maintient son lockfile Yarn Berry
- Conversion vers pnpm = ~2-4h friction + risque de divergence à chaque sync upstream
- Isolation = `cd apps/cal && yarn install` séparément, jamais touché par `pnpm install` root

## 4. Configuration partagée (hoist vers root)

### 4.1 Déjà hoist (root)

| Fichier | Usage |
|---|---|
| `tsconfig.base.json` | Config TS extends par tous les apps/packages |
| `.prettierrc` + `.prettierignore` | Format code |
| `.editorconfig` | Standards éditeur |
| `.gitignore` | Patterns globaux |
| `.npmrc` + `.nvmrc` | Versions Node + registry |
| `turbo.json` | Cache + orchestration |
| `package.json` (root) | Scripts top-level + Turbo only |

### 4.2 À hoist (recommandation Phase B)

| Tool | Status actuel | Action |
|---|---|---|
| `typescript` | apps/web 6.0.3 / cal 5.x | Hoist `^6.x` à root devDependencies |
| `prettier` | déjà via .prettierrc root | Hoist binary à root |
| `eslint` (config base) | apps/web manquant | Créer `packages/eslint-config-waimia` |
| `tailwindcss` | apps/web 4.2.4 | NE PAS hoist (cal a sa propre version Tailwind 3.4) |
| `playwright` | apps/web | Garder app-specific |

### 4.3 Garder app-specific

- `astro` + plugins → `apps/web`
- `next`, `prisma`, `trpc` → `apps/cal`
- `nodemailer`, `resend` → contextuel selon app

## 5. Variables d'environnement (.env)

### 5.1 Hiérarchie actuelle

| Fichier | Purpose | Visibility |
|---|---|---|
| `apps/web/.env.local` | Dev local (ignored) | apps/web only (Astro) |
| `apps/web/.env.example` | Template doc | committed |
| `apps/cal/.env` | Dev local cal (ignored) | apps/cal only (Next.js) |
| `apps/cal/.env.example` | Template doc | committed |
| `apps/cal/packages/prisma/.env` | Migrations Prisma | apps/cal only |

### 5.2 Variables partagées (apps/web ↔ apps/cal)

```
RESEND_API_KEY          # Resend transactional
EMAIL_FROM              # Format "Name <email@domain>"
EMAIL_REPLY_TO          # Reply-to humaine
EMAIL_INTERNAL_TO       # Alertes interne équipe
```

**Pour l'instant** : ces 4 vars sont **dupliquées** entre `apps/web/.env` et `apps/cal/.env` (ainsi que dans Vercel projects respectifs).

**Phase B recommandée** : créer `.env.shared` à la racine, charger via script wrapper Astro/Next pour éviter duplication. Inconvénient : Astro et Next chargent différemment, complexité moyenne.

**Décision** : laisser dupliqué pour l'instant — priorité de cohérence > économie 4 vars.

### 5.3 Variables app-specific

| App | Vars unique |
|---|---|
| `apps/web` | `PUBLIC_CAL_USERNAME`, `PUBLIC_CAL_EVENT_TYPE`, `PUBLIC_SITE_URL`, `RESEND_AUDIENCE_ID`, `NOTION_TOKEN` |
| `apps/cal` | 60+ Cal.diy specifics (DATABASE_URL, NEXTAUTH_SECRET, CALENDSO_ENCRYPTION_KEY, GOOGLE_API_CREDENTIALS, CALCOM_*, CAL_VIDEO_*, etc.) |

## 6. Side projects (monorepo séparé prévu)

### Nouveau repo : `virtuoseweb/waimia-side-projects`

```
waimia-side-projects/
├── apps/
│   ├── quiz/              # Quiz interactifs / lead magnets
│   ├── agent-rh-ia/       # Agent RH IA
│   ├── legalcheck/        # LegalCheck (compliance AI)
│   └── python-tools/      # Logiciel Python
├── packages/              # Lib partagées side-projects
└── ... (même structure pnpm + turbo)
```

**Ne PAS inclure** dans `waimia-v2` : ça polluerait le monorepo principal et complexifierait les builds Vercel (un mauvais commit dans `quiz/` triggerait un rebuild cal.waimia.com).

### Repos à archiver (legacy / clients délivrés)

| Repo GitHub | Status | Action |
|---|---|---|
| `virtuoseweb/waimia` | legacy v1 (75KB) | 🗄️ ARCHIVE |
| `virtuoseweb/sitewebastro` | 1GB Astro pre-pivot | ⚠️ VERIFY tout migré dans waimia-v2/apps/web → ARCHIVE |
| `virtuoseweb/sitewebnaturopathe` | client 75d stale | ⚠️ CHECK avec client → ARCHIVE ou MIGRATE side-projects |
| `virtuoseweb/fiducie-expert` | client 49d stale | ⚠️ CHECK |
| `virtuoseweb/mastercompta` | client 4mo stale | ⚠️ CHECK |
| `virtuoseweb/os-virtuoseweb` | duplicate ai-enterprise-os ? | 🔍 DIFF puis archive un des deux |

## 7. Workflows critiques

### 7.1 Deploy waimia.com (apps/web)

1. Push to `main` branch → Vercel auto-deploy `waimia-v2` project
2. Build : `pnpm --filter waimia-web build` → output `apps/web/dist`
3. Domain alias : `waimia.com` → latest Ready production

### 7.2 Deploy cal.waimia.com (apps/cal)

1. Push to `main` → Vercel auto-deploy `waimia-v2-web` project
2. Build : `cd apps/cal && yarn build` → output `.next`
3. Migrations : `prisma migrate deploy` au build (utilise role `prisma_migration`)
4. Domain alias : `cal.waimia.com` → latest Ready

**⚠️ Connection pool issue** : voir `docs/cal-deploy-runbook.md` §13.18 (Prisma Accelerate planned)

### 7.3 Sync upstream cal.diy

```bash
cd apps/cal
git fetch upstream  # https://github.com/calcom/cal.com
git subtree pull --prefix=apps/cal upstream main --squash
# Reapply local patches : sendViaResendHttps.ts (PR #1 + #4)
```

## 8. Conventions code

- **Tab indentation** = 2 spaces (.editorconfig)
- **Quotes** = double `"..."` (Prettier)
- **Imports** = no barrel, direct path
- **Tests** = Playwright E2E (apps/web) + Vitest cal.diy (apps/cal hérité upstream)
- **Commits** = conventional `feat:` / `fix:` / `docs:` / `chore:`
- **Branches** = `feat/*`, `fix/*`, `docs/*`, `chore/*`

## 9. Ce qui reste à faire (Phase B)

- [ ] Renommer Vercel `waimia-v2-web` → `waimia-v2-cal`
- [ ] Update `apps/cal/.vercel/project.json` (projectName)
- [ ] Update GitHub topics + about description
- [ ] Setup Prisma Accelerate (pool DB durable)
- [ ] Hoist TypeScript root devDeps
- [ ] Créer `packages/eslint-config-waimia` shared
- [ ] Archive `waimia` legacy GitHub + Vercel
- [ ] Décider sort `sitewebastro` (verify migration → archive)
- [ ] Créer `virtuoseweb/waimia-side-projects` monorepo template
- [ ] Migrer ou archiver clients (naturopathe / fiducie / mastercompta)
- [ ] Update DNS + Vercel domains (waimia.com → waimia-v2 confirmé, cal.waimia.com → waimia-v2-cal)

## 10. Annexes

- [`cal-deploy-runbook.md`](cal-deploy-runbook.md) — Runbook deploy cal complet
- [`cal-setup.md`](cal-setup.md) — Setup initial Cal.diy
- [`/tmp/waimia-vault-audit/INVENTORY.md`](/tmp/waimia-vault-audit/INVENTORY.md) — Audit secrets/credentials
- [`/tmp/waimia-vault-audit/INFRA-MAPPING.md`](/tmp/waimia-vault-audit/INFRA-MAPPING.md) — Mapping infra brut
- [`/tmp/waimia-vault-audit/PRISMA-CONNECTION-ISSUE.md`](/tmp/waimia-vault-audit/PRISMA-CONNECTION-ISSUE.md) — Issue Prisma pool
