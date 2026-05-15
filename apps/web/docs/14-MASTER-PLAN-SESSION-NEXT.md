# Waimia · Master Plan — Session Next (post-reset Sonnet)

> **Handoff complet** pour la session qui démarre au reset Sonnet 5h (02:50 GMT+1, 2026-05-15).
> Ce doc contient TOUT le contexte, briefs, ordre d'exécution, coordination workers, vérifications.
> Suite logique de `12-PAGES-QUALITY-TRACKING.md` + `13-CONTENT-ARCHITECTURE.md`.

---

## 🎯 Objectif global

Transformer Waimia d'un site **fichier-driven** (50+ pages .astro hardcoded) en un **CMS headless IA-first git-based** :
- 21 collections Astro Content + Zod schemas stricts
- 25+ templates dédiés par type de contenu
- SSG par défaut + ISR sur hubs/tags/archives pour fresh content
- 200+ entrées contenu rédigées (zero placeholder)
- 12 SVG custom signature Waimia (zero stock)
- Stripe Payment Links + Customer Portal (réutilisation pattern sitewebastro)

**Persistance qualité** : chaque page doit respecter les 14 axes du brief Simon (hero) + critères techniques (Perf, GEO, DA cohérente, composants réutilisés).

---

## ✅ Décisions Simon validées 2026-05-15

| # | Décision | Détail |
|---|---|---|
| 1 | **Tags simplifiés 8** | acquisition-ia · contenu-seo-geo · productivite-ia · data-pilotage · gouvernance-ia · etudes-cas · outils-techniques · strategie |
| 2 | **Sous-types blog 5** | formation · essai · notes · avis · post (via `type` discriminator sur 1 seule collection blog) |
| 3 | **École séparée + mega-menu** | URL `/ecole/`, mais entry-point dans **Mega-menu Ressources col 3** (avec field-notes) |
| 4 | **Stripe** | Pattern sitewebastro : **Stripe Billing Portal** URL statique + **Payment Links** par produit/abonnement/formation. Pas de SDK Node. URL portail Waimia à configurer côté Stripe Dashboard |
| 5 | **CMS headless git-based** | MDX direct dans `src/content/*`. SSG par défaut + ISR sur hubs (ressources/index, archive, tag, auteur). Bien utiliser Astro Islands + props. React Islands pour interactivité ciblée (ProductReel, AtlasConnections, etc.) |
| 6 | **Multi-agents async** | Workers parallèles sur fichiers distincts. Orchestrateur Opus pré-écrit fichiers partagés AVANT lancement, supervise pendant, valide après. Pas de collision Git |

---

## 📐 Mega-menu structure cible (décision 3 ci-dessus)

```
┌─────────────────────────────────────────────────────────────────┐
│ Solutions  ·  Offres  ·  Cas  ·  Ressources  ·  L'Agence        │
└─────────────────────────────────────────────────────────────────┘
                                  ↓ hover Ressources
┌─────────────────────────────────────────────────────────────────┐
│ COL 1 — Lectures            COL 2 — Pratique         COL 3 — Apprendre   │
│                                                                          │
│ → Blog (5 types)            → Cookbooks               → 🎓 École         │
│   · Formation               → Outils                    · Parcours       │
│   · Essai                   → Veille IA                 · Cours          │
│   · Notes                   → Newsletter                · Ateliers       │
│   · Avis                                                · Certifications │
│   · Post                                                                 │
│ → Livres blancs                                       → Field notes      │
│                                                                          │
│ [→ Tous les contenus]      [→ Catalogue outils]      [→ Programme école]│
└─────────────────────────────────────────────────────────────────┘
```

**Note sur L'Agence (menu principal)** : reste dédié à `/agence/about`, `/agence/methode`, `/agence/governance`, `/agence/trust-center`, `/agence/careers`, `/agence/design-system`, `/agence/docs`. Pas d'école dedans (école est customer-facing, pas about-us).

---

## 🗂️ Architecture cible (récap doc 13)

### Collections finales (21)

**Existantes (14)** — à enrichir/migrer :
- authors · blog · cases · cookbooks · field-notes · livres-blancs · offres · outils · pages · ressources · secteurs · solutions · technologies · veille-ia

**Nouvelles (7)** — à créer :
- `tunnels` (multi-étapes par offre)
- `landing-pages` (LP campagnes)
- `newsletter` (archives)
- `welcome-pages` (post-conversion)
- `formations` (école : cours unitaires)
- `parcours` (école : séquences)
- `ateliers` (école : live ponctuels)
- `produits` (artefacts achetables)
- `abonnements` (revenus récurrents)

### Templates finaux (25+)

**Existants refactorés cette session (4)** :
- SolutionsDetailTemplate ✅
- OffresDetailTemplate ✅ (+ bug fix slot guard)
- TechnologiesDetailTemplate ✅
- AuthorPageTemplate ✅

**À refactorer (11)** :
- CaseStudyTemplate · EssayTemplate · ListIndexTemplate · LeadMagnetTemplate · HubTemplate · TrustLegalTemplate · WelcomeTemplate · UtilityTemplate · ServiceDetailTemplate · DetailMenuTemplate · ConversionFunnelTemplate

**À créer (10+)** :
- TunnelStepTemplate · LandingPageTemplate (3 variants) · EcoleHubTemplate · ParcoursDetailTemplate · FormationDetailTemplate · AtelierDetailTemplate · CertificationDetailTemplate · ProduitsHubTemplate · ProduitDetailTemplate · AbonnementsHubTemplate · AbonnementDetailTemplate · TagPageTemplate · AuthorIndexTemplate

---

## 📋 Plan d'exécution — 12 batches (waves)

> Chaque **wave** = lot de missions Sonnet **parallélisables** (fichiers distincts).
> **Opus orchestrateur** : pré-écrit les fichiers partagés AVANT chaque wave, monitore pendant, valide après.

### ⚠️ Règle anti-collision

Avant chaque wave, Opus :
1. Liste les fichiers que chaque mission va toucher
2. Identifie les fichiers PARTAGÉS (typiquement : `content.config.ts`, `tokens.css`, mega-menu component, schemas Zod)
3. **Pré-écrit ces fichiers partagés via Opus** (≤ 50 LoC chacun = exception légitime rule 23)
4. Les missions Sonnet ne touchent QUE leur scope dédié

### Wave 1 · Pré-conditions Opus (avant tout) — ✅ COMPLÈTE 2026-05-15 01:50 GMT+1

| Fichier | Status | Détail |
|---|---|---|
| `src/content.config.ts` | ✅ | Étendu à 22 collections (9 nouvelles V2 : tunnels, welcomePages, formations, parcours, ateliers, produits, abonnements, landingPages, newsletter + extensions existantes blog/offres/solutions/technologies). Zod validation OK (deprecation warnings seulement). `type` discriminator optionnel pour rétrocompat. |
| `src/data/mega-menu.ts` | ✅ | 5 sections (Solutions, Offres, Cas, Ressources, Agence). Ressources = 3 colonnes (Lectures · Pratique · Apprendre) avec École intégrée col 3. Offres = 3 cols (Services, Produits, Abonnements). |
| `src/data/tags.ts` | ✅ | 8 tags canoniques + helpers `isValidWaimiaTag`, `getTagLabel`, `getTagDescription`. |
| `src/data/stripe-links.ts` | ✅ | Placeholders Customer Portal + Payment Links (produits, abonnements, formations, parcours, ateliers). Helpers `getStripeLink`, `isStripePlaceholder`. **À remplir par Simon dans Stripe Dashboard**. |
| `src/styles/tokens.css` | ✅ | Tokens typo déjà tous présents (`--text-h1-hero`, `--text-h2-grand`, `--text-h2-section`, `--text-h2-tight`, `--text-h3-row`, `--text-h3-card`, `--text-pull-quote`, `--text-lede`). Pas de modification nécessaire. |
| `astro.config.mjs` | 🟡 | Reste `output: 'server'` (full SSR) pour l'instant. Migration vers `output: 'hybrid'` + ISR planifiée en Wave 11. Pas de breakage immédiat. |

**Validation post-Wave-1** : home + atlas + console + manifesto + offres/growth-system-ia rendent 200 ✓. Pas d'erreur Astro content validation (juste deprecation warnings Zod).

### Wave 2 · Migration content hardcoded → MDX (parallèle, 3 workers)

**Objectif** : déplacer le contenu des `.astro` vers `content/*.mdx` validés par Zod. Les pages `.astro` deviennent fines (juste `getCollection` + template).

| Worker | Mission ID | Fichiers ciblés | Critère DONE |
|---|---|---|---|
| W1 | `migrate-offres` | `content/offres/*.mdx` (7 fichiers) + `pages/offres/[...slug].astro` consommateur | 7 MDX validés Zod, page consommatrice rend 200 sur 7 slugs |
| W2 | `migrate-solutions` | `content/solutions/*.mdx` (9 fichiers) + `pages/solutions/[...slug].astro` | 9 MDX validés, page consommatrice rend 200 sur 9 slugs |
| W3 | `migrate-technologies` | `content/technologies/*.mdx` (3 fichiers) + `pages/technologies/[...slug].astro` | 3 MDX validés, 200 sur 3 slugs |

**Anti-collision** : chaque worker travaille dans son répertoire dédié. Les pages `.astro` consommatrices sont différentes par worker.

**Validation post-wave** :
- Test HTTP 200 sur 19 URLs
- Vérifier que les anciennes pages hardcoded peuvent être supprimées (ou marquées `prerender = false`)
- Re-grep `<h1` patterns pour confirmer cohérence

### Wave 3 · Templates création (parallèle, 4 workers)

**Objectif** : créer les 10+ templates manquants pour le nouveau modèle. Pas de page consommatrice à ce stade.

| Worker | Mission ID | Templates créés | Patterns |
|---|---|---|---|
| W4 | `template-tunnel-welcome` | `TunnelStepTemplate.astro` + refactor `WelcomeTemplate.astro` | Tunnel = progress bar mono + nav prev/next + body éditorial + sortie. Welcome = hero confirmation + next-steps + bonus + signature + fallback doors |
| W5 | `template-ecole` | `EcoleHubTemplate` + `ParcoursDetailTemplate` + `FormationDetailTemplate` + `AtelierDetailTemplate` + `CertificationDetailTemplate` | Style Stratechery for tech learning · Module structure · Pricing block discret · Instructor signature |
| W6 | `template-produits-abos` | `ProduitsHubTemplate` + `ProduitDetailTemplate` + `AbonnementsHubTemplate` + `AbonnementDetailTemplate` | Style FT pricing tables · Deliverables list inline · SLA table éditoriale · Stripe Payment Link CTA |
| W7 | `template-lp-tag-author` | `LandingPageTemplate` (3 variants split/centered/full-bleed) + `TagPageTemplate` + `AuthorIndexTemplate` | LP haute conversion · Tag = cross-collection index hairlines · Author index = liste éditoriale auteurs |

**Anti-collision** : chaque worker crée des fichiers nouveaux dans `components/templates/`. Aucun overlap.

### Wave 4 · Routes dynamiques (parallèle, 4 workers)

**Objectif** : créer les pages dynamiques qui consomment les nouveaux templates + collections.

| Worker | Mission ID | Routes créées |
|---|---|---|
| W8 | `routes-ecole` | `/ecole/index.astro` + `/ecole/parcours/[slug].astro` + `/ecole/cours/[slug].astro` + `/ecole/atelier/[slug].astro` + `/ecole/certification/[slug].astro` |
| W9 | `routes-produits-abos` | `/produits/index.astro` + `/produits/[slug].astro` + `/abonnements/index.astro` + `/abonnements/[slug].astro` |
| W10 | `routes-lp-tunnels` | `/lp/[slug].astro` + `/offres/[offre]/tunnel/[step].astro` + refactor `/offres/site-web-ia-tunnel/*` → utiliser nouvelle route |
| W11 | `routes-ressources-hub` | Refactor `/ressources/index.astro` (cross-collection agrégateur) + `/ressources/blog/[type].astro` (filter par type) + `/ressources/tag/[slug].astro` + `/ressources/auteur/[slug].astro` + refactor `/archive.astro` |

**Anti-collision** : routes différentes par worker. `/ressources/blog/[type]` ne touche pas `/offres/[offre]/tunnel/[step]`.

### Wave 5 · Mega-menu + navigation (Opus + 1 worker)

**Opus pré-écrit** : `src/data/mega-menu.ts` (structure 3 colonnes)

| Worker | Mission ID | Fichiers |
|---|---|---|
| W12 | `mega-menu-component` | `components/ui/organisms/MegaMenu.astro` (3 colonnes Ressources) + refactor `Header.astro` ou équivalent pour injection |

### Wave 6 · Pages identitaires (parallèle, 3 workers)

| Worker | Mission ID | Pages |
|---|---|---|
| W13 | `agence-about-methode` | `/agence/about.astro` + `/agence/methode.astro` (brief P-04 + P-05 doc 12) |
| W14 | `agence-trust-careers` | `/agence/governance.astro` + `/agence/trust-center.astro` + `/agence/careers.astro` (briefs P-06 + P-07) |
| W15 | `pages-utility` | `/contact.astro` + `/404.astro` + `/archive.astro` + `/agence/design-system.astro` + `/agence/docs.astro` (briefs P-01 P-02 P-03 P-08) |

### Wave 7 · Welcome pages (parallèle, 2 workers)

| Worker | Mission ID | Welcome pages |
|---|---|---|
| W16 | `welcome-existing` | Migrer `/bienvenue/audit` + `/bienvenue/contact` + `/bienvenue/livre-blanc` + `/bienvenue/newsletter` vers nouveau WelcomeTemplate |
| W17 | `welcome-new` | Créer `/bienvenue/formation` + `/bienvenue/produit` + `/bienvenue/abonnement` |

### Wave 8 · Stripe wiring (Opus + 1 worker)

**Opus pré-écrit** : `src/data/stripe-links.ts` (placeholders Payment Links)

| Worker | Mission ID | Action |
|---|---|---|
| W18 | `stripe-wire` | Brancher CTA produits/abonnements/formations → Payment Links · Créer page `/espace-client` (réplique pattern sitewebastro) → Stripe Billing Portal URL · FAQ Stripe |

### Wave 9 · Contenu amorçage (parallèle, 6 workers)

**Objectif** : créer le **vrai contenu** initial pour amorcer les collections. Pas du placeholder.

| Worker | Mission ID | Contenu créé |
|---|---|---|
| W19 | `content-tunnels` | 20 entrées tunnels (4 × 5 offres : site-web-ia, growth-system-ia, activation-ia, revops, application-ia-pme) |
| W20 | `content-ecole` | 8 entrées école : 5 formations + 2 parcours + 1 atelier |
| W21 | `content-produits-abos` | 6 produits + 6 abonnements (12 entrées avec frontmatter complet, body éditorial 500-800 mots chacun) |
| W22 | `content-blog-pillars` | 5 articles pillar essai (1 par cluster : acquisition-ia · contenu-seo-geo · productivite-ia · data-pilotage · gouvernance-ia), 2500-3000 mots chacun |
| W23 | `content-cases-cookbooks` | Migrer 4 cas hardcoded + 3 cookbooks hardcoded vers MDX (caserne, halcyon, northbound, plateau-enrich, claude-cowork-rollout, claude-skills-tutorial, mcp-server-deploy) |
| W24 | `content-livres-blancs` | Migrer 1 livre blanc hardcoded (ai-act-readiness) + créer 2 nouveaux squelettes premium (growth-system-ia-playbook, gouvernance-ia-pme) |

### Wave 10 · SVG custom (parallèle, 4 workers)

| Worker | Mission ID | SVG créés |
|---|---|---|
| W25 | `svg-workflow-tunnel` | `WorkflowOrchestrationDiagram` + `TunnelProgressDiagram` + `LeadFunnelDiagram` |
| W26 | `svg-taxonomy-archive` | `TaxonomyGraphDiagram` + `ArchiveTimelineDiagram` + `CrossLinkingDiagram` |
| W27 | `svg-portrait-stack` | `AuthorPortraitMonogram` + `IndustryIconograms` (×4) + `TechStackDiagram` |
| W28 | `svg-charts-misc` | `KPIBarChart` + `MaturityScale` + `EditorialHairlineSet` |

### Wave 11 · ISR + performance (Opus + 1 worker)

**Opus pré-écrit** : `astro.config.ts` adapter Vercel avec ISR

| Worker | Mission ID | Action |
|---|---|---|
| W29 | `isr-perf` | Activer ISR sur `/ressources/index`, `/archive`, `/ressources/tag/*`, `/ressources/auteur/*`, `/ecole/index` · Lighthouse audit · Image optimization · Font preload |

### Wave 12 · QA finale (Opus seulement)

| Action | Détail |
|---|---|
| Q1 | Triangulation visuelle 89 pages (HTTP 200 + grep content signatures + screenshot manuel échantillon) |
| Q2 | Schema.org validator (FAQPage, Article, Service, Product, Course, etc.) |
| Q3 | Hreflang FR/EN consistency check |
| Q4 | Links cross-collection (related solutions/offres/cases) ne 404 pas |
| Q5 | Astro check 0 errors |
| Q6 | `pnpm build` success (rule locale Waimia : obligatoire avant push Vercel) |
| Q7 | Update statuses dans `12-PAGES-QUALITY-TRACKING.md` |

---

## 🤝 Coordination orchestrateur

### Rôle Opus par batch

| Avant batch | Pendant batch | Après batch |
|---|---|---|
| Pré-écrire fichiers partagés (content.config.ts, tokens, data/*) | Monitor `ps -o etime,pcpu` toutes les 3 min | Vérifier HTTP 200 sur toutes URLs touchées |
| Vérifier que les fichiers ciblés par chaque mission ne se chevauchent pas | Check task-notifications, NE PAS poll | Re-grep signatures content attendues |
| Calibrer max-turns par mission (200-300) | Si worker bloqué CPU < 0.5% > 2 min ET 0 fichier écrit > 5 min : kill + diagnose | Update tasks status |
| Lancer les missions en parallèle via `claude -p --model sonnet --strict-mcp-config --mcp-config worker-mcp-empty.json` | Si erreur 401/usage limit : kill + retry plus tard | Si fail : créer fix mission ciblée |

### Format mission Sonnet (standard)

Chaque mission Sonnet contient :

```markdown
# WAIMIA · Mission ${ID} · ${title}

## Contexte projet
Repo: /Users/simonberos/waimia-site/site/apps/web
Docs canoniques: docs/12-PAGES-QUALITY-TRACKING.md + docs/13-CONTENT-ARCHITECTURE.md + docs/14-MASTER-PLAN-SESSION-NEXT.md
Décisions Simon: cf section "Décisions Simon validées" doc 14
Doctrine V5-V7: tokens sémantiques, swiss grid, hairlines, NYT/FT editorial, line-height:1 mono kickers

## Fichiers ciblés (scope strict)
- ${file1}
- ${file2}
NE PAS toucher: ${shared-files-list}

## Brief technique
[brief structuré : ce qui change, patterns à appliquer, extraits code prêts à coller]

## Critères acceptation
- [ ] HTTP 200 sur URLs cibles
- [ ] Frontmatter Zod-validated (si MDX)
- [ ] Bilingue FR/EN
- [ ] Typography FR (&nbsp;, &rsquo;, « »)
- [ ] Tokens sémantiques (pas de valeurs hardcoded couleurs/sizes)
- [ ] Aucun emoji (sauf ◉ ◦ ▸ → ↗ ↓ signature)
- [ ] Pas de gradient
- [ ] Hairlines 1px partout pour séparations
- [ ] Marker DONE: /tmp/codex-missions/waimia-${session}/${ID}-DONE.md

## Règles strictes
1. WRITE direct (pas de diff/patch)
2. NE PAS lancer tsc/npm/pnpm
3. Préserver Props/Slots interface si template existant
4. Toujours `await Astro.slots.render(name) ?? ''` (slot guard)
5. Bilingue obligatoire via `lang === 'fr' ? ... : ...`
```

### Patterns réutilisables (à appliquer dans tous les workers)

⚠️ **PATTERN CRITIQUE Astro 6** : toute route dynamique qui consomme une collection MDX DOIT déclarer `export const prerender = true;` au début du frontmatter. Sans ça, le dev server SSR-rend dynamiquement et `render(entry)` plante avec `RenderUndefinedEntryError`. Validé sur tunnel + tech routes 2026-05-15.

| Pattern | Code à coller |
|---|---|
| **Prerender obligatoire** | `export const prerender = true;` en tout début de frontmatter (AVANT les imports) |
| **Slot guard** | `const renderSlot = async (name: string) => (await Astro.slots.render(name)) ?? '';` |
| **getStaticPaths content** | `import { getCollection, render, type CollectionEntry } from 'astro:content'; export async function getStaticPaths() { return (await getCollection('${col}')).map(entry => ({ params: { slug: entry.id }, props: { entry } })); }` |
| **Type Props** | `type Props = { entry: CollectionEntry<'${col}'> }; const { entry } = Astro.props as Props;` |
| **Lang bilingue** | `import { langFromPath } from '../../lib/i18n'; const lang = langFromPath(Astro.url.pathname);` |
| **MDX frontmatter base** | `title_fr: "..." \n title_en: "..." \n description_fr: "..." \n description_en: "..." \n slug: kebab-case \n publishedAt: 2026-MM-DD \n tags: ['acquisition-ia']` |
| **Render MDX body** | `import { render } from 'astro:content'; const { Content } = await render(entry);` puis `<Content />` (Astro 6 function-style, PAS `entry.render()`) |
| **description max 180** | Schema baseFields impose `description_fr.max(180)`. **Toujours compter avant de rédiger** sinon InvalidContentEntryDataError cascade les rendus. |
| **Reveal H1** | `<h1 class="reveal-mask-up">...</h1>` |
| **Reveal lede** | `<p class="reveal reveal-fade">...</p>` (note : `reveal` ajoute blur(8px) initial, retiré par IntersectionObserver) |
| **Hairline section break** | `<hr class="hairline-break" />` (à définir global.css si pas existant) |

---

## 🎨 DA / Design System rappels

### Tokens sémantiques (`tokens.css`)

```css
/* Typography */
--text-h1-hero:    clamp(40px, 6vw, 92px);
--text-h2-grand:   clamp(44px, 7vw, 96px);
--text-h2-section: clamp(28px, 4vw, 56px);
--text-h2-tight:   clamp(24px, 3vw, 42px);
--text-h3-row:     clamp(20px, 2vw, 28px);
--text-h3-card:    clamp(18px, 1.6vw, 24px);
--text-h4-meta:    clamp(14px, 1.1vw, 16px);
--text-pull-quote: clamp(28px, 3.5vw, 52px);
--text-lede:       clamp(17px, 1.4vw, 22px);

/* Fonts */
--font-display: 'Instrument Serif', serif;
--font-sans:    'Inter Tight', sans-serif;
--font-mono:    'JetBrains Mono', monospace;

/* Colors */
--paper:    #F6F1E8;
--paper-2:  #EFEBE2;
--ink:      #1A1A1A;
--ink-2:    #4A4A4A;
--accent:   #C94F2E;   /* terracotta */
--muted:    #8B8B8B;
--hairline: rgba(26,26,26,0.12);

/* Spacing */
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--gut:     clamp(20px, 4vw, 48px);
```

### Composants atoms réutilisables

| Atom | Usage |
|---|---|
| `Kicker.astro` | Labels mono uppercase (variant: muted/accent/dim) |
| `Button.astro` | CTA primary/accent/ghost/ghost-dark + size sm/md/lg |
| `PillCTA.astro` | CTA pilule (utilisé manifesto) |
| `TerminalCTA.astro` | CTA terminal style (utilisé console) |
| `CursorDot.astro` | Curseur custom (fix isOnAccent ring paper sur boutons accent) |
| `Breadcrumb.astro` | Fil d'Ariane |
| `ScrollProgress.astro` | Barre progression scroll |

### Molecules signature

| Molecule | Usage |
|---|---|
| `MastheadRow.astro` | Bande mono masthead 4 colonnes (Vol/lieu/lang/booking) — padding:14/9 line-height:1 |
| `TerminalMockup.astro` | Console terminal stylisée |
| `TerminalTable.astro` | Tableau terminal éditorial |
| `EditorialWriteRow.astro` | Row chronologique éditorial |
| `EditorialCaseCard.astro` | Card cas client |
| `AsymmetricServiceRow.astro` | Row service alterné |

### Organisms signature

| Organism | Usage |
|---|---|
| `Hero.astro` | Hero home (référence absolue) |
| `ProofBar.astro` | 4 métriques style FT |
| `CapabilityStrip.astro` | 8 catégories par 4 groupes asymétriques |
| `SystemArchitecture.astro` | SVG canonique architecture |
| `Pyramid.astro` | Pyramide maturité + timeline |
| `Departments.astro` | Index linéaire départements |
| `FieldNotes.astro` | Index linéaire notes |
| `Cases.astro` | Grille cas |
| `CtaBand.astro` | Bande CTA finale |
| `ManifestoAccent.astro` | Bloc accent manifesto |
| `AtlasGrid.astro` | Grille 2×2 Atlas piliers |
| `PersonaSwitcher.astro` | Switcher persona CEO/CIO/CTO |

### Motion / Animations

| Composant | Usage |
|---|---|
| `LiquidHero.tsx` | React island canvas RAF (terracotta blobs) — `client:visible` |
| `ProductReel.tsx` | React island sticky scroll 4 steps — `client:visible` |
| `AtlasConnections.astro` | SVG animé connections atlas |
| `BootSplash.tsx` | Splash boot React island |
| `scroll-reveal.ts` | IntersectionObserver toggling `.is-visible` sur `.reveal*` |

---

## 🛡️ Garde-fous critiques

### À ne JAMAIS faire (anti-patterns détectés cette session)

1. **Cards uniformes avec border + hover lift** → préférer rows hairlines
2. **Gradients fades** → préférer fonds plats (paper / paper-2 / ink)
3. **Emojis dans le code** (sauf ◉ ◦ ▸ → ↗ ↓ déjà signature)
4. **`Astro.slots.render(name)` sans `?? ''`** → cause TypeError sur slot manquant (cf bug Offres résolu)
5. **CSS values hardcoded** (clamp(48px,9vw,132px) etc.) → toujours `var(--text-h2-grand)` etc.
6. **Inline styles HTML longs** → préférer classes scoped Astro
7. **`reveal reveal-fade` sur above-the-fold** → cause blur initial 8px visible (cf hero-cta-sub fix)
8. **`<` non escapé dans texte JSX** → utiliser `&lt;` (cf industrie.astro fix)
9. **Import inutile** → cause TypeError sur module manquant (cf Timeline.astro fix)
10. **HTTP 200 ≠ feature OK** → triangulation obligatoire (rule 17)

### À TOUJOURS faire

1. **Lang bilingue** : `lang === 'fr' ? ... : ...`
2. **Typography FR** : `&nbsp;` (U+00A0) avant `: ; ! ?`, `&rsquo;` (U+2019) pour apostrophe, « » pour guillemets
3. **Italiques `<i>` signature** : 1-2 mots clés par H1/H2 (Instrument Serif)
4. **Hairlines 1px** : `1px solid var(--hairline)` partout
5. **line-height: 1** sur kickers mono (font-size 10-13px)
6. **reveal-mask-up** sur H1 (opacity + translateY, pas de blur)
7. **Schema.org** : Article/Service/FAQPage/BreadcrumbList obligatoires
8. **Slot guard** : `(await Astro.slots.render(name)) ?? ''`

---

## 🚀 Démarrage session next (script pratique)

### Étape 1 — Vérification quotas reset

```bash
cat ~/.claude/usage-live.json | jq '.five_hour_used_pct, .seven_day_used_pct'
# Si five_hour < 30% → OK pour lancer waves
```

### Étape 2 — Setup mission dir

```bash
mkdir -p /tmp/codex-missions/waimia-session-next
ls /tmp/codex-missions/waimia-session-next  # empty
```

### Étape 3 — Pré-conditions Opus (Wave 1)

Opus écrit séquentiellement avant Wave 2 :
1. `src/content.config.ts` (extend schemas — fichier critique partagé)
2. `src/data/mega-menu.ts` (nouveau)
3. `src/data/tags.ts` (nouveau, 8 tags)
4. `src/data/stripe-links.ts` (nouveau, placeholders)
5. `src/styles/tokens.css` (ajout tokens si manquants)
6. `astro.config.ts` (ajout hybrid output + Vercel adapter si pas déjà)

### Étape 4 — Wave 2 (3 workers parallèles)

```bash
# W1 migrate-offres
cat /tmp/codex-missions/waimia-session-next/W1-migrate-offres.md | \
  /Users/simonberos/.claude/bin/claude-yolo -p --model sonnet --max-turns 300 \
  --strict-mcp-config --mcp-config /Users/simonberos/.claude/scripts/worker-mcp-empty.json \
  > /tmp/codex-missions/waimia-session-next/W1.log 2>&1 &

# W2 migrate-solutions (idem)
# W3 migrate-technologies (idem)
```

### Étape 5 — Surveillance

```bash
# Toutes les 3 min
ps -o pid,etime,time,pcpu,command -p $(pgrep -f "claude.*sonnet")
find /Users/simonberos/waimia-site -name "*.mdx" -newer /tmp/codex-missions/waimia-session-next/W1.log -type f | head
```

### Étape 6 — Validation post-wave

```bash
# Test HTTP 200 sur URLs touchées
for slug in growth-system-ia activation-ia claude-cowork application-ia-pme; do
  code=$(/usr/bin/curl -sS -m 10 -o /dev/null -w "%{http_code}" "http://localhost:4321/offres/$slug")
  echo "/offres/$slug → $code"
done
# Toutes 200 → wave validée, passer à Wave 3
```

---

## 📊 Estimation totale & livrable final

| Wave | Workers | Estimation Sonnet 5h | Livrable |
|---|---|---|---|
| 1 · Pré-conditions Opus | 0 | 30 min Opus | 6 fichiers partagés prêts |
| 2 · Migration content | 3 | 1h | 19 MDX validés, pages 200 |
| 3 · Templates | 4 | 1h30 | 10+ templates créés |
| 4 · Routes dynamiques | 4 | 1h | 12+ routes nouvelles |
| 5 · Mega-menu | 1 | 30 min | Header + MegaMenu wired |
| 6 · Pages identitaires | 3 | 1h | 8 pages /agence/* + utility |
| 7 · Welcome pages | 2 | 45 min | 7 welcome pages |
| 8 · Stripe wiring | 1 | 30 min | Espace-client + Payment Links |
| 9 · Contenu amorçage | 6 | 2h | 50+ entrées MDX vrai contenu |
| 10 · SVG custom | 4 | 1h30 | 12 SVG signature |
| 11 · ISR + perf | 1 | 30 min | ISR activé, Lighthouse OK |
| 12 · QA finale | 0 | 1h Opus | Doc 12 update + report final |
| **Total** | **29 worker-slots** | **~12h** | **CMS headless Waimia complet** |

**Note** : 12h c'est si on fait tout en série. Vu la parallélisation par wave, en pratique ce sera ~6-8h calendaires si quota Sonnet permet 3-4 workers parallèles.

---

## ⏰ Reset Sonnet timeline

- **Maintenant** (2026-05-15 01:30 GMT+1) : Sonnet 5h à 92% — ALERTE 🟠
- **02:50 GMT+1** : Reset Sonnet 5h → 0%
- **Session next** : reprendre exécution Wave 1 → 12

---

## 📂 Fichiers à lire EN PREMIER au démarrage session next

1. `docs/14-MASTER-PLAN-SESSION-NEXT.md` (ce doc — la source de vérité)
2. `docs/13-CONTENT-ARCHITECTURE.md` (architecture détaillée)
3. `docs/12-PAGES-QUALITY-TRACKING.md` (status pages individuels)
4. `~/.claude/CLAUDE.md` (global instructions Simon)
5. `~/.claude/projects/-Users-simonberos/memory/MEMORY.md` (mémoires session)

---

## 🎯 Critère de succès final session next

À la fin de toutes les waves, Simon doit pouvoir :

1. **Naviguer** sur `/ressources/`, `/ecole/`, `/produits/`, `/abonnements/` et chacune des 89 pages → toutes en 200
2. **Lire** un mega-menu Ressources avec 3 colonnes cohérentes
3. **Trouver** un blog filtrable par 5 types × 8 tags × auteurs × archives
4. **Voir** 50+ entrées contenu réelles (zero placeholder)
5. **Cliquer** sur un Payment Link Stripe pour acheter un produit/formation/abonnement
6. **Recevoir** un email post-conversion + redirect vers `/bienvenue/${trigger}` éditorial
7. **Confirmer** que la DA est cohérente entre toutes les pages (audit visuel screenshot)
8. **Valider** que `pnpm build` passe + Lighthouse > 90 sur les 5 pages principales

---

_Doc maintenu par l'orchestrateur Claude session 2026-05-15. Update à chaque wave._
_Si tu lis ceci en session next : lis ce doc EN PREMIER avant tout autre travail._
