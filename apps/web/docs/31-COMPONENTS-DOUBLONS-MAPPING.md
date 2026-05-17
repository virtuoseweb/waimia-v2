# 31 — Cartographie des doublons composants

**Statut** : ✅ AUDIT FACTUEL · Phase 1 Design
**Date** : 2026-05-17
**Périmètre mesuré** : `apps/web/src/components`
**Mandat source** : T14.3a–T14.3h du tracker de fermeture design system (source : `docs/16-EXECUTION-TRACKER.md:258-267`)

## Préambule méthodologique

- `docs/17-COMPONENTS-CARTOGRAPHY.md` posait une base à **114 composants** et signalait déjà **6 doublons majeurs** (source : `docs/17-COMPONENTS-CARTOGRAPHY.md:8-23`, `:55-66`, `:139-148`).
- `docs/18-DESIGN-SYSTEM-CARTOGRAPHY.md` figeait le constat **147 tokens définis / 56 utilisés / 114 composants atomic** (source : `docs/18-DESIGN-SYSTEM-CARTOGRAPHY.md:37-45`).
- `docs/19-DESIGN-SYSTEM-CLOSED.md` a ensuite fermé le système en **Tier 1 / Tier 2 / Tier 3**, avec préférence explicite pour les sections composables et dépréciation progressive des legacy duplicates (source : `docs/19-DESIGN-SYSTEM-CLOSED.md:20-31`, `:147-180`, `:221-228`).
- `docs/20-DESIGN-SYSTEM-CATALOGUE-PLAN.md` montre que la page `/agence/design-system` restait très incomplète et que les sections W6 étaient surtout showcasées, pas encore massivement adoptées en prod (source : `docs/20-DESIGN-SYSTEM-CATALOGUE-PLAN.md:12-20`, `:22-35`, `:136-145`).
- Mesure repo au 2026-05-17 : **147 composants Astro**. Si on exécute la commande mission avec `*.astro` **et** `*.tsx`, le dépôt remonte **151 fichiers** car il existe **4 islands React** hors compteur T14.3a : `motion/LiquidHero.tsx`, `motion/ProductReel.tsx`, `ui/molecules/CalEmbedReact.tsx`, `ui/molecules/PagePillIsland.tsx`.
- Pour respecter la taxonomie demandée, les `svg/*` sont rangés sous `editorial` et `header/footer` sous `organism`.

## Section 1 · Delta cartographie 15 → 17 mai

### Synthèse delta

| Indicateur | Valeur | Note |
|---|---:|---|
| Cartographie doc 17 | 114 | base audit du 2026-05-15 |
| Inventaire T14.3a réel | 147 | composants Astro mesurés le 2026-05-17 |
| Delta nominal | +33 | périmètre T14.3a |
| Fichiers composants si on inclut `*.tsx` | 151 | +4 React islands hors compteur 147 |
| Composition du delta | 27 SVG + 3 molecules + 1 section + 1 template + 1 SEO | lecture la plus cohérente par rapport aux docs 17/18/19 |

### 33 composants supplémentaires repérés dans le périmètre 147

| Path complet | Nom | Catégorie atomique | Statut proposé | Doublon potentiel / nouveau pattern |
|---|---|---|---|---|
| `src/components/sections/CtaBandSection.astro` | `CtaBandSection` | `section` | 🟡 WIP | ⚠️ doublon mineur avec `ui/organisms/CtaBand.astro` ; version section canonique visée |
| `src/components/seo/BreadcrumbSchema.astro` | `BreadcrumbSchema` | `seo` | 🔴 DEPRECATED | ⚠️ doublon mineur avec `Breadcrumb.astro` (JSON-LD déjà embarqué) |
| `src/components/svg/geometric/AcquisitionFunnel.astro` | `AcquisitionFunnel` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/AuditMaturityTimeline.astro` | `AuditMaturityTimeline` | `editorial` | 🟢 STABLE | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/CompositeArchitectureDiagram.astro` | `CompositeArchitectureDiagram` | `editorial` | 🟡 WIP | nouveau pattern |
| `src/components/svg/geometric/ConseilAuditDiagram.astro` | `ConseilAuditDiagram` | `editorial` | 🟢 STABLE | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/ContenuGeoMap.astro` | `ContenuGeoMap` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/CrmRelancesFlow.astro` | `CrmRelancesFlow` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/Dingbats.astro` | `Dingbats` | `editorial` | 🟡 WIP | nouveau pattern visuel signature |
| `src/components/svg/geometric/DividerHairline.astro` | `DividerHairline` | `editorial` | 🟡 WIP | nouveau pattern visuel signature |
| `src/components/svg/geometric/EditorialHairlineSet.astro` | `EditorialHairlineSet` | `editorial` | 🟡 WIP | nouveau pattern visuel signature |
| `src/components/svg/geometric/GrowthSystemDiagram.astro` | `GrowthSystemDiagram` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/InfrastructureLayers.astro` | `InfrastructureLayers` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/KPIBarChart.astro` | `KPIBarChart` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/MaturityScale.astro` | `MaturityScale` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/MethodeProcessDiagram.astro` | `MethodeProcessDiagram` | `editorial` | 🟢 STABLE | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/OrnamentSection.astro` | `OrnamentSection` | `editorial` | 🟡 WIP | nouveau pattern visuel signature |
| `src/components/svg/geometric/RevOpsFunnel.astro` | `RevOpsFunnel` | `editorial` | 🟢 STABLE | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/StackDiagram.astro` | `StackDiagram` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/WaimiaBadge.astro` | `WaimiaBadge` | `editorial` | 🟡 WIP | nouveau pattern visuel signature |
| `src/components/svg/geometric/WaimiaMark.astro` | `WaimiaMark` | `editorial` | 🟡 WIP | nouveau pattern visuel signature |
| `src/components/svg/geometric/WorkflowOrchestrationDiagram.astro` | `WorkflowOrchestrationDiagram` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/geometric/WorkflowScoring.astro` | `WorkflowScoring` | `editorial` | 🟡 WIP | nouveau pattern visuel / diagramme métier |
| `src/components/svg/sumie/PortraitSimon.astro` | `PortraitSimon` | `editorial` | 🟢 STABLE | nouveau pattern visuel signature |
| `src/components/svg/sumie/SecteurFinance.astro` | `SecteurFinance` | `editorial` | 🟢 STABLE | nouveau pattern visuel signature |
| `src/components/svg/sumie/SecteurFinanceCompta.astro` | `SecteurFinanceCompta` | `editorial` | 🟡 WIP | nouveau pattern visuel signature |
| `src/components/svg/sumie/SecteurIndustrie.astro` | `SecteurIndustrie` | `editorial` | 🟢 STABLE | nouveau pattern visuel signature |
| `src/components/svg/sumie/SecteurServicesB2B.astro` | `SecteurServicesB2B` | `editorial` | 🟢 STABLE | nouveau pattern visuel signature |
| `src/components/svg/sumie/TeamCollaboration.astro` | `TeamCollaboration` | `editorial` | 🟡 WIP | nouveau pattern visuel signature |
| `src/components/templates/CourseDetailTemplate.astro` | `CourseDetailTemplate` | `template` | 🟢 STABLE | ⚠️ doublon mineur avec `FormationDetailTemplate.astro` ; template unifié 4 types |
| `src/components/ui/molecules/GuaranteeBadge.astro` | `GuaranteeBadge` | `molecule` | 🟡 WIP | nouveau pattern éditorial piloté par collection |
| `src/components/ui/molecules/PainPointInline.astro` | `PainPointInline` | `molecule` | 🟢 STABLE | nouveau pattern éditorial piloté par collection |
| `src/components/ui/molecules/ProofPointInline.astro` | `ProofPointInline` | `molecule` | 🟡 WIP | nouveau pattern éditorial piloté par collection |

## Section 2 · Inventaire complet 147 composants par catégorie

### Vue d’ensemble

| Catégorie | Compteur | Note |
|---|---:|---|
| atom | 10 | stable, socle DS |
| molecule | 31 | contient plusieurs legacy en concurrence |
| organism | 27 | inclut `header/` et `footer/` |
| section | 20 | toutes classées `WIP` tant que la migration prod n’est pas faite |
| template | 19 | bon levier de dé-doublonnage |
| editorial | 35 | inclut 8 editorial + 27 SVG inline |
| motion | 2 | les 2 autres motion sont en `.tsx` hors compteur 147 |
| seo | 3 | `BreadcrumbSchema` est redondant |
| **Total** | **147** | compteur T14.3a conforme |

### Atoms (10)

| Path complet | Nom | Catégorie | Lignes | Utilisation directe | Tokens | A11y | Statut |
|---|---:|---:|---:|---:|---:|---:|---|
| `src/components/ui/atoms/Bi.astro` | `Bi` | `atom` | 31 | 19 | 0 | 0 | 🟢 STABLE |
| `src/components/ui/atoms/Button.astro` | `Button` | `atom` | 74 | 26 | 0 | 1 | 🟢 STABLE |
| `src/components/ui/atoms/ChapterLabel.astro` | `ChapterLabel` | `atom` | 32 | 11 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/atoms/CursorDot.astro` | `CursorDot` | `atom` | 167 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/atoms/Kicker.astro` | `Kicker` | `atom` | 49 | 102 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/atoms/PillCTA.astro` | `PillCTA` | `atom` | 50 | 3 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/atoms/ProgressBar.astro` | `ProgressBar` | `atom` | 51 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/atoms/ScrollProgress.astro` | `ScrollProgress` | `atom` | 37 | 3 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/atoms/SectionTransition.astro` | `SectionTransition` | `atom` | 86 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/atoms/TerminalCTA.astro` | `TerminalCTA` | `atom` | 57 | 3 | 1 | 0 | 🟢 STABLE |

### Molecules (31)

| Path complet | Nom | Catégorie | Lignes | Utilisation directe | Tokens | A11y | Statut |
|---|---:|---:|---:|---:|---:|---:|---|
| `src/components/ui/molecules/AsymmetricServiceRow.astro` | `AsymmetricServiceRow` | `molecule` | 70 | 2 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/AuthorByline.astro` | `AuthorByline` | `molecule` | 101 | 7 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/AuthorCard.astro` | `AuthorCard` | `molecule` | 146 | 4 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/Breadcrumb.astro` | `Breadcrumb` | `molecule` | 65 | 30 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/CalEmbed.astro` | `CalEmbed` | `molecule` | 68 | 2 | 0 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/EditorialCaseCard.astro` | `EditorialCaseCard` | `molecule` | 85 | 2 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/EditorialWriteRow.astro` | `EditorialWriteRow` | `molecule` | 72 | 6 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/FitColumns.astro` | `FitColumns` | `molecule` | 101 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/GuaranteeBadge.astro` | `GuaranteeBadge` | `molecule` | 223 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/ui/molecules/MastheadRow.astro` | `MastheadRow` | `molecule` | 63 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/MetricStrip.astro` | `MetricStrip` | `molecule` | 93 | 0 | 1 | 0 | 🔴 DEPRECATED |
| `src/components/ui/molecules/NewsletterSignup.astro` | `NewsletterSignup` | `molecule` | 237 | 3 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/PagePill.astro` | `PagePill` | `molecule` | 47 | 1 | 0 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/PainPointInline.astro` | `PainPointInline` | `molecule` | 159 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/PricingTier.astro` | `PricingTier` | `molecule` | 173 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/ProcessSteps.astro` | `ProcessSteps` | `molecule` | 124 | 3 | 1 | 0 | 🔴 DEPRECATED |
| `src/components/ui/molecules/ProofBand.astro` | `ProofBand` | `molecule` | 148 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/ProofPointInline.astro` | `ProofPointInline` | `molecule` | 157 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/ui/molecules/RelatedByCluster.astro` | `RelatedByCluster` | `molecule` | 131 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/RelatedCards.astro` | `RelatedCards` | `molecule` | 108 | 10 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/SectionHeader.astro` | `SectionHeader` | `molecule` | 60 | 8 | 0 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/ServiceCatalogRow.astro` | `ServiceCatalogRow` | `molecule` | 114 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/ShareButtons.astro` | `ShareButtons` | `molecule` | 102 | 3 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/StatRow.astro` | `StatRow` | `molecule` | 94 | 3 | 1 | 0 | 🔴 DEPRECATED |
| `src/components/ui/molecules/TableOfContents.astro` | `TableOfContents` | `molecule` | 97 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/TagPills.astro` | `TagPills` | `molecule` | 57 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/TaxonomyMenu.astro` | `TaxonomyMenu` | `molecule` | 74 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/ui/molecules/TechPillRow.astro` | `TechPillRow` | `molecule` | 75 | 7 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/TerminalMockup.astro` | `TerminalMockup` | `molecule` | 71 | 3 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/molecules/TerminalTable.astro` | `TerminalTable` | `molecule` | 74 | 2 | 1 | 0 | 🟢 STABLE |
| `src/components/ui/molecules/TunnelNav.astro` | `TunnelNav` | `molecule` | 90 | 0 | 1 | 0 | 🟡 WIP |

### Organisms (27)

| Path complet | Nom | Catégorie | Lignes | Utilisation directe | Tokens | A11y | Statut |
|---|---:|---:|---:|---:|---:|---:|---|
| `src/components/footer/Footer.astro` | `Footer` | `organism` | 449 | 4 | 1 | 1 | 🟢 STABLE |
| `src/components/header/Header.astro` | `Header` | `organism` | 331 | 2 | 0 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/AtlasGrid.astro` | `AtlasGrid` | `organism` | 124 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/BookSession.astro` | `BookSession` | `organism` | 82 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/CapabilityStrip.astro` | `CapabilityStrip` | `organism` | 342 | 2 | 1 | 1 | 🔴 DEPRECATED |
| `src/components/ui/organisms/Cases.astro` | `Cases` | `organism` | 102 | 6 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/CookiesBanner.astro` | `CookiesBanner` | `organism` | 151 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/CtaBand.astro` | `CtaBand` | `organism` | 55 | 27 | 1 | 1 | 🔴 DEPRECATED |
| `src/components/ui/organisms/Departments.astro` | `Departments` | `organism` | 190 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/FieldNotes.astro` | `FieldNotes` | `organism` | 168 | 4 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/FooterMarquee.astro` | `FooterMarquee` | `organism` | 49 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/Hero.astro` | `Hero` | `organism` | 373 | 4 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/HowWeShip.astro` | `HowWeShip` | `organism` | 140 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/ui/organisms/Manifesto.astro` | `Manifesto` | `organism` | 37 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/ManifestoAccent.astro` | `ManifestoAccent` | `organism` | 74 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/Offices.astro` | `Offices` | `organism` | 72 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/ui/organisms/OperatingLayer.astro` | `OperatingLayer` | `organism` | 131 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/ui/organisms/PersonaSwitcher.astro` | `PersonaSwitcher` | `organism` | 205 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/ProofBar.astro` | `ProofBar` | `organism` | 142 | 4 | 1 | 1 | 🔴 DEPRECATED |
| `src/components/ui/organisms/Pyramid.astro` | `Pyramid` | `organism` | 271 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/SigBand.astro` | `SigBand` | `organism` | 23 | 0 | 0 | 0 | 🟡 WIP |
| `src/components/ui/organisms/SixServices.astro` | `SixServices` | `organism` | 103 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/Stub.astro` | `Stub` | `organism` | 44 | 1 | 1 | 1 | 🔴 DEPRECATED |
| `src/components/ui/organisms/SystemArchitecture.astro` | `SystemArchitecture` | `organism` | 177 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/ui/organisms/TrustMarquee.astro` | `TrustMarquee` | `organism` | 23 | 4 | 0 | 1 | 🔴 DEPRECATED |
| `src/components/ui/organisms/WhyAIStalls.astro` | `WhyAIStalls` | `organism` | 68 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/ui/organisms/WritingNotes.astro` | `WritingNotes` | `organism` | 73 | 0 | 1 | 0 | 🟡 WIP |

### Sections (20)

| Path complet | Nom | Catégorie | Lignes | Utilisation directe | Tokens | A11y | Statut |
|---|---:|---:|---:|---:|---:|---:|---|
| `src/components/sections/ComparisonTable.astro` | `ComparisonTable` | `section` | 97 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/CtaBandSection.astro` | `CtaBandSection` | `section` | 47 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/CtaFinal.astro` | `CtaFinal` | `section` | 71 | 2 | 1 | 0 | 🟡 WIP |
| `src/components/sections/CtaInline.astro` | `CtaInline` | `section` | 41 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/FaqAccordion.astro` | `FaqAccordion` | `section` | 96 | 1 | 1 | 1 | 🟡 WIP |
| `src/components/sections/FeatureGrid.astro` | `FeatureGrid` | `section` | 92 | 2 | 1 | 0 | 🟡 WIP |
| `src/components/sections/GuaranteeBlock.astro` | `GuaranteeBlock` | `section` | 71 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/HeroCentered.astro` | `HeroCentered` | `section` | 76 | 2 | 1 | 0 | 🟡 WIP |
| `src/components/sections/HeroFullBleed.astro` | `HeroFullBleed` | `section` | 64 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/HeroSplit.astro` | `HeroSplit` | `section` | 100 | 2 | 1 | 1 | 🟡 WIP |
| `src/components/sections/MediaBlock.astro` | `MediaBlock` | `section` | 74 | 1 | 1 | 1 | 🟡 WIP |
| `src/components/sections/MethodTimeline.astro` | `MethodTimeline` | `section` | 108 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/ObjectionHandler.astro` | `ObjectionHandler` | `section` | 88 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/PricingTable.astro` | `PricingTable` | `section` | 153 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/ProofBarSection.astro` | `ProofBarSection` | `section` | 75 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/SectionsRenderer.astro` | `SectionsRenderer` | `section` | 30 | 4 | 0 | 0 | 🟡 WIP |
| `src/components/sections/SocialProof.astro` | `SocialProof` | `section` | 77 | 1 | 1 | 1 | 🟡 WIP |
| `src/components/sections/StatBlock.astro` | `StatBlock` | `section` | 106 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/TestimonialBlock.astro` | `TestimonialBlock` | `section` | 111 | 1 | 1 | 0 | 🟡 WIP |
| `src/components/sections/TimelineBlock.astro` | `TimelineBlock` | `section` | 80 | 1 | 1 | 0 | 🟡 WIP |

### Templates (19)

| Path complet | Nom | Catégorie | Lignes | Utilisation directe | Tokens | A11y | Statut |
|---|---:|---:|---:|---:|---:|---:|---|
| `src/components/templates/AuthorPageTemplate.astro` | `AuthorPageTemplate` | `template` | 1067 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/CaseStudyTemplate.astro` | `CaseStudyTemplate` | `template` | 481 | 6 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/ConversionFunnelTemplate.astro` | `ConversionFunnelTemplate` | `template` | 773 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/CourseDetailTemplate.astro` | `CourseDetailTemplate` | `template` | 693 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/templates/DetailMenuTemplate.astro` | `DetailMenuTemplate` | `template` | 227 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/templates/EcoleHubTemplate.astro` | `EcoleHubTemplate` | `template` | 337 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/templates/EssayTemplate.astro` | `EssayTemplate` | `template` | 671 | 9 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/FormationDetailTemplate.astro` | `FormationDetailTemplate` | `template` | 484 | 1 | 1 | 0 | 🔴 DEPRECATED |
| `src/components/templates/HubTemplate.astro` | `HubTemplate` | `template` | 394 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/templates/LeadMagnetTemplate.astro` | `LeadMagnetTemplate` | `template` | 433 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/ListIndexTemplate.astro` | `ListIndexTemplate` | `template` | 86 | 3 | 1 | 0 | 🟢 STABLE |
| `src/components/templates/OffresDetailTemplate.astro` | `OffresDetailTemplate` | `template` | 1488 | 3 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/ServiceDetailTemplate.astro` | `ServiceDetailTemplate` | `template` | 249 | 1 | 1 | 0 | 🟢 STABLE |
| `src/components/templates/SolutionsDetailTemplate.astro` | `SolutionsDetailTemplate` | `template` | 1230 | 4 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/TechnologiesDetailTemplate.astro` | `TechnologiesDetailTemplate` | `template` | 1000 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/TrustLegalTemplate.astro` | `TrustLegalTemplate` | `template` | 238 | 3 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/TunnelStepTemplate.astro` | `TunnelStepTemplate` | `template` | 333 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/templates/UtilityTemplate.astro` | `UtilityTemplate` | `template` | 118 | 11 | 1 | 0 | 🟢 STABLE |
| `src/components/templates/WelcomeTemplate.astro` | `WelcomeTemplate` | `template` | 197 | 8 | 1 | 1 | 🟢 STABLE |

### Editorial + SVG inline (35)

| Path complet | Nom | Catégorie | Lignes | Utilisation directe | Tokens | A11y | Statut |
|---|---:|---:|---:|---:|---:|---:|---|
| `src/components/editorial/Callout.astro` | `Callout` | `editorial` | 132 | 10 | 1 | 0 | 🟢 STABLE |
| `src/components/editorial/Dingbat.astro` | `Dingbat` | `editorial` | 92 | 5 | 1 | 1 | 🟢 STABLE |
| `src/components/editorial/DropCap.astro` | `DropCap` | `editorial` | 58 | 2 | 1 | 1 | 🟢 STABLE |
| `src/components/editorial/EditorialTable.astro` | `EditorialTable` | `editorial` | 143 | 6 | 1 | 0 | 🟢 STABLE |
| `src/components/editorial/KeyMetric.astro` | `KeyMetric` | `editorial` | 93 | 6 | 1 | 0 | 🟢 STABLE |
| `src/components/editorial/PullQuote.astro` | `PullQuote` | `editorial` | 133 | 4 | 1 | 1 | 🟢 STABLE |
| `src/components/editorial/Sidenote.astro` | `Sidenote` | `editorial` | 100 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/editorial/Timeline.astro` | `Timeline` | `editorial` | 163 | 8 | 1 | 1 | 🟢 STABLE |
| `src/components/svg/geometric/AcquisitionFunnel.astro` | `AcquisitionFunnel` | `editorial` | 77 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/AuditMaturityTimeline.astro` | `AuditMaturityTimeline` | `editorial` | 66 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/svg/geometric/CompositeArchitectureDiagram.astro` | `CompositeArchitectureDiagram` | `editorial` | 170 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/ConseilAuditDiagram.astro` | `ConseilAuditDiagram` | `editorial` | 71 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/svg/geometric/ContenuGeoMap.astro` | `ContenuGeoMap` | `editorial` | 77 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/CrmRelancesFlow.astro` | `CrmRelancesFlow` | `editorial` | 86 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/Dingbats.astro` | `Dingbats` | `editorial` | 75 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/DividerHairline.astro` | `DividerHairline` | `editorial` | 26 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/EditorialHairlineSet.astro` | `EditorialHairlineSet` | `editorial` | 156 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/GrowthSystemDiagram.astro` | `GrowthSystemDiagram` | `editorial` | 55 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/InfrastructureLayers.astro` | `InfrastructureLayers` | `editorial` | 45 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/KPIBarChart.astro` | `KPIBarChart` | `editorial` | 111 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/MaturityScale.astro` | `MaturityScale` | `editorial` | 126 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/MethodeProcessDiagram.astro` | `MethodeProcessDiagram` | `editorial` | 167 | 3 | 1 | 1 | 🟢 STABLE |
| `src/components/svg/geometric/OrnamentSection.astro` | `OrnamentSection` | `editorial` | 33 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/RevOpsFunnel.astro` | `RevOpsFunnel` | `editorial` | 64 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/svg/geometric/StackDiagram.astro` | `StackDiagram` | `editorial` | 102 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/WaimiaBadge.astro` | `WaimiaBadge` | `editorial` | 31 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/WaimiaMark.astro` | `WaimiaMark` | `editorial` | 59 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/WorkflowOrchestrationDiagram.astro` | `WorkflowOrchestrationDiagram` | `editorial` | 192 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/geometric/WorkflowScoring.astro` | `WorkflowScoring` | `editorial` | 151 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/sumie/PortraitSimon.astro` | `PortraitSimon` | `editorial` | 66 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/svg/sumie/SecteurFinance.astro` | `SecteurFinance` | `editorial` | 63 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/svg/sumie/SecteurFinanceCompta.astro` | `SecteurFinanceCompta` | `editorial` | 41 | 0 | 1 | 0 | 🟡 WIP |
| `src/components/svg/sumie/SecteurIndustrie.astro` | `SecteurIndustrie` | `editorial` | 67 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/svg/sumie/SecteurServicesB2B.astro` | `SecteurServicesB2B` | `editorial` | 67 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/svg/sumie/TeamCollaboration.astro` | `TeamCollaboration` | `editorial` | 62 | 0 | 1 | 0 | 🟡 WIP |

### Motion (2 Astro)

| Path complet | Nom | Catégorie | Lignes | Utilisation directe | Tokens | A11y | Statut |
|---|---:|---:|---:|---:|---:|---:|---|
| `src/components/motion/AtlasConnections.astro` | `AtlasConnections` | `motion` | 126 | 1 | 1 | 1 | 🟢 STABLE |
| `src/components/motion/BootSplash.astro` | `BootSplash` | `motion` | 88 | 2 | 1 | 1 | 🟢 STABLE |

### SEO (3)

| Path complet | Nom | Catégorie | Lignes | Utilisation directe | Tokens | A11y | Statut |
|---|---:|---:|---:|---:|---:|---:|---|
| `src/components/seo/BreadcrumbSchema.astro` | `BreadcrumbSchema` | `seo` | 72 | 0 | 1 | 0 | 🔴 DEPRECATED |
| `src/components/seo/FAQ.astro` | `FAQ` | `seo` | 149 | 2 | 1 | 1 | 🔴 DEPRECATED |
| `src/components/seo/JsonLd.astro` | `JsonLd` | `seo` | 12 | 2 | 0 | 0 | 🟢 STABLE |

## Section 3 · Doublons fonctionnels détectés

> Grille de décision utilisée : tokens propres, signal a11y, nombre de consommateurs directs, préférence architecturale **section W6 > organism/molecule legacy**, support FR/EN, et qualité visuelle perçue. Références amont : `docs/17-COMPONENTS-CARTOGRAPHY.md:55-66`, `:139-148` ; `docs/19-DESIGN-SYSTEM-CLOSED.md:147-180`, `:221-228`.

| Marqueur | Famille | Provenance actuelle | Critères factuels | Verdict canonique | Plan migration | Critique visuelle |
|---|---|---|---|---|---|---|
| 🚨 | `Hero.astro` vs `HeroSplit.astro` vs `HeroCentered.astro` vs `HeroFullBleed.astro` | `Hero` : `/`, `/en/`, showcase FR/EN. `HeroSplit` : showcase FR/EN. `HeroCentered` : showcase FR/EN. `HeroFullBleed` : showcase FR. | `Hero` = 373 LoC, 4 consommateurs, très couplé home. `HeroSplit` = 100 LoC, 2 consommateurs, tokens propres, a11y 1. `HeroCentered`/`HeroFullBleed` = variants éditoriaux W6. | **Canonique générique** : `HeroSplit.astro`. **Tier 2 autorisés** : `HeroCentered.astro`, `HeroFullBleed.astro`. **Exception conservée** : `Hero.astro` uniquement pour home FR/EN. | Aucune migration immédiate car aucun non-home n’importe `Hero` aujourd’hui. Règle à verrouiller : interdiction de réutiliser `Hero.astro` hors `/` et `/en/`. | `Hero.astro` est plus spectaculaire mais trop dense et trop spécifique. `HeroSplit` tient mieux la grille 58/42 voulue par Simon, se replie mieux sur des pages templates et se standardise sans bruit visuel. |
| 🚨 | `ProofBar.astro` vs `ProofBarSection.astro` vs `MetricStrip.astro` vs `StatRow.astro` | `ProofBar` : `/`, `/en/`, `Hero.astro`, showcase. `ProofBarSection` : showcase FR. `StatRow` : `ServiceDetailTemplate`, `DetailMenuTemplate`, showcase. `MetricStrip` : aucun consommateur. | `ProofBarSection` = 75 LoC, prop-driven, FR/EN natif. `ProofBar` = 142 LoC, 4 consommateurs, très home-specific. `StatRow` = 94 LoC, 3 consommateurs, plus monumental que modulaire. `MetricStrip` = 0 consommateur direct. | **Canonique** : `ProofBarSection.astro` pour le strip multi-métriques. `StatBlock.astro` reste le companion pour les stats plus riches. `ProofBar.astro` passe en **home-only legacy**. `MetricStrip.astro` et `StatRow.astro` à éliminer. | Batcher la migration dans `ServiceDetailTemplate.astro` et `DetailMenuTemplate.astro` d’abord. Garder la home pour la fin, après validation visuelle d’un clone `ProofBarSection` enrichi. | `ProofBarSection` est plus sobre et plus uniforme. `StatRow` crie trop fort, `MetricStrip` fait utility, et le `ProofBar` home garde une belle dramaturgie mais au prix d’un couplage fort. |
| 🚨 | `CapabilityStrip.astro` vs `FeatureGrid.astro` | `CapabilityStrip` : `/`, `/en/`. `FeatureGrid` : showcase FR/EN. | `CapabilityStrip` = 342 LoC, 2 consommateurs, énorme empreinte. `FeatureGrid` = 92 LoC, 2 consommateurs, section W6 claire, même intent fonctionnel. | **Canonique** : `FeatureGrid.astro`. `CapabilityStrip.astro` à déprécier. | Remplacer sur `/` et `/en/` après maquettage visuel équivalent pour préserver la richesse home. | `CapabilityStrip` est fort mais sur-spécifique et chargé. `FeatureGrid` rend mieux l’information, garde la hiérarchie, et laisse respirer la page. |
| 🚨 | `TrustMarquee.astro` vs `SocialProof.astro` | `TrustMarquee` : `/`, `/technologies`, `/en/`, `/en/technologies`. `SocialProof` : showcase FR. | `TrustMarquee` = 23 LoC, 0 token, 4 consommateurs, marquee only. `SocialProof` = 77 LoC, 1 consommateur, mode marquee **ou** statique, kicker optionnel, meilleure extensibilité. | **Canonique** : `SocialProof.astro`. `TrustMarquee.astro` à éliminer. | Migrer home FR/EN puis `technologies/index.astro` et `en/technologies/index.astro`. | `SocialProof` garde l’effet ruban si besoin mais peut aussi redevenir sobre. `TrustMarquee` est trop unidimensionnel et n’offre aucune variante fixe. |
| 🚨 | `CtaBand.astro` vs `CtaBandSection.astro` vs `CtaFinal.astro` vs `CtaInline.astro` | `CtaBand` : 27 consommateurs directs, dont hubs FR/EN, pages secteurs, atlas, ressources et 8 templates. Les 3 sections W6 vivent surtout dans le showcase. | `CtaBandSection` = 47 LoC, `CtaInline` = 41 LoC, `CtaFinal` = 71 LoC, tous prop-driven. `CtaBand` = 55 LoC mais hardcodé, scope énorme et logique de page embarquée. | **Canonique** : `CtaFinal.astro` pour les fins de page, `CtaBandSection.astro` pour les bandes compactes, `CtaInline.astro` pour les CTA intermédiaires. `CtaBand.astro` à déprécier. | Migration par templates d’abord : `TrustLegalTemplate`, `CaseStudyTemplate`, `ServiceDetailTemplate`, `ListIndexTemplate`, `HubTemplate`, `DetailMenuTemplate`, `EssayTemplate`, `UtilityTemplate`. Puis pages directes. | `CtaBand` a une belle scène finale, mais une seule intensité. Le trio W6 crée enfin une échelle de tension cohérente et donc une uniformisation réelle. |
| 🚨 | `ProcessSteps.astro` vs `MethodTimeline.astro` | `ProcessSteps` : `CaseStudyTemplate`, `ServiceDetailTemplate`, `DetailMenuTemplate`. `MethodTimeline` : showcase FR. | `ProcessSteps` = 124 LoC, 3 consommateurs, grille fixe. `MethodTimeline` = 108 LoC, step semantics plus nettes, meilleures métadonnées et hiérarchie narrative. | **Canonique** : `MethodTimeline.astro`. `ProcessSteps.astro` à éliminer. | Migrer les 3 templates historiques vers un mapping de données W6 ; conserver `editorial/Timeline.astro` hors périmètre, son rôle restant MDX/editorial. | `MethodTimeline` lit mieux comme un process, surtout sur mobile. `ProcessSteps` fonctionne, mais sa grille rigide écrase le rythme éditorial. |
| 🚨 | `FAQ.astro` vs `FaqAccordion.astro` | `FAQ` : `/`, `/en/`. `FaqAccordion` : showcase FR. | Les deux sont token-clean. `FAQ` embarque déjà `JsonLd`/`FAQPage`. `FaqAccordion` est mieux structuré pour FR/EN et visuellement plus propre. | **Canonique visuel** : `FaqAccordion.astro`. **Contrainte** : réinjecter la logique JSON-LD de `FAQ.astro` avant suppression effective du legacy. | Créer soit un wrapper SEO autour de `FaqAccordion`, soit porter `JsonLd` dans la section. Puis migrer `/` et `/en/`. | `FaqAccordion` est plus net, plus lisible et plus moderne. `FAQ` garde aujourd’hui l’avantage SEO, pas l’avantage design. |
| ⚠️ | `FormationDetailTemplate.astro` vs `CourseDetailTemplate.astro` | `FormationDetailTemplate` : `src/pages/ecole/cours/[slug].astro`. `CourseDetailTemplate` : `src/pages/ecole/[type]/[slug].astro`. | `CourseDetailTemplate` = 693 LoC, unifie `formation/parcours/atelier/certification`, breadcrumb, Base, CTA et discriminated union. `FormationDetailTemplate` reste mono-type et legacy. | **Canonique** : `CourseDetailTemplate.astro`. `FormationDetailTemplate.astro` à déprécier. | Migrer la route legacy `src/pages/ecole/cours/[slug].astro`, puis supprimer le template mono-type si aucun alias n’est conservé. | `CourseDetailTemplate` coûte plus cher en LoC, mais il élimine la divergence future. `FormationDetailTemplate` est propre isolément, pas assez robuste comme socle. |

## Section 4 · Doublons fonctionnels suspects à valider

| Marqueur | Cas | Pourquoi ambigu | Recommandation |
|---|---|---|---|
| ✋ | `ProofBand.astro` vs `ProofBarSection.astro` / `StatBlock.astro` | `ProofBand` n’est pas juste un strip de métriques : il combine quote + attribution + chiffres. L’intent “preuve” est commun, mais la grammaire visuelle est différente. | Garder en l’état pour l’instant. À supprimer seulement si une future `TestimonialBlock` absorbe réellement la quote + metrics. |
| ✋ | `RelatedByCluster.astro` vs `RelatedCards.astro` | `RelatedByCluster` est un agrégateur dynamique cross-collection ; `RelatedCards` est un pattern de présentation en cartes. Même zone de page, intent adjacent, mais pas même source de vérité. | Ne pas fusionner brutalement. Plutôt faire de `RelatedCards` le renderer canonique et décider plus tard si `RelatedByCluster` devient un data-loader ou disparaît. |
| ✋ | `PricingTier.astro` vs `PricingTable.astro` | `PricingTier` agit comme sous-composant carte autonome ; `PricingTable` est une section tableau. Même thème pricing, pas exactement le même niveau atomique. | Conserver `PricingTier` tant qu’une landing card isolée reste utile. Si `PricingTable` devient l’unique pattern tarifaire, `PricingTier` pourra être internalisé comme sous-bloc non public. |
| ✋ | `Pyramid.astro` vs `MethodTimeline.astro` vs `Timeline.astro` | Tous racontent une méthode, mais `Pyramid` sert de signature home, `MethodTimeline` de section composable, `Timeline` d’outil editorial/MDX. | Décision manuelle Simon requise. Ma recommandation : garder `Pyramid` comme signature home si elle porte encore le récit, sinon migrer vers `MethodTimeline`. |
| ✋ | `HeroCentered.astro` / `HeroFullBleed.astro` vs `HeroSplit.astro` | Ils partagent l’intent hero, mais le doc 19 les traite comme variants Tier 2 autorisés pour pages standalone. | Ne pas les compter comme dette à éliminer. Les verrouiller comme variants licites, avec `HeroSplit` comme défaut. |

## Section 5 · Composants jamais utilisés (dead code)

### Synthèse

| Indicateur | Valeur |
|---|---:|
| Dead code direct total | 32 |
| Editorial / SVG inline | 20 |
| Molecules | 5 |
| Organisms | 6 |
| SEO | 1 |

| Path complet | Nom | Catégorie | Statut proposé | Note |
|---|---|---|---|---|
| `src/components/editorial/Sidenote.astro` | `Sidenote` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/seo/BreadcrumbSchema.astro` | `BreadcrumbSchema` | `seo` | 🔴 DEPRECATED | redondant avec `Breadcrumb.astro` qui génère déjà le `BreadcrumbList` JSON-LD |
| `src/components/svg/geometric/AcquisitionFunnel.astro` | `AcquisitionFunnel` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/CompositeArchitectureDiagram.astro` | `CompositeArchitectureDiagram` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/ContenuGeoMap.astro` | `ContenuGeoMap` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/CrmRelancesFlow.astro` | `CrmRelancesFlow` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/Dingbats.astro` | `Dingbats` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/DividerHairline.astro` | `DividerHairline` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/EditorialHairlineSet.astro` | `EditorialHairlineSet` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/GrowthSystemDiagram.astro` | `GrowthSystemDiagram` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/InfrastructureLayers.astro` | `InfrastructureLayers` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/KPIBarChart.astro` | `KPIBarChart` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/MaturityScale.astro` | `MaturityScale` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/OrnamentSection.astro` | `OrnamentSection` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/StackDiagram.astro` | `StackDiagram` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/WaimiaBadge.astro` | `WaimiaBadge` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/WaimiaMark.astro` | `WaimiaMark` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/WorkflowOrchestrationDiagram.astro` | `WorkflowOrchestrationDiagram` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/geometric/WorkflowScoring.astro` | `WorkflowScoring` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/sumie/SecteurFinanceCompta.astro` | `SecteurFinanceCompta` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/svg/sumie/TeamCollaboration.astro` | `TeamCollaboration` | `editorial` | 🟡 WIP | aucun consommateur direct dans `src/pages`, `src/components`, `src/layouts` |
| `src/components/ui/molecules/GuaranteeBadge.astro` | `GuaranteeBadge` | `molecule` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/molecules/MetricStrip.astro` | `MetricStrip` | `molecule` | 🔴 DEPRECATED | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/molecules/ProofPointInline.astro` | `ProofPointInline` | `molecule` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/molecules/TaxonomyMenu.astro` | `TaxonomyMenu` | `molecule` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/molecules/TunnelNav.astro` | `TunnelNav` | `molecule` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/organisms/HowWeShip.astro` | `HowWeShip` | `organism` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/organisms/Offices.astro` | `Offices` | `organism` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/organisms/OperatingLayer.astro` | `OperatingLayer` | `organism` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/organisms/SigBand.astro` | `SigBand` | `organism` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/organisms/WhyAIStalls.astro` | `WhyAIStalls` | `organism` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |
| `src/components/ui/organisms/WritingNotes.astro` | `WritingNotes` | `organism` | 🟡 WIP | actif non branché ou legacy ; arbitrage requis avant suppression |

## Section 6 · Plan d’élimination par batchs

| Batch | Périmètre | Pages / templates impactés | Fichiers à modifier | Risque / effort |
|---|---|---|---|---|
| Batch A | Hero family | `/`, `/en/`, showcases FR/EN | `ui/organisms/Hero.astro`, `sections/Hero*.astro`, règles DS / doc 19 | **Risque élevé** · **effort faible à moyen**. Pas de migration massive, mais impact critique sur la home. |
| Batch B | Proof metrics family | `/`, `/en/`, `ServiceDetailTemplate`, `DetailMenuTemplate`, showcases | `ui/organisms/ProofBar.astro`, `ui/molecules/MetricStrip.astro`, `ui/molecules/StatRow.astro`, `sections/ProofBarSection.astro`, `sections/StatBlock.astro`, templates concernés | **Risque moyen à élevé** · **effort moyen**. Beaucoup de valeur, mais la home doit passer en dernier. |
| Batch C | Capability family | `/`, `/en/` | `ui/organisms/CapabilityStrip.astro`, `sections/FeatureGrid.astro`, `pages/index.astro`, `pages/en/index.astro` | **Risque moyen** · **effort moyen**. Peu de fichiers, gros gain d’uniformité. |
| Batch D | Social proof family | `/`, `/en/`, `technologies/index.astro`, `en/technologies/index.astro` | `ui/organisms/TrustMarquee.astro`, `sections/SocialProof.astro`, 4 pages | **Risque faible à moyen** · **effort faible**. Très bon batch de consolidation précoce. |
| Batch E | CTA family | hubs FR/EN, secteurs, atlas, ressources + 8 templates legacy | `ui/organisms/CtaBand.astro`, `sections/CtaBandSection.astro`, `sections/CtaFinal.astro`, `sections/CtaInline.astro`, `TrustLegalTemplate.astro`, `CaseStudyTemplate.astro`, `ServiceDetailTemplate.astro`, `ListIndexTemplate.astro`, `HubTemplate.astro`, `DetailMenuTemplate.astro`, `EssayTemplate.astro`, `UtilityTemplate.astro`, pages directes | **Risque élevé** · **effort élevé**. C’est le batch le plus large, à faire quand les sections W6 sont visuellement verrouillées. |
| Batch F | Method family | `CaseStudyTemplate`, `ServiceDetailTemplate`, `DetailMenuTemplate` | `ui/molecules/ProcessSteps.astro`, `sections/MethodTimeline.astro`, templates concernés | **Risque faible à moyen** · **effort moyen**. Bon batch de démarrage car le bénéfice est clair et la surface reste contenue. |
| Batch G | FAQ / related / pricing suspects | `/`, `/en/`, `EssayTemplate`, `ConversionFunnelTemplate`, `HubTemplate`, `ServiceDetailTemplate`, `DetailMenuTemplate`, pages pricing | `seo/FAQ.astro`, `sections/FaqAccordion.astro`, `ui/molecules/RelatedByCluster.astro`, `ui/molecules/RelatedCards.astro`, `ui/molecules/PricingTier.astro`, `sections/PricingTable.astro` | **Risque moyen** · **effort moyen**. Demande un arbitrage design, pas juste du search/replace. |
| Batch H | Legacy template + schema dead code | `src/pages/ecole/cours/[slug].astro`, SEO helpers, cold assets | `templates/FormationDetailTemplate.astro`, `templates/CourseDetailTemplate.astro`, `seo/BreadcrumbSchema.astro`, composants 0-use explicitement abandonnés | **Risque faible** · **effort faible à moyen**. Meilleur batch d’ouverture pour prendre de l’élan sans casser la home. |

## Section 7 · Recommandation phase suivante

### Lecture tranchée pour Opus

| Question | Réponse |
|---|---|
| Combien de doublons à éliminer maintenant ? | **11 composants legacy** ont déjà un remplaçant explicite et peuvent entrer en plan de suppression (`BreadcrumbSchema`, `CapabilityStrip`, `CtaBand`, `FAQ`, `FormationDetailTemplate`, `MetricStrip`, `ProcessSteps`, `ProofBar`, `StatRow`, `Stub`, `TrustMarquee`). |
| Combien de cas ambigus à laisser sous contrôle manuel ? | **5 familles** (`ProofBand`, `RelatedByCluster`, `PricingTier`, `Pyramid`, variants hero Tier 2). |
| Dead code brut ? | **32 composants** sans consommateur direct, dont **20** dans la grappe editorial/SVG. |
| Effort estimé ? | **≈ 700–1200 LoC modifiées** en cumulé. Estimation Codex par surface de composants + nombre de consommateurs directs ; ce n’est pas une mesure de diff réel. |
| Batch le plus risqué visuellement ? | **Batch E (CTA family)** puis **Batch A (Hero family)**, car ils touchent la hiérarchie émotionnelle des pages signature. |
| Batch le plus rentable immédiatement ? | **Batch H** puis **Batch D** puis **Batch F**. Faible risque, forte clarification architecturale. |

### Ordre optimal d’attaque

1. **Batch H** — supprimer la dette la plus certaine : `FormationDetailTemplate` legacy + `BreadcrumbSchema` redondant + actifs 0-use explicitement abandonnés.
2. **Batch D** — migrer `TrustMarquee` vers `SocialProof` sur 4 pages ; c’est le meilleur ratio gain/risque.
3. **Batch F** — remplacer `ProcessSteps` par `MethodTimeline` dans 3 templates legacy.
4. **Batch C** — migrer `CapabilityStrip` vers `FeatureGrid` sur home FR/EN après mock visuel strict.
5. **Batch B** — rationaliser la famille preuves/stats ; garder la home pour la fin du batch.
6. **Batch G** — traiter `FAQ`/`Related`/`Pricing` seulement après décision finale sur le rendu canonique.
7. **Batch E** — grand ménage CTA quand `CtaFinal`, `CtaBandSection` et `CtaInline` sont visuellement figés en showcase.
8. **Batch A** — verrouiller la doctrine hero en dernier, car la home est la zone la plus sensible du système.

### Décision recommandée

- **À supprimer sans débat** : `BreadcrumbSchema`, `MetricStrip`, `ProcessSteps`, `StatRow`, `TrustMarquee`, `FormationDetailTemplate`, `Stub`.
- **À migrer puis supprimer** : `CapabilityStrip`, `ProofBar`, `CtaBand`, `FAQ`.
- **À conserver comme variants autorisés** : `HeroCentered`, `HeroFullBleed`, `Hero.astro` home-only, `ProofBand`, `Timeline`, `PricingTier` tant qu’il reste un usage carte autonome.
