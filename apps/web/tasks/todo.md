# Todo

## T6.4 — 15 proof-points MDX + composant inline

- [x] Lire les règles, leçons, todo et vérifier le schéma `proofPoints`
- [x] Créer les 15 fichiers MDX dans `src/content/proof-points/`
- [x] Respecter les frontmatters exacts avec body vide pour chaque entrée
- [x] Créer `src/components/ui/molecules/ProofPointInline.astro` avec le contenu exact demandé
- [x] Créer le marker `/tmp/codex-missions/tier6-4-proof-points/DONE.md`
- [x] Vérifier hors build les fichiers créés et le composant
- [x] Ne pas lancer `astro check`, `npm run build` ni `git` conformément à la consigne

## T5.2 — 20 integrations MDX + pages /integrations

- [x] Lire les règles, leçons, todo, schéma `integrations` et patterns `glossaire`
- [x] Créer les 20 fichiers MDX demandés dans `src/content/integrations/`
- [x] Respecter les frontmatters exacts, slugs kebab-case, `publishedAt: 2026-05-16` et `tool_name`
- [x] Créer `src/pages/integrations/index.astro` et `src/pages/integrations/[slug].astro`
- [x] Créer `src/pages/en/integrations/index.astro` et `src/pages/en/integrations/[slug].astro`
- [x] Vérifier hors build les comptes de fichiers et contraintes de longueurs frontmatter
- [x] Créer le marker `/tmp/codex-missions/tier5-2-integrations/DONE.md`
- [ ] Validation orchestrateur : `astro check`, `npm run build`, `tsc` et `git` non lancés par consigne

## T4.5 — Knowledge-Base RAG-ready

- [x] Lire les règles, le schéma `knowledge-base`, `tasks/todo.md` et `tasks/lessons.md`
- [x] Vérifier le schéma `knowledge-base` dans `src/content.config.ts`
- [x] Créer les 10 entrées MDX demandées dans `src/content/knowledge-base/`
- [x] Respecter les frontmatters exacts, tags kebab-case et summaries 40-280 caractères
- [x] Rédiger les bodies en français avec sections chunk-friendly et liens `/glossaire/*` pertinents
- [x] Vérifier hors build les volumes de texte et le nombre de lignes par fichier
- [x] Ne pas lancer `astro check`, `npm run build`, `tsc`, ni modifier `src/content.config.ts`
- [x] Créer le marker `/tmp/codex-missions/tier4-5-knowledgebase/DONE.md`

## T4.3 — 5 prompts MDX + pages /agence/prompts

- [x] Lire les règles, leçons, todo et le pattern `src/pages/glossaire/index.astro`
- [x] Créer 5 fichiers MDX bilingues dans `src/content/prompts/`
- [x] Respecter les contraintes YAML multilignes, slugs, visibility et SEO
- [x] Créer `src/pages/agence/prompts.astro` et `src/pages/en/agence/prompts.astro`
- [x] Créer le marker `/tmp/codex-missions/tier4-3-prompts/DONE.md`
- [ ] Validation orchestrateur : `astro check`, `npm run build` et `git` non lancés par consigne
- [ ] Éventuelle suite : créer les routes détail prompt si la bibliothèque doit devenir navigable
- [ ] Éventuelle suite : brancher un filtre visibility/category si le volume dépasse 10 prompts

## V9-D-FR — Copywriting FR natif

- [x] Lire les règles, leçons et todo avant modification
- [x] Auditer les pages signature FR : home, manifeste, méthode, about
- [x] Réécrire les pages offres FR sans toucher les champs `*_en`
- [x] Améliorer les frontmatters FR disponibles dans `src/content/cases/*.mdx`
- [x] Vérifier les composants partagés `Hero`, `Manifesto`, `SixServices` et les constantes rendues
- [x] Préserver les bodies MDX et ne pas toucher `/en/*`
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V9DF-DONE.md`

## V9-M — Motion polish profond scroll-linked + micro-interactions

- [x] Lire les règles, leçons et todo avant modification
- [x] Enrichir `src/styles/scroll-reveal.css` avec `reveal-mask-up`, `reveal-split-letter`, `reveal-curtain`, `reveal-zoom-in` et `reveal-blur-clip`
- [x] Ajouter le split letter GSAP lazy et le parallax scroll-linked léger sur `[data-par]`
- [x] Ajouter les ViewTransitions nommées `hero-h1-*`, `hero-img-*` et `card-*` sur hubs/templates concernés
- [x] Enrichir `CursorDot`, underline liens, Button loading/hover et hover cards deliverable/cas/equipe
- [x] Préserver le pattern ScrollTrigger kill + réinit sur les 3 pages signature
- [x] Vérifier `prefers-reduced-motion` sur CSS et via Playwright
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V9M-DONE.md`

## V9-L — CRO copywriting + tunnel de conversion pages signature

- [x] Lire les règles, leçons et todo avant modification
- [x] Préserver le polish éditorial V8 sur les pages signature
- [x] Restructurer `/offres/site-web-ia` avec hero PAS, bénéfices, preuve Plateau, risk reversal et CTA fixe
- [x] Restructurer `/offres/growth-system-ia` avec pricing teaser, objection Activation IA et comparatif Avant Waimia / Avec Waimia
- [x] Adapter `/offres/infrastructure-ia` au ton ETI avec SLA, audit trail, gouvernance et mention ISO
- [x] Améliorer `/offres/conseil` avec comparateur services et arbre de décision
- [x] Ne pas toucher `/en/*` : aucune route `/en/offres/*` n'existe dans ce dépôt
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V9L-DONE.md`

## V9-A — Navigation interne + breadcrumbs + maillage cross-page

- [x] Créer `src/components/ui/molecules/Breadcrumb.astro`
- [x] Ajouter Breadcrumb aux templates Offres, Solutions, Technologies, CaseStudy, Essay et LeadMagnet
- [x] Ajouter les props optionnelles `caseTitle`, `breadcrumbItems`, `lang`, `relatedCasesData`, `relatedOffresData`, `breadcrumbLabel` et `relatedOffresLinks`
- [x] Résoudre `relatedCases` et `relatedOffres` dans `src/pages/ressources/blog/[...slug].astro`
- [x] Ajouter les blocs cross-collection Blog → Cas/Offres et CaseStudy → Offres
- [x] Corriger l’erreur `astro check` hors périmètre direct dans `src/pages/ressources/tag/[...slug].astro`
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V9A-DONE.md`

## V8-I — Migration SSG 12 pages `[...slug]` dynamiques

- [x] Migrer `src/pages/ressources/blog/[...slug].astro` en SSG via `getStaticPaths()`
- [x] Migrer `src/pages/ressources/cookbooks/[...slug].astro` en SSG via `getStaticPaths()`
- [x] Migrer `src/pages/ressources/livres-blancs/[...slug].astro` en SSG via `getStaticPaths()`
- [x] Migrer `src/pages/ressources/veille-ia/[...slug].astro` en SSG via `getStaticPaths()`
- [x] Migrer `src/pages/cas/[...slug].astro` en SSG via `getStaticPaths()`
- [x] Migrer `src/pages/equipe/[...slug].astro` en SSG via `getStaticPaths()`
- [x] Migrer `src/pages/secteurs/[...slug].astro` en SSG via `getStaticPaths()`
- [x] Migrer `src/pages/ressources/categorie/[...slug].astro` en SSG via props statiques agrégées
- [x] Migrer `src/pages/ressources/tag/[...slug].astro` en SSG via props statiques agrégées
- [x] Migrer `src/pages/ressources/silo/[...slug].astro` en SSG via props statiques agrégées
- [x] Migrer `src/pages/ressources/outils/[...slug].astro` en SSG, avec `[]` possible si collection vide
- [x] Migrer `src/pages/bienvenue/[...slug].astro` en SSG sur les pages `template: welcome`
- [x] Ne pas toucher `src/pages/[...slug].astro`
- [x] Ne pas toucher `src/pages/api/**`
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Vérifier le nombre de routes pré-rendues : 105
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V8I-DONE.md`

## V9-C — GEO structured data + llms.txt enrichi

- [x] Lire les leçons existantes avant modification
- [x] Ajouter les builders `buildService`, `buildOffer`, `buildArticle`, `buildHowTo` et `buildCollectionPage`
- [x] Injecter `Service` + `Offer` depuis `OffresDetailTemplate.astro` via `additionalJsonLd`
- [x] Renforcer le JSON-LD Article dans `EssayTemplate.astro`
- [x] Ajouter `additionalJsonLd` à `Base.astro`
- [x] Réécrire `public/llms.txt` avec pages signature, glossaire et stack technique bilingues
- [x] Vérifier que `astro.config.mjs` contient déjà le sitemap i18n FR/EN
- [x] Vérifier `public/llms.txt` > 1,2x la taille initiale
- [x] Vérifier avec `pnpm exec astro check`
- [ ] Vérifier avec `pnpm build` : bloqué hors périmètre par `src/pages/ressources/{categorie,tag,silo}/[...slug].astro` (`getResourceCollections is not defined` au prerender)
- [ ] Créer le marker `/tmp/codex-missions/waimia-v4/V9C-DONE.md` après build vert

## V8-D — Polish HubTemplate

- [x] Préserver l'interface `Props` publique de `HubTemplate.astro`
- [x] Préserver les slots `headline`, `lede`, `manifesto`, `catalog-meta`, `catalog` et `fit-headline`
- [x] Ajouter `reveal` au H1 et au lede du hero
- [x] Remplacer les stats hero par `KeyMetric`
- [x] Ajouter `Callout`, `DropCap` et `PullQuote` sans toucher les pages appelantes
- [x] Ajouter `reveal-stagger`, hairlines fortes et hover lift sur catalogue, fit et cards liées
- [x] Vérifier `/offres/conseil` et `/technologies/virtuoseos` en local
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Vérifier avec `git diff HEAD --stat`
- [x] Vérifier avec le grep `Callout|KeyMetric|DropCap|PullQuote|reveal|reveal-stagger|hairline-strong`
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V8D-DONE.md`

## V8-C — Polish ConversionFunnelTemplate

- [x] Préserver l'interface `Props` publique de `ConversionFunnelTemplate.astro`
- [x] Préserver les slots existants du funnel `/offres/site-web-ia`
- [x] Ajouter `reveal` au H1, au lede et au badge/meta hero
- [x] Convertir les étapes en `Timeline` verticale numérotée avec phase active
- [x] Intégrer `KeyMetric`, `Callout`, `PullQuote` et `Dingbat`
- [x] Ajouter proof points ROI en `reveal-stagger`
- [x] Ajouter comparaison avant/après en grille asymétrique
- [x] Conserver la FAQ CSS-only et le JSON-LD FAQPage existant
- [x] Préserver le formulaire POST `/api/devis`
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Vérifier avec `git diff HEAD --stat`
- [x] Vérifier avec le grep `Callout|KeyMetric|Timeline|PullQuote|Dingbat|reveal`
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V8C-DONE.md`

## V8-B — Polish LeadMagnetTemplate

- [x] Préserver l'interface `Props` publique de `LeadMagnetTemplate.astro`
- [x] Préserver les slots existants `headline`, `lede` et `extra`
- [x] Ajouter `reveal` au H1, au lede et à la prose slottée
- [x] Intégrer `Callout`, `KeyMetric`, `Timeline`, `DropCap`, `PullQuote` et `Dingbat`
- [x] Transformer le sommaire `toc` en `Timeline` verticale numérotée
- [x] Préserver le formulaire POST `/api/lead-magnet` et ses champs
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Vérifier avec `git diff HEAD --stat`
- [x] Vérifier avec le grep `reveal|reveal-stagger|Callout|KeyMetric|DropCap`
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V8B-DONE.md`

## V8-A — Polish TechnologiesDetailTemplate

- [x] Préserver l'interface `Props` publique de `TechnologiesDetailTemplate.astro`
- [x] Ajouter `reveal` au H1 et au lead du hero en conservant les triangles SVG
- [x] Intégrer `Callout`, `KeyMetric`, `EditorialTable`, `Timeline` et `Dingbat`
- [x] Ajouter les wrappers `reveal-stagger`, hairlines et hover éditoriaux
- [x] Préserver les slots historiques et ajouter les alias demandés
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Vérifier avec le grep `reveal|reveal-stagger|Callout|KeyMetric`
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V8A-DONE.md`

## V5-E — Polish hubs restants

- [x] Ajouter `reveal` aux H1 de `offres/index.astro` et `solutions/index.astro`
- [x] Ajouter `CtaBand` et le hover bg à `equipe/index.astro`
- [x] Ajouter `reveal` et `CtaBand` aux hubs ressources `categorie`, `tag` et `silo`
- [x] Vérifier avec `git diff --stat` et les greps demandés
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V5E-DONE.md`
- [ ] Validation Opus : build / astro check non lancés par consigne V5-E

## V4-F3 — AuthorPageTemplate CV signature

- [x] Refactorer `src/components/templates/AuthorPageTemplate.astro` sans modifier les props publiques
- [x] Remplacer le placeholder photo par `PortraitSimon`
- [x] Ajouter hero 12 colonnes, pills hairline, essays enrichis, méthode SVG, curriculum Timeline, publications, sociaux SVG et CTA contact
- [x] Nettoyer `src/content/authors/simon-beros.mdx` pour éviter les doublons de sections désormais portées par le template
- [x] Corriger le typage `Timeline` bloquant dans `SolutionsDetailTemplate.astro`
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Vérifier `/equipe/simon-beros` en HTTP 200
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V4F3-DONE.md`

## V4-F2 — SolutionsDetailTemplate polish

- [x] Refactorer `src/components/templates/SolutionsDetailTemplate.astro` sans modifier les props publiques
- [x] Préserver Hero, footer Waimia et CTA final
- [x] Intégrer Timeline, KeyMetric, EditorialTable, Callout, Dingbat et SVG sectoriels
- [x] Ajouter grille 12 colonnes, eyebrows et scroll-reveal
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Tester les 8 pages secteurs/solutions en HTTP 200
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V4F2-DONE.md`

## V4-F1 — OffresDetailTemplate polish

- [x] Refactorer `src/components/templates/OffresDetailTemplate.astro` sans modifier les props publiques
- [x] Intégrer les composants éditoriaux Phase 1 dans le rendu template
- [x] Ajouter grille 12 colonnes, asymétrie, eyebrows et reveals
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Tester `/offres/growth-system-ia`, `/offres/application-ia-pme`, `/offres/infrastructure-ia` en HTTP 200
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V4F1-DONE.md`

## V4-E1 — SVG geometric

- [x] Créer `src/components/svg/geometric/MethodeProcessDiagram.astro`
- [x] Créer `src/components/svg/geometric/StackDiagram.astro`
- [x] Créer `src/components/svg/geometric/WorkflowScoring.astro`
- [x] Créer `src/components/svg/geometric/Dingbats.astro`
- [x] Créer `src/components/svg/geometric/WaimiaMark.astro`
- [x] Vérifier avec `pnpm exec astro check`
- [x] Vérifier avec `pnpm build`
- [x] Créer le marker `/tmp/codex-missions/waimia-v4/V4E1-DONE.md`

## V4-D — Scroll-reveal motion + hairline hover

- [x] Creer `src/styles/scroll-reveal.css`
- [x] Creer `src/lib/animations/scroll-reveal.ts`
- [x] Integrer l'import CSS et `initScrollReveal()` dans `src/layouts/Base.astro`
- [x] Verifier avec `pnpm exec astro check`
- [x] Verifier avec `pnpm build`
- [x] Verifier le rendu local via `curl -s http://localhost:4321/ | grep -c "scroll-reveal"`
- [x] Creer le marker `/tmp/codex-missions/waimia-v4/V4D-DONE.md`

## B9 — Skill claude-article-add

- [x] Créer `skills/article-add/SKILL.md`
- [x] Créer `skills/README.md`
- [x] Créer le marker `/tmp/codex-missions/waimia-v2/B9-DONE.md`
- [ ] Validation manuelle : copier ou symlinker le skill vers `~/.claude/skills/waimia-article-add/`

## M2 — Solutions horizontales

- [x] Créer `/solutions/acquisition-ia.astro`
- [x] Créer `/solutions/crm-relances-ia.astro`
- [x] Créer `/solutions/contenu-seo-geo-ia.astro`
- [x] Créer `/solutions/productivite-ia.astro`
- [x] Créer `/solutions/support-client-ia.astro`
- [x] Refondre `/solutions/index.astro`
- [x] Préserver les anciennes pages `solutions/finance.astro` et `solutions/fintech.astro`
- [ ] Validation Opus : lancer `tsc`, build ou dev selon le protocole externe à M2

## M3 — Offres

- [x] Créer `/offres/growth-system-ia.astro`
- [x] Créer `/offres/growth-intelligence.astro`
- [x] Créer `/offres/productivite-operationnelle-ia.astro`
- [x] Créer `/offres/activation-ia.astro`
- [x] Créer `/offres/infrastructure-ia.astro`
- [x] Refondre `/offres/index.astro`
- [x] Préserver les anciennes pages Offres existantes
- [ ] Validation Opus : lancer `tsc`, build ou dev selon le protocole externe à M3

## M4 — Home business-first

- [x] Refondre `src/pages/index.astro` en parcours compact : Hero, TrustMarquee, SixServices, Pyramid, Departments, Cases, FAQ, BookSession, SigBand
- [x] Recadrer `Hero.astro` en promesse PME + CTA `/contact` et `/offres/growth-system-ia`
- [x] Corriger `Departments.astro` : 5 cas d'usage, href `/solutions/*`, CTA secteur
- [x] Vérifier `FAQ.astro` : pas de compteur « Sept questions » hardcodé
- [x] Recadrer `BookSession.astro` en diagnostic 45 minutes
- [x] Nettoyer les matches jargon visibles remontés par le grep M4
- [x] Créer le marker `/tmp/codex-missions/waimia-refactor/M4-DONE.md`
- [ ] Validation Opus : lancer `tsc`, build ou dev selon le protocole externe à M4

## B5 — Composants auteur articles

- [x] Créer `src/components/ui/molecules/AuthorByline.astro`
- [x] Créer `src/components/ui/molecules/AuthorCard.astro`
- [x] Injecter AuthorByline et AuthorCard dans `src/pages/cas/[...slug].astro`
- [x] Injecter AuthorByline et AuthorCard dans `src/pages/ressources/blog/[...slug].astro`
- [x] Injecter AuthorByline et AuthorCard dans `src/pages/ressources/cookbooks/[...slug].astro`
- [x] Injecter AuthorByline et AuthorCard dans `src/pages/ressources/livres-blancs/[...slug].astro`
- [x] Créer le marker `/tmp/codex-missions/waimia-v2/B5-DONE.md`
- [ ] Validation externe : build / tsc / dev non lancés par consigne B5

## B4 — Migration refs author

- [x] Migrer les schémas `blog`, `cookbooks`, `livresBlancs`, `cases`, `veilleIA` vers `reference('authors')`.
- [x] Ajouter `contributors` avec défaut `[]` aux 5 collections signées.
- [x] Migrer `src/content/cases/plateau.mdx` vers `author: simon-beros`.
- [ ] Vérifier avec `pnpm exec astro check` : échoue hors périmètre B4 sur pages qui lisent encore `d.author.name` et doublon `allCases`.
- [x] Créer le marker `/tmp/codex-missions/waimia-v2/B4-DONE.md`.
