# Waimia · Content Architecture — Inventaire, Cible, Migration

> **Source de vérité** pour l'architecture de contenu Waimia.
> Complément de `12-PAGES-QUALITY-TRACKING.md`.
> Créé 2026-05-15.

---

## Sommaire

1. [Diagnostic actuel](#diagnostic)
2. [Architecture collections cible](#architecture-cible)
3. [Migration content hardcoded → collections](#migration)
4. [Hub agrégateur ressources](#hub-agrégateur)
5. [Tags transversaux & navigation taxonomique](#taxonomie)
6. [Tunnels conversion par offre](#tunnels-conversion)
7. [Welcome pages (sortie de tunnel)](#welcome-pages)
8. [Landing pages (LP)](#landing-pages)
9. [École / Formation (hub académie)](#école-formation)
10. [Produits (artefacts livrables)](#produits)
11. [Abonnements (revenus récurrents)](#abonnements)
12. [Rédaction du vrai contenu](#rédaction)
13. [Stratégie SVG custom](#svg-custom)
14. [Stratégie SSG / ISR pour fresh content](#ssg-isr)
15. [Roadmap exécution](#roadmap)

---

## Diagnostic

### Collections actuelles vs entrées peuplées

| Collection | Schema défini | Entrées actuelles | Gap |
|---|---|---|---|
| `authors` | ✅ | 1 (simon-beros) | Manque équipe + invités |
| `blog` | ✅ | 4 articles | Différenciation par sous-type manquante |
| `cases` | ✅ | 1 (plateau) | 4 cases hardcoded dans pages .astro |
| `cookbooks` | ✅ | 1 | 3 cookbooks hardcoded dans pages .astro |
| `field-notes` | ✅ | **0** | 100% à créer |
| `livres-blancs` | ✅ | 1 | 1 hardcoded à migrer |
| `offres` | ✅ | **0** | **13 pages /offres/* hardcoded** |
| `outils` | ✅ | 1 | À enrichir |
| `pages` | ✅ | 1 (a-propos) | Pages statiques diverses à migrer |
| `ressources` | ✅ | 0 | Existe-t-il vraiment ? |
| `secteurs` | ✅ | 3 | 2 secteurs hardcoded à migrer |
| `solutions` | ✅ | **0** | **9 pages /solutions/* hardcoded** |
| `technologies` | ✅ | **0** | **3 pages /technologies/* hardcoded** |
| `veille-ia` | ✅ | 1 | À enrichir |

**Total entrées peuplées : ~13** vs **~60+ pages éditoriales nécessaires**.

### Anti-pattern majeur

```
/pages/offres/growth-system-ia.astro  → 600 LoC HTML/Astro hardcoded
                                        ↓ devrait être ↓
/content/offres/growth-system-ia.mdx  → frontmatter + body + slots éditoriaux
/pages/offres/[...slug].astro         → consomme la collection via getCollection()
```

C'est ce qu'on appelle un **SSG content-driven** vs un **SSG fichier-driven**. Le second ne profite pas de :
- Schema validation Zod
- Frontmatter consistant cross-page
- Génération automatique des index/listings
- Fresh content sans toucher au code

### Collections manquantes (à créer)

D'après le brief Simon :

1. **`blog/formation`** — articles formation/tuto (sous-type blog)
2. **`blog/essai`** — essais long format type Stratechery (sous-type blog)
3. **`blog/notes`** — notes courtes terrain (sous-type blog)
4. **`blog/avis`** — avis/opinions/prises de position (sous-type blog)
5. **`blog/post`** — posts généraux/réflexions courtes (sous-type blog)
6. **`tunnel-conversion`** — tunnels conv multi-étapes par offre (ex: tunnel1/2/3/4 pour site-web-ia)
7. **`landing-pages`** — LP dédiées (campagnes, événements, partners)
8. **`newsletter`** — archives newsletter envoyée
9. **`tags`** — collection taxonomique pour pages tag/[slug]
10. **`archives`** — index temporel (auto-généré depuis dates des autres collections)

---

## Architecture cible

### Modèle hiérarchique unifié

```
RESSOURCES (hub agrégateur)
├── Blog
│   ├── Formation        → tutoriels structurés
│   ├── Essai           → long format analytique
│   ├── Notes           → terrain courtes
│   ├── Avis            → opinions/prises de position
│   └── Post            → réflexions générales
├── Cas clients
├── Cookbooks
├── Field notes
├── Livres blancs
├── Outils
├── Veille IA
├── Newsletter         → archives newsletters
└── Tags transversaux  → vue cross-collection
    ├── Acquisition IA
    ├── Productivité
    ├── Entrepreneuriat
    ├── Astuces
    ├── Notes générales
    └── ...
```

### Collection blog unifiée avec discriminator `type`

**Recommandation** : ne PAS créer 5 collections séparées (formation/essai/notes/avis/post). Plutôt **1 collection `blog` avec un champ `type`** :

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    type: z.enum(['formation', 'essai', 'notes', 'avis', 'post']),
    readingTime: z.number().int().positive(),
    author: reference('authors'),
    hero_image: z.string().optional(),
    body_excerpt_fr: z.string(),
    body_excerpt_en: z.string(),
    // pour formations seulement
    duration_minutes: z.number().int().positive().optional(),
    prerequisites: z.array(z.string()).optional(),
    // pour essais seulement
    pull_quotes: z.array(z.object({ text: z.string(), context: z.string() })).optional(),
  }),
});
```

**Avantages** :
- Pages dynamiques : `/ressources/blog/formation`, `/ressources/blog/essai`, etc. via filter sur `type`
- Hub blog avec onglets/filtres simples
- 1 seul schema à maintenir
- Tags transversaux (`tags: ['acquisition-ia']`) restent unifiés
- 1 article peut potentiellement migrer entre types sans changer de collection

### Nouvelles collections à ajouter

#### 1. `tunnel-conversion` (multi-étapes par offre)

```ts
const tunnels = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tunnels' }),
  schema: z.object({
    ...baseFields,
    offre_slug: z.string(),  // référence offre parent ex 'site-web-ia'
    step: z.number().int().min(1).max(6),
    step_title_fr: z.string(),
    step_title_en: z.string(),
    next_step: z.string().optional(),  // slug du tunnel suivant
    prev_step: z.string().optional(),
    cta_label_fr: z.string(),
    cta_label_en: z.string(),
    cta_href: z.string(),
  }),
});
```

**Structure attendue** :
```
content/tunnels/
├── site-web-ia-tunnel-1-intro.mdx
├── site-web-ia-tunnel-2-mecanique.mdx
├── site-web-ia-tunnel-3-preuves.mdx
├── site-web-ia-tunnel-4-conversion.mdx
├── growth-system-ia-tunnel-1-...mdx
├── activation-ia-tunnel-1-...mdx
└── ...
```

**Pages dynamiques** :
- `/offres/[offre]/tunnel/[step]` consomme la collection
- Navigation step-by-step via `prev_step`/`next_step`

#### 2. `landing-pages` (LP campagnes)

```ts
const landingPages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lp' }),
  schema: z.object({
    ...baseFields,
    campaign: z.string(),         // ex 'q3-2026-saas-b2b'
    utm_source: z.string().optional(),
    primary_offer_slug: z.string(),
    hero_variant: z.enum(['split', 'centered', 'full-bleed']).default('split'),
    sections: z.array(z.enum(['proof', 'method', 'case-study', 'faq', 'pricing'])).default([]),
    cta_primary_label_fr: z.string(),
    cta_primary_label_en: z.string(),
    cta_primary_href: z.string(),
  }),
});
```

**Structure attendue** :
```
content/lp/
├── q3-2026-saas-b2b.mdx
├── q4-2026-fintech.mdx
├── webinar-rentree-2026.mdx
└── ...
```

**Pages dynamiques** :
- `/lp/[slug]` consomme collection, render LP minimal high-conversion

#### 3. `newsletter` (archives)

```ts
const newsletter = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/newsletter' }),
  schema: z.object({
    ...baseFields,
    issue_number: z.number().int().positive(),
    sent_at: z.coerce.date(),
    open_rate: z.number().min(0).max(1).optional(),  // stats post-envoi
    subscriber_count_at_send: z.number().int().positive().optional(),
    excerpt_fr: z.string(),
    excerpt_en: z.string(),
  }),
});
```

#### 4. `tags` (taxonomique)

**Approche** : tags ne sont pas une collection séparée mais un index dérivé. Page `/ressources/tag/[slug]` lit toutes les collections et filtre par `tags.includes(slug)`.

**Vocabulaire tags Waimia (16 tags canoniques recommandés)** :

```ts
export const WAIMIA_TAGS = [
  // Domaines
  'acquisition-ia',
  'crm-relances',
  'contenu-seo-geo',
  'productivite-ia',
  'support-client-ia',
  'pilotage-ia',
  'data-analytics',
  'gouvernance-ia',
  // Verticales
  'finance',
  'fintech',
  'industrie',
  'services-b2b',
  // Thématiques transverses
  'astuces',
  'entrepreneuriat',
  'notes-generales',
  'productivite',
] as const;
```

#### 5. `archives` (auto-généré, pas de fichiers)

**Approche** : pas de collection à créer. Page `/archive` génère automatiquement la timeline depuis `publishedAt` de toutes les collections, groupée par mois.

---

## Migration

### Plan migration hardcoded → collections

#### Étape M1 · `/offres/*.astro` → `content/offres/*.mdx` (7 pages OffresDetailTemplate)

Pour chaque page :
- Extraire `tier`, `tierLabel`, `meta`, `title`, `description`, `ctaHref`, `ctaLabel`, slots dans frontmatter MDX
- Body MDX = slots `lead`, `problem-statement`, `method-steps`, `deliverables`, `proof-quote`, etc.
- Schema offres :

```ts
const offres = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/offres' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    tier_fr: z.string(),
    tier_en: z.string(),
    tier_label_fr: z.string(),
    tier_label_en: z.string(),
    meta_fr: z.string(),
    meta_en: z.string(),
    price_from_eur: z.number().int().positive().optional(),
    price_to_eur: z.number().int().positive().optional(),
    duration_min_weeks: z.number().int().positive().optional(),
    duration_max_weeks: z.number().int().positive().optional(),
    cta_label_fr: z.string(),
    cta_label_en: z.string(),
    cta_href: z.string(),
    method_steps: z.array(z.object({
      num: z.string(),
      label_fr: z.string(),
      label_en: z.string(),
      body_fr: z.string(),
      body_en: z.string(),
      meta_fr: z.string().optional(),  // ex 'Audit & cadrage'
      meta_en: z.string().optional(),
    })),
    deliverables: z.array(z.object({
      title_fr: z.string(),
      title_en: z.string(),
      body_fr: z.string(),
      body_en: z.string(),
      tag: z.string(),  // ex 'PDF + ATELIER'
    })),
    proof: z.object({
      quote_fr: z.string(),
      quote_en: z.string(),
      attribution: z.string(),
      metrics: z.array(z.object({
        value: z.string(),
        label_fr: z.string(),
        label_en: z.string(),
      })),
    }),
  }),
});
```

- Page `pages/offres/[...slug].astro` : `getCollection('offres')` + `getStaticPaths()`

#### Étape M2 · `/solutions/*.astro` → `content/solutions/*.mdx` (9 pages)

Même pattern que offres. Schema spécifique solutions (Department/Outcome model).

#### Étape M3 · `/technologies/*.astro` → `content/technologies/*.mdx` (3 pages)

Idem.

#### Étape M4 · `/cas/*.astro` → `content/cases/*.mdx` (5 cas + 1 existant)

Migrer caserne, halcyon, northbound, plateau (existant), + 1 nouveau.

#### Étape M5 · Pages identitaires `/agence/*` → `content/pages/*.mdx`

`about`, `methode`, `careers`, `governance`, `trust-center`, `design-system` → tous des contenus markdown longs avec frontmatter minimal.

---

## Hub agrégateur

### `/ressources/index.astro` — Vue d'ensemble

**Objectif** : page hub style **Stratechery / Substack archive** qui agrège TOUT le contenu Waimia.

**Structure proposée** :

```
HEADER
└── kicker · H1 · lede

SECTION FEATURED (3 derniers + bouton "Voir tout")
├── 1 featured large (avec image SVG)
└── 2 featured small

NAVIGATION TAXONOMIQUE
├── Onglets : Tous · Blog · Cas · Cookbooks · Field notes · Livres blancs · Outils · Veille · Newsletter
└── Filtres tags transversaux (15 chips)

LISTING CHRONOLOGIQUE
└── Rows hairlines : date | type tag | titre | excerpt | author | →

SIDEBAR (col droite desktop)
├── Newsletter signup
├── Top 5 tags (par count)
├── Auteurs (avatars + count articles)
└── Mini-archive (3 derniers mois avec count)

FOOTER PAGINATION
└── « 01 / 12 · Voir plus → » (style mono)
```

**Logique fetch (Astro frontmatter)** :

```ts
const allContent = [
  ...(await getCollection('blog')).map(e => ({ ...e, type: e.data.type })),
  ...(await getCollection('cases')).map(e => ({ ...e, type: 'case' })),
  ...(await getCollection('cookbooks')).map(e => ({ ...e, type: 'cookbook' })),
  ...(await getCollection('field-notes')).map(e => ({ ...e, type: 'field-note' })),
  ...(await getCollection('livres-blancs')).map(e => ({ ...e, type: 'livre-blanc' })),
  ...(await getCollection('outils')).map(e => ({ ...e, type: 'outil' })),
  ...(await getCollection('veille-ia')).map(e => ({ ...e, type: 'veille' })),
  ...(await getCollection('newsletter')).map(e => ({ ...e, type: 'newsletter' })),
].sort((a, b) => +b.data.publishedAt - +a.data.publishedAt);
```

### Pages de listing par catégorie

| URL | Contenu agrégé |
|---|---|
| `/ressources/blog` | filter type ∈ ['formation', 'essai', 'notes', 'avis', 'post'] |
| `/ressources/blog/formation` | filter type='formation' |
| `/ressources/blog/essai` | filter type='essai' |
| `/ressources/blog/notes` | filter type='notes' |
| `/ressources/blog/avis` | filter type='avis' |
| `/ressources/blog/post` | filter type='post' |
| `/ressources/cas` (déjà /cas/) | tout cases |
| `/ressources/cookbooks` | tout cookbooks |
| `/ressources/field-notes` | tout field-notes |
| `/ressources/livres-blancs` | tout livres-blancs |
| `/ressources/outils` | tout outils |
| `/ressources/veille-ia` | tout veille-ia |
| `/ressources/newsletter` | tout newsletter |
| `/ressources/tag/[slug]` | filter `tags.includes(slug)` cross-collection |
| `/ressources/auteur/[slug]` | filter author=slug cross-collection |
| `/ressources/archive/[YYYY-MM]` | filter par mois cross-collection |

---

## Taxonomie

### Vocabulaire tags canoniques (8 — simplifiés)

Décision Simon 2026-05-15 : réduire de 16 → **8 tags essentiels**, plus maintenable et suffisamment couvrant.

| Tag | Couvre |
|---|---|
| `acquisition-ia` | ads, landing, pipeline, CRM, relances, conversion (regroupe acquisition + crm-relances) |
| `contenu-seo-geo` | SEO, GEO (generative engine opt), articles, brand content |
| `productivite-ia` | automation, workflows internes, gains horaires, support client IA |
| `data-pilotage` | dashboards, KPIs, analytics, GA4, attribution, alertes |
| `gouvernance-ia` | AI Act, RGPD, compliance, sécurité, audit |
| `etudes-cas` | cas terrain, lessons learned, retours mission, transformations mesurées |
| `outils-techniques` | cookbooks dev, MCP, Claude API, scripts, intégrations |
| `strategie` | vision, marché, positioning, entrepreneuriat, building Waimia |

**Note** : les secteurs (finance, fintech, industrie, services-b2b) ne sont **plus des tags** mais une **taxonomie séparée** via collection `secteurs`. Les filtres "tag × secteur" se croisent côté UI.

### Pages tag dynamiques

`/ressources/tag/[slug].astro` :

```astro
---
import { getCollection } from 'astro:content';
const { slug } = Astro.params;

export async function getStaticPaths() {
  return WAIMIA_TAGS.map(tag => ({ params: { slug: tag } }));
}

const allEntries = [
  ...(await getCollection('blog')),
  ...(await getCollection('cases')),
  ...(await getCollection('cookbooks')),
  ...(await getCollection('field-notes')),
  ...(await getCollection('veille-ia')),
].filter(entry => entry.data.tags.includes(slug));
---
<TagPageTemplate tag={slug} entries={allEntries} />
```

---

## Tunnels conversion

### Architecture multi-étapes par offre

Chaque offre principale (growth-system-ia, activation-ia, site-web-ia, etc.) peut avoir un **tunnel multi-étapes** :

```
/offres/site-web-ia/                          → page offre principale
/offres/site-web-ia/tunnel/1-intro            → étape 1
/offres/site-web-ia/tunnel/2-mecanique         → étape 2
/offres/site-web-ia/tunnel/3-preuves           → étape 3
/offres/site-web-ia/tunnel/4-conversion        → étape 4 (CTA fort)
```

**Status actuel** : `/offres/site-web-ia-tunnel/{conversion,mecanique,preuves,index}.astro` existent déjà mais hardcodés. À migrer vers collection `tunnels`.

**Template suggéré** : `TunnelStepTemplate.astro` avec :
- Progress bar mono `Étape 02 / 04`
- H1 step + lede
- Body éditorial
- Boutons `← Précédent` + `Suivant →`
- Sortie tunnel : CTA principal

**Tunnels à créer (4 par offre × 4-5 offres prioritaires)** :

| Offre | Tunnel 1 | Tunnel 2 | Tunnel 3 | Tunnel 4 |
|---|---|---|---|---|
| site-web-ia | Intro IA-first | Mécanique technique | Preuves cas | Conversion audit |
| growth-system-ia | Diagnostic pipeline | Architecture system | Cas mesurés | Diagnostic 45 min |
| activation-ia | Identifier cas usage | Sprint 1 semaine | Démo livraison | Démarrer activation |
| revops | Audit funnel | Refonte stack | Quick wins | Roadmap 6 sem |
| application-ia-pme | Cadrage usage | Sprint MVP 6 sem | Cas livré | Démarrer projet |

Total = **20 entrées tunnels** à créer.

---

## Welcome pages

### Architecture welcome (sortie de tunnel / post-conversion)

**Différence clé** : `WelcomeTemplate.astro` existe déjà dans `/components/templates/` (cf doc 12) et 5 pages `/bienvenue/*` consomment ce template. C'est la **dernière étape** d'un tunnel ou la page post-form submit.

**Sémantique métier** :
- `/bienvenue/audit` → après avoir réservé un audit
- `/bienvenue/contact` → après contact form submit
- `/bienvenue/livre-blanc` → après téléchargement livre blanc
- `/bienvenue/newsletter` → après inscription newsletter
- Nouveaux à créer : `/bienvenue/formation` (post-inscription école), `/bienvenue/produit` (post-achat artefact), `/bienvenue/abonnement` (post-souscription)

**Pattern WelcomePageTemplate cible (à refactorer dans doc 12 Brief Template 7)** :

```astro
HERO confirmation
├── kicker mono `[livré · ${date} · ${heure} UTC+1]`
├── H1 affirmation (Instrument Serif italique 1-2 mots)
│   ex: "Votre audit est *programmé*."
│       "Document *envoyé* dans votre boîte."
│       "Bienvenue dans la *newsletter*."
└── lede 1-2 phrases (ce qui se passe maintenant)

NEXT STEPS éditoriales
├── Step 01 · "Vous recevrez X par email dans Y heures"
├── Step 02 · "Nous vous appellerons à Z pour confirmer"
└── Step 03 · "Voici la doc à lire en attendant"
(numérotation hairlines, prose 1-2 phrases par étape)

BONUS CONTENT (col droite ou full-width)
└── 3-5 ressources liées en table éditoriale
    ex: "Cas Plateau" · "Cookbook Claude Cowork" · "Livre blanc IA PME"

SIGNATURE éditoriale
├── Photo/SVG monogram Simon Beros
├── Citation courte (3-5 phrases)
└── Contact direct mono `bonjour@waimia.fr · LinkedIn`

DEAD-END détecté → CTA retour
└── 3 portes : Atlas · Solutions · Cas (style 404)
```

### Schema collection `welcome-pages` (optionnelle)

Si on veut piloter les welcome pages depuis CMS plutôt que .astro :

```ts
const welcomePages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/welcome' }),
  schema: z.object({
    ...baseFields,
    trigger: z.enum([
      'audit-booking',
      'contact-form',
      'livre-blanc-download',
      'newsletter-signup',
      'formation-signup',
      'produit-purchase',
      'abonnement-souscription',
    ]),
    headline_fr: z.string(),  // ex "Votre audit est *programmé*."
    headline_en: z.string(),
    next_steps: z.array(z.object({
      num: z.string(),         // "01", "02"
      title_fr: z.string(),
      title_en: z.string(),
      body_fr: z.string(),
      body_en: z.string(),
      timing_fr: z.string().optional(),  // "Sous 24h"
      timing_en: z.string().optional(),
    })).min(2).max(4),
    bonus_resources: z.array(z.object({
      type: z.enum(['case', 'cookbook', 'livre-blanc', 'blog', 'outil']),
      slug: z.string(),
    })).default([]),
    signature_quote_fr: z.string().optional(),
    signature_quote_en: z.string().optional(),
    signature_author: reference('authors').optional(),
    fallback_doors: z.array(z.object({
      label_fr: z.string(),
      label_en: z.string(),
      href: z.string(),
    })).default([]),
  }),
});
```

**Total welcome pages à créer/migrer** : **7** (4 existants + 3 nouveaux pour formation/produit/abonnement).

### Chaînage tunnel → welcome

```
Tunnel step 1 → step 2 → step 3 → step 4 (CTA conversion)
                                         ↓
                              POST /api/audit-booking
                                         ↓
                              redirect /bienvenue/audit
                                         ↓
                              WelcomeTemplate consomme content/welcome/audit-booking.mdx
```

---

## Landing pages

### Architecture LP campagnes

LP = pages haute conversion ciblées campagnes (Ads, partenariats, événements). Différent des pages /offres standard.

**Structure LP type** :

```
/lp/[slug].astro consomme content/lp/[slug].mdx
```

Schema déjà proposé section "Architecture cible". Sections optionnelles via `sections` array.

**LP types prioritaires à créer** :

| Slug LP | Campagne | Offre cible |
|---|---|---|
| `lp/audit-saas-b2b-q3` | Q3 2026 SaaS B2B | Growth System IA |
| `lp/lpsi-fintech-q4` | Q4 2026 Fintech | RevOps |
| `lp/webinar-rentree-2026` | Webinar | Audit gratuit |
| `lp/partenaire-hubspot` | Co-marketing HubSpot | CRM Relances IA |
| `lp/event-saastr-2026` | Salon SaaStr | Activation IA |

---

## École-formation

### Architecture hub académie

**Différenciation services vs formation** :
- `/offres/*` = mission contractuelle ponctuelle (audit, growth system, etc.)
- `/ecole/*` = formation continue · catalogue cours · parcours · certification

**Sémantique métier** : Waimia École = ressources autoformation + sessions live + parcours certifiants pour PME et indépendants qui veulent monter en compétence IA.

### Hub `/ecole/` — structure cible

```
/ecole/                          → hub académie (catalogue + parcours)
/ecole/parcours/[slug]           → parcours multi-cours (ex "Acquisition IA en 4 semaines")
/ecole/cours/[slug]              → cours unitaire
/ecole/atelier/[slug]            → atelier live ponctuel
/ecole/certification/[slug]      → certification examen
```

### Schemas collections École

#### `formations` (cours)

```ts
const formations = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ecole/formations' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    format: z.enum(['video', 'texte', 'live', 'mixte', 'sprint']),
    duration_hours: z.number().positive(),
    level: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
    prerequisites: z.array(z.string()).default([]),
    learning_objectives: z.array(z.string()).min(3).max(8),
    modules: z.array(z.object({
      num: z.string(),
      title_fr: z.string(),
      title_en: z.string(),
      duration_minutes: z.number().int().positive(),
      type: z.enum(['lecture', 'exercice', 'projet', 'evaluation']),
    })).min(3),
    instructor: reference('authors'),
    pricing: z.object({
      currency: z.literal('EUR'),
      one_time_eur: z.number().int().nonnegative().optional(),
      subscription_eur: z.number().int().nonnegative().optional(),
    }).optional(),
    next_session_at: z.coerce.date().optional(),
    seats_total: z.number().int().positive().optional(),
    seats_remaining: z.number().int().nonnegative().optional(),
    certification: z.boolean().default(false),
    related_offres: z.array(z.string()).default([]),  // ex 'growth-system-ia'
  }),
});
```

#### `parcours` (séquences de cours)

```ts
const parcours = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ecole/parcours' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    duration_weeks: z.number().int().positive(),
    total_hours: z.number().positive(),
    level: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
    target_audience: z.array(z.enum([
      'ceo', 'cto', 'cmo', 'cso', 'cfo',
      'marketing-manager', 'sales-manager', 'product-manager',
      'developer', 'designer', 'consultant',
    ])),
    courses: z.array(z.string()).min(2),  // slugs formations dans l'ordre
    outcomes: z.array(z.string()).min(3),
    pricing_eur: z.number().int().positive(),
    certification: z.boolean().default(true),
  }),
});
```

#### `ateliers` (live ponctuels)

```ts
const ateliers = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ecole/ateliers' }),
  schema: z.object({
    ...baseFields,
    scheduled_at: z.coerce.date(),
    duration_hours: z.number().positive(),
    format: z.enum(['live-online', 'live-paris', 'live-geneve', 'replay-only']),
    seats_total: z.number().int().positive(),
    seats_remaining: z.number().int().nonnegative(),
    instructor: reference('authors'),
    pricing_eur: z.number().int().nonnegative().default(0),  // gratuit possible
    replay_available: z.boolean().default(true),
    recording_url: z.string().url().optional(),  // post-event
  }),
});
```

### Templates École à créer

| Template | Usage |
|---|---|
| `EcoleHubTemplate.astro` | `/ecole/` catalogue agrégé |
| `ParcoursDetailTemplate.astro` | `/ecole/parcours/[slug]` |
| `FormationDetailTemplate.astro` | `/ecole/cours/[slug]` |
| `AtelierDetailTemplate.astro` | `/ecole/atelier/[slug]` |
| `CertificationDetailTemplate.astro` | `/ecole/certification/[slug]` |

### Exemples posts formation (priorité 1)

Pour amorcer l'école avec du vrai contenu :

| Slug | Type | Niveau | Durée |
|---|---|---|---|
| `intro-ia-pme-b2b` | formation | debutant | 2h |
| `prompter-claude-pour-les-non-tech` | formation | debutant | 90 min |
| `automatiser-relances-crm-en-4-heures` | formation | intermediaire | 4h |
| `pipeline-editorial-seo-geo-systematique` | formation | intermediaire | 6h |
| `architecture-multi-agents-pme` | formation | avance | 8h |
| `parcours-acquisition-ia-4-semaines` | parcours | intermediaire | 4 sem |
| `parcours-revops-ia-6-semaines` | parcours | avance | 6 sem |
| `atelier-decouverte-virtuoseos` | atelier | debutant | 90 min |

**Total amorçage école : 8 entrées** (5 formations + 2 parcours + 1 atelier).

### Welcome pages spécifiques école

- `/bienvenue/formation` (post-inscription cours individuel)
- `/bienvenue/parcours` (post-inscription parcours long)
- `/bienvenue/atelier` (post-inscription atelier live)

---

## Produits

### Architecture catalogue produits

**Distinction conceptuelle critique** :
- **Services / Offres** (`/offres/*`) = mission contractuelle livrée par Waimia (effort humain) → existant
- **Produits** (`/produits/*`) = artefacts achetables one-shot (audits guides, templates payants, livres blancs premium, kits) → **NOUVEAU**
- **Abonnements** (`/abonnements/*`) = revenus récurrents (gestion hébergement, monitoring, maintenance) → **NOUVEAU**

### Schema collection `produits`

```ts
const produits = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/produits' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    sku: z.string().regex(/^WAI-[A-Z0-9]+-\d{3}$/, 'format SKU Waimia'),  // ex WAI-AUD-001
    product_type: z.enum([
      'audit-guide',         // guide audit à se faire soi-même
      'template-kit',        // pack templates Notion/Airtable
      'livre-blanc-premium', // version payante longue
      'masterclass-replay',  // replay masterclass enregistré
      'workbook',            // cahier exercices PDF
      'starter-pack',        // bundle multi-produits
    ]),
    pricing: z.object({
      currency: z.literal('EUR'),
      list_price_eur: z.number().positive(),
      promo_price_eur: z.number().positive().optional(),
      promo_until: z.coerce.date().optional(),
    }),
    format: z.array(z.enum(['pdf', 'notion', 'airtable', 'figma', 'video', 'audio', 'zip'])),
    pages_or_minutes: z.number().int().positive(),
    deliverables: z.array(z.string()).min(2),  // liste artefacts inclus
    target_audience: z.array(z.string()),
    instant_download: z.boolean().default(true),
    license: z.enum(['personnel', 'equipe-5', 'entreprise-illimite']).default('personnel'),
    related_formations: z.array(z.string()).default([]),
    related_offres: z.array(z.string()).default([]),
    download_url: z.string().optional(),  // signed URL si auto-delivered
    purchase_url: z.string(),               // Stripe Checkout / Gumroad / Lemonsqueezy
  }),
});
```

### Templates Produits à créer

| Template | Usage |
|---|---|
| `ProduitsHubTemplate.astro` | `/produits/` catalogue |
| `ProduitDetailTemplate.astro` | `/produits/[slug]` page produit |

### Exemples produits initiaux (priorité 1)

| SKU | Slug | Type | Prix |
|---|---|---|---|
| WAI-AUD-001 | `audit-maturite-ia-self` | audit-guide | 79 € |
| WAI-KIT-001 | `kit-prompts-hubspot-50` | template-kit | 49 € |
| WAI-LBP-001 | `growth-system-ia-playbook-premium` | livre-blanc-premium | 199 € |
| WAI-MCR-001 | `masterclass-pipeline-editorial-seo` | masterclass-replay | 149 € |
| WAI-WBK-001 | `workbook-cartographie-pipeline` | workbook | 39 € |
| WAI-BDL-001 | `starter-pack-acquisition-ia` | starter-pack | 299 € |

**Total : 6 produits amorçage**.

### Welcome page `/bienvenue/produit`

Email auto-delivery + welcome page avec lien téléchargement + next steps + ressources liées.

---

## Abonnements

### Architecture catalogue abonnements

**Modèle économique** : revenus récurrents Waimia, complément aux missions ponctuelles.

### Schema collection `abonnements`

```ts
const abonnements = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/abonnements' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    sku: z.string().regex(/^WAI-SUB-[A-Z0-9]+-\d{3}$/, 'format SKU abonnement'),
    subscription_type: z.enum([
      'hosting-management',  // gestion hébergement Vercel
      'maintenance',         // maintenance technique
      'monitoring',          // monitoring continu
      'ai-monitoring',       // monitoring agents IA
      'content-production',  // production éditoriale récurrente
      'support-premium',     // support premium tickets
      'crm-management',      // gestion CRM continue
      'security-audit',      // audit sécurité récurrent
    ]),
    billing_cycle: z.enum(['monthly', 'quarterly', 'annual']),
    pricing: z.object({
      currency: z.literal('EUR'),
      monthly_eur: z.number().positive(),
      annual_eur: z.number().positive().optional(),
      annual_discount_pct: z.number().min(0).max(50).optional(),
      setup_fee_eur: z.number().nonnegative().optional(),
    }),
    sla: z.object({
      response_time_business_hours: z.string().optional(),  // ex "4h"
      response_time_critical: z.string().optional(),         // ex "1h"
      uptime_guarantee: z.string().optional(),               // ex "99.9%"
      monthly_hours_included: z.number().nonnegative().optional(),
    }).optional(),
    deliverables: z.array(z.string()).min(3),
    onboarding_duration_days: z.number().int().positive(),
    cancellation_terms: z.string(),                          // ex "30 jours préavis"
    target_audience: z.array(z.string()),
    related_offres: z.array(z.string()).default([]),
    purchase_url: z.string(),                                // Stripe Subscription
    custom_quote_required: z.boolean().default(false),       // si tarif sur devis
  }),
});
```

### Templates Abonnements à créer

| Template | Usage |
|---|---|
| `AbonnementsHubTemplate.astro` | `/abonnements/` catalogue |
| `AbonnementDetailTemplate.astro` | `/abonnements/[slug]` page abonnement |

### Exemples abonnements initiaux (priorité 1)

| SKU | Slug | Type | Prix /mois |
|---|---|---|---|
| WAI-SUB-HST-001 | `gestion-hebergement-vercel` | hosting-management | 290 € |
| WAI-SUB-MAI-001 | `maintenance-site-ia-first` | maintenance | 490 € |
| WAI-SUB-MON-001 | `monitoring-agents-ia` | ai-monitoring | 690 € |
| WAI-SUB-CON-001 | `production-editoriale-seo-geo` | content-production | 1 490 € |
| WAI-SUB-CRM-001 | `gestion-crm-continue` | crm-management | 990 € |
| WAI-SUB-SUP-001 | `support-premium-pme` | support-premium | 390 € |

**Total : 6 abonnements amorçage**.

### Welcome page `/bienvenue/abonnement`

Post-souscription : onboarding step-by-step + accès portail client + facture initiale + premier check-in calendar invite.

---

## Rédaction

### Plan rédaction contenu (vrai contenu, pas placeholder)

#### Priorité 1 · Contenu pilier (essai-formats)

Chaque cluster a 1 article pillar + 3-5 articles cluster :

**Cluster `acquisition-ia`** (pillar + 4 clusters) :
1. **Pillar essai** : "Pourquoi votre pipeline d'acquisition ne s'améliore pas malgré l'IA" (3000 mots)
2. Cluster formation : "Configurer GPT pour qualifier 100 leads/jour sans erreur"
3. Cluster notes : "3 erreurs à éviter en intégrant ChatGPT dans HubSpot"
4. Cluster avis : "Pourquoi nous refusons les missions SEO génériques en 2026"
5. Cluster post : "Le vrai coût d'un SDR humain vs un SDR IA en 2026"

**Cluster `crm-relances`** (pillar + 4) — idem
**Cluster `contenu-seo-geo`** (pillar + 4) — idem
**Cluster `productivite-ia`** (pillar + 4) — idem
**Cluster `gouvernance-ia`** (pillar + 4) — idem

**Total : 25 articles blog** à rédiger pour avoir un blog crédible.

#### Priorité 2 · Cookbooks (recettes techniques)

| Cookbook | Pages | Audience |
|---|---|---|
| Premier agent IA (existe) | 8 | dev junior |
| Claude Cowork rollout équipe (hardcoded à migrer) | 12 | manager IT |
| Claude skills tutorial (hardcoded à migrer) | 10 | dev mid |
| MCP server deploy (hardcoded à migrer) | 14 | dev senior |
| **À créer** : Connecter HubSpot à Claude via API | 10 | manager ops |
| **À créer** : Pipeline éditorial SEO/GEO auto | 12 | content manager |
| **À créer** : Scoring lead en temps réel | 8 | sales ops |

#### Priorité 3 · Field notes (terrain courtes)

Format court 300-500 mots, ton très personnel. Publier 1 par semaine.

**Pipeline rédaction recommandée** :
- "Cette semaine on a câblé X chez Y. Voici ce qu'on a appris"
- "Pourquoi on a refusé une mission de 80 k€ hier"
- "Le bug qui nous a coûté 3 jours sur le pipeline Plateau"
- "Un client nous a demandé X. On a répondu Y. Voici pourquoi"

**Total cible année 1 : 40-50 field notes** (=écriture quasi-hebdo).

#### Priorité 4 · Cas clients narrés

Migrer + enrichir :
- Plateau (existant, à enrichir narrative)
- Halcyon
- Northbound
- Caserne
- 2-3 nouveaux clients

Chaque cas = ~1500-2000 mots prose éditoriale + KPI + workflow SVG.

#### Priorité 5 · Livres blancs

- IA PME B2B 2026 (existe — migrer)
- AI Act readiness (hardcoded — migrer)
- **À créer** : Growth System IA 2026 — playbook (40-60 pages)
- **À créer** : Gouvernance IA en PME — 12 questions à se poser (20 pages)

---

## SVG custom

### Stratégie : zéro stock, zéro placeholder, tout custom Waimia

**Existants déjà custom** (à conserver) :
- `AtlasConnections.astro` (système connectique atlas)
- `GrowthSystemDiagram.astro`
- `RevOpsFunnel.astro`
- Hero `signature-grid` background
- `hero-sig-mark` SVG V·9 monogram

**À créer pour les nouvelles sections** :

| SVG | Usage | Section |
|---|---|---|
| `WorkflowOrchestrationDiagram.astro` | Démo workflow CRM+GPT+Analytics dans hero offres | Hero col droite par défaut |
| `TunnelProgressDiagram.astro` | Indicateur tunnels 4 étapes | TunnelStepTemplate |
| `TaxonomyGraphDiagram.astro` | Visualisation tags relations | Page `/ressources/tag/[slug]` |
| `ArchiveTimelineDiagram.astro` | Timeline années archives | `/archive` |
| `CrossLinkingDiagram.astro` | Cluster pillar + spokes | Pages cluster blog |
| `AuthorPortraitMonogram.astro` | Monograms auteurs (initiales géométriques) | AuthorPageTemplate |
| `IndustryIconograms.astro` | Icones secteurs (Finance, Industrie, etc.) — vector signature, pas stock | Pages secteurs |
| `TechStackDiagram.astro` | Stack technologique modulaire | TechnologiesDetailTemplate |
| `LeadFunnelDiagram.astro` | Funnel lead générique | Pages cluster acquisition |
| `KPIBarChart.astro` | Chart KPI minimal mono (style FT data) | Cases section "Les chiffres" |
| `MaturityScale.astro` | Échelle maturité IA 5 niveaux | Audit maturité offre |
| `EditorialHairlineSet.astro` | Library hairlines déco (dingbats Waimia) | Sections transitions |

**Total : ~12 SVG custom à créer**. Chacun ~50-100 LoC SVG inline + composant Astro.

### Pattern SVG signature Waimia

**Doctrine** :
- Monochrome `var(--ink)` ou `var(--accent)` (jamais multi-color)
- Stroke-width 0.5-1 max (style architectural/blueprint)
- Pas d'icones génériques Feather/Lucide pour les sections principales
- Style "diagramme technique" + signature éditoriale
- Animations subtiles `stroke-dashoffset` ou `opacity` au scroll
- Toujours `aria-hidden` ou `<title>` selon contexte

---

## SSG / ISR

### Stratégie fresh content

**Astro 6 SSR + Vercel** support :
- **Static pages** (par défaut) : `export const prerender = true` → rebuild requis pour fresh content
- **ISR** (Incremental Static Regeneration) : Vercel Adapter avec `revalidate` directive sur SSR routes

**Recommandation pour Waimia** :

| Type contenu | Stratégie |
|---|---|
| Pages /offres/*, /solutions/*, /technologies/* | **SSG static** (prerender) — change rarement |
| Pages /agence/*, /404, /contact | **SSG static** — change quasi-jamais |
| Pages /cas/* | **SSG static** — change quand nouveau cas |
| Pages /ressources/blog/* | **SSG static** avec rebuild Vercel sur push GitHub |
| Page `/ressources/index` (hub) | **ISR 1h** — agrège tout, doit refléter rapidement nouveaux contenus |
| Page `/archive` | **ISR 6h** — pas critique fresh |
| Pages `/ressources/tag/[slug]` | **ISR 1h** — agrège cross-collection |
| Newsletter signup endpoint | **SSR dynamic** — POST /api/newsletter |

**Implémentation ISR Astro/Vercel** :

```ts
// pages/ressources/index.astro
export const prerender = false;
export const revalidate = 3600; // 1h
```

OU via Vercel Adapter config :

```ts
// astro.config.ts
import vercel from '@astrojs/vercel/serverless';
export default defineConfig({
  output: 'hybrid',
  adapter: vercel({ isr: { expiration: 3600 } }),
});
```

### Rebuild trigger

**Sources externes pour fresh content** :
- Push GitHub `main` → Vercel deploy (automatique)
- Webhook Notion/Airtable (si tu décides de rédiger contenu là-bas) → Vercel rebuild API
- Cron Vercel `/api/refresh` → invalide cache ISR

---

## Roadmap

### Phase A · Schema collections (Sonnet — 4h)

| # | Action | Détail |
|---|---|---|
| A1 | Étendre `content.config.ts` | Ajouter schemas `tunnels`, `landing-pages`, `newsletter`, étendre `blog` avec discriminator `type` |
| A2 | Migrer `/offres/*.astro` → `content/offres/*.mdx` | 7 pages hardcoded → MDX + frontmatter Zod-validated |
| A3 | Migrer `/solutions/*.astro` → `content/solutions/*.mdx` | 9 pages |
| A4 | Migrer `/technologies/*.astro` → `content/technologies/*.mdx` | 3 pages |
| A5 | Migrer `/cas/*.astro` → `content/cases/*.mdx` | 4 pages + 1 existant |
| A6 | Migrer `/offres/site-web-ia-tunnel/*.astro` → `content/tunnels/*.mdx` | 4 pages tunnel |

### Phase B · Hub agrégateur (Sonnet — 3h)

| # | Action |
|---|---|
| B1 | Refactor `/ressources/index.astro` en hub agrégateur cross-collection |
| B2 | Créer `/ressources/blog/[type].astro` (formation, essai, notes, avis, post) |
| B3 | Créer `/ressources/tag/[slug].astro` |
| B4 | Créer `/ressources/auteur/[slug].astro` |
| B5 | Refactor `/archive.astro` en timeline auto-générée |

### Phase C · Tunnels conversion (Sonnet — 4h)

| # | Action |
|---|---|
| C1 | Créer `TunnelStepTemplate.astro` (progress bar + nav prev/next) |
| C2 | Créer `/offres/[offre]/tunnel/[step].astro` dynamique |
| C3 | Rédiger 20 entrées tunnels (4 × 5 offres prioritaires) |
| C4 | Créer SVG `TunnelProgressDiagram.astro` |

### Phase D · Landing pages (Sonnet — 3h)

| # | Action |
|---|---|
| D1 | Créer collection `landing-pages` |
| D2 | Créer `LandingPageTemplate.astro` (3 variants : split, centered, full-bleed) |
| D3 | Créer `/lp/[slug].astro` |
| D4 | Rédiger 3-5 LP campagnes initiales |

### Phase D-bis · Welcome pages refactor (Sonnet — 2h)

| # | Action |
|---|---|
| Db1 | Créer collection `welcome-pages` (optionnel) ou refactor WelcomeTemplate avec schema en TS |
| Db2 | Refactor `WelcomeTemplate.astro` pattern : hero confirmation + next-steps + bonus + signature + fallback doors |
| Db3 | Migrer/créer 7 welcome pages : `audit`, `contact`, `livre-blanc`, `newsletter`, `formation`, `produit`, `abonnement` |
| Db4 | Wire redirects POST endpoints `/api/audit-booking` etc → /bienvenue/${trigger} |

### Phase D-ter · École / Formation (Sonnet — 6h)

| # | Action |
|---|---|
| Dt1 | Ajouter schemas `formations`, `parcours`, `ateliers` dans `content.config.ts` |
| Dt2 | Créer 5 templates : `EcoleHubTemplate`, `ParcoursDetailTemplate`, `FormationDetailTemplate`, `AtelierDetailTemplate`, `CertificationDetailTemplate` |
| Dt3 | Créer routes : `/ecole/`, `/ecole/parcours/[slug]`, `/ecole/cours/[slug]`, `/ecole/atelier/[slug]`, `/ecole/certification/[slug]` |
| Dt4 | Rédiger 8 entrées amorçage (5 formations + 2 parcours + 1 atelier) |
| Dt5 | Brancher Stripe Checkout pour inscriptions payantes |

### Phase D-quater · Produits (Sonnet — 4h)

| # | Action |
|---|---|
| Dq1 | Ajouter schema `produits` dans `content.config.ts` (avec SKU pattern) |
| Dq2 | Créer 2 templates : `ProduitsHubTemplate`, `ProduitDetailTemplate` |
| Dq3 | Créer routes : `/produits/`, `/produits/[slug]` |
| Dq4 | Rédiger 6 produits amorçage (audit-guide, kit-prompts, livre-blanc-premium, masterclass-replay, workbook, starter-pack) |
| Dq5 | Brancher Stripe Checkout / Gumroad / Lemonsqueezy pour purchase + signed URL delivery |
| Dq6 | Welcome page `/bienvenue/produit` post-purchase |

### Phase D-quinquies · Abonnements (Sonnet — 4h)

| # | Action |
|---|---|
| Dx1 | Ajouter schema `abonnements` dans `content.config.ts` |
| Dx2 | Créer 2 templates : `AbonnementsHubTemplate`, `AbonnementDetailTemplate` |
| Dx3 | Créer routes : `/abonnements/`, `/abonnements/[slug]` |
| Dx4 | Rédiger 6 abonnements amorçage (gestion-hebergement-vercel, maintenance, monitoring, content-production, crm-management, support-premium) |
| Dx5 | Brancher Stripe Subscriptions + portail client (Stripe Customer Portal) |
| Dx6 | Welcome page `/bienvenue/abonnement` post-souscription + onboarding |

### Phase E · Rédaction contenu massif (Opus + Sonnet — 30-50h)

**Estimation réaliste : 30-50h de rédaction**. Ce n'est pas du code applicatif, c'est du contenu éditorial premium.

| Priorité | Quantité | Workflow recommandé |
|---|---|---|
| Articles pillar essai (5 clusters) | 5 articles × 3000 mots | Opus draft + Simon edit + Sonnet polish |
| Articles cluster formation/notes/avis/post | 20 articles × 800-1500 mots | Sonnet draft + Simon edit |
| Cookbooks techniques | 4 cookbooks × 10-14 pages | Sonnet draft + dev validation |
| Field notes hebdo | 40-50 short-form × 300-500 mots | Simon dictation + Sonnet polish |
| Cas clients narrés | 4-5 cas × 1500-2000 mots | Simon interview + Sonnet rédaction |
| Livres blancs | 2 × 20-60 pages | Sonnet draft chapitre par chapitre |

### Phase F · SVG custom (Opus + Sonnet — 6h)

| # | SVG | Difficulté |
|---|---|---|
| F1 | `WorkflowOrchestrationDiagram` | Haute (système modulaire annoté) |
| F2 | `TunnelProgressDiagram` | Basse |
| F3 | `TaxonomyGraphDiagram` | Moyenne (force-directed mini) |
| F4 | `ArchiveTimelineDiagram` | Basse |
| F5 | `CrossLinkingDiagram` | Moyenne |
| F6 | `AuthorPortraitMonogram` | Basse (initiales géométriques) |
| F7 | `IndustryIconograms` × 4 | Moyenne (signature secteurs) |
| F8 | `TechStackDiagram` | Haute |
| F9 | `LeadFunnelDiagram` | Moyenne |
| F10 | `KPIBarChart` paramétrable | Moyenne (data-driven) |
| F11 | `MaturityScale` | Basse |
| F12 | `EditorialHairlineSet` (dingbats) | Basse |

### Phase G · ISR + perf (Opus — 2h)

| # | Action |
|---|---|
| G1 | Activer ISR sur `/ressources/index`, `/archive`, `/ressources/tag/*` |
| G2 | Vercel adapter config + revalidate strategies |
| G3 | Webhook rebuild sur publish Notion (si choisi) |
| G4 | Lighthouse audit final |

### Phase H · QA (Opus — 3h)

| # | Action |
|---|---|
| H1 | Triangulation visuelle pages migrées |
| H2 | Validation cross-collection links |
| H3 | Hreflang FR/EN |
| H4 | Schema.org validator tous types |
| H5 | Update doc `12-PAGES-QUALITY-TRACKING.md` avec statuts finaux |

---

## Synthèse — total restant

| Phase | Estimation | Status |
|---|---|---|
| A · Schema + migration content | 4h | ❌ |
| B · Hub agrégateur | 3h | ❌ |
| C · Tunnels conversion | 4h | ❌ |
| D · Landing pages | 3h | ❌ |
| D-bis · Welcome pages refactor | 2h | ❌ |
| D-ter · École / Formation | 6h | ❌ |
| D-quater · Produits | 4h | ❌ |
| D-quinquies · Abonnements | 4h | ❌ |
| E · Rédaction contenu | **30-50h** | ❌ |
| F · SVG custom | 6h | ❌ |
| G · ISR + perf | 2h | ❌ |
| H · QA | 3h | ❌ |
| **Total** | **71-91h** | — |

**Note** : la phase E (rédaction) est de loin la plus longue. C'est aussi celle qui ne peut pas être 100% automatisée — Simon doit valider/éditer chaque pièce de contenu pillar pour qu'elle reflète vraiment Waimia.

---

## Décisions à prendre par Simon

1. **Tags canoniques** : valides la liste de 16 tags ? Veux-tu ajouter/supprimer ?
2. **Sous-types blog** : confirmes formation/essai/notes/avis/post comme discriminator ? Ou autre nomenclature ?
3. **CMS rédaction** : Notion (avec webhook → Vercel rebuild) ou direct MDX dans repo ?
4. **Workflow content** : tu rédiges seul ou on capitalise sur ton dictée + transcription + édition ?
5. **Timing** : on attaque Phase A (schema + migration content) tout de suite ? Ou on commence par C (tunnels) qui débloque conversion ?
6. **Priorité offres pour tunnels** : confirme la liste (site-web-ia, growth-system-ia, activation-ia, revops, application-ia-pme) ?

---

_Doc maintenu par l'orchestrateur Claude. Update après chaque phase._
