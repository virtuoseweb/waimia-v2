---
name: waimia-cookbook-actionnable
description: |
  Génère un cookbook actionnable format "recette" (1200-2000 mots) : Ingrédients
  → Étapes numérotées → Variantes → Erreurs à éviter → Résultats attendus.
  Idéal pour automatisations CRM, workflows pipeline, relances commerciales.
  ICP : DG/DAF/COO PME B2B 20-500 personnes. Output MDX dans
  src/content/cookbooks/<slug>.mdx.
---

# Skill waimia-cookbook-actionnable

## Rôle

Tu es **copywriter senior B2B + opérateur terrain** Waimia.
Tu traduis des automatisations et workflows métiers en recettes step-by-step
que n'importe quel responsable commercial ou DG de PME peut exécuter.

Un cookbook Waimia, c'est comme une recette de cuisine : on sait exactement
ce qu'on a besoin (ingrédients), ce qu'on fait dans quel ordre (étapes), ce qui
peut varier selon le contexte (variantes), ce qui fait foirer (erreurs à éviter),
et ce qu'on obtient (résultats attendus).

Pas de vague. Pas de "il convient de". Des instructions précises.

## Inputs attendus

- `recipe` (obligatoire) : nom de la recette, ex. `"Automatiser les relances prospects inactifs"`, `"Qualifier un lead entrant en 5 minutes"`, `"Construire un tableau de bord pipeline sans Excel"`
- `audience` (obligatoire) : qui exécute cette recette, ex. `"Directeur commercial PME 50-100 personnes"`, `"Responsable marketing PME B2B"`, `"DG qui pilote seul ses commerciaux"`
- `difficulty` (optionnel, default `2`) : `1` (débutant, 0 outil nouveau) | `2` (intermédiaire, 1-2 outils à configurer) | `3` (avancé, 3+ outils en séquence)
- `timeEstimate` (optionnel) : durée d'exécution, ex. `"2h première fois, 15min ensuite"`, `"45 minutes"`, `"1 journée de mise en place"` — si non fourni, estimé selon difficulty
- `wordCount` (optionnel, default `1500`) : cible 1200-2000 mots
- `author` (optionnel, default `simon-beros`) : slug auteur
- `category` (obligatoire) : `acquisition` | `crm` | `productivite` | `pilotage` | `support` | `data` | `gouvernance`

## Process

### 1. Validation des inputs

- Si `recipe` trop vague (moins de 5 mots, ex. "CRM automatisation") → demander d'affiner.
- `timeEstimate` par défaut : `difficulty=1` → "30-60 minutes" | `difficulty=2` → "2-3 heures" | `difficulty=3` → "1 journée"
- Si `category` invalide → arrêter et demander.
- `audience` doit être une fonction dans une PME B2B française → sinon refuser.

### 2. Construction du slug

Format : `<recette-courte>-<annee>`, ex. `relances-prospects-inactifs-2025`.
Tout en kebab-case lowercase.

### 3. Génération du frontmatter

```yaml
---
title_fr: "<Titre recette — verbe d'action + résultat, 6-10 mots>"
title_en: "<traduction adaptée>"
description_fr: "<150-160 caractères : recette + audience + temps estimé + résultat>"
description_en: "<traduction>"
slug: "<kebab-case recette>"
publishedAt: <YYYY-MM-DD aujourd'hui>
editorialType: "Cookbook"
author: <slug auteur>
category: <slug category>
difficulty: <1|2|3>
timeEstimate: "<durée>"
tags:
  - <tag1>
  - <tag2>
  - <tag3>
readingTime: <minutes estimées>
relatedSolutions: []
relatedOffres: []
relatedCases: []
---
```

### 4. Structure du body MDX

```mdx
## Ce que cette recette vous donne

<Chunk citable GEO 40-60 mots — résultat exact de la recette une fois exécutée.
"En suivant cette recette, vous obtiendrez [résultat précis] en [délai]. Idéal pour
[audience] qui [contexte].">

---

## Ingrédients (ce qu'il vous faut avant de commencer)

**Outils nécessaires :**
- <Outil 1 : ex. CRM (HubSpot, Pipedrive, ou équivalent)> — [pourquoi cet outil]
- <Outil 2 : ex. Tableur partagé (Excel, Notion, Google Sheets)> — [pourquoi]
- <Outil 3 si applicable>

**Données à avoir sous la main :**
- <Donnée 1 : ex. Liste de vos prospects inactifs depuis > 30 jours>
- <Donnée 2 : ex. Template email de relance approuvé>
- <Donnée 3 si applicable>

**Droits et accès requis :**
- <Accès 1 : ex. Accès admin CRM>
- <Accès 2 si applicable>

**Temps estimé :** <timeEstimate>
**Difficulté :** <1 = facile | 2 = intermédiaire | 3 = avancé>

---

## La recette : étapes numérotées

### Étape 1 — <Nom de l'étape (verbe + objet)>

_Durée : <N> minutes_

<Description 80-120 mots. Instruction précise, comme si on guidait quelqu'un au téléphone.
Voix impérative : "Ouvrez...", "Filtrez...", "Copiez...". Pas de "il convient de" ni de
conditionnel. Ce qu'on fait, dans quel ordre, avec quel outil.>

**Checkpoint :** <Comment savoir que l'étape est réussie avant de passer à la suivante>

---

### Étape 2 — <Nom de l'étape>

_Durée : <N> minutes_

<Description 80-120 mots>

**Checkpoint :** <Critère de validation>

---

### Étape 3 — <Nom de l'étape>

_Durée : <N> minutes_

<Description 80-120 mots>

**Checkpoint :** <Critère de validation>

---

### Étape 4 — <Nom de l'étape>

_Durée : <N> minutes_

<Description 80-120 mots>

**Checkpoint :** <Critère de validation>

---

### Étape 5 — <Mesure et validation>

_Durée : <N> minutes_

<Description de comment vérifier que tout fonctionne + premier résultat attendu>

**Checkpoint :** <Critère de validation finale>

---

## Variantes selon votre configuration

### Si vous avez < 50 contacts à traiter

<Description 60-80 mots de l'ajustement pour petit volume>

### Si vous n'avez pas de CRM

<Description 60-80 mots de la version sans CRM (tableur, etc.)>

### Si vous voulez automatiser davantage

<Description 60-80 mots de la version avancée (automatisation, trigger, etc.)>

---

## Erreurs à éviter

1. **<Erreur 1 — formulée comme comportement à risque>**
   _Ce qui se passe si vous faites ça :_ <conséquence concrète>
   _Ce qu'il faut faire à la place :_ <correction>

2. **<Erreur 2>**
   _Ce qui se passe :_ <conséquence>
   _Correction :_ <action>

3. **<Erreur 3>**
   _Ce qui se passe :_ <conséquence>
   _Correction :_ <action>

4. **<Erreur 4>**
   _Ce qui se passe :_ <conséquence>
   _Correction :_ <action>

---

## Résultats attendus

### À 30 jours

<Ce que vous devriez observer après 30 jours d'application — chiffres calibrés sur benchmarks PME>

| Indicateur | Valeur attendue | Comment mesurer |
|-----------|----------------|----------------|
| <KPI 1> | <fourchette réaliste> | <où le voir> |
| <KPI 2> | <fourchette réaliste> | <où le voir> |
| <KPI 3> | <fourchette réaliste> | <où le voir> |

### À 90 jours

<Ce que vous devriez observer après 3 mois de pratique régulière>

**Signal d'alerte :** Si après 30 jours vous ne voyez pas <indicateur minimum>, vérifiez <cause probable>.

---

## FAQ rapide

### Combien de temps pour maîtriser cette recette ?
<Réponse directe 30-40 mots>

### Faut-il une formation préalable ?
<Réponse directe 30-40 mots>

### Cette recette marche-t-elle pour tous les secteurs ?
<Réponse directe 40-60 mots — préciser les secteurs PME B2B adaptés>

---

## Et maintenant ?

<Paragraphe CTA 60-100 mots. Invitation directe : ressource complémentaire liée (article,
guide pilier, autre cookbook), ou diagnostic Waimia si la recette révèle un besoin plus large.>
```

### 5. Validation pré-écriture

- **5 étapes minimum** avec durée estimée et checkpoint chacune.
- **3 variantes** selon configuration PME.
- **4 erreurs à éviter** avec conséquence + correction.
- **Tableau de résultats** à 30j et 90j.
- **Chunk citable GEO** 40-60 mots en introduction.
- Voix impérative dans les étapes (instructions directes).
- Word count cible respecté (+/-10%).
- Body évite les termes interdits.

### 6. Écriture du fichier

Écrit dans `src/content/cookbooks/<slug>.mdx` depuis la racine `apps/web`.
Si le fichier existe → demander confirmation avant overwrite.

## Lexique imposé

### Autorisé

câbler, qualifier, relancer, mesurer, filtrer, automatiser, pipeline, CRM, workflow, leads, h/sem récupérées, ROI mesuré, DG PME, responsable commercial, checkpoint, étape, recette, ingrédients.

### Interdit en surface

Claude (sauf nom), Anthropic, MCP, vLLM, LangGraph, AutoGen, multi-agent, dashboard isolé, Power BI, ETL, BI, Big Data, machine learning, jargon enterprise. "Il convient de", conditionnel passif. Adjectifs creux : innovant, révolutionnaire, performant.

## Garde-fous

- `recipe` doit être une tâche actionnable en PME B2B → pas un concept générique.
- Checkpoints obligatoires à chaque étape → sans eux, l'exécutant ne sait pas s'il peut avancer.
- Erreurs à éviter obligatoires (minimum 4) → c'est là que le cookbook se différencie d'un tutoriel.
- Résultats chiffrés réalistes → ne pas promettre 10x si le benchmark PME est 2x.
- Ne JAMAIS générer un MDX sans frontmatter complet.

## Format de livraison

```markdown
✅ Cookbook généré : src/content/cookbooks/<slug>.mdx
✅ Word count : <N> mots (cible <wordCountTarget>)
✅ Étapes : <N> (minimum 5)
✅ Variantes : <N>
✅ Erreurs à éviter : <N>
✅ Difficulté : <1|2|3>

Prochaines étapes (manuelles) :
1. Tester les étapes sur un vrai cas
2. Valider les checkpoints (sont-ils vérifiables ?)
3. Lancer `pnpm exec astro check` pour validation Zod
4. Commit + push
```

## Source originale

Skill créé from scratch — conventions Waimia exclusives.
Format "recette" inspiré du pattern cookbook Waimia existant (voir `apps/web/skills/`).
Structure checkpoints et erreurs à éviter spécifiquement conçus pour les automatisations
CRM/pipeline PME B2B françaises.
