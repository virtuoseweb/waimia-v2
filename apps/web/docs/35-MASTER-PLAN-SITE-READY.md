# 35 — Master Plan Waimia « Site Ready »

**Auteur** : Codex (GPT-5)  
**Date** : 2026-05-17  
**Branche cible** : `feat/phase-1-design`  
**Périmètre** : `apps/web`  
**Sources obligatoires lues intégralement** : `docs/12`, `13`, `15`, `16`, `17`, `18`, `19`, `22`, `28`, `31`, `32`, `33`, `34`, `SESSION-HANDOFF-PHASE-1`

---

## Section 0 · Statut + critères « Site Ready »

### 0.1 · Statut réel au 17 mai 2026

La **Phase 1 Design est terminée** au sens du handoff courant : **9/9 batchs livrés** (`J`, `H`, `F`, `D`, `G`, `C`, `A`, `B`, `E1`). Le site a donc déjà fermé la première boucle critique de cohérence visuelle, de suppression de legacy évident et de verrouillage du design system.

Ce point est important : il ne faut **pas** réouvrir ces batchs comme si le chantier était encore au stade exploratoire. Le vrai travail restant n’est plus « faire un beau site ». Le vrai travail restant est :

1. **fermer la dette structurelle** encore ouverte dans le tracker ;
2. **terminer les routes, contenus et surfaces business** qui empêchent la mise en marché ;
3. **valider objectivement** la qualité finale avant d’attaquer communication, prospection et ventes.

### 0.2 · État synthétique du backlog

Lecture croisée `docs/16` + `docs/33` + handoff Phase 1 :

- **94 sous-tâches ouvertes** dans le tracker `docs/16-EXECUTION-TRACKER.md`
- **15 sous-tâches partielles** encore à fermer
- **57 pages environ** encore non auditées « Simon-grade 14 axes »
- **9 drifts de taxonomie/pages** encore actifs
- **64 % des pages** historiquement non auditées individuellement dans `docs/12`
- **19 consommateurs environ** encore actifs sur la famille legacy `CtaBand` hors templates
- **volume contenu majeur** encore à produire sur blog, cookbooks, field notes, livres blancs, produits, abonnements et école

En clair : le site est déjà **fort en perception** sur ses pages signature, mais il n’est pas encore **fermé en exploitation**. Il manque encore la seconde moitié du travail : fiabilité structurelle, couverture business, instrumentation, conversion et preuve finale. C’est exactement ce que ce master plan organise, sans rouvrir inutilement les arbitrages déjà tranchés.

### 0.3 · Définition opérationnelle « Site Ready »

Je fixe une définition **mesurable** et non ambiguë. Waimia est « Site Ready » uniquement quand les 14 gates ci-dessous sont vraies en même temps :

1. **100 % des pages prioritaires FR/EN sont auditées** selon les 14 axes Simon, avec statut mis à jour dans `docs/12`.
2. **Aucune page legacy doublon ne survit** face à une route dynamique équivalente.
3. **0 composant doublon actif** dans la cartographie `docs/31`, hors variants explicitement autorisés par `docs/34`.
4. **Design system showcase exhaustif** : tout composant global utilisé est exposé en FR et miroir EN, avec statut `stable / WIP / deprecated`.
5. **Lighthouse échantillon 10 pages** : performance `>= 95`, accessibilité `= 100`, SEO `= 100`, best practices `>= 95`.
6. **Core Web Vitals cibles atteintes** sur l’échantillon : `LCP < 1,2 s`, `INP < 200 ms`, `CLS < 0,05`.
7. **Bundle JS initial <= 60 KB gzip** sur les pages signature et les hubs principaux.
8. **Rendering final cohérent** : `output: 'static'` pour le site éditorial, ISR seulement sur les hubs utiles, SSR limité aux `api/*` et fonctions minimales Vercel.
9. **Schema.org complet et validé** pour 100 % des pages applicables : `Article`, `BreadcrumbList`, `Service`, `Offer`, `Course`, `Product`, `FAQPage`.
10. **Contenu live sur 100 % des routes business** : offres, solutions, cas, ressources, glossaire, comparer, intégrations, école, commerce, bienvenue.
11. **Infrastructure conversion fonctionnelle** : formulaires typés, redirects, ESP, anti-spam, quiz, A/B infra, Stripe Payment Links et Customer Portal.
12. **Telemetry active** : Vercel Analytics, Speed Insights, Sentry, et observabilité minimale des composants globaux.
13. **Tests e2e + QA finale** : Playwright sur 20 pages critiques, validation visuelle, validation liens, preview Vercel verte.
14. **Lock de gouvernance actif** : CI qui refuse un composant global non showcasé, docs `19`/`28`/`35` synchronisés, workflow inter-sessions stabilisé.

---

## Section 1 · Backlog complet inventaire

### 1.1 · Lecture de pilotage

Le backlog ci-dessous est l’agrégation des 13 documents source, regroupée par familles pour éviter l’effet « tracker illisible ». Chaque ligne garde :

- la **source documentaire** ;
- un **effort réaliste** ;
- les **dépendances** ;
- le **résultat attendu**.

### 1.2 · Tier 14 restant — fermeture design system / rendering

| ID | Reste à faire | Source | Effort | Dépendances |
|---|---|---|---|---|
| T14.2e | Migrer `output: 'server'` vers `output: 'static'` | `docs/16` | 3-5 h | Phase 1 Design déjà close ; route matrix validée |
| T14.2f | Auditer toutes les pages sans `prerender` et décider SSG / ISR / SSR | `docs/16`, `22` | 3-4 h | T14.2e |
| T14.2g | Configurer ISR sur hubs réellement collection-driven | `docs/16`, `13` | 2-3 h | T14.2f + migration hubs |
| T14.2h | Valider preview Vercel sans régression sur 119 pages | `docs/16` | 2-3 h | T14.2e/f/g + build vert |
| T14.3b | Diff showcase `/agence/design-system` vs cartographie réelle | `docs/16`, `20`, `31` | 2 h | aucun |
| T14.3d | Compléter showcase FR + EN avec composants manquants | `docs/16`, `20`, `31` | 5-8 h | T14.3b |
| T14.3e | Marquer chaque composant `stable / WIP / deprecated` | `docs/16`, `19`, `31` | 2-3 h | T14.3d |
| T14.3g | Auditer tous les `client:load|idle|visible` et justifier chaque island | `docs/16`, `28`, `29` | 2-3 h | aucun |
| T14.3h | Snapshots Playwright des composants critiques | `docs/16`, `28` | 3-4 h | T14.3d/e |
| T14.4a | Audit des `style="..."` inline | `docs/16` | 1-2 h | aucun |
| T14.4b | Audit des valeurs hardcodées (`px`, hex) | `docs/16`, `28` | 2 h | aucun |
| T14.4c | Créer `docs/30-CSS-COHERENCE-AUDIT.md` | `docs/16` | 2 h | T14.4a/b |
| T14.4d | Refactor des violations CSS vers tokens | `docs/16`, `28` | 4-6 h | T14.4c |
| T14.5a | Lister tous les composants utilisés sur home + 12 templates | `docs/16`, `31`, `32` | 2 h | aucun |
| T14.5b | Mapper chaque composant à sa section showcase | `docs/16`, `20` | 2 h | T14.5a |
| T14.5c | Compléter le showcase avec les manquants | `docs/16`, `20` | 3-5 h | T14.5b |
| T14.5d | Verrouiller la règle « tout composant global doit être showcasé » | `docs/16`, `28` | 1 h | T14.5c |
| T14.5e | Mettre en place le hook / CI qui refuse un composant non showcasé | `docs/16`, `28` | 2-3 h | T14.5d |

### 1.3 · Tier 13 restant — QA finale

| ID | Reste à faire | Source | Effort | Dépendances |
|---|---|---|---|---|
| T13.1 | Fermer la dette `astro check` restante, notamment la dépréciation Zod v4 | `docs/16` | 2-4 h | aucun |
| T13.3 | Lighthouse sur 5 puis 10 pages échantillon | `docs/16`, `22` | 3-4 h | rendering final |
| T13.4 | Schema.org validator complet | `docs/16`, `28` | 2-3 h | builders finalisés |
| T13.7 | Triangulation visuelle Simon | `docs/16` | 2-3 h | snapshots disponibles |
| T13.8 | Mettre `docs/12` à jour avec statuts finaux | `docs/16`, `12` | 2-3 h | audits pages terminés |
| T13.9 | Preview Vercel finale + push | `docs/16` | 1-2 h | build, tests, perf OK |
| T13.10 | Valider HTTP 200 sur 50+ URLs réelles | `docs/16`, `22` | 2 h | preview Vercel |

### 1.4 · Drifts pages / taxonomie à corriger

| Drift | Reste à faire | Source | Effort | Dépendances |
|---|---|---|---|---|
| D1 | Supprimer les secteurs statiques legacy et basculer sur la route dynamique | `docs/33` | 2-4 h | contenu `secteurs` vérifié |
| D2 | Corriger `ressources/index` hardcodé et stale | `docs/33`, `13` | 3-5 h | hub collection-driven |
| D3 | Supprimer 9 pages statiques doublonnant des routes dynamiques | `docs/33`, `22` | 3-5 h | couverture MDX confirmée |
| D4 | Corriger `archive.astro` qui duplique `Header` + `Footer` | `docs/33` | 1 h | aucun |
| D5 | Supprimer `test-composable.astro` exposée en prod | `docs/33` | 0,5 h | aucun |
| D6 | Migrer `blog/index` de `FIELD_NOTES` statique vers `getCollection('blog')` | `docs/33` | 2-3 h | aucun |
| D7 | Rationaliser les hubs glossaire / comparer / intégrations | `docs/33`, `32` | 4-6 h | décision template hub taxonomique |
| D8 | Harmoniser la famille CTA finale cross-templates et pages directes | `docs/33`, `31`, `34` | 4-6 h | fermeture E2/E3 |
| D9 | Traiter la collision / ambiguïté routes École (`cours/[slug]` vs `[type]/[slug]`) | `docs/22`, `33` | 2-3 h | validation route canonique |

### 1.5 · Pépites sous-utilisées à propager

| Pépita | Propagation cible | Source | Effort | Dépendances |
|---|---|---|---|---|
| `ProofBar` / `ProofBarSection` | cas, conseil, revops, audit maturité | `docs/33`, `34` | 2-4 h | Batch preuves clos |
| `SystemArchitecture` | `agence/methode`, `offres/conseil`, `offres/revops` | `docs/33` | 2-3 h | refonte pages identitaires |
| `PersonaSwitcher` | `solutions`, `offres`, `ressources/personas` | `docs/33` | 2-4 h | A/B / persona infra |
| `TaxonomyMenu` | `ressources`, `blog`, `glossaire` | `docs/33` | 2-3 h | hubs taxonomiques |
| `AtlasConnections` | `agence/about`, `solutions/index` | `docs/33` | 1-2 h | pages identitaires |
| `ConversionFunnelTemplate` | offres à pricing explicite | `docs/33` | 3-5 h | conversion infra |
| `EditorialTable` | cas, trust-center, conseil | `docs/33` | 2-3 h | refonte templates concernés |

### 1.6 · Dette d’audit pages et couverture Simon-grade

| Reste à faire | Source | Effort | Dépendances |
|---|---|---|---|
| Auditer environ 57 pages encore non validées individuellement | `docs/12`, `33` | 20-30 h | templates et drifts stabilisés |
| Mettre à jour la matrix `docs/12` page par page | `docs/12` | 4-6 h | audits faits |
| Vérifier le miroir EN des pages critiques | `docs/12`, `16` | 6-8 h | FR stabilisé |

### 1.7 · Contenu manquant Tier 9

| Bloc contenu | Volume restant | Source | Effort | Dépendances |
|---|---|---|---|---|
| Pillar essays | 4 restants / 5 | `docs/16`, `13` | 12-20 h | cluster strategy fixée |
| Articles cluster | 20 visés ; au moins 14 explicitement manquants | `docs/16`, `13` | 20-30 h | pillars et taxonomie blog |
| Cookbooks | 4 restants | `docs/13`, `16` | 12-18 h | `EssayTemplate` figé |
| Field notes | 40-50 | `docs/13`, `16` | 25-35 h | workflow éditorial Simon |
| Livres blancs | 2 | `docs/13`, `16` | 12-20 h | `LeadMagnetTemplate` final |
| Produits MDX | 6 | `docs/13`, `16` | 6-10 h | commerce pages prêtes |
| Abonnements MDX | 6 | `docs/13`, `16` | 6-10 h | commerce pages prêtes |
| Entrées École | 5 au moins encore manquantes | `docs/13`, `16` | 8-12 h | routes École fixées |

### 1.8 · Conversion infrastructure Tier 6

| ID | Reste à faire | Source | Effort | Dépendances |
|---|---|---|---|---|
| T6.1a/c | Edge Config + `sections_variant_b` | `docs/15`, `16` | 3-4 h | middleware déjà en place |
| T6.2a/b/c | Quiz multi-step + collection `quizzes` + un quiz live | `docs/15`, `16` | 6-10 h | design forms stable |
| T6.3a/b/c | Collection `forms`, composant gated, 3 forms câblées | `docs/15`, `16` | 6-8 h | A11y/forms |
| T6.6 | ESP + séquences email | `docs/15`, `16` | 4-8 h | forms typés + provider choisi |
| BotID | Protection anti-spam des forms | demande user + logique Tier 6 | 2-3 h | forms finalisés |

### 1.9 · Routes et surfaces encore manquantes

| Route / surface | Source | Effort | Dépendances |
|---|---|---|---|
| `ressources/index` hub cross-collection | `docs/13`, `16`, `33` | 3-5 h | collections propres |
| `ressources/blog/[type]` | `docs/13`, `16` | 2-3 h | discriminator blog |
| MegaMenu Header | `docs/16` | 3-4 h | taxonomies stabilisées |
| 7 pages identitaires agence | `docs/12`, `16`, `33` | 10-16 h | templates / DS clos |
| welcome pages manquantes | `docs/13`, `16` | 4-6 h | WelcomeTemplate final |
| Stripe Customer Portal page | `docs/16` | 2 h | Stripe wiring |
| routes produits / abonnements / commerce finalisées | `docs/13`, `16` | 4-6 h | contenu commerce |
| `/lp/[slug]` | `docs/13`, `16` | 3-5 h | conversion infra |

### 1.10 · Performance, rendering, assets

| Sujet | Source | Effort | Dépendances |
|---|---|---|---|
| self-host fonts `T1.5b/c` | `docs/16` | 2-4 h | output static |
| migration `astro:assets` `T1.7` | `docs/16` | 2-4 h | inventaire images |
| bundle budget réel | `docs/15`, `16`, `28` | 2-3 h | build final |
| route matrix SSG / ISR / SSR | `docs/13`, `15`, `16` | 2-3 h | output static |

### 1.11 · Telemetry, monitoring, e2e

| Sujet | Source | Effort | Dépendances |
|---|---|---|---|
| Vercel Analytics | `docs/28` | 1 h | preview deploy |
| Speed Insights | `docs/28` | 1 h | preview deploy |
| Sentry | `docs/28` | 2-3 h | DS stable |
| Playwright 20 pages critiques | demande user + `docs/16` | 4-6 h | pages stables |
| CI « composant non showcasé refusé » | `docs/28`, `16` | 2-3 h | showcase exhaustif |

---

## Section 2 · Découpage Phases (vue stratégique)

### 2.1 · Recommandation de structure

Je compacte le chantier en **8 phases**. Rester sur 12 mini-phases diluerait le pilotage et recréerait le problème que tu veux justement éviter : trop de branches mentales, pas assez de fermeture opérationnelle. Les 8 phases ci-dessous absorbent toutes les demandes du mandat, y compris celles listées dans les docs historiques.

### 2.2 · Phases

| Phase | Objectif | Effort | Sessions | Dépendances | Critère de fin |
|---|---|---:|---:|---|---|
| **Phase 1 · Design Closure** ✅ | Fermer la dette Phase 1 Design et verrouiller le contrat | livré | 1 | — | 9/9 batchs livrés |
| **Phase 2 · Accessibilité** | Mettre le socle RGAA/WCAG 2.2 AA à niveau sur pages et forms | 10-15 h | 3 | Phase 1 | audit RGAA + corrections critiques + accessibilité forms/navigation OK |
| **Phase 3 · Performance & Rendering** | Passer en `static`, cadrer ISR, self-host fonts, assets, budget bundle | 12-18 h | 3 | Phase 2 | route matrix SSG/ISR/SSR validée, output static live, fonts/assets traités |
| **Phase 4 · SEO/GEO & Telemetry** | Boucler schema, hreflang, llms.txt, sitemap, OG, monitoring | 10-14 h | 3 | Phase 3 | builders validés, telemetry active, SEO sample vert |
| **Phase 5 · Pages, Routes & Drifts** | Corriger toutes les ruptures taxonomiques, pages identitaires, hubs et surfaces manquantes | 24-34 h | 7 | Phase 3 partiellement, Phase 4 pour JSON-LD | 0 drift critique restant, hubs et routes business alignés |
| **Phase 6 · Conversion Infrastructure** | Finaliser forms, quiz, A/B, Stripe, ESP, anti-spam | 14-20 h | 4 | Phase 2, 3, 4, 5 | parcours lead -> capture -> nurturing -> paiement testable |
| **Phase 7 · Content Surface** | Produire le minimum crédible de contenu live pour la vente | 40-60 h | 6 | Phase 5, 6 | surfaces contenu business non vides et interliées |
| **Phase 8 · QA Finale & Lock** | Audits Simon-grade, tests e2e, Lighthouse, CI, preview Vercel, décision « Site Ready » | 14-20 h | 3 | toutes phases précédentes | 14 gates « Site Ready » validées |

### 2.3 · Mapping avec les phases historiques proposées

- **Phase 2 A11y** correspond directement à ta proposition.
- **Phase 3 Performance** absorbe la migration `output: 'static'`, ISR et perf stricte.
- **Phase 4 SEO/GEO & Telemetry** fusionne l’ancien SEO/GEO + monitoring, car les deux partagent les mêmes preuves de sortie.
- **Phase 5 Pages, Routes & Drifts** absorbe pages identitaires, drifts doc 33, T14.3-5, باقی routes Tier 8.
- **Phase 6 Conversion** reprend l’ancien Tier 6.
- **Phase 7 Content** reprend l’ancien Tier 9.
- **Phase 8 QA & Lock** fusionne anciens audits Simon-grade pages, tests e2e, CI, clôture T13/T14 et décision de mise en marché.

---

## Section 3 · Découpage Sessions (vue tactique)

### 3.1 · Hypothèse de cadence

- **1 session = 3 à 5 h productives**
- **29 sessions restantes** après la session 01 déjà livrée
- **estimation totale** : ~95 à 135 h de travail réel

### 3.2 · Tableau des sessions

| ID | Phase | Objectif | Missions principales | Workers | Critère session achevée | Temps |
|---|---|---|---|---|---|---:|
| `session-01` | Phase 1 ✅ | Clore Phase 1 Design | 9 batchs DS livrés | Codex + Sonnet + Opus | Handoff Phase 1 écrit | fait |
| `session-02` | Phase 2 | Audit RGAA/WCAG des pages critiques | home, offres, contact, navigation, forms | Codex + Sonnet | backlog a11y priorisé avec preuves | 4 h |
| `session-03` | Phase 2 | Corriger landmarks, focus, ARIA, forms | header, mega menu, CTA, forms, breadcrumbs | Codex + Sonnet | 0 blocant clavier/screen reader sur pages critiques | 4 h |
| `session-04` | Phase 2 | Boucler contrastes, motion réduite, EN critique | contrastes, reduced motion, EN contact/offres | Codex | audit A11y clos | 3 h |
| `session-05` | Phase 3 | Préparer la bascule `output: 'static'` | matrice routes, prérequis SSG/ISR/SSR | Codex | plan de migration figé + fichiers cibles listés | 4 h |
| `session-06` | Phase 3 | Exécuter la migration static + routage | `astro.config`, routes, guards, preview locale doc | Codex + Sonnet | site éditorial en static sans régression fonctionnelle | 5 h |
| `session-07` | Phase 3 | Fonts, assets, bundle budget | self-host fonts, `astro:assets`, JS budget | Codex | fonts/asset pipeline propre + budget mesuré | 4 h |
| `session-08` | Phase 4 | Audit schema + breadcrumb + JSON-LD | offers, articles, courses, products | Codex | matrix schema complète et corrections ouvertes | 4 h |
| `session-09` | Phase 4 | Hreflang, sitemap, llms.txt, OG | meta, llms, sitemap, OG dynamiques | Codex + Sonnet | SEO/GEO technique propre sur sample | 4 h |
| `session-10` | Phase 4 | Telemetry et monitoring | Analytics, Speed Insights, Sentry | Codex | monitoring branché et documenté | 3 h |
| `session-11` | Phase 5 | Supprimer drift secteurs | legacy sectors -> dynamic route | Codex | 0 page secteur legacy active | 3 h |
| `session-12` | Phase 5 | Corriger `ressources/index` et taxonomie blog | hub collection-driven, `blog/index`, TaxonomyMenu | Codex + Sonnet | hub ressources non stale | 5 h |
| `session-13` | Phase 5 | Supprimer doublons statique/dynamique | cas, cookbooks, livres-blancs, blog | Codex | 0 route doublon restante | 4 h |
| `session-14` | Phase 5 | Refonte pages identitaires cœur | `agence/about`, `agence/methode` | Codex + Sonnet | 2 pages identitaires Simon-grade | 4 h |
| `session-15` | Phase 5 | Refonte trust + bienvenue | governance, trust-center, welcome pages | Codex | pages trust/welcome cohérentes | 4 h |
| `session-16` | Phase 5 | Pages identitaires restantes | careers, docs, prompts, design-system gaps | Codex | surface agence cohérente | 4 h |
| `session-17` | Phase 5 | Routes manquantes business | commerce, LP, mega menu, customer portal | Codex + Sonnet | surface routage business complète | 5 h |
| `session-18` | Phase 6 | Forms typed + anti-spam | collection `forms`, BotID/honeypot, redirects | Codex | forms critiques testables | 4 h |
| `session-19` | Phase 6 | Quiz + A/B infra | `quizzes`, variant B, scoring | Codex + Sonnet | quiz live + variant routing ready | 4 h |
| `session-20` | Phase 6 | Stripe + ESP + nurturing | payment links, portal, email sequences | Codex | capture -> nurture -> paiement parcourable | 5 h |
| `session-21` | Phase 6 | Guarantees/proof-points propagation | pages fortes + CTA/reassurance | Codex | proof system visible sur surfaces clés | 3 h |
| `session-22` | Phase 7 | Pillars 2 et 3 | acquisition, contenu/SEO/GEO | Opus + Codex | 2 pillars publiables | 5 h |
| `session-23` | Phase 7 | Pillars 4 et 5 | productivité, gouvernance | Opus + Codex | 2 pillars publiables | 5 h |
| `session-24` | Phase 7 | Clusters 1 | 6 à 8 articles cluster | Sonnet + Codex | premier lot cluster complet | 5 h |
| `session-25` | Phase 7 | Clusters 2 + field notes seed | 6 à 8 clusters + 10 field notes seed | Sonnet + Codex | volume éditorial crédible | 5 h |
| `session-26` | Phase 7 | Cookbooks + livres blancs | 2 cookbooks + 2 livres blancs | Opus + Codex | gated content crédible | 5 h |
| `session-27` | Phase 7 | Produits, abonnements, école | 6 produits, 6 abonnements, entrées école restantes | Sonnet + Codex | surface commerce/école non vide | 5 h |
| `session-28` | Phase 8 | Simon-grade audits pages lot 1 | 25-30 pages, screenshots, corrections | Codex + Sonnet | premier audit massif clos | 5 h |
| `session-29` | Phase 8 | Simon-grade audits pages lot 2 + Playwright | 25-30 pages, 20 pages e2e | Codex + Sonnet | couverture pages + e2e complète | 5 h |
| `session-30` | Phase 8 | Lighthouse, schema validator, CI, preview final | perf sample, CI lock, handoff go-to-market | Codex + Opus | décision « Site Ready » formalisée | 5 h |

---

## Section 4 · Briefs Missions prêts à lancer

### 4.1 · Sessions détaillées maintenant

Les **6 prochaines sessions** sont détaillées et leurs briefs sont matérialisés dans :

- `/tmp/codex-missions/sessions/session-02-a11y/`
- `/tmp/codex-missions/sessions/session-03-performance-static/`
- `/tmp/codex-missions/sessions/session-04-seo-geo/`
- `/tmp/codex-missions/sessions/session-05-drifts-cleanup/`
- `/tmp/codex-missions/sessions/session-06-pages-identitaires/`
- `/tmp/codex-missions/sessions/session-07-conversion-infra/`

### 4.2 · Résumé des missions par session

#### `session-02-a11y`

- `mission-01-audit-rgaa`
  - In-scope : `src/pages/index.astro`, `src/pages/offres/index.astro`, `src/pages/contact.astro`, `src/components/header/Header.astro`, `src/layouts/Base.astro`
  - Interdit : `src/content/**`, `docs/35-*`, `tests/**`
  - Acceptance : backlog RGAA priorisé par gravité, preuves clavier/landmarks/contrastes, 0 supposition
  - Budget : `180-220 turns`
- `mission-02-landmarks-focus-aria`
  - In-scope : header, footer, navigation, breadcrumbs, CTA icon-only, forms critiques
  - Interdit : pages de contenu hors audit
  - Acceptance : navigation clavier lisible, focus visibles, labels/ARIA explicites
  - Budget : `180 turns`
- `mission-03-contrast-motion-forms`
  - In-scope : `global.css`, `tokens.css`, motion opt-out, formulaires clés
  - Interdit : rendering/perf hors A11y
  - Acceptance : contrastes AA, `prefers-reduced-motion` couvert, forms critiques lisibles
  - Budget : `180 turns`

#### `session-03-performance-static`

- `mission-01-output-static`
  - In-scope : `astro.config.mjs`, routes `src/pages/**`
  - Interdit : `src/content/**`, copywriting
  - Acceptance : matrice SSG/ISR/SSR exécutée, `output: 'static'` ou équivalent final documenté, APIs préservées
  - Budget : `220 turns`
- `mission-02-route-matrix-isr`
  - In-scope : `ressources/index`, `archive`, taxonomies dynamiques, route matrix doc
  - Interdit : forms et contenu éditorial
  - Acceptance : chaque route classée `SSG/ISR/SSR` avec justification
  - Budget : `180 turns`
- `mission-03-fonts-assets-budget`
  - In-scope : fonts, `public/`, images statiques, imports `astro:assets`
  - Interdit : redesign des pages
  - Acceptance : fonts self-hosted, assets rationalisés, budget bundle mesuré
  - Budget : `200 turns`

#### `session-04-seo-geo`

- `mission-01-schema-breadcrumb-audit`
  - In-scope : `src/lib/jsonld/**`, templates détail/editorial, breadcrumb
  - Interdit : copy pages
  - Acceptance : matrix `Article / Service / Offer / Course / Product / FAQ / BreadcrumbList`
  - Budget : `200 turns`
- `mission-02-hreflang-sitemap-llmstxt`
  - In-scope : `public/llms.txt`, sitemap, hreflang, canonicals
  - Interdit : perf or forms
  - Acceptance : sample FR/EN propre, sitemap et llms cohérents
  - Budget : `180 turns`
- `mission-03-og-validator`
  - In-scope : `/api/og.png`, meta OG, validation schema
  - Interdit : redesign
  - Acceptance : aperçu social stable + validation schema sur échantillon
  - Budget : `160 turns`

#### `session-05-drifts-cleanup`

- `mission-01-secteurs-legacy`
  - In-scope : `src/pages/secteurs/**`, `src/content/secteurs/**`
  - Interdit : autres taxonomies
  - Acceptance : 0 secteur legacy hors route dynamique
  - Budget : `180 turns`
- `mission-02-ressources-index-hub`
  - In-scope : `src/pages/ressources/index.astro`, `src/pages/ressources/blog/index.astro`
  - Interdit : articles MDX
  - Acceptance : hubs alimentés par `getCollection`, 0 href stale
  - Budget : `220 turns`
- `mission-03-static-dynamic-doublons`
  - In-scope : pages cas/blog/cookbooks/livres-blancs doublonnées
  - Interdit : templates globaux hors minimum
  - Acceptance : liste doublons à zéro, routes dynamiques seules gardées
  - Budget : `200 turns`

#### `session-06-pages-identitaires`

- `mission-01-about-methode`
  - In-scope : `src/pages/agence/about.astro`, `src/pages/agence/methode.astro`
  - Interdit : commerce, forms, SEO infra
  - Acceptance : 2 pages Simon-grade, preuve visuelle avant/après
  - Budget : `220 turns`
- `mission-02-trust-governance-welcome`
  - In-scope : `TrustLegalTemplate`, pages trust, `WelcomeTemplate`, routes bienvenue
  - Interdit : Stripe, ESP
  - Acceptance : pages trust lisibles, welcomes uniformes et orientées next-step
  - Budget : `220 turns`
- `mission-03-agence-rest`
  - In-scope : `agence/careers`, `agence/docs`, `agence/prompts`, `agence/design-system`
  - Interdit : contenu long-form externe
  - Acceptance : surface agence non bancale, showcase à jour
  - Budget : `200 turns`

#### `session-07-conversion-infra`

- `mission-01-forms-typed-botid`
  - In-scope : `src/actions/**`, forms critiques, anti-spam
  - Interdit : perf/static
  - Acceptance : contact/newsletter/livre-blanc/audit typés, anti-spam opérationnel
  - Budget : `220 turns`
- `mission-02-quiz-ab`
  - In-scope : middleware variants, collection `quizzes`, page quiz
  - Interdit : contenu éditorial massif
  - Acceptance : quiz live + variant B testable
  - Budget : `200 turns`
- `mission-03-stripe-esp`
  - In-scope : payment links, portal, ESP sequences
  - Interdit : refonte pages identitaires
  - Acceptance : capture -> nurturing -> paiement testable sans trou
  - Budget : `220 turns`

### 4.3 · Sessions 08-10

Pour `session-08`, `session-09`, `session-10`, seuls des `README` placeholders sont créés pour l’instant. Le détail sera généré après les preuves des sessions 02-07, afin d’éviter le faux-précis sur des sessions encore dépendantes d’arbitrages techniques.

---

## Section 5 · Critères « Site Ready » mesurables

### Gates de sortie obligatoires

1. ✅ `docs/12` indique **100 % des pages auditées** en Simon-grade.
2. ✅ Échantillon 10 pages : **perf >= 95 / a11y 100 / SEO 100 / best >= 95**.
3. ✅ `docs/31` ne porte **aucun doublon actif** hors variants explicitement autorisés par `docs/34`.
4. ✅ **Bundle JS initial <= 60 KB gzip** sur home, offres, ressources et contact.
5. ✅ `LCP < 1,2 s`, `INP < 200 ms`, `CLS < 0,05` sur les pages testées.
6. ✅ **Schema.org validé** sur 100 % des pages applicables.
7. ✅ **Contenu live** sur toutes les routes business : offres, solutions, cas, ressources, glossaire, comparer, intégrations, école, commerce, bienvenue.
8. ✅ **Forms critiques fonctionnels** : contact, newsletter, livre-blanc, audit, devis.
9. ✅ **Stripe Customer Portal + Payment Links** testés sur preview.
10. ✅ **Vercel Analytics + Speed Insights + Sentry** actifs.
11. ✅ **Playwright** couvre au moins **20 pages critiques** avec screenshots exploitables.
12. ✅ **CI refuse un composant non showcasé** et garde la synchro docs/showcase.
13. ✅ **Sitemap + robots + llms.txt** à jour et vérifiés.
14. ✅ `docs/19` et `/agence/design-system` marquent clairement chaque composant `stable / WIP / deprecated`.

### Gate de décision commerciale

Le passage à la communication automatisée et à la prospection n’est autorisé que si les 14 points ci-dessus sont vrais **et** si :

- les parcours de conversion sont testables sans dette bloquante ;
- les pages identitaires ne renvoient pas une image « work in progress » ;
- la surface contenu minimale ne paraît pas vide ou incomplète.

---

## Section 6 · Workflow agent par session

### Procédure standard à appliquer à partir de maintenant

1. Lire `docs/SESSION-HANDOFF-CURRENT.md`.
2. Relire la session cible dans `docs/35-MASTER-PLAN-SITE-READY.md`.
3. Vérifier la branche active et, si multi-agents, ouvrir un worktree dédié.
4. Capturer des screenshots `before` des pages impactées dans `audit-snapshots/session-N/`.
5. Charger les briefs de `/tmp/codex-missions/sessions/session-NN/`.
6. Exécuter les workers avec scope strict par mission.
7. Vérifier immédiatement les garde-fous doc 28 : tokens only, A11y, showcase, no drift hors périmètre.
8. Restaurer tout changement out-of-scope avant validation.
9. Produire preuves empiriques : build, check, screenshots, tests, validator selon la phase.
10. Mettre à jour `docs/SESSION-HANDOFF-CURRENT.md`, `tasks/todo.md`, `tasks/lessons.md`, puis préparer le brief de la session suivante.

### Règles complémentaires

- Pas de nouveau chantier tant que la session courante n’a pas son **critère de fermeture**.
- Toute session qui touche un composant global doit aussi toucher le **showcase** ou son statut documentaire.
- Toute session qui touche un parcours business doit laisser une **preuve de bout en bout**.

---

## Section 7 · Roadmap calendaire

### Hypothèse de cadence

Hypothèse réaliste : **5 sessions par semaine**.  
Point de départ : **17 mai 2026**.  
Durée cible : **6 semaines** pour atteindre « Site Ready » sans sacrifier la rigueur.

### Gantt texte

| Fenêtre | Sessions | Objet |
|---|---|---|
| **17 mai 2026** | `session-01` | Phase 1 Design ✅ DONE |
| **Semaine du 18 mai 2026** | `session-02` à `session-05` | A11y + préparation perf |
| **Semaine du 25 mai 2026** | `session-06` à `session-10` | perf, rendering, SEO/GEO, telemetry |
| **Semaine du 1er juin 2026** | `session-11` à `session-15` | drifts, hubs, pages identitaires cœur |
| **Semaine du 8 juin 2026** | `session-16` à `session-20` | surfaces business restantes + conversion infra |
| **Semaine du 15 juin 2026** | `session-21` à `session-25` | propagation conversion + contenu massif lot 1 |
| **Semaine du 22 juin 2026** | `session-26` à `session-30` | contenu lot 2 + QA finale + lock + preview |

### Recommandation tranchée

Le bon ordre n’est **pas** de se jeter maintenant sur « toujours plus de contenu ». Ce serait retomber dans la croyance limitante « si je produis assez, la structure suivra ». Non.  

Le bon ordre est :

1. **sécuriser accessibilité + rendering + SEO/GEO de base** ;
2. **supprimer les drifts les plus humiliants** pour la perception de marque ;
3. **finaliser la conversion et le contenu** sur une structure déjà propre ;
4. **verrouiller par QA et CI** avant d’ouvrir le robinet acquisition.

Autrement dit : **site fiable d’abord, site bavard ensuite**.

---

*Document maître maintenu par Codex. Toute session future doit s’y raccrocher avant d’ouvrir un nouveau chantier.*
