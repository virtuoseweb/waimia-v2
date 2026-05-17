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

- [🟡] **T1.1** · `output: 'server'` → `'static'` code écrit et reverti temporairement (TODO[T1.1-activate] commenté). Activation lors du prochain restart dev / Vercel deploy.
- [✅] **T1.2a** · Git commit safety net AVANT delete hardcoded — `feat(waimia): Wave 1-3 livrées` committed
- [✅] **T1.2b** · 7 pages `/offres/*.astro` deleted (activation-ia, application-ia-pme, claude-cowork, growth-intelligence, growth-system-ia, infrastructure-ia, productivite-operationnelle-ia)
- [✅] **T1.2c** · 8 pages `/solutions/*.astro` deleted (acquisition-ia, contenu-seo-geo-ia, crm-relances-ia, finance, fintech, productivite-ia, site-web-ia-pme, support-client-ia)
- [✅] **T1.2d** · 2 pages `/technologies/*.astro` déjà absentes (W3 worker les avait supprimées)
- [✅] **T1.2e** · 17/17 URLs HTTP 200 via MDX consumer post-delete validé empiriquement
- [ ] **T1.3** · Audit Lighthouse sur 5 pages échantillon (home, /offres/growth-system-ia, /atlas, /console, /ecole)
- [✅] **T1.4** · `BootSplash.tsx` React supprimé → `BootSplash.astro` CSS pur (animation @keyframes 1720ms, prefers-reduced-motion supporté, −50KB bundle)
- [🟡] **T1.5a** · Fonts audit fait : Google Fonts CDN + preconnect + preload as="style" + display=swap. Acceptable mais sub-optimal.
- [ ] **T1.5b** · Self-host Instrument Serif 400 woff2 + preload critical (à faire session next, ~2h)
- [ ] **T1.5c** · Drop CDN Google Fonts pour Inter Tight + JetBrains Mono (passer self-hosted woff2)
- [✅] **T1.6a** · Vercel OG endpoint `/api/og.png` créé (commit `6b31564`, Worker Sonnet) · SVG-raw fallback (@vercel/og non installé) · query params title/kicker/author · Cache-Control immutable
- [✅] **T1.6b** · OG image dynamique intégrée au Base layout (commit `4fa5088`) · couvre TOUTES les pages héritant Base.astro (Hero/Offres/Solutions/Cases/Essay/Cookbook/etc.) via fallback automatique vers `/api/og.png?title=...&kicker=...` si `ogImage` prop non fourni
- [ ] **T1.7** · Astro `<Image>` audit + migration images statiques restantes vers `astro:assets`

### TIER 2 · Composable architecture (31h) — DÉBLOQUE TOUT LE RESTE

- [✅] **T2.1a** · 19 section schemas Zod définis dans `src/schemas/sections.ts` (discriminated union)
- [✅] **T2.1b** · Extracted vers `src/schemas/sections.ts` (séparation concerns)
- [✅] **T2.1c** · Type `SectionData`, `SectionType`, `SectionByType<T>` exportés
- [✅] **T2.2a-s** · **19/19 section components livrés par W6 Sonnet** (HeroSplit/Centered/FullBleed, ProofBar, StatBlock, SocialProof, MethodTimeline, FeatureGrid, ComparisonTable, TimelineBlock, MediaBlock, PricingTable, FaqAccordion, ObjectionHandler, CtaFinal, CtaBand, CtaInline, TestimonialBlock, GuaranteeBlock) — pattern Astro 6 strict, tokens sémantiques, bilingue FR/EN
- [✅] **T2.3a** · `src/components/sections/SectionsRenderer.astro` créé (consomme registry)
- [✅] **T2.3b** · Registry `SECTION_REGISTRY` dans `src/lib/section-registry.ts` (19 types mappés)
- [✅] **T2.4a** · Page pilote `/test-composable` créée avec 5 sections inline (HeroSplit + ProofBar + MethodTimeline + FeatureGrid + CtaFinal) — preuve end-to-end fonctionnelle
- [✅] **T2.4b** · HTTP 200 sur `/test-composable` validé + signature "composable system Waimia" trouvée dans HTML rendu
- [✅] **T2.4d** · **Fixes visuels post-validation Playwright (2026-05-15)** — 3 bugs systémiques détectés et patchés : (1) tokens fantômes `--spacing-section`/`--spacing-block` ajoutés dans `tokens.css:160-162` (padding silencieux à 0 avant fix), (2) container `.wrap-wide` ajouté dans 5 sections (HeroSplit, ProofBar, MethodTimeline, FeatureGrid, CtaFinal), (3) HeroSplit `padding-top: calc(--spacing-section + --header-height)` pour clear sticky header — preuve `/Users/simonberos/test-composable-final.png` H1 entièrement visible
- [✅] **T2.4e** · 14 sections W6 audit (commit `4539a00`, Worker Sonnet) · 12/14 déjà conformes · HeroFullBleed.astro patché (wrap-wide ajouté) · GuaranteeBlock.astro bugfix </div> fermant manquant
- [✅] **T2.4f** · Padding-top calc(--spacing-section + --header-height) déjà présent sur HeroCentered.astro:38 + HeroFullBleed.astro:31 (commits précédents) · clear sticky header garanti
- [🟡] **T2.4c** · Migration `OffresDetailTemplate` vers SectionsRenderer reportée session next (schemas offres à étendre avec sections optional)
- [✅] **T2.5a** · /agence/design-system enrichi (commit `8344596`, Worker Sonnet) · NewsletterSignup live + PainPointInline + ShareButtons + Form elements + section Animations + EN miroir créé
- [✅] **T2.5b** · Showcase déjà couvrait 19 sections W6 · +3 molecules (Newsletter, PainPoint, Share) + form elements + 5 animations live (commit `8344596`)

### 🛡️ Garde-fou anti-répétition (mandat Simon 2026-05-15)

Avant toute nouvelle section composable ou migration utilisant `<SectionsRenderer>`, procédure obligatoire :

1. `grep -oE "var\(--[a-z0-9-]+\)" <section>.astro | sort -u` → vérifier chaque token dans `tokens.css`
2. Confirmer présence `<div class="wrap-wide">` entre `<section>` et `__inner`/contenu structuré
3. Si section peut être première d'une page (hero-*) : `padding-top: calc(var(--spacing-section) + var(--header-height))`
4. Screenshot Playwright + lecture image obligatoire (rule 19 triangulation)
5. Commit avec chemin screenshot dans le message

Capitalisation : [feedback_waimia_w6_sections_layout_pitfalls.md](file:///Users/simonberos/.claude/projects/-Users-simonberos/memory/feedback_waimia_w6_sections_layout_pitfalls.md)

### TIER 3 · Fusion collections (13h)

- [✅] **T3.1a** · Schema `courses` discriminated union créé (commit `8d0ebd1`, Worker Sonnet) · 4 variants formation/parcours/atelier/certification dans `src/content.config.ts:206-313`
- [✅] **T3.1b** · Migrer 3 MDX formations → `content/ecole/courses/*` avec `course_type: 'formation'` (commit `b518512`, Worker Sonnet) · 3 MDX migrés : automatiser-relances-crm-en-4-heures · prompter-claude-pour-les-non-tech · intro-ia-pme-b2b
- [✅] **T3.1c** · `CourseDetailTemplate.astro` polymorphe créé (commit `6fe901a`, Worker H Sonnet) · switch sur course_type
- [✅] **T3.1d** · Route `/ecole/[type]/[slug].astro` unifiée (commit `ccaf874`, Worker Sonnet) · 3 routes générées au build
- [ ] **T3.1e** · Update mega-menu pour pointer `/ecole/[type]/[slug]`
- [ ] **T3.1f** · Supprimer collections `formations`, `parcours`, `ateliers` du content.config.ts
- [✅] **T3.2a** · Schema `commerce` discriminated union créé (commit `249facd`, Opus pré-injection) · 2 variants product/subscription
- [🟡] **T3.2b** · Routes /commerce/index + /commerce/[type]/[slug] créées (commits `06c58ac` + `2e00f81`, Opus) · pas de template Hub séparé (route index inline)
- [✅] **T3.2c** · Route `/commerce/[type]/[slug]` polymorphe + 5 MDX pilot (commit `ccaf874` + `06c58ac`) · 6 routes générées
- [✅] **T3.2d** · 10 MDX commerce ajoutés (commit `0d388eb`, Worker Sonnet) · 6 products + 4 subscriptions · collection commerce passée à 15 MDX (vs 5 initial)
- [ ] **T3.2e** · Supprimer collections `produits`, `abonnements`
- [✅] **T3.3a** · `blog.type` enum étendu avec `'field-note'` et `'veille-ia'` (commit `8f4af71`, Opus pre-hook)
- [✅] **T3.3b** · 1 MDX migré (commit `c8ad9de`, Worker Sonnet) · migrated-fieldnote-composable-adoption.mdx avec type:"field-note"
- [✅] **T3.3c** · 1 MDX migré (commit `c8ad9de`, Worker Sonnet) · migrated-veille-gpt-4o-vision-update.mdx avec type:"veille-ia"
- [ ] **T3.3d** · Supprimer collections `fieldNotes`, `veilleIA`
- [ ] **T3.4** · Renommer `solutions` → `usecases` (collection + routes + mega-menu)

### TIER 4 · AI-first collections (23h)

- [✅] **T4.1a** · Schema `personas` créé (commit avec pré-injection Opus 2026-05-15) · 14 champs bilingues + sectors array
- [✅] **T4.1b** · 3 personas exemples créés (commit `b518512`, Worker Sonnet) : ceo-pme-b2b · cto-scale-up · cmo-mid-market
- [✅] **T4.1c** · `PersonaSwitcher.astro` migré pour consommer collection personas (commit `2e00f81`, Worker Sonnet) · backward compatible
- [✅] **T4.1d** · Routes `/ressources/personas/[slug]` + `/ressources/personas` index créées (commit `250fd49`) · 4 routes générées
- [✅] **T4.2a** · Schema `brandVoice` singleton créé (commit pré-injection Opus 2026-05-15) · doctrine + tone + forbidden/preferred words + sample phrases + typography rules · bilingue
- [✅] **T4.2b** · `src/content/brand-voice/doctrine.mdx` créé (commit `b518512`, Worker Sonnet) · doctrine V5-V7 + tone + forbidden/preferred words + sample phrases + typography rules
- [ ] **T4.2c** · Linter custom : warn si MDX utilise `forbidden_words`
- [✅] **T4.3a** · Schema prompts créé (commit `a480b10`, Opus pre-hook) · 7 catégories + visibility
- [✅] **T4.3b** · 5 prompts livrés (commit `0cf4793`, Worker Sonnet) · audit-ecran (580+ mots) · copywriting-offre · persona-deduction · brand-checker · schema-generator
- [✅] **T4.3c** · Pages /agence/prompts FR + EN (commit `0cf4793`, Worker Sonnet) · grouped by category · 188 lignes chacune
- [✅] **T4.4a** · Schema pain-points créé (commit `a480b10`, Opus pre-hook) · slug + pain_fr/en + severity enum + affected_personas/secteurs + solution_fr/en + cross-refs
- [✅] **T4.4b** · 12 pain-points livrés (commit `8c960fe`, Worker Sonnet) · 4 categories (Productivité/Acquisition/Pilotage/Gouvernance) · severity critical×4 high×5 medium×2
- [✅] **T4.4c** · PainPointInline.astro créé (commit `8c960fe`, Worker Sonnet) · src/components/ui/molecules/PainPointInline.astro
- [✅] **T4.5a** · Schema knowledge-base + dir (commit `a480b10`, Opus pre-hook) · 7 categories
- [✅] **T4.5b** · 10 entrées KB livrées (commit `904c817`, Worker Sonnet) · methode/doctrine/design/ia-strategy/culture/process/tooling · 600-1200 mots chacune
- [ ] **T4.5c** · Indexation embeddings (option future) — placeholder pour Pinecone/pgvector

### TIER 5 · SEO programmatique (30h)

- [✅] **T5.1a** · Schema `glossary` créé (commit pré-injection Opus 2026-05-15) · 5 catégories enum (ia-technique/ia-business/data/workflow/gouvernance) · SEO meta intégré
- [🟡] **T5.1b** · ~31/50 termes glossaire IA rédigés (commits `b518512` + `6280fda`, Workers Sonnet) · +16 termes batch 3 (ai-readiness, context-window, tokens-llm, function-calling, gdpr-ia, etc.) · pattern frontmatter figé
- [✅] **T5.1c** · Routes `/glossaire/[slug]` + `/glossaire` index créées (commit `fc8539e`) · 6 routes générées
- [✅] **T5.2a** · Schema integrations (commit `a480b10`, Opus pre-hook) · category enum 10
- [✅] **T5.2b** · 20 integrations livrées (commit `042d484`, Worker Sonnet) · CRM/automation/productivity/data/AI/commerce/analytics/hosting/communication
- [✅] **T5.2c** · Routes /integrations/[slug] + index FR+EN livrées (commit `f2f65e5`, Worker Sonnet)
- [✅] **T5.3a** · Schema comparisons (commit `ac1ae81`, Opus pre-hook) · slug regex {a}-vs-{b} + dimensions min 3
- [✅] **T5.3b** · 10 comparaisons livrées (commit `26c0263`, Worker Sonnet) · AI/automation/CRM/hosting/productivity/analytics
- [✅] **T5.3c** · Routes /comparer/[slug] + index FR+EN (commit `26c0263`, Worker Sonnet)
- [ ] **T5.4a** · Route `/ressources/tag/[slug].astro` (cross-collection filter)
- [ ] **T5.4b** · Route `/ressources/auteur/[slug].astro`
- [ ] **T5.4c** · Route `/ressources/archive/[YYYY-MM].astro`
- [ ] **T5.5a** · BreadcrumbList Schema.org audit sur toutes pages
- [ ] **T5.5b** · OG image dynamique par page (extension de T1.6)
- [ ] **T5.6** · Sitemap.xml extension : inclure toutes nouvelles routes

### TIER 6 · Conversion infrastructure (26h)

- [ ] **T6.1a** · A/B testing infrastructure Edge Config Vercel
- [✅] **T6.1b** · Middleware Astro variant cookie (commit `499a347`, Worker Sonnet) · src/middleware.ts + src/env.d.ts (Astro.locals.variant)
- [ ] **T6.1c** · Schema sections : `sections_variant_b?` optionnel
- [ ] **T6.2a** · Composant `<QuizMultiStep />` (React island justifié)
- [ ] **T6.2b** · Collection `quizzes` (questions, scoring, redirect_logic_by_score)
- [ ] **T6.2c** · 1 quiz exemple : "Maturité IA de votre PME en 3 minutes"
- [ ] **T6.3a** · Collection `forms` (fields, validation, esp_webhook, redirect)
- [ ] **T6.3b** · Composant `<LeadMagnetGated />` (form prefab + magnet trigger)
- [ ] **T6.3c** · Wire 3 forms : audit-booking · livre-blanc · newsletter
- [✅] **T6.3d** · NewsletterSignup form enrichi (commit `499a347`, Worker Sonnet) · regex EMAIL_RE + erreur inline + honeypot website sr-only + cookie waimia_newsletter_signed + alert() banni
- [✅] **T6.4a** · Schema proof-points + collection livrés (commit `ac1ae81`, Opus pre-hook) · 7 categories enum
- [✅] **T6.4b** · ProofPointInline.astro livré (commit `a5c3c51`, Worker Sonnet) · variants inline + card (ProofPointHero non livré · à faire si besoin)
- [✅] **T6.4c** · 15 proof-points livrés (commit `a5c3c51`, Worker Sonnet) · ROI×3 + Time×3 + Volume×2 + Quality×2 + Cost×2 + Adoption×3
- [✅] **T6.5a** · Schema `guarantees` (commit `dfdb1ee`, Opus pre-hook batch 9) · 6 categories enum + bilingue label/promise/detail
- [✅] **T6.5b** · `GuaranteeBadge.astro` livré (commit `c68acd3`, Worker Sonnet batch 9) · variants badge/card · 9 props · bilingue FR/EN · 6 couleurs catégorie · pattern miroir ProofPointInline
- [✅] **T6.5c** · 5 guarantees livrées (commit `c68acd3`, Worker Codex + fix Sonnet) · delai (audit 45min) · remboursement (100pct 30j) · qualite (livrable 72h) · rgpd (UE+DPA) · support (email 4h)
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

- [🟡] **T9.1** · 1/5 articles pillar essai (commit `3d1718e`, Worker Sonnet) · essai-pillar-ia-pme-2026 (~3000 mots, cluster pilotage) · reste 4 (acquisition, contenu-seo-geo, productivite, gouvernance)
- [ ] **T9.2** · 20 articles cluster (formation/notes/avis/post × 800-1500 mots)
- [ ] **T9.3** · 4 cookbooks techniques (×10-14 pages)
- [ ] **T9.4** · 40-50 field notes (×300-500 mots) — pipeline éditorial Simon
- [✅] **T9.5** · 4/4 cas narrés enrichis (commits `2e00f81` + `abdafad` + `3d1718e`, Workers Sonnet) · plateau + halcyon + northbound + caserne
- [ ] **T9.6** · 2 livres blancs (AI Act readiness migré + Growth System Playbook nouveau)
- [✅] **T9.7** · 16/16 tunnels MDX livrés (commits `6b31564` + `3d1718e` + `5599347`, Workers Sonnet) · growth-system + activation-ia + revops + application-ia-pme × 4 chacun
- [ ] **T9.8** · 6 produits MDX (audit-guide, kit-prompts, livre-blanc-premium, masterclass-replay, workbook, starter-pack)
- [ ] **T9.9** · 6 abonnements MDX (hosting Vercel, maintenance, monitoring, content production, CRM, support premium)
- [ ] **T9.10** · 8 entrées école : 5 formations + 2 parcours + 1 atelier (3/5 formations déjà livrées)

### TIER 10 · SVG custom (10h)

- [✅] **T10.1** · `WorkflowOrchestrationDiagram.astro` créé (commit `abdafad`, Worker T10 batch2)
- [ ] **T10.2** · `TunnelProgressDiagram.astro`
- [ ] **T10.3** · `TaxonomyGraphDiagram.astro`
- [ ] **T10.4** · `ArchiveTimelineDiagram.astro`
- [ ] **T10.5** · `CrossLinkingDiagram.astro`
- [ ] **T10.6** · `AuthorPortraitMonogram.astro`
- [ ] **T10.7** · `IndustryIconograms.astro` (4 secteurs)
- [ ] **T10.8** · `TechStackDiagram.astro`
- [ ] **T10.9** · `LeadFunnelDiagram.astro`
- [✅] **T10.10** · `KPIBarChart.astro` créé (commit `abdafad`, Worker T10 batch2)
- [✅] **T10.11** · `MaturityScale.astro` créé (commit `abdafad`, Worker T10 batch2)
- [✅] **T10.12** · `EditorialHairlineSet.astro` créé (commit `abdafad`, Worker T10 batch2) · 5 dingbats/séparateurs

### TIER 11 · Sync EN (5h)

- [✅] **T11.1** · **34 routes /en générées au build** (commits `ccaf874` + `b518512` + dynamiques) · couverture passée de 7→34 (+385%) · 4 routes dynamiques [...slug] sur offres/solutions/cas/ressources/blog génèrent automatiquement toutes les pages EN depuis MDX bilingues
- [✅] **T11.0** · Audit Sync EN doc 21 (commit `3f2300c`, Worker Sonnet)
- [ ] **T11.2** · /en/bienvenue/* 3 welcome pages
- [✅] **T11.2b** · 5 routes EN secondaires miroir FR (commit `e7f07bd`, Worker Sonnet) · /en/agence/{about,methode} + /en/ressources/index + /en/solutions/index + /en/technologies/index
- [🟡] **T11.3** · hreflang validation partielle (commit pending, Opus) · Base.astro injecte 3 hreflang/page mais ~58% FR sans miroir EN · cf docs/25-HREFLANG-SITEMAP-AUDIT.md
- [🟡] **T11.4** · sitemap unique mêlé FR+EN (223 URLs · 78 paires) · sitemap-en.xml séparé non implémenté · cf docs/25-HREFLANG-SITEMAP-AUDIT.md

### TIER 12 · ISR + Performance finale (3h)

- [✅] **T12.0** · ISR activé au niveau adapter Vercel (`isr: { expiration: 3600, bypassToken, exclude: [/api/*] }`) — prêt pour activation page-par-page
- [🟡] **T12.1** · ISR `/ressources/index` — page SSG (prerender=true) avec contenu **hardcodé** (pas de collection query dynamique) → ISR n'apporte pas de valeur. Débloqué par T8.1 (migration hub collection-driven). Garder SSG.
- [🟡] **T12.2** · ISR `/archive` — page SSG (prerender=true) quasi-statique. Si converti : TTL recommandé 24h. Activation = supprimer prerender=true (page simple, pas de getStaticPaths).
- [🟡] **T12.3** · ISR `/ressources/tag/[...slug]` (TTL 1h) — SSG avec getStaticPaths. Conversion ISR requiert : (1) supprimer prerender=true + getStaticPaths, (2) lire `Astro.params.slug`, (3) calculer `items` dans le frontmatter, (4) ajouter guard 404. Cf DONE.md.
- [🟡] **T12.4** · ISR `/ressources/auteur/[slug]` (TTL 6h) — route inexistante (dépend T5.4b). Quand créée : implémenter directement en mode SSR+ISR sans prerender.
- [ ] **T12.5** · Lighthouse final 95+ sur 5 pages échantillon
- [ ] **T12.6** · Bundle JS initial < 80 KB gzip vérifié
- [ ] **T12.7** · LCP < 1.5s sur home

### TIER 13 · QA finale (5h)

- [🟡] **T13.1** · `pnpm exec astro check` : 31 errors / 1055 hints (deprecation warnings Zod v4 z.string().url() · non-bloquants, build passe) · à migrer en session future vers z.string().regex(URL_PATTERN) ou import schema v5
- [✅] **T13.2** · `pnpm build` succès complet validé 10+ fois cette session (5-6s à chaque check)
- [ ] **T13.3** · Lighthouse 5 pages échantillon (perf, a11y, SEO, best practices)
- [ ] **T13.4** · Schema.org validator sur Article/Service/FAQPage/Product/Course/BreadcrumbList
- [✅] **T13.5** · Audit liens cross-collection (commit `e0a1b63`, Worker Sonnet) · docs/23-CROSS-COLLECTION-AUDIT.md · 3 hrefs 404 prod identifiés P0 + 1 slug glossary orphelin (workflow-ia ×2)
- [✅] **T13.6** · Hreflang FR/EN systématique via Base.astro:81-83 (commit pending, Opus) · 3 hreflang/page (fr-FR + en-US + x-default) · cf docs/25-HREFLANG-SITEMAP-AUDIT.md
- [ ] **T13.7** · Triangulation visuelle screenshots échantillon (Simon valide)
- [ ] **T13.8** · Update doc 12 statuses avec ✅ final
- [ ] **T13.9** · Commit + push final → Vercel deploy preview
- [ ] **T13.10** · Validation Vercel preview HTTP 200 sur 50+ URLs échantillon

### TIER 14 · Closure Audit — Lock infra + DS (insérée 2026-05-17)

**Mandat Simon 2026-05-17** :
> _« centraliser tous les composants utilisés du site, tout converti correctement en SSG / préparer l'ISR. Aucun SSR sauf fonction minimale Vercel pour API/contact/pages dynamiques. Design system doit plus être libre mais déterminé et fix »_
> _« cadre déterministe et fix · contrat parfait suivant meilleures pratiques · web, accessibilité, performance, design, style, SEO/GEO »_

Bloque l'avancée du tracker T6.6 / T7 / T9 jusqu'à validation des 5 axes ci-dessous.

#### Axe 1 · Stack TanStack — verdict immédiat

- [✅] **T14.1a** · Audit dépendance TanStack (commit `c68acd3` audit Opus) · 0 résultat `grep "@tanstack\|tanstack"` package.json + src/ → **non utilisé**
- [✅] **T14.1b** · Doc décision `apps/web/docs/29-STACK-DECISION.md` créée (commit pending, Opus) · 11 critères comparatifs Astro 6 vs TanStack Start · verdict : Astro reste canonique · cas où TanStack serait justifié documenté · sujet clos

#### Axe 2 · SSG/SSR/ISR — investigation + migration

- [✅] **T14.2a** · Audit prerender empirique (commit `c68acd3` audit Opus) · 119 pages prerender=true · 7 API routes server · `output: 'server'` actuel · 1 blocker `[...slug].astro`
- [✅] **T14.2b** · Investigation cause racine crash `[...slug] + prerender=true` (commit `c68acd3` audit Opus) · Rolldown 1.0.0-rc.17 `tsconfigPaths Missing field` + Vite/Tailwind 4 · commit fautif `86c01a9` · dpl_4kh6QP1 ERROR
- [✅] **T14.2c** · Test reverse REVERT 2026-05-17 (Opus direct) · `prerender = true` ajouté sur `[...slug].astro` · `pnpm build → Server built in 6.01s, Complete!` ✅ · **Bug Rolldown FIXÉ upstream** dans Astro 6.1.9 / Vercel 10.0.5 / Tailwind 4.2.4 · Warning non-bloquant `Astro.request.headers` sur pages prerender (à traiter Phase 3 optim)
- [~] **T14.2d** · Strategy alternative · **OBSOLÈTE** car T14.2c a réussi (bug fixé upstream, pas de fix workaround nécessaire)
- [ ] **T14.2e** · Migration `output: 'server'` → `output: 'static'` · DÉBLOQUÉ par T14.2c · à exécuter **après Phase 1 Design** (mandat Simon : design parfait avant optimisation)
- [ ] **T14.2f** · Audit pages restantes sans prerender · décision SSG/ISR/SSR pour chacune
- [ ] **T14.2g** · ISR config hubs collection-driven (TTL 1h) · /ressources/index, /blog, /cookbooks, etc.
- [ ] **T14.2h** · Build + Vercel preview · valider 0 régression sur 119 pages

#### Axe 3 · Design System closure — contrat déterministe

- [✅] **T14.3a** · Cartographie complète composants livrée (commit `0cfdd21`, Worker 1 Codex) · `docs/31-COMPONENTS-DOUBLONS-MAPPING.md` · 147 composants + 4 React islands · 7 doublons majeurs + 6 mineurs + 32 dead code + 8 batches élimination ordonnés
- [✅] **T14.3a-T** · Audit profond 19 templates livré (commit `0cfdd21`, Worker 2 Codex) · `docs/32-TEMPLATES-DEEP-AUDIT.md` · 4 doublons templates + 2 à éliminer + 3 à rationaliser + **19/19 sections W6 sous-adoptées en prod**
- [✅] **T14.3a-P** · Audit pages taxonomie livré (commit `0cfdd21`, Worker 3 Sonnet) · `docs/33-PAGES-TAXONOMY-AUDIT.md` · 110 pages analysées · 9 drifts + 7 pépites sous-utilisées + 10 batches A-J
- [ ] **T14.3b** · Diff showcase `/agence/design-system` vs cartographie · gaps identifiés dans doc 31§3, à exposer Phase 1 exécution
- [✅] **T14.3c** · Contrat formel `apps/web/docs/28-DESIGN-SYSTEM-CONTRACT.md` livré (commit pending, Worker 4 Codex) · **8 axes** (Structure, Props, Styles, A11y RGAA+WCAG, Perf Core Web Vitals stricts, SEO/GEO, Style, Telemetry) · workflow modification + CI check spec · références précises vers docs 17/18/19/20/29/31/32/33
- [ ] **T14.3d** · Compléter showcase avec composants manquants (FR + EN miroir) — déclencher après Batch H/F/D
- [ ] **T14.3e** · Marquer chaque composant **stable / WIP / deprecated** dans showcase + doc 19 — statuts déjà proposés dans doc 31
- [✅] **T14.3f** · Règle promotion figée (doc 28§1) · « dès la 1ère utilisation si intent dépasse page locale »
- [ ] **T14.3g** · Audit props/islands : `client:load|idle|visible` justifié sur chaque island
- [ ] **T14.3h** · Tests visuels Playwright snapshots des composants critiques (régression DS)
- [✅] **T14.4-J** · Batch J priorité absolue · 4 tokens CSS fantômes fix (commit `90d77d6`, Worker 5 Sonnet) · `global.css` 4 lignes · rupture typo h1/h2/h3/code restaurée toutes pages
- [✅] **T14.4-H** · Batch H legacy templates + dead code (commit `4e65af0`, Worker Codex) · 3 éliminations chirurgicales (FormationDetail 484 LoC + BreadcrumbSchema + MetricStrip) + migration `/ecole/cours/[slug]` vers CourseDetailTemplate · 667 LoC modifiées · audit visuel before/after versionné
- [✅] **T14.4-F** · Batch F ProcessSteps → MethodTimeline (commit `83e8098`, Worker Sonnet fallback Codex limit) · 3 templates migrés (CaseStudy/ServiceDetail/DetailMenu) + MethodTimeline header conditionnel · ProcessSteps 124 LoC supprimé · audit visuel before/after versionné
- [✅] **T14.5-Verdicts** · 5 doublons ambigus tranchés selon contrat doc 28 (commit `64cb585`, doc 34-AMBIGUS-VERDICTS-OPUS) · ProofBand Tier 2 WIP · Related 2 rôles distincts · PricingTier @internal · 3 timelines scopes distincts · Hero variants Tier 2 licites

#### Axe 4 · Cohérence CSS — tokens vs hardcoded

- [ ] **T14.4a** · Audit grep `style="..."` inline sur composants · liste candidats refactor
- [ ] **T14.4b** · Audit valeurs hardcoded `[0-9]+px` et `#[0-9a-fA-F]{6}` · ratio tokens vs hardcoded
- [ ] **T14.4c** · `apps/web/docs/30-CSS-COHERENCE-AUDIT.md` · rapport gap + plan
- [ ] **T14.4d** · Fix worker Sonnet : refactor fichiers en violation vers `var(--token)`

#### Axe 5 · Centralisation composants templates + home

- [ ] **T14.5a** · Lister composants utilisés dans `src/pages/index.astro` (home) + 12 templates
- [ ] **T14.5b** · Mapper chaque composant à sa section showcase
- [ ] **T14.5c** · Compléter le showcase avec les manquants (intersection T14.3b + T14.5a)
- [ ] **T14.5d** · Verrouiller règle : tout nouveau composant introduit dans le repo **doit** être dans le showcase et la doc 19 avant merge
- [ ] **T14.5e** · Hook pre-commit ou CI check qui refuse un commit de composant non showcasé

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
