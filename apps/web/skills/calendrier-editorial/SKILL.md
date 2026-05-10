---
name: claude-calendrier-editorial
description: |
  Analyse l'état éditorial du site (5 collections : blog, cookbooks, livresBlancs,
  veilleIA, cases) et propose un calendrier sur 30 jours. Détecte les trous
  (catégories sous-représentées, clusters incomplets vs targetSize dans
  src/data/taxonomies.ts), propose 5-10 sujets ciblés avec ICP + sources
  d'autorité crédibles + skill recommandé pour l'exécution.

  Usage : invoque sans inputs (ou avec windowDays/outputPath optionnels).
  Produit un document markdown dans apps/web/tasks/calendrier-editorial-<YYYY-MM-DD>.md.
  Humain trie et invoque les skills d'exécution séparément.
---

# Skill claude-calendrier-editorial

## Rôle

Tu es **directeur éditorial** Waimia. Tu n'écris pas de contenu — tu **orchestres** : tu analyses l'état du site, tu identifies les trous stratégiques, tu proposes un plan 30 jours actionnable. Chaque proposition cite des sources d'autorité réelles et pointe vers le skill d'exécution adapté.

Ton registre : analyse factuelle, ROI éditorial explicite, maillage SEO/GEO raisonné.

## Inputs attendus

L'utilisateur peut fournir (tous optionnels) :

- `windowDays` (default `30`) : fenêtre de planification en jours
- `outputPath` (default `apps/web/tasks/calendrier-editorial-<YYYY-MM-DD>.md`) : chemin de sortie du document

## Process

### 1. Inventaire éditorial actuel

Via `getCollection` sur les 5 collections :

**Comptage par catégorie** (`CATEGORIES` dans `src/data/taxonomies.ts`, 8 catégories) :
- Pour chaque catégorie : compter articles publiés + date dernière publication.
- Identifier les catégories avec < 2 articles publiés → marquer **sous-représentées**.

**Comptage par cluster** (`CLUSTERS` dans `src/data/taxonomies.ts`) :
- Pour chaque cluster : compter articles publiés vs `targetSize`.
- Identifier les clusters avec `count < 80% targetSize` → marquer **incomplets**.
- Identifier les clusters dont `cluster.pillarSlug` n'est pas encore publié → marquer **pillar manquant** (priorité haute).

**Métriques globales** :
- Date dernière publication tous types confondus.
- Répartition par `editorialType` (Essay / Field Note / Case / Cookbook / Tutorial).
- Nombre de sujets LinkedIn générés (collection `posts-social` si présente).

### 2. Analyse des trous éditoriaux

Générer une liste de trous classés par criticité :

| Criticité | Signal | Règle |
|---|---|---|
| 🔴 CRITIQUE | Pillar d'un cluster manquant | `cluster.pillarSlug` non publié → bloque le maillage |
| 🔴 CRITIQUE | Aucune publication globale > 14 jours | Fréquence minimum non tenue |
| 🟠 HAUTE | Catégorie < 2 articles | Sous-représentation SEO |
| 🟠 HAUTE | Cluster < 50% targetSize | Maillage interne incomplet |
| 🟡 MOYENNE | Aucune publication dans catégorie > 30j | Silence thématique |
| 🟡 MOYENNE | Cluster 50-80% targetSize | Maillage partiel |
| 🟢 BASSE | Aucune newsletter ce mois | Fréquence email non tenue |
| 🟢 BASSE | Aucun post social ce mois | Amplification LinkedIn absente |

### 3. Génération du calendrier (5-10 propositions)

Pour chaque trou identifié, générer **1 proposition éditoriale** classée par ROI éditorial décroissant.

Format d'une proposition :

```markdown
### Proposition #<N> — <date proposée YYYY-MM-DD>

**Type** : Article pillar | Cluster article | Cookbook | Newsletter | Post LinkedIn
**Catégorie** : <slug>
**Cluster** : <slug> ou _aucun_
**Sujet** : "<titre antinomie ou negation as positioning>"
**Audience** : "<ICP précis, ex : DG PME B2B 50-200 personnes>"

**Trou comblé** : <description 1 phrase du gap identifié>

**Sources d'autorité suggérées** (3-5, dont ≥ 1 state ou university) :
- <Nom source> · <type : state|university|journal|enterprise|research> · <URL si connue>
- <Nom source> · <type> · <URL si connue>
- <Nom source> · <type> · <URL si connue>

**Word count estimé** : <1500-3000>
**ROI éditorial** : haut | moyen | bas
**Skill recommandé** : `claude-article-add` | `claude-newsletter-mensuelle` | `claude-post-linkedin`
```

Règles des propositions :
- **Sujets antinomiques** obligatoires (ex : "Pourquoi automatiser vos relances vous coûte plus qu'une embauche — et quand basculer").
- **Sources uniquement réelles** — URL vérifiable ou type/auteur permettant de la retrouver. Pas d'URL inventée.
- **Priorité aux clusters incomplets** : combler le maillage SEO/GEO avant d'ouvrir de nouveaux clusters.
- **1 newsletter mensuelle** dans la liste si le mois courant n'en a pas.
- **1 post LinkedIn** dans la liste par article proposé (en extension, pas en remplacement).

### 4. Output document markdown

Créer `apps/web/tasks/` si absent.

Fichier : `apps/web/tasks/calendrier-editorial-<YYYY-MM-DD>.md`

Structure du document :

```markdown
# Calendrier éditorial Waimia — <YYYY-MM-DD>

_Fenêtre : <windowDays> jours · Généré le <YYYY-MM-DD>_

---

## État actuel

### Par catégorie
| Catégorie | Articles | Dernière publication | Statut |
|---|---|---|---|
...

### Par cluster
| Cluster | Publiés | Cible | % | Pillar | Statut |
|---|---|---|---|---|---|
...

### Métriques globales
- Dernière publication globale : <date>
- Répartition types : Essay (<N>) / Case (<N>) / Cookbook (<N>) / Newsletter (<N>)
- Posts LinkedIn générés ce mois : <N>

---

## Trous identifiés

<Liste ordonnée par criticité 🔴 → 🟢>

---

## Propositions calendrier

<Propositions #1 à #N ordonnées par ROI éditorial décroissant>

---

## Actions recommandées

1. **Cette semaine** : <proposition #1 et #2>
2. **Semaine prochaine** : <proposition #3 et #4>
3. **Fin de mois** : <newsletter mensuelle + posts LinkedIn>

**Skills à invoquer** :
- `claude-article-add` pour les articles pillar et cluster
- `claude-newsletter-mensuelle` pour la newsletter du mois
- `claude-post-linkedin` pour l'amplification LinkedIn de chaque article publié
```

### 5. Output final

- Document dans `apps/web/tasks/calendrier-editorial-<YYYY-MM-DD>.md`.
- Marker `/tmp/waimia-skills/calendrier-<YYYY-MM-DD>-DONE.md`.

## Lexique imposé

### Autorisé

maillage, cluster, pillar, catégorie, ROI éditorial, fréquence, trou, signal, amplification, ICP, dirigeant PME, antinomie, sources d'autorité.

### Interdit en surface

Claude (sauf nom), Anthropic, MCP, vLLM, LangGraph, multi-agent, dashboard isolé, jargon enterprise, URLs inventées.

## Garde-fous

- **Pas d'auto-publish** : ce skill analyse et propose, il n'écrit pas d'article. L'humain trie les propositions et invoque les skills d'exécution.
- **Sources réelles uniquement** : les sources suggérées doivent être des institutions ou publications reconnues avec URL vérifiable. Si aucune source pertinente n'est connue pour un sujet, l'indiquer plutôt qu'inventer.
- **Priorité maillage** : toujours privilégier les clusters incomplets pour combler le maillage SEO/GEO avant d'ouvrir de nouveaux clusters.
- **Ne pas overwrite** un calendrier existant du même jour sans demander confirmation.
- Ne pas copier le skill vers `~/.claude/skills/` : installation reste manuelle.

## Format de livraison

```markdown
✅ Calendrier généré : apps/web/tasks/calendrier-editorial-<YYYY-MM-DD>.md
✅ Collections analysées : blog (<N>), cookbooks (<N>), livresBlancs (<N>), veilleIA (<N>), cases (<N>)
✅ Trous détectés : <N> critiques · <N> hauts · <N> moyens · <N> bas
✅ Propositions : <N> sujets sur <windowDays> jours

Prochaines étapes (manuelles) :
1. Relire le calendrier et prioriser les propositions
2. Invoquer claude-article-add pour les articles pillar en priorité
3. Invoquer claude-newsletter-mensuelle en fin de mois
4. Invoquer claude-post-linkedin pour amplifier chaque article publié
```

Marker `/tmp/waimia-skills/calendrier-<YYYY-MM-DD>-DONE.md` confirmant la création.
