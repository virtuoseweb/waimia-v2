# 03 · Content Models · frontmatters par modèle de page

> Source de vérité Zod : `site/src/content/config.ts`.
> Cette doc explique le **pourquoi** de chaque champ. Le code est l'**autorité**.

## Modèles de page · arborescence

| Modèle             | Route                      | Collection         |
|--------------------|----------------------------|--------------------|
| Homepage           | `/`, `/en`                 | (page Astro pure)  |
| Offre détail       | `/offres/[slug]`           | `offres`           |
| Solution détail    | `/solutions/[slug]`        | `solutions`        |
| Technologie détail | `/technologies/[slug]`     | `technologies`     |
| Cas client         | `/ressources/cas/[slug]`   | `cases`            |
| Article blog       | `/ressources/blog/[slug]`  | `blog`             |
| Field note         | `/ressources/notes/[slug]` | `field-notes`      |
| Hub                | `/offres`, `/solutions`, `/technologies`, `/ressources` | (pages Astro)|

## Frontmatter commun (mixin)

Tous les MDX héritent de :

```yaml
---
title_fr: string
title_en: string
description_fr: string  # 140-160
description_en: string
slug: string            # kebab-case, cohérent FR/EN
publishedAt: ISO date
updatedAt: ISO date
canonical?: string      # URL absolue si différent du calculé
seo:
  ogImage?: string      # 1200×630
  noindex?: boolean     # default false
faq_fr?: [{ q, a }]
faq_en?: [{ q, a }]
---
```

## `cases` — études de cas

```yaml
client: string                    # "Plateau"
sector_fr: string                 # "SaaS B2B"
sector_en: string
duration: string                  # "10 wk"
stack: string[]                   # ["Claude", "HubSpot", "dbt"]
impact_fr: string                 # "+2,4 M€ pipeline récupéré"
impact_en: string
metrics:
  - label_fr: string
    label_en: string
    value: string                 # "+2.4M€"
ndaProtected?: boolean            # default false
featured?: boolean                # apparaît home
heroImage?: string
```

JSON-LD : `Article` avec `about` = `Service` lié.

## `offres` — fiches Offre

```yaml
tier: 1 | 2 | 3 | 4              # pyramide
category_fr: "Conseil & Audit" | "Déploiement Light" | "Orchestration & MVP" | "Enterprise Scale"
category_en: ...
priceFrom?: string                # "à partir de 12 000 €"
duration: string                  # "5 jours" / "4 semaines"
deliverables_fr: string[]
deliverables_en: string[]
included:
  - name_fr: string
    name_en: string
relatedSolutions: string[]        # slugs solutions
relatedTechnologies: string[]
caseStudies: string[]             # slugs cases
```

JSON-LD : `Service` + `Offer`.

## `solutions` — fiches Métier/Industrie

```yaml
kind: "department" | "industry"
slug: string                      # "finance", "support", "sante"…
icon?: string                     # nom Lucide / svg path
metricsHero:
  - label_fr: string
    label_en: string
    value: string
useCases_fr: string[]
useCases_en: string[]
constraints_fr?: string[]         # contraintes industrie (HIPAA, ACPR…)
constraints_en?: string[]
relatedOffres: string[]
caseStudies: string[]
```

JSON-LD : `Service`.

## `technologies` — fiches Tech

```yaml
family: "Claude" | "OpenSource" | "Frameworks" | "Office"
vendor?: string                   # "Anthropic", "Meta", "Alibaba"
modelVersion?: string             # "Opus 4.7"
contextWindow?: string            # "1M tokens"
strengths_fr: string[]
strengths_en: string[]
limits_fr?: string[]
limits_en?: string[]
useWhen_fr: string                # 1-2 phrases · sweet spot
useWhen_en: string
relatedOffres: string[]
```

## `blog` — articles long-form

```yaml
category: "Field Note" | "Case" | "Essay" | "Cookbook" | "Tutorial"
author:
  name: string
  url?: string
  bio_fr?: string
  bio_en?: string
readingTime?: number              # minutes
heroImage?: string
tags: string[]
relatedPosts?: string[]
```

JSON-LD : `Article` + `Person`.

## `field-notes` — notes de terrain courtes

```yaml
date: ISO date
tag_fr: "FIELD NOTE" | "CASE" | "ESSAY" | "COOKBOOK" | "RECETTE"
tag_en: ...
sourceUrl?: string                # si réfère à une discussion publique
```

Forme courte (200-500 mots), apparaissent en feed sur la home.

## Hub pages (Offres, Solutions, Technologies, Ressources)

Pages Astro avec contenu en partie statique (intro, FAQ) + en partie dérivé des collections (grilles dynamiques).

Le frontmatter Astro est dans `src/data/hubs/{offres,solutions,technologies,ressources}.ts` (TS, pas MDX) car c'est de la structure de page, pas de la prose.

## Validation Zod (extrait)

Voir `site/src/content/config.ts` pour la version exécutée. Tout MDX qui ne respecte pas le schéma fait échouer `pnpm build` — ce qui est volontaire (zéro contenu cassé en production).
