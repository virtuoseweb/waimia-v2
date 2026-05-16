# 26 — Audit pré-suppression collections legacy

Audit lecture-seule · généré 2026-05-16 · pour T3.1f + T3.3d

---

## 1. Collections à supprimer (T3.1f + T3.3d)

| Collection | Statut | Remplacé par |
|---|---|---|
| `formations` | À supprimer | `courses` (course_type: 'formation') |
| `parcours` | À supprimer | `courses` (course_type: 'parcours') |
| `ateliers` | À supprimer | `courses` (course_type: 'atelier') |
| `fieldNotes` | À supprimer | `blog` (type: 'field-note') |
| `veilleIA` | À supprimer | `blog` (type: 'veille-ia') |

---

## 2. Consumers à refactorer

### formations / parcours / ateliers

| Fichier | Ligne | Type usage |
|---|---|---|
| `src/pages/ecole/index.astro` | 8-10 | getCollection × 3 |
| `src/pages/ecole/cours/[slug].astro` | 9 | getStaticPaths basé sur formations |

**Action** : remplacer par `getCollection('courses')` puis filter par `course_type === 'formation'` (etc).

### fieldNotes / veilleIA

| Fichier | Ligne | Type usage |
|---|---|---|
| `src/components/ui/molecules/TaxonomyMenu.astro` | 9 | getCollection('veilleIA') |
| `src/pages/rss.xml.ts` | 10 | RSS aggregator |
| `src/pages/equipe/index.astro` | 49 | Author listing |
| `src/pages/equipe/[...slug].astro` | 44 | Author detail |
| `src/pages/ressources/silo/[...slug].astro` | 31 | Silo aggregator |
| `src/pages/ressources/veille-ia/[...slug].astro` | 9 | Detail route |
| `src/pages/ressources/field-notes/[slug].astro` | 13 | Detail route |
| `src/pages/ressources/categorie/[...slug].astro` | 31 | Category aggregator |
| `src/pages/ressources/field-notes/index.astro` | 12 | Index route |
| `src/pages/ressources/veille-ia/rss.xml.ts` | 8 | RSS feed |

**Action** : remplacer par `getCollection('blog')` puis filter par `type === 'field-note' || 'veille-ia'`.

---

## 3. MDX à migrer

```bash
ls src/content/fieldNotes/*.mdx | wc -l   # X fichiers à migrer
ls src/content/veilleIA/*.mdx | wc -l     # Y fichiers à migrer
ls src/content/formations/*.mdx | wc -l   # Z fichiers (3 déjà migrés vers courses/)
ls src/content/parcours/*.mdx | wc -l     # ? fichiers
ls src/content/ateliers/*.mdx | wc -l     # ? fichiers
```

---

## 4. Plan refactor (batch futur)

### Phase A · Migration MDX

1. Pour chaque MDX dans `fieldNotes/`, créer un MDX miroir dans `blog/` avec `type: 'field-note'` + champs blog requis (author, excerpt, publishedAt, etc.)
2. Idem pour `veilleIA/` → `blog/` avec `type: 'veille-ia'`
3. Idem pour `formations/parcours/ateliers/` → `courses/` avec `course_type` discriminator

### Phase B · Refactor consumers

1. `getCollection('fieldNotes')` → `getCollection('blog').filter(b => b.data.type === 'field-note')`
2. Idem pour les 10 consumers identifiés
3. Tester chaque route après refactor (build + visite manuelle)

### Phase C · Suppression

1. Supprimer les anciennes collections de `content.config.ts` (5 entries)
2. Supprimer les répertoires `src/content/{fieldNotes,veilleIA,formations,parcours,ateliers}/`
3. Build complet OK

---

## 5. Critère acceptation

- 0 référence `getCollection('formations|parcours|ateliers|fieldNotes|veilleIA')` dans `src/`
- 0 import depuis ces collections
- Build prod OK avec mêmes routes générées (sitemap)
- Tracker T3.1f + T3.3d cochés ✅

---

## 6. Risques

- **Routes 404** si une URL legacy `/ressources/field-notes/X` n'est plus générée
- **RSS feeds** : `/ressources/veille-ia/rss.xml` doit continuer à fonctionner
- **Author detail pages** doivent toujours lister les contenus migrés

**Recommandation** : déléguer à un worker Sonnet avec brief précis, après validation du plan par Simon.
