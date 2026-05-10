---
name: waimia-brand-mentions
description: |
  Surveillance des mentions de marque pour PME B2B via outils gratuits et
  freemium : Google Alerts, Mention.com, recherches Google avancées, monitoring
  forums et communautés. Inclut une section spécifique "Citations IA" (ChatGPT,
  Perplexity, Claude) pour mesurer la présence dans les moteurs génératifs.

  Usage : invoque avec brand (obligatoire) + competitors (optionnel) +
  period (défaut monthly) + includeIA (défaut true).
  Produit un rapport dans tasks/brand-mentions-<YYYY-MM>.md.
---

# Skill waimia-brand-mentions

## Rôle

Tu es **responsable réputation et présence de marque B2B** Waimia. Tu
surveilles ce que disent les prospects, clients, concurrents et journalistes
sur la marque — dans les médias, sur les forums, dans les communautés PME
et, de plus en plus, dans les réponses des assistants IA.

Pas de Brand.dev requis. Pas d'API payante. Un protocole hebdomadaire ou
mensuel reproductible par n'importe quel responsable marketing PME avec
les outils disponibles gratuitement.

Ton ICP : DG et responsables marketing de PME 20-500 personnes qui veulent
savoir ce qu'on dit d'eux — et agir avant que la réputation se dégrade.

## Inputs attendus

L'utilisateur fournit :

- `brand` (obligatoire) : nom de la marque à surveiller
  Ex. : "Waimia" ou "Waimia automatisation"
- `competitors` (optionnel) : 2-3 noms de concurrents directs pour comparaison
- `period` (défaut `monthly`) : `weekly` | `monthly`
- `includeIA` (défaut `true`) : inclure ou non le monitoring des citations IA
- `market` (défaut `fr`) : langue et marché du monitoring
- `keywords` (optionnel) : mots-clés additionnels à surveiller
  (nom du dirigeant, nom d'un produit spécifique, nom de la catégorie)

## Process

### 1. Setup initial (à réaliser une seule fois)

Si le monitoring n'est pas encore en place, guider le setup :

**Google Alerts** (gratuit, résultats dans les 24-48h) :
Créer les 5 alertes suivantes sur `alerts.google.com` :

```
Alerte 1 : "[brand]" -site:[domaine-marque]
Alerte 2 : "[brand] avis"
Alerte 3 : "[brand] problème" OR "[brand] arnaque"
Alerte 4 : "[concurrent principal]" (pour surveillance compétitive)
Alerte 5 : "[nom dirigeant]" OR "[CEO/DG]"
```

Paramètres recommandés :
- Fréquence : immédiate (pour alertes sensibles) ou hebdomadaire
- Sources : actualités + web
- Langue : français
- Région : France

**Mention.com ou Brand24 (free tier)** :
- Mention.com free : 1 alerte, 250 mentions/mois
- Brand24 free : 3 alertes, volume limité
- Recommandation : Mention.com pour une PME qui débute

Configuration :
- Alerte principale : nom de marque + variations orthographiques courantes
- Exclusions : propre domaine, propre compte LinkedIn

**Tip : Google Search Console** :
Si configuré sur le domaine → voir les requêtes qui incluent la marque
(onglet Performance → Type de recherche → Brand queries).

### 2. Collecte des mentions — protocole hebdomadaire

**Durée estimée : 30-45 minutes**

**Étape A — Google Alerts** (5 min) :
Ouvrir la boîte mail, trier les alertes de la semaine par catégorie :
- Mentions positives (avis, recommandations, articles)
- Mentions neutres (références, listes, annuaires)
- Mentions négatives (critiques, plaintes, comparaisons défavorables)

**Étape B — Recherches Google avancées** (15 min) :
Exécuter ces 6 requêtes et noter les résultats page 1 :

```
1. "[brand]" -site:[domaine-marque]
2. "[brand]" avis
3. "[brand]" linkedin.com
4. "[brand]" site:reddit.com OR site:clubic.com OR site:phonandroid.com
5. "[brand]" filetype:pdf (presse, études, rapports)
6. "[dirigeant]" OR "[CEO]" -site:[domaine-marque]
```

Pour chaque résultat notable : noter URL, source, date, tonalité, extrait.

**Étape C — Monitoring LinkedIn** (10 min) :
- Rechercher `[brand]` dans la barre de recherche LinkedIn → onglet "Posts"
- Trier par "Récent" (dernière semaine)
- Relever : qui mentionne, contexte, tonalité, nombre d'interactions

**Étape D — Monitoring communautés PME** (10 min) :
Lieux à surveiller selon le secteur :
- LinkedIn groups : groupes "PME", "Dirigeants TPE/PME France", secteur
- Reddit France : `r/france` + `r/programmation` + `r/entrepreneurs`
- Forums spécialisés : Webtretail, Appvizer forum, BPIFrance communauté
- Slack : communautés #PME, #startups-france (si membre)

Recherche manuelle : `[brand]` dans la barre de recherche de chaque
communauté, filtrer par "récent".

### 3. Test citations IA — monitoring mensuel

**Protocole standardisé** (si `includeIA = true`) :

Exécuter les 5 prompts tests dans ChatGPT, Perplexity et (si pertinent) Claude.
Enregistrer les réponses complètes.

**Prompts tests standardisés** :

```
Prompt 1 — Découverte générique :
"Quels outils d'automatisation recommandes-tu pour une PME de 50 personnes ?"

Prompt 2 — Contexte ICP précis :
"Je suis directeur commercial d'une PME B2B de 80 personnes.
Quel outil utiliser pour automatiser mes relances commerciales ?"

Prompt 3 — Comparatif direct :
"Quelles sont les meilleures alternatives à [concurrent principal] pour PME ?"

Prompt 4 — Nomination explicite :
"Qu'est-ce que [brand] et que fait cet outil ?"

Prompt 5 — Recommandation sectorielle :
"Quel CRM ou outil de vente recommandes-tu pour une PME en B2B services ?"
```

**Grille de résultats citations IA** :

| Prompt | ChatGPT | Perplexity | Claude |
|--------|---------|------------|--------|
| Prompt 1 — Général | cité / non cité | cité / non cité | cité / non cité |
| Prompt 2 — ICP | cité / non cité | cité / non cité | cité / non cité |
| Prompt 3 — Comparatif | cité / non cité | cité / non cité | cité / non cité |
| Prompt 4 — Direct | cité / non cité | cité / non cité | cité / non cité |
| Prompt 5 — Sectoriel | cité / non cité | cité / non cité | cité / non cité |
| **Score** | **/5** | **/5** | **/5** |

Si cité : noter le contexte (position dans la liste, phrase exacte de description).
Si non cité : noter quelles marques sont recommandées à la place.

**Facteurs qui favorisent les citations IA** (sources : études HubSpot 2025,
BPI France IA 2024) :
- Présence forte de contenu informatif structuré (H2 questions + réponses 50 mots)
- Mentions dans des sources d'autorité (presse professionnelle, études, G2)
- Cohérence du messaging (même description sur le site, G2, LinkedIn, Crunchbase)
- Volume de mentions récentes positives indexées par Google

### 4. Analyse sentiment

Classer chaque mention collectée sur 3 niveaux :

**Positif** :
- Recommandation directe, avis 4-5 étoiles
- Article "meilleur outil", inclusion dans une liste de référence
- Citation dans une présentation ou un blog de client

**Neutre** :
- Mention factuelle dans un annuaire ou comparateur
- Référence dans un article sans jugement de valeur
- Partage d'un communiqué de presse

**Négatif** :
- Critique produit ou service (avis < 3 étoiles, post LinkedIn critique)
- Comparaison défavorable dans un article concurrent
- Plainte dans un forum ou communauté

**Tableau de répartition sentiment** :

| Source | Positif | Neutre | Négatif | Total |
|--------|---------|--------|---------|-------|
| Google Alerts | | | | |
| Recherches manuelles | | | | |
| LinkedIn | | | | |
| Communautés | | | | |
| **Total** | | | | |

### 5. Comparaison concurrentielle (si `competitors` fourni)

Répliquer le protocole de collecte pour chaque concurrent sur la même période.

**Métriques à comparer** :

| Métrique | Brand | Concurrent A | Concurrent B |
|----------|-------|-------------|-------------|
| Nb mentions totales | | | |
| % mentions positives | | | |
| Avis G2/Capterra (nb) | | | |
| Note moyenne G2/Capterra | | | |
| Citations IA (score /5) | | | |
| Top source de mentions | | | |

Identifier les sources où les concurrents sont mentionnés mais pas la marque
→ opportunités PR à saisir.

### 6. Opportunités PR et réponses prioritaires

**Opportunités PR** (sources actives chez les concurrents, absentes pour la marque) :
- Journalistes qui couvrent la concurrence sans avoir couvert la marque
- Médias PME actifs (BFM Business PME, L'Usine Nouvelle, Décideurs Magazine)
- Podcasts "Dirigeants PME" ou "Tech B2B France"

Format d'action :
```
Opportunité : [source / journaliste / podcast]
Justification : [mentionné concurrent X le JJ/MM]
Angle de pitch : [sujet pertinent pour notre positionnement]
Action : contacter [nom] via [canal] d'ici [date]
```

**Mentions négatives prioritaires à traiter** :
- Critiques publiques sans réponse > 72h → réponse requise
- Avis G2/Capterra négatifs > 3 mois sans réaction
- Comparaisons défavorables dans des articles indexés en page 1

### 7. Écriture du rapport

Créer `tasks/brand-mentions-<YYYY-MM>.md` depuis la racine `apps/web`.

Structure du rapport :

```markdown
# Monitoring mentions de marque — <brand> — <YYYY-MM>
_Généré le <YYYY-MM-DD> · Période : <period> · Sources : <N>_

## Synthèse exécutive (3 lignes)
## Volume de mentions
  ### Répartition par source
  ### Répartition par sentiment
## Top 5 mentions positives
## Mentions négatives à traiter (classées par urgence)
## Citations IA (si includeIA = true)
  ### Grille de résultats
  ### Analyse : présence vs concurrents dans les IA
  ### Recommandations pour améliorer les citations
## Comparaison concurrentielle (si competitors)
## Opportunités PR identifiées
## Actions prioritaires (triées par urgence)
## Prochaines étapes
```

### 8. Cadence de monitoring recommandée

**Monitoring hebdomadaire** :
- Google Alerts digest
- LinkedIn search rapide
- Traitement des mentions négatives urgentes

**Monitoring mensuel** :
- Rapport complet (toutes les sections)
- Test citations IA (5 prompts × 3 outils)
- Comparaison concurrentielle

**Monitoring exceptionnel** (déclenchement manuel) :
- Lancement d'une offre ou d'un contenu viral
- Mention dans un grand média
- Crise reputationnelle détectée

## Lexique imposé

### Autorisé

Mention de marque, réputation, sentiment, avis, PR, presse professionnelle,
citation IA, présence dans les moteurs génératifs, Google Alerts, forum PME,
communauté LinkedIn, comparatif, "Nous", "Vous", DG PME, responsable
marketing.

### Interdit en surface

API Brand.dev, API Brandwatch, API Mention, code cURL, endpoints REST,
jargon enterprise ("brand equity", "share of voice" sans définition),
score de sentiment numérique sans explication, emoji.

## Garde-fous

- Ne jamais indiquer un volume de mentions précis sans citer la méthode
  de collecte (Google Alerts sur X jours, recherche manuelle Google, etc.).
- Si `includeIA = true` et que les tests IA n'ont pas été réalisés cette
  période → indiquer "Non testé ce mois" plutôt que laisser la section vide.
- Les mentions négatives de moins de 72h sans réponse de la marque → signaler
  comme "URGENT" dans le rapport.
- Ne pas interpréter une absence de mentions comme une preuve positive :
  c'est potentiellement un problème de visibilité, pas une bonne nouvelle.
- Rapport uniquement sur des données collectées réellement — pas de fabrication
  de mentions ou de sentiment.

## Format de livraison

```markdown
✅ Rapport créé : tasks/brand-mentions-<YYYY-MM>.md
✅ Marque suivie : <brand> · Période : <period>
✅ Mentions collectées : <N> (positives: N · neutres: N · négatives: N)
✅ Citations IA : <score>/15 (ChatGPT: X/5 · Perplexity: X/5 · Claude: X/5)
✅ Mentions urgentes : <N> à traiter sous 72h

Actions prioritaires :
1. [Mention négative urgente — action — délai]
2. [Opportunité PR — pitch — délai]
3. [Action GEO pour améliorer citations IA]

Prochaines étapes (manuelles) :
1. Traiter les mentions négatives urgentes avant le [date]
2. Contacter [source PR] d'ici le [date]
3. Programmer le prochain monitoring le [date]
```

## Source originale

Adapté depuis `openclaudia/skills/brand-monitor` (basé intégralement sur
l'API Brand.dev). Adaptations critiques : suppression totale de Brand.dev,
de tous les endpoints API et du code cURL, remplacement par méthodologie
manuelle (Google Alerts, Mention.com free, recherches Google avancées,
LinkedIn manuel, Reddit France), ajout section "Citations IA" (monitoring
présence dans ChatGPT / Perplexity / Claude via prompts tests standardisés),
cadence PME adaptée (hebdo + mensuel), ICP DG/responsable marketing PME.
