# Waimia · Pages Quality Tracking & Refactor Roadmap

> **Source de vérité** — état qualité de **89 pages** + **14 collections** + **15 templates**.
> Créé en session du 2026-05-15. Mis à jour à chaque vague de refactor.

---

## Sommaire

1. [Executive summary](#executive-summary)
2. [Critères qualité (14 axes Simon)](#critères-qualité)
3. [Session 2026-05-15 — livré](#session-livré)
4. [Inventaire complet par catégorie](#inventaire)
5. [Status par page (matrix)](#status-matrix)
6. [Briefs de refactor par template](#briefs-templates)
7. [Briefs détaillés par page singleton](#briefs-pages)
8. [Roadmap d'exécution](#roadmap)

---

## Executive summary

**Total pages** : 89 (52 prod FR · 6 EN · 31 routes dynamiques / index / utilitaires)
**Collections** : 14 (authors, blog, cases, cookbooks, field-notes, livres-blancs, offres, outils, pages, ressources, secteurs, solutions, technologies, veille-ia)
**Templates** : 15

| Statut | Pages | % |
|---|---|---|
| ✅ Refactorées V5-V7 (DA alignée home) | **4** singletons + 1 template *partial* | ~5% |
| 🟡 Templates touchés mais pages individuelles non vérifiées | ~28 (via Solutions/Offres/Tech/Author templates) | ~31% |
| ❌ TODO (jamais touchées V5-V7) | ~57 | ~64% |

**Le gros du travail reste à faire** — la session 2026-05-15 a touché 4 pages singletons + 4 templates. Les **62 pages** consommatrices de templates héritent partiellement des fixes mais aucune n'a reçu d'audit individuel "Simon-grade" (14 axes hero).

---

## Critères qualité

### Les 14 axes du brief Simon (hero) — applicables à TOUTE section principale

1. **Layout** — colonne gauche 58-62% (contenu stratégique) / colonne droite 38-42% (preuve visuelle/démo)
2. **Headline** — 9-11 mots max par ligne, hiérarchie typo ligne 1 / ligne 2 (92-95%), line-height +8-12%, respiration sous le titre
3. **Sous-texte** — réduit 20-30%, structure transformation + preuve/rapidité
4. **Bloc catégories** — 3 max (pas 6+), padding vertical, capitales discrètes
5. **CTA** — +40-60px vide avant, primary noir + secondary ghost, wording concret ("Voir une démo" vs "Voir Growth System IA")
6. **Preuve / stats** — chiffre massif dominant + micro label + preuve contextuelle (3 max)
7. **Colonne droite** — démo visuelle workflow (CRM, IA, analytics, scoring en système modulaire monochrome éditorial)
8. **Espacements verticaux** — système strict (Headline→body 56px · Body→catégories 48px · Catégories→CTA 56px · CTA→preuve 24px)
9. **Grille de fond** — opacité réduite, structure sans dominer
10. **Microcopy / métadata** — -40-60% (garder PARIS/GENÈVE + DISPONIBLE Q3 2026, supprimer Vol/version/bilingue)
11. **Alignements** — swiss grid strict, tous blocs sur mêmes colonnes/gutters/rythmes
12. **Typographie** — Instrument Serif pour headline + accents uniquement, sans-serif (Inter Tight) pour body/stats/labels/CTA
13. **Contraste visuel** — pyramide 5 niveaux : headline → preuve visuelle → CTA → stats → metadata
14. **Rythme éditorial** — retirer 15-20% d'infos, respiration assumée, asymétrie luxueuse

### Méta-critères techniques

| Critère | Validation |
|---|---|
| **Performance** | LCP < 2.5s, no JS-heavy hydration above-the-fold |
| **GEO/SEO** | Title < 60, description < 160, OG image, Schema.org `Service`/`Article`/`FAQPage`/`BreadcrumbList`, hreflang FR/EN |
| **Collections** | Page dynamique consomme `getCollection()`, fallback static-paths correct |
| **SSG** | `export const prerender = true` sur pages statiques |
| **Design system** | Tokens sémantiques (`--text-h1-hero`, `--font-display`, `--accent`, `--hairline`) |
| **Composants réutilisés** | Pas de duplication CSS — préférer `atoms/molecules` |
| **SVG custom** | Pas d'images stock, SVG vectoriel monochrome ou minimaliste |
| **Animations** | `reveal-mask-up` sur H1, `reveal reveal-fade` sur ledes, transitions View Transitions API |
| **Cohérence transitions** | Une section à l'autre via SectionTransition atom ou hairlines explicites |

---

## Session livré

### Pages singletons travaillées (V5-V7 + content V2)

| Page | Wave 1 (layout) | Wave 2 (content V2) | Status |
|---|---|---|---|
| `/` (Hero.astro) | ✅ V5 scope + V6 densif + V7 ProofBar + masthead fix `padding:14/9` line-height:1 | — (déjà bien) | ✅ |
| `/console` | ✅ H1 132→96px, padding densifié, sub-CTA fix | ✅ 7 inserts content (sous-lede mono hero, ledes Acte I/II/III/IV, manifesto étendu, Acte V commitment + tagline) | ✅ |
| `/atlas` | ✅ H1 132→96px, hero 2-cols grid 1.4fr/1fr, mini-map 4 piliers col droite | ✅ 3 inserts (hero subhead "câble l'IA dans le revenu", mini-map deliverables, section "Comment lire") | ✅ |
| `/manifesto` | ✅ H1 132→108px, calc(100vh-108px), GrainOverlay supprimé, marquee densifié | ✅ 6 inserts (hero subhead "cinq actes", Acte I rails/règles/humain, Acte II "six métiers", Acte III "propriétaire à vie", Acte IV chiffres en clair, Acte V tagline mono) | ✅ |

### Templates refactorés (impact sur 28+ pages via Props)

| Template | LoC | Pages consommatrices | Patterns appliqués |
|---|---|---|---|
| `SolutionsDetailTemplate.astro` | 1023→ | 9 (productivite-ia, finance, acquisition-ia, contenu-seo-geo-ia, site-web-ia-pme, crm-relances-ia, fintech, support-client-ia, slug catch-all) | Pattern A (stack-card → lignes éditoriales hairlines), +slots optionnels `faq` (Pattern B Q/R) + `livrables` (Pattern D inline) |
| `OffresDetailTemplate.astro` | 1078→ | 7 (activation-ia, application-ia-pme, claude-cowork, growth-intelligence, growth-system-ia, infrastructure-ia, productivite-operationnelle-ia) | Pattern A (Method timeline → 3-col éditoriales), +slots `faq` (B), `inclusions` (D), `pricing` (E table NYT) **+ bug fix slot guard `?? ''`** |
| `TechnologiesDetailTemplate.astro` | 934→ | 2 (virtuoseos, claude-models) | Pattern A (Capabilities cards → `<table tt-specs>`), Pattern C (Ecosystem cards → inline-list) |
| `AuthorPageTemplate.astro` | 1017→ | 1 (slug catch-all équipe) | Pattern A (Articles cards → ap-resource-index chronologique), Pattern C (Expertises pills → inline mono), Pattern D (Social SVG → address inline), **+ Pattern D pull-quote display 28-52px** |

### Bug fixes critiques

1. **MastheadRow centering** — `padding: 14px 0 9px` + `line-height: 1` pour centrage mathématique entre traits asymétriques
2. **OffresDetailTemplate slot guard** — 7 pages /offres/* en HTTP 500 → wrapper `renderSlot(name)` qui garantit `string` (fix runtime TypeError)
3. **Hero sub-CTA blur** — retrait classes `reveal reveal-fade` (blur initial 8px persistant)
4. **CursorDot on terracotta** — état `.cta.on-accent` ring paper outline pour contraste sur boutons accent
5. **LiquidHero grain flicker** — alpha 0.035→0.018, dots 80→30
6. **GrainOverlay supprimé** — animation 0.5s steps(2) = 4 changes/sec = flicker (delete on s'en fiche sa apporte rien)

---

## Inventaire

### Catégorie 1 · Pages racine éditoriales (4 pages — pillar)

| Page | Template | Status | Doctrine V5-V7 |
|---|---|---|---|
| `index.astro` | — (Hero.astro custom) | ✅ Refactor complet | ✅ |
| `atlas.astro` | — (custom + AtlasGrid) | ✅ Refactor complet | ✅ |
| `console.astro` | — (custom + TerminalMockup, ProductReel) | ✅ Refactor complet | ✅ |
| `manifesto.astro` | — (custom + LiquidHero) | ✅ Refactor complet | ✅ |

### Catégorie 2 · /solutions/ (10 pages — SolutionsDetailTemplate)

| Page | Template | Status | TODO |
|---|---|---|---|
| `solutions/index.astro` | (List custom) | ❌ Non audité | Audit + brief |
| `solutions/[...slug].astro` | SolutionsDetailTemplate | 🟡 Hérite refactor template | Audit content collection `src/content/solutions/*` |
| `solutions/acquisition-ia.astro` | SolutionsDetailTemplate | 🟡 Hérite refactor template | Audit content + brief 14 axes |
| `solutions/contenu-seo-geo-ia.astro` | SolutionsDetailTemplate | 🟡 | Idem |
| `solutions/crm-relances-ia.astro` | SolutionsDetailTemplate | 🟡 | Idem |
| `solutions/finance.astro` | SolutionsDetailTemplate | 🟡 | Idem |
| `solutions/fintech.astro` | SolutionsDetailTemplate | 🟡 | Idem |
| `solutions/productivite-ia.astro` | SolutionsDetailTemplate | 🟡 | Idem |
| `solutions/site-web-ia-pme.astro` | SolutionsDetailTemplate | 🟡 | Idem |
| `solutions/support-client-ia.astro` | SolutionsDetailTemplate | 🟡 | Idem |

### Catégorie 3 · /offres/ (13 pages — multi-templates)

| Page | Template | Status | TODO |
|---|---|---|---|
| `offres/index.astro` | (custom hub) | ❌ Non audité | Audit + brief |
| `offres/activation-ia.astro` | OffresDetailTemplate | 🟡 200 OK post-fix | Audit content + visuel workflow col droite |
| `offres/application-ia-pme.astro` | OffresDetailTemplate | 🟡 200 OK | Idem |
| `offres/audit-maturite-ia.astro` | **DetailMenuTemplate** | ❌ Template non touché | Brief 14 axes + refactor template |
| `offres/claude-cowork.astro` | OffresDetailTemplate | 🟡 200 OK | Audit content |
| `offres/conseil.astro` | **HubTemplate** | ❌ Template non touché | Brief 14 axes + refactor template |
| `offres/growth-intelligence.astro` | OffresDetailTemplate | 🟡 200 OK | Audit content |
| `offres/growth-system-ia.astro` | OffresDetailTemplate | 🟡 200 OK | Audit content |
| `offres/infrastructure-ia.astro` | OffresDetailTemplate | 🟡 200 OK | Audit content |
| `offres/productivite-operationnelle-ia.astro` | OffresDetailTemplate | 🟡 200 OK | Audit content |
| `offres/revops.astro` | **ServiceDetailTemplate** | ❌ Template non touché | Brief 14 axes + refactor template |
| `offres/site-web-ia.astro` | **ConversionFunnelTemplate** | ❌ Template non touché | Brief 14 axes + refactor template |
| `offres/site-web-ia-landing.astro` | (custom) | ❌ Non audité | Audit + brief |
| `offres/site-web-ia-tunnel/index.astro` | (tunnel custom) | ❌ Non audité | Audit + brief tunnel cohérence |
| `offres/site-web-ia-tunnel/conversion.astro` | (tunnel) | ❌ | Idem |
| `offres/site-web-ia-tunnel/mecanique.astro` | (tunnel) | ❌ | Idem |
| `offres/site-web-ia-tunnel/preuves.astro` | (tunnel) | ❌ | Idem |

### Catégorie 4 · /technologies/ (3 pages)

| Page | Template | Status | TODO |
|---|---|---|---|
| `technologies/index.astro` | (List custom) | ❌ Non audité | Audit + brief |
| `technologies/virtuoseos.astro` | TechnologiesDetailTemplate | 🟡 200 OK | Audit content + brief 14 axes |
| `technologies/claude-models.astro` | TechnologiesDetailTemplate | 🟡 200 OK | Idem |

### Catégorie 5 · /cas/ (6 pages — CaseStudyTemplate)

| Page | Template | Status | TODO |
|---|---|---|---|
| `cas/index.astro` | (List custom) | ❌ | Audit hub cas + brief |
| `cas/[...slug].astro` | CaseStudyTemplate | ❌ | Brief 14 axes + refactor template |
| `cas/caserne.astro` | CaseStudyTemplate | ❌ | Audit content + brief |
| `cas/halcyon.astro` | CaseStudyTemplate | ❌ | Idem |
| `cas/northbound.astro` | CaseStudyTemplate | ❌ | Idem |
| `cas/plateau.astro` | CaseStudyTemplate | ❌ | Idem |

### Catégorie 6 · /agence/ (7 pages — mixte)

| Page | Template | Status | TODO |
|---|---|---|---|
| `agence/about.astro` | (custom probable) | ❌ | Audit + brief 14 axes (page identitaire critique) |
| `agence/careers.astro` | (custom) | ❌ | Audit + brief |
| `agence/design-system.astro` | (showcase custom) | ❌ | Audit cohérence kit |
| `agence/docs.astro` | (UtilityTemplate?) | ❌ | Audit |
| `agence/governance.astro` | TrustLegalTemplate | ❌ | Brief refactor |
| `agence/methode.astro` | (EssayTemplate?) | ❌ | Audit + brief |
| `agence/trust-center.astro` | TrustLegalTemplate | ❌ | Brief refactor |

### Catégorie 7 · /secteurs/ (5 pages)

| Page | Template | Status | TODO |
|---|---|---|---|
| `secteurs/index.astro` | (custom) | ❌ | Audit hub |
| `secteurs/[...slug].astro` | (catch-all probable SolutionsDetail?) | ❌ | Vérifier template, audit |
| `secteurs/finance-compta.astro` | (probable Solutions) | ❌ | Audit |
| `secteurs/industrie.astro` | (TS error détecté ligne 105) | ❌ | **Fix syntax error + audit** |
| `secteurs/services-b2b.astro` | (probable Solutions) | ❌ | Audit |

### Catégorie 8 · /ressources/ (18 pages — multi-collections)

| Page | Template | Collection | Status |
|---|---|---|---|
| `ressources/index.astro` | (hub custom) | — | ❌ |
| `ressources/academy.astro` | (custom) | — | ❌ |
| `ressources/changelog.astro` | (UtilityTemplate?) | — | ❌ |
| `ressources/blog/index.astro` | ListIndexTemplate | blog | ❌ |
| `ressources/blog/[...slug].astro` | EssayTemplate | blog | ❌ |
| `ressources/blog/brain-circuit.astro` | EssayTemplate | blog | ❌ |
| `ressources/cookbooks/index.astro` | ListIndexTemplate | cookbooks | ❌ |
| `ressources/cookbooks/[...slug].astro` | EssayTemplate | cookbooks | ❌ |
| `ressources/cookbooks/claude-cowork-rollout.astro` | EssayTemplate | cookbooks | ❌ |
| `ressources/cookbooks/claude-skills-tutorial.astro` | EssayTemplate | cookbooks | ❌ |
| `ressources/cookbooks/mcp-server-deploy.astro` | EssayTemplate | cookbooks | ❌ |
| `ressources/livres-blancs/index.astro` | ListIndexTemplate | livres-blancs | ❌ |
| `ressources/livres-blancs/[...slug].astro` | (LeadMagnetTemplate?) | livres-blancs | ❌ |
| `ressources/livres-blancs/ai-act-readiness.astro` | LeadMagnetTemplate | livres-blancs | ❌ |
| `ressources/veille-ia/index.astro` | ListIndexTemplate | veille-ia | ❌ |
| `ressources/veille-ia/[...slug].astro` | EssayTemplate | veille-ia | ❌ |
| `ressources/categorie/[...slug].astro` | (tag list) | — | ❌ |
| `ressources/silo/[...slug].astro` | (silo content) | — | ❌ |
| `ressources/tag/[...slug].astro` | (tag list) | — | ❌ |
| `ressources/outils/[...slug].astro` | (outils tools) | outils | ❌ |

### Catégorie 9 · /bienvenue/ (5 pages — WelcomeTemplate)

| Page | Template | Status | TODO |
|---|---|---|---|
| `bienvenue/[...slug].astro` | WelcomeTemplate | ❌ | Brief refactor template |
| `bienvenue/audit.astro` | WelcomeTemplate | ❌ | Audit post-conversion |
| `bienvenue/contact.astro` | WelcomeTemplate | ❌ | Audit |
| `bienvenue/livre-blanc.astro` | WelcomeTemplate | ❌ | Audit |
| `bienvenue/newsletter.astro` | WelcomeTemplate | ❌ | Audit |

### Catégorie 10 · /equipe/ (2 pages — AuthorPageTemplate)

| Page | Template | Status | TODO |
|---|---|---|---|
| `equipe/index.astro` | (List custom) | ❌ | Audit hub auteurs |
| `equipe/[...slug].astro` | AuthorPageTemplate | 🟡 Hérite refactor | Audit content collection authors |

### Catégorie 11 · /en/ (6 pages — versions EN)

| Page | Status | TODO |
|---|---|---|
| `en/index.astro` | 🟡 Hérite home | Sync content EN avec FR refactor |
| `en/atlas.astro` | 🟡 | Idem |
| `en/console.astro` | 🟡 | Idem |
| `en/manifesto.astro` | 🟡 | Idem |
| `en/bienvenue/audit.astro` | ❌ | Sync welcome EN |
| `en/bienvenue/livre-blanc.astro` | ❌ | Idem |
| `en/bienvenue/newsletter.astro` | ❌ | Idem |

### Catégorie 12 · Utility / système (5 pages)

| Page | Status | TODO |
|---|---|---|
| `404.astro` | ❌ | Brief 404 éditorial (kicker + H1 + lede + retour + 4 portes) |
| `archive.astro` | ❌ | Brief archive timeline éditoriale |
| `contact.astro` | ❌ | Brief contact form Swiss grid + signature + slot map |
| `[...slug].astro` | ❌ | Catch-all racine — vérifier fallback |
| (autres utilities) | — | — |

---

## Status matrix

| Page key | Layout | H1 96px | Sous-texte | 3 cats max | CTA hiér. | Stats sys. | Col droite démo | Espace strict | Microcopy −60% | Align grille | Typo serif/sans | Pyramide visuelle | Anim transitions | SVG custom | Composants réuse | Collection SSG | GEO/Schema | DA cohérente |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 ProofBar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ |
| `/console` | ✅ | ✅ | ✅ | n/a | ✅ | ✅ | ✅ TerminalMockup | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/atlas` | ✅ | ✅ | ✅ | ✅ 4 piliers | ✅ | n/a | ✅ Mini-map | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ AtlasConnections | ✅ | ✅ | ✅ | ✅ |
| `/manifesto` | ✅ | ✅ 108px | ✅ | n/a | ✅ | ✅ Stats | ✅ LiquidHero | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/solutions/*` (9) | 🟡 | ❓ | ❓ | ❓ | 🟡 | ❓ | ❓ | ❓ | ❓ | ❓ | 🟡 | ❓ | 🟡 | ❓ | 🟡 | 🟡 | ❓ | 🟡 |
| `/offres/*` (7 OffresDT) | 🟡 | ❓ | ❓ | ❓ | 🟡 | ❓ | ❓ | ❓ | ❓ | ❓ | 🟡 | ❓ | 🟡 | ❓ | 🟡 | 🟡 | ❓ | 🟡 |
| `/technologies/*` (2) | 🟡 | ❓ | ❓ | ❓ | 🟡 | ❓ | ❓ | ❓ | ❓ | ❓ | 🟡 | ❓ | 🟡 | ❓ | 🟡 | 🟡 | ❓ | 🟡 |
| `/cas/*` (5) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/agence/*` (7) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/secteurs/*` (5) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/ressources/*` (18) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/bienvenue/*` (5) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/equipe/*` (2) | 🟡 | ❓ | ❓ | n/a | 🟡 | ❓ | ❓ | ❓ | ❓ | ❓ | 🟡 | ❓ | 🟡 | ❓ | 🟡 | 🟡 | ❓ | 🟡 |
| `/contact, /404, /archive` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Légende** : ✅ conforme · 🟡 partial / hérite refactor template · ❓ non audité individuellement · ❌ TODO

---

## Briefs templates

### Template 1 · `CaseStudyTemplate.astro` — REFONTE PRIORITAIRE (5 pages)

**Objectif** : transformer les cases en lectures d'analyse FT / NYT data journalism. Pas de hero stock + bullet list "résultats". Plutôt :

- **Hero éditorial** : kicker `[case · client]`, H1 `nom client` + sous-titre `description courte`, lede 2-3 phrases, kpi mono inline (durée · stack · impact mesuré)
- **Acte I · Le contexte** : prose éditoriale 2-3 paragraphes (avant Waimia, où la marque en était, pourquoi ils ont appelé)
- **Acte II · Le diagnostic** : tableau éditorial 3-col (Constat · Cause · Levier identifié)
- **Acte III · Le système câblé** : workflow visuel SVG (CRM · IA · Analytics · Pipeline en grille modulaire monochrome)
- **Acte IV · Les chiffres** : ProofBar 3-4 stats massives (style ProofBar home, Instrument Serif accent terracotta)
- **Acte V · Citation marquante** : pull-quote display 28-52px avec attribution
- **CTA finale** : "Câbler un système similaire chez vous" (lien /contact)

**Patterns à appliquer (14 axes brief Simon)** :
- Headline 9-11 mots ligne 1 + sous-titre ligne 2 (95%)
- Sous-texte transformation + preuve réduite -25%
- 3 KPI hero max (durée, stack, impact)
- Démo visuelle col droite obligatoire (workflow SVG)
- Espacement strict 56/48/56/24
- Typo serif uniquement headline + accents
- Pyramide : headline → workflow → KPI → citation → metadata

### Template 2 · `EssayTemplate.astro` — REFONTE PRIORITAIRE (8 pages blog/cookbooks/veille)

**Objectif** : essai long format style New Yorker / Stratechery. Pas de "blog post générique".

- **Hero essai** : kicker `[essai · catégorie · temps lecture]`, H1 ≤ 96px display, sous-titre éditorial italique
- **Métadata éditoriale** : date · auteur · catégorie · 3 mots-clés (inline mono séparateurs `·`)
- **Sommaire flottant** : sticky TOC col droite avec hairlines (style Substack / Stratechery)
- **Body prose** : `prose-editorial` class globale, max-width 720px, font-display 17-19px line-height 1.65
- **Pull-quotes périodiques** : 1 par 800 mots, display 24-32px italique, hairline gauche
- **Sidenotes** : composant `Sidenote` pour annotations (visible col droite desktop, inline mobile)
- **Citations source** : footnotes mono numérotées en bas (style FT/Economist)
- **CTA fin** : 2-3 articles liés + newsletter signup éditorial

**Patterns 14 axes** :
- Réduire largeur body 65ch
- Espace strict entre paragraphes (1.5 line-heights)
- Pull-quotes asymétriques cassent le flux
- Aucun emoji, aucun gradient
- Schema.org `Article` complet (datePublished, dateModified, author, image)

### Template 3 · `ListIndexTemplate.astro` — REFONTE (3 pages : blog/cookbooks/veille index)

**Objectif** : index éditorial style NYT/FT « browse all stories ». Pas de grille de cards uniforme.

- **Hero index** : kicker section · H1 titre catégorie · lede courte · filtres mono inline
- **Featured (1-3)** : article principal + 2 secondaires en grid asymétrique (1.4fr 1fr 1fr)
- **Liste chronologique** : rows hairlines `date | titre + excerpt | tag mono | →`
- **Pagination** : mono `01 / 12 ·  Voir plus →`

**Patterns** : pas de cards 3-col, plutôt liste FT-style avec hairlines. Hover row teinte terracotta 2.5%.

### Template 4 · `LeadMagnetTemplate.astro` — REFONTE (2 pages livres-blancs)

**Objectif** : pas une "landing-LP-conversion". Plutôt **artefact éditorial** style Économiste / FT subscription.

- **Hero document** : kicker `[livre blanc · pages · date]`, H1 titre du document, lede 2 phrases
- **Sommaire éditorial** : 5-7 chapitres en liste numérotée hairlines
- **Extrait apéritif** : 2-3 paragraphes du document en blockquote display
- **Auteur** : portrait minimaliste + bio courte (style auteur magazine)
- **Form** : minimal email + nom (Swiss grid, no gradients, no badges)
- **Preuve** : 2-3 stats "qui a téléchargé"

### Template 5 · `HubTemplate.astro` — REFONTE (2 pages : agence/methode + offres/conseil)

**Objectif** : page hub stratégique. Navigation curated entre sous-domaines.

- **Hero hub** : kicker section · H1 · lede · 3 portes d'entrée par persona
- **Sections principales** : 3-5 blocs éditoriaux avec hairlines, chacun H2 + lede + lien `→ Voir`
- **Index navigation** : mini sommaire col droite mono

### Template 6 · `TrustLegalTemplate.astro` — REFONTE (3 pages : governance, trust-center)

**Objectif** : pages légales/trust pas indigestes. Style **document officiel éditorial** type charter ONU / FT compliance.

- **Hero** : kicker `[charter · v · last updated]`, H1 titre, lede objectif
- **Body** : sections numérotées hairlines, prose dense mais aérée, sidenotes pour exemples
- **Index latéral** : sticky TOC col droite mono
- **Footer compliance** : DPO contact + dernière révision date + version

### Template 7 · `WelcomeTemplate.astro` — REFONTE (5 pages /bienvenue/)

**Objectif** : page de confirmation post-conversion. Pas de "Thank you generic". Plutôt **document éditorial signé**.

- **Hero confirmation** : kicker mono `[livré · date · heure]`, H1 affirmation ("Votre audit est lancé", "Document envoyé"), lede 1-2 phrases
- **Next steps** : 3 étapes numérotées éditoriales (recevrez quoi, quand, par qui)
- **Bonus content** : 3-5 ressources liées en table éditoriale
- **Signature** : Simon Beros · date · contact direct mono

### Template 8 · `UtilityTemplate.astro` — POLISH (7 pages utilitaires)

**Objectif** : pages utilitaires (404, archive, changelog, docs) cohérentes avec DA.

- **404** : hero éditorial "Page introuvable" + 4 portes (Atlas / Solutions / Cas / Contact)
- **Archive** : timeline éditoriale page-par-page mois-par-mois
- **Changelog** : table mono `version · date · changes`

### Template 9 · `ServiceDetailTemplate.astro` — REFONTE (2 pages : revops)

**Note** : utilisé par revops.astro. Si le pattern diffère de OffresDetailTemplate, vérifier cohérence et harmoniser ou fusionner.

### Template 10 · `DetailMenuTemplate.astro` — REFONTE (1 page : audit-maturite-ia)

Page-menu avec navigation interne. Vérifier structure et appliquer patterns.

### Template 11 · `ConversionFunnelTemplate.astro` — REFONTE (1 page : site-web-ia)

Funnel multi-étapes. Vérifier UX et cohérence avec doctrine V5-V7.

---

## Briefs pages

### Brief P-01 · `/contact.astro` (CRITIQUE)

**Objectif perception** : "système réservation premium", pas "form générique".

**Structure cible** :
- **Hero** : kicker `Contact · 45 min · Booking T3 2026`, H1 court "Réserver un audit" / "Open a session" italique sur "audit"/"session", sous-titre éditorial 1 phrase
- **Layout 2-cols** : col gauche 58% form Swiss minimal · col droite 42% **signature + map + horaires + contact direct**
- **Form** : email + nom + société + budget select + message — fields hairlines bottom only (style FT subscription)
- **Col droite éditoriale** :
  - Photo Simon Beros minimaliste OU SVG signature
  - Bio 2-3 phrases display 17-19px
  - Horaires mono `Lun-Ven · 09h-18h · Paris UTC+1`
  - Contact direct mono `bonjour@waimia.fr` + `+33 6 ...` (cliquables, accent terracotta hover)
  - Calendar embed minimal (si Cal.com / Calendly)
- **Validation post-submit** : redirect `/bienvenue/contact` éditorial

**Patterns à appliquer** :
- Aucune card · uniquement hairlines
- Boutons primary noir + ghost (CTA hiér.)
- Schema.org `ContactPoint` complet
- ESP integration côté API `/api/contact.ts` (déjà existant)

### Brief P-02 · `/404.astro`

**Objectif perception** : "erreur élégante de magazine", pas "404 générique".

**Structure cible** :
- Kicker `Erreur 404 · Page introuvable`
- H1 display 96-120px italique "Cette page n'existe pas." / "This page doesn't exist."
- Sous-titre éditorial 1-2 phrases ("Soit l'URL est erronée, soit on a déplacé la page. Voici quatre points d'entrée pour repartir.")
- 4 portes d'entrée mono table : `→ Atlas` `→ Solutions` `→ Cas` `→ Contact` avec hairlines verticaux
- Footer mono `Code: 404 · Last archived: <date>`

### Brief P-03 · `/archive.astro`

**Objectif** : page d'archives éditoriale, style **NYT 1851 archives** / Substack archive.

**Structure cible** :
- Hero kicker `Archives · 2024-2026`, H1 "Tout ce qu'on a publié"
- Timeline inversée par année · mois
- Chaque entry : `date mono | titre display | type tag | excerpt 1 ligne`
- Filtres mono col droite (par catégorie, par auteur, par année)

### Brief P-04 · `/agence/about.astro` (CRITIQUE — identité)

**Objectif** : page identité Waimia, style **interview FT / portrait The New Yorker**.

**Structure cible** :
- Hero kicker `À propos · Waimia`, H1 "Notre histoire" / "Our story" italique sur 1-2 mots, lede 2-3 phrases ouverture forte
- Acte I : Genèse · prose 2-3 paragraphes
- Acte II : L'équipe · table éditoriale `nom display | rôle | expertise mono`
- Acte III : Les chiffres · ProofBar (années existence, clients, % rétention)
- Acte IV : Convictions · 3-5 points éditoriaux avec hairlines (style manifesto.astro)
- Acte V : Contact / next steps · CTA + signature

### Brief P-05 · `/agence/methode.astro`

**Objectif** : page méthode Waimia, style **case study agency** + référence Atlas.

**Structure cible** :
- Hero kicker `Méthode · Waimia`, H1 "La méthode 4 piliers" italique, lede explicative
- Pour chaque pilier (Cartographier · Câbler · Orchestrer · Industrialiser) : section dédiée avec H2, prose + workflow SVG
- Acte final · CTA "Voir un audit en pratique" → /cas/*

### Brief P-06 · `/agence/governance.astro` + `/agence/trust-center.astro`

**Pattern** : voir Template 6 `TrustLegalTemplate` brief.

### Brief P-07 · `/agence/careers.astro`

**Objectif** : page recrutement éditoriale, style **The Pragmatic Engineer hiring**.

**Structure** :
- Hero kicker `Careers · Waimia · Paris`, H1 "Rejoindre Waimia" italique, lede mission
- Acte I : Pourquoi on recrute · prose éditoriale
- Acte II : Postes ouverts · table éditoriale `intitulé display | type | localisation mono | →`
- Acte III : Process · 4 étapes numérotées hairlines
- Acte IV : Conditions · ProofBar (salaire fork, remote, équipement, formation)
- Acte V : "Ce qu'on cherche / Ce qu'on ne cherche pas" 2-cols éditorial
- CTA : `mailto:careers@waimia.fr` + Notion form

### Brief P-08 · `/agence/design-system.astro`

**Objectif** : showcase interne du DS — page de référence pour designers/devs.

**Structure** :
- Hero kicker `Design System · Waimia · v1.0`
- Sections : Tokens (colors, fonts, spacing) · Atoms (Kicker, Button, etc.) · Molecules · Organisms · Templates
- Chaque section : exemple visuel + code snippet copy-paste

### Brief P-09 · `/cas/index.astro`

**Pattern** : voir Template 3 `ListIndexTemplate` brief — adapté pour cas client.

### Brief P-10 · `/solutions/index.astro`, `/offres/index.astro`, `/technologies/index.astro`

**Pattern** : Hub-style index NYT/FT, voir Template 5 `HubTemplate` brief.

### Brief P-11 · `/equipe/index.astro`

**Pattern** : index auteurs éditorial, similaire à /cas/index.

### Brief P-12 · `/ressources/index.astro`

**Pattern** : carrefour ressources style **Stratechery hub** :
- Hero : kicker `Ressources · Waimia`, H1 "Notes de terrain" italique, lede "On écrit ce qu'on apprend, lentement"
- 4 colonnes éditoriales :
  - Blog · 3-5 derniers articles
  - Cookbooks · 3-5 derniers cookbooks
  - Livres blancs · 2-3 derniers
  - Veille IA · 3-5 dernières veilles
- Newsletter signup mono minimal

### Brief P-13 · `/ressources/academy.astro` + `/ressources/changelog.astro`

**Academy** : page formation/parcours · table éditoriale modules numérotés
**Changelog** : timeline mono version · date · changes (style GitHub releases mais éditorial)

### Brief P-14 · /secteurs/* (5 pages)

**Pattern** : adapter SolutionsDetailTemplate ou créer template dédié `SecteurTemplate` :
- Hero : kicker `Secteur · ${secteur}`, H1 + lede
- Acte I : Le contexte du secteur (pain points)
- Acte II : Comment l'IA aide concrètement
- Acte III : 2-3 cas clients du secteur
- Acte IV : Stack recommandée
- CTA : `/contact?sector=${slug}`

**Note critique** : `/secteurs/industrie.astro` a une syntax error ligne 105 (détecté via astro check) — **fix prioritaire**.

### Brief P-15 · /en/* (sync versions EN)

Pour chaque page FR refactorée, vérifier que la version EN :
- Existe (si attendue dans `lang === 'en'` mappings)
- Contient le copy EN équivalent
- Utilise les mêmes composants
- A le hreflang correct

---

## Roadmap

### Phase 1 · Foundations (Sonnet) — 4h estimé

**Cibles** : pages utilitaires critiques + fix syntax.

| # | Page | Action | Worker |
|---|---|---|---|
| 1 | `/secteurs/industrie.astro` | Fix syntax error ligne 105 | Opus (micro-fix) |
| 2 | `/contact.astro` | Refactor complet brief P-01 | Sonnet (200 turns) |
| 3 | `/404.astro` | Refactor brief P-02 | Sonnet (100 turns) |
| 4 | `/archive.astro` | Refactor brief P-03 | Sonnet (150 turns) |

### Phase 2 · Templates restants (Sonnet) — 6h estimé

**Cibles** : 11 templates non touchés. Refactor chacun + audit consumers.

| # | Template | Pages | Worker |
|---|---|---|---|
| 5 | CaseStudyTemplate | 5 cas | Sonnet (300 turns) |
| 6 | EssayTemplate | 8 articles | Sonnet (300 turns) |
| 7 | ListIndexTemplate | 3 index | Sonnet (200 turns) |
| 8 | LeadMagnetTemplate | 2 livres blancs | Sonnet (200 turns) |
| 9 | HubTemplate | 2 hubs | Sonnet (200 turns) |
| 10 | TrustLegalTemplate | 3 légaux | Sonnet (200 turns) |
| 11 | WelcomeTemplate | 5 confirmations | Sonnet (200 turns) |
| 12 | UtilityTemplate | 7 utilities | Sonnet (200 turns) |
| 13 | ServiceDetailTemplate | 2 (vérifier vs Offres) | Sonnet (150 turns) |
| 14 | DetailMenuTemplate | 1 audit-maturite | Sonnet (150 turns) |
| 15 | ConversionFunnelTemplate | 1 site-web-ia | Sonnet (200 turns) |

### Phase 3 · Pages identitaires (Sonnet) — 4h estimé

| # | Page | Brief |
|---|---|---|
| 16 | `/agence/about.astro` | P-04 |
| 17 | `/agence/methode.astro` | P-05 |
| 18 | `/agence/careers.astro` | P-07 |
| 19 | `/agence/design-system.astro` | P-08 |

### Phase 4 · Hubs & index (Sonnet) — 3h estimé

| # | Page | Brief |
|---|---|---|
| 20 | `/ressources/index.astro` | P-12 |
| 21 | `/cas/index.astro` | P-09 |
| 22 | `/solutions/index.astro` | P-10 |
| 23 | `/offres/index.astro` | P-10 |
| 24 | `/technologies/index.astro` | P-10 |
| 25 | `/equipe/index.astro` | P-11 |

### Phase 5 · Content collections audit (Sonnet) — 3h estimé

Vérifier chaque collection `.md`/`.mdx` :
- Frontmatter complet (title, description, author, datePublished, tags, ogImage)
- Body prose éditorialement consistante
- Citations / sidenotes / pull-quotes ajoutés où pertinent

### Phase 6 · Sync EN (Sonnet) — 2h estimé

Pour chaque page FR refactorée, synchroniser version EN.

### Phase 7 · Performance + GEO audit (Opus + Lighthouse) — 2h estimé

- Lighthouse CI sur toutes les pages
- Schema.org validation (Schema.org Validator)
- hreflang validation
- LCP/CLS/FID benchmarks

### Phase 8 · QA finale (Opus) — 2h estimé

- Triangulation visuelle (screenshot Playwright si MCP fix)
- Cohérence DA inter-pages
- Liens cassés (link-check)
- Mise à jour de ce doc avec status final ✅

---

## Notes méthodo

### Pour chaque mission Sonnet

1. **Brief structuré** = contexte projet + extrait code prêt à coller + critères acceptation + budget turns
2. **Toujours préserver Props/Slots interface** = wrapper `renderSlot()` défensif (cf bug Offres)
3. **Toujours `?? ''` sur `Astro.slots.render(name)`** — sinon TypeError sur slot manquant
4. **NE PAS lancer tsc/build/test côté worker** — c'est Opus qui valide après
5. **Marker DONE** dans `/tmp/codex-missions/waimia-pages/${page}-DONE.md` avec diff résumé

### Patterns CSS réutilisables (extract dans `global.css` plutôt que duplicate)

- `.editorial-row` : grid hairlines `num | content | aside`
- `.editorial-faq` : dl asymétrique Q/R
- `.editorial-inline-list` : flex-wrap séparateurs `·`
- `.editorial-table` : table NYT/FT (composant déjà existant `EditorialTable.astro`)
- `.editorial-pullquote` : display 28-52px hairline gauche
- `.proof-row` : Instrument Serif accent + label sans

### Méta-bug détecté à corriger globalement

**Astro.slots.render() retourne undefined pour slot manquant** dans cette version d'Astro. Tous les templates qui ont des slots optionnels doivent utiliser :

```js
const renderSlot = async (name: string) => (await Astro.slots.render(name)) ?? '';
```

À auditer sur tous les templates avec slot dynamique.

---

## Tracking

| Phase | Estimation | Status | Date livraison |
|---|---|---|---|
| Session 2026-05-15 | — | ✅ 4 pages + 4 templates | 2026-05-15 |
| Phase 1 Foundations | 4h | ❌ Pending | — |
| Phase 2 Templates | 6h | ❌ Pending | — |
| Phase 3 Identité | 4h | ❌ Pending | — |
| Phase 4 Hubs | 3h | ❌ Pending | — |
| Phase 5 Content | 3h | ❌ Pending | — |
| Phase 6 EN sync | 2h | ❌ Pending | — |
| Phase 7 Perf+GEO | 2h | ❌ Pending | — |
| Phase 8 QA | 2h | ❌ Pending | — |
| **Total restant** | **26h** | — | — |

---

_Doc maintenu par l'orchestrateur Claude. Update après chaque vague._
