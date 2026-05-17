# 32 — Templates Deep Audit

> Date : 2026-05-17  
> Mission : audit profond, lecture seule, des 19 templates `src/components/templates/` avant toute décision de refonte Phase 1 Design.  
> Écriture autorisée : ce document uniquement.

## 0. Sources et méthode

### Sources lues

- `docs/17-COMPONENTS-CARTOGRAPHY.md`
- `docs/18-DESIGN-SYSTEM-CARTOGRAPHY.md`
- `docs/19-DESIGN-SYSTEM-CLOSED.md`
- `docs/12-PAGES-QUALITY-TRACKING.md`
- `docs/16-EXECUTION-TRACKER.md`
- `docs/31-COMPONENTS-DOUBLONS-MAPPING.md` : **absent** au moment de l’audit

### Hypothèses et heuristiques

- `Pages consommatrices` : relevées par scan des imports réels dans `src/pages/**`.
- `LoC` : `wc -l` sur chaque template.
- `Tokens` : nombre de `var(--...)` trouvés dans le fichier.
- `Hardcoded` : occurrences `#hex`, `rgb(a)`, `hsl(a)` détectées dans le template.
- `Accessibilité` : score **heuristique** basé sur le volume de `role=` et `aria-*` :
  - `0` marqueur = `1/5`
  - `1` marqueur = `2/5`
  - `2` marqueurs = `3/5`
  - `3-4` marqueurs = `4/5`
  - `>= 5` marqueurs = `5/5`
- `Cohérence DA` :
  - `🟢` : contrat clair, forte cohérence avec le DS fermé, peu de hardcoded, surface canonique crédible
  - `🟡` : base exploitable mais dette structurelle, contrat incomplet ou spécialisation excessive
  - `🔴` : template legacy, doublon probable, dette visuelle/contractuelle trop forte

### Constat amont déjà documenté

- `docs/18` A.4.1 et A.4.2 montraient déjà une **adoption W6 quasi nulle en prod** côté pages/templates.
- `docs/19` B.0.2 fige la règle : **collections = templates cohérents**, **standalone = plus de variation autorisée**.
- `docs/16` T2.4c confirme que la migration composable côté `OffresDetailTemplate` a été **préparée mais non généralisée**.
- `docs/12` pointait déjà `CaseStudyTemplate`, `EssayTemplate`, `ListIndexTemplate`, `LeadMagnetTemplate`, `HubTemplate`, `TrustLegalTemplate`, `WelcomeTemplate`, `UtilityTemplate`, `ServiceDetailTemplate`, `DetailMenuTemplate`, `ConversionFunnelTemplate` comme **zone de refactor restante**.

## 1. Cartographie templates par usage

### 1.1 Tableau de synthèse

| Template | Pages consommatrices | Sections utilisées | Composants importés | Cohérence DA |
|---|---|---|---|---|
| `AuthorPageTemplate` | `equipe/[...slug].astro` | Aucune W6 directe | Editorial : `Callout`, `Timeline` | 🟢 |
| `CaseStudyTemplate` | `cas/[...slug].astro`, `cas/caserne.astro`, `cas/halcyon.astro`, `cas/northbound.astro`, `cas/plateau.astro`, `en/cas/[...slug].astro` | Aucune W6 directe | Organism : `CtaBand` · Molecules : `ProcessSteps`, `ProofBand`, `TechPillRow`, `Breadcrumb` · Editorial : `KeyMetric` | 🔴 |
| `ConversionFunnelTemplate` | `offres/site-web-ia.astro` | Aucune W6 directe | Molecules : `Breadcrumb`, `PricingTier`, `TechPillRow`, `RelatedCards` · Editorial : `Callout`, `KeyMetric`, `Timeline`, `PullQuote`, `Dingbat` | 🟡 |
| `CourseDetailTemplate` | `ecole/[type]/[slug].astro` | Aucune W6 directe | Molecules : `Breadcrumb` · Atoms : `Kicker` | 🟢 |
| `DetailMenuTemplate` | `offres/audit-maturite-ia.astro` | Aucune W6 directe | Organism : `CtaBand` · Molecules : `StatRow`, `ProcessSteps`, `ProofBand`, `TechPillRow`, `RelatedCards` | 🔴 |
| `EcoleHubTemplate` | `ecole/index.astro` | Aucune W6 directe | Atoms : `Kicker` | 🟡 |
| `EssayTemplate` | `en/ressources/blog/[...slug].astro`, `ressources/blog/[...slug].astro`, `ressources/blog/brain-circuit.astro`, `ressources/cookbooks/[...slug].astro`, `ressources/cookbooks/claude-cowork-rollout.astro`, `ressources/cookbooks/claude-skills-tutorial.astro`, `ressources/cookbooks/mcp-server-deploy.astro`, `ressources/outils/[...slug].astro`, `ressources/veille-ia/[...slug].astro` | Aucune W6 directe | Organism : `CtaBand` · Molecules : `RelatedCards`, `AuthorCard`, `Breadcrumb`, `TableOfContents`, `ShareButtons`, `RelatedByCluster`, `TagPills` | 🟡 |
| `FormationDetailTemplate` | `ecole/cours/[slug].astro` | Aucune W6 directe | Atoms : `Kicker` | 🔴 |
| `HubTemplate` | `offres/conseil.astro` | Aucune W6 directe | Organism : `CtaBand` · Molecules : `Breadcrumb`, `FitColumns`, `RelatedCards` · Editorial : `Callout`, `KeyMetric`, `DropCap`, `PullQuote` | 🟢 |
| `LeadMagnetTemplate` | `ressources/livres-blancs/[...slug].astro`, `ressources/livres-blancs/ai-act-readiness.astro` | Aucune W6 directe | Molecules : `Breadcrumb` · Editorial : `Callout`, `KeyMetric`, `Timeline`, `PullQuote`, `Dingbat` | 🟢 |
| `ListIndexTemplate` | `ressources/blog/index.astro`, `ressources/changelog.astro`, `ressources/cookbooks/index.astro` | Aucune W6 directe | Organism : `CtaBand` · Atoms : `Kicker` | 🔴 |
| `OffresDetailTemplate` | `[...slug].astro`, `offres/[...slug].astro`, `en/offres/[...slug].astro` | Aucune W6 directe dans le template ; **relais W6 possible au niveau page** via `SectionsRenderer` dans `offres/[...slug].astro` | Molecules : `Breadcrumb` · Editorial : `Callout`, `DropCap`, `PullQuote`, `KeyMetric`, `EditorialTable`, `Dingbat` | 🟢 |
| `ServiceDetailTemplate` | `offres/revops.astro` | Aucune W6 directe | Organism : `CtaBand` · Molecules : `ProcessSteps`, `ProofBand`, `TechPillRow`, `RelatedCards`, `StatRow` | 🔴 |
| `SolutionsDetailTemplate` | `[...slug].astro`, `solutions/[...slug].astro`, `en/solutions/[...slug].astro`, `secteurs/[...slug].astro` | Aucune W6 directe | Molecules : `Breadcrumb` · Editorial : `Callout`, `Timeline`, `KeyMetric`, `EditorialTable`, `Dingbat` | 🟢 |
| `TechnologiesDetailTemplate` | `[...slug].astro`, `technologies/[...slug].astro` | Aucune W6 directe | Molecules : `Breadcrumb` · Editorial : `Callout`, `KeyMetric`, `Timeline`, `EditorialTable`, `Dingbat` | 🟡 |
| `TrustLegalTemplate` | `agence/docs.astro`, `agence/governance.astro`, `agence/trust-center.astro` | Aucune W6 directe | Organism : `CtaBand` · Molecules : `Breadcrumb` · Atoms : `Bi`, `Kicker` | 🟡 |
| `TunnelStepTemplate` | `offres/[offre]/tunnel/[step].astro` | Aucune W6 directe | Aucun import UI partagé hors style inline | 🟡 |
| `UtilityTemplate` | `agence/about.astro`, `agence/careers.astro`, `agence/methode.astro`, `contact.astro`, `en/agence/about.astro`, `en/agence/methode.astro`, `en/contact.astro`, `ressources/academy.astro`, `ressources/livres-blancs/index.astro`, `ressources/veille-ia/index.astro` | Aucune W6 directe | Organism : `CtaBand` · Molecules : `Breadcrumb` · Atoms : `Kicker` | 🟡 |
| `WelcomeTemplate` | `bienvenue/[...slug].astro`, `bienvenue/audit.astro`, `bienvenue/contact.astro`, `bienvenue/livre-blanc.astro`, `bienvenue/newsletter.astro`, `en/bienvenue/audit.astro`, `en/bienvenue/livre-blanc.astro`, `en/bienvenue/newsletter.astro` | Aucune W6 directe | Atoms : `Kicker`, `Bi` | 🟡 |

### 1.2 Détails d’extraction par template

- `AuthorPageTemplate` : `1068 LoC` · props `author, essays, shortPosts, cookbooks, livresBlancs, veilleIA` · slot `default` · variants `aucun` · `148` tokens / `0` hardcoded / a11y `5/5` (`6` marqueurs). Profil auteur déjà riche, très fort en contrat éditorial, mais totalement hors trajectoire W6.
- `CaseStudyTemplate` : `482 LoC` · props `title, description, caseTitle, caseNum, specs, steps, proofQuote*, proofAttr*, proofMetrics, techPills, relatedCards, relatedOffresLinks, transitionSlug` · slots `headline, hero-image, context, approach-headline, approach-aside, stack-lead, body-end` · variant principal `steps` · `54` tokens / `2` hardcoded / a11y `4/5` (`3`). Structure narrative correcte, mais dépend encore du couple `ProcessSteps` + `ProofBand` + `CtaBand`.
- `ConversionFunnelTemplate` : `774 LoC` · props `title, description, funnelNum, heroStats, steps, tiers, techPills, proofQuote*, proofAttr*, proofMetrics, faq, relatedCards, slug, heroPrimaryHref, heroSecondaryHref, stickyCta*` · `16` slots nommés · variant principal `steps` + CTA sticky optionnel · `69` tokens / `1` hardcoded / a11y `3/5` (`2`). Bon niveau de polish éditorial, mais encore monolithique.
- `CourseDetailTemplate` : `694 LoC` · props `entry, lang` · slot `default` · variant **discriminé** par `course_type` (`formation`, `parcours`, `atelier`, `certification`) · `73` tokens / `21` hardcoded / a11y `1/5` (`0`). C’est le contrat école le plus moderne, malgré une couche de styles encore locale.
- `DetailMenuTemplate` : `228 LoC` · props `title, description, detailNum, parentKickerFr/En, annotation, steps, proofQuote*, proofAttr*, proofMetrics, techPills, relatedCards` · `9` slots nommés · variant principal `steps` · `15` tokens / `0` hardcoded / a11y `1/5` (`0`). Single-use, très legacy, trop proche de `ServiceDetailTemplate`.
- `EcoleHubTemplate` : `338 LoC` · props `formations, parcours, ateliers, lang` · aucun slot nommé · variant `lang` · `41` tokens / `14` hardcoded / a11y `1/5` (`0`). Spécialisation métier utile, mais shell isolé et peu mutualisable en l’état.
- `EssayTemplate` : `672 LoC` · props `title, description, kicker, date, author, readingTime, relatedCards, authorSlug, sources, image, datePublished, dateModified, canonical, category, tags, breadcrumbItems, lang, relatedCasesData, relatedOffresData, headings, cluster, articleId` · slots `headline, lede, hero-image, body` · variant `lang` + enrichissements SEO/GEO · `69` tokens / `2` hardcoded / a11y `3/5` (`2`). Contrat éditorial solide, mais architecture encore hors W6.
- `FormationDetailTemplate` : `485 LoC` · props `data, lang` · slot `default` · variant `lang` · `59` tokens / `18` hardcoded / a11y `1/5` (`0`). Legacy pur depuis que `CourseDetailTemplate` unifié existe.
- `HubTemplate` : `395 LoC` · props `title, description, hubNum, metaKickerFr/En, stats, fitYesTitle*, fitYesItems, fitNoTitle*, fitNoItems, relatedKicker*, relatedCards` · slots `headline, lede, hero-visual, manifesto, catalog-meta, catalog, fit-headline` · `39` tokens / `5` hardcoded / a11y `1/5` (`0`). C’est aujourd’hui le meilleur shell de hub riche.
- `LeadMagnetTemplate` : `434 LoC` · props `title, description, slug, kicker, format, publishedAt, toc, coverUrl, breadcrumbLabel, jsonLd` · slots `headline, lede, extra` · variant par `toc` et couverture optionnelle · `42` tokens / `0` hardcoded / a11y `5/5` (`7`). Contrat net, CTA/form maîtrisé, bon candidat canonique pour la famille gated.
- `ListIndexTemplate` : `87 LoC` · props `title, description, kicker` · slots `headline, lede, filters, list` · aucun variant réel · `5` tokens / `0` hardcoded / a11y `1/5` (`0`). Très léger, trop léger pour devenir un shell canonique.
- `OffresDetailTemplate` : `1489 LoC` · props `title, description, tier, tierLabel, meta, ctaHref, ctaLabel, additionalJsonLd, method_steps, deliverable_items, proof, problem_annotations, lead_fr/en, problem_statement_fr/en, method_aside_fr/en, deliverables_aside_fr/en, cta_title_fr/en, cta_body_fr/en` · `18` slots nommés · double mode **props structurées + slots MDX** · `234` tokens / `6` hardcoded / a11y `5/5` (`5`). Le shell le plus mûr du repo côté détail.
- `ServiceDetailTemplate` : `250 LoC` · props `title, description, serviceNum, problemStats, steps, proofQuote*, proofAttr*, proofMetrics, techPills, relatedCards` · slots `headline, lede, problem, approach-headline, approach-aside, deliverables, stack-lead` · variant `steps` · `16` tokens / `0` hardcoded / a11y `1/5` (`0`). Presque un sous-ensemble de `OffresDetailTemplate`.
- `SolutionsDetailTemplate` : `1231 LoC` · props `title, description, dept, deptLabel, meta, ctaHref, ctaLabel, pains, roi_metrics, stack, case_kicker, case_body_fr/en, case_cta_label_fr/en, case_results, cta_title_fr/en, cta_body_fr/en` · `19` slots nommés · double mode `props typed + slots legacy` · `151` tokens / `13` hardcoded / a11y `3/5` (`2`). Très proche d’un canon détail, mais encore trop autonome.
- `TechnologiesDetailTemplate` : `1001 LoC` · props `title, description, layer, layerLabel, layerType, showModels, showEcosystem, meta, ctaHref, ctaLabel, capabilitiesData, modelsData, integrationData, benchmarksData` · `18` slots nommés · variants `layerType`, `showModels`, `showEcosystem` · `106` tokens / `25` hardcoded / a11y `2/5` (`1`). Contrat riche, mais beaucoup de logique visuelle interne spécifique.
- `TrustLegalTemplate` : `239 LoC` · props `title, description, kickerFr/En, revisedAt, version, sections` · slots `headline, lede, footer-legal, sections` · variant TOC sticky via `sections` · `28` tokens / `0` hardcoded / a11y `4/5` (`3`). Contrat utile, mais encore couplé à `CtaBand`.
- `TunnelStepTemplate` : `334 LoC` · props `offre_slug, offre_label, step, progress_total, step_title_fr/en, description_fr/en, next_step, prev_step, cta_label_fr/en, cta_href, cta_variant, lang` · slot `default` · variants `step`, `cta_variant`, `lang` · `73` tokens / `1` hardcoded / a11y `3/5` (`2`). Spécifique et cohérent, sans doublon direct.
- `UtilityTemplate` : `119 LoC` · props `title, description, kicker, align, showCta, breadcrumb, jsonLd` · slots `headline, lede, body` · variants `align`, `showCta` · `5` tokens / `0` hardcoded / a11y `1/5` (`0`). Shell générique correct, mais pas assez déterministe pour servir de base à d’autres familles.
- `WelcomeTemplate` : `198 LoC` · props `title, description, kicker, nextSteps` · slots `headline, lede, foot` · variant `nextSteps` · `26` tokens / `0` hardcoded / a11y `2/5` (`1`). Shell transactionnel propre, à garder distinct du reste.

## 2. Doublons templates détectés

### 2.1 Tableau de synthèse

| Doublons | Intent commun | Variance | Décision proposée |
|---|---|---|---|
| `ServiceDetailTemplate` vs `OffresDetailTemplate` | Détail offre / service B2B narratif | `ServiceDetail` = page statique `revops`, plus pauvre ; `OffresDetail` = consumer MDX structuré + JSON-LD + slots riches | `OffresDetailTemplate` canonique · migration `ServiceDetail` recommandée |
| `CourseDetailTemplate` vs `FormationDetailTemplate` | Détail école | `CourseDetail` = union polymorphe 4 types ; `FormationDetail` = legacy formation-only | `CourseDetailTemplate` canonique · `FormationDetailTemplate` déprécié |
| `HubTemplate` vs `EcoleHubTemplate` vs `ListIndexTemplate` | Hub / index de collection | `Hub` = riche, `EcoleHub` = spécialisé catalogue, `ListIndex` = wrapper minimal | Garder `HubTemplate` comme base canonique ; rationaliser les deux autres |
| `DetailMenuTemplate` vs `OffresDetailTemplate` | Sous-page d’offre à forte densité narrative | `DetailMenu` = single-use, legacy molecules ; `OffresDetail` = shell détail le plus mature | `DetailMenuTemplate` ne doit pas grandir ; migration vers `OffresDetail` ou `SectionsRenderer` |

### 2.2 `ServiceDetailTemplate` vs `OffresDetailTemplate`

- **Pages provenance**
- `ServiceDetailTemplate` : `src/pages/offres/revops.astro`
- `OffresDetailTemplate` : `src/pages/offres/[...slug].astro`, `src/pages/en/offres/[...slug].astro`, `src/pages/[...slug].astro`
- Volume visible côté contenu : `8` fichiers `src/content/offres/*.mdx`

- **Comparatif qualité**
- Token-clean : `ServiceDetail` `16` vs `OffresDetail` `234`
- Accessibilité : `1/5` vs `5/5`
- Contrat : `7` slots côté service vs `18` slots + props structurées côté offres
- SEO : aucun builder côté service ; `buildOffer`, `buildService`, `additionalJsonLd` côté offres
- W6 readiness : aucune adoption directe des deux côtés, mais `OffresDetail` a déjà la **porte de sortie** via `SectionsRenderer` au niveau de `src/pages/offres/[...slug].astro`

- **Verdict canonique**
- Garder `OffresDetailTemplate`.

- **Critique visuelle**
- `OffresDetailTemplate` tient déjà mieux la promesse Simon : densité éditoriale, hiérarchie plus mature, surface de composition plus large, meilleure capacité à absorber pricing/FAQ/proof sans bricolage page-par-page.
- `ServiceDetailTemplate` ressemble à un ancien sous-ensemble figé d’un pattern qui a déjà évolué ailleurs.

- **Plan migration**
- Migrer `src/pages/offres/revops.astro` vers le contrat `OffresDetailTemplate`.
- Mapper `problemStats` → `problem_annotations`.
- Mapper `steps` → `method_steps`.
- Mapper `proofQuote*`, `proofAttr*`, `proofMetrics` → `proof`.
- Garder `RevOpsFunnel` dans un slot `deliverables` ou `body-end`.
- Si `revops` doit devenir une offre MDX canonique, la cible naturelle est `src/content/offres/revops.mdx` avec route `offres/[...slug].astro`.

### 2.3 `CourseDetailTemplate` vs `FormationDetailTemplate`

- **Pages provenance**
- `CourseDetailTemplate` : `src/pages/ecole/[type]/[slug].astro`
- `FormationDetailTemplate` : `src/pages/ecole/cours/[slug].astro`
- Volume visible : `3` cours live dans `src/content/ecole/courses/*.mdx`
- Archive visible : `3` anciennes formations dans `src/content/ecole/_archived_formations/*.mdx`

- **Comparatif qualité**
- `CourseDetailTemplate` porte déjà l’union `formation | parcours | atelier | certification`
- `FormationDetailTemplate` ne sait traiter qu’un seul mode historique
- `CourseDetailTemplate` expose `Breadcrumb` et un contrat unifié par `entry`
- `FormationDetailTemplate` reste une page de vente isolée, sans rôle canonique depuis `docs/16` T3.1c

- **Verdict canonique**
- Garder `CourseDetailTemplate`.

- **Critique visuelle**
- `CourseDetailTemplate` parle déjà le langage produit de l’École : type, niveau, format, date, CTA, contenu détaillé.
- `FormationDetailTemplate` garde un style plus old-school, moins modulable, et surtout ne justifie plus son existence structurelle.

- **Plan migration**
- Remplacer dans `src/pages/ecole/cours/[slug].astro` le rendu `FormationDetailTemplate` par `CourseDetailTemplate`.
- Décider ensuite si `/ecole/cours/[slug]` doit :
  - devenir une redirection vers `/ecole/formation/[slug]`
  - ou rester une alias route qui consomme le template canonique
- Sortir définitivement `FormationDetailTemplate` du chemin critique après bascule.

### 2.4 `HubTemplate` vs `EcoleHubTemplate` vs `ListIndexTemplate`

- **Pages provenance**
- `HubTemplate` : `src/pages/offres/conseil.astro`
- `EcoleHubTemplate` : `src/pages/ecole/index.astro`
- `ListIndexTemplate` : `src/pages/ressources/blog/index.astro`, `src/pages/ressources/changelog.astro`, `src/pages/ressources/cookbooks/index.astro`
- Fragmentation adjacente : `src/pages/ressources/livres-blancs/index.astro` et `src/pages/ressources/veille-ia/index.astro` sont déjà sortis de cette famille et utilisent `UtilityTemplate`

- **Comparatif qualité**
- `HubTemplate` : shell le plus fort narrativement, slots propres, related cards, fit matrix, macro-hiérarchie crédible
- `EcoleHubTemplate` : logique de catalogue métier utile, mais trop spécialisée et peu branchée au reste du système
- `ListIndexTemplate` : simple wrapper héro + liste ; utile pour aller vite, trop léger pour porter un standard DS fermé

- **Verdict canonique**
- Garder `HubTemplate` comme **base canonique** de la famille hub/index.
- Ne pas supprimer immédiatement `EcoleHubTemplate` ni `ListIndexTemplate`, mais les classer en rationalisation prioritaire.

- **Critique visuelle**
- `HubTemplate` est le seul des trois à poser une vraie structure éditoriale : hero, manifeste, catalogue, fit, related.
- `EcoleHubTemplate` a de bonnes primitives de catalogue, mais reste un îlot visuel.
- `ListIndexTemplate` n’a pas assez de matière pour garantir une qualité Simon homogène sur les index.

- **Plan migration**
- `ecole/index.astro` : recaster les catalogues dans `HubTemplate` via `catalog`, `catalog-meta`, `hero-visual`, éventuellement un mode `education`.
- `ressources/blog/index.astro`, `ressources/cookbooks/index.astro`, `ressources/changelog.astro` : basculer vers un shell hub/index plus dense.
- Harmoniser dans la même famille `ressources/livres-blancs/index.astro` et `ressources/veille-ia/index.astro`, aujourd’hui sur `UtilityTemplate`.

### 2.5 `DetailMenuTemplate` vs `OffresDetailTemplate`

- **Pages provenance**
- `DetailMenuTemplate` : `src/pages/offres/audit-maturite-ia.astro`
- `OffresDetailTemplate` : détail d’offre MDX + EN + placeholders catch-all

- **Comparatif qualité**
- `DetailMenuTemplate` : `228 LoC`, a11y `1/5`, `15` tokens, stack legacy `StatRow` + `ProcessSteps` + `ProofBand` + `CtaBand`
- `OffresDetailTemplate` : `1489 LoC`, a11y `5/5`, `234` tokens, props structurées, SEO schema, slots nombreux
- Le seul avantage distinctif de `DetailMenuTemplate` est la densité du canevas single-page et la logique de détail local

- **Verdict canonique**
- Si la page reste monolithique : garder `OffresDetailTemplate`.
- Si elle passe vraiment en composable : cible long terme = `SectionsRenderer`.
- Dans les deux cas, **ne pas investir davantage** dans `DetailMenuTemplate`.

- **Critique visuelle**
- `DetailMenuTemplate` n’apporte pas une direction artistique supérieure ; il apporte un raccourci historique.
- `OffresDetailTemplate` a déjà la grammaire visuelle plus crédible pour porter annotations, méthode, livrables, preuve, pricing, FAQ.

- **Plan migration**
- Option A : migrer `audit-maturite-ia.astro` vers `OffresDetailTemplate` en conservant les blocs custom dans slots.
- Option B : convertir la page en données `sections` et la laisser sortir du monde template via `SectionsRenderer`.
- Réintroduire la nav locale sticky comme comportement ou section dédiée, pas comme template autonome.

## 3. Coverage sections W6 dans les templates

### 3.1 Matrice exhaustive

Légende :

- `HS` = `HeroSplit`
- `HC` = `HeroCentered`
- `HFB` = `HeroFullBleed`
- `PB` = `ProofBarSection`
- `SB` = `StatBlock`
- `SP` = `SocialProof`
- `MT` = `MethodTimeline`
- `FG` = `FeatureGrid`
- `CT` = `ComparisonTable`
- `TLB` = `TimelineBlock`
- `MB` = `MediaBlock`
- `PT` = `PricingTable`
- `FAQ` = `FaqAccordion`
- `OH` = `ObjectionHandler`
- `CF` = `CtaFinal`
- `CB` = `CtaBandSection`
- `CI` = `CtaInline`
- `TB` = `TestimonialBlock`
- `GB` = `GuaranteeBlock`

| Template | HS | HC | HFB | PB | SB | SP | MT | FG | CT | TLB | MB | PT | FAQ | OH | CF | CB | CI | TB | GB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `AuthorPageTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `CaseStudyTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `ConversionFunnelTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `CourseDetailTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `DetailMenuTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `EcoleHubTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `EssayTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `FormationDetailTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `HubTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `LeadMagnetTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `ListIndexTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `OffresDetailTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `ServiceDetailTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `SolutionsDetailTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `TechnologiesDetailTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `TrustLegalTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `TunnelStepTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `UtilityTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `WelcomeTemplate` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.2 Lecture du constat

- **Adoption W6 au niveau template : `0/19`**.
- Le seul point d’entrée réel déjà branché est **hors template** : `src/pages/offres/[...slug].astro` et `src/pages/en/offres/[...slug].astro` peuvent court-circuiter `OffresDetailTemplate` vers `SectionsRenderer`.
- Les templates qui devraient absorber du W6 en priorité restent :
  - `OffresDetailTemplate`
  - `ServiceDetailTemplate`
  - `DetailMenuTemplate`
  - `CaseStudyTemplate`
  - `LeadMagnetTemplate`
  - `ConversionFunnelTemplate`
  - `HubTemplate`
  - `ListIndexTemplate`

### 3.3 Legacy qui pourrait être remplacé section par section

- `ProcessSteps` → `MethodTimeline`
- `ProofBand` / `StatRow` / `problemStats` → `ProofBarSection` + `StatBlock`
- `TechPillRow` / grilles maison → `FeatureGrid` ou `ComparisonTable` selon le contenu
- pricing inline ou `PricingTier` isolé → `PricingTable`
- FAQ HTML dédiée → `FaqAccordion`
- `CtaBand` organism → `CtaBandSection` ou `CtaFinal`

## 4. Patterns templates à figer

### 4.1 Famille `Detail`

Templates concernés : `OffresDetailTemplate`, `SolutionsDetailTemplate`, `TechnologiesDetailTemplate`, `ServiceDetailTemplate`, `DetailMenuTemplate`

- **Sections obligatoires**
- Hero avec breadcrumb + meta
- Problème / pains / annotation
- Méthode ou workflow
- Livrables / stack / capacité
- Proof / résultats
- CTA final
- JSON-LD

- **Sections optionnelles**
- FAQ
- Pricing
- Related cards
- Sticky local nav
- Benchmarks / tables / models

- **Slots standard cibles**
- `title`
- `lead`
- `hero-visual`
- `annotations`
- `method`
- `deliverables`
- `proof`
- `faq`
- `related`
- `cta`
- `body-end`

- **Props standard cibles**
- `title`, `description`, `kicker`, `label`, `meta`
- `ctaHref`, `ctaLabel`
- `annotations[]`, `steps[]`, `deliverables[]`, `proof`, `faq[]`
- `jsonLd`

- **Contrat figé à inscrire plus tard dans doc 28**
- Une seule coque canonique de détail.
- Les différences offre/solution/tech passent par la donnée, les slots et quelques flags, pas par cinq templates divergents.

### 4.2 Famille `Editorial`

Templates concernés : `EssayTemplate`, `LeadMagnetTemplate`, `CaseStudyTemplate`

- **Sections obligatoires**
- Hero
- Contexte ou TOC
- Body principal
- Bloc auteur / preuve / related
- CTA final
- Schema éditorial (`Article`, `Book`, `Report`, `Case`)

- **Sections optionnelles**
- Hero media
- Share
- Cluster related
- Download form
- Stack ou steps

- **Slots standard cibles**
- `headline`
- `lede`
- `hero-media`
- `context`
- `body`
- `extra`
- `related`

- **Props standard cibles**
- `title`, `description`, `kicker`, `date`
- `author`, `readingTime`
- `relatedCards`
- `jsonLd`
- `tags`, `sources`, `headings`

- **Contrat figé**
- Même colonne vertébrale éditoriale pour essai, lead magnet et case ; seules les briques métier changent.

### 4.3 Famille `Hub / Index`

Templates concernés : `HubTemplate`, `EcoleHubTemplate`, `ListIndexTemplate`

- **Sections obligatoires**
- Hero
- Meta catalogue
- Listing principal
- CTA ou related

- **Sections optionnelles**
- Filters
- Fit matrix
- Timeline index
- Empty state
- Hero visual

- **Slots standard cibles**
- `headline`
- `lede`
- `hero-visual`
- `catalog-meta`
- `catalog`
- `filters`
- `related`
- `fit-headline`

- **Props standard cibles**
- `title`, `description`, `kicker`
- `stats`
- `taxonomy`
- `relatedCards`

- **Contrat figé**
- `HubTemplate` devient la base de cette famille.
- `ListIndexTemplate` ne reste vivant que s’il devient un mode mince du shell canonique, pas un template autonome parallèle.

### 4.4 Famille `Utility / Transactionnel`

Templates concernés : `UtilityTemplate`, `WelcomeTemplate`, `TrustLegalTemplate`, `TunnelStepTemplate`

- **Sections obligatoires**
- Hero court
- Corps simple ou sections documentaires
- Action claire ou next step

- **Sections optionnelles**
- Breadcrumb
- Sticky TOC
- Form body
- Progress nav

- **Slots standard cibles**
- `headline`
- `lede`
- `body`
- `sections`
- `foot`

- **Props standard cibles**
- `title`, `description`, `kicker`
- `breadcrumb`
- `jsonLd`
- `nextSteps[]` ou `sections[]` selon le cas

- **Contrat figé**
- Garder la famille distincte.
- Objectif : simplicité et lisibilité, pas densité éditoriale forcée.

### 4.5 Famille `Education`

Templates concernés : `CourseDetailTemplate`, `FormationDetailTemplate`

- **Sections obligatoires**
- Hero
- Meta pédagogique
- Programme
- CTA

- **Sections optionnelles**
- Planning
- Certification
- Pricing
- Related courses

- **Contrat figé**
- `CourseDetailTemplate` uniquement.
- `FormationDetailTemplate` sort du contrat cible.

### 4.6 Famille `Conversion`

Templates concernés : `ConversionFunnelTemplate`, `TunnelStepTemplate`

- **Sections obligatoires**
- Hero
- Progression
- Proof
- CTA

- **Sections optionnelles**
- Pricing
- Demo
- FAQ
- Sticky CTA

- **Contrat figé**
- Conserver deux niveaux distincts :
  - landing flagship multi-section
  - étape de tunnel minimaliste

### 4.7 Famille `Author`

Template concerné : `AuthorPageTemplate`

- **Sections obligatoires**
- Hero biographique
- Méthode / trajectoire
- Publications
- Contact

- **Sections optionnelles**
- Portrait
- Curriculum
- Groupes de ressources

- **Contrat figé**
- Template standalone à part.
- Pas de fusion utile avec la famille éditoriale classique.

## 5. Recommandation Phase 1

### 5.1 Synthèse chiffrée

- Templates analysés : `19`
- Doublons fonctionnels détectés : `4` groupes
- Dépréciations quasi certaines : `2`
  - `FormationDetailTemplate`
  - `ServiceDetailTemplate`
- Fusions / rationalisations proposées : `3`
  - `DetailMenuTemplate`
  - `EcoleHubTemplate`
  - `ListIndexTemplate`
- Sections W6 sous-utilisées au niveau template : `19/19`
- Worker 1 / doc `31` : **non disponible**, donc pas de croisement component-level final sur les doublons legacy

### 5.2 Effort migration estimé

| Action | Pages / routes impactées | Risque | Lecture |
|---|---|---|---|
| `FormationDetailTemplate` → `CourseDetailTemplate` | `ecole/cours/[slug].astro` + `3` cours live visibles | Faible | Fusion la plus propre, déjà validée conceptuellement par `docs/16` T3.1c |
| `ServiceDetailTemplate` → `OffresDetailTemplate` | `offres/revops.astro` | Faible à moyen | Un seul point d’entrée, gros gain de cohérence |
| `DetailMenuTemplate` → `OffresDetailTemplate` ou `SectionsRenderer` | `offres/audit-maturite-ia.astro` | Moyen | Single-use, riche en contenu inline, mais isolé |
| `EcoleHubTemplate` + `ListIndexTemplate` vers shell hub canonique | `ecole/index.astro`, `ressources/blog/index.astro`, `ressources/cookbooks/index.astro`, `ressources/changelog.astro` | Moyen | Rationalisation de famille, pas suppression brutale |
| Pilotage W6 sur `offres` | `8` offres MDX + miroir EN | Moyen à fort | Meilleur levier, car la route supporte déjà `SectionsRenderer` |
| Alignement détail `solutions` / `technologies` | `8` solutions + `2` technologies + catch-all liés | Fort | À faire après validation du pattern canonique |

### 5.3 Ordre optimal d’attaque

1. `FormationDetailTemplate` → `CourseDetailTemplate`
2. `ServiceDetailTemplate` → `OffresDetailTemplate`
3. `DetailMenuTemplate` → `OffresDetailTemplate` ou `SectionsRenderer`
4. Rationalisation `HubTemplate` / `EcoleHubTemplate` / `ListIndexTemplate`
5. Migration W6 pilotée sur `offres/[...slug].astro`
6. Alignement `SolutionsDetailTemplate` et `TechnologiesDetailTemplate`
7. Relecture `CaseStudyTemplate`, `EssayTemplate`, `LeadMagnetTemplate`, `TrustLegalTemplate`, `WelcomeTemplate`, `UtilityTemplate` à la lumière du canon figé

### 5.4 Recommandation tranchée pour Opus

- **Ne pas commencer par supprimer des templates à l’aveugle.**
- Commencer par **2 fusions évidentes et peu risquées** :
  - `FormationDetailTemplate` → `CourseDetailTemplate`
  - `ServiceDetailTemplate` → `OffresDetailTemplate`
- Ensuite seulement, traiter le vrai chantier structurel : **faire d’`OffresDetailTemplate` le pont vers W6**, car c’est le seul endroit où le repo a déjà une bifurcation réelle vers `SectionsRenderer`.

### 5.5 Lien avec le futur doc 31

Quand `docs/31-COMPONENTS-DOUBLONS-MAPPING.md` sera disponible, il devra servir à confirmer ou invalider les sous-remplacements suivants :

- `ProcessSteps` → `MethodTimeline`
- `ProofBand` / `StatRow` → `ProofBarSection` + `StatBlock`
- `CtaBand` organism → `CtaBandSection` ou `CtaFinal`
- `PricingTier` isolé → `PricingTable`

Sans ce doc 31, le niveau template est déjà assez net pour trancher les familles canoniques, mais pas encore pour verrouiller chaque remplacement composant par composant.
