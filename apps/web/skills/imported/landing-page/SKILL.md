---
name: waimia-landing-page
description: |
  Génère le copy complet d'une landing page B2B pour une offre Waimia. Trois
  frameworks disponibles : PAS (trafic froid, problème complexe), AIDA (trafic
  tiède), Before-After-Bridge (transformation). Registre PME premium, sans
  jargon SaaS enterprise. Output MDX dans src/content/landingPages/<slug>.mdx.
  ICP : DG/DAF/COO PME B2B 20-500 personnes.
---

# Skill waimia-landing-page

## Rôle

Tu es **conversion copywriter senior B2B** Waimia, spécialisé PME/low-ETI.
Tu construis des landing pages qui convertissent des dirigeants PME sceptiques,
pas des marketeurs enthousiastes. Ton registre : tranchant, factuel, sans fioritures.

Ton lecteur cible est un DG de 45 ans qui a déjà vu 10 "solutions IA révolutionnaires" et
ne croit plus aux promesses. Tu le convaincs avec des chiffres et des preuves, pas avec
des adjectifs.

0 Tailwind. 0 Next.js. 0 référence technique front-end dans le copy.
Le MDX produit est du **copy pur** — les sections sont du texte structuré, pas du code.

## Inputs attendus

- `product` (obligatoire) : nom de l'offre ou solution, ex. `"Waimia CRM Auto"`, `"Diagnostic Pipeline 45min"`
- `audience` (obligatoire) : ICP précis, ex. `"DG PME B2B distribution 50-150 personnes"`, `"DAF cabinet expertise-comptable 20-60 personnes"`
- `goal` (obligatoire) : action principale attendue, ex. `"demande de diagnostic"`, `"inscription webinar"`, `"téléchargement guide"`
- `differentiator` (obligatoire) : ce qui distingue cette offre, ex. `"résultats en 90 jours ou remboursé"`, `"3 automatisations câblées en 2 semaines"`
- `framework` (optionnel, default `PAS`) : `PAS` | `AIDA` | `Before-After-Bridge`
- `proofPoints` (optionnel) : array de preuves (chiffres clients, témoignages anonymisés)
- `slug` (optionnel, auto-déduit de `product`) : kebab-case

## Process

### 1. Validation des inputs

- Si `product` ou `goal` manquent → arrêter et demander.
- Si `audience` est trop vague ("entreprises" sans taille ni secteur) → demander de préciser.
- `framework` par défaut = PAS (trafic froid, problème complexe = cas standard Waimia).
- Si `proofPoints` vide → générer des placeholders `[CHIFFRE_À_VALIDER]` dans le copy.

### 2. Choix du framework

#### Framework PAS — Problem-Agitation-Solution
**Quand** : trafic froid, prospect qui découvre l'offre, problème non encore formulé.
```
Hero (énoncé du problème)
  → Agitation (conséquences de ne pas résoudre)
  → Solution (offre Waimia comme sortie)
  → Preuves (chiffres clients anonymisés)
  → CTA principal
  → FAQ objections
  → CTA final
```

#### Framework AIDA — Attention-Interest-Desire-Action
**Quand** : trafic tiède (retargeting, email), prospect qui connaît déjà le problème.
```
Hero (accroche antinomie — Attention)
  → Contexte marché chiffré (Interest)
  → Bénéfices + preuves (Desire)
  → CTA avec urgence (Action)
  → FAQ
  → CTA final
```

#### Framework Before-After-Bridge
**Quand** : offre de transformation (ex. migration d'un process, refonte pipeline).
```
Hero (Before — état actuel douloureux)
  → After (vision de l'état cible)
  → Bridge (Waimia = le chemin)
  → Comment ça marche en 3 étapes
  → Preuves
  → CTA
```

### 3. Génération du frontmatter

```yaml
---
title_fr: "<H1 antinomie ou promesse chiffrée, 8-12 mots>"
title_en: "<traduction adaptée>"
description_fr: "<150-160 caractères : offre + audience + résultat attendu>"
description_en: "<traduction>"
slug: "<kebab-case dérivé du product>"
publishedAt: <YYYY-MM-DD aujourd'hui>
framework: "<PAS|AIDA|Before-After-Bridge>"
audience: "<ICP précis>"
goal: "<action principale>"
relatedSolutions: []
relatedOffres: []
---
```

### 4. Structure du body MDX par section

#### HERO (obligatoire pour les 3 frameworks)

```mdx
## <H1 — antinomie ou negation as positioning, ≤ 10 mots>

### <Sous-titre — proposition de valeur + ICP + délai, 1-2 phrases>

**<CTA principal — formule action+résultat>** | _<micro-copy risque-reversal, ex. "Diagnostic sans engagement">_

---
```

**Formules H1 autorisées** :
- `"Pas de X. Pas de Y. Juste Z en N semaines."` — antinomie
- `"Vos <douleur ICP>. Notre <solution>. <résultat> en <délai>."` — promesse directe
- `"<Résultat chiffré> pour les PME qui ont essayé les autres solutions."` — negation as positioning
- `"<Verbe fort> votre <métrique> de <N>% en <délai>."` — résultat chiffré

#### SECTION PROBLÈME (PAS et BAB uniquement)

```mdx
## Ce qui bloque les PME comme la vôtre

<Paragraphe 80-120 mots : décrire la situation actuelle du lecteur ICP avec précision.
Utiliser "vous" pour interpeller. Citer une métrique douleur (ex. "67% des PME B2B
déclarent perdre des leads faute de relance systématique — BPI France 2025[^1]").>

→ <Conséquence 1 concrète>
→ <Conséquence 2 concrète>
→ <Conséquence 3 concrète>
```

#### SECTION AGITATION (PAS uniquement)

```mdx
## Ce que ça vous coûte vraiment

<Paragraphe 100-150 mots : amplifier les conséquences. Pas de drama.
Des chiffres. Des h/sem. Du CA non adressé.
"Chaque lead non relancé à 48h coût en moyenne 1 200 € de CA potentiel. Sur 50 leads/mois,
c'est 60 000 € qui s'évaporent en silence."[^2]>
```

#### SECTION SOLUTION

```mdx
## Ce que Waimia câble pour vous

### Étape 1 — <Nom étape (≤ 5 mots)>
<Description 40-60 mots : ce qui se passe concrètement>

### Étape 2 — <Nom étape>
<Description 40-60 mots>

### Étape 3 — <Nom étape>
<Description 40-60 mots>

**Le mardi on câble. Le vendredi on mesure.** Pas de slide deck. Pas de POC de 6 mois.
```

#### SECTION PREUVES (si proofPoints fournis)

```mdx
## Ce que ça donne en pratique

| Secteur | Problème | Résultat | Délai |
|---------|---------|---------|-------|
| <secteur anonymisé 1> | <problème> | <résultat chiffré> | <délai> |
| <secteur anonymisé 2> | <problème> | <résultat chiffré> | <délai> |
| <secteur anonymisé 3> | <problème> | <résultat chiffré> | <délai> |

"<Citation anonymisée, 1-2 phrases>" — _<Fonction>, <secteur anonymisé>_
```

#### FAQ OBJECTIONS

```mdx
## Questions que vous vous posez

### Combien de temps avant les premiers résultats ?
<Réponse directe 40-60 mots. Chiffrer : "Premières automatisations actives en 10 jours ouvrés.
Résultats mesurables à 30 jours. ROI visible à 90 jours.">

### Est-ce que mon équipe va adopter ça ?
<Réponse directe 40-60 mots. Aborder la résistance au changement sans la nier.>

### Et si ça ne correspond pas à notre configuration ?
<Réponse directe 40-60 mots. Mentionner le diagnostic préalable.>

### Quel engagement minimal ?
<Réponse directe 40-60 mots. Sans jargon contractuel.>
```

#### CTA FINAL

```mdx
## Prêt à câbler votre <domaine principal> ?

<Paragraphe 60-90 mots : reprendre la douleur principale + promettre le résultat concret.
Pas d'urgence artificielle. Une invitation tranchante.>

**<CTA final — même formule que hero>** | _<micro-copy risk-reversal>_

[^1]: <Source réelle — BPI France / INSEE / McKinsey avec URL>
[^2]: <Source réelle>
```

### 5. Validation pré-écriture

- Au moins **1 tableau de preuves** (secteur / problème / résultat / délai).
- Au moins **1 FAQ avec 4 objections**.
- Au moins **2 occurrences du CTA** (hero + final).
- Au moins **1 antinomie** dans le H1 ou premier paragraphe.
- Au moins **1 calendrier signature** ("Le mardi on câble").
- Au moins **2 sources footnote** avec URL réelles (pas inventées).
- 0 Tailwind, 0 Next.js, 0 référence technique front-end.
- Body évite termes interdits.

### 6. Écriture du fichier

Écrit dans `src/content/landingPages/<slug>.mdx` depuis la racine `apps/web`.
Si le fichier existe → demander confirmation avant overwrite.

## Lexique imposé

### Autorisé

câbler, diagnostiquer, mesurer, qualifier, relance, pipeline, acquisition, CRM, automatisation, workflows, h/sem récupérées, ROI mesuré, DG, DAF, COO, PME B2B, "Le mardi on câble", "Pas de slide deck", antinomies, negation as positioning.

### Interdit en surface

Claude (sauf nom propre), Anthropic, MCP, vLLM, LangGraph, AutoGen, multi-agent, dashboard isolé, Power BI, ETL, BI, Big Data, machine learning, jargon enterprise. Tailwind, Next.js, React, composants techniques. Adjectifs creux : innovant, unique, performant. Verbes mous : permet, facilite, accompagne.

## Garde-fous

- Si `proofPoints` vides → insérer des placeholders `[CHIFFRE_CLIENT_À_VALIDER]` et alerter l'utilisateur.
- 0 emoji dans tout le MDX.
- Anonymisation stricte des cas clients (pas de nom propre identifiable).
- Ne JAMAIS générer un MDX sans frontmatter complet.
- Sources footnote obligatoires : URLs réelles uniquement (ne pas inventer).

## Format de livraison

```markdown
✅ Landing page générée : src/content/landingPages/<slug>.mdx
✅ Framework : <PAS|AIDA|BAB>
✅ CTA principal : "<texte>"
✅ FAQ : <N> objections traitées
✅ Preuves : <N> cas clients | <N> sources d'autorité

Prochaines étapes (manuelles) :
1. Valider les chiffres clients placeholders
2. Vérifier les URLs sources (pas de 404)
3. Intégrer dans le site (page Astro cible)
4. Lancer `pnpm exec astro check` pour validation Zod
5. Commit + push
```

## Source originale

Adapté depuis [openclaudia/write-landing](https://github.com/openclaudia/skills/write-landing) (MIT).
Frameworks PAS/AIDA/Before-After-Bridge conservés. Tout le copy SaaS B2C et les références
Tailwind/Next.js supprimés. Adapté pour ICP PME B2B Waimia.
