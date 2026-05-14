---
title: V10 · Audit visuel page-par-page Waimia
date: 2026-05-14
methode: Human-in-the-loop strict · Validation page par page via Chrome MCP local
philosophie: WAIMIA — DESIGN OPERATING SYSTEM V2 (Editorial Tech × Swiss × Premium Minimalism)
---

# V10 · Audit visuel page-par-page

## Principe

- **Une seule page à la fois** — on ne passe à la suivante que quand la courante est validée par Simon
- **Test visuel local** via Chrome MCP — screenshots avant/après, hover sur items/FAQs/images
- **FR + EN parité** vérifiée pour chaque page (parfois confusion historique : page FR rendant EN ou inverse, parfois templates dupliqués)
- **Patterns observés** — repérer composants à designs divergents pour harmoniser (cohérence univers)
- **Hero above-the-fold** : effets limités pour performance instantanée
- **Hydratation islands** : vérifier que les `client:*` sont bien hydratés sans bloquer le rendu
- **Props vs inline** : minimiser le contenu hardcodé dans le template, maximiser les props pour dynamique
- **Plus d'images + SVG éditoriaux** (références A24/Apple/Acne/Kinfolk)

## Critères de validation par page

Chaque page doit cocher TOUS ces critères avant passage à la suivante :

- [ ] **GEO** : title + description + JSON-LD adapté au type de page
- [ ] **Conversion** : CTAs hiérarchisés, primaire visible, ratio Mode A/B respecté
- [ ] **Histoire** : narration cohérente avec la promesse Waimia (anti-théâtre, livraison)
- [ ] **Copywriting** : FR natif premium + EN natif premium (pas littéral, intelligent)
- [ ] **Inspiration** : références éditoriales A24/Kinfolk/Apple appliquées
- [ ] **Design DS V2** : palette stricte, terracotta restraint, typo hiérarchie, spacing scale 4/8/12/16/24/32/48/64/96/128/160
- [ ] **UI/UX** : breadcrumb, navigation logique, hover states sobres, accessibility WCAG
- [ ] **Editorial** (Mode A) ou **Conversion** (Mode B) selon nature
- [ ] **Performance** : islands hydratés correctement, hero instantané, lazy below-fold
- [ ] **Props bien câblées** : contenu structuré, dynamique, pas de hardcoded inline lourd
- [ ] **FR + EN parité** : si page bilingue, les deux versions miroir testées
- [ ] **Images + SVG** : présence éditoriale suffisante, pas de placeholder

---

## Pages visibles dans le HEADER

Ordre du travail : on traite dans cet ordre, validation Simon obligatoire entre chaque.

### 1. Homepage `/`  ⬅️ **EN COURS**

- **Nature** : Page statique (Mode A 70/30 editorial/conversion)
- **Slug FR** : `/`
- **Slug EN** : `/en`
- **Page miroir EN** : `apps/web/src/pages/en/index.astro` (page séparée — à vérifier parité)
- **Fichier** : `apps/web/src/pages/index.astro`
- **Statut** : 🔴 NON VALIDÉ
- **Issues V9-AD2/AH connues** :
  - Bug H1 invisible (fixé V9-AH1)
  - DEV INDEX visible prod (fixé V9-AH2)
  - Switcher A/B/C/✦ flottant (fixé V9-AH2)
  - CTA navbar desktop manquant (fixé V9-AH4)
  - FR / EN → FR · EN (fixé V9-AH4)
  - Point turquoise CASE 03 Northbound (non reproductible code, à vérifier visuellement)
  - "Stop le théâtre.Câbler." espace (fixé V9-AH3)
  - Métriques homepage copywriting (fixé V9-AH3)
- **À tester visuellement** : Hero reveal mask-up, marquee clients, sections services/pyramid/cases, FAQ, BookSession, footer

### 2. Solutions `/solutions` (mega-menu)

- **Nature** : Hub page (Mode mixte 50/50)
- **Slug FR** : `/solutions`
- **Slug EN** : ⚠️ pas de `/en/solutions` actuellement (à confirmer / créer)
- **Fichier** : `apps/web/src/pages/solutions/index.astro`
- **Statut** : 🔴 NON VALIDÉ
- **Sub-pages mega-menu** :
  - `/solutions/acquisition-ia`
  - `/solutions/crm-relances-ia`
  - `/solutions/contenu-seo-geo-ia`
  - `/solutions/productivite-ia`
  - `/solutions/support-client-ia`
  - `/solutions/finance` (sectoriel ?)
  - `/solutions/fintech` (sectoriel ?)
  - `/solutions/site-web-ia-pme` (à clarifier vs /offres/site-web-ia)
- **Template** : `SolutionsDetailTemplate.astro` (utilisé par sub-pages)

### 3. Offres `/offres` (mega-menu)

- **Nature** : Hub pyramide (Mode A 70/30)
- **Slug FR** : `/offres`
- **Slug EN** : ⚠️ pas de `/en/offres`
- **Fichier** : `apps/web/src/pages/offres/index.astro`
- **Statut** : 🔴 NON VALIDÉ
- **Sub-pages** :
  - 7 pages utilisant `OffresDetailTemplate` (activation-ia, application-ia-pme, claude-cowork, growth-intelligence, growth-system-ia, infrastructure-ia, productivite-operationnelle-ia)
  - 3 pages atypiques : `/offres/conseil` (HubTemplate), `/offres/revops` (ServiceDetailTemplate), `/offres/audit-maturite-ia` (custom)
  - `/offres/site-web-ia` (ConversionFunnelTemplate) + `/offres/site-web-ia-landing` (single-page) + `/offres/site-web-ia-tunnel/{,mecanique,preuves,conversion}` (tunnel 4 pages)

### 4. Cas clients `/cas` (mega-menu)

- **Nature** : Hub portfolio (Mode A editorial)
- **Slug FR** : `/cas`
- **Slug EN** : ⚠️ pas de `/en/cas`
- **Fichier** : `apps/web/src/pages/cas/index.astro`
- **Statut** : 🔴 NON VALIDÉ
- **Sub-pages** : 5 cas (plateau, halcyon, northbound, caserne, virtuoseos)
- **Template** : `CaseStudyTemplate.astro`
- **Issues connues** : H1 plateau tronqué (fixé V9-AH3 suite), point turquoise CASE 03 (à investiguer visuellement)

### 5. Ressources `/ressources` (mega-menu)

- **Nature** : Hub éditorial (Mode A)
- **Slug FR** : `/ressources`
- **Slug EN** : ⚠️ pas de `/en/ressources`
- **Fichier** : `apps/web/src/pages/ressources/index.astro`
- **Statut** : 🔴 NON VALIDÉ
- **Sub-routes** :
  - `/ressources/blog` + `/ressources/blog/[...slug]` (dynamic, Content Collection blog)
  - `/ressources/cas` (alias ? ou redondant avec `/cas`)
  - `/ressources/cookbooks` + `/ressources/cookbooks/[...slug]`
  - `/ressources/livres-blancs` + `/ressources/livres-blancs/[...slug]`
  - `/ressources/veille-ia` + `/ressources/veille-ia/[...slug]`
  - `/ressources/outils` + `/ressources/outils/[...slug]`
  - `/ressources/academy`, `/ressources/changelog`
  - `/ressources/silo/[...slug]`, `/ressources/tag/[...slug]`, `/ressources/categorie/[...slug]`

### 6. L'Agence `/agence` (mega-menu)

- **Nature** : Hub institutionnel (Mode A)
- **Slug FR** : `/agence`
- **Slug EN** : ⚠️ pas de `/en/agence`
- **Fichier** : ⚠️ à vérifier (`agence/index.astro` ?)
- **Statut** : 🔴 NON VALIDÉ
- **Sub-pages** :
  - `/agence/about`
  - `/agence/methode`
  - `/agence/trust-center`
  - `/agence/governance`
  - `/agence/docs`
  - `/agence/design-system`
  - `/agence/careers`

### 7. CTA "Réserver un audit" → `/contact`

- **Nature** : Page conversion (Mode B 30/70)
- **Slug FR** : `/contact`
- **Slug EN** : ⚠️ `/en/contact` (à vérifier)
- **Fichier** : `apps/web/src/pages/contact.astro`
- **Statut** : 🔴 NON VALIDÉ

### 8. Logo → Homepage (déjà couvert #1)

### 9. Switcher FR · EN

- **FR** : `lang === 'fr'` → URL FR
- **EN** : `lang === 'en'` → URL EN
- **Issue** : confusion potentielle pages FR-only vs pages EN miroir

---

## Pages EN existantes (audit V9-AC1)

```
apps/web/src/pages/en/index.astro
apps/web/src/pages/en/manifesto.astro
apps/web/src/pages/en/atlas.astro
apps/web/src/pages/en/console.astro
apps/web/src/pages/en/bienvenue/newsletter.astro
apps/web/src/pages/en/bienvenue/livre-blanc.astro
```

**Gap massif identifié** : seulement 6 pages EN miroir alors que le site FR a 60+ pages. À traiter au fil des audits page-par-page.

---

## Pages hors header (à auditer après)

- `/manifesto` + `/en/manifesto`
- `/atlas` + `/en/atlas`
- `/console` + `/en/console`
- `/equipe`
- `/secteurs` + sub-pages
- `/technologies` + sub-pages
- `/bienvenue/*` (thank-you pages post-conversion)
- `/archive`, `/404`

---

## Composants partagés à harmoniser (patterns observés)

À documenter ici au fur et à mesure des audits. Détecter les divergences de design entre composants similaires pour garder le meilleur et réutiliser.

| Pattern | Fichiers concernés | Status | Décision |
|---|---|---|---|
| _(à remplir au fil de l'audit)_ | | | |

---

## Workflow validation par page

1. Screenshot initial (avant fixes) via Chrome MCP local
2. Listing exhaustif des issues par page (design, copywriting, UX, perfo, FR/EN, images/SVG)
3. Discussion avec Simon, validation des fixes prioritaires
4. Fixes appliqués (Sonnet si > 20 LoC, Opus surgical sinon)
5. Re-test visuel — screenshots après
6. Simon valide ou demande ajustements
7. Quand Simon confirme **"validé"** : statut → ✅ VALIDÉ, passage à la page suivante
8. Mise à jour de ce doc avec l'horodatage de validation

---

## Légende statuts

- 🔴 **NON VALIDÉ** : pas encore commencé ou en cours, fixes à appliquer
- 🟡 **EN REVIEW** : fixes appliqués, attente validation visuelle Simon
- ✅ **VALIDÉ** : Simon a confirmé, page finale, prête pour prod
- 🟠 **BLOQUÉ** : decision report ouverte, en attente arbitrage

---

## Score global session V10

- Pages validées : 0 / ~70
- Templates validés : 0 / 14
- Composants harmonisés : 0
- FR + EN parité : 6 EN miroir / 60+ FR
