# Waimia · Execution Tracker — Refactor 200h

> **Source de vérité unique** pour l'exécution discipline du refactor complet validé par Simon 2026-05-15.
> Aucune tâche n'est abandonnée. Aucune section n'est skippée tant qu'elle n'est pas ✅.
> Update à chaque livraison.

---

## 🎯 Mandat Simon (verbatim 2026-05-15)

> _« je valide tout mais assure toi qu'à la fin tout soit fait sans rien oublier et sans passer à autre chose alors qu'on aura pas tout fait »_

Tous les 5 axes stratégiques **VALIDÉS** :
1. ✅ `output: 'hybrid'` validé
2. ✅ Composable architecture AVANT SEO programmatique validé
3. ✅ Fusion collections (École, Commerce) validée
4. ✅ Delete 17 hardcoded → activate MDX validé
5. ✅ Tier 4 IA-first inclus dans le plan validé

---

## 📋 Inventaire complet par Tier (135 actions)

### TIER 1 · Quick wins (10h) — IMPACT IMMÉDIAT

- [ ] **T1.1** · `output: 'server'` → `'hybrid'` dans `astro.config.mjs`
- [ ] **T1.2a** · Git commit safety net AVANT delete hardcoded
- [ ] **T1.2b** · Delete 7 pages `/offres/{activation-ia,application-ia-pme,claude-cowork,growth-intelligence,growth-system-ia,infrastructure-ia,productivite-operationnelle-ia}.astro`
- [ ] **T1.2c** · Delete 8 pages `/solutions/{acquisition-ia,contenu-seo-geo-ia,crm-relances-ia,finance,fintech,productivite-ia,site-web-ia-pme,support-client-ia}.astro`
- [ ] **T1.2d** · Delete 2 pages `/technologies/{virtuoseos,claude-models}.astro`
- [ ] **T1.2e** · Validation 17 URLs rendent toujours 200 après delete (via MDX consumer)
- [ ] **T1.3** · Audit Lighthouse sur 5 pages échantillon (home, /offres/growth-system-ia, /atlas, /console, /ecole)
- [ ] **T1.4** · `BootSplash.tsx` React → CSS animation pure
- [ ] **T1.5a** · Fonts audit (subsets latin + latin-ext)
- [ ] **T1.5b** · Fonts preload Instrument Serif 400 (H1 critical)
- [ ] **T1.5c** · Fonts woff2 only (drop woff fallback si présent)
- [ ] **T1.6a** · Vercel OG endpoint `/api/og.png` créé
- [ ] **T1.6b** · OG image dynamique sur 4 templates principaux (Hero, Offres, Solutions, Cases)
- [ ] **T1.7** · Astro `<Image>` audit + migration images statiques restantes vers `astro:assets`

### TIER 2 · Composable architecture (31h) — DÉBLOQUE TOUT LE RESTE

- [ ] **T2.1a** · Définir 15-20 section schemas Zod dans `src/content.config.ts` (discriminated union)
- [ ] **T2.1b** · Extract section schemas vers `src/schemas/sections.ts` (séparation concerns)
- [ ] **T2.1c** · Type `SectionData = z.infer<typeof sectionSchema>` exporté
- [ ] **T2.2a** · Créer `src/components/sections/HeroSplit.astro`
- [ ] **T2.2b** · Créer `src/components/sections/HeroCentered.astro`
- [ ] **T2.2c** · Créer `src/components/sections/HeroFullBleed.astro`
- [ ] **T2.2d** · Créer `src/components/sections/ProofBar.astro`
- [ ] **T2.2e** · Créer `src/components/sections/StatBlock.astro`
- [ ] **T2.2f** · Créer `src/components/sections/SocialProof.astro`
- [ ] **T2.2g** · Créer `src/components/sections/MethodTimeline.astro`
- [ ] **T2.2h** · Créer `src/components/sections/FeatureGrid.astro`
- [ ] **T2.2i** · Créer `src/components/sections/PricingTable.astro`
- [ ] **T2.2j** · Créer `src/components/sections/ComparisonTable.astro`
- [ ] **T2.2k** · Créer `src/components/sections/FaqAccordion.astro`
- [ ] **T2.2l** · Créer `src/components/sections/ObjectionHandler.astro`
- [ ] **T2.2m** · Créer `src/components/sections/CtaFinal.astro`
- [ ] **T2.2n** · Créer `src/components/sections/CtaBand.astro`
- [ ] **T2.2o** · Créer `src/components/sections/CtaInline.astro`
- [ ] **T2.2p** · Créer `src/components/sections/TestimonialBlock.astro`
- [ ] **T2.2q** · Créer `src/components/sections/GuaranteeBlock.astro`
- [ ] **T2.2r** · Créer `src/components/sections/TimelineBlock.astro`
- [ ] **T2.2s** · Créer `src/components/sections/MediaBlock.astro`
- [ ] **T2.3a** · Créer `src/components/sections/SectionsRenderer.astro` (mapping type → component)
- [ ] **T2.3b** · Registry `SECTION_REGISTRY` dans `src/lib/section-registry.ts`
- [ ] **T2.4a** · Migrer pilote `growth-system-ia.mdx` en `sections[]` array
- [ ] **T2.4b** · Valider rendu pilote HTTP 200 + visuel équivalent
- [ ] **T2.4c** · Refactor `OffresDetailTemplate.astro` pour utiliser `SectionsRenderer`
- [ ] **T2.5a** · Créer `/agence/design-system` page enrichie avec showcase sections
- [ ] **T2.5b** · 1 example per section variant dans le showcase

### TIER 3 · Fusion collections (13h)

- [ ] **T3.1a** · Créer schema `courses` discriminated union (`course_type: formation | parcours | atelier | certification`)
- [ ] **T3.1b** · Migrer 3 MDX formations → `content/ecole/courses/*` avec `course_type: 'formation'`
- [ ] **T3.1c** · Créer template polymorphe `CourseDetailTemplate.astro` (gère 4 types)
- [ ] **T3.1d** · Route `/ecole/[type]/[slug].astro` unifiée
- [ ] **T3.1e** · Update mega-menu pour pointer `/ecole/[type]/[slug]`
- [ ] **T3.1f** · Supprimer collections `formations`, `parcours`, `ateliers` du content.config.ts
- [ ] **T3.2a** · Créer schema `commerce` discriminated union (`commerce_type: product | subscription`)
- [ ] **T3.2b** · Créer templates `CommerceHubTemplate` + `CommerceDetailTemplate`
- [ ] **T3.2c** · Route `/commerce/[type]/[slug].astro` ou garder `/produits` + `/abonnements`
- [ ] **T3.2d** · Migrer 12 MDX produits/abonnements
- [ ] **T3.2e** · Supprimer collections `produits`, `abonnements`
- [ ] **T3.3a** · Étendre `blog.type` enum avec `'field-note'` et `'veille-ia'`
- [ ] **T3.3b** · Migrer 1 MDX `field-notes` → `blog/type:field-note`
- [ ] **T3.3c** · Migrer 1 MDX `veille-ia` → `blog/type:veille-ia`
- [ ] **T3.3d** · Supprimer collections `fieldNotes`, `veilleIA`
- [ ] **T3.4** · Renommer `solutions` → `usecases` (collection + routes + mega-menu)

### TIER 4 · AI-first collections (23h)

- [ ] **T4.1a** · Créer schema `personas` (slug, name, role, pain_points, decision_criteria, objections, proof_points, budget, timeline)
- [ ] **T4.1b** · Créer 3 personas exemples : CEO PME B2B · CTO scale-up · CMO mid-market
- [ ] **T4.1c** · Migrer `PersonaSwitcher` pour consommer la collection
- [ ] **T4.1d** · Page `/ressources/personas/[slug].astro` (pages SEO bonus)
- [ ] **T4.2a** · Créer schema `brand-voice` (singleton)
- [ ] **T4.2b** · Créer 1 entry brand-voice avec doctrine V5-V7 + typography FR + sample phrases
- [ ] **T4.2c** · Linter custom : warn si MDX utilise `forbidden_words`
- [ ] **T4.3a** · Créer schema `prompts` (name, purpose, system_prompt, variables, sample_output)
- [ ] **T4.3b** · Créer 5 prompts initiaux : audit-écran, copywriting-offre, persona-deduction, brand-checker, schema-generator
- [ ] **T4.3c** · Page `/agence/prompts` (interne ou public si décidé)
- [ ] **T4.4a** · Créer schema `pain-points` (slug, pain, severity, affected_personas, affected_secteurs, solution)
- [ ] **T4.4b** · Créer 12-15 pain-points cross-référencés personas × secteurs
- [ ] **T4.4c** · Composant `<PainPointInline />` réutilisable
- [ ] **T4.5a** · Créer structure `src/content/knowledge-base/` (MDX RAG-ready)
- [ ] **T4.5b** · Rédiger 10 entrées KB : méthode 4 piliers · doctrine V5-V7 · principes design · etc.
- [ ] **T4.5c** · Indexation embeddings (option future) — placeholder pour Pinecone/pgvector

### TIER 5 · SEO programmatique (30h)

- [ ] **T5.1a** · Créer schema `glossary` (term, definition, related_terms, examples)
- [ ] **T5.1b** · Rédiger 50 termes glossaire IA (worker Sonnet)
- [ ] **T5.1c** · Route `/glossaire/[slug].astro` + index `/glossaire/`
- [ ] **T5.2a** · Créer schema `integrations` (tool_name, vendor, category, use_cases, native_or_via_api)
- [ ] **T5.2b** · Rédiger 20 integrations (HubSpot, Salesforce, Pipedrive, Notion, Make, Zapier, etc.)
- [ ] **T5.2c** · Route `/integrations/[slug].astro` + index `/integrations/`
- [ ] **T5.3a** · Créer schema `comparisons` (slug_a, slug_b, dimension_comparison_array)
- [ ] **T5.3b** · Rédiger 10 comparaisons (claude-vs-gpt, n8n-vs-make, etc.)
- [ ] **T5.3c** · Route `/comparer/[slug-a]-vs-[slug-b].astro`
- [ ] **T5.4a** · Route `/ressources/tag/[slug].astro` (cross-collection filter)
- [ ] **T5.4b** · Route `/ressources/auteur/[slug].astro`
- [ ] **T5.4c** · Route `/ressources/archive/[YYYY-MM].astro`
- [ ] **T5.5a** · BreadcrumbList Schema.org audit sur toutes pages
- [ ] **T5.5b** · OG image dynamique par page (extension de T1.6)
- [ ] **T5.6** · Sitemap.xml extension : inclure toutes nouvelles routes

### TIER 6 · Conversion infrastructure (26h)

- [ ] **T6.1a** · A/B testing infrastructure Edge Config Vercel
- [ ] **T6.1b** · Middleware Astro pour assignation variant cookie
- [ ] **T6.1c** · Schema sections : `sections_variant_b?` optionnel
- [ ] **T6.2a** · Composant `<QuizMultiStep />` (React island justifié)
- [ ] **T6.2b** · Collection `quizzes` (questions, scoring, redirect_logic_by_score)
- [ ] **T6.2c** · 1 quiz exemple : "Maturité IA de votre PME en 3 minutes"
- [ ] **T6.3a** · Collection `forms` (fields, validation, esp_webhook, redirect)
- [ ] **T6.3b** · Composant `<LeadMagnetGated />` (form prefab + magnet trigger)
- [ ] **T6.3c** · Wire 3 forms : audit-booking · livre-blanc · newsletter
- [ ] **T6.4a** · Collection `proof-points` (datapoints réutilisables)
- [ ] **T6.4b** · Composant `<ProofPointInline />` + `<ProofPointHero />`
- [ ] **T6.4c** · Migrer 4 proof-points existants (+12h/sem, 4× ROI, etc.)
- [ ] **T6.5a** · Collection `guarantees` (promesses contractuelles)
- [ ] **T6.5b** · Composant `<GuaranteeBadge />` réutilisable
- [ ] **T6.5c** · 5 guarantees initiales (45 min audit, 100% remboursement 30j, etc.)
- [ ] **T6.6** · Email sequences ESP integration (Resend ou ConvertKit ou Mailerlite)

### TIER 7 · Templates restants Wave 6-12 (40h)

- [ ] **T7.1** · CaseStudyTemplate.astro refactor éditorial (5 cas)
- [ ] **T7.2** · EssayTemplate.astro refactor (blog/[type:essai])
- [ ] **T7.3** · ListIndexTemplate.astro refactor (blog/cookbooks/livres-blancs index)
- [ ] **T7.4** · LeadMagnetTemplate.astro refactor (livres-blancs)
- [ ] **T7.5** · HubTemplate.astro refactor (agence/methode + offres/conseil)
- [ ] **T7.6** · TrustLegalTemplate.astro refactor (governance + trust-center)
- [ ] **T7.7** · WelcomeTemplate.astro refactor (7 welcomes)
- [ ] **T7.8** · UtilityTemplate.astro refactor (404 + archive + docs)
- [ ] **T7.9** · ServiceDetailTemplate.astro (revops) — vérifier vs OffresDetailTemplate
- [ ] **T7.10** · DetailMenuTemplate.astro refactor (audit-maturite-ia)
- [ ] **T7.11** · ConversionFunnelTemplate.astro refactor (site-web-ia)
- [ ] **T7.12** · ParcoursDetailTemplate.astro + AtelierDetailTemplate.astro (Tier 3 fusion les remplace si courses unified)

### TIER 8 · Routes restantes Wave 4 (15h)

- [ ] **T8.1** · Refactor `/ressources/index.astro` en hub cross-collection
- [ ] **T8.2** · Route `/ressources/blog/[type].astro` (filter par type)
- [ ] **T8.3** · MegaMenu component intégré au Header.astro
- [ ] **T8.4** · Pages identitaires `/agence/{about,methode,careers,governance,trust-center,design-system,docs}`
- [ ] **T8.5** · 7 welcome pages routes (audit, contact, livre-blanc, newsletter, formation, produit, abonnement)
- [ ] **T8.6** · Route `/espace-client.astro` (Stripe Customer Portal)
- [ ] **T8.7** · Route `/produits/index.astro` + `/produits/[slug].astro`
- [ ] **T8.8** · Route `/abonnements/index.astro` + `/abonnements/[slug].astro`
- [ ] **T8.9** · Route `/lp/[slug].astro`

### TIER 9 · Contenu amorçage (30-50h)

- [ ] **T9.1** · 5 articles pillar essai (1 par cluster × 3000 mots)
- [ ] **T9.2** · 20 articles cluster (formation/notes/avis/post × 800-1500 mots)
- [ ] **T9.3** · 4 cookbooks techniques (×10-14 pages)
- [ ] **T9.4** · 40-50 field notes (×300-500 mots) — pipeline éditorial Simon
- [ ] **T9.5** · 4 cas clients narrés (Plateau enrich + Halcyon + Northbound + Caserne)
- [ ] **T9.6** · 2 livres blancs (AI Act readiness migré + Growth System Playbook nouveau)
- [ ] **T9.7** · 16 tunnels MDX restants (4 × 4 offres : growth-system, activation-ia, revops, application-ia-pme)
- [ ] **T9.8** · 6 produits MDX (audit-guide, kit-prompts, livre-blanc-premium, masterclass-replay, workbook, starter-pack)
- [ ] **T9.9** · 6 abonnements MDX (hosting Vercel, maintenance, monitoring, content production, CRM, support premium)
- [ ] **T9.10** · 8 entrées école : 5 formations + 2 parcours + 1 atelier (3/5 formations déjà livrées)

### TIER 10 · SVG custom (10h)

- [ ] **T10.1** · `WorkflowOrchestrationDiagram.astro`
- [ ] **T10.2** · `TunnelProgressDiagram.astro`
- [ ] **T10.3** · `TaxonomyGraphDiagram.astro`
- [ ] **T10.4** · `ArchiveTimelineDiagram.astro`
- [ ] **T10.5** · `CrossLinkingDiagram.astro`
- [ ] **T10.6** · `AuthorPortraitMonogram.astro`
- [ ] **T10.7** · `IndustryIconograms.astro` (4 secteurs)
- [ ] **T10.8** · `TechStackDiagram.astro`
- [ ] **T10.9** · `LeadFunnelDiagram.astro`
- [ ] **T10.10** · `KPIBarChart.astro` (data-driven paramétrable)
- [ ] **T10.11** · `MaturityScale.astro`
- [ ] **T10.12** · `EditorialHairlineSet.astro` (dingbats library)

### TIER 11 · Sync EN (5h)

- [ ] **T11.1** · Sync /en/ pages avec refactor FR (6 pages existantes)
- [ ] **T11.2** · /en/bienvenue/* 3 welcome pages
- [ ] **T11.3** · hreflang validation cross-pages
- [ ] **T11.4** · /sitemap-en.xml validation

### TIER 12 · ISR + Performance finale (3h)

- [ ] **T12.1** · ISR activé `/ressources/index` (TTL 1h)
- [ ] **T12.2** · ISR activé `/archive` (TTL 6h)
- [ ] **T12.3** · ISR activé `/ressources/tag/[slug]` (TTL 1h)
- [ ] **T12.4** · ISR activé `/ressources/auteur/[slug]` (TTL 6h)
- [ ] **T12.5** · Lighthouse final 95+ sur 5 pages échantillon
- [ ] **T12.6** · Bundle JS initial < 80 KB gzip vérifié
- [ ] **T12.7** · LCP < 1.5s sur home

### TIER 13 · QA finale (5h)

- [ ] **T13.1** · `pnpm exec astro check` : 0 errors
- [ ] **T13.2** · `pnpm build` succès complet
- [ ] **T13.3** · Lighthouse 5 pages échantillon (perf, a11y, SEO, best practices)
- [ ] **T13.4** · Schema.org validator sur Article/Service/FAQPage/Product/Course/BreadcrumbList
- [ ] **T13.5** · Liens cross-collection sans 404
- [ ] **T13.6** · Hreflang FR/EN consistency
- [ ] **T13.7** · Triangulation visuelle screenshots échantillon (Simon valide)
- [ ] **T13.8** · Update doc 12 statuses avec ✅ final
- [ ] **T13.9** · Commit + push final → Vercel deploy preview
- [ ] **T13.10** · Validation Vercel preview HTTP 200 sur 50+ URLs échantillon

---

## 📊 Compteur global

**Total actions** : 135 sous-tâches

| Tier | Actions | Status |
|---|---|---|
| Tier 1 | 14 | ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ |
| Tier 2 | 24 | ☐ × 24 |
| Tier 3 | 16 | ☐ × 16 |
| Tier 4 | 15 | ☐ × 15 |
| Tier 5 | 14 | ☐ × 14 |
| Tier 6 | 15 | ☐ × 15 |
| Tier 7 | 12 | ☐ × 12 |
| Tier 8 | 9 | ☐ × 9 |
| Tier 9 | 10 | ☐ × 10 |
| Tier 10 | 12 | ☐ × 12 |
| Tier 11 | 4 | ☐ × 4 |
| Tier 12 | 7 | ☐ × 7 |
| Tier 13 | 10 | ☐ × 10 |

**Progress** : 0 / 135 (0%)

---

## 🎬 Ordre d'exécution (sessions enchaînées)

### Session courante (2026-05-15, contexte 62%)

**Bloc immédiat (Opus, 1-2h)** :
- T1.1 → T1.2e (output hybrid + delete hardcoded + validation)
- T2.1a → T2.1c (section schemas Zod)

**Bloc parallèle Sonnet (en background, ~6h cumulé)** :
- Worker A : T2.2a-T2.2s (15-20 section components)
- Worker B : T2.3a-T2.3b (renderer)
- Worker C : T2.4a-T2.4c (migration pilote offres)

### Session next (post-reset Sonnet)

- T1.4 → T1.7 (BootSplash CSS, fonts, OG, images)
- Tier 3 fusion collections (4 workers parallèles)
- Tier 4 IA-first (3 workers)

### Session next +1, +2, etc.

- Tier 5 SEO programmatique
- Tier 6 Conversion
- Tier 7 templates restants
- Tier 8 routes restantes
- Tier 9 contenu (le plus long)
- Tier 10 SVG custom
- Tier 11 EN sync
- Tier 12 ISR + perf
- Tier 13 QA finale

---

## 📌 Règles d'exécution strictes

1. **Aucune tâche skip** — si une tâche bloque, marquer 🚧 et raison, ne PAS passer à la suivante
2. **Validation HTTP 200 après chaque livraison** — pas de "ça devrait marcher"
3. **Triangulation visuelle** sur pages critiques (Simon screenshot OK)
4. **Update tracker à chaque ☐ → ✅** dans cette session ET sessions suivantes
5. **Si bloqué quota** : compléter handoff dans doc 14 et continuer après reset

---

_Tracker maintenu par Claude Opus 4.7. Update obligatoire à chaque action complétée._
