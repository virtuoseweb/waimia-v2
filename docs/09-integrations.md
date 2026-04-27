# 09 · Intégrations · Resend, Cal.com, OpenAI, Anthropic

## Variables d'environnement

À configurer dans **Vercel Dashboard** (Project → Settings → Environment Variables) ou en local via un fichier `.env` à la racine de `waimia-site/site/`.

> **Note** : créer `.env` localement (ne pas commit, déjà dans `.gitignore`). Réutilisez les clés depuis `sitewebastro` pour démarrer rapidement.

### Variables requises (production)

| Variable                 | Source                                                                    | Usage                                            |
| ------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------ |
| `RESEND_API_KEY`         | sitewebastro `.env` ou [resend.com/api-keys](https://resend.com/api-keys) | Emails transactionnels + Automations + AI Editor |
| `EMAIL_FROM`             | `bonjour@waimia.fr` (vérifié Resend)                                      | From address des emails sortants                 |
| `EMAIL_INTERNAL_TO`      | `alerts@waimia.fr`                                                        | Email équipe Waimia (alertes leads chauds)       |
| `RESEND_TRACKING_DOMAIN` | `track.waimia.com` (CNAME configuré Resend)                               | Custom tracking domain (open/click)              |
| `OPENAI_API_KEY`         | sitewebastro `.env`                                                       | AI Email Editor + agent éditeur contenu GEO      |
| `ANTHROPIC_API_KEY`      | nouvelle clé                                                              | Claude API pour agents Waimia (futur)            |
| `PUBLIC_CAL_USERNAME`    | `waimia`                                                                  | Slug Cal.com (URL : cal.com/waimia/...)          |
| `PUBLIC_CAL_EVENT_TYPE`  | `45min`                                                                   | Event type slug Cal.com                          |
| `PUBLIC_SITE_URL`        | `https://waimia.com`                                                      | URL absolue pour OG/canonical                    |

### Variables optionnelles (futur)

| Variable                                              | Usage                        |
| ----------------------------------------------------- | ---------------------------- |
| `SENTRY_AUTH_TOKEN`                                   | Monitoring erreurs prod      |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Rate limiting API routes     |
| `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY`        | Si pricing payant via Stripe |

> **Note** : Inngest **n'est pas utilisé** chez Waimia. Toutes les séquences lifecycle sont orchestrées via **Resend Automations** natif (lancé Day 1 de Resend Launch Week #6, octobre 2025). Plus simple, intégré, moins de dépendances.

---

## Resend · stratégie complète (exploite tout le launch week #6)

### 1. Emails transactionnels (Resend SDK)

Lib singleton dans `src/lib/resend.ts`. API routes Astro envoient des emails via `resend.emails.send()`.

```ts
import { resend } from "~/lib/resend";

await resend.emails.send({
  from: "Waimia <bonjour@waimia.fr>",
  to: "simon@example.com",
  subject: "Confirmation contact",
  react: ContactConfirmation({ name: "Simon" }),
});
```

### 2. React Email 6.0 (templates emails)

Templates dans `src/lib/emails/*.tsx`. Composants `@react-email/components` (Body, Container, Heading, Section, Text, Button, Img, Link, Hr, Tailwind).

Templates Waimia créés :

- `WelcomeNewsletter.tsx` · welcome séquence newsletter
- `LeadMagnetDelivery.tsx` · délivrance PDF + lien tracking
- `ContactConfirmation.tsx` · confirmation form contact
- `DevisRecap.tsx` · récap devis configurateur (porté de sitewebastro)
- `AcademyResults.tsx` · scorecard diagnostic 12 questions
- `InternalLeadAlert.tsx` · alerte équipe Waimia (Slack-ready)

### 3. Resend Automations (lifecycle séquences)

Orchestration **dans le dashboard Resend** (pas de code Astro). Triggers émis via `resend.contacts.create()` ou `resend.events.create()`.

**Séquences configurées** :

#### Séquence A · `lead_magnet_downloaded`

- **Trigger** : `event.type === 'lead_magnet_downloaded'` émis par `/api/lead-magnet`
- **Step 1** · J+0 : email PDF + lien tracking
- **Step 2** · J+1 : RevOps insight (article court)
- **Step 3** · J+7 : case study Plateau (preuve)
- **Step 4** · J+14 : CTA RDV 45 min

#### Séquence B · `academy_completed`

- **Trigger** : `event.type === 'academy_completed'` émis par `/api/academy`
- **Step 1** · J+0 : scorecard détaillé + 3 prochaines actions priorisées
- **Step 2** · Si score < 12/24 → tag `hot_lead` → email équipe Waimia (alerte)
- **Step 3** · J+3 : si pas booké RDV → relance avec lien Cal.com

#### Séquence C · `contact_submitted`

- **Trigger** : `event.type === 'contact_submitted'` émis par `/api/contact`
- **Step 1** · J+0 : confirmation client
- **Step 2** · J+0 : alerte équipe Waimia (parallèle)
- **Step 3** · J+2 : si pas répondu équipe → escalade

### 4. Custom Tracking Domain (Day 4 launch)

Configuré dans Resend dashboard : `track.waimia.com` avec CNAME pointing vers `track.resend.com`.

**Bénéfices** :

- Reputation isolation (pas de partage avec autres clients Resend)
- Alignement avec domaine sending (DKIM/SPF/DMARC cohérents)
- Liens avec domaine familier dans emails

### 5. Resend MCP server (Day 2 + Day 3 launch)

Permet à **Claude Code** ou **agent IA Waimia interne** d'envoyer/templater des emails via MCP.

Configuration MCP (`~/.claude/.mcp.json`) :

```json
{
  "mcpServers": {
    "resend": {
      "command": "npx",
      "args": ["-y", "@resend/mcp-server"],
      "env": { "RESEND_API_KEY": "re_••••••" }
    }
  }
}
```

Use cases internes :

- Claude Code génère un draft email à partir d'une URL (« Reformule le hero de /offres/conseil en email lead-magnet »)
- Agent Waimia envoie automatiquement les confirmations devis

### 6. Resend CLI 2.0 (Day 3 launch)

Pour les opérations équipe Waimia :

```bash
# Envoyer un email depuis un fichier React local
npx resend emails send src/lib/emails/CampaignAnnouncement.tsx \
  --to alerts@waimia.fr \
  --subject "Test campaign Q3 2026"

# Lister les automations
npx resend automations list

# Vérifier les domaines
npx resend domains list
```

### 7. AI Email Editor (Day 2 launch)

Disponible directement dans Resend dashboard. Permet à l'équipe Waimia de :

- Convertir une URL en draft email on-brand (ex : `/offres/conseil` → email teaser)
- Brancher la stack agentique via Resend MCP server
- Catcher les fautes avant envoi

---

## Cal.com / Cal.diy · stratégie

### Cal.com SaaS (recommandé pour démarrer)

Slug actuel : `waimia/45min` (déjà actif).

**Embed widget** dans `src/components/ui/molecules/CalEmbed.astro` :

- Layout `inline` · embed full-width sur `/contact`
- Layout `floating-popup` · sur les CTAs « Réserver » des hubs
- Layout `element-click` · sur les liens textuels « Prendre RDV »

### Cal.diy (option self-hosted)

Lancé en octobre 2025 (changelog Cal.com #46, MIT license). Disponible si Waimia veut migrer vers self-hosting (souveraineté + custom theming). Pour l'instant on reste sur Cal.com SaaS.

---

## OpenAI · usage

### AI Email Editor backend

Resend AI Editor utilise OpenAI sous le capot. La clé `OPENAI_API_KEY` est requise pour activer cette feature côté Resend (configurée dans Resend dashboard → Workspace Settings → AI).

### Agent éditeur de contenu GEO (futur)

Pour l'offre `/offres/site-web-ia`, un agent éditeur de contenu auto-générera des paragraphes optimisés GEO (Generative Engine Optimization) pour les pages clients. Backend : OpenAI GPT-4o ou Claude Sonnet 4.6 selon coût/qualité.

---

## Anthropic · usage

### Claude API direct

Pour les agents Waimia internes (analyse, audit auto, génération de devis structuré). Clé `ANTHROPIC_API_KEY` séparée de la clé MCP utilisée par Claude Code dev.

### Future intégration VirtuoseOS

VirtuoseOS (notre kernel) utilise Claude Opus pour l'analyse, Sonnet pour la production, Haiku pour le triage. Cf `/technologies/virtuoseos`.

---

## Astro SSR config

Le projet est passé en `output: 'server'` (Astro 6) avec adapter Vercel pour permettre les API routes (`/api/*`).

```js
// astro.config.mjs
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  // ...
});
```

Les pages `content` (homepage, /offres/conseil, /ressources/cas/plateau, etc.) sont rendues SSR mais cachées au edge Vercel (équivalent SSG avec invalidation). Les API routes (`/api/*`) sont des Vercel Functions on-demand.

> **Anti-pattern à éviter** : ne PAS ajouter `export const prerender = true` à toutes les pages. Le cache edge Vercel suffit pour les pages content. Le SSR permet aussi des opt-in par page (ex : `/admin/*` user-specific futur).

---

## Liens utiles

- [Resend Dashboard](https://resend.com/dashboard) · automations, domains, tracking
- [Resend Docs](https://resend.com/docs) · API + automations + MCP
- [React Email Docs](https://react.email/docs) · composants + preview
- [Cal.com Embed Docs](https://cal.com/docs/embed) · widget JS
- [Astro Vercel Adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/) · SSR config
