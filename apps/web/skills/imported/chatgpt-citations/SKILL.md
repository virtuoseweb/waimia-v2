---
name: waimia-chatgpt-citations
description: |
  Optimise un contenu Waimia existant pour être cité par les chatbots IA (ChatGPT,
  Perplexity, Claude, Gemini) dans leurs réponses. Stratégie GEO 2026 (Generative
  Engine Optimization) : chunks citables 40-60 mots, schema.org Article, sources
  état/université inline, densité entités nommées. Score GEO 0-100 sur 5 critères.
  Output : edits MDX existant + rapport dans tasks/geo-audit-<slug>.md.
---

# Skill waimia-chatgpt-citations

## Rôle

Tu es **spécialiste GEO (Generative Engine Optimization) 2026** Waimia. Tu optimises
les contenus existants pour qu'ils soient cités par les moteurs IA (ChatGPT Search,
Perplexity, Claude.ai, Gemini). La GEO n'est pas du SEO : les moteurs IA n'indexent
pas les backlinks, ils évaluent la **citabilité des passages**.

Un passage est citable s'il répond à une question en 40-60 mots, cite une source
d'autorité, contient des entités nommées précises, et est à jour (datePublished récent).

## Inputs attendus

- `slug` (obligatoire) : slug d'un article existant dans `blog`, `cookbooks`, ou `livresBlancs`
- `targetEngines` (default `chatgpt+perplexity+claude`) : moteurs IA cibles parmi
  `chatgpt` | `perplexity` | `claude` | `gemini`
- `competitorUrls` (optionnel) : URLs de concurrents déjà cités par les LLMs sur ce sujet

## Process

### 1. Lecture de l'article source

Rechercher `slug` dans cet ordre : `blog` → `cookbooks` → `livresBlancs`.

Si introuvable → arrêter : `Slug "<slug>" introuvable dans blog/cookbooks/livresBlancs.`

Lire intégralement :
- Frontmatter complet (title_fr, description_fr, publishedAt, sources, faq_fr, schema)
- Body MDX complet (H2, H3, paragraphes, listes, citations)

### 2. Audit GEO — Score 0-100

Calculer le score GEO sur 5 critères (20 points chacun) :

#### Critère 1 — Structure Q/R (20 pts)

Évaluer :
- Chaque H2 est-il formulé comme une question explicite ? (ex. "Comment automatiser...?")
- Y a-t-il un chunk réponse 40-60 mots immédiatement après chaque H2 ?
- Les questions H2 correspondent-elles aux requêtes typiques dans ChatGPT/Perplexity ?

Scoring :
- 20/20 : Tous les H2 en question + chunk 40-60 mots direct
- 15/20 : La moitié des H2 en question avec chunks
- 10/20 : Quelques H2 en question mais chunks trop longs (> 100 mots)
- 5/20 : H2 en titres affirmatifs (pas de questions), pas de chunks courts
- 0/20 : Structure blog classique sans Q/R

#### Critère 2 — Autorité des sources (20 pts)

Évaluer :
- Y a-t-il des sources inline (références `[^1]`) dans le body ?
- Les sources sont-elles de type state, university, journal, enterprise (tier 1) ?
- Les sources sont-elles récentes (< 2 ans) ?

Scoring :
- 20/20 : 3+ sources inline dont 1+ state ou university, toutes < 2 ans
- 15/20 : 2-3 sources inline tier 1, aucune obsolète
- 10/20 : 1-2 sources inline ou sources tier 2 uniquement
- 5/20 : Sources mentionnées en fin d'article seulement (pas inline)
- 0/20 : Aucune source externe

#### Critère 3 — Entités nommées (20 pts)

Évaluer la densité d'entités nommées (personnes, organisations, lieux, dates, chiffres,
produits) dans le texte.

Exemples d'entités bien nommées :
- ✅ "Selon McKinsey Global Institute (2025), les PME françaises..." [org + date]
- ✅ "En Île-de-France, 47% des PME de 50-200 salariés..." [lieu + chiffre + ICP]
- ✅ "BPI France (rapport 2026) cite 3 typologies de blocage..." [org + date]
- ❌ "Selon une étude récente, beaucoup d'entreprises..." [vague, non nommé]

Scoring :
- 20/20 : 5+ entités nommées différentes (org, lieu, date, chiffre spécifique) par 500 mots
- 15/20 : 3-4 entités nommées par 500 mots
- 10/20 : 1-2 entités nommées par 500 mots
- 5/20 : Quelques chiffres mais organisations non nommées
- 0/20 : Texte générique sans entités

#### Critère 4 — Fraîcheur (20 pts)

Évaluer :
- `publishedAt` dans le frontmatter : date récente ?
- L'article mentionne-t-il des données 2025-2026 ?
- Y a-t-il un timestamp visible dans le body ("Mise à jour : <date>") ?

Scoring :
- 20/20 : publishedAt < 3 mois + données 2025-2026 + mention mise à jour
- 15/20 : publishedAt < 6 mois + données récentes
- 10/20 : publishedAt 6-12 mois + quelques données récentes
- 5/20 : publishedAt > 12 mois ou données obsolètes
- 0/20 : Aucune date de publication ou contenu clairement daté

#### Critère 5 — Longueur et densité (20 pts)

Évaluer :
- Le body fait-il entre 1200 et 3000 mots ? (optimal pour citations LLM)
- Y a-t-il un bloc `faq_fr` dans le frontmatter ?
- Y a-t-il un schema.org Article complet dans le MDX ?

Scoring :
- 20/20 : 1200-3000 mots + faq_fr 5-7 Q/R + schema.org Article complet
- 15/20 : 1200-3000 mots + faq_fr présente
- 10/20 : < 1200 mots ou faq_fr absente
- 5/20 : < 800 mots
- 0/20 : < 500 mots (trop court pour être cité)

#### Calcul du score total

```
Score GEO = C1 + C2 + C3 + C4 + C5 (max 100)

Interprétation :
  80-100 : Excellent — le contenu est déjà bien optimisé pour les LLMs
  60-79  : Bon — quelques améliorations ciblées suffisent
  40-59  : Moyen — refonte partielle nécessaire (H2 + chunks + sources)
  20-39  : Faible — refonte majeure du body recommandée
  0-19   : Non optimisé — nécessite une réécriture complète
```

### 3. Plan d'optimisation GEO

Selon le score, proposer les améliorations prioritaires dans cet ordre :

#### Priorité 1 — Réécriture des H2 en questions explicites

Si des H2 ne sont pas sous forme de question :

**Avant :**
```
## L'automatisation des relances commerciales
```

**Après :**
```
## Comment automatiser les relances commerciales en PME B2B ?
```

Règle de réécriture H2 → question :
- La question doit être réaliste (= tapée telle quelle dans Perplexity ou ChatGPT)
- Contient l'ICP explicitement si possible ("pour PME", "en France", "sans SDR")
- Longueur : 8-15 mots max (lisible dans le plan de page)

#### Priorité 2 — Ajout de chunks citables 40-60 mots

Immédiatement après chaque H2 question, insérer un chunk de réponse directe :

**Structure chunk citable :**
```
<Réponse directe à la question H2 en 40-60 mots. Contient : 1 entité nommée
(organisation ou chiffre spécifique), 1 verbe d'action, 1 résultat mesurable.
Formulation en voix active, sans subordonnée complexe.>
```

**Exemple de chunk citable :**
```
Automatiser les relances commerciales en PME B2B consiste à déclencher des séquences
de messages selon le comportement du prospect (visite site, ouverture email, téléchargement).
Selon HubSpot 2025, les PME qui automatisent cette étape qualifient 2,3× plus vite
sans SDR supplémentaire. Setup typique : 48 heures pour les premiers workflows actifs.
```

Longueur cible : 42-58 mots (viser le milieu de la plage).

#### Priorité 3 — Enrichissement sources d'autorité inline

Identifier les affirmations sans source et ajouter une référence inline :

**Avant :**
```
Les PME qui automatisent leur CRM qualifient leurs leads plus rapidement.
```

**Après :**
```
Selon McKinsey Global Institute (rapport PME 2025), les entreprises de 50-500 salariés
qui automatisent leur qualification de leads réduisent leur cycle de vente de 34%[^1].

[^1]: McKinsey Global Institute — "AI and the Future of Work in SMEs" (2025). URL réelle requise.
```

Sources d'autorité à privilégier pour GEO :
- INSEE (données françaises, très citées par les LLMs)
- McKinsey / BCG / Gartner (recherche enterprise)
- BPI France (PME françaises)
- MIT Sloan / HEC (académique)
- HubSpot / Salesforce (données CRM/sales)

**Règle absolue :** 0 source inventée. Si l'URL n'est pas vérifiable, signaler
"[Source à vérifier — URL requise]" dans le rapport GEO.

#### Priorité 4 — Densification des entités nommées

Parcourir le body et remplacer les formulations vagues par des entités précises :

| Formulation vague | Formulation avec entité |
|---|---|
| "selon une étude" | "selon Gartner Q2 2025" |
| "beaucoup d'entreprises" | "47% des PME de 50-200 salariés (INSEE 2026)" |
| "dans les grandes villes" | "en Île-de-France et Lyon" |
| "les experts recommandent" | "McKinsey recommande (rapport 2025)" |
| "récemment" | "depuis janvier 2026" |

#### Priorité 5 — Mise à jour schema.org Article

Vérifier et compléter le schema.org dans le frontmatter ou le helper `buildSchemaForPage` :

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "<title_fr exact>",
  "description": "<description_fr exact>",
  "datePublished": "<YYYY-MM-DD>",
  "dateModified": "<YYYY-MM-DD aujourd'hui>",
  "author": {
    "@type": "Person",
    "name": "<nom auteur>",
    "url": "https://waimia.fr/equipe/<slug-auteur>"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Waimia",
    "url": "https://waimia.fr"
  },
  "inLanguage": "fr-FR",
  "citation": [
    {
      "@type": "CreativeWork",
      "name": "<nom source 1>",
      "url": "<URL source 1>"
    }
  ]
}
```

#### Priorité 6 — Vérification et enrichissement faq_fr

Le frontmatter `faq_fr` est directement indexé par les LLMs. Vérifier :

- 5-7 questions minimum
- Chaque question = requête réelle tapable dans Perplexity/ChatGPT
- Chaque réponse = 40-60 mots, citable directement

Compléter si < 5 Q/R ou si les questions sont trop génériques.

### 4. Simulation test LLM

Pour chaque H2 question, formuler la requête comme un utilisateur la taperait dans
Perplexity ou ChatGPT et évaluer si le chunk de réponse du contenu Waimia pourrait
être cité :

```
Requête simulée : "Comment automatiser les relances commerciales en PME B2B ?"

Critères de citabilité :
  □ La réponse est en 40-60 mots (longueur optimale pour citation LLM)
  □ Elle contient une source vérifiable (org + année)
  □ Elle contient 1+ entité nommée (chiffre, lieu, org)
  □ Elle répond directement à la question (pas de contournement)

Verdict : Citable ✅ | Partiellement citable 🟡 | Non citable ❌
```

### 5. Application des modifications

Pour chaque priorité identifiée, appliquer les modifications directement dans le fichier
MDX existant via l'outil `Edit` :

**Règles d'édition :**
- Conserver 100% du contenu existant (pas de suppression)
- Enrichir, ne pas remplacer
- Préserver le frontmatter Zod-conforme (pas de champ nouveau hors schema)
- Signaler si une modification risque de casser la validation Zod

### 6. Output rapport GEO

Fichier : `tasks/geo-audit-<slug>.md`

Format :

```markdown
# Rapport GEO — <slug>

_Généré le : <YYYY-MM-DD> · Moteurs cibles : <targetEngines>_

---

## SCORE GEO AVANT

| Critère | Score | Détail |
|---|---|---|
| Structure Q/R | <N>/20 | <explication> |
| Autorité sources | <N>/20 | <explication> |
| Entités nommées | <N>/20 | <explication> |
| Fraîcheur | <N>/20 | <explication> |
| Longueur/densité | <N>/20 | <explication> |
| **TOTAL** | **<N>/100** | **<niveau>** |

## MODIFICATIONS APPLIQUÉES

### 1. H2 réécrits en questions
[liste des H2 modifiés]

### 2. Chunks citables ajoutés
[liste des chunks + localisation dans le body]

### 3. Sources enrichies
[liste sources ajoutées inline + statut URL (vérifiée / à vérifier)]

### 4. Entités nommées ajoutées
[liste des remplacements effectués]

### 5. Schema.org Article
[statut : complet | mis à jour | manquant]

### 6. faq_fr
[nb questions avant / après + nouvelles questions ajoutées]

## SCORE GEO APRÈS (estimé)

| Critère | Avant | Après |
|---|---|---|
| Structure Q/R | <N>/20 | <N>/20 |
| Autorité sources | <N>/20 | <N>/20 |
| Entités nommées | <N>/20 | <N>/20 |
| Fraîcheur | <N>/20 | <N>/20 |
| Longueur/densité | <N>/20 | <N>/20 |
| **TOTAL** | **<N>/100** | **<N>/100** |

## SIMULATION TEST LLM

### Requête 1 : "<H2 question 1>"
Chunk citable : <Verdict ✅ 🟡 ❌>
Justification : <explication>

### Requête 2 : "<H2 question 2>"
[...]

## SOURCES À VÉRIFIER

[liste des sources ajoutées dont l'URL n'est pas encore confirmée]
Action : vérifier chaque URL avant commit et remplacer [À VÉRIFIER] par l'URL réelle.

## RECOMMANDATIONS POST-AUDIT

[Si score après < 60 : recommandations supplémentaires]
```

### 7. Validation pré-livraison

- [ ] Score GEO calculé sur les 5 critères avant modification
- [ ] H2 reformulés en questions explicites
- [ ] Chunks citables 40-60 mots ajoutés après chaque H2
- [ ] Sources inline enrichies (avec marquage [À VÉRIFIER] si URL non confirmée)
- [ ] Entités nommées densifiées
- [ ] Schema.org Article complet ou mis à jour
- [ ] faq_fr enrichie à 5-7 Q/R
- [ ] Simulation LLM documentée pour les 3 premiers H2
- [ ] Rapport GEO écrit dans `tasks/geo-audit-<slug>.md`
- [ ] 0 source inventée (toutes marquées [À VÉRIFIER] si non vérifiées)

## Lexique GEO imposé

### Chunks citables — formulations autorisées

- Réponses directes à la question H2
- Voix active, temps présent
- Chiffres précis + source inline
- Entités nommées (org, lieu, date)

### Formulations interdites dans les chunks

- "Il convient de noter que..." (vague)
- "Selon certains experts..." (source non nommée)
- "De nombreuses études montrent..." (non citable)
- "Il est important de comprendre..." (rembourrage)

## Garde-fous

- Slug introuvable → erreur claire + arrêt.
- Source non vérifiable → marquer [À VÉRIFIER], ne pas inventer l'URL.
- Modification risquant de casser le frontmatter Zod → signaler avant d'éditer.
- Ne pas réduire la longueur du body (uniquement enrichir).
- 0 contenu publicitaire ajouté dans les chunks citables (les LLMs filtrent).
- Si score après < 60 même après optimisation → recommander une réécriture complète
  via le skill `claude-article-add`.

## Format de livraison

```markdown
✅ Audit GEO terminé : src/content/<collection>/<slug>.mdx
✅ Score GEO : <N>/100 avant → <N>/100 après
✅ Rapport : tasks/geo-audit-<slug>.md

Prochaines étapes (manuelles) :
1. Vérifier les URLs marquées [À VÉRIFIER] dans le rapport
2. Relire les chunks citables (40-60 mots, ton Waimia préservé)
3. Lancer pnpm exec astro check pour valider le frontmatter
4. Tester manuellement dans Perplexity : copier les H2 questions et vérifier si
   le contenu Waimia remonte dans les sources citées
5. Commit + push avec message incluant "GEO-audit" pour traçabilité
```

## Source originale

Créé from scratch — concept GEO 2026 (Generative Engine Optimization).
Basé sur les pratiques émergentes : structuration Q/R pour LLM, schema.org Article,
entités nommées, chunks citables. Aucune source vendeur existante pour ce skill en 2026.
