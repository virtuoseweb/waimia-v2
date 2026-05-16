# 24 · Migration fieldNotes + veilleIA → blog (schema unifié)

**Date :** 2026-05-16 · Mission T3.3

---

## Section 1 · Diff schema : fieldNotes / veilleIA → blog

### fieldNotes (`src/content/field-notes/`)

| Champ fieldNotes | Type | Champ blog cible | Stratégie |
|---|---|---|---|
| `title_fr` | string (required) | `title_fr` | Direct ✓ |
| `title_en` | string (required) | `title_en` | Direct ✓ |
| `description_fr` | string min(40) max(180) | `description_fr` | Direct ✓ |
| `description_en` | string min(40) max(180) | `description_en` | Direct ✓ |
| `slug` | kebab-case | `slug` | Direct (ou préfixer) ✓ |
| `publishedAt` | date | `publishedAt` | Direct ✓ |
| `date` | date (redondant) | *(supprimer)* | Doublonne publishedAt |
| `tag_fr` | enum NOTE/CAS/ESSAI/RECETTE | `editorialType` + `type` | `NOTE`→`type:"field-note"`, `ESSAI`→`type:"field-note"` + `editorialType:"Field Note"` ou `"Essay"` |
| `tag_en` | enum FIELD NOTE/CASE/ESSAY/COOKBOOK | `editorialType` | Mapping direct vers enum blog |
| `sourceUrl` | url optional | `sources[].url` | Reformater en objet `sources[]` si présent |
| *(absent)* | — | `author` (required) | Ajouter `simon-beros` par défaut |
| `category` | string libre | `category` | Mapper vers enum blog si possible ; sinon omettre |
| `tags` | array kebab-case | `tags` | Direct ✓ |

**Champs ajoutés obligatoires pour blog :**
- `author: simon-beros` (required dans blog, absent dans fieldNotes)
- `contributors: []`
- `relatedPosts: []`
- `relatedSolutions: []`
- `relatedOffres: []`
- `relatedCases: []`
- `relatedSecteurs: []`
- `sources: []`

**Champs à supprimer (absents du schema blog) :**
- `date` (redondant avec `publishedAt`)
- `tag_fr` / `tag_en` (remplacés par `type` + `editorialType`)
- `sourceUrl` (à migrer vers `sources[]`)

---

### veilleIA (`src/content/veille-ia/`)

| Champ veilleIA | Type | Champ blog cible | Stratégie |
|---|---|---|---|
| `title_fr` | string (required) | `title_fr` | Direct ✓ |
| `title_en` | string (required) | `title_en` | Direct ✓ |
| `description_fr` | string min(40) max(180) | `description_fr` | Direct ✓ |
| `description_en` | string min(40) max(180) | `description_en` | Direct ✓ |
| `slug` | kebab-case | `slug` | Direct ✓ |
| `publishedAt` | date | `publishedAt` | Direct ✓ |
| `date` | date (redondant) | *(supprimer)* | Doublonne publishedAt |
| `impact_fr` | string min(40) max(280) | `excerpt_fr` | Renommer (sémantique proche) |
| `impact_en` | string min(40) max(280) | `excerpt_en` | Renommer (sémantique proche) |
| `sectors` | array string | `tags` | Fusionner dans `tags` |
| `author` | reference('authors') | `author` | Direct ✓ |
| `contributors` | array reference | `contributors` | Direct ✓ |
| `category` | enum (taxonomyFields) | `category` | Direct si valeur dans enum blog ✓ |
| `tags` | array kebab-case | `tags` | Direct ✓ |
| `sources` | array | `sources` | Direct ✓ |
| `relatedSolutions` | array | `relatedSolutions` | Direct ✓ |
| `relatedOffres` | array | `relatedOffres` | Direct ✓ |
| `relatedCases` | array | `relatedCases` | Direct ✓ |
| `relatedSecteurs` | array | `relatedSecteurs` | Direct ✓ |

**Champs ajoutés pour blog :**
- `type: "veille-ia"` (discriminateur)
- `relatedPosts: []`

**Champs à supprimer :**
- `date` (redondant avec `publishedAt`)
- `impact_fr` / `impact_en` (renommés → `excerpt_fr` / `excerpt_en`)
- `sectors` (fusionné dans `tags`)

---

## Section 2 · Inventaire des MDX existants

### Collection `fieldNotes` — `src/content/field-notes/` (3 fichiers)

| Fichier | slug | tag_fr | tag_en |
|---|---|---|---|
| `2026-05-15-composable-adoption.mdx` | `composable-adoption` | NOTE | FIELD NOTE |
| `2026-05-15-design-system-ferme.mdx` | `design-system-ferme` | ESSAI | ESSAY |
| `2026-05-15-parallelisation-sonnet.mdx` | `parallelisation-sonnet` | NOTE | FIELD NOTE |

**Total fieldNotes : 3 fichiers**

### Collection `veilleIA` — `src/content/veille-ia/` (1 fichier)

| Fichier | slug | sectors |
|---|---|---|
| `gpt-4o-vision-update.mdx` | `gpt-4o-vision-update` | finance, rh, juridique |

**Total veilleIA : 1 fichier**

**Grand total à migrer (T3.3d) : 4 fichiers**

---

## Section 3 · Recipe de migration — avant/après frontmatter complet

### 3a · fieldNotes → blog (exemple : composable-adoption)

**AVANT** (`src/content/field-notes/2026-05-15-composable-adoption.mdx`) :
```yaml
---
title_fr: "Adopter le composable V2 sans casser sa prod · field note"
title_en: "Adopting composable V2 without breaking prod · field note"
description_fr: "Comment migrer progressivement vers SectionsRenderer en préservant les pages existantes — le pattern back-compat avec branche conditionnelle."
description_en: "How to progressively migrate to SectionsRenderer while preserving existing pages — the back-compat pattern with conditional branch."
slug: "composable-adoption"
publishedAt: 2026-05-15
date: 2026-05-15          # ← à supprimer
category: "ingenierie"    # ← hors enum blog, à remplacer par valeur valide
tags: ["composable", "architecture", "back-compat"]
tag_fr: "NOTE"            # ← à supprimer (→ type)
tag_en: "FIELD NOTE"      # ← à supprimer (→ editorialType)
---
```

**APRÈS** (`src/content/blog/migrated-fieldnote-composable-adoption.mdx`) :
```yaml
---
title_fr: "Adopter le composable V2 sans casser sa prod · field note"
title_en: "Adopting composable V2 without breaking prod · field note"
description_fr: "Comment migrer progressivement vers SectionsRenderer en préservant les pages existantes — le pattern back-compat avec branche conditionnelle."
description_en: "How to progressively migrate to SectionsRenderer while preserving existing pages — the back-compat pattern with conditional branch."
slug: migrated-fieldnote-composable-adoption
publishedAt: 2026-05-15
type: "field-note"           # ← discriminateur V2
editorialType: "Field Note"  # ← rétrocompat V1
author: simon-beros           # ← ajouté (required dans blog)
contributors: []
category: pilotage            # ← "ingenierie" → "pilotage" (plus proche)
tags:
  - composable
  - architecture
  - back-compat
excerpt_fr: "Le pattern back-compat pour migrer vers SectionsRenderer page par page, sans bloquer la production."
excerpt_en: "The back-compat pattern to migrate toward SectionsRenderer page by page, without blocking production."
relatedPosts: []
relatedSolutions: []
relatedOffres: []
relatedCases: []
relatedSecteurs: []
sources: []
---
```

**Mapping tag_fr → type + editorialType :**

| tag_fr (fieldNotes) | tag_en | type (blog) | editorialType (blog) |
|---|---|---|---|
| NOTE | FIELD NOTE | `field-note` | `Field Note` |
| ESSAI | ESSAY | `field-note` | `Essay` |
| CAS | CASE | `field-note` | `Case` |
| RECETTE | COOKBOOK | `field-note` | `Cookbook` |

---

### 3b · veilleIA → blog (exemple : gpt-4o-vision-update)

**AVANT** (`src/content/veille-ia/gpt-4o-vision-update.mdx`) :
```yaml
---
title_fr: "GPT-4o : nouvelles capacités vision pour l'analyse de documents B2B"
title_en: "GPT-4o: New Vision Capabilities for B2B Document Analysis"
description_fr: "OpenAI améliore les capacités vision de GPT-4o pour l'analyse de documents structurés, ouvrant de nouveaux cas d'usage en finance et RH."
description_en: "OpenAI improves GPT-4o vision capabilities for structured document analysis, opening new use cases in finance and HR."
slug: "gpt-4o-vision-update"
publishedAt: 2026-05-14
date: 2026-05-14          # ← à supprimer
category: "pilotage"
tags: ["gpt-4o", "vision", "documents-ia"]
impact_fr: "Les PME B2B peuvent désormais..."   # ← à supprimer (→ excerpt_fr)
impact_en: "B2B SMBs can now automate..."        # ← à supprimer (→ excerpt_en)
sectors: ["finance", "rh", "juridique"]          # ← à supprimer (→ fusionner dans tags)
author: simon-beros
contributors: []
---
```

**APRÈS** (`src/content/blog/migrated-veille-gpt-4o-vision-update.mdx`) :
```yaml
---
title_fr: "GPT-4o : nouvelles capacités vision pour l'analyse de documents B2B"
title_en: "GPT-4o: New Vision Capabilities for B2B Document Analysis"
description_fr: "OpenAI améliore les capacités vision de GPT-4o pour l'analyse de documents structurés, ouvrant de nouveaux cas d'usage en finance et RH."
description_en: "OpenAI improves GPT-4o vision capabilities for structured document analysis, opening new use cases in finance and HR."
slug: migrated-veille-gpt-4o-vision-update
publishedAt: 2026-05-14
type: "veille-ia"            # ← discriminateur V2
editorialType: "Field Note"  # ← rétrocompat V1 (type le plus proche)
author: simon-beros
contributors: []
category: pilotage
tags:
  - gpt-4o
  - vision
  - documents-ia
  - finance        # ← fusionné depuis sectors[]
  - rh             # ← fusionné depuis sectors[]
  - juridique      # ← fusionné depuis sectors[]
excerpt_fr: "Les PME B2B peuvent désormais automatiser l'extraction de données de factures, devis et contrats sans développement custom coûteux, réduisant les saisies manuelles de 60 à 80 %."
excerpt_en: "B2B SMBs can now automate data extraction from invoices, quotes, and contracts without costly custom development, reducing manual entry by 60 to 80 percent."
relatedPosts: []
relatedSolutions: []
relatedOffres: []
relatedCases: []
relatedSecteurs: []
sources: []
---
```

---

## Section 4 · Plan de bascule complète (T3.3d)

### Prérequis avant exécution

- [ ] Tous les MDX de `field-notes/` et `veille-ia/` migrés vers `blog/` (voir section 2 : 4 fichiers)
- [ ] Les routes `/field-notes/*` et `/veille-ia/*` redirigées (301) vers `/blog/*`
- [ ] `astro check` sans erreur sur la collection `blog` avec les nouveaux MDX
- [ ] Vérification que aucune page `.astro` ne fait `getCollection('fieldNotes')` ou `getCollection('veilleIA')` directement (sinon migrer ces appels d'abord)

### Étapes de bascule (T3.3d)

**Étape 1 — Migrer tous les MDX restants**

Fichiers à créer dans `src/content/blog/` :
- `fieldnote-design-system-ferme.mdx` (depuis `field-notes/2026-05-15-design-system-ferme.mdx`)
- `fieldnote-parallelisation-sonnet.mdx` (depuis `field-notes/2026-05-15-parallelisation-sonnet.mdx`)
- Les 2 exemples T3.3 sont déjà créés (migrated-fieldnote-* et migrated-veille-*)

Appliquer la recipe section 3 à chaque fichier. Points d'attention :
- `design-system-ferme` : `tag_fr: ESSAI` → `type: "field-note"` + `editorialType: "Essay"`
- `category: "design-system"` → hors enum blog → utiliser `category: pilotage` ou omettre

**Étape 2 — Audit des appels getCollection dans les pages .astro**

```bash
grep -rn "getCollection\('fieldNotes'\)\|getCollection\('veilleIA'\)" src/pages/
```

Pour chaque occurrence : remplacer par `getCollection('blog')` + filtrer sur `data.type === 'field-note'` ou `data.type === 'veille-ia'`.

**Étape 3 — Ajouter les redirects 301**

Dans `astro.config.mjs` (ou `vercel.json`) :
```js
redirects: {
  '/field-notes/[slug]': '/blog/[slug]',
  '/veille-ia/[slug]': '/blog/[slug]',
}
```

**Étape 4 — Supprimer les collections de `content.config.ts`**

Une fois toutes les pages .astro migrées :
- Supprimer `const fieldNotes = defineCollection(...)` (lignes ~362-371)
- Supprimer `const veilleIA = defineCollection(...)` (lignes ~491-503)
- Supprimer `fieldNotes` et `veilleIA` de l'export `collections` (lignes ~1276-1278)

**Étape 5 — Supprimer les répertoires source**

```bash
rm -rf src/content/field-notes/
rm -rf src/content/veille-ia/
```

**Étape 6 — Validation finale**

```bash
astro check          # 0 erreur
astro build          # build complet sans erreur
```

### Mapping slug final (pour les redirects)

| Ancien slug | Collection | Nouveau slug blog |
|---|---|---|
| `composable-adoption` | fieldNotes | `migrated-fieldnote-composable-adoption` |
| `design-system-ferme` | fieldNotes | `fieldnote-design-system-ferme` |
| `parallelisation-sonnet` | fieldNotes | `fieldnote-parallelisation-sonnet` |
| `gpt-4o-vision-update` | veilleIA | `migrated-veille-gpt-4o-vision-update` |

> **Note :** Les slugs préfixés `migrated-*` sont utilisés pour les exemples T3.3. La bascule complète T3.3d pourra simplifier en conservant les slugs originaux (sans préfixe) pour éviter les changements d'URL.
