# Runbook · Déploiement `apps/cal` sur `cal.waimia.com`

> **Cible** : Cal.com self-host accessible sur `https://cal.waimia.com`,
> projet Vercel séparé `waimia-cal` (team `simonberos-projects`,
> id `team_Dz7XreG9vf9VoKmxeaAsIKF0`), root `apps/cal`, branché sur
> `github.com/virtuoseweb/waimia-v2` (même repo que `waimia-v2`).
>
> **Durée estimée** : 45-60 min en première passe (création projet + DNS
> + premier build + DB migrations + validation).
>
> **Prérequis** : compte Vercel actif, accès registrar DNS du domaine
> `waimia.com` (ou `waimia.fr`), Prisma Postgres déjà provisionné lors de
> Phase 2 (cf [`cal-setup.md`](cal-setup.md)).

---

## 0 · État actuel (audit MCP `list_projects`)

Au moment de la rédaction (2026-04-28), la team `simonberos-projects`
contient 7 projets, **aucun nommé `waimia-cal`** :

```
waimia-v2          prj_IW0BXDVTe8seLqHsJZS5lMBILR6n  (← apps/web prod)
waimia             prj_E3tMyoBr8wqvM1UwnlIXU4xrqGBN  (legacy v1)
virtuoseweb-deck   prj_5ilREZ8Y1pMGJj303IdXdHkZPHZf
aquapool           prj_dKZTmznhbvAsgXJ9fbiT9gHZo6x1
virtuoseweb        prj_Y1VYuctvTSRIwLHKJ72Tssc0LoGi
dashboard          prj_QMIBXBjw7t9zN8bwihcfQ7y6Dg9C
sitewebnaturopathe prj_5KByew4NiaJKTFdaI1JNz7Uofy8K
```

→ Étape 1 = **création neuve** du projet `waimia-cal`.

---

## 1 · Création projet Vercel (UI ou CLI)

### Voie A — UI (recommandé première fois)

1. <https://vercel.com/new>
2. **Import Git Repository** → `virtuoseweb/waimia-v2`
3. **Configure Project** :
   - **Project Name** : `waimia-cal`
   - **Root Directory** : `apps/cal` (cliquer Edit → naviguer)
   - **Framework Preset** : Next.js (auto-détecté)
   - **Build & Development Settings** → Override :
     - **Install Command** : `YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install`
     - **Build Command** : `yarn build`
     - **Output Directory** : laisser auto (`.next`)
     - **Development Command** : `yarn dev`
   - **Node.js Version** : 22.x (Cal.com requiert ≥ 18, on cale sur 22 LTS)
4. **Environment Variables** : laisser vide pour l'instant (étape 4)
5. **Deploy** → ce premier build **va échouer** (env vars manquantes,
   c'est attendu). On corrige en étape 4 puis on redéploie.

### Voie B — Vercel CLI (équivalent scriptable)

```bash
cd apps/cal

# Lien initial
npx vercel@latest link \
  --yes \
  --project waimia-cal \
  --scope simonberos-projects

# Si le projet n'existe pas encore, vercel link va le créer
# (--yes accepte la création automatique)
```

> **Note sandbox** : si Claude Code est restreint sur `apps/cal/`, exécuter
> ces commandes manuellement dans un terminal extérieur, ou lever la
> restriction dans `.claude/settings.local.json`.

---

## 2 · Provisioning Postgres (Prisma)

### Si Prisma Postgres déjà provisionné en Phase 2

La connection string vit dans `apps/cal/.env` local sous `DATABASE_URL=`.
La récupérer pour la coller en env var Vercel (étape 4) :

```bash
grep '^DATABASE_URL=' apps/cal/.env | head -1
```

> Format attendu : `postgres://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require`
> Pour Vercel, **utiliser le pooler** (port 6543 typiquement, ou suffix
> `-pooler` dans l'host) pour éviter la saturation du pool de connexions
> en serverless. Pour les migrations, garder l'URL non-poolée en
> `DIRECT_URL`.

### Si nouveau provisioning

Vercel Marketplace → Neon (Postgres) :

1. Settings projet `waimia-cal` → **Storage** → **Create Database** → Neon
2. Confirmer création → Vercel injecte automatiquement :
   - `DATABASE_URL` (pooled)
   - `DIRECT_URL` (non-pooled, pour migrations)
   - `POSTGRES_*` (variantes)
3. Cal.com utilise `DATABASE_URL`. Vérifier qu'il pointe sur le pooler.

---

## 3 · Génération secrets random (faire localement)

```bash
echo "NEXTAUTH_SECRET=$(openssl rand -hex 32)"
echo "CALENDSO_ENCRYPTION_KEY=$(openssl rand -hex 32)"
```

Sauvegarder ces 2 valeurs dans 1Password (ou autre secret manager) avant
de les coller dans Vercel — elles ne sont **jamais régénérables** sans
invalider toutes les sessions et chiffrements existants en DB.

---

## 4 · Env vars Vercel (Production scope)

> **Raccourci** : utiliser [`cal-deploy-env.template.md`](cal-deploy-env.template.md)
> qui contient les blocs `KEY=VALUE` prêts pour le bulk-import Vercel UI.
> Vercel détecte le format `.env` collé et provisionne tout d'un coup.

Settings projet `waimia-cal` → **Environment Variables** → ajouter
**toutes en Production scope** (pas Preview ni Development) :

| Variable                       | Valeur                                                 | Source                                       |
| ------------------------------ | ------------------------------------------------------ | -------------------------------------------- |
| `DATABASE_URL`                 | `postgres://...` (pooler)                              | Phase 2 ou Neon Marketplace                  |
| `DIRECT_URL`                   | `postgres://...` (non-pooler)                          | Idem, port direct                            |
| `NEXTAUTH_URL`                 | `https://cal.waimia.com`                               | Cible domaine final                          |
| `NEXTAUTH_SECRET`              | `<openssl rand -hex 32>`                               | Étape 3                                      |
| `CALENDSO_ENCRYPTION_KEY`      | `<openssl rand -hex 32>`                               | Étape 3                                      |
| `NEXT_PUBLIC_WEBAPP_URL`       | `https://cal.waimia.com`                               | = NEXTAUTH_URL                               |
| `NEXT_PUBLIC_WEBSITE_URL`      | `https://cal.waimia.com`                               | Idem (pas de site séparé)                    |
| `NEXT_PUBLIC_API_V2_URL`       | `https://cal.waimia.com/api/v2` (si API v2 activée)    | Optionnel                                    |
| `EMAIL_FROM`                   | `cal@waimia.fr` (ou `bonjour@waimia.fr`)               | Adresse expéditeur                           |
| `EMAIL_FROM_NAME`              | `Waimia · Cal`                                         | Display name                                 |
| `EMAIL_SERVER_HOST`            | `smtp.resend.com`                                      | Reuse Resend (Phase 2)                       |
| `EMAIL_SERVER_PORT`            | `465`                                                  | TLS                                          |
| `EMAIL_SERVER_USER`            | `resend`                                               | Username Resend SMTP                         |
| `EMAIL_SERVER_PASSWORD`        | `<RESEND_API_KEY>`                                     | Réutiliser la clé Resend du projet waimia-v2 |
| `NODE_ENV`                     | `production`                                           | Auto Vercel                                  |
| `ALLOWED_HOSTNAMES`            | `cal.waimia.com,waimia.com`                            | CORS embed iframe                            |

### Optionnels (selon usage)

| Variable                         | Quand                                              |
| -------------------------------- | -------------------------------------------------- |
| `GOOGLE_API_CREDENTIALS`         | Si intégration Google Calendar                     |
| `MS_GRAPH_CLIENT_ID`/`_SECRET`   | Si intégration Outlook                             |
| `STRIPE_PRIVATE_KEY`/`_WEBHOOK_SECRET` | Si paiements activés                            |
| `DAILY_API_KEY`                  | Si vidéo Daily intégrée                            |
| `SENTRY_DSN`                     | Si monitoring Sentry (recommandé prod)             |
| `CRON_API_KEY`                   | Auth interne pour les routes `/api/cron/*`         |

> **Mémo** : Vercel chiffre toutes les env vars at rest. Inutile de les
> stocker en clair dans le repo. `.env.example` côté Cal.com upstream
> documente les noms (mais pas les valeurs).

---

## 5 · Premier déploiement

Après saisie des env vars :

- **UI** : Settings → **Redeploy** → cocher "Use existing build cache"
  désactivé pour la 1ʳᵉ fois → Confirm.
- **CLI** : `vercel --prod` depuis `apps/cal/`.

Build attendu : ~5-8 min (Cal.com est volumineux). Surveiller les logs :

```bash
# Tail logs build courant
vercel logs <deployment-url> --follow
```

### Erreurs build classiques

| Erreur                                              | Cause + fix                                                    |
| --------------------------------------------------- | -------------------------------------------------------------- |
| `Lockfile is mismatched with package.json`          | `YARN_ENABLE_IMMUTABLE_INSTALLS=false` manquant dans Install   |
| `Cannot find module '@calcom/web'`                  | Build Command sans `turbo run build --filter=@calcom/web...`   |
| `PrismaClientInitializationError: P1001`            | `DATABASE_URL` mal formé ou unreachable depuis Vercel region   |
| `Error: NEXTAUTH_URL is not set`                    | Env var oubliée → Production scope                             |
| `EACCES /tmp/.next-cache`                           | Yarn cache corrompu → toggle "Use existing build cache" OFF    |

---

## 6 · DB migrations + seed (post-build)

Premier déploiement OK ne suffit pas — la DB Postgres est vide. Lancer
les migrations Prisma **une seule fois** depuis local :

```bash
cd apps/cal
# Charger les env vars de prod dans le shell
vercel env pull .env.production --environment=production

# Lancer migrations contre la DB prod (utilise DIRECT_URL)
DATABASE_URL=$(grep '^DIRECT_URL=' .env.production | cut -d= -f2-) \
  yarn prisma migrate deploy
```

Pour le seed initial (admin user) :

```bash
yarn db-seed
```

> **⚠️ Lock Prisma** : si la migration crashe au milieu, vérifier la table
> `_prisma_migrations` et la colonne `finished_at IS NULL` — l'unlocker
> manuellement avant de relancer (`UPDATE _prisma_migrations SET finished_at = NOW(), logs = NULL WHERE finished_at IS NULL`).

---

## 7 · Domaine custom `cal.waimia.com`

### 7.1 · Ajouter le domaine côté Vercel

1. Settings projet `waimia-cal` → **Domains** → **Add**
2. Saisir `cal.waimia.com` → Add
3. Vercel affiche les enregistrements DNS à créer chez le registrar.

### 7.2 · Configurer DNS chez le registrar

Pour `waimia.com` (ou `waimia.fr` selon registrar utilisé) :

| Type    | Name | Value                    | TTL  |
| ------- | ---- | ------------------------ | ---- |
| `CNAME` | `cal` | `cname.vercel-dns.com.` | 3600 |

> **Note** : si le registrar est OVH, Gandi, ou Cloudflare, l'opération
> est instantanée. Sinon, propagation jusqu'à 24h (rare).

### 7.3 · Vérification

```bash
# Doit retourner cname.vercel-dns.com
dig +short CNAME cal.waimia.com

# HTTP doit redirigier vers HTTPS et Cal.com répondre
curl -I https://cal.waimia.com
```

Vercel provisionne automatiquement le certificat Let's Encrypt en ~30s
après détection du CNAME.

### 7.4 · Re-vérifier `NEXTAUTH_URL`

Si tu as initialement déployé sans le domaine custom, `NEXTAUTH_URL`
pointe sur `waimia-cal-xxx.vercel.app`. Une fois `cal.waimia.com` actif :

1. Settings → Environment Variables → éditer `NEXTAUTH_URL` →
   `https://cal.waimia.com` (Production)
2. Redeploy → sinon NextAuth renvoie redirect vers la mauvaise URL.

---

## 8 · Validation post-deploy

> **Raccourci automatisé** : `bash scripts/cal-deploy-validate.sh` lance
> les 5 smoke tests d'un coup (DNS, login, /api/health, embed public,
> cookies, latence) avec verdict vert/rouge et exit code 0/1 — utilisable
> en pre-commit hook ou en CI une fois `cal.waimia.com` actif.

Smoke test manuel détaillé :

```bash
# 1. Page de connexion
curl -I https://cal.waimia.com/auth/login         # → 200

# 2. API health (Cal.com expose /api/health)
curl https://cal.waimia.com/api/health            # → {"status":"ok"}

# 3. Embed iframe (utilisé par apps/web/contact.astro)
curl -I https://cal.waimia.com/simonberos/audit   # → 200

# 4. Cookies NextAuth set sur le bon domaine
curl -I -c /tmp/cookies.txt https://cal.waimia.com/auth/login \
  && grep -c "Domain=.cal.waimia.com" /tmp/cookies.txt    # ≥ 1
```

Validation manuelle :

- [ ] Login admin (compte créé via `yarn db-seed`)
- [ ] Création d'un Event Type (ex: `audit`, 45 min)
- [ ] Récupération du slug public `cal.waimia.com/simonberos/audit`
- [ ] Mettre à jour `apps/web/src/components/ui/molecules/CalEmbed.astro`
      defaults : `username = 'simonberos'`, `eventType = 'audit'` (déjà
      fait Phase 2, vérifier cohérence)
- [ ] Test embed depuis `https://waimia-v2.vercel.app/contact` → l'iframe
      pointe sur `cal.waimia.com` et les créneaux s'affichent.

---

## 9 · Migration trafic depuis `cal.com/simonberos`

Tant que `cal.waimia.com` n'est pas validé, l'embed sur `apps/web` pointe
sur `cal.com/simonberos/audit` (cf [`apps/web/src/components/ui/molecules/CalEmbed.astro`](../apps/web/src/components/ui/molecules/CalEmbed.astro)).

Une fois validation Étape 8 passée, **basculer** le composant pour pointer
sur le self-host :

```diff
- origin: 'https://app.cal.com'
+ origin: 'https://cal.waimia.com'
- src='https://app.cal.com/embed/embed.js'
+ src='https://cal.waimia.com/embed/embed.js'
```

Commit + push → Vercel redéploie `waimia-v2` → embed self-hosté actif.

> **Avantage** : aucune dépendance à `app.cal.com` SaaS, Cal.com upstream
> peut tomber sans casser `waimia.com/contact`. Maîtrise totale du
> calendrier, des templates emails, des branding overrides.

---

## 10 · Sync upstream Cal.com (rappel)

`apps/cal` est synchronisé via git subtree merge depuis `github.com/calcom/cal.com`.
Cf [`cal-setup.md`](cal-setup.md) section "Sync upstream Cal.com" pour le
workflow complet (`git merge -s subtree -X subtree=apps/cal cal-upstream/main --squash`).

**Cadence recommandée** : 4-6 semaines, ou immédiatement si advisory
sécurité Cal.com.

---

## 11 · Troubleshooting

### Build échoue avec `Module not found: @calcom/lib/...`

Cal.com utilise un monorepo Turborepo interne. Vérifier que `Build Command`
est bien `yarn build` (qui lance `turbo run build --filter=@calcom/web...`)
et **pas** `npm run build` ni `next build` directement.

### Cookies NextAuth set sur `.vercel.app` au lieu de `.waimia.com`

`NEXTAUTH_URL` n'a pas été mis à jour après ajout du domaine custom (cf
étape 7.4). Editer + redeploy.

### Erreur Prisma `column "X" does not exist` au runtime

DB pas encore migrée vers la version actuelle du schema. Relancer étape 6.

### Login renvoie 500 + log `JWT_SESSION_ERROR`

`NEXTAUTH_SECRET` mal copié (espace en trop, line ending CRLF). Vérifier
length = 64 chars hex. Si toujours OK, regénérer + redeploy.

### Iframe embed bloqué par CSP côté `waimia.com`

Vérifier `ALLOWED_HOSTNAMES` côté `waimia-cal` env vars + CSP côté
`waimia-v2` (`apps/web/src/layouts/Base.astro` `Content-Security-Policy`).

### Build « npx astro build » au lieu de `yarn build`

Vercel applique la config du `vercel.json` le plus haut dans l'arbre. Cf
[§13.2](#132--vercel-jsontemplate-doit-être-promu-en-vercel-json).

### `Failed to connect to upstream database` au build Prisma

Sous-task `@calcom/prisma:build` ne reçoit pas `DIRECT_URL`. Cf
[§13.1](#131--direct_url-manquant-dans-app-cal-turbo-json).

### Login admin échoue avec mot de passe seedé

Cal.com 6.x déplace les passwords dans `UserPassword`. Cf
[§13.7](#137--reset-password-admin-via-prisma-direct).

### Google Calendar absent du store Apps

Variable `GOOGLE_API_CREDENTIALS` manquante ou JSON malformé. Cf
[§13.9](#139--google-calendar-oauth-setup).

### `yarn db-seed` plante avec `P1001 Can't reach database server at base`

Le seed Cal.com n'auto-charge pas `.env`. `DATABASE_URL` doit être
exportée shell-side. Cf [§13.12](#1312--le-seed-calcom-ne-charge-pas-dotenv-p1001-hostbase).

### `/event-types/<id>` ou `/settings/*` affiche "Something went wrong"

Probablement `User.defaultScheduleId` null après cleanup. Cf
[§13.13](#1313--cleanup-laisse-les-users-actifs-sans-defaultscheduleid).

### Google Calendar absent de la Boutique d'applications

`GOOGLE_API_CREDENTIALS` non exportée au seed → step Google
silencieusement skippé. Cf
[§13.14](#1314--google-calendar-absent-du-store-si-google_api_credentials-pas-exportée-au-seed).

### Booking créé mais aucun email reçu (booker + host)

`SEND_BOOKING_CONFIRMATION_EMAIL_FAILED` → vars EMAIL_* mal configurées
ou Sensitive corrompues. Cf
[§13.15](#1315--vars-email_-sensitive-empêchent-diag--risque-corruption-silencieuse).

---

## 12 · Coût estimé

| Composant                        | Coût mensuel                   |
| -------------------------------- | ------------------------------ |
| Vercel projet `waimia-cal` (Hobby plan jusqu'à 100 GB-h) | $0 si trafic faible (< 1k bookings/mois) |
| Vercel Pro (si besoin Team)      | $20/seat/mois                  |
| Neon Postgres (Free tier 0.5 GB) | $0 si DB < 0.5 GB              |
| Resend SMTP (10k emails/mois)    | $0 (réutilise abo waimia-v2)   |
| Domaine `waimia.com`             | déjà payé                      |
| **Total**                        | **$0** (tier gratuit suffisant en démarrage) |

---

## 13 · Pièges live-debug — Phase 5 lessons (2026-04-28)

> Capture du déploiement réel `cal.waimia.com`. À lire avant tout
> nouveau deploy ou avant la sync upstream Cal.com majeure : ce sont
> les pièges qu'on a rencontrés concrètement, dans l'ordre où ils sont
> apparus. Chaque sous-section référence le commit qui contient le fix.

### 13.1 · `DIRECT_URL` manquant dans `apps/cal/turbo.json`

**Symptôme** : à `yarn build`, le sous-task `@calcom/prisma:build` plante
avec `Failed to connect to upstream database`. Logs Vercel montrent que
Prisma tente de joindre un host vide ou `localhost:5432`.

**Cause** : le schema Cal.com utilise `DATABASE_DIRECT_URL` mais certains
build scripts internes utilisent encore `DIRECT_URL` (legacy). Turborepo
filtre les env vars passées aux sous-tasks via `globalEnv` — et `DIRECT_URL`
n'y était pas listée.

**Fix** :

```diff
 // apps/cal/turbo.json
 "globalEnv": [
   "DATABASE_URL",
   "DATABASE_DIRECT_URL",
+  "DIRECT_URL",
   ...
 ]
```

Cf commit `c1bd899` — ajout d'une seule ligne, débloque tout le build.

### 13.2 · `vercel.json.template` doit être promu en `vercel.json`

**Symptôme** : Vercel exécute `npx astro build` au lieu de `yarn build`
sur les déploiements `apps/cal`. Le projet est branché sur le bon root
mais le framework détecté est faux.

**Cause** : sans `apps/cal/vercel.json`, Vercel remonte l'arborescence et
trouve `apps/web/vercel.json` (Astro). Il applique cette config au
projet cal alors qu'on est dans un autre root.

**Fix** : promouvoir le template fourni en config active :

```bash
cp apps/cal/vercel.json.template apps/cal/vercel.json
git add apps/cal/vercel.json && git commit -m "feat(cal): promote vercel.json"
```

Cf commit `4b88553`.

### 13.3 · Hobby plan limite 1 cron par jour max

**Symptôme** : "This cron expression would run more than once per day".

**Fix** : sur Hobby, ne garder que 4 crons quotidiens :

```json
"crons": [
  { "path": "/api/cron/bookingReminder",                "schedule": "0 8 * * *" },
  { "path": "/api/cron/calendar-subscriptions-cleanup", "schedule": "0 0 * * *" },
  { "path": "/api/cron/changeTimeZone",                 "schedule": "0 1 * * *" },
  { "path": "/api/cron/syncAppMeta",                    "schedule": "0 4 * * *" }
]
```

Cf commit `c6fe01c`. Pour les crons fréquents (workflows, reminders bookings
intra-day), passer en Pro plan ou les déclencher via webhook externe.

### 13.4 · `framework: "nextjs"` + `outputDirectory` explicites

**Symptôme** : "No Output Directory named 'public' found".

**Cause** : Vercel détecte framework=Other (null) parce que `apps/cal` est
un monorepo turbo + le `package.json` racine n'a pas `next` directement.

**Fix** : forcer explicitement dans `apps/cal/vercel.json` :

```json
{
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

> **Attention** : `apps/web` ici réfère au sous-package interne de Cal.com
> (`apps/cal/apps/web`), **pas** à notre `apps/web` Astro racine. Cal.com
> a son propre monorepo imbriqué. Cf commit `248f01c`.

### 13.5 · Migrations Prisma locales — process.env > dotenv

**Symptôme** : `vercel env pull .env.production` ramène les vars Sensitive
**vides** (Vercel masque les Sensitive en CLI). Du coup `yarn prisma migrate deploy`
plante avec `DATABASE_URL resolved to empty string` ou `Authentication failed`.

**Cause** : le runtime Cal.com charge `dotenv-flow` qui lit dans l'ordre
`.env` → `.env.production` → `.env.local`. Si `.env.production` contient
`DATABASE_URL=` (vide), il **écrase** la valeur du `.env`.

**Fix** : exporter shell-side avant `prisma migrate` (process.env est
prioritaire sur dotenv-flow) :

```bash
cd apps/cal
DBURL='postgres://USER:PASS@HOST:5432/DB?sslmode=require'
export DATABASE_URL="$DBURL"
export DIRECT_URL="$DBURL"
yarn prisma migrate deploy
```

### 13.6 · Markdown auto-linkification du clipboard IDE

**Symptôme** : copier la `DATABASE_URL` du dashboard Prisma dans
`apps/cal/.env` via Claude IDE introduit du markdown :
`[host](mailto:host)` ou `[db.prisma.io](http://db.prisma.io)`. Prisma
plante avec `Invalid URL`.

**Cause** : Claude IDE auto-linkifie certains patterns (`user@host`,
`*.io`, `*.com`) en markdown au copy-paste.

**Fix shell** : reconstruire l'URL via regex, en parsant les composants
isolés côté terminal externe :

```bash
DB_HOST=$(printf '%s' "$RAW_HOST" | grep -oE 'db\.prisma\.io' | head -1)
DBURL="postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/postgres?sslmode=require"
```

Ou éditer `.env` dans un terminal externe (Ghostty, Terminal.app) hors
contexte IDE.

### 13.7 · Reset password admin via Prisma direct

**Symptôme** : login admin échoue avec le password seedé
`ADMINadmin2022!`. Le mail "forgot password" n'arrive pas (SMTP pas
finalisé en première passe).

**Cause** : Cal.com 6.x ne stocke plus le password dans `User.password`
(string), mais dans une **table `UserPassword` en relation 1-1**. Les
seeds historiques peuvent avoir alimenté la mauvaise table.

**Fix** : utiliser `password: { upsert: ... }` via Prisma, en lançant via
`yarn dlx tsx` pour résoudre les workspace TypeScript paths :

```typescript
// apps/cal/.local-scripts/reset-password.ts (gitignored)
import bcrypt from 'bcryptjs';
import prisma from '@calcom/prisma';

async function main() {
  const target = 'admin@example.com';
  const newPwd = 'WaimiaCal_' + Math.random().toString(36).slice(2, 12) + '!';
  const hash = await bcrypt.hash(newPwd, 12);

  await prisma.user.update({
    where: { email: target },
    data: {
      password: { upsert: { create: { hash }, update: { hash } } }
    }
  });

  console.log('LOGIN:', target, newPwd);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
```

Run :

```bash
cd apps/cal
export DATABASE_URL='...'  # même URL que migrate, cf §13.5
yarn dlx tsx .local-scripts/reset-password.ts
```

> **Pourquoi `yarn dlx tsx` et pas `node` ?** Cal.com génère le client
> Prisma à un chemin custom (`packages/prisma/generated/prisma/`) — `node`
> ne résout pas les workspace paths TypeScript. `tsx` lance le runtime
> avec le `tsconfig.json` chargé, donc `import prisma from '@calcom/prisma'`
> marche.

### 13.8 · Cleanup test users post-`yarn db-seed`

**Risque** : `yarn db-seed` crée ~39 utilisateurs `*@example.com` avec
des mots de passe identiques (`username == password`) — exploitable en
clair sur prod.

**Cleanup** : script Prisma local :

```typescript
// apps/cal/.local-scripts/cleanup-seed.ts (gitignored)
import prisma from '@calcom/prisma';

async function main() {
  const users = await prisma.user.findMany({
    where: {
      email: { endsWith: '@example.com' },
      NOT: [
        { email: 'admin@example.com' },         // garder admin
        { email: 'contact@virtuoseweb.fr' },    // ton compte réel
      ],
    },
    select: { id: true, email: true },
  });

  console.log('Suppression de', users.length, 'utilisateurs test');

  for (const u of users) {
    await prisma.eventType.deleteMany({ where: { userId: u.id } });
    await prisma.membership.deleteMany({ where: { userId: u.id } });
    await prisma.user.delete({ where: { id: u.id } });
  }
}
main().finally(() => prisma.$disconnect());
```

Sur le seed Cal.com de référence : ~39 users + ~146 event types + ~146
memberships supprimés.

### 13.9 · Google Calendar OAuth setup

Pour activer l'intégration Google Calendar (Cal.com l'expose comme app
dans le store) :

1. **Google Cloud Console** → Créer un OAuth Client ID
   - Type : Web application
   - Name : `Cal Waimia Production`
   - Authorized redirect URIs :
     - `https://cal.waimia.com/api/integrations/googlecalendar/callback`
     - `https://cal.waimia.com/api/auth/callback/google` (si "Login with Google" activé)

2. **Vercel env vars** → ajouter en Production :

   ```
   GOOGLE_API_CREDENTIALS={"web":{"client_id":"...","client_secret":"GOCSPX-...","redirect_uris":["..."]}}
   ```

   La valeur est le **JSON brut** du client OAuth (pas le path du fichier).

3. **Re-run db-seed** (registre l'app `google-calendar` dans la table `App`) :

   ```bash
   cd apps/cal
   export DATABASE_URL='...'
   yarn db-seed
   ```

4. **UI Cal** → Settings → Apps → Calendar → "Google Calendar" doit
   apparaître comme option Connect.

> **Sécurité** : si tu as plusieurs OAuth clients (ancien dev + nouveau
> prod), **désactiver l'ancien** dans Google Cloud Console → Credentials
> une fois la prod validée. Ne jamais commit `client_secret` en clair.

### 13.10 · `corepack` manquant sur Homebrew Node 25

**Symptôme** : `corepack: command not found` quand on tente
`corepack enable` pour activer yarn 4 berry.

**Fix** :

```bash
brew install corepack
brew link --overwrite corepack
# corepack écrase le shim pnpm de Homebrew, mais corepack inclut son
# propre pnpm — pas de régression.
corepack enable
yarn --version  # → 4.12 attendu (lockfile apps/cal/yarn.lock)
```

### 13.11 · Embed bumped après validation `cal.waimia.com`

Une fois §§13.1-13.9 verts en prod, basculer le composant embed côté
`apps/web` :

```diff
- // Note · Cal.com SaaS recommandé pour démarrer (slug `simonberos/audit`)
+ // Note · Cal.com self-host actif sur cal.waimia.com (slug `simon/audit`)
- username = 'simonberos'
+ username = 'simon'
- src='https://app.cal.com/embed/embed.js'
+ src='https://cal.waimia.com/embed/embed.js'
- origin: 'https://app.cal.com'
+ origin: 'https://cal.waimia.com'
```

Cf commit `85df751` pour le diff complet sur
`apps/web/src/components/ui/molecules/CalEmbed.astro`.

### 13.12 · Le seed Cal.com ne charge pas dotenv (P1001 `host=base`)

**Symptôme** : après une session migration réussie, un re-seed plante :

```
PrismaClientKnownRequestError: Can't reach database server at base
code: 'P1001'
DriverAdapterError: DatabaseNotReachable
```

Le hostname `base` est trompeur — ce n'est PAS une URL malformée, le
`apps/cal/.env` contient bien `db.prisma.io:5432` (vérifiable avec
`grep '^DATABASE_URL=' apps/cal/.env | cut -d= -f2- | head -c 30`).

**Cause** : `apps/cal/scripts/seed.ts`, `seed-utils.ts` et le wrapper
`apps/cal/packages/prisma/index.ts` n'importent **aucun** `dotenv`. Le
fichier `index.ts` fait :

```ts
const connectionString = process.env.DATABASE_URL || "";
const adapter = pool ? new PrismaPg(pool) : new PrismaPg({ connectionString });
```

Si `DATABASE_URL` n'est pas exportée dans la session shell qui lance
`yarn seed-basic` (zsh/bash), `process.env.DATABASE_URL` est undefined,
`connectionString` devient une chaîne vide, et `PrismaPg` parse cette
URL vide en repliant sur un host par défaut qui apparaît littéralement
comme `base` dans le message d'erreur.

**Quand ça arrive typiquement** : entre 2 sessions de travail. La
première a fait `export DATABASE_URL="$DBURL"` shell-side (cf §13.5)
pour les migrations. Le terminal a été fermé entre temps, ou un
nouveau tab zsh a été ouvert. Le `.env` du repo est intact, mais
l'export shell-side ne persiste pas, et le seed ne le recharge pas tout
seul.

**Fix — wrap chaque commande seed avec `set -a; source .env; set +a`** :

```bash
cd /Users/simonberos/waimia-site/site/apps/cal
set -a; source .env; set +a
yarn workspace @calcom/prisma seed-basic 2>&1 | tail -40
```

Le `set -a` active l'auto-export, `source .env` charge toutes les vars,
`set +a` désactive l'auto-export pour la suite (hygiène). Pattern POSIX
standard, fonctionne en zsh comme en bash.

**Sanity check 5s** avant le seed (ne touche pas la DB) :

```bash
cd apps/cal && set -a && source .env && set +a \
  && node -e "console.log('host:',new URL(process.env.DATABASE_URL).host)"
# Attendu : host: db.prisma.io:5432
```

Si ce check renvoie un autre host, il y a un autre piège (§13.5 ou
§13.6 probablement).

> **Note importante** : ne PAS modifier `apps/cal/scripts/seed.ts` pour
> y ajouter `import "dotenv/config"` — c'est du code upstream Cal.com
> synchronisé via subtree (cf [`cal-setup.md`](cal-setup.md)). Toute
> modif locale crée des conflits à chaque sync. Le wrap shell-side
> reste la bonne approche.

> **Pour CI / scripts répétables** : externaliser dans
> `apps/cal/.local-scripts/run-seed.sh` (gitignored, cf §13.7-§13.8) :
>
> ```bash
> #!/usr/bin/env bash
> set -euo pipefail
> cd "$(dirname "$0")/.."
> set -a; source .env; set +a
> yarn workspace @calcom/prisma seed-basic
> ```

**Validation empirique 2026-05-04** :

```
$ cd apps/cal && set -a && source .env && set +a && \
    node -e "console.log('host:',new URL(process.env.DATABASE_URL).host)"
host: db.prisma.io:5432  ✓

$ yarn workspace @calcom/prisma seed-basic 2>&1 | tail -1
👤 Added 'Enterprise Team-10' membership for 'enterprise-member-10' with role 'OWNER'
$ echo $?
0  ✓
```

Le seed termine sur les Enterprise Teams (dernier step du `seed.ts`),
puis exit 0. Apps store re-seedée (incluant `google-calendar` si
`GOOGLE_API_CREDENTIALS` est exportée — sinon le step Google est
skippé silencieusement par le `try/catch` ligne 109-125 de
`seed-app-store.ts`).

> **Effet de bord à anticiper** : tout `yarn db-seed` re-crée les ~39
> users `@example.com` + Enterprise members. Si tu avais déjà fait le
> cleanup §13.8, refais-le **après** chaque re-seed. Script local
> reproductible :
> `apps/cal/.local-scripts/cleanup-seed.ts` (cf §13.8 pour le contenu).

### 13.13 · Cleanup laisse les users actifs sans `defaultScheduleId`

**Symptôme** : après cleanup §13.8 + recovery du compte admin/perso,
les pages `/event-types/<id>?tabName=setup`, `/settings/my-account/profile`
et `/settings/my-account/calendars` affichent **"Something went wrong"**.
Logs Vercel runtime montrent :

```
Error [TRPCError]: Failed to ...
GET /api/trpc/eventTypes/getEventTypesFromUser  500
```

**Cause** : Cal.com 6.x requiert que `User.defaultScheduleId` pointe sur
un `Schedule` existant pour que l'API tRPC `eventTypes.getEventTypesFromUser`
calcule l'availability. Le seed crée **un seul** Schedule global utilisé en
M2M par les test users — quand le cleanup les supprime, le Schedule reste
mais n'est rattaché à aucun user. Les comptes réels (créés manuellement
via UI Cal ou conservés au cleanup) partent **sans `defaultScheduleId`** —
le frontend appelle tRPC, le backend Prisma ne trouve pas de schedule
résolu, throw.

**Diagnostic** : compter les schedules vs users avec defaultScheduleId :

```bash
yarn dlx tsx -e "import prisma from '@calcom/prisma';
(async () => {
  const u = await prisma.user.count();
  const usd = await prisma.user.count({ where: { defaultScheduleId: { not: null } } });
  const s = await prisma.schedule.count();
  console.log({users: u, usersWithDefault: usd, schedules: s});
  await prisma.\$disconnect();
})();"
# Cas problematique : users=4 schedules=1 usersWithDefault=0
# Cas attendu :     users=N schedules>=N usersWithDefault=N
```

**Fix idempotent** — script `apps/cal/.local-scripts/fix-user-defaults.ts`
(gitignored) qui pour chaque user sans `defaultScheduleId` crée un
Schedule "Working Hours" Lun-Ven 9h-18h Europe/Paris + set le default.

```bash
cd apps/cal && set -a && source .env && set +a \
  && yarn dlx tsx .local-scripts/fix-user-defaults.ts
```

Le script vit dans `.local-scripts/` parce qu'il dépend de la DB live et
n'a pas vocation à être committé. Pour le contenu canonique : cf
[snippet ci-dessous](#snippet-fix-user-defaultsts).

**Validation empirique 2026-05-04/05** : 4 users → 4 schedules après run,
les pages `/event-types/<id>?tabName=setup` se chargent normalement.

#### Snippet `fix-user-defaults.ts`

```typescript
import prisma from '@calcom/prisma';

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, defaultScheduleId: true, timeZone: true },
    orderBy: { id: 'asc' },
  });

  for (const u of users) {
    const hasSched = await prisma.schedule.findFirst({ where: { userId: u.id }, select: { id: true } });
    if (u.defaultScheduleId && hasSched) continue;

    let scheduleId: number;
    if (hasSched) {
      scheduleId = hasSched.id;
    } else {
      const s = await prisma.schedule.create({
        data: {
          userId: u.id,
          name: 'Working Hours',
          timeZone: u.timeZone ?? 'Europe/Paris',
          availability: {
            create: [1, 2, 3, 4, 5].map(day => ({
              days: [day],
              startTime: new Date('1970-01-01T09:00:00Z'),
              endTime: new Date('1970-01-01T18:00:00Z'),
              userId: u.id,
            })),
          },
        },
      });
      scheduleId = s.id;
    }

    await prisma.user.update({
      where: { id: u.id },
      data: { defaultScheduleId: scheduleId, timeZone: u.timeZone ?? 'Europe/Paris' },
    });
  }
}
main().finally(() => prisma.$disconnect());
```

### 13.14 · Google Calendar absent du store si `GOOGLE_API_CREDENTIALS` pas exportée au seed

**Symptôme** : page `Boutique d'applications / Calendar` sur cal.waimia.com
liste Apple/CalDav/Notion/Amie/Exchange/ICS/Vimcal — **mais pas Google
Calendar**. Conséquence cascade : pas de Google Meet dans le picker
"Conferencing" des event types.

**Cause** : `apps/cal/scripts/seed-app-store.ts:109-125` :

```ts
try {
  const { client_secret, client_id, redirect_uris } =
    JSON.parse(process.env.GOOGLE_API_CREDENTIALS || "").web;
  await createApp("google-calendar", "googlecalendar", ["calendar"], "google_calendar", { ... });
  await createApp("google-meet", "googlevideo", ["conferencing"], "google_video", { ... });
} catch (e) {
  if (e instanceof Error)
    console.error("Error adding google credentials to DB:", e.message);
}
```

Si `process.env.GOOGLE_API_CREDENTIALS` n'est pas exportée au moment du
`yarn db-seed`, `JSON.parse("")` throw `Unexpected end of JSON input`,
le `catch` **swallow l'erreur** (juste un `console.error` non bloquant).
Le seed termine en succès apparent, mais les apps `google-calendar` et
`google-meet` ne sont **pas créées** dans la table `App`.

**2 fixes possibles** :

**Option A — Re-seed complet** avec env exportée (si tu acceptes l'effet
de bord §13 warning, c-à-d re-créer les ~39 test users) :

```bash
cd apps/cal && set -a && source .env && set +a \
  && export GOOGLE_API_CREDENTIALS="$(cat ~/Downloads/client_secret_*.json)" \
  && yarn workspace @calcom/prisma seed-basic
# Puis re-cleanup §13.8
```

**Option B — Script chirurgical** (préféré, idempotent, ne touche pas
les users) — `apps/cal/.local-scripts/seed-google-app.ts` (gitignored) :

```typescript
import prisma from '@calcom/prisma';

async function main() {
  const raw = process.env.GOOGLE_API_CREDENTIALS;
  if (!raw) { console.error('GOOGLE_API_CREDENTIALS env var manquante'); process.exit(1); }
  const { web } = JSON.parse(raw);
  const keys = {
    client_id: web.client_id,
    client_secret: web.client_secret,
    redirect_uris: web.redirect_uris || [],
  };

  const upsert = async (slug: string, dirName: string, category: string) => {
    const found = await prisma.app.findFirst({ where: { OR: [{ slug }, { dirName }] } });
    const data = { slug, dirName, categories: [category], keys: keys as any, enabled: true };
    if (found) await prisma.app.update({ where: { slug: found.slug }, data });
    else await prisma.app.create({ data });
  };

  await upsert('google-calendar', 'googlecalendar', 'calendar');
  await upsert('google-meet', 'googlevideo', 'conferencing');
}
main().finally(() => prisma.$disconnect());
```

Run :

```bash
cd apps/cal && set -a && source .env && set +a \
  && export GOOGLE_API_CREDENTIALS="$(cat ~/Downloads/client_secret_*.json)" \
  && yarn dlx tsx .local-scripts/seed-google-app.ts
```

**Pour éviter ce piège au prochain re-seed** : ajouter
`GOOGLE_API_CREDENTIALS` au `apps/cal/.env` local sur **une seule ligne
JSON** (pas multi-ligne, sinon `source .env` casse) :

```bash
printf 'GOOGLE_API_CREDENTIALS=%s\n' \
  "$(cat ~/Downloads/client_secret_*.json | tr -d '\n')" \
  >> apps/cal/.env
```

> **Note importante** : Google Calendar dans le store ≠ Google Calendar
> connecté pour ton user. Il faut ensuite aller dans
> `cal.waimia.com/apps/categories/calendar` → Connect → flow OAuth pour
> que **ton compte Google soit lié** (création d'un row `Credential`).
> Tant que ce flow n'est pas complété, Google Meet n'apparaît PAS dans
> le picker "Conferencing" des event types — c'est normal et conditionné
> au Credential, pas à la présence dans App.

### 13.15 · Vars `EMAIL_*` Sensitive empêchent diag + risque corruption silencieuse

**Symptôme** : booking POST réussit (200, event créé en DB, Google
Calendar invité OK) mais le booker **et le host** ne reçoivent **aucun
email**. Logs Vercel runtime à l'instant T du booking :

```
20:07:15 POST /api/book/event 200 error  SEND_BOOKING_CONFIRMATION_E...
```

(message tronqué Vercel CLI, c'est `SEND_BOOKING_CONFIRMATION_EMAIL_FAILED`.)

**Cause profonde** : au bulk-import des env vars Cal sur Vercel (§4 du
runbook), le tag **"Sensitive"** a été coché par défaut sur les 6 vars
`EMAIL_*`. Conséquence :

- `vercel env pull` ramène les valeurs **vides** côté CLI
  (cf §13.5, même piège que `DATABASE_URL` au début)
- Le runtime Vercel reçoit la vraie valeur — sauf si **la valeur enregistrée
  elle-même est cassée** (markdown linkification §13.6 au copy-paste, ou
  Resend API key périmée, ou format `EMAIL_FROM` rejeté pour spoofing)
- Le diag CLI est **aveugle** : impossible de savoir si la valeur réelle
  est correcte sans manipulation UI
- Et Cal.com Sentry-style logging tronque le message d'erreur — le
  symptôme reste opaque

**Diagnostic en 4 étapes** :

```bash
# 1. Pull web project (waimia-v2) qui marche pour Phase 2 emails
cd apps/web && vercel env pull /tmp/web.env --environment=production --yes
RESEND_KEY=$(grep '^RESEND_API_KEY=' /tmp/web.env | sed 's/^RESEND_API_KEY=//; s/^"//; s/"$//')

# 2. Si RESEND_KEY len=36 prefix='re_' : Standard (visible). Si vide : Sensitive.
echo "len=${#RESEND_KEY} prefix='${RESEND_KEY:0:3}'"

# 3. Test API Resend (no email sent, juste check key validity)
curl -s -H "Authorization: Bearer $RESEND_KEY" https://api.resend.com/api-keys \
  | python3 -m json.tool | head -5

# 4. Liste domaines verifies (pour valider EMAIL_FROM)
curl -s -H "Authorization: Bearer $RESEND_KEY" https://api.resend.com/domains \
  | python3 -m json.tool | grep -E '"name"|"status"'

rm /tmp/web.env
```

**Fix complet** — re-pousser les 6 vars `EMAIL_*` du projet cal en
**non-Sensitive** (sauf le password, qui peut rester Sensitive si tu
veux) avec valeurs canoniques :

```bash
set -e
SCRATCH=$(mktemp -d)
trap "rm -rf $SCRATCH" EXIT

cd apps/web
vercel env pull "$SCRATCH/web.env" --environment=production --yes
RESEND_KEY=$(grep '^RESEND_API_KEY=' "$SCRATCH/web.env" | sed 's/^RESEND_API_KEY=//; s/^"//; s/"$//')
[ "${RESEND_KEY:0:3}" != "re_" ] && { echo "ERROR: RESEND_KEY not extracted"; exit 1; }

cd ../cal
for v in EMAIL_FROM EMAIL_FROM_NAME EMAIL_SERVER_HOST EMAIL_SERVER_PORT EMAIL_SERVER_USER EMAIL_SERVER_PASSWORD; do
  vercel env rm "$v" production --yes
done

printf 'Waimia <waimia@virtuoseweb.fr>'  | vercel env add EMAIL_FROM            production
printf 'Waimia'                          | vercel env add EMAIL_FROM_NAME       production
printf 'smtp.resend.com'                 | vercel env add EMAIL_SERVER_HOST     production
printf '465'                             | vercel env add EMAIL_SERVER_PORT     production
printf 'resend'                          | vercel env add EMAIL_SERVER_USER     production
printf '%s' "$RESEND_KEY"                | vercel env add EMAIL_SERVER_PASSWORD production

# Trigger redeploy production (env var changes ne re-deploient pas auto)
LATEST_URL=$(vercel ls --prod 2>&1 | grep '\.vercel\.app' | head -1 | awk '{print $1}')
vercel redeploy "$LATEST_URL" --target production
```

> **Recommandation** : marquer **EMAIL_SERVER_PASSWORD comme la seule
> Sensitive** (vraie API key) ; les 5 autres en Standard pour permettre
> le diag CLI futur. La protection Sensitive sert à éviter les leaks en
> logs CI ou screenshots — n'a pas grand intérêt pour des valeurs
> publiques (host SMTP, port, "resend" username, format FROM).

**Validation empirique 2026-05-05** :
- Resend API key validée via `/api-keys` endpoint ✓
- `virtuoseweb.fr` confirmé seul domaine vérifié Resend ✓
- 6 vars EMAIL_* repushées non-Sensitive sur waimia-v2-web ✓
- Redeploy `dpl_41oeijegvG7b6VcwgGnENLqs9bAc` BUILDING ✓
- Test E2E booking post-deploy : à confirmer dans la prochaine session

### 13.16 · Cal.com nodemailer SMTP hang sur Vercel Lambda — fix Resend HTTPS direct

**Symptôme** : tous les fixes §13.15 appliqués (env vars EMAIL_* non-Sensitive +
RESEND_API_KEY priorité 1 + redeploy), mais 5 bookings test successifs
montrent toujours :

```
POST /api/book/event 200 error  SEND_BOOKING_CONFIRMATION_E... (tronqué)
```

Aucun email Cal n'arrive (booker + host) malgré que le booking est créé
en DB et que Google Calendar invite est bien envoyé via API Google.

**Validation empirique parallèle** : `curl -X POST https://api.resend.com/emails`
avec le même `RESEND_API_KEY` et `from: "Waimia <waimia@virtuoseweb.fr>"` →
réponse `{"id":"..."}` → email **delivered Inbox** sur `simonberos47@gmail.com`
en < 30s. Donc :

| Composant | État |
|---|---|
| RESEND_API_KEY | ✅ valide |
| Domaine `virtuoseweb.fr` Resend | ✅ DKIM/SPF verified |
| Format `EMAIL_FROM` | ✅ accepté par Gmail (Inbox direct, pas spam) |
| Cal `nodemailer.sendMail` via `smtp.resend.com:465` | ❌ hang silencieux |

**Cause root** : nodemailer 7.0.12 hang sur le port 465 SMTP outbound depuis
Vercel Lambda Functions. Le réseau Lambda régional restreint/throttle
probablement le port SMTP (465). Symptômes matchent : pas de timeout
explicite, juste throw silencieux après quelques secondes, log `console.error`
tronqué à ~30 chars dans Vercel runtime API.

**Workaround `ENABLE_ASYNC_TASKER=false`** testé, **régression** : Cal
remonte alors l'erreur sync au client → **welcome page 500** post-booking.
Pire que silencieux. Rolled back.

**Fix définitif — patch local Resend HTTPS direct**

Approche : remplacer le transport nodemailer SMTP par un appel `fetch()` HTTPS
direct vers `https://api.resend.com/emails` quand `RESEND_API_KEY` est set.
0 dépendance ajoutée (fetch natif Node 18+). Patch additif minimaliste.

**Fichiers patchés** (branche `fix/cal-smtp-resend-sdk`, commit `006302f`) :

```
apps/cal/packages/emails/lib/sendViaResendHttps.ts   (NEW, 130 lignes)
apps/cal/packages/emails/templates/_base-email.ts    (+20 lignes branche conditionnelle)
```

`sendViaResendHttps.ts` :
- `shouldUseResendHttps()` : retourne `true` si `RESEND_API_KEY` set ET
  `RESEND_USE_HTTPS != "false"`
- `sendViaResendHttps(payload)` : POST vers `api.resend.com/emails` avec
  conversion payload nodemailer → format Resend API JSON

`_base-email.ts` ligne ~75, branche AVANT `createTransport(nodemailer)` :

```ts
if (shouldUseResendHttps()) {
  try {
    const result = await sendViaResendHttps(payloadWithUnEscapedSubject);
    if (result?.id) {
      console.log(`sendEmail (resend-https) ok id=${result.id} subject=...`);
    }
  } catch (e) {
    const err = getServerErrorFromUnknown(e);
    this.printNodeMailerError(err);
    console.error("sendEmail (resend-https)", `from: ...`, `subject: ...`, err);
  }
  return new Promise((resolve) => resolve("send mail async"));
}

// Fallback nodemailer legacy intact ci-dessous
const { createTransport } = await import("nodemailer");
...
```

**Activation** :
- AUTO en prod (RESEND_API_KEY déjà set)
- ROLLBACK runtime : `RESEND_USE_HTTPS=false` env Vercel → fallback nodemailer
  legacy sans redeploy

**Test local empirique 2026-05-06** :

```bash
cd apps/cal && set -a && source .env && set +a
yarn dlx tsx .local-scripts/test-smtp-fix.ts
# → Resend HTTPS response: { id: '38f4f6c4-5e4f-4aaf-b892-3e82cc9f19c7' }
# → SUCCESS — Resend email id: 38f4f6c4-5e4f-4aaf-b892-3e82cc9f19c7
```

**Sync upstream Cal.com** :

Patch local-only, pas commit upstream. Risque conflit `subtree pull`
uniquement sur `_base-email.ts` si upstream réécrit `sendEmail()`. Le
`sendViaResendHttps.ts` est un fichier nouveau sans conflit possible.

**Procédure resync** documentée dans `apps/cal/.local-scripts/SMTP-FIX.md`
(gitignored).

**Moyen terme** : ouvrir issue/PR upstream Cal.com proposant le support
HTTPS providers natif (Resend / Mailgun / SendGrid SDK) — drop le patch
local quand merged.

> **Pourquoi pas modifier `serverConfig.ts` directement** : le bug est dans
> nodemailer.sendMail (TLS/auth/timeout sur port 465 Lambda), pas dans la
> config transport. Modifier `serverConfig.ts` (ex: ajouter `tls: { rejectUnauthorized: false }`)
> serait un pattern de tâtonnement aveugle vu la troncation Vercel logs.
> Le HTTPS direct est diagnostiqué + testé empiriquement.

---

## Annexes

- [`cal-setup.md`](cal-setup.md) — Setup initial Cal.diy + Prisma Postgres
- [`known-issues.md`](known-issues.md) — Bugs trackés (peut-être mises à jour Cal.com bloquantes)
- [`architecture.md`](architecture.md) — Structure monorepo + isolation pnpm/yarn
- [`deploy.md`](deploy.md) — Stratégie Vercel générique
