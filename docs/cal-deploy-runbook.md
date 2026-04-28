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

Smoke test prod :

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

## Annexes

- [`cal-setup.md`](cal-setup.md) — Setup initial Cal.diy + Prisma Postgres
- [`known-issues.md`](known-issues.md) — Bugs trackés (peut-être mises à jour Cal.com bloquantes)
- [`architecture.md`](architecture.md) — Structure monorepo + isolation pnpm/yarn
- [`deploy.md`](deploy.md) — Stratégie Vercel générique
