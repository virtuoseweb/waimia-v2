# Cal.waimia.com · Env vars Vercel · Template copy-paste

> **Usage** : ouvrir Vercel UI projet `waimia-cal` → Settings → Environment
> Variables → coller ce bloc dans le formulaire **bulk import** (Ctrl+V).
> Vercel détecte le format `KEY=VALUE` et provisionne d'un coup.
>
> **Scope** : tout sur **Production**. Ne PAS cocher Preview/Development
> (les previews utiliseront les valeurs Production via fallback Vercel).
>
> **Avant de coller** : remplacer `<...>` par les vraies valeurs.

---

## Bloc 1 · Identité prod (URLs + secrets)

```env
NEXTAUTH_URL=https://cal.waimia.com
NEXT_PUBLIC_WEBAPP_URL=https://cal.waimia.com
NEXT_PUBLIC_WEBSITE_URL=https://cal.waimia.com
NEXT_PUBLIC_API_V2_URL=https://cal.waimia.com/api/v2
ALLOWED_HOSTNAMES="cal.waimia.com","waimia.com","waimia-v2.vercel.app"
NEXTAUTH_SECRET=<COLLER_SECRET_GENERE_AVANT>
CALENDSO_ENCRYPTION_KEY=<COLLER_SECRET_GENERE_AVANT>
CRON_API_KEY=<COLLER_SECRET_CRON_GENERE_AVANT>
NODE_ENV=production
```

> Les 3 secrets `NEXTAUTH_SECRET`, `CALENDSO_ENCRYPTION_KEY`, `CRON_API_KEY`
> ont été générés en session via `openssl rand -hex N` — récupérer les
> valeurs depuis ton secret manager (1Password) ou regénérer si perdues
> (mais alors les sessions existantes seront invalidées).

---

## Bloc 2 · Database Prisma Postgres

```env
DATABASE_URL=<COLLER_VALEUR_DEPUIS_apps/cal/.env_LOCAL>
DIRECT_URL=<COLLER_VALEUR_DIRECT_DEPUIS_apps/cal/.env_LOCAL>
```

### Récupération depuis local

Phase 2 a déjà connecté la DB Prisma Postgres dans `apps/cal/.env`.
Pour extraire les 2 valeurs sans les afficher en clair dans un terminal
partagé :

```bash
# Affiche en clair (terminal personnel uniquement)
grep -E '^(DATABASE_URL|DIRECT_URL)=' apps/cal/.env

# Ou copier directement dans le clipboard (macOS)
grep -E '^(DATABASE_URL|DIRECT_URL)=' apps/cal/.env | pbcopy
```

> Le pooler (port 6543 ou suffix `-pooler`) doit être dans `DATABASE_URL`
> (utilisé par les requêtes runtime Vercel serverless), tandis que
> `DIRECT_URL` pointe sur le port direct (5432) pour les migrations Prisma.

---

## Bloc 3 · Email transactionnel (Resend SMTP relay)

```env
EMAIL_FROM=cal@waimia.fr
EMAIL_FROM_NAME=Waimia · Cal
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=<COLLER_RESEND_API_KEY_DU_PROJET_WAIMIA-V2>
```

### Récupération RESEND_API_KEY

```bash
# Depuis le projet waimia-v2 deja deploye
cd apps/web
vercel env pull .env.production.web --environment=production
grep '^RESEND_API_KEY=' .env.production.web
```

> **Vérifier** que `cal@waimia.fr` est bien autorisé en sender chez Resend
> (DKIM/SPF déjà configurés sur `waimia.fr`). Sinon, fallback :
> `EMAIL_FROM=onboarding@resend.dev` (sandbox Resend, OK pour test).

---

## Bloc 4 · Branding (optionnel mais recommandé)

```env
NEXT_PUBLIC_APP_NAME=Waimia
NEXT_PUBLIC_COMPANY_NAME=Waimia (VirtuoseWeb)
NEXT_PUBLIC_SUPPORT_MAIL_ADDRESS=bonjour@waimia.fr
NEXT_PUBLIC_LICENSE_CONSENT=agree
NEXT_PUBLIC_DISABLE_SIGNUP=true
```

> `DISABLE_SIGNUP=true` pour éviter qu'un visiteur random crée un compte
> sur ton instance Cal — tu restes le seul user (toi + équipe Waimia).
> Pour ajouter des users plus tard : créer en admin puis inviter par email.

---

## Bloc 5 · Intégrations natives (à activer plus tard si besoin)

```env
# Google Calendar (OAuth)
# GOOGLE_API_CREDENTIALS=<JSON_OAUTH_CREDS>
# GOOGLE_LOGIN_ENABLED=true

# Microsoft Outlook (Azure AD)
# MS_GRAPH_CLIENT_ID=
# MS_GRAPH_CLIENT_SECRET=
# OFFICE365_CLIENT_ID=
# OFFICE365_CLIENT_SECRET=

# Zoom
# ZOOM_CLIENT_ID=
# ZOOM_CLIENT_SECRET=

# Stripe (paiements pour event types payants)
# STRIPE_PRIVATE_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...

# Sentry (monitoring runtime)
# SENTRY_DSN=
# SENTRY_AUTH_TOKEN=
# NEXT_PUBLIC_SENTRY_DSN=
```

> Décommenter ligne par ligne au moment d'activer chaque intégration. Les
> noms exacts viennent de [`apps/cal/.env.example`](../apps/cal/.env.example)
> upstream — vérifier si une variable a changé de nom suite à un sync
> upstream.

---

## Bloc 6 · Tuning runtime Vercel (optionnel)

```env
# Limites mémoire/timeout fonction (Pro plan)
# VERCEL_FUNCTION_MEMORY=1024
# VERCEL_FUNCTION_TIMEOUT=30

# Telemetry Cal.com (peut être désactivée pour confidentialité)
NEXT_TELEMETRY_DISABLED=1
CALCOM_TELEMETRY_DISABLED=1
```

---

## Récap minimum vital

Pour un premier deploy fonctionnel, tu as **besoin de** :

- Bloc 1 (identité + secrets) — sauf `CRON_API_KEY` si tu n'utilises pas les crons
- Bloc 2 (DB) — obligatoire
- Bloc 3 (email) — obligatoire pour les confirmations RDV

Soit **15 variables minimum**. Les blocs 4-6 sont des améliorations
progressives qu'on peut ajouter après validation du smoke test.

---

## Vérification post-import

Après collage dans Vercel UI puis save :

```bash
# Lister les env vars du projet
vercel env ls --environment=production --scope simonberos-projects

# Compter (doit retourner ≥ 15)
vercel env ls --environment=production --scope simonberos-projects | wc -l
```

Si une variable manque, Vercel UI le signale au prochain Deploy → Build Logs
montre `Error: <VAR_NAME> is not defined`.

---

## Liens

- [`cal-deploy-runbook.md`](cal-deploy-runbook.md) — Runbook Phase 5 complet (12 sections)
- [`cal-setup.md`](cal-setup.md) — Setup initial Cal.diy + sync upstream
- [`apps/cal/.env.example`](../apps/cal/.env.example) — Source upstream Cal.com (toutes les vars possibles)
