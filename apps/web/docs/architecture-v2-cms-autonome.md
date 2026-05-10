# Architecture v2 · CMS éditorial autonome

> **Statut** : Plan figé 2026-05-10. Reprise post-reset quota.
> **Préreq** : Architecture v1 livrée (commits e35a9e3 → 3ebf260, 8 missions multi-agents).
> **Périmètre v2** : pages auteur (style darioamodei.com) + taxonomies (cluster/silo/tag) + routines Claude pour autonomie éditoriale + sources d'autorité + Schema.org complet.

---

## 1. Vision

Waimia v1 est un site avec un copy de qualité. Waimia v2 est une **machine éditoriale autonome** :

- **Auteurs** sont des entités first-class (CV intégré, bibliographie, social) référencées partout
- **Taxonomies** (catégorie / cluster / tag) pilotent le maillage interne automatique
- **Routines Claude** (skills) génèrent articles / newsletter / posts LinkedIn / carousel selon un calendrier éditorial
- **Sources d'autorité** sont conventionnées (state/university/journal/enterprise/research) avec citations Schema.org
- **Schema.org JSON-LD** complet par type de page (Person, Article, HowTo, Book, NewsArticle, CollectionPage)

Règle fondatrice : **un slug = une référence**. Toute mention d'un auteur, d'une catégorie, d'un cluster ou d'un tag passe par un slug typé. Les pages se mettent à jour automatiquement par auto-jointure dans les loaders.

---

## 2. Collection `authors`

```ts
const authors = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/authors' }),
  schema: z.object({
    ...baseFields,                           // title_fr/en = nom complet, slug régex kebab-case
    role_fr: z.string(),                     // "CEO Waimia · architecte systèmes IA PME"
    role_en: z.string(),
    bio_fr: z.string().min(120),             // 1-3 paragraphes narratifs
    bio_en: z.string().min(120),
    photo: z.string().optional(),            // /authors/<slug>.jpg
    photoAlt_fr: z.string().optional(),
    photoAlt_en: z.string().optional(),

    // CV intégré (style darioamodei)
    education: z.array(z.object({
      year: z.string(),                      // "2018-2023" ou "2023"
      institution: z.string(),               // "École Polytechnique"
      degree_fr: z.string(),
      degree_en: z.string(),
      url: z.string().url().optional(),
    })).default([]),

    experience: z.array(z.object({
      year: z.string(),
      role_fr: z.string(),
      role_en: z.string(),
      company: z.string(),
      companyUrl: z.string().url().optional(),
      summary_fr: z.string().optional(),
      summary_en: z.string().optional(),
    })).default([]),

    publications: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
      venue: z.string(),                     // "ACM CHI 2023" / "arXiv:2402.01234"
      year: z.string(),
      type: z.enum(['paper', 'talk', 'book', 'podcast', 'press']).optional(),
    })).default([]),

    awards: z.array(z.object({
      year: z.string(),
      label_fr: z.string(),
      label_en: z.string(),
    })).default([]),

    // Expertise / domaines
    expertise: z.array(z.string()).default([]),  // ['IA générative PME', 'RevOps', 'data piloting']

    // Réseaux sociaux
    social: z.object({
      x: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      website: z.string().url().optional(),
      email: z.string().email().optional(),
      bluesky: z.string().url().optional(),
      mastodon: z.string().url().optional(),
    }).default({}),

    // Status / visibilité
    status: z.enum(['active', 'alumni', 'guest']).default('active'),
    featured: z.boolean().default(false),
  }),
});
```

### MDX type pour Simon Beros (exemple)

```mdx
---
title_fr: "Simon Beros"
title_en: "Simon Beros"
description_fr: "Fondateur Waimia. 12 ans d'IA appliquée aux PME. Acquisition, CRM, productivité."
description_en: "Waimia founder. 12 years of AI applied to SMBs. Acquisition, CRM, productivity."
slug: "simon-beros"
publishedAt: 2026-05-10
role_fr: "Fondateur · architecte systèmes IA PME"
role_en: "Founder · SMB AI systems architect"
bio_fr: |
  Simon dirige Waimia depuis Paris et Genève. Son obsession : transformer
  l'IA générative en machines business pour les PME — pas en démos.

  Avant Waimia, il a passé 12 ans à câbler des systèmes RevOps et data
  pour des SaaS B2B et des cabinets de conseil. Il écrit en français,
  lit la documentation Stripe, et livre du code le mardi.
photo: "/authors/simon-beros.jpg"
expertise:
  - "Systèmes IA pour PME"
  - "RevOps & acquisition"
  - "Pilotage data temps réel"
  - "Claude / Anthropic stack"
education:
  - year: "2010-2013"
    institution: "École supérieure d'ingénieurs"
    degree_fr: "Master Informatique & Systèmes"
    degree_en: "Master CS & Systems"
experience:
  - year: "2024-présent"
    role_fr: "Fondateur"
    role_en: "Founder"
    company: "Waimia"
    companyUrl: "https://waimia.com"
  - year: "2021-2024"
    role_fr: "Head of Product"
    role_en: "Head of Product"
    company: "[Précédent employeur]"
publications:
  - title: "L'IA dans Excel n'est plus un gadget"
    url: "https://waimia.com/ressources/blog/excel-ia-pme"
    venue: "Waimia Blog"
    year: "2026"
    type: "paper"
social:
  linkedin: "https://www.linkedin.com/in/simonberos/"
  x: "https://x.com/simonberos"
  github: "https://github.com/simonberos"
  email: "simon@waimia.com"
status: "active"
featured: true
---

[Bio long-form en MDX, sections h2 pour Manifeste personnel, Pourquoi Waimia,
Méthode de travail, etc. Affiché sur la page /equipe/simon-beros sous le hero.]
```

---

## 3. Migration refs `author` dans toutes les collections

### Avant (v1)

```ts
// blog.schema
author: z.object({
  name: z.string(),
  url: z.string().url().optional(),
  bio_fr: z.string().optional(),
  bio_en: z.string().optional(),
})
```

### Après (v2)

```ts
import { reference } from 'astro:content';

// Pour blog, cookbooks, livresBlancs, cas, veilleIA
author: reference('authors'),                                // slug obligatoire
contributors: z.array(reference('authors')).default([]),     // co-auteurs optionnels
```

**Bénéfices** :
- Astro valide au build que le slug auteur existe
- Auto-complétion TypeScript
- Évite les noms divergents ("Simon Beros" vs "S. Beros")
- Auto-jointure dans les loaders (`getEntry('authors', entry.data.author.id)`)

---

## 4. Template `AuthorPageTemplate.astro`

Inspiré de darioamodei.com mais adapté DA Waimia (paper, ink, accent, font-display, font-mono).

### Structure (sections sequentiel scroll)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO Author                                                 │
│   - Nom display 64-96px                                     │
│   - Role italique muted                                     │
│   - Bio 2-3 paragraphes (max 600 mots, font-display 18-22)  │
│   - Photo carrée 240×240 ou 320×320 (optionnelle)          │
├─────────────────────────────────────────────────────────────┤
│ ESSAYS / Long-form    (collection blog filter category)     │
│   - h2 "Essays"                                             │
│   - <ul><li><a> par article (titre + date)                  │
├─────────────────────────────────────────────────────────────┤
│ SHORT POSTS           (collection blog filter Field Note)   │
├─────────────────────────────────────────────────────────────┤
│ COOKBOOKS             (collection cookbooks)                │
├─────────────────────────────────────────────────────────────┤
│ LIVRES BLANCS         (collection livresBlancs)             │
├─────────────────────────────────────────────────────────────┤
│ VEILLE IA             (collection veilleIA)                 │
├─────────────────────────────────────────────────────────────┤
│ CV (section paper-2 collapsible)                            │
│   - Education timeline                                      │
│   - Experience timeline                                     │
│   - Awards row                                              │
├─────────────────────────────────────────────────────────────┤
│ PUBLICATIONS EXTERNES                                       │
│   - Liste links externes (papers, talks, podcasts)         │
├─────────────────────────────────────────────────────────────┤
│ EXPERTISE PILLS                                             │
├─────────────────────────────────────────────────────────────┤
│ SOCIAL ROW                                                  │
│   - LinkedIn / X / GitHub / Email (icons + labels)          │
├─────────────────────────────────────────────────────────────┤
│ JSON-LD: Person + ProfilePage + BreadcrumbList              │
└─────────────────────────────────────────────────────────────┘
```

### Loader `/equipe/[...slug].astro`

```astro
---
import { getEntry, getCollection, render } from 'astro:content';
import AuthorPageTemplate from '../../components/templates/AuthorPageTemplate.astro';

const { slug } = Astro.params;
if (!slug) return Astro.redirect('/404');
const entry = await getEntry('authors', slug);
if (!entry) return Astro.redirect('/404');
if (entry.data.seo?.noindex) return Astro.redirect('/404');

const { Content } = await render(entry);

// Auto-jointure : tous les contenus de cet auteur
const [allBlog, allCookbooks, allLivresBlancs, allVeille] = await Promise.all([
  getCollection('blog'),
  getCollection('cookbooks'),
  getCollection('livresBlancs'),
  getCollection('veilleIA'),
]);

const filterByAuthor = (entries) =>
  entries.filter((e) => e.data.author?.id === slug)
         .sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime());

const essays = filterByAuthor(allBlog).filter((e) => e.data.category === 'Essay');
const shortPosts = filterByAuthor(allBlog).filter((e) => e.data.category === 'Field Note');
const cookbooks = filterByAuthor(allCookbooks);
const livresBlancs = filterByAuthor(allLivresBlancs);
const veilleIA = filterByAuthor(allVeille);
---
<AuthorPageTemplate
  author={entry.data}
  essays={essays}
  shortPosts={shortPosts}
  cookbooks={cookbooks}
  livresBlancs={livresBlancs}
  veilleIA={veilleIA}
>
  <Content />
</AuthorPageTemplate>
```

### Hub `/equipe/index.astro`

Liste des auteurs avec :
- Photo + nom + role
- Bio courte (description_fr)
- 3 derniers articles publiés
- Badges expertise

---

## 5. Composants dynamiques (réutilisables, Astro pur)

### `<AuthorByline author={slug} date readingTime />`
Top de chaque article. Pattern :
```
[photo 32px] Nom auteur · 10 mai 2026 · 7 min lecture
```
Lien vers `/equipe/<slug>`.

### `<AuthorCard author={slug} variant="mini|full" />`
- `mini` : 1 ligne photo + nom + role
- `full` : 200x200 photo + nom + role + bio courte + expertise pills + social row

### `<ArticlesByAuthor author={slug} limit={5} sortBy="date|relevance" />`
Liste numérotée des articles d'un auteur, triable.

### `<RelatedByCluster cluster={slug} exclude={currentId} limit={3} />`
Pour le silo content. Auto-related dans le même cluster, exclut la page courante.

### `<LatestInCategory category={slug} limit={5} />`
Pour les hubs catégorie + sidebar article.

### `<TagPills tags={array} />`
Header article + sidebar.

### `<TaxonomyMenu />`
Hub `/ressources` avec drill-down catégorie/cluster/tag.

### `<DarkModeToggle />` (island React minimaliste)
Toggle paper/ink. Pattern darioamodei. localStorage.

---

## 6. Architecture taxonomies

### Frontmatter étendu (blog, cookbooks, livresBlancs, veilleIA, cas)

```yaml
category: 'acquisition' | 'crm' | 'contenu-seo-geo' | 'productivite' | 'support' | 'pilotage'
cluster: 'pilier-acquisition-pme-2026'   # silo content cluster (1 pillar + N clusters)
tags: ['hubspot', 'lead-scoring', 'nurturing-ai', 'sdr-replacement']

# Sources d'autorité (cf section 8)
sources:
  - name: "INSEE — PME en France 2026"
    url: "https://www.insee.fr/..."
    type: "state"
    publishedAt: 2026-03-15

# Liens cross-collection
relatedSolutions: ['acquisition-ia']    # slugs solutions
relatedOffres: ['growth-system-ia']     # slugs offres
relatedCases: ['plateau']               # slugs cas
relatedSecteurs: ['services-b2b']       # slugs secteurs
```

### Pages auto-générées (loaders dynamiques)

| Route | Loader | Content |
|---|---|---|
| `/ressources/categorie/[...slug].astro` | filtre `getCollection('blog' \| 'cookbooks' \| ...).where(category)` | hub catégorie + cluster pillar du cluster principal |
| `/ressources/silo/[...slug].astro` | filtre `where(cluster)` | silo content : 1 pillar + N clusters |
| `/ressources/tag/[...slug].astro` | filtre `where(tags.includes)` | tous contenus avec ce tag |
| `/equipe/[...slug].astro` | `getEntry('authors', slug)` + auto-jointure | page auteur (cf section 4) |

### Convention silo content

Un cluster (ex `pilier-acquisition-pme-2026`) contient :
- **1 article pillar** (long-form, 3000-5000 mots, vise mots-clés haut de funnel)
- **N articles cluster** (1500-2500 mots, vise mots-clés long-tail spécifiques)
- **Cross-link** : pillar → tous clusters, cluster → pillar + 2-3 autres clusters
- **Schema.org** : pillar = `Article` avec `mainEntityOfPage`, clusters = `Article` avec `isPartOf` pillar

---

## 7. Routines Claude pour autonomie éditoriale

### Skills à créer post-v2 (dans `~/.claude/skills/waimia-editorial/`)

#### `claude-article-add`

**Input** :
- `subject` : "Comment automatiser les relances commerciales avec l'IA"
- `category` : "crm"
- `cluster` : "pilier-crm-relances-pme-2026"
- `audience` : "DG PME B2B 50-200 personnes"
- `wordCount` : 2000

**Output** :
- MDX dans `src/content/blog/<slug-from-title>.mdx`
- Frontmatter Zod-conforme : title_fr/en, description_fr/en, slug régex, publishedAt, author (slug), category, cluster, tags (3-5), sources (3-5 d'autorité), readingTime, relatedCases, relatedSolutions, faq_fr (5-7 GEO)
- Body MDX :
  - H1 (= title_fr)
  - Intro 80-120 mots avec hook douleur
  - 3-5 sections H2 (questions GEO explicites) avec réponses 40-60 mots après chaque H2
  - 1 section "Workflow concret" avec étapes numérotées
  - 1 quote anonymisée (ou citation source d'autorité)
  - Schema.org Article injecté via Base.astro

**Garde-fous** :
- Auteur slug doit exister dans `src/content/authors/`
- Sources ≥ 3 dont au moins 1 type `state` ou `university`
- Cluster doit exister dans `categories.json` config (cf section 7-bis)
- Pas de jargon Claude/MCP/etc en surface (top 50% du contenu)
- 1 mention provocation factuelle minimum
- 1 calendrier signature ("le mardi on cable") minimum

#### `claude-newsletter-mensuelle`

**Input** : `month` (YYYY-MM)

**Output** :
- MDX dans `src/content/veille-ia/<YYYY-MM>-newsletter.mdx`
- Aggrège les 4-5 derniers posts veille IA + 2-3 articles blog du mois
- Génère intro + outro signature manifeste
- Si Resend configuré → envoie au mailing list (`scripts/send-newsletter.ts`)

#### `claude-post-linkedin`

**Input** : `slug` d'un article existant

**Output** :
- MDX dans `src/content/posts-social/<YYYY-MM-DD>-<slug>.mdx`
- Variante LinkedIn : 280-1300 caractères de texte avec hook + 3-5 bullets + CTA article
- Variante Carousel : 5-7 slides avec H1/H2 + bullet par slide
- Variante Video Short script : 30-60 secondes (texte + b-roll suggestions)

#### `claude-calendrier-editorial`

**Input** : `windowDays` (default 30)

**Output** :
- Listing `publishAt` futurs sur 30j
- Détecte les "trous" éditoriaux (pas d'article publié 7+ jours)
- Suggère sujets en fonction des clusters sous-représentés
- Output : MDX dans `tasks/calendrier-editorial-<YYYY-MM-DD>.md`

### 7-bis. Configuration éditoriale

Fichier `src/data/editorial-config.ts` :
```ts
export const CATEGORIES = {
  acquisition: { fr: 'Acquisition', en: 'Acquisition' },
  crm: { fr: 'CRM & Relances', en: 'CRM & Follow-ups' },
  // ...
};

export const CLUSTERS = {
  'pilier-acquisition-pme-2026': {
    fr: 'Acquisition PME B2B 2026',
    pillarSlug: 'guide-acquisition-pme-b2b-2026',
    targetClusterSize: 8,  // pillar + 7 clusters
  },
  // ...
};

export const AUTHORS_DEFAULT = 'simon-beros';
```

---

## 8. Sources d'autorité — Convention figée

### Types autorisés

```yaml
sources:
  - name: "INSEE — PME en France 2026"
    url: "https://www.insee.fr/fr/statistiques/..."
    type: "state"        # état, gouvernement, agences publiques (INSEE, ACPR, ANSSI, OECD, EU)
    publishedAt: 2026-03-15

  - name: "MIT Sloan AI Adoption Report 2026"
    url: "https://sloanreview.mit.edu/..."
    type: "university"   # recherches académiques (HEC, MIT, Stanford, INRIA, ESSEC, INSEAD)

  - name: "Le Monde — L'IA et les PME françaises"
    url: "https://www.lemonde.fr/..."
    type: "journal"      # journaux reconnus (Le Monde, FT, WSJ, Les Echos, Forbes)

  - name: "Anthropic — Claude Skills release"
    url: "https://www.anthropic.com/news/..."
    type: "enterprise"   # communiqués d'entreprises directs (Anthropic, OpenAI, Stripe, HubSpot)

  - name: "McKinsey State of AI 2026"
    url: "https://www.mckinsey.com/..."
    type: "research"     # cabinets recherche (McKinsey, BCG, Gartner, Forrester, IDC)
    author: "McKinsey & Company"
```

### Règles GEO/CRO

- **Minimum 3 sources** par article pillar
- **Au moins 1 source state ou university** par article pillar
- **Mentions inline** dans le body MDX : "Selon [INSEE 2026](#sources), 67% des PME..."
- **Section "Sources" en bas** d'article (générée auto par le loader depuis frontmatter)
- **Schema.org `Article.citation`** : auto-inject par le loader

### Helper `<SourcesSection sources={frontmatter.sources} />`

Composant Astro pur qui rend :
- H2 "Sources"
- Liste numérotée avec ancres (`#source-1`)
- Type pill coloré (state=bleu, university=violet, journal=gris, enterprise=accent, research=orange)

---

## 9. Schema.org JSON-LD complet par page

### Helper `buildSchemaForPage(entry, collection)`

Dans `src/lib/seo/schema-builder.ts` (à créer) :

```ts
export function buildSchemaForPage(entry, collection, lang) {
  const url = `https://waimia.com${currentPath}`;
  const schemas = [];

  // BreadcrumbList commun
  schemas.push(buildBreadcrumb(entry, collection));

  switch (collection) {
    case 'authors':
      schemas.push(buildPerson(entry, lang));
      schemas.push(buildProfilePage(entry, url));
      break;
    case 'blog':
      schemas.push(buildArticle(entry, lang, url));
      if (entry.data.sources) schemas.push(buildCitations(entry.data.sources));
      break;
    case 'cookbooks':
      schemas.push(buildHowTo(entry, lang));     // steps from frontmatter
      schemas.push(buildArticle(entry, lang, url));
      break;
    case 'livresBlancs':
      schemas.push(buildBook(entry, lang));
      schemas.push(buildArticle(entry, lang, url));
      schemas.push(buildOffer(entry, lang));     // gated lead magnet
      break;
    case 'veilleIA':
      schemas.push(buildNewsArticle(entry, lang, url));
      break;
    case 'cases':
      schemas.push(buildArticle(entry, lang, url));
      if (!entry.data.ndaProtected) schemas.push(buildOrganization(entry.data.client));
      break;
    case 'secteurs':
      schemas.push(buildService(entry, lang));
      if (entry.data.faq_fr) schemas.push(buildFAQPage(entry.data.faq_fr));
      break;
  }

  return schemas;
}
```

Les loaders `[...slug].astro` appellent `buildSchemaForPage(entry, '<collection>', lang)` et passent à Base.astro via prop `jsonLd`.

### Schemas par type de page (récap)

| Page | Schemas |
|---|---|
| `/` | Organization + WebSite (déjà dans Base.astro) |
| `/equipe/<slug>` | Person + ProfilePage + BreadcrumbList |
| `/equipe` | CollectionPage + BreadcrumbList |
| `/ressources/blog/<slug>` | Article + Citations + BreadcrumbList |
| `/ressources/cookbooks/<slug>` | HowTo + Article + BreadcrumbList |
| `/ressources/livres-blancs/<slug>` | Book + Article + Offer + BreadcrumbList |
| `/ressources/veille-ia/<slug>` | NewsArticle + Citations + BreadcrumbList |
| `/cas/<slug>` | Article + Organization (si non NDA) + BreadcrumbList |
| `/secteurs/<slug>` | Service + FAQPage + BreadcrumbList |
| `/ressources/categorie/<slug>` | CollectionPage + BreadcrumbList |
| `/ressources/silo/<cluster>` | CollectionPage (silo) + BreadcrumbList |
| `/ressources/tag/<tag>` | CollectionPage + BreadcrumbList |
| `/solutions/<slug>` | Service + FAQPage + BreadcrumbList |
| `/offres/<slug>` | Service + Offer + FAQPage + BreadcrumbList |

---

## 10. Plan d'exécution v2 — 14 missions

### Phase auteurs (priorité 1)

| # | Mission | Fichiers | Durée Sonnet |
|---|---|---|---|
| **B1** | Collection `authors` Zod (config.ts) + 2 MDX auteurs (simon-beros + futur co-fondateur) | `src/content.config.ts`, `src/content/authors/*.mdx` | 15 min |
| **B2** | Template `AuthorPageTemplate.astro` (style darioamodei adapté DA Waimia) | `src/components/templates/AuthorPageTemplate.astro` | 30 min |
| **B3** | Loader `/equipe/[...slug].astro` + hub `/equipe/index.astro` | `src/pages/equipe/*.astro` | 15 min |
| **B4** | Migration refs `author` dans blog/cookbooks/livresBlancs/cas/veilleIA → `reference('authors')` | `src/content.config.ts` + tous les MDX existants | 25 min |
| **B5** | Composants `<AuthorByline>` + `<AuthorCard>` + injection dans loaders d'article | `src/components/ui/molecules/Author*.astro` + edit 4 loaders | 20 min |

### Phase taxonomies (priorité 2)

| # | Mission | Durée |
|---|---|---|
| **B6** | Étendre frontmatter (`category`, `cluster`, `tags`, `sources`) dans tous les schemas Zod | 15 min |
| **B7** | Loaders auto `/ressources/categorie/[...slug]` + `/ressources/silo/[...slug]` + `/ressources/tag/[...slug]` | 30 min |
| **B8** | Composants `<RelatedByCluster>` + `<LatestInCategory>` + `<TagPills>` + `<TaxonomyMenu>` + `<SourcesSection>` | 30 min |

### Phase autonomie Claude (priorité 3)

| # | Mission | Durée |
|---|---|---|
| **B9** | Skill `claude-article-add` (prompt + frontmatter generator + body template) | 45 min |
| **B10** | Skill `claude-newsletter-mensuelle` (aggrégateur + Resend integration) | 30 min |
| **B11** | Skill `claude-post-linkedin` (variantes texte/carousel/video script) | 30 min |
| **B12** | Skill `claude-calendrier-editorial` (analyse trous + propositions) | 30 min |
| **B13** | Validation cycle complet (ajouter 1 article via skill → byline + related + schema) | 20 min |

### Phase Schema.org (priorité 4)

| # | Mission | Durée |
|---|---|---|
| **B14** | Helper `buildSchemaForPage()` qui génère tous les JSON-LD selon collection + entry, injecté via Base.astro | 45 min |

**Total estimé** : ~6h Sonnet pour les 14 missions. Chaque phase est indépendante et peut être livrée en session séparée.

---

## 11. Conventions de qualité (figées)

- **0 hard-code** dans les pages (tout passe par Collections + Props/Slots)
- **0 lien interne mort** (validation Playwright après chaque mission)
- **Schema.org JSON-LD obligatoire** sur toute page de contenu
- **Sources ≥ 3** pour articles pillar, dont 1 minimum type `state` ou `university`
- **GEO** : H2 = questions explicites, réponses 40-60 mots, FAQPage Schema
- **Ton manifeste** : antinomies + voix "Nous" + calendrier signature + negation as positioning
- **i18n FR/EN** : tous les nouveaux MDX et collections
- **Auto-jointure** : tout ce qui peut être calculé dynamiquement (related, latest, by-author) doit l'être
- **Routines Claude** : respect strict des schemas Zod, pas de bypass

---

## 12. Ce qui n'est PAS dans le scope v2

- Refonte complète DA / design system (la DA actuelle reste, on ne fait que des composants conformes)
- Migration vers headless CMS externe (Contentful, Sanity, Strapi) — on reste git-based
- Comments / community features (pas pour PME B2B v2)
- Search interne (post-v2 si volume justifie)
- Internationalisation au-delà de FR/EN
- Multi-tenant / white-label

---

## 13. Reprise post-reset quota

Quand tu reviens (après 16:10 ou en session future) :

1. **Lis ce document** en entier
2. **Choisis la phase prioritaire** (auteurs / taxonomies / routines / schema.org)
3. **Lance la mission B1** en premier (Collection `authors` + 2 MDX) — bloquante pour B2-B5
4. **Enchaîne séquentiellement** dans la phase : B1 → B2 → B3 → B4 → B5
5. **Valide empiriquement** chaque mission (Playwright + typecheck)
6. **Commit + push** par phase

Plan stocké aussi dans `tasks/todo-v2.md` (à créer en début de session post-reset).

---

**Architecte** : Claude Opus 4.7 (1M context)
**Sources de référence** : darioamodei.com (pages auteur + CV), schema.org spec 2024, Astro 6 docs Collections, Anthropic Skills 2026 docs.
**Date plan figé** : 2026-05-10 14:50 UTC+2
**Prêt à exécuter** : oui, dès quota Sonnet revenu.
