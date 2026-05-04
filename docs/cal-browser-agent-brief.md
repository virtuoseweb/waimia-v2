# Brief consolidé · agent Claude browser extension · Phase 5 finalisation

> **Usage** : ce document est destiné à un agent Claude tournant dans
> l'extension browser Chrome de Simon. Chaque section "Mission" est
> **autonome** et peut être collée directement à l'agent — il a tout le
> contexte nécessaire dans la section, sans avoir besoin du reste du doc.
>
> **Source de vérité opérationnelle** : `docs/cal-deploy-runbook.md`
> (notamment §13 pour les pièges live-debug Phase 5).

---

## 0 · Contexte minimal (à coller en tête de chaque mission)

```
Tu es l'agent browser de Simon. Le déploiement Cal.com self-hosted est
live sur https://cal.waimia.com depuis 2026-04-28 (Phase 5 du monorepo
waimia-v2). 5 actions UI restent à finaliser. Les credentials sont dans
1Password sous "Cal.waimia.com admin" (Simon te les donnera ou tu les
demanderas si besoin).

Tu DOIS prendre un screenshot avant et après chaque action significative
(login, save, toggle 2FA…) et reporter en fin de mission un récap
structuré : ce qui a marché, ce qui a bloqué, hypothèses si blocage.

Si une action demande de saisir un secret (password, API key), demande
à Simon de te le dicter — n'écris JAMAIS un secret dans ta réponse en
clair.
```

---

## Pré-requis Simon (CLI, hors scope agent browser)

Ces étapes **ne peuvent pas** être faites par l'agent browser, Simon les
exécute en terminal :

### Step D · `yarn db-seed` (re-seed après ajout `GOOGLE_API_CREDENTIALS`)

```bash
cd /Users/simonberos/waimia-site/site/apps/cal
export DATABASE_URL='<URL Postgres prod, cf 1Password "Cal Prisma DB">'
yarn db-seed
```

Effet attendu : enregistrement de l'app `google-calendar` dans la table
`App` (Prisma). Sans ça, l'option Connect Google Calendar n'apparaît pas
dans Settings → Apps. Cf runbook §13.9.

> Si Simon a déjà fait Step D : ignorer. Sinon : **bloquant pour Mission A
> sous-action 2** (Connect Google Calendar).

---

## Mission A · cal.waimia.com — admin actions

> **À coller à l'agent browser tel quel, après le contexte minimal §0.**

### Brief copy-paste

```
URL : https://cal.waimia.com/auth/login

Tu vas exécuter 5 sous-actions sur cal.waimia.com en restant connecté
admin :

A1. LOGIN
  - Email : contact@virtuoseweb.fr
  - Password : Simon te le dicte (ne jamais l'écrire dans tes réponses)
  - Vérification : tu arrives sur le dashboard Cal (URL contient
    /event-types ou /bookings). Screenshot.

A2. CONNECT GOOGLE CALENDAR
  - Navigation : Settings (icône engrenage haut droit) → Apps → Calendar
    OU URL directe : https://cal.waimia.com/apps/categories/calendar
  - Cherche "Google Calendar" dans la liste.
  - Si NON visible : Step D pas encore fait par Simon — note "BLOQUÉ
    Step D yarn db-seed à exécuter d'abord, cf runbook §13.9". Skip à A3.
  - Si visible : Click "Install" / "Connect" → flow OAuth Google s'ouvre
    → Simon valide manuellement avec son compte Google.
  - Vérification : retour sur Cal avec calendrier Google listé dans
    Settings → Apps → Calendar. Screenshot.

A3. ACTIVE 2FA SUR LE COMPTE ADMIN
  - Navigation : Settings → Security → Two-factor authentication
    OU URL : https://cal.waimia.com/settings/security/two-factor-auth
  - Click "Enable 2FA"
  - Cal affiche un QR code → Simon le scanne avec son authenticator
    (1Password ou app dédiée).
  - Cal demande un code de vérification → Simon le donne, tu le saisis.
  - Cal génère 10 backup codes → screenshot pour que Simon les enregistre
    dans 1Password sous "Cal.waimia.com 2FA backup codes".
  - Vérification : badge "2FA enabled" visible. Screenshot.

A4. PROVOQUER UN FORGOT-PASSWORD POUR DIAG SMTP
  - Logout (Settings → bouton "Sign out").
  - Navigation : https://cal.waimia.com/auth/forgot-password
  - Saisis : contact@virtuoseweb.fr → submit.
  - Note l'heure exacte (HH:MM:SS) — Simon va checker Resend juste après
    cette action.
  - Vérification : message "Email sent" ou équivalent côté UI. Screenshot.
  - Reste sur cette page, ne re-login pas tout de suite — Mission B va
    diag si l'email est bien parti.

A5. BRANDING VISIBLE (admin organization settings)
  - Re-login (cf A1) avec contact@virtuoseweb.fr.
  - Navigation : Settings → General OU Settings → Appearance
    URL probable : https://cal.waimia.com/settings/my-account/general
  - Modifie si possible :
    - Display name : "Waimia · Audit RDV"
    - Bio courte : "Agence IA Waimia — audit gratuit 45min"
    - Time zone : Europe/Paris
    - Language : Français
  - Save → screenshot du formulaire après save.
  - Note : la branding profonde (logo Cal.diy → Waimia partout, couleurs)
    nécessite des modifs code côté apps/cal — HORS scope agent browser,
    Simon le fera en mission séparée.

REPORTING ATTENDU FIN DE MISSION A :
- ✅ / ❌ par sous-action A1 à A5
- Screenshots : 1 par sous-action minimum (10+ screenshots OK)
- Si A2 BLOQUÉ : noter la cause (pas de Google Calendar visible →
  Step D pas fait)
- Pour A4 : noter l'heure exacte de l'envoi forgot-password — input
  pour Mission B
```

---

## Mission B · Resend dashboard — diag SMTP

> **À coller juste après Mission A pour enchaîner pendant que les
> emails forgot-password sont récents.**

### Brief copy-paste

```
URL : https://resend.com/login

B1. LOGIN
  - Email : Simon te dicte (probablement bonjour@waimia.fr ou
    simon@waimia.fr).
  - Password : Simon te dicte.
  - Si SSO Google activé : Simon valide manuellement.
  - Vérification : dashboard Resend chargé. Screenshot.

B2. CHERCHER L'EMAIL FORGOT-PASSWORD
  - Navigation : Logs (sidebar gauche) OU Emails.
  - Filtre :
    - From : cal@waimia.fr (ou whatever EMAIL_FROM est configuré côté
      Cal — Simon peut confirmer via Vercel UI envvars)
    - Subject contient : "password" OU "reset" OU "forgot"
    - Time range : last 1 hour (ajuste selon l'heure A4 reportée par
      Simon)
  - 3 cas :
    a) Email présent + status "Delivered" → SMTP OK, mais l'email arrive
       peut-être dans spam. Simon doit checker boîte spam contact@virtuoseweb.fr.
    b) Email présent + status "Bounced" / "Failed" → screenshot l'erreur
       détaillée (raison du bounce). C'est un problème de domain auth ou
       de format From.
    c) Aucun email correspondant à cette heure → Cal.com n'a JAMAIS
       contacté Resend. Diagnostic : env vars EMAIL_SERVER_* mal
       configurées côté Vercel waimia-v2-web.
  - Screenshot du résultat dans tous les cas.

B3. VÉRIFIER DOMAIN AUTH waimia.fr
  - Navigation : Domains (sidebar) → waimia.fr (devrait être là, configuré
    Phase 2 du monorepo)
  - Vérifications attendues :
    - DKIM : ✓ Verified (key visible)
    - SPF : ✓ Verified
    - MX : pas obligatoire si Resend est seulement émetteur
    - DMARC : optionnel mais recommandé
  - Si l'un est ❌ : screenshot l'écran avec les TXT records à publier.
    C'est probablement la cause du bounce si B2 cas b).

B4. CHECKER LES API KEYS
  - Navigation : API Keys (sidebar)
  - Liste les keys actives :
    - Une key "Production" (utilisée par waimia-v2 apps/web)
    - Idéalement une key "Cal Production" (séparée pour cal.waimia.com)
    - Si une seule key partagée : OK pour démarrer, mais Simon devrait
      en créer une dédiée Cal pour rotation indépendante.
  - Note les noms (PAS les valeurs) des keys actives. Screenshot la
    liste sans afficher les valeurs en clair.

REPORTING ATTENDU FIN DE MISSION B :
- État SMTP : DELIVERED / BOUNCED / NOT_SENT (un des 3 cas B2)
- État DKIM/SPF waimia.fr : ✓ ou détail des erreurs
- Liste des API keys actives (noms uniquement)
- Hypothèse de cause si B2 cas b ou c
```

---

## Mission C · Google Cloud Console — désactiver ancien OAuth secret

> Per Simon (commit 425c1dc context) : un ancien OAuth Client Secret
> `****3Hik` doit être désactivé maintenant que le nouveau secret
> `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` est validé en prod (avec
> redirect URIs cal.waimia.com).

### Brief copy-paste

```
URL : https://console.cloud.google.com/apis/credentials

C1. LOGIN GOOGLE CLOUD CONSOLE
  - Si Simon n'est pas déjà loggé : SSO avec son compte Google.
  - Vérification : la page "APIs & Services > Credentials" charge.
    Screenshot.
  - IMPORTANT : vérifie en haut de page que le PROJECT sélectionné est
    le bon (probablement "Waimia" ou "VirtuoseWeb"). Si pas le bon :
    sélecteur de projet en haut → switcher.

C2. IDENTIFIER LES OAuth CLIENT IDs
  - Section "OAuth 2.0 Client IDs" → liste des clients.
  - Tu dois identifier 2 clients :
    a) ANCIEN : créé pour le dev / SaaS cal.com (à désactiver). Le secret
       finit par "3Hik" — Simon peut confirmer.
    b) NOUVEAU : "Cal Waimia Production" créé Phase 5 avec redirect URIs
       cal.waimia.com. Le secret commence par "GOCSPX-LjyH..."
  - Screenshot la liste avec les noms (PAS les secrets).

C3. DÉSACTIVER L'ANCIEN
  - Click sur l'ancien client (celui se finissant par 3Hik).
  - Vue détail s'ouvre : tu as 2 options selon le besoin :
    OPTION 1 (préféré) — Reset Client Secret : invalide la valeur
      actuelle, génère une nouvelle. Le code en prod qui utilise encore
      ce secret cassera immédiatement. À choisir SEULEMENT si Simon
      confirme qu'aucun service en prod n'utilise plus ce client.
    OPTION 2 — Delete Client : supprime tout (URI redirects, scopes…).
      Plus radical, irréversible. À choisir si Simon confirme que ce
      client était purement dev / sandbox.
  - Demande à Simon laquelle des 2 options choisir AVANT d'agir.
  - Après l'action : screenshot de confirmation.

C4. VÉRIFIER LE NOUVEAU CLIENT EST INTACT
  - Click sur le nouveau client "Cal Waimia Production".
  - Vérifications :
    - Authorized redirect URIs contient :
      * https://cal.waimia.com/api/integrations/googlecalendar/callback
      * https://cal.waimia.com/api/auth/callback/google (optionnel)
    - Application type : Web application
  - Screenshot la vue détail (sans afficher le secret).

REPORTING ATTENDU FIN DE MISSION C :
- Action prise sur l'ancien client : RESET / DELETE / SKIP (si Simon
  abort)
- Confirmation que le nouveau client est intact
- Screenshots des 2 vues détail
```

---

## Mission D · Vercel UI — rename projet `waimia-v2-web` → `waimia-cal`

> Cosmétique mais ça facilite la lecture des dashboards. Le projet ID
> reste `prj_25WycfwmmRgvY8bBbqEJnkozF8bp`, seul le slug visible change.
> Le rename ne casse PAS les domaines (cal.waimia.com reste mappé).

### Brief copy-paste

```
URL : https://vercel.com/simonberos-projects/waimia-v2-web/settings

D1. LOGIN VERCEL
  - SSO GitHub via Simon.
  - Vérification : URL settings du projet charge. Screenshot.

D2. RENAME
  - Section "General" → "Project Name" → champ texte.
  - Valeur actuelle : "waimia-v2-web"
  - Nouvelle valeur : "waimia-cal"
  - Click "Save" / "Update".
  - Vercel demande probablement confirmation (modal).
  - Vérification : l'URL change vers
    https://vercel.com/simonberos-projects/waimia-cal/settings
    Screenshot post-rename.

D3. VÉRIFIER QUE cal.waimia.com TOURNE TOUJOURS
  - Navigation : Domains tab.
  - Vérifie que cal.waimia.com est toujours listé "Production" + "Valid
    Configuration". Screenshot.
  - Test rapide : ouvre un nouvel onglet vers https://cal.waimia.com →
    page Cal charge. Screenshot.

REPORTING ATTENDU FIN DE MISSION D :
- ✅ rename effectué + nouvelle URL settings
- ✅ cal.waimia.com fonctionne post-rename
- (OPTIONNEL) ❌ si Vercel a forcé un redeploy ou cassé un lien

NOTE : si Vercel rejette le nom "waimia-cal" parce qu'un autre projet
existe déjà avec ce slug dans la team : essaye "waimia-calcom" ou
"cal-waimia" et reporte le choix retenu à Simon.
```

---

## Mission E · waimia.com — sanity check de l'embed après bump

> Le commit 85df751 a bumpé `apps/web/src/components/ui/molecules/CalEmbed.astro`
> pour pointer sur cal.waimia.com self-host (au lieu de cal.com SaaS).
> Vérifier que tous les usages affichent bien le calendrier self-host.

### Brief copy-paste

```
URL initiale : https://waimia-v2.vercel.app/contact
(ou https://waimia.com/contact si le custom domain est actif)

E1. CONTACT PAGE — embed inline
  - Charge la page contact.
  - Scroll jusqu'à voir le Cal embed (probablement bas de page).
  - Vérifications :
    - Iframe charge un calendrier (créneaux visibles, pas de spinner
      infini, pas de "404")
    - L'URL de l'iframe (inspect element ou logs network) contient
      "cal.waimia.com" et PAS "app.cal.com"
    - Le slug est "simon/audit" (pas "simonberos/audit")
  - Screenshot de la page complète.
  - Console DevTools : aucune erreur 404 ou CORS sur cal.waimia.com.

E2. LIEN FALLBACK
  - Sur la même page contact, cherche le bloc "Booking" dans la liste
    de contact (Email / Booking / LinkedIn / Paris).
  - Le lien doit pointer vers https://cal.waimia.com/simon/audit
    (post-commit du jour qui a fixé contact.astro).
  - Click le lien → s'ouvre dans un nouvel onglet → page Cal Waimia
    Audit charge avec créneaux. Screenshot.

E3. CHECK URLS HARDCODÉES RÉSIDUELLES (optionnel mais utile)
  - Sur waimia.com, navigue les pages principales (homepage, /offres/*,
    /a-propos, /ressources/*).
  - Cherche visuellement / via Cmd+F si tu vois des mentions
    "cal.com/simonberos" ou "cal.com/waimia" qui auraient été oubliées.
  - Si tu en trouves : screenshot + URL exacte de la page → Simon
    fixera en code.

REPORTING ATTENDU FIN DE MISSION E :
- État embed contact : ✅ self-host / ❌ encore SaaS
- État lien fallback : ✅ cal.waimia.com / ❌ encore cal.com
- Liste des références cal.com résiduelles trouvées (si applicable)
```

---

## Bug détecté côté logs Vercel (à mentionner pour info)

Logs runtime Vercel `prj_25WycfwmmRgvY8bBbqEJnkozF8bp` du 2026-05-04
montrent **3 hits 404 sur `https://cal.waimia.com/waimia/45min/embed`**
sur 2h. Hypothèses :

- **Trafic résiduel externe** — un visiteur avec une page navigateur
  cachée tente l'ancien slug `waimia/45min` sur le nouveau domaine.
  Probable + pas grave (Cal.com retourne 404 propre).
- **Crawler / bot** qui devine un slug standard.
- **Ancienne page tierce** qui linke vers `cal.waimia.com/waimia/45min`
  (improbable, slug inventé).

**Action requise** : aucune côté code (notre apps/web ne référence pas
ce slug). À noter dans le runbook Phase 5 si ça persiste >7 jours.

Optionnel : créer un redirect Cal.com `waimia/45min` → `simon/audit`
côté admin Cal pour rattraper le trafic résiduel. Mission supplémentaire
si Simon le souhaite.

---

## Reporting global attendu

À la fin des 5 missions, l'agent browser doit produire un récap unique
formaté ainsi :

```markdown
## Récap Phase 5 finalisation · 2026-05-XX

### Mission A · cal.waimia.com
- A1 Login : ✅
- A2 Google Cal : ✅ / BLOQUÉ Step D
- A3 2FA : ✅ (backup codes screenshot)
- A4 Forgot-password : envoyé HH:MM:SS
- A5 Branding profil : ✅

### Mission B · Resend
- État SMTP forgot-password : DELIVERED / BOUNCED / NOT_SENT
- DKIM/SPF waimia.fr : ✓
- API keys actives : [liste noms]

### Mission C · Google Cloud Console
- Ancien OAuth secret 3Hik : RESET / DELETE / SKIP
- Nouveau client validé : ✅

### Mission D · Vercel UI
- Rename : waimia-v2-web → waimia-cal ✅
- cal.waimia.com toujours opérationnel : ✅

### Mission E · waimia.com sanity
- Embed self-host : ✅
- Lien fallback : ✅
- Résidus cal.com : aucun / [liste]

### Hypothèses / blocages détectés
[texte libre]
```

---

## Ce qui reste hors scope agent browser

- **Branding profond Cal.diy → Waimia** (logo, favicon, couleurs primaire,
  texte landing) → modifs code dans `apps/cal/apps/web/public/` et
  variables CSS Tailwind. Risqué pour la sync upstream — à scoper en
  mission séparée par Simon avec analyse subtree.
- **SMTP fix si Mission B révèle NOT_SENT** → fix env vars Vercel
  EMAIL_SERVER_* (CLI ou Vercel UI), redeploy.
- **2FA Recovery codes 1Password import** → Simon manuel.
- **Sync upstream Cal.com** → opération git subtree, hors UI.

---

## Annexes

- [`cal-deploy-runbook.md`](cal-deploy-runbook.md) — Runbook Phase 5
  complet (§13 = pièges live-debug)
- [`cal-deploy-env.template.md`](cal-deploy-env.template.md) — Env vars
  Vercel template
- [`cal-setup.md`](cal-setup.md) — Sync upstream Cal.com workflow
