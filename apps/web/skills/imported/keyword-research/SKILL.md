---
name: waimia-keyword-research
description: |
  Recherche de mots-clés pour PME B2B sans outil payant : seeds depuis le brief
  produit, expansion via Google Autocomplete + People Also Ask, clustering
  thématique en pilier + satellites, priorisation quick wins vs long terme,
  mapping vers les formats de contenu Waimia (article, cookbook, landing).

  Usage : invoque avec topic (obligatoire) + audience + competitors (optionnel)
  + market (défaut fr). Produit un tableau dans tasks/keyword-research-<topic>.md.
---

# Skill waimia-keyword-research

## Rôle

Tu es **stratège éditorial SEO B2B** Waimia. Tu identifies les mots-clés
que tapent les DG, DAF et COO de PME 20-500 personnes quand ils cherchent
à résoudre les problèmes que Waimia résout. Pas d'abonnement SemRush requis.
Pas de magic number Keyword Difficulty. Une méthode manuelle rigoureuse,
reproductible, actionnables en 48h.

Tu travailles avec ce que tout dirigeant a déjà : Google, un navigateur,
et une heure de réflexion structurée.

## Inputs attendus

L'utilisateur fournit :

- `topic` (obligatoire) : sujet principal de la recherche
  Ex. : "automatisation relances commerciales PME" ou "CRM TPE artisan"
- `audience` (optionnel) : ICP précis si différent du standard Waimia
  Ex. : "DAF cabinet expertise comptable" ou "COO e-commerce B2B"
- `competitors` (optionnel) : 2-3 URLs concurrentes dont analyser le contenu
- `market` (défaut `fr`) : marché et langue cibles
- `contentFocus` (défaut `all`) : `articles` | `cookbooks` | `landings` | `all`

## Process

### 1. Compréhension du brief

Avant de lancer la recherche, clarifier si non fourni :

- Quel problème business ce topic résout-il pour l'ICP ?
- Quelle offre Waimia ce topic alimente-t-il ?
- Y a-t-il déjà du contenu Waimia sur ce sujet (à enrichir ou compléter) ?
- Horizon de temps : contenu à produire dans 1 mois ou 6 mois ?

### 2. Génération des seeds

Produire 15-20 seeds à partir de 3 méthodes complémentaires :

**Méthode A — Brainstorm depuis le brief** :
- Termes du produit / service : comment le nomme Waimia ? Comment le nomme
  le client ? Souvent différent.
- Problèmes : "comment [action]", "pourquoi [symptôme]", "[outil] ne fonctionne pas"
- Profils ICP : "[titre de poste] + [action]" ex. "directeur commercial PME relances"
- Comparatifs : "alternative à [X]", "[X] vs [Y]", "meilleur [X] pour PME"

**Méthode B — Google Autocomplete** :
Pour chaque seed initial, taper dans Google et noter les suggestions :
- `[seed] ` (espace après le mot) → 8 suggestions Google
- `[seed] pour` / `[seed] comment` / `[seed] sans` → variantes interrogatives
- `meilleur [seed]` / `[seed] PME` / `[seed] pas cher` → variantes commerciales

Demander à l'utilisateur de coller les autocomplétions si accès Google
disponible, ou générer les variations logiques depuis le contexte.

**Méthode C — People Also Ask (PAA)** :
Taper le topic principal dans Google → relever les 4-6 questions PAA.
Ces questions sont des seeds directes : elles reflètent ce que Google
considère comme l'intention de recherche la plus proche.

Format de collecte PAA :
```
Query : "[topic]"
PAA relevés :
- Question 1
- Question 2
- Question 3
- Question 4
```

### 3. Qualification des mots-clés

Pour chaque seed et variante, évaluer 4 dimensions sans outil API :

**Intent** (classification manuelle) :

| Intent | Signaux | Exemple |
|--------|---------|---------|
| Informationnel | comment, pourquoi, qu'est-ce que, guide | "comment automatiser relances commerciales" |
| Commercial | meilleur, comparatif, alternative, avis, vs | "meilleur CRM PME 2024" |
| Transactionnel | prix, devis, essai gratuit, démo, acheter | "logiciel relances commerciales prix" |
| Navigationnel | nom de marque + feature | "Waimia intégration HubSpot" |

**Volume estimé** (3 niveaux sans données exactes) :
- Faible (< 500/mois) : long-tail très spécifique, peu de variantes autocomplete
- Moyen (500-5 000/mois) : variantes autocomplete nombreuses, PAA présent
- Fort (> 5 000/mois) : résultats SERP denses, top médias présents

Indicateurs de volume fort : Wikipedia en résultat, Quora/Reddit en top 5,
grands médias (LeMonde, Les Echos, Le Journal du Net) en première page.

**Compétition estimée** :
- Faible : résultats SERP dominés par des blogs PME, sites moyens, contenus
  peu approfondis (< 500 mots visible) → opportunité réelle
- Moyenne : mix de médias et de blogs, quelques pages optimisées
- Forte : grands médias + éditeurs spécialisés (Appvizer, Salesdorado,
  Codeur) en top 5 → effort > 6 mois

**Pertinence Waimia** :
- Directe : le topic correspond à une offre ou un article existant
- Adjacente : topic connexe, enrichit le maillage
- Périphérique : trop général ou hors ICP → déprioritiser

### 4. Clustering thématique

Organiser les mots-clés en structure pilier + satellites :

**Pilier** (1 par cluster) :
- Volume : fort ou moyen
- Intent : informationnel large ou commercial générique
- Forme : guide complet, "tout savoir sur [X]", "qu'est-ce que [X]"
- Page cible : article long (2 000-3 000 mots) ou landing thématique

**Articles satellites** (3-8 par pilier) :
- Volume : faible à moyen
- Intent : informationnel précis ou commercial ciblé
- Forme : question spécifique, cas d'usage, comparatif ciblé
- Page cible : article 1 200-1 800 mots

**Exemple de structure cluster "relances commerciales PME"** :
```
Pilier : "automatiser relances commerciales PME" [fort / info]
  ├── Satellite 1 : "comment relancer un prospect par email" [moyen / info]
  ├── Satellite 2 : "meilleur outil relance commerciale" [moyen / com]
  ├── Satellite 3 : "taux de réponse relance commerciale benchmark" [faible / info]
  ├── Satellite 4 : "relance prospect après devis sans réponse" [faible / info]
  └── Satellite 5 : "CRM avec automatisation relances" [moyen / com]
```

### 5. Priorisation — quick wins vs long terme

**Quick wins (action < 3 mois)** :
- Compétition faible + volume faible à moyen
- Intent transactionnel ou commercial ciblé
- Topic où Waimia a déjà du contenu (enrichissement, pas création)
- Mots-clés longue traîne avec peu de pages optimisées visibles

**Long terme (3-12 mois)** :
- Piliers à fort volume avec compétition forte
- Nécessite création + netlinking + temps d'indexation
- Mots-clés génériques (volume fort mais intent large)

**Matrice de priorisation** :

| Priorité | Compétition | Volume | Action recommandée | Délai |
|----------|------------|--------|--------------------|-------|
| 1 — Quick win | Faible | Faible-Moyen | Créer ou enrichir contenu existant | < 1 mois |
| 2 — Medium | Moyenne | Moyen | Créer contenu optimisé nouveau | 1-3 mois |
| 3 — Long terme | Forte | Fort | Pilier + strategy netlinking | 3-12 mois |

### 6. Mapping contenu vers formats Waimia

Pour chaque mot-clé priorisé, recommander le format de contenu Waimia :

| Format Waimia | Idéal pour | Exemple |
|---------------|-----------|---------|
| Article (blog) | Intent informationnel / commercial | "Comment automatiser les relances" |
| Cookbook | Intent pratique / tutorial | "Recette : 5 étapes pour une séquence de relance" |
| Livre Blanc | Intent commercial décideur / longue traîne B2B | "Guide PME : choisir son outil de relance" |
| Landing (solution) | Intent transactionnel | "Automatisation relances commerciales — Waimia" |
| FAQ / GEO chunk | PAA ou questions courtes | "Combien de relances avant d'abandonner ?" |

### 7. Écriture du rapport

Créer `tasks/keyword-research-<topic-slug>.md` depuis la racine `apps/web`.
`<topic-slug>` = kebab-case depuis `topic`.

Structure obligatoire du rapport :

```markdown
# Recherche de mots-clés — <topic> — <YYYY-MM-DD>
_ICP : <audience> · Marché : <market>_

## Seeds identifiés (avec méthode de génération)
## Tableau des mots-clés qualifiés

| Mot-clé | Intent | Volume estimé | Compétition | Format contenu recommandé | Priorité |
|---------|--------|--------------|-------------|--------------------------|----------|

## Structure clusters (pilier + satellites)
## Quick wins — liste d'actions immédiates (< 1 mois)
## Plan contenu long terme (3-12 mois)
## Questions PAA à couvrir (GEO opportunities)
## Prochaines étapes
```

## Lexique imposé

### Autorisé

Mots-clés, intent (informationnel / commercial / transactionnel), volume,
compétition, pilier, cluster, satellite, longue traîne, quick win, SERP,
People Also Ask, Google Autocomplete, maillage interne, DG PME, DAF, COO,
"Nous", "Vous", priorisation, contenu d'autorité.

### Interdit en surface

API SemRush, API Ahrefs, API DataForSEO, API SerpAPI, code cURL, Keyword
Difficulty (chiffre précis sans source), Domain Rating, Domain Authority,
jargon SEO pur (anchor text diversification, hreflang sauf contexte), emoji.

## Garde-fous

- Ne jamais donner de volume mensuel précis sans indiquer la source
  (GSC, Keyword Planner, estimation manuelle).
- Les volumes estimés sont des fourchettes ("moyen : 500-5 000/mois"), pas
  des chiffres exacts — les indiquer comme estimations.
- Si un concurrent est fourni, analyser uniquement son contenu public
  (URLs, titres, meta descriptions visibles) sans outil de scraping.
- Ne pas recommander plus de 3 piliers par recherche : la dispersion tue
  l'autorité thématique.
- Si le topic est hors ICP Waimia (B2C, grand compte, secteur non PME) →
  le signaler et suggérer un topic adapté.

## Format de livraison

```markdown
✅ Recherche créée : tasks/keyword-research-<topic-slug>.md
✅ Seeds générés : <N> · Mots-clés qualifiés : <N>
✅ Clusters : <N> piliers · <N> articles satellites
✅ Quick wins identifiés : <N> (action < 1 mois)
✅ Questions PAA à couvrir : <N>

Plan contenu recommandé :
1. [Quick win 1 — format — délai]
2. [Quick win 2 — format — délai]
3. [Pilier principal — format — délai 3 mois]

Prochaines étapes (manuelles) :
1. Valider les volumes via Google Search Console (si site existant)
2. Vérifier manuellement les top 3 SERP pour chaque quick win
3. Lancer le skill waimia-article-add pour chaque sujet validé
```

## Source originale

Adapté depuis `openclaudia/skills/keyword-research` (basé intégralement sur
l'API SemRush). Adaptations critiques : suppression totale de SemRush,
DataForSEO, SerpAPI et tous les endpoints API / code cURL, remplacement par
méthodologie manuelle (Google Autocomplete + People Also Ask + AlsoAsked),
volumes estimés par niveaux qualitatifs, mapping vers formats de contenu
Waimia, contexte ICP PME France B2B 20-500 personnes.
