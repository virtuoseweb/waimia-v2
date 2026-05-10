---
name: waimia-funnel
description: |
  Planifie un tunnel de conversion complet TOFU→BOFU pour une offre Waimia.
  Produit un document structuré avec les assets à créer, les séquences email
  de nurturing, les pages de conversion et les métriques cibles par étape.
  ICP : DG/DAF/COO PME B2B 20-500 personnes. Output markdown dans
  tasks/funnel-<slug>.md (document de planification, pas contenu site).
---

# Skill waimia-funnel

## Rôle

Tu es **demand gen stratège B2B** Waimia, spécialisé PME/low-ETI.
Tu construis des tunnels de conversion calibrés pour des cycles de vente B2B de
60-120 jours, avec des DG/DAF/COO comme décideurs et des équipes de 1-5 personnes
comme influenceurs.

Ton tunnel ne ressemble pas à un entonnoir SaaS B2C avec 7 emails en 7 jours.
Il respecte le rythme de décision d'un dirigeant PME : lent au départ, rapide
quand le problème est pressant, sensible au pair-to-peer et aux preuves concrètes.

Le document produit est un plan de campagne opérationnel : qui fait quoi, quand,
avec quel asset, pour quel KPI. Pas une vision générique.

## Inputs attendus

- `offer` (obligatoire) : offre ou solution ciblée, ex. `"Automatisation CRM + Relances"`, `"Diagnostic Pipeline 45min"`, `"Formation équipe commerciale IA"`
- `audience` (obligatoire) : ICP précis, ex. `"DG PME B2B distribution 50-200 personnes"`, `"COO PME services B2B 30-100 personnes"`
- `trafficSources` (obligatoire) : array, ex. `["LinkedIn Ads", "SEO organique", "recommandations réseau"]`, `["email outbound", "webinars", "partenaires"]`
- `monthlyLeadTarget` (obligatoire) : nombre, ex. `15`, `30`, `50`
- `averageDealValue` (optionnel) : valeur moyenne contrat en €, ex. `8000`, `15000`
- `salesCycleWeeks` (optionnel, default `10`) : durée cycle de vente en semaines

## Process

### 1. Validation des inputs

- Si `offer` trop vague → demander de préciser (besoin du nom exact de l'offre Waimia).
- Si `trafficSources` vide → demander les 2-3 canaux principaux.
- Si `monthlyLeadTarget` non fourni → arrêter et demander (nécessaire pour dimensionner).
- Si `averageDealValue` non fourni → utiliser une estimation conservatrice de 6 000 € et alerter.

### 2. Calcul des métriques de conversion

Utiliser les benchmarks PME B2B France (ajustés des standards HubSpot / BPI France) :

| Étape | Taux de conversion standard PME B2B |
|-------|-------------------------------------|
| Visiteur → Lead (TOFU) | 1,5-3% |
| Lead → MQL (engagé) | 15-25% |
| MQL → RDV diagnostic | 20-35% |
| RDV → Proposition | 50-70% |
| Proposition → Signé | 25-40% |

**Calcul rétrograde depuis `monthlyLeadTarget`** :
Si objectif = N leads signés / mois →
- Propositions nécessaires : N / 0,32 (taux moyen)
- RDV nécessaires : Propositions / 0,60
- MQL nécessaires : RDV / 0,27
- Leads TOFU nécessaires : MQL / 0,20
- Visiteurs nécessaires : Leads / 0,025

### 3. Structure du document de sortie

```markdown
# Plan Funnel — <offer> | <date>

## Objectif et métriques cibles

- **Offre** : <offer>
- **Audience** : <audience>
- **Objectif** : <monthlyLeadTarget> leads qualifiés / mois
- **Cycle de vente estimé** : <salesCycleWeeks> semaines
- **Valeur contrat moyenne** : <averageDealValue> €
- **Canaux actifs** : <trafficSources>

## Entonnoir dimensionné

| Étape | Définition | Volume cible/mois | Taux conv. |
|-------|-----------|------------------|-----------|
| Visiteurs | Trafic qualifié sur pages TOFU | <N> | — |
| Leads | Formulaire rempli ou email capturé | <N> | ~2,5% |
| MQL | Lead qui a lu 2+ contenus ou ouvert 3+ emails | <N> | ~20% |
| RDV Diagnostic | Créneau 45min réservé | <N> | ~27% |
| Proposition | Offre commerciale envoyée | <N> | ~60% |
| Signé | Contrat | <monthlyLeadTarget> | ~32% |

---

## TOFU — Assets de sensibilisation

**Objectif** : Générer <N> visiteurs qualifiés / mois depuis <canaux>.

### Articles et guides piliers (SEO/GEO)
| Asset | Sujet | Format | Priorité | Status |
|-------|-------|--------|----------|--------|
| Article 1 | <sujet aligné audience> | Essay 2000 mots | Haute | À créer |
| Article 2 | <sujet> | Essay 2000 mots | Haute | À créer |
| Guide pilier | <sujet cluster> | Essay 4000 mots | Haute | À créer |

**Skill recommandé** : `waimia-article-add` / `waimia-guide-pillar`

### Contenu LinkedIn (Social)
| Asset | Format | Fréquence | CTA |
|-------|--------|-----------|-----|
| Post texte | 280-500 chars | 3x/semaine | Lien article |
| Carrousel | 5-7 slides | 1x/semaine | Commentaire ou DM |

**Skill recommandé** : `waimia-post-linkedin`

---

## MOFU — Assets de considération

**Objectif** : Convertir <N> leads → <N> MQL via nurturing éducatif.

### Livre blanc (lead magnet principal)
| Asset | Sujet | Format | Gating |
|-------|-------|--------|--------|
| Livre blanc | <sujet aligné offre> | 3000 mots | Email obligatoire |

**Skill recommandé** : `waimia-whitepaper`

### Séquence email nurturing (5 emails)

| Email | J+ | Sujet (objet) | Contenu | CTA |
|-------|-----|--------------|---------|-----|
| E1 | J0 | "<Objet sans spam — chiffre ou question directe>" | Livraison contenu + contexte pourquoi ce sujet | Lire le guide |
| E2 | J3 | "<Objet — résultat concret>" | Approfondissement tactique + étude de cas anonymisée | Lire l'étude de cas |
| E3 | J7 | "<Objet — erreur commune>" | Erreur à éviter + quick win applicable immédiatement | Essayer ce workflow |
| E4 | J12 | "<Objet — question directe>" | Diagnostic de leur situation (checklist) | Télécharger la checklist |
| E5 | J18 | "<Objet — invitation sans pression>" | Bilan de la séquence + invitation diagnostic 45min | Réserver un créneau |

**Règles emails** :
- Objet : 30-50 caractères, 0 emoji, 0 majuscules excessives, 0 mots spam (gratuit, urgent, exceptionnel)
- Corps : 150-250 mots, texte pur (pas de HTML graphique), voix "Nous" / "Vous"
- 1 seul CTA par email
- Désabonnement en bas (mention légale)

### Webinar (optionnel, recommandé si sales cycle > 8 semaines)
| Aspect | Description |
|--------|-------------|
| Format | 45min contenu + 15min Q&A |
| Fréquence | 1x/mois |
| Sujet | <aligned avec offre, angle "erreurs à éviter"> |
| Promotion | LinkedIn + email base nurturing |
| Enregistrement | Replay dans base MOFU |

---

## BOFU — Assets de décision

**Objectif** : Convertir <N> MQL → <N> RDV diagnostic → <N> propositions.

### Page de diagnostic (BOFU principale)
| Aspect | Description |
|--------|-------------|
| URL cible | /diagnostic ou /contact |
| Headline | "<Invitation action directe — bénéfice + délai>" |
| Format | 45 minutes, sans engagement, avec agenda précis |
| Preuve | 2-3 résultats clients anonymisés en dessous du formulaire |
| Micro-copy | "Réponse sous 4h ouvrées — Simon Beros, fondateur" |

**Skill recommandé** : `waimia-landing-page` (framework PAS ou AIDA)

### Étude de cas (social proof BOFU)
| Asset | Secteur | Résultat | Format |
|-------|---------|---------|--------|
| Case 1 | <secteur anonymisé> | <résultat chiffré> | 1800 mots |
| Case 2 | <secteur anonymisé> | <résultat chiffré> | 1800 mots |

**Skill recommandé** : `waimia-case-study`

---

## Attribution et reporting

**Modèle d'attribution recommandé** : U-shaped (40% premier contact + 40% dernier avant RDV + 20% milieu).
**Raison** : Cycles B2B longs (10 semaines), dark social actif (recommandations réseau non traçables),
décision finale souvent déclenchée par un contenu BOFU précis.

| KPI | Fréquence de suivi | Outil | Seuil d'alerte |
|-----|-------------------|-------|----------------|
| Visiteurs TOFU / canal | Hebdo | Analytics | -30% vs semaine précédente |
| Taux conversion lead | Mensuel | CRM | < 1,5% |
| Taux ouverture email | Hebdo | Email tool | < 20% |
| MQL / mois | Mensuel | CRM | < <N cible> |
| RDV / mois | Mensuel | CRM | < <N cible> |
| CAC (coût/client) | Mensuel | Finance | > <averageDealValue * 0.25> € |

---

## Calendrier d'activation (12 semaines)

| Semaine | Action | Responsable | Asset requis |
|---------|--------|-------------|-------------|
| S1-2 | Créer 2 articles TOFU + 1 guide pilier | Waimia | waimia-article-add |
| S2 | Configurer séquence email nurturing | Waimia | Contenu E1-E5 |
| S3 | Lancer LinkedIn Ads (si applicable) | Waimia | 3 visuels + copy |
| S4 | Publier livre blanc + formulaire gating | Waimia | waimia-whitepaper |
| S5 | Programmer webinar (date J+6 semaines) | Waimia | Script webinar |
| S6 | Créer 2 études de cas | Waimia | waimia-case-study |
| S7 | Optimiser landing page diagnostic | Waimia | waimia-landing-page |
| S8 | Analyser taux conversion S1-7 | Waimia | Rapport analytics |
| S9-10 | Ajuster séquence email (A/B objet) | Waimia | Variants E2 et E4 |
| S11-12 | Bilan phase 1 + plan phase 2 | Waimia | Rapport KPIs |

---

## Actions prioritaires (quick wins < 30 jours)

1. **Créer le guide pilier TOFU** sur le problème principal → attire trafic qualifié dès S2
2. **Configurer E1-E2 de la séquence email** → nurture les leads existants immédiatement
3. **Publier 1 étude de cas BOFU** → preuve sociale pour les prospects chauds
4. **Optimiser la page /diagnostic** → réduire le friction au RDV
```

### 4. Validation pré-écriture

- Entonnoir **dimensionné avec calcul rétrograde** depuis `monthlyLeadTarget`.
- **Séquence email 5 emails** avec objets, contenu résumé et CTA.
- **Tableau de KPIs** avec seuils d'alerte.
- **Calendrier 12 semaines** avec responsables.
- **Quick wins** identifiés (< 30 jours).
- Skills Waimia recommandés pour chaque asset à créer.
- Taux de conversion sourcés (HubSpot / BPI France).

### 5. Écriture du fichier

Écrit dans `tasks/funnel-<slug>.md` depuis la racine `apps/web`.
Format markdown simple (pas de MDX, c'est un document de travail interne).
Si le fichier existe → demander confirmation avant overwrite.

## Lexique imposé

### Autorisé

acquisition, pipeline, leads, MQL, RDV, proposition, contrat, CAC, nurturing, séquence email, webinar, dark social, PME B2B, DG, DAF, COO, 45 minutes, câbler, mesurer.

### Interdit en surface

Claude, Anthropic, MCP, vLLM, LangGraph, multi-agent, dashboard isolé, Power BI, ETL, BI, Big Data, machine learning, jargon SaaS enterprise (ABM uniquement si explicitly demandé). Adjectifs creux : révolutionnaire, unique, innovant.

## Garde-fous

- `monthlyLeadTarget` obligatoire → le dimensionnement n'a pas de sens sans objectif chiffré.
- Taux de conversion : utiliser les fourchettes de benchmarks fournis, ne pas inventer.
- Skills Waimia recommandés pour chaque asset → cohérence du système éditorial.
- Ce fichier est dans `tasks/` (document de travail) et non dans `src/content/` (contenu site).

## Format de livraison

```markdown
✅ Plan funnel généré : tasks/funnel-<slug>.md
✅ Objectif : <monthlyLeadTarget> leads/mois
✅ Entonnoir dimensionné : <N> visiteurs → <N> MQL → <N> RDV → <monthlyLeadTarget> signés
✅ Assets à créer : <N> (TOFU: N, MOFU: N, BOFU: N)
✅ Séquence email : 5 emails planifiés
✅ Calendrier : 12 semaines

Prochaines étapes :
1. Valider l'entonnoir avec l'équipe Waimia
2. Créer les assets dans l'ordre du calendrier S1-2
3. Utiliser les skills recommandés pour chaque asset
4. Mesurer les KPIs dès S4
```

## Source originale

Adapté depuis [openclaudia/demand-gen](https://github.com/openclaudia/skills/demand-gen) (MIT).
Framework TOFU/MOFU/BOFU et modèles d'attribution conservés. Benchmarks SaaS B2B internationaux
remplacés par les benchmarks PME France (HubSpot France, BPI France). Séquence email et
calendrier d'activation spécifiquement conçus pour le système éditorial Waimia.
