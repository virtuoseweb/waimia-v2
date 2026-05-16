# 23 — Audit liens cross-collection sans 404

Audit lecture-seule · généré 2026-05-16 · CWD `apps/web`

---

## 1. Inventaire des références cross-collection

### 1.1 Glossary · `related_terms`

**30 entrées** · **109 références** au total

Le champ `related_terms` est `z.array(z.string())` (pas de `reference()` Astro → pas de validation de build).

Slugs existants dans `content/glossary/` :

```
agent-ia            agentic-workflow      ai-act              ai-readiness
autonomous-agent    context-window        cost-per-task       data-mesh
data-pipeline       data-quality          embeddings          fine-tuning
function-calling    gdpr-ia               gouvernance-ia      human-in-the-loop
kpi-ia              llm-large-language-model  mcp-model-context-protocol
pii-anonymization   pilot-vs-prod         prompt-engineering  prompt-injection
rag                 roi-ia                system-prompt       tco-ia
temperature-llm     tokens-llm            vector-database
```

**Référence orpheline détectée (2 occurrences) :**

| Source | Term référencé | Statut |
|--------|---------------|--------|
| `glossary/agent-ia.mdx` | `workflow-ia` | ❌ slug inexistant |
| `glossary/roi-ia.mdx` | `workflow-ia` | ❌ slug inexistant |

Tous les autres 107 `related_terms` pointent vers des slugs existants. ✅

---

### 1.2 Offres · `relatedTechnologies` et `caseStudies`

Ces champs sont définis dans le schéma (`z.array(z.string()).default([])`) mais **tous vides** dans les 8 fichiers MDX actuels. Pas de références à valider.

```
activation-ia, application-ia-pme, claude-cowork, composable-pilot,
growth-intelligence, growth-system-ia, infrastructure-ia, productivite-operationnelle-ia
→ relatedTechnologies: []  caseStudies: []  (dans tous)
```

---

### 1.3 Solutions · `relatedSolutions`, `relatedOffres`, `relatedCases`, `relatedSecteurs`

8 fichiers MDX — tous les champs cross-ref sont vides `[]`. Aucune référence à valider.

---

### 1.4 Blog · `relatedSolutions`, `relatedOffres`, `relatedCases`, `relatedPosts`

6 fichiers MDX. Une seule référence populée :

| Fichier blog | Champ | Valeur | Statut |
|---|---|---|---|
| `automatiser-relances-b2b-sans-sdr-guide-cabinet-conseil.mdx` | `relatedSolutions` | `crm-relances-ia` | ✅ `content/solutions/crm-relances-ia.mdx` existe |

Tous les autres champs sont vides.

---

### 1.5 Tags (taxonomie libre)

Les tags sont `z.array(z.string().regex(/^[a-z0-9-]+$/))` — pas de validation cross-collection. Utilisés comme filtres de catégorie, non comme liens vers une collection.

Compteurs par collection :

| Collection | Fichiers avec tags |
|---|---|
| offres | 8 |
| solutions | 8 |
| blog | 7 |
| commerce | 5 |
| formations / courses | 3+3 |
| field-notes | 3 |
| technologies | 2 |
| livres-blancs | 1 |
| cookbooks | 1 |
| veille-ia | 1 |

Valeurs types dans offres : `"acquisition-ia"`, `"productivite-ia"`, `"data-ia"`, `"gouvernance-ia"`, `"crm"`, `"contenu-seo-geo"`, `"pilotage-ia"`.

---

### 1.6 Tunnels · `offre_slug`

3 slugs utilisés :

| Fichier tunnel | `offre_slug` | Statut |
|---|---|---|
| `activation-ia/1-4.mdx` | `activation-ia` | ✅ `content/offres/activation-ia.mdx` |
| `growth-system-1-4.mdx` | `growth-system-ia` | ✅ `content/offres/growth-system-ia.mdx` |
| `site-web-ia-tunnel-1-4.mdx` | `site-web-ia` | ⚠️ Pas de `content/offres/site-web-ia.mdx` — mais page statique `pages/offres/site-web-ia.astro` existe et le template tunnel n'interroge pas la collection offres (label map hardcodé). Route fonctionnelle. |

---

### 1.7 Secteurs · `caseRef`

| Fichier | `caseRef` | Statut |
|---|---|---|
| `finance-compta.mdx` | `caserne` | ✅ `pages/cas/caserne.astro` (page statique) |
| `industrie.mdx` | `caserne` | ✅ idem |
| `services-b2b.mdx` | `plateau` | ✅ `pages/cas/plateau.astro` + `content/cases/plateau.mdx` |

---

### 1.8 Author references (typed `reference('authors')`)

Un seul auteur : `simon-beros`. Référencé dans `cases`, `blog`, `livres-blancs`, `cookbooks`, `veilleIA`, `formations`. Le fichier `content/authors/simon-beros.mdx` existe. ✅

---

### 1.9 Hrefs en dur dans les fichiers MDX (body)

| Fichier | Href | Statut |
|---|---|---|
| `blog/automatiser-relances-b2b...mdx` | `/contact` | ✅ |
| `blog/automatiser-relances-b2b...mdx` | `/offres/growth-system-ia` | ✅ |
| `field-notes/composable-adoption.mdx` | `/offres/composable-pilot` (texte inline, pas `<a>`) | ✅ route via `offres/[...slug].astro` |

---

## 2. Analyse des hrefs en dur dans les pages standalone

### 2.1 Pages `src/pages/agence/`

| Fichier | Href | Statut |
|---|---|---|
| `about.astro` | `/contact` | ✅ |
| `docs.astro` | `/technologies/virtuoseos` | ✅ (`content/technologies/virtuoseos.mdx`) |
| `methode.astro` | `/contact` | ✅ |
| `design-system.astro` | `/`, `/manifesto`, `/atlas`, `/test-composable` | ✅ tous |
| `design-system.astro` | `/bienvenue/audit`, `/404`, `/agence/trust-center` | ✅ tous |
| `design-system.astro` | `/cas/plateau`, `/offres/revops`, `/solutions` | ✅ tous |
| `design-system.astro` | `/ressources/blog/brain-circuit`, `/ressources` | ✅ tous |
| `design-system.astro` | `/technologies`, `/equipe`, `/ecole` | ✅ tous |
| `design-system.astro` | `/offres/site-web-ia-landing`, `/offres` | ✅ tous |

### 2.2 Pages `src/pages/index.astro`

Utilise `flh()` (helper i18n) — les hrefs sont générés dynamiquement. Routes impliquées : `/contact`, `/console`, `/ressources/cas/[slug]`, `/ressources/blog`. Toutes valides. ✅

### 2.3 `src/pages/manifesto.astro` et `src/pages/contact.astro`

Aucun href interne absolu codé en dur. ✅

### 2.4 Sitemap principal (`src/data/sitemap.ts`)

C'est la source de vérité pour le mega-menu et le footer. Voir section 3.

---

## 3. Références 404 confirmées

### 3.1 Mécanisme catch-all

Le fichier `src/pages/[...slug].astro` sert des **stubs éditoriaux** pour les routes non encore construites. La liste des routes couvertes est déclarée explicitement dans `getStaticPaths()`. Toute route **absente** de cette liste ET sans page dédiée → **404**.

Routes stub couvertes (non-exhaustif, sélection) :
- `/technologies/claude-code`, `/technologies/claude-surfaces`, `/technologies/integrations-office`, `/technologies/inference`, `/technologies/open-source-models`, `/technologies/rag-prive`, `/technologies/fine-tuning`, `/technologies/frameworks`, `/technologies/no-code`, `/technologies/observability`
- `/agence` (hub stub)
- `/ressources/cas`, `/ressources/cas/plateau`, `/ressources/cas/halcyon`, `/ressources/cas/northbound`, `/ressources/cas/caserne`, `/ressources/cas/virtuoseos`
- `/solutions/ventes-marketing`, `/solutions/it-engineering`, etc.
- `/offres/claude-cowork`, `/offres/claude-skills`, etc.

### 3.2 404 en production (navigation principale)

| # | Href | Référencé dans | Cause |
|---|---|---|---|
| **1** | `/ressources/temoignages` | `src/data/sitemap.ts` MM_RESOURCES mega-menu col 1 | Route correcte = `/ressources/testimonials` · typo dans sitemap |
| **2** | `/ressources/outils` | `src/data/sitemap.ts` FOOTER_COLS col 4 | Pas d'`index.astro` dans `pages/ressources/outils/`, absent du catch-all |
| **3** | `/ressources/newsletter` | `src/data/sitemap.ts` FOOTER_COLS col 4 | Aucune route créée, absent du catch-all |

### 3.3 Orphelins glossary (mineurs)

| # | Slug référencé | Référencé dans | Impact |
|---|---|---|---|
| **4** | `workflow-ia` | `glossary/agent-ia.mdx` `related_terms` | Lien cassé dans la sidebar "termes liés" si rendu côté UI |
| **4** | `workflow-ia` | `glossary/roi-ia.mdx` `related_terms` | idem |

### 3.4 Zone DEV uniquement (non bloquants en production)

La section dev du footer (`{import.meta.env.DEV && ...}`) contient des hrefs vers :
- `/ressources/cas/halcyon`, `/ressources/cas/northbound`, `/ressources/cas/caserne` → catch-all stubs, visibles uniquement en dev
- `/solutions/ventes-marketing`, `/solutions/it-engineering` → catch-all stubs
- `/technologies/claude-code`, `/technologies/rag-prive` → catch-all stubs

Ces liens ne s'affichent **jamais en production**. Pas d'action requise.

---

## 4. Recommandations par priorité

### P1 · Critique — Production, navigation principale

**Fix 1 — `/ressources/temoignages` → `/ressources/testimonials`**

```
Fichier : src/data/sitemap.ts · MM_RESOURCES · col 1 · item 2
Ligne   : { href: '/ressources/temoignages', ...}
Fix     : changer en { href: '/ressources/testimonials', ...}
```
La route `/ressources/testimonials/` existe avec `index.astro` et `[slug].astro`. ✅

**Fix 2 — `/ressources/newsletter`**

Deux options :
- A) Créer `src/pages/ressources/newsletter/index.astro` (page index newsletter)
- B) Ajouter `'ressources/newsletter'` dans le catch-all `[...slug].astro` (stub temporaire)
- C) Pointer sur la page bienvenue newsletter existante : `href: '/bienvenue/newsletter'`

Option C recommandée si la page dédiée n'existe pas encore.

**Fix 3 — `/ressources/outils`**

Deux options :
- A) Créer `src/pages/ressources/outils/index.astro` (liste des outils)
- B) Ajouter `'ressources/outils'` dans le catch-all (stub temporaire)

L'outil `content/outils/calculateur-roi-ia.mdx` existe, `outils/[...slug].astro` génère la page détail. L'index manque seulement.

---

### P2 · Mineur — Glossary `related_terms` orphelins

**Fix 4 — `workflow-ia` non défini**

Deux options :
- A) Créer `content/glossary/workflow-ia.mdx` (nouvelle entrée)
- B) Remplacer `"workflow-ia"` par `"agentic-workflow"` dans `agent-ia.mdx` et `roi-ia.mdx` (slug existant sémantiquement proche)

Option B si `workflow-ia` est un doublon d'`agentic-workflow`. Option A si c'est un concept distinct méritant sa propre page SEO.

---

### P3 · Champs cross-ref vides (dette future)

Les champs `relatedTechnologies`, `caseStudies`, `relatedOffres`, `relatedCases`, `relatedSecteurs` sont tous vides dans offres et solutions. Ces champs devront être peuplés pour le maillage interne SEO/GEO. Quand peuplés, **aucune validation de build** ne vérifiera que les slugs existent — prévoir un script de vérification ou migrer vers `reference()` Astro.

---

### P4 · Tunnel `site-web-ia` — risque futur

`content/tunnels/site-web-ia-tunnel-*.mdx` référence `offre_slug: "site-web-ia"` mais aucun `content/offres/site-web-ia.mdx` n'existe. La page tunnel fonctionne car elle utilise un label map hardcodé. Si un composant futur fait `getEntry('offres', entry.data.offre_slug)`, il recevra `undefined`. À corriger quand la collection offres sera complète.

---

## 5. Récapitulatif chiffré

| Catégorie | Total refs audités | Orphelins / 404 |
|---|---|---|
| Glossary `related_terms` | 109 | **2** (`workflow-ia` × 2) |
| Blog `relatedSolutions` | 1 (peuplée) | 0 |
| Offres `relatedTechnologies` | 0 (vides) | — |
| Solutions `caseStudies` | 0 (vides) | — |
| Tunnels `offre_slug` | 3 | 0 (fonctionnel) |
| Secteurs `caseRef` | 3 | 0 |
| Author `reference()` | ~15 | 0 |
| MDX body hrefs | 3 | 0 |
| Sitemap nav hrefs (prod) | ~60 | **3** (voir §3.2) |
| Footer dev hrefs (dev-only) | ~12 | 0 (stubs intentionnels) |

**Total 404 production : 3 routes** · **Total orphelins glossary : 1 slug (2 refs)**
