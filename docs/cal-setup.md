# Cal.diy self-host · architecture, état actuel, maintenabilité

Documentation pour humains et agents IA travaillant sur `apps/cal`. Source de vérité unique pour l'installation, le déploiement, la migration future et la maintenance long terme.

## Vue d'ensemble en 30 secondes

| Quoi          | Détail                                                                  |
| ------------- | ----------------------------------------------------------------------- |
| **App**       | `apps/cal/` — fork de github.com/calcom/cal.com                         |
| **License**   | MIT (Cal.com, Inc.) ✓ libre usage commercial                            |
| **Stack**     | Next.js 16 + React 18 + Prisma 6 + Yarn 4.12 berry                      |
| **DB**        | Prisma Postgres (managed, https://prisma.io) — pooled connection       |
| **Status**    | 🚧 **dev local OK** sur `localhost:3000` · 🔜 prod `cal.waimia.com`    |
| **Pourquoi**  | Remplacer la dépendance `cal.com/simonberos/audit` par self-host souverain |

## Différence Cal.diy vs Cal.com

`cal.diy` = **édition open-source community** spinned out de Cal.com. License MIT, communauté maintenue, **non recommandé pour usage commercial entreprise** par les auteurs.

| Feature                        | Cal.diy | Cal.com SaaS |
| ------------------------------ | :-----: | :----------: |
| Event Types, Recurring, Seated |   ✅    |      ✅      |
| Paid Events (Stripe / PayPal)  |   ✅    |      ✅      |
| Booking Management             |   ✅    |      ✅      |
| Cal Video, Zoom, Meet, Teams   |   ✅    |      ✅      |
| Webhooks, Zapier, n8n, CRM     |   ✅    |      ✅      |
| API v2 + Embed widget          |   ✅    |      ✅      |
| Email/Password + Google/MS OAuth |  ✅    |      ✅      |
| **Teams / Organizations**      |   ❌    |      ✅      |
| **SAML SSO / SCIM**            |   ❌    |      ✅      |
| **Workflows automations**      |   ❌    |      ✅      |
| **Routing Forms**              |   ❌    |      ✅      |
| **Insights Dashboard**         |   ❌    |      ✅      |
| **Admin Panel**                |   ❌    |      ✅      |

Pour Waimia (solo), aucun feature manquant n'est bloquant. Si on grandit en équipe, considérer Cal.com SaaS ou Cal.com on-prem enterprise.

## Architecture monorepo

```
apps/cal/                              ← root Cal.diy (yarn 4 berry isolé)
├── apps/                              # apps internes Cal
│   ├── web/                           # Next 16 frontend principal (port 3000)
│   │   └── app/api/cron/              # 7 cron jobs (bookings, calendars, etc.)
│   ├── api/v2/                        # API v2 REST séparée
│   ├── ai/                            # IA agents Cal
│   └── ...
├── packages/                          # libs internes Cal
│   ├── prisma/                        # schema + migrations DB
│   │   ├── schema.prisma              # source de vérité schema
│   │   └── migrations/                # ~150 migrations versionnées
│   ├── lib/                           # utils Cal
│   ├── trpc/                          # API trpc
│   └── ...
├── .env                               # config locale (gitignored)
├── .env.example                       # template avec ~493 lignes commentées
├── .env.appStore                      # config apps tierces (Google, Stripe, ...)
├── .env.appStore.example              # template apps
├── .yarnrc.yml                        # config yarn 4 berry
├── package.json                       # name: calcom-monorepo, packageManager: yarn@4.12.0
├── docker-compose.yml                 # alternative Docker (pas utilisée pour l'instant)
└── LICENSE                            # MIT
```

**Isolation totale** vs `apps/web` :
- Lockfile séparé (`yarn.lock` vs `pnpm-lock.yaml`)
- `node_modules` séparés (yarn berry zero-install)
- Pas de cross-import (jamais `import from '../web'`)
- Workspace pnpm racine ignore `apps/cal` (cf `pnpm-workspace.yaml`)

## État actuel (validé empiriquement)

| Étape                                  | Status | Comment vérifier                              |
| -------------------------------------- | :----: | --------------------------------------------- |
| `git clone calcom/cal.com`             |   ✅   | `apps/cal/.git` (sub-repo retiré, intégré au monorepo) |
| `yarn install` (yarn 4 berry)          |   ✅   | `apps/cal/node_modules/` présent              |
| `.env` créé + valeurs renseignées      |   ✅   | `apps/cal/.env` (493 lignes, gitignored)      |
| `.env.appStore` template présent       |   ✅   | À renseigner si activation apps tierces       |
| `NEXTAUTH_SECRET` généré              |   ✅   | Via `openssl rand -base64 32`                 |
| `CALENDSO_ENCRYPTION_KEY` généré      |   ✅   | Via `openssl rand -base64 32`                 |
| Prisma migrate appliqué               |   ✅   | ~150 migrations Cal.com 4.x sur Prisma Postgres pooled |
| Setup wizard accessible               |   ✅   | `http://localhost:3000/auth/setup` → 200      |
| Cron jobs identifiés                  |   ✅   | `apps/cal/apps/web/app/api/cron/` (7 endpoints) |
| Vercel deploy `cal.waimia.com`         |   ❌   | À configurer (cf section Deploy ci-dessous)   |
| DNS sous-domaine `cal.waimia.com`      |   ❌   | CNAME à pointer vers Vercel                   |
| Bascule embed waimia.com → cal.waimia.com | ❌  | Update env `PUBLIC_CAL_USERNAME` quand prod up |

## Lancer Cal.diy en dev local

```bash
cd /Users/simonberos/waimia-site/site/apps/cal
yarn dev
```

Démarre Next.js 16 sur `http://localhost:3000`. Premier accès → redirige vers `/auth/setup?step=1` (wizard administrateur).

**Astuce** : pour lancer Cal + Astro web en parallèle :
```bash
# Depuis la racine monorepo
pnpm dev
# → turbo run dev --parallel
# Astro waimia-web sur :4321 + Cal.diy sur :3000
```

## Setup wizard administrateur (1ère fois)

À l'URL `http://localhost:3000/auth/setup`, le wizard demande :

### Étape 1 · Utilisateur administrateur

- **Nom d'utilisateur** (slug) — visible dans URL booking : `cal.waimia.com/<slug>`
- **Nom complet**
- **Adresse e-mail**
- **Mot de passe** (≥ 15 caractères, mélange casse + au moins 1 chiffre)

### Étape 2 · Configuration globale

- Fuseau horaire par défaut
- Format de l'heure (12 / 24h)
- Premier jour de la semaine
- Langue par défaut (FR pour Waimia)

Une fois validé → admin user créé en DB. Login automatique → redirection `/event-types` pour créer le premier event type.

## Configurer les Event Types

Pour Waimia, 1 event type recommandé en démarrage :

| Event           | Slug            | Durée  | Description                                  |
| --------------- | --------------- | ------ | -------------------------------------------- |
| Audit IA        | `audit`         | 45 min | Diagnostic 1-1 prospect — défaut Waimia      |

Lien public final : `https://cal.waimia.com/<username>/audit`.

Apps tierces optionnelles à connecter :
- **Google Calendar** (sync auto) — clé dans `.env.appStore`
- **Cal Video** (Daily.co intégré)
- **Stripe** (si paiement à la prise de RDV)

## Database Migrations

### Schéma source de vérité
`apps/cal/packages/prisma/schema.prisma`

### Commandes Prisma

```bash
cd apps/cal

# Dev local : génère migration + applique sur DB locale
yarn workspace @calcom/prisma db-migrate

# Prod : applique migrations sans en générer
yarn workspace @calcom/prisma db-deploy

# Studio interactif (visualisation DB)
yarn db-studio
```

### Workflow modification de schema

1. Modifier `packages/prisma/schema.prisma`
2. `yarn workspace @calcom/prisma db-migrate`
3. Donner un nom court (ex: `add_user_phone_field`)
4. **Toujours review** ce que Prisma génère — il drop des colonnes silencieusement parfois
5. Commit la migration ET le code qui l'utilise dans le même PR

### Erreur P3005 (database not empty)

Si Prisma se plaint que la DB n'est pas vide :
```bash
yarn prisma migrate resolve --applied <migration_name>
```
Pour chaque migration qui devrait déjà être appliquée.

### Reset complet local (urgence)

```sql
-- En PostgreSQL admin
DELETE FROM "_prisma_migrations";
```
Puis re-applique tout :
```bash
ls -1a packages/prisma/migrations/ | grep 2021 | xargs -I{} yarn prisma migrate resolve --applied {}
```

## Déploiement Vercel (cal.waimia.com)

⚠️ **Vercel Pro Plan requis** — Cal.com a beaucoup de routes API qui dépassent les limites du free tier (12 serverless functions max free).

### Pré-requis

- Compte Vercel Pro (ou Hobby si on bypass via Build Output API consolidation)
- DB Postgres externe (✅ déjà : Prisma Postgres pooled)
- Domain `cal.waimia.com` configuré dans le registrar

### Étapes

1. **Vercel Dashboard** → New Project → Import du repo `virtuoseweb/waimia-v2`
2. **Project Name** : `waimia-cal`
3. **Framework Preset** : auto-détecté (Next.js)
4. **Root Directory** : `apps/cal`
5. **Build & Development Settings** :
   - Install Command (override) : `YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install`
   - Build Command (override) : `cd ../.. && yarn build --include-dependencies --no-deps`
6. **Environment Variables** (Production scope) :
   - `DATABASE_URL` (Prisma Postgres pooled — même valeur qu'en local)
   - `DATABASE_DIRECT_URL` (idem, pour migrations)
   - `NEXTAUTH_SECRET` (générer un nouveau via `openssl rand -base64 32`)
   - `CALENDSO_ENCRYPTION_KEY` (idem)
   - `NEXT_PUBLIC_WEBAPP_URL` = `https://cal.waimia.com`
   - `NEXT_PUBLIC_WEBSITE_URL` = `https://cal.waimia.com`
   - `NEXTAUTH_URL` = `https://cal.waimia.com`
   - `EMAIL_FROM` = `Cal Waimia <cal@virtuoseweb.fr>` (domaine vérifié Resend)
   - `EMAIL_SERVER_*` (SMTP) — Resend ou Sendgrid
   - `ALLOWED_HOSTNAMES` = `"cal.waimia.com"`
   - **Préfixer apps tierces** : `GOOGLE_API_CREDENTIALS`, `MS_GRAPH_CLIENT_ID`, `STRIPE_*` selon les intégrations activées
   - Pour preview : laisser `NEXTAUTH_URL`, `NEXT_PUBLIC_WEBAPP_URL`, `NEXT_PUBLIC_WEBSITE_URL` **vides** (Vercel les set automatiquement avec l'URL preview)

7. **Domains** → ajouter `cal.waimia.com`

8. **DNS registrar** :
   ```
   Type    Name    Value                       TTL
   CNAME   cal     cname.vercel-dns.com.       3600
   ```

9. **Cron Jobs Vercel** (si plan Pro) → ajouter dans `vercel.json` à la racine de `apps/cal/` :
   ```json
   {
     "crons": [
       { "path": "/api/cron/bookingReminder", "schedule": "0 * * * *" },
       { "path": "/api/cron/calendar-subscriptions", "schedule": "*/15 * * * *" },
       { "path": "/api/cron/calendar-subscriptions-cleanup", "schedule": "0 0 * * *" },
       { "path": "/api/cron/changeTimeZone", "schedule": "0 1 * * *" },
       { "path": "/api/cron/selected-calendars", "schedule": "*/30 * * * *" },
       { "path": "/api/cron/syncAppMeta", "schedule": "0 4 * * *" },
       { "path": "/api/cron/webhookTriggers", "schedule": "*/5 * * * *" }
     ]
   }
   ```
   Sécurité : protéger les crons avec `CRON_API_KEY` env var (vérifié dans le handler).

### Premier deploy

- Vercel rebuild → ~3-5 min (Cal.com est gros : ~2 GB après build)
- Si `yarn install` échoue avec "immutable" : env var `YARN_ENABLE_IMMUTABLE_INSTALLS=false` (déjà dans installCommand override)
- Run migration au premier deploy : `vercel build` → run `yarn workspace @calcom/prisma db-deploy` une fois prod up

### Smoke tests post-deploy

```bash
# Page setup
curl -I https://cal.waimia.com/auth/setup       # 200
# API health
curl    https://cal.waimia.com/api/healthcheck  # 200 ok
# Login page
curl -I https://cal.waimia.com/auth/login       # 200
```

## Bascule waimia.com → cal.waimia.com

Une fois `cal.waimia.com` opérationnel et un event type `audit` créé :

### 1. Update env Vercel `waimia-v2`

```bash
# Vercel dashboard ou CLI
vercel env rm PUBLIC_CAL_USERNAME production
vercel env rm PUBLIC_CAL_EVENT_TYPE production
printf "<your-cal-username>" | vercel env add PUBLIC_CAL_USERNAME production
printf "audit"               | vercel env add PUBLIC_CAL_EVENT_TYPE production
```

### 2. Update molecule `CalEmbed.astro`

Aujourd'hui (`apps/web/src/components/ui/molecules/CalEmbed.astro`), l'embed pointe sur `cal.com`. Modifier pour utiliser le self-host :

```ts
// Détection :
//   - PUBLIC_CAL_BASE_URL=https://cal.com (default, fallback)
//   - PUBLIC_CAL_BASE_URL=https://cal.waimia.com (self-host)
const calBaseUrl = import.meta.env.PUBLIC_CAL_BASE_URL?.trim() || 'https://cal.com';
```

Ajouter env var `PUBLIC_CAL_BASE_URL=https://cal.waimia.com` sur Vercel `waimia-v2`.

### 3. Re-deploy waimia.com

```bash
git commit --allow-empty -m "trigger redeploy with cal.waimia.com"
git push
```

### 4. Vérification visuelle

Ouvrir `https://waimia.com/contact` → l'embed Cal doit charger depuis `cal.waimia.com`. Réserver un créneau test pour valider le flow E2E (booking + email confirmation).

## Sync upstream Cal.com

Pour suivre les évolutions upstream (security patches, nouvelles features) :

```bash
cd apps/cal

# Une seule fois : ajouter le remote
git remote add upstream https://github.com/calcom/cal.com.git

# Toutes les 4-6 semaines : sync
git fetch upstream
git checkout -b sync/cal-vX.Y.Z
git merge upstream/main
yarn install
yarn workspace @calcom/prisma db-migrate  # si nouvelles migrations
# Tester en local
git push origin sync/cal-vX.Y.Z          # → PR review → merge → redeploy Vercel
```

⚠️ **`apps/cal` n'a actuellement PAS de remote upstream Cal.com configuré** (sub-repo `.git` retiré pour intégration monorepo). À configurer au premier sync.

## Dépendances entre `apps/web` et `apps/cal`

| Élément            | apps/web        | apps/cal           |
| ------------------ | --------------- | ------------------ |
| Domain prod        | waimia.com      | cal.waimia.com     |
| Vercel project     | waimia-v2       | waimia-cal (todo)  |
| Package manager    | pnpm 9          | yarn 4 berry       |
| Database           | -               | Prisma Postgres    |
| Build dependency   | aucune sur cal  | aucune sur web     |
| Runtime dependency | embed via env var `PUBLIC_CAL_BASE_URL` | aucune sur web |

**Isolation forte** : un crash ou rebuild de l'un n'impacte pas l'autre. Le seul lien runtime est l'embed widget JS chargé par `apps/web` sur `/contact`, qui pointe vers le domaine de `apps/cal`.

## Sécurité critique

- `.env` et `.env.appStore` **gitignored** — jamais commit
- `NEXTAUTH_SECRET` doit être unique entre dev et prod
- `CALENDSO_ENCRYPTION_KEY` chiffre les credentials d'apps tierces en DB — perte = re-config de toutes les apps
- `DATABASE_URL` Prisma Postgres : limiter l'accès via IP allowlist (Prisma dashboard)
- En prod : activer 2FA pour le compte admin Cal
- Cron jobs : protéger via `CRON_API_KEY` (Vercel-only header `Authorization: Bearer ${CRON_API_KEY}`)

## Maintenance long terme

| Action                                        | Fréquence       | Outil                                      |
| --------------------------------------------- | --------------- | ------------------------------------------ |
| Sync upstream Cal.com                         | 4-6 semaines    | git remote upstream + yarn + prisma migrate |
| Backup DB Prisma Postgres                     | Auto (managed)  | Prisma dashboard                           |
| Monitoring uptime cal.waimia.com              | Continu         | Vercel Analytics + UptimeRobot recommandé   |
| Rotation secrets (NEXTAUTH_SECRET, etc.)      | Annuelle        | `vercel env rm` + redeploy                 |
| Review apps tierces activées (.env.appStore)  | Trimestrielle   | Audit ce qui sert vraiment                  |

## Anti-patterns à éviter

- ❌ Toucher à `apps/cal/packages/prisma/schema.prisma` sans générer migration
- ❌ Modifier le code Cal.com upstream sans documenter le pourquoi (rend les sync douloureux)
- ❌ Stocker des secrets dans `.env.appStore` committé (toujours `.env.appStore.example` template + valeurs réelles dans Vercel env vars)
- ❌ Activer Cal.com features cachées non testées (Teams, Workflows) — pas dispo en open-source
- ❌ Lancer `yarn dev` dans `apps/cal/apps/web/` au lieu de `apps/cal/` (yarn workspaces)

## Documentation officielle Cal.diy

Source de vérité externe — toujours référer à la doc upstream avant gros changements :

- Vue d'ensemble : https://www.cal.diy/
- Installation : https://www.cal.diy/installation
- Database Migrations : https://www.cal.diy/database-migrations
- Upgrading : https://www.cal.diy/upgrading
- Docker : https://www.cal.diy/docker
- Apps store : https://www.cal.diy/apps
- Vercel deploy : https://www.cal.diy/deployments/vercel

## Liens utiles internes

- [Architecture monorepo](./architecture.md)
- [Déploiement Vercel](./deploy.md) (apps/web)
- [Conventions](./conventions.md) (naming, lockfiles, branches)
- [Adding an app](./adding-an-app.md) (template pour future `apps/blog`, etc.)

## TODO Phase suivante

- [ ] Ajouter `apps/cal/vercel.json` avec crons + env vars de référence
- [ ] Créer projet Vercel `waimia-cal` rootDirectory `apps/cal`
- [ ] Pointer DNS `cal.waimia.com` → Vercel
- [ ] Premier deploy avec migration Prisma
- [ ] Configurer event type `audit` 45min via setup wizard
- [ ] Connecter Google Calendar (apps/.env.appStore)
- [ ] Update `apps/web` `CalEmbed.astro` pour pointer `cal.waimia.com`
- [ ] Smoke test E2E booking complet
- [ ] Configurer remote `upstream calcom/cal.com` pour sync 4-6 semaines
