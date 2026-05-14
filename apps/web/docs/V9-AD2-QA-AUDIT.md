# V9-AD2 · QA Audit — 10 pages clés

Auditeur : Claude Opus (lecture seule, 14 mai 2026)
Critères : DS V2 · Animations · Bilinguisme · SEO/JSON-LD · UX/CRO · A11y · Performance · Erreurs

---

## Page 1 — `apps/web/src/pages/index.astro` (Homepage)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | SEO · JSON-LD | H | `faqPage()` seul. Pas de `buildOrganization` ni `buildService`. La homepage devrait ancrer le graphe Organisation de base. | Ajouter `buildOrganization()` en JSON-LD via `jsonLd={[faqPage(faqItems), buildOrganization()]}` |
| 2 | Bilinguisme | M | Page 100 % FR hardcodée. `lang` n'est jamais importé ni utilisé. Acceptable si la homepage FR est explicitement monolangue — mais à documenter. | Confirmer stratégie : homepage FR-only = décision assumée. Sinon câbler `langFromPath`. |
| 3 | Animations | M | `.reveal-mask-up` non visible dans ce fichier — délégué au composant `<Hero />`. Impossible de confirmer sans lire Hero.astro. | Vérifier que `Hero.astro` applique `.reveal-mask-up` sur son H1 interne. |
| 4 | Performance | L | `<BootSplash client:only="react" />` bloque le premier rendu meaningful sur React. `client:only` = aucun SSR, pas de fallback HTML. | Envisager `client:load` avec skeleton visible, ou `client:idle` pour déprioritiser. |
| 5 | A11y | L | `<ScrollProgress />` : aucun `aria-hidden="true"` visible si c'est un composant décoratif. | Vérifier que ScrollProgress expose `aria-hidden` ou un label explicite. |

---

## Page 2 — `apps/web/src/pages/manifesto.astro` (Manifesto)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | SEO · Description | C | Description EN contient du jargon dev interne : `"Direction B · Manifesto variant. Terracotta canvas hero + asymmetric services + full-bleed manifesto. For teams that ship."` — exposé dans les SERPs EN. | Remplacer par une description marketing propre en EN. Ex : `"Waimia Manifesto — Build revenue, not demos. AI systems shipped, measured, documented."` |
| 2 | SEO · JSON-LD | H | Aucun JSON-LD passé à `<Base>`. Page éditoriale narrative → `buildArticle` serait adapté. | Ajouter `jsonLd={buildArticle({headline: ..., description: ...})}` dans le prop `<Base>`. |
| 3 | Animations | H | H1 ligne 64 : balise `<h1 style="...">` sans aucune classe reveal. Aucune animation d'entrée sur le titre principal. | Ajouter `class="reveal-mask-up"` sur le H1 du hero (compatible avec le style inline existant). |
| 4 | UX | H | Acte III · CTA EN line 184 : `'See the Console (Direction C)'` — libellé technique interne exposé aux utilisateurs EN. | Remplacer par `'Discover the platform'` ou équivalent. |
| 5 | Bilinguisme | H | Marquee décoratif (ligne 97-106) : aucun `aria-hidden="true"` sur le conteneur. Logos répétés 3× lus par les screen readers. | Ajouter `aria-hidden="true"` sur le `<div class="b-marquee-track">` ou son parent. |
| 6 | Navigation | M | Aucun breadcrumb. Page profonde sans retour contextuel. | Ajouter `<Breadcrumb items={[{label:'Accueil',href:'/'},{label:'Manifeste'}]} />` avant le hero. |
| 7 | UX · Liens | M | `<PillCTA href={flh('/console', lang)}>` — la route `/console` n'est pas visible dans la structure de pages auditées. Risque de 404. | Vérifier l'existence de `pages/console.astro` ou `pages/console/index.astro`. |
| 8 | DS V2 · Typography | M | Paragraphes d'acte (lignes 118, 130, 220) utilisent `font-family:var(--font-display)` pour du texte de body. DS V2 limite le Serif à H1/H2/citations. | Passer les paragraphes éditoriaux en `var(--font-sans)` sauf si explicitement classés comme citations. |
| 9 | A11y | L | `<LiquidHero client:visible />` : canvas RAF décoratif sans `aria-hidden`. | Vérifier que LiquidHero.tsx expose `aria-hidden="true"` sur son container canvas. |

---

## Page 3 — `apps/web/src/pages/offres/index.astro` (Pyramide)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | SEO · JSON-LD | H | Aucun JSON-LD. Page hub d'offres → `ItemList` ou `buildService` adapté. | Ajouter au minimum `buildService` pour l'offre phare ou un `ItemList` avec les 3 tiers. |
| 2 | UX · Liens 404 | H | Lignes 70, 76, 95, 105-134, 147-164 : liens vers `/offres/audit-maturite-ia`, `/offres/activation-ia`, `/offres/growth-system-ia`, `/offres/growth-intelligence`, `/offres/productivite-operationnelle-ia`, `/offres/site-web-ia`, `/offres/application-ia-pme`, `/offres/revops`, `/offres/claude-cowork`, `/offres/conseil`, `/offres/infrastructure-ia`. Aucune de ces pages n'est dans les pages auditées — fort risque de 404. | Auditer l'existence de chaque sous-page avant publication. Ou remplacer par `href="/contact?offer=X"` en attendant. |
| 3 | Animations | H | H1 ligne 19 : `class="hub-h1 reveal"`. Manque `.reveal-mask-up` — le H1 n'a pas l'animation de démasquage signature. | Remplacer ou compléter par `class="hub-h1 reveal-mask-up"`. |
| 4 | Bilinguisme | M | Page entièrement FR hardcodée. Aucun `lang` détecté. | Décision à documenter : page FR-only assumée, ou câbler i18n. |
| 5 | Navigation | M | Pas de breadcrumb sur la page hub `/offres`. | Ajouter `<Breadcrumb items={[{label:'Accueil',href:'/'},{label:'Offres'}]} />`. |
| 6 | Footer | M | Seul `<CtaBand />` en bas. Pas de `<FooterMarquee />` ni footer complet. | Vérifier si FooterMarquee est censé apparaître sur les pages hub. Standardiser. |

---

## Page 4 — `apps/web/src/pages/offres/site-web-ia-tunnel/index.astro` (Tunnel ép. 1)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | SEO · JSON-LD | H | Aucun JSON-LD. Page offre tunnel → `buildHowTo` ou `buildOffer` pertinent. | Ajouter `buildHowTo` décrivant les 4 étapes du tunnel. |
| 2 | DS V2 · Tokens | H | CSS utilise `var(--color-muted, #888)`, `var(--color-ink, #1a1a1a)`, `var(--color-paper, #F6F1E8)`, `var(--color-accent, #C94F2E)` avec prefix `--color-`. Le DS V2 utilise `--muted`, `--ink`, `--paper`, `--accent` (sans prefix). Double système de tokens. | Migrer vers les tokens DS V2 sans prefix. Les fallbacks hardcodés #888 etc. peuvent masquer des divergences palette. |
| 3 | Footer | M | Aucun footer ni CtaBand au bas de la page. Le tunnel se termine sur le CTA inline sans retour global. | Ajouter au moins un footer minimal ou lien retour home. |
| 4 | A11y | M | `<details>/<summary>` non utilisés sur cette page (les FAQ sont sur l'ép.4). Mais `.reveal-blur-clip` et `.reveal-stagger` : aucun `@media (prefers-reduced-motion)` dans les styles inline du tunnel. | Ajouter `@media (prefers-reduced-motion: reduce) { .reveal-stagger, .reveal-blur-clip { animation: none; opacity: 1; } }`. |
| 5 | Bilinguisme | L | La version EN est rendue via `<span lang="en">` en display:block — pattern efficace mais rend le DOM très verbeux. Alt text "Step 1/4" est correct. | Conserver le pattern mais surveiller le ratio signal/bruit à la lecture vocale. |

---

## Page 5 — `apps/web/src/pages/offres/site-web-ia-tunnel/conversion.astro` (Tunnel ép. 4)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | SEO · JSON-LD | H | Aucun JSON-LD. Page décision/tarifs → `buildOffer` pertinent pour chaque palier tarifaire. | Ajouter `buildOffer` pour Découverte (7 900€), Standard (14 900€), Sur-mesure. |
| 2 | DS V2 · Tokens | H | Même problème que ép.1 : préfixe `--color-*` partout (lignes 154, 163, 165, etc.). | Migrer vers tokens DS V2. |
| 3 | UX · CRO | H | Ligne 143 : `◉ Booking T3 2026 · **4 places restantes**` — chiffre hardcodé. Si la date est passée ou les places vendues, l'urgence devient mensongère. | Rendre dynamique ou supprimer si non maintenu en temps réel. |
| 4 | A11y · Formulaire | M | `<CalEmbed />` : sans contexte d'audit de ce composant, impossible de valider son a11y (title iframe, focus management). | Vérifier que CalEmbed a `title="Réserver un créneau"` sur son iframe et gestion focus. |
| 5 | A11y | M | `<details>/<summary>` FAQ ligne 91-115 : `summary::after` injecte '+' / '−' en CSS pseudo-element — non annoncé aux screen readers comme "développer/réduire". `aria-expanded` absent. | Ajouter JS pour toggler `aria-expanded` sur `<summary>` à l'événement `toggle`. |
| 6 | Footer | M | Aucun footer. Même problème que ép.1. | Ajouter footer ou CtaBand. |
| 7 | Bilinguisme | L | Même pattern `[lang="en"]` display:block. OK structurellement. | — |

---

## Page 6 — `apps/web/src/pages/offres/site-web-ia-landing.astro` (Landing)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | SEO · Titre | H | Title line 9 : `"Site Web IA-first — Landing · Waimia"` — le mot "Landing" est du jargon interne. Indexé tel quel dans les SERPs. | Remplacer par ex. `"Site Web IA-first — Leads automatisés en 90 jours · Waimia"`. |
| 2 | SEO · JSON-LD | H | Aucun JSON-LD. Page offre commerciale → `buildService` ou `buildOffer` pertinent. | Ajouter `buildService`. |
| 3 | UX · Cohérence métriques | H | Hero marquee (ligne 51) : `"Leads +340%"`. Case study (ligne 210) : `+218%` leads en 3 mois. Double chiffre non réconcilié — crédibilité altérée si le visiteur lit les deux. | Unifier : soit +218% (cas réel PME B2B) partout, soit expliquer que +340% est un autre cas ou une moyenne. |
| 4 | DS V2 · Tokens | H | Mêmes `--color-*` que les pages tunnel, hérités des styles partagés. | Migrer vers tokens DS V2. |
| 5 | UX · Disponibilité hardcodée | M | Lignes 44 et 359 : `"◉ Booking T3 2026 · 4 places"` hardcodé à deux endroits. | Même recommandation que ép.4 : dynamiser ou supprimer si non maintenu. |
| 6 | Footer | M | Aucun footer. La page se termine sur le CTA final. | Ajouter CtaBand ou footer minimal. |
| 7 | A11y | L | Marquee ligne 48 : `aria-hidden="true"` ✅. SVG mécanique ligne 116 : `role="img"` + `aria-label` ✅. Bien géré. | — |

---

## Page 7 — `apps/web/src/pages/solutions/acquisition-ia.astro` (Solution)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | UX · Lien 404 | C | `SolutionsDetailTemplate.astro` ligne 314 : `<a class="sol-case-cta" href="/cas-clients">` — hardcodé dans le template. La route `/cas-clients` n'est pas visible dans les pages auditées (les cas clients sont sous `/ressources/cas/`). Lien probablement 404. | Corriger en `href="/ressources/cas"` dans le template. |
| 2 | SEO · JSON-LD | H | Aucun JSON-LD. Page solution/service → `buildService` pertinent. | Ajouter `buildService` dans `SolutionsDetailTemplate`. |
| 3 | Navigation · Doublon | H | `SolutionsDetailTemplate.astro` rend à la fois un `<Breadcrumb>` composant (ligne 178) ET une nav breadcrumb inline `sol-hero-bc` (ligne 195-199). Deux breadcrumbs visibles simultanément. | Supprimer l'un des deux. Garder le composant `<Breadcrumb>` standard, retirer `sol-hero-bc` inline. |
| 4 | Bilinguisme | M | Les slots content dans `acquisition-ia.astro` (pain cards, workflows, ROI cells, stack cards) sont 100 % FR. Le template lui-même est FR. Pas de version EN structurée. | Documenter comme page FR-only (decision), ou prévoir slots EN alternatifs dans le template. |
| 5 | DS V2 · Typography | M | `SolutionsDetailTemplate` : `.sol-case-body` (ligne 832) utilise `font-family: var(--font-display)` pour un paragraph de body de cas client. DS V2 : Serif limité à H1/H2/citations. | Passer `.sol-case-body` en `var(--font-sans)`. |
| 6 | A11y | L | Hero geo SVG (template ligne 188) : `aria-hidden="true"` ✅. Breadcrumb (ligne 195) : `aria-label="Fil d'Ariane"` ✅. Bien géré. | — |

---

## Page 8 — `apps/web/src/pages/technologies/claude-models.astro` (Tech)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | Contenu · Modèles obsolètes | C | Table modèles ligne 110 : `Claude Haiku 3.5` — la suite Waimia utilise `Claude Haiku 4.5` (cf. acquisition-ia.astro ligne 68). Ligne 117 : `Claude Sonnet 4` mais le codebase référence `Claude Sonnet 4.6`. Ligne 152 : `Haiku 3.5` dans "when to avoid". | Mettre à jour : Haiku 4.5 · Sonnet 4.6 · Opus 4.7. Les prix ($0.25/M, $3/M, $15/M) sont à vérifier contre les pricing actuels Anthropic. |
| 2 | SEO · JSON-LD | H | Aucun JSON-LD. Page technologie/outil → `buildService` ou `TechArticle` pertinent. | Ajouter `buildService` dans `TechnologiesDetailTemplate`. |
| 3 | DS V2 · Typography | H | `TechnologiesDetailTemplate.astro` ligne 430 : `.tech-hero-lead { font-family: var(--font-display) }` — Serif pour le lead paragraph du hero. DS V2 : Serif limité à H1/H2/citations. | Passer `.tech-hero-lead` en `var(--font-sans)` dans le template. |
| 4 | DS V2 · Border-radius | M | Template ligne 586 : `.tech-cap-grid :global(.cap-card) { border-radius: 8px }`. DS V2 : `border-radius: 2px max`. | Passer à `border-radius: 2px`. |
| 5 | Bilinguisme | M | Contenu des slots 100 % FR. Template FR-only structurellement. | Documenter comme décision ou prévoir extension i18n. |
| 6 | Navigation · Doublon | M | Même pattern que SolutionsDetailTemplate : `tech-hero-bc` inline (ligne 181-185) ET `<Breadcrumb>` composant (ligne 163). Double breadcrumb. | Supprimer `tech-hero-bc` inline, garder `<Breadcrumb>`. |

---

## Page 9 — `apps/web/src/pages/ressources/index.astro` (Ressources)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | UX · Liens 404 | H | Lignes 19-38 : liens vers `/ressources/livres-blancs/ai-act-readiness`, `/ressources/blog/brain-circuit`, `/ressources/veille-ia`, `/ressources/cookbooks/claude-skills-tutorial`, `/ressources/cookbooks/mcp-server-deploy`, `/ressources/cookbooks/claude-cowork-rollout`. Toutes ces sous-pages sont à valider. Risque massif de 404 si non créées. | Auditer l'existence de chaque sous-page. Désactiver les liens non prêts (`cursor:not-allowed` + badge "Bientôt") plutôt que laisser 404. |
| 2 | SEO · JSON-LD | H | Aucun JSON-LD. Page hub éditorial → `ItemList` ou `CollectionPage` pertinent. | Ajouter schema `CollectionPage` ou `ItemList` avec les 5 cas clients. |
| 3 | UX · Newsletter | M | Form `action="/api/newsletter"` (ligne 175) : aucun CSRF token visible, aucune mention RGPD inline (opt-in, politique). La mention RGPD est renvoyée au texte `"RGPD-compliant"` sans lien vers la politique de confidentialité. | Ajouter lien vers `/legal/privacy` près du bouton. Ajouter `aria-describedby` liant le champ email au texte explicatif. |
| 4 | Animations | M | H1 ligne 83 : `class="hub-h1 reveal-mask-up"` ✅. Mais la section `hub-blog-lb` à ligne 139 utilise `reveal-stagger` — vérifié. Animations cohérentes. | — |
| 5 | Bilinguisme | M | Page entièrement FR. `lang` non utilisé. | Décision à documenter. |
| 6 | DS V2 · Typography | L | `.hub-lede` ligne 199 : `font-size: clamp(20px, 2.2vw, 28px)` — 28px pour du texte de sous-titre large. Acceptable pour un lead, mais au maximum du DS. À surveiller sur petits écrans. | — |
| 7 | A11y | L | `<label for="nl-email">` avec `.sr-only` ✅. Input `type="email"` + `autocomplete="email"` ✅. Bon. | — |

---

## Page 10 — `apps/web/src/pages/contact.astro` (Contact)

| # | Catégorie | Sévérité | Constat | Recommandation |
|---|-----------|----------|---------|----------------|
| 1 | Branding · Email | C | Ligne 60 : `contact@virtuoseweb.fr` — email Virtuoseweb exposé sur la page Contact Waimia. Le manifesto.astro ligne 252 référence `bonjour@waimia.fr`. Incohérence de marque visible. | Unifier : choisir `bonjour@waimia.fr` ou `contact@waimia.fr` et propager partout. |
| 2 | SEO · JSON-LD | H | Aucun JSON-LD. Page contact → `ContactPage` schema pertinent avec adresse, email, zone géographique (Paris, Genève). | Ajouter `buildOrganization()` avec `contactPoint` ou un `ContactPage` schema. |
| 3 | DS V2 · Border-radius | H | Lignes 130-132 : `border-radius: 6px` sur les inputs. DS V2 : `border-radius: 2px max`. | Passer à `border-radius: 2px`. |
| 4 | A11y · Formulaire | M | Aucun `aria-live` region pour les erreurs de validation. Si le formulaire échoue, l'utilisateur screen reader ne reçoit pas de feedback. | Ajouter `<div aria-live="polite" aria-atomic="true" class="form-errors"></div>` et injecter les erreurs dynamiquement. |
| 5 | UX · CRO | M | Form + CalEmbed en doublon : le formulaire manuel ET le booking direct sont proposés. Bien pour deux types d'utilisateurs. Mais la hiérarchie visuelle n'est pas claire — le CalEmbed arrive après. | Envisager une bascule tab ("Formulaire / Booking direct") pour éviter la longueur de page excessive. |
| 6 | Bilinguisme | M | Page entièrement FR. Titre et description FR only. | Décision à documenter, ou câbler version EN. |
| 7 | UX | L | `<a href="https://cal.com/simonberos/audit">` ligne 64 : lien vers profil personnel Simon Beros. Si la marque Waimia a son propre compte Cal.com, préférer un lien de marque. | Vérifier si `cal.com/waimia/audit` est disponible. |

---

## Récapitulatif transversal

### Issues communes à plusieurs pages

| Pattern | Pages concernées | Sévérité |
|---------|-----------------|----------|
| Absence JSON-LD | 8/10 pages (tout sauf homepage) | H |
| Token `--color-*` au lieu de `--*` DS V2 | Tunnel ép.1, ép.4, Landing (CSS partagé) | H |
| Double breadcrumb (composant + inline) | Acquisition IA, Claude Models | H |
| Aucun footer/FooterMarquee | Offres hub, Tunnel ép.1, Tunnel ép.4, Landing | M |
| Disponibilité hardcodée "T3 2026 · 4 places" | Tunnel ép.4, Landing (x2) | M |
| Serif (`--font-display`) sur body text | Manifesto, Templates Solutions/Tech | M |

### Top 3 issues Critiques

1. **C-1 · Email branding** (Contact) : `contact@virtuoseweb.fr` exposé sur la page Contact Waimia au lieu de `bonjour@waimia.fr`. Fracture de marque directement visible.

2. **C-2 · Modèles Claude obsolètes** (Claude-models) : Haiku 3.5 et Sonnet 4 dans la table de comparaison alors que le reste du site cite Haiku 4.5, Sonnet 4.6, Opus 4.7. Page "autorité technique" avec des versions périmées = crédibilité CTO dégradée.

3. **C-3 · Lien `/cas-clients` 404** (Solutions Acquisition via template) : Le CTA "Voir le cas complet" du case study pointe sur `/cas-clients` (hardcodé dans `SolutionsDetailTemplate.astro:314`) alors que les cas clients sont sous `/ressources/cas/`. Lien mort sur une page de conversion.

### Recommandation prochaine wave (V9-AD3)

**Priorité 1 — Fixes bloquants (1-2 jours)**
- Corriger l'email Contact : `contact@virtuoseweb.fr` → `bonjour@waimia.fr`
- Corriger le lien `/cas-clients` → `/ressources/cas` dans `SolutionsDetailTemplate.astro:314`
- Mettre à jour les modèles Claude dans `claude-models.astro` : Haiku 4.5 · Sonnet 4.6 · Opus 4.7 avec les prix actuels
- Corriger la description EN du Manifesto (supprimer le jargon dev interne)
- Corriger le libellé CTA EN Acte III Manifesto : `'See the Console (Direction C)'` → libellé propre

**Priorité 2 — SEO/JSON-LD (demi-journée)**
- Ajouter JSON-LD sur au moins les 5 pages commerciales clés : Manifesto (Article), Offres hub (ItemList), Landing (Service), Acquisition (Service), Contact (ContactPage)

**Priorité 3 — DS V2 tokens et border-radius (demi-journée)**
- Migrer `--color-*` → `--*` dans les styles du tunnel/landing
- `border-radius: 6px` → `2px` dans Contact
- `border-radius: 8px` → `2px` dans TechnologiesDetailTemplate cap-cards
- `.tech-hero-lead` et `.sol-case-body` : Serif → sans-serif

**Priorité 4 — Double breadcrumbs + animations manquantes**
- Supprimer nav breadcrumb inline dans SolutionsDetailTemplate et TechnologiesDetailTemplate (garder le composant `<Breadcrumb>`)
- Ajouter `reveal-mask-up` sur H1 du Manifesto
- Ajouter `reveal-mask-up` sur H1 de Offres/index.astro
