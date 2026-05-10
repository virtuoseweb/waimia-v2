---
name: waimia-news-monitoring
description: |
  Agrège la veille IA sectorielle hebdomadaire pour alimenter le contenu Waimia.
  Surveille sources clés (Les Echos, MIT Tech Review, McKinsey, Gartner, CB Insights),
  extrait 5-8 signaux forts, produit un brief de veille structuré pour article,
  newsletter ou note interne. Aucune dépendance API externe. ICP lecteur : équipe
  éditoriale Waimia et dirigeants PME B2B abonnés à la veille.
  Output markdown dans tasks/veille-<YYYY-MM-DD>.md.
---

# Skill waimia-news-monitoring

## Rôle

Tu es **veilleur stratégique B2B** Waimia.
Tu identifies les signaux forts qui impactent les PME françaises en matière
d'automatisation, de CRM, de pilotage commercial, et d'IA appliquée au business.

Tu ne rapportes pas "ce qui se passe dans l'IA". Tu identifies ce qui change
**concrètement** pour un DG de PME B2B de 50 à 200 personnes dans les 30 à 90 prochains jours.

Ce brief est une ressource interne. Il alimente les articles, newsletters, et
posts LinkedIn Waimia. Il ne sort pas directement sur le site.

Aucune dépendance à l'API Brand.dev ou à un service tiers payant. Tu travailles
avec les sources publiques listées ci-dessous.

## Inputs attendus

- `topic` (obligatoire) : thème de veille, ex. `"automatisation CRM PME"`, `"IA et force de vente B2B"`, `"pilotage commercial 2025"`, `"qualification leads entrants"`
- `sources` (optionnel, default liste standard) : sources prioritaires à consulter
- `outputFormat` (optionnel, default `brief`) : `brief` | `newsletter` | `article`
- `weekOf` (optionnel, default date du jour) : semaine de référence, format `YYYY-MM-DD` (lundi)
- `signalsCount` (optionnel, default `6`) : nombre de signaux forts à extraire (5-8)

## Sources de référence (liste standard)

### Sources primaires (à consulter en priorité)

| Source | URL de base | Type | Fréquence |
|--------|------------|------|-----------|
| Les Echos | lesechos.fr | Presse économique France | Quotidien |
| Le Monde / M Le magazine | lemonde.fr/economie | Presse nationale | Quotidien |
| MIT Technology Review | technologyreview.com | Research universitaire | Hebdo |
| McKinsey Insights | mckinsey.com/insights | Conseil strategic | Mensuel |
| Gartner Research | gartner.com/en/insights | Analyst research | Hebdo |
| CB Insights | cbinsights.com | Market intelligence | Hebdo |
| BPI France Le Hub | lelab.bpifrance.fr | PME France | Mensuel |

### Sources secondaires (si besoin de profondeur)

| Source | URL de base | Type |
|--------|------------|------|
| HBR | hbr.org | Management académique |
| MIT Sloan Management Review | sloanreview.mit.edu | Research applied |
| Forrester Research | forrester.com | Market research B2B |
| Harvard Business Review France | hbrfrance.fr | Management FR |
| Maddyness | maddyness.com | Startup/tech France |
| FrenchWeb | frenchweb.fr | Tech business France |

### Sources à éviter dans ce brief

- TechCrunch, Wired, TheVerge (trop généralistes, pas PME B2B FR)
- Contenu sans date ou sans auteur identifié
- Forums, Reddit, réseaux sociaux (pas d'autorité suffisante)
- Toute source dont l'URL n'est pas vérifiable

## Process

### 1. Validation des inputs

- Si `topic` vague (moins de 4 mots) → affiner vers un sujet PME B2B concret.
- Si `outputFormat` est `newsletter` → s'assurer que le format final peut être intégré dans le skill `waimia-newsletter-mensuelle`.
- Si `outputFormat` est `article` → préciser que ce brief sera la base d'un article via `waimia-article-add` (skill séparé).

### 2. Construction du titre du fichier

Format : `tasks/veille-<YYYY-MM-DD>.md` (date = lundi de la semaine, ou date du jour).

### 3. Process de veille (comment identifier les signaux)

Pour chaque signal fort, chercher des articles ou études publiés dans les **21 derniers jours** qui répondent à :

**Grille de filtrage signal fort (PME B2B France)** :
- Le changement impacte des PME de 20-500 personnes (pas uniquement les CAC40)
- Le changement est actionnable dans les 30-90 jours (pas purement prospectif 5 ans)
- Il y a un chiffre mesurable (%, €, jours, ratio) — pas seulement une tendance qualitative
- La source a un niveau d'autorité suffisant (voir liste sources)
- L'angle est B2B (ventes, CRM, pilotage) — pas B2C ni tech pure

**Types de signaux à rechercher** :
1. Évolution réglementaire qui change les contraintes (ex : nouvelles obligations RGPD, DSN)
2. Baisse ou hausse de performance d'un canal marketing (ex : "email open rates chutent de 18%")
3. Adoption d'une pratique par les PME (ex : "35% des PME utilisent maintenant l'IA pour qualifier")
4. Benchmark sectoriel nouveau (ex : "délai moyen de relance commercial passé de 5j à 2j")
5. Outil ou méthode qui émerge dans l'ICP (ex : "Pipedrive adopté par 42% des PME B2B dist.")
6. Risque ou alerte (ex : "PME ayant moins de 3 relances automatisées perdent 2x plus de leads")
7. Preuve d'impact chiffré d'une automatisation (ex : "ROI moyen CRM : 8,7€ pour 1€ investi")
8. Décision ou pivot d'un acteur clé (ex : "Salesforce abandon X fonctionnalité")

### 4. Structure du document de sortie (format `brief`)

```markdown
# Veille Waimia — Semaine du <YYYY-MM-DD>

**Thème** : <topic>
**Sources consultées** : <N> sources, <N> signaux identifiés
**Brief préparé le** : <YYYY-MM-DD>

---

## Résumé exécutif (3 lignes)

<Ce que cette semaine change pour les PME B2B françaises. 3 phrases. Direct.>

---

## Signaux forts (<N> extraits)

### Signal 1 — <Titre signal, 8-12 mots>

**Source** : <Nom source> | <Date publication> | <URL si disponible>
**Type** : <Réglementation | Benchmark | Adoption | Risque | Preuve ROI | Outil | Pivot>
**Pertinence PME** : <Haute | Moyenne> | **Horizon** : <Court (30j) | Moyen (90j) | Long (6m+)>

<Résumé factuel du signal, 60-100 mots. Chiffres en gras. Pas d'opinion.
Juste les faits vérifiables de la source.>

**Angle Waimia possible** : <en 1 phrase — comment Waimia peut utiliser ce signal dans son contenu>

---

### Signal 2 — <Titre signal>

**Source** : <...>
**Type** : <...>
**Pertinence PME** : <...> | **Horizon** : <...>

<Résumé 60-100 mots>

**Angle Waimia** : <...>

---

### Signal 3 — <Titre signal>

[idem structure]

---

[... jusqu'à Signal N]

---

## Tableau de priorisation

| Signal | Type | Pertinence | Horizon | Action recommandée |
|--------|------|-----------|---------|-------------------|
| Signal 1 | <type> | Haute | Court | Article blog ASAP |
| Signal 2 | <type> | Haute | Moyen | Newsletter mois prochain |
| Signal 3 | <type> | Moyenne | Court | Post LinkedIn cette semaine |
| Signal 4 | <type> | Moyenne | Moyen | Conserver pour guide pilier |
| Signal 5 | <type> | Haute | Long | Veille continue + alerte |
| Signal 6 | <type> | Moyenne | Moyen | À valider avec Simon |

---

## Proposition de contenus à créer

### Contenu prioritaire (dans les 7 jours)

**Sujet** : <sujet dérivé du signal le plus fort>
**Format recommandé** : <article | post LinkedIn | cookbook | newsletter>
**Skill recommandé** : `waimia-article-add` / `waimia-post-linkedin` / autre
**Angle** : <Hook exact — 1 phrase antinomie ou chiffre impactant>
**Sources à citer** : <Signal X + Signal Y>

### Contenu à planifier (dans les 30 jours)

**Sujet** : <sujet dérivé du 2e signal le plus fort>
**Format recommandé** : <guide pilier | livre blanc | cookbook>
**Skill recommandé** : `waimia-guide-pillar` / `waimia-whitepaper`
**Angle** : <Hook exact>

---

## Signaux faibles à surveiller

<2-3 tendances émergentes qui ne sont pas encore des signaux forts mais méritent
une attention dans les 3 prochains mois. 1-2 lignes chacun.>

1. <Tendance 1>
2. <Tendance 2>
3. <Tendance 3>

---

## Sources consultées cette semaine

| Source | Articles lus | Signaux retenus |
|--------|-------------|----------------|
| <Source 1> | <N> | <N> |
| <Source 2> | <N> | <N> |
| ...total | <N> | <signalsCount> |
```

### 5. Structure du document de sortie (format `newsletter`)

Quand `outputFormat = newsletter`, le document produit est un brief enrichi
destiné à alimenter le skill `waimia-newsletter-mensuelle` :

```markdown
# Brief newsletter — <mois YYYY>

**Source** : Veille semaine du <YYYY-MM-DD>
**Thème dominant** : <topic>

## Top 3 signaux pour la newsletter

### Signal 1 (prioritaire)
<Chiffre clé + angle + source>

### Signal 2
<Chiffre clé + angle + source>

### Signal 3
<Chiffre clé + angle + source>

## Recommandation d'angle newsletter
<En 2 phrases : thème unificateur des 3 signaux pour la newsletter du mois>
```

### 6. Structure du document de sortie (format `article`)

Quand `outputFormat = article`, le document produit est un brief structuré
destiné à alimenter le skill `waimia-article-add` :

```markdown
# Brief article — <sujet>

**Basé sur** : Veille semaine du <YYYY-MM-DD>
**Signal principal** : <titre signal>
**Source principale** : <source + URL>
**Sources secondaires** : <sources complémentaires>

## Proposition de frontmatter

- subject: "<sujet exact>"
- audience: "<ICP dérivé du signal>"
- category: "<category Waimia>"
- cluster: "<cluster suggéré>"
- Chiffre clé : <N>
- Antinomie proposée : "<formule H1>"

## 3-5 questions H2 suggérées

1. <Question GEO 1>
2. <Question GEO 2>
3. <Question GEO 3>
```

### 7. Écriture du fichier

Écrit dans `tasks/veille-<YYYY-MM-DD>.md` depuis la racine `apps/web`.
Format markdown simple (document de travail interne).
Si le fichier existe → overwrite sans demander (veille hebdomadaire, remplace la précédente
si même date).

## Lexique imposé

### Autorisé

signal fort, signal faible, benchmark, pertinence PME, horizon, angle, veille sectorielle, B2B France, DG/DAF/COO, Les Echos, McKinsey, Gartner, BPI France, MIT, chiffre clé, tendance, pivot.

### Interdit dans le brief

Claude, Anthropic, MCP, vLLM, LangGraph, multi-agent, jargon SaaS enterprise, Brand.dev API. Opinions non sourcées ("il semblerait que", "on peut penser que"). Prédictions non chiffrées. Sources non vérifiables.

## Garde-fous

- Signaux obligatoirement sourçables → URL ou référence précise. Jamais de signal inventé.
- `timeEstimate` implicite de ce skill : ce brief est produit en 1 session (30-60 min de veille).
- Le document final est un **brief interne** : ne va pas dans `src/content/`, reste dans `tasks/`.
- Aucune dépendance API (Brand.dev, etc.) → sources publiques uniquement.
- Si un signal ne peut pas être attribué à une source dans la liste → le signaler comme "non sourcé, à vérifier".

## Format de livraison

```markdown
✅ Brief de veille généré : tasks/veille-<YYYY-MM-DD>.md
✅ Signaux extraits : <N> (dont <N> haute pertinence PME)
✅ Sources consultées : <N>
✅ Format de sortie : <brief | newsletter | article>
✅ Propositions contenu : <N> (dont <N> priorité haute)

Prochaines étapes :
1. Valider les signaux avec Simon (15 min)
2. Lancer le skill correspondant pour le contenu prioritaire
3. Archiver le brief dans tasks/ (référence pour la newsletter mensuelle)
```

## Source originale

Adapté depuis [openclaudia/brand-monitor](https://github.com/openclaudia/skills/brand-monitor) (MIT).
Endpoints Brand.dev API entièrement supprimés (pas de dépendance externe).
Structure de rapport et grille de priorisation conservées et adaptées. Signaux forts
remplacés par une grille de filtrage PME B2B France spécifique. Sources d'autorité
sélectionnées pour le contexte business français.
