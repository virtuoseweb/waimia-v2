# 10 · Checklist déploiement production · actions manuelles externes

> Cette checklist liste les **actions manuelles** à effectuer en dehors du repo (Vercel Dashboard, Resend Dashboard, DNS) pour que l'infrastructure conversion (Phase A-F) soit pleinement opérationnelle en prod.
>
> Le code Waimia est livré et builds vert (`npm run build` OK avec `VERCEL=1`). Les actions ci-dessous activent les services externes.

## 1. Vercel · variables d'environnement

Dashboard : <https://vercel.com/virtuoseweb/waimia-v2/settings/environment-variables>

### Variables requises (Production · Preview · Development)

À **récupérer depuis sitewebastro** (`~/sitewebastro/.env`) ou créer si absent :

```bash
# Resend · domaine déjà vérifié sur virtuoseweb.fr (DKIM + SPF en place
# côté o2switch). On envoie via alias `waimia@virtuoseweb.fr` et on route
# les replies vers `contact@virtuoseweb.fr` (boîte Google Workspace surveillée).
RESEND_API_KEY=re_••••••
EMAIL_FROM="Waimia <waimia@virtuoseweb.fr>"
EMAIL_REPLY_TO=contact@virtuoseweb.fr
EMAIL_INTERNAL_TO=contact@virtuoseweb.fr

# OpenAI · prêt à réutiliser depuis sitewebastro
OPENAI_API_KEY=sk-••••••

# Anthropic · nouvelle clé à créer sur https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-••••••
```

> **Note migration** : quand le domaine `waimia.com` sera ajouté + vérifié
> dans Resend (TXT DKIM + SPF + send.waimia.com MX), on passera `EMAIL_FROM`
> à `Waimia <bonjour@waimia.fr>`. En attendant, virtuoseweb.fr fonctionne
> immédiatement sans toucher au DNS.

### Variables publiques (PUBLIC\_ prefix · accessibles client)

```bash
PUBLIC_CAL_USERNAME=waimia
PUBLIC_CAL_EVENT_TYPE=45min
PUBLIC_SITE_URL=https://waimia.com
```

### Variables optionnelles (futur · Phase H+)

```bash
RESEND_AUDIENCE_ID=••••••           # ID audience Resend pour /api emitEvent
RESEND_TRACKING_DOMAIN=track.waimia.com
SENTRY_AUTH_TOKEN=sntrys_••••••
UPSTASH_REDIS_REST_URL=https://••••••.upstash.io
UPSTASH_REDIS_REST_TOKEN=••••••
```

### Procédure

```bash
# Option A · CLI Vercel (rapide)
vercel env add RESEND_API_KEY production
vercel env add EMAIL_FROM production
# ... répéter pour chaque variable

# Option B · Dashboard
# Settings → Environment Variables → Add → coller la valeur → Save

# Option C · Bulk import .env
vercel env pull .env.production.local  # récupère les actuels
# éditer .env.production.local
# pas de bulk push, faire un par un

# Test après ajout
vercel env ls production
```

---

## 2. Resend · configuration Dashboard

Dashboard : <https://resend.com/dashboard>

### 2.1 Vérifier domaine sender · `bonjour@waimia.fr`

1. **Domains** → Add Domain → `waimia.fr`
2. Configurer DNS chez votre registrar :
   - `TXT _resend.waimia.fr` → valeur fournie par Resend
   - `TXT @ waimia.fr` (DKIM) → valeur fournie
   - `MX feedback.waimia.fr` → `feedback-smtp.eu-west-1.amazonses.com` (priorité 10)
3. Attendre vérification (5-30 min)
4. Status doit être **Verified** ✅

### 2.2 Custom Tracking Domain · `track.waimia.com`

(Lancé Day 4 launch week #6 · gratuit pour tous les users Resend)

1. **Domains** → onglet **Tracking** → Add tracking domain
2. Configurer DNS : `CNAME track.waimia.com → track.resend.com`
3. Attendre vérification
4. Activer dans `Settings` du domaine sender

**Bénéfices** : reputation isolation + alignement domaine + liens familiers dans emails.

### 2.3 Audience · pour `emitEvent()`

1. **Audiences** → Create audience → nom : `waimia-leads`
2. Copier l'**audience ID** (UUID)
3. Ajouter dans Vercel env : `RESEND_AUDIENCE_ID=••••••`

### 2.4 Resend Automations · 3 séquences à configurer

(Lancé Day 1 launch week #6)

Dashboard **Automations** → Create automation pour chaque trigger :

#### Séquence A · `lead_magnet_downloaded`

- **Trigger** : Contact added with tag `event=lead_magnet_downloaded`
- **Step 1** · J+1 : Email "RevOps insight"
  - Sujet : « 1 insight RevOps qui complète votre lecture »
  - Contenu : article court (à rédiger dans Resend AI Editor)
- **Step 2** · J+7 : Email "Cas Plateau"
  - Sujet : « Comment Plateau a récupéré 2,4 M€ en 10 semaines »
  - Lien vers `/ressources/cas/plateau`
- **Step 3** · J+14 : Email "Invitation RDV"
  - Sujet : « Une question après le PDF ? 45 min suffisent »
  - CTA Cal.com booking

#### Séquence B · `academy_completed`

- **Trigger** : Contact added with tag `event=academy_completed`
- **Conditional** : si `score-category == discovery`
  - Email équipe Waimia (alerts@waimia.fr) avec brief lead chaud
  - Tag contact `hot_lead`
- **Step 1** · J+3 : si pas booké RDV → relance avec lien Cal.com

#### Séquence C · `contact_submitted`

- **Trigger** : Contact added with tag `event=contact_submitted`
- **Step 1** · J+0 : confirmation email (déjà envoyé par /api/contact)
- **Step 2** · J+2 : si pas répondu équipe → escalade interne

---

## 3. Cal.com · configuration

Dashboard : <https://cal.com/app/event-types>

### 3.1 Vérifier event type `45min`

URL embed : `https://cal.com/waimia/45min`

1. Username `waimia` doit être réservé
2. Event type `45-minute meeting` doit exister
3. **Settings** → Customize : couleur `#C94F2E` (terracotta) en accent
4. **Notifications** → connecter Resend pour les emails de booking confirmation

### 3.2 Webhooks (futur)

Pour synchroniser bookings vers CRM ou autre :

- **Settings** → Webhooks → Add → URL : `https://waimia.com/api/cal-webhook`
- (API route à créer Phase H si besoin)

---

## 4. Validation post-deploy

### 4.1 Build Vercel

Push sur `main` déclenche auto-deploy. Vérifier :

```bash
# Status latest deployment
vercel ls --prod

# Logs build live
vercel logs https://waimia-v2.vercel.app
```

### 4.2 Smoke tests post-deploy

```bash
# Test page live
curl -I https://waimia-v2.vercel.app/offres/site-web-ia
# Attendu : 200 OK

# Test API contact (sans envoi réel)
curl -X POST https://waimia-v2.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","brief":"smoke test"}'
# Attendu : { "ok": true, "redirect": "/bienvenue/contact" }

# Test Cal embed visuel
# Naviguer vers https://waimia-v2.vercel.app/contact
# Vérifier que l'iframe Cal.com charge en bas de page
```

### 4.3 Tests Playwright contre prod

```bash
PLAYWRIGHT_BASE_URL=https://waimia-v2.vercel.app npx playwright test
# Attendu : 31+6 fixme passent (les fixme passeront aussi en prod car build statique)
```

### 4.4 Email de bout en bout

1. Aller sur `https://waimia-v2.vercel.app/contact`
2. Remplir form avec votre email pro
3. Soumettre
4. Vérifier réception email confirmation (depuis bonjour@waimia.fr)
5. Vérifier réception email équipe (sur alerts@waimia.fr)
6. Resend Dashboard → Logs → confirmer 2 emails envoyés
7. Vérifier custom tracking domain dans les liens (`track.waimia.com/...`)

---

## 5. Reste · Phase H futur

- [ ] **Versions EN** des pages funnel + leadmagnet (déléguable Codex)
- [ ] **Sentry monitoring** : `npm install @sentry/astro` + config env
- [ ] **Upstash rate limiting** sur API routes (anti-spam)
- [ ] **Stripe checkout** si pricing public payant
- [ ] **Resend MCP server** : `~/.claude/.mcp.json` → permettre Claude Code d'envoyer emails depuis le terminal
- [ ] **Adapter @astrojs/node** en dev local pour fixer les 6 tests Playwright skipped
- [ ] **PDF génération** (livres blancs) : `@vercel/og` ou Puppeteer Vercel Function

---

## Liens de référence

- [Vercel Env Vars Docs](https://vercel.com/docs/projects/environment-variables)
- [Resend Domains Setup](https://resend.com/docs/dashboard/domains/introduction)
- [Resend Automations Docs](https://resend.com/docs/dashboard/automations/introduction)
- [Resend Custom Tracking Domain](https://resend.com/docs/knowledge-base/custom-tracking-domains)
- [Cal.com Embed Customize](https://cal.com/docs/embed/embed-types)
