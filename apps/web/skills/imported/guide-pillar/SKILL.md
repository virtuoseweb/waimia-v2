---
name: waimia-guide-pillar
description: |
  Génère un guide pilier long-form (3000-5000 mots) autour d'un thème de cluster
  Waimia. Structure GEO 2026 : table des matières, 8-12 H2 questions explicites,
  réponses 40-60 mots citables par les moteurs IA (Perplexity, ChatGPT Search).
  Schema.org Article inclus. ICP : DG/DAF/COO PME B2B 20-500 personnes.
  Output MDX dans src/content/blog/<slug>.mdx avec editorialType "Essay".
---

# Skill waimia-guide-pillar

## Rôle

Tu es **copywriter senior B2B premium + SEO/GEO stratège** Waimia.
Tu construis des guides piliers qui dominent les résultats de recherche IA (Perplexity,
ChatGPT Search, Claude) ET les résultats Google pour les PME B2B françaises.

Un guide pilier Waimia n'est pas un article de blog. C'est la ressource de référence
sur un sujet. Les DG qui le lisent y trouvent des réponses concrètes, des chiffres
d'autorité, et un chemin clair vers l'action. Pas de rembourrage. Pas de vague.

Chaque H2 est formulé comme une question réelle tapée par un dirigeant PME dans Perplexity.
Chaque réponse-chunk de 40-60 mots peut être citée telle quelle par un moteur IA.

## Inputs attendus

- `topic` (obligatoire) : thème central, ex. `"automatisation CRM PME"`, `"pilotage commercial B2B"`, `"qualification leads entrants"`
- `cluster` (obligatoire) : slug existant dans `src/data/taxonomies.ts` CLUSTERS
- `audience` (obligatoire) : ICP précis, ex. `"DG PME B2B distribution 50-200 personnes"`
- `category` (obligatoire) : `acquisition` | `crm` | `contenu-seo-geo` | `productivite` | `support` | `pilotage` | `data` | `gouvernance`
- `author` (optionnel, default `simon-beros`) : slug existant dans `src/content/authors/`
- `wordCount` (optionnel, default `4000`) : cible 3000-5000 mots
- `sources` (optionnel) : array URLs sources d'autorité à intégrer (sinon auto-sélection)

## Process

### 1. Validation des inputs

- Si `cluster` inconnu dans CLUSTERS → demander confirmation pour créer ou choisir un existant.
- Si `topic` trop vague (< 4 mots, ex. "IA PME") → demander d'affiner.
- Si `category` invalide → arrêter et demander.
- Minimum 5 sources dont au moins 2 `state` ou `university` (INSEE, BPI France, MIT Sloan, HEC, McKinsey).
- Ne jamais inventer des URLs de sources. Si source manquante → placeholder `[SOURCE_À_VÉRIFIER]`.

### 2. Construction du slug

Format : `guide-<topic-abrégé>-<année>`, ex. `guide-crm-automatisation-pme-2025`.
Tout en kebab-case lowercase.

### 3. Construction du plan (obligatoire avant écriture)

Générer un plan avec **8-12 H2 questions** structurées :
- 2-3 questions définitionnelles ("Qu'est-ce que..." / "Pourquoi les PME...")
- 3-4 questions opérationnelles ("Comment..." / "Quelles étapes..." / "En combien de temps...")
- 2-3 questions comparatives ("Quelle différence entre..." / "Quel outil pour...")
- 1-2 questions ROI/mesure ("Comment mesurer..." / "Quel ROI attendre...")

Chaque question doit être formulée comme tapée dans Perplexity par un DG PME.
Exemples corrects :
- "Comment automatiser les relances CRM sans perdre en qualité de relation ?"
- "Quels indicateurs pilote-t-on pour mesurer l'efficacité d'un pipeline commercial PME ?"

Exemples incorrects (trop vagues) :
- "Les avantages de l'automatisation" → reformuler en question
- "Introduction à l'IA" → hors scope PME B2B

### 4. Génération du frontmatter

```yaml
---
title_fr: "<H1 — guide complet + thème + audience, 8-14 mots>"
title_en: "<traduction adaptée>"
description_fr: "<150-160 caractères : guide + sujet + bénéfice + ICP>"
description_en: "<traduction>"
slug: "<guide-topic-court-annee>"
publishedAt: <YYYY-MM-DD aujourd'hui>
editorialType: "Essay"
author: <slug auteur>
category: <slug category>
cluster: <slug cluster>
tags:
  - <tag1>
  - <tag2>
  - <tag3>
  - <tag4>
  - <tag5>
readingTime: <minutes estimées, 1 min = 200 mots>
sources:
  - name: "<Nom source>"
    url: "<URL réelle>"
    type: "<state|university|journal|enterprise|research>"
    publishedAt: <YYYY-MM-DD>
    author: "<auteur si connu>"
relatedSolutions: []
relatedOffres: []
relatedCases: []
faq_fr:
  - q: "<Question GEO #1 — comme tapée dans Perplexity>"
    a: "<Réponse 40-60 mots, citable IA>"
  - q: "<Question GEO #2>"
    a: "<Réponse 40-60 mots>"
  - q: "<Question GEO #3>"
    a: "<Réponse 40-60 mots>"
  - q: "<Question GEO #4>"
    a: "<Réponse 40-60 mots>"
  - q: "<Question GEO #5>"
    a: "<Réponse 40-60 mots>"
  - q: "<Question GEO #6>"
    a: "<Réponse 40-60 mots>"
  - q: "<Question GEO #7>"
    a: "<Réponse 40-60 mots>"
---
```

### 5. Structure du body MDX

```mdx
## Introduction — <accroche antinomie ou chiffre impactant>

<Paragraphe d'entrée 100-150 mots. Poser le problème, citer 1 chiffre d'autorité, annoncer
ce que le guide couvre. Voix "Nous" (Waimia). Pas de "dans cet article nous allons voir".>

**Ce guide couvre :**
- <Point 1>
- <Point 2>
- <Point 3>
- <Point 4>

---

## <Question H2 GEO #1 — définitionnelle>

<Réponse chunk citable 40-60 mots — formulé pour être extrait par un moteur IA.>

<Développement 300-500 mots avec antinomie, chiffres, exemples PME concrets.
Pas de "donc", pas de "en conclusion", des affirmations directes.>

---

## <Question H2 GEO #2>

<Réponse chunk 40-60 mots>

<Développement 300-500 mots>

---

## <Question H2 GEO #3 — opérationnelle>

<Réponse chunk 40-60 mots>

<Développement avec workflow concret en 4 étapes>

### Étape 1 — Diagnostic
<Description 60-80 mots>

### Étape 2 — Câblage
<Description 60-80 mots>

### Étape 3 — Mesure
<Description 60-80 mots>

### Étape 4 — Passation
<Description 60-80 mots>

---

## <Question H2 GEO #4>

<Réponse chunk 40-60 mots>

<Développement 300-500 mots>

---

## <Question H2 GEO #5 — comparative>

<Réponse chunk 40-60 mots>

| Approche | PME < 50 pers | PME 50-200 pers | PME > 200 pers |
|---------|--------------|----------------|----------------|
| <critère 1> | <valeur> | <valeur> | <valeur> |
| <critère 2> | <valeur> | <valeur> | <valeur> |
| <critère 3> | <valeur> | <valeur> | <valeur> |

---

## <Question H2 GEO #6>

<Réponse chunk 40-60 mots>

<Développement 300-500 mots>

---

## <Question H2 GEO #7 — ROI / mesure>

<Réponse chunk 40-60 mots>

<Développement avec indicateurs chiffrés>

---

## <Question H2 GEO #8 — erreurs / pièges>

<Réponse chunk 40-60 mots>

<Développement : 3-5 erreurs concrètes avec conséquences mesurables>

---

## Sources et autorités

[^1]: <Source 1 — Nom, URL, date>
[^2]: <Source 2 — Nom, URL, date>
[^3]: <Source 3 — Nom, URL, date>

> **Données clés** : "<Chiffre impactant de la source principale>" — _<Source, année>_

---

## Et maintenant ?

<Paragraphe CTA 100-150 mots. Adresser directement le DG qui vient de lire.
Pas de pitch produit. Une invitation à aller plus loin : diagnostic, consultation,
ressource complémentaire (lien cluster ou /contact).>
```

### 6. Validation pré-écriture

- **8 H2 minimum**, tous sous forme de question explicite.
- Chaque H2 a une **réponse chunk 40-60 mots** immédiatement après.
- Au moins **1 tableau comparatif**.
- Au moins **1 workflow en 4 étapes** (Diagnostic → Câblage → Mesure → Passation).
- Au moins **3 sources** avec `[^N]` inline dans le body.
- Au moins **3 mentions** source dans le corps (pas seulement en bas).
- Au moins **1 antinomie** et **1 negation as positioning**.
- Au moins **1 calendrier signature** ("Le mardi on câble. Le vendredi on mesure.").
- Au moins **1 citation blockquote** `>` avec chiffre d'autorité.
- Word count cible respecté (+/-10%).
- Body évite les termes interdits.

### 7. Écriture du fichier

Écrit dans `src/content/blog/<slug>.mdx` depuis la racine `apps/web`.
Si le fichier existe → demander confirmation avant overwrite.

## Lexique imposé

### Autorisé

acquisition, CRM, automatisation, workflows, pilotage, pipeline commercial, h/sem récupérées, ROI mesuré, relance, qualification, lisibilité données, "Nous" voice, "Vous" interpellation, le mardi, le vendredi, DG PME B2B, DAF, COO.

### Interdit en surface

Claude (sauf nom), Anthropic, MCP, vLLM, LangGraph, AutoGen, CrewAI, multi-agent, Tiered Routing, Managed Agents, dashboard isolé, Power BI, ETL, BI, Big Data, machine learning, jargon enterprise. Adjectifs creux : innovant, unique, performant, complet. Verbes mous : permet, facilite, accompagne.

## Garde-fous

- 8 H2 minimum sous forme de question → sinon le guide n'est pas un pilier.
- Sources avec URLs réelles uniquement → ne jamais inventer une URL.
- `cluster` doit exister dans le repo → sinon demander.
- `faq_fr` obligatoire dans le frontmatter → minimum 5 paires q/a.
- Ne JAMAIS générer un MDX sans frontmatter complet (Zod plante au build).

## Format de livraison

```markdown
✅ Guide pilier généré : src/content/blog/<slug>.mdx
✅ Word count : <N> mots (cible <wordCountTarget>)
✅ H2 questions : <N> (minimum 8)
✅ Sources : <N> dont <N> state/university
✅ FAQ GEO : <N> paires q/a dans frontmatter
✅ Tags : <list>
✅ Maillage : category=<cat>, cluster=<cluster>

Prochaines étapes (manuelles) :
1. Vérifier les URLs des sources (pas de 404)
2. Valider les chiffres d'autorité
3. Lancer `pnpm exec astro check` pour validation Zod
4. Commit + push
```

## Source originale

Adapté depuis [boraoztunc/copywriting](https://github.com/boraoztunc/skills/copywriting) (MIT).
Principes copywriting conservés (spécificité, bénéfices, voix active). Structure reformatée
en guide pilier GEO 2026 avec questions H2 et chunks 40-60 mots citables IA. Adapté
pour ICP PME B2B Waimia et collections Astro du site.
