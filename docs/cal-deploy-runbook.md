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

---

## Annexes

- [`cal-setup.md`](cal-setup.md) — Setup initial Cal.diy + Prisma Postgres
- [`known-issues.md`](known-issues.md) — Bugs trackés (peut-être mises à jour Cal.com bloquantes)
- [`architecture.md`](architecture.md) — Structure monorepo + isolation pnpm/yarn
- [`deploy.md`](deploy.md) — Stratégie Vercel générique
