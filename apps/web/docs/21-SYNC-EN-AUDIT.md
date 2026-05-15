# Tier 11 · Audit Sync EN — Waimia Site Astro

> Généré le 2026-05-15 · Périmètre : `src/pages/` complet vs `src/pages/en/`  
> Status : lecture-seule, aucune modification de page effectuée.

---

## 1. Architecture i18n actuelle

| Aspect | Détail |
|---|---|
| Langue par défaut | FR → `/` (pas de préfixe) |
| Langue secondaire | EN → `/en/` (préfixe) |
| Détection | `langFromPath(pathname)` dans `src/lib/i18n.ts` |
| Localisation des liens | `localizeHref(href, lang)` — préfixe `/en` si `lang === 'en'` |
| Collections bilingues | Champs doubles `title_fr / title_en`, `description_fr / description_en`, etc. |
| Alternate SEO | `hreflang: { fr: 'fr-FR', en: 'en-US' }` |

**Logique `langFromPath`** : `pathname === '/en' || pathname.startsWith('/en/')` → EN, sinon FR.

Le catch-all racine `src/pages/[...slug].astro` est le seul fichier qui génère **explicitement des routes EN** via `getStaticPaths()` (pattern `en/{route}`). Toutes les autres pages dynamiques MDX ne génèrent que des routes FR.

---

## 2. Inventaire complet des pages

### 2.1 Pages statiques FR (hors pages de test, 404, catch-alls)

#### Racine
| Route | Fichier | Statut EN |
|---|---|---|
| `/` | `src/pages/index.astro` | ✅ matched `/en` |
| `/contact` | `src/pages/contact.astro` | ❌ FR only |
| `/manifesto` | `src/pages/manifesto.astro` | ✅ matched `/en/manifesto` |
| `/atlas` | `src/pages/atlas.astro` | ✅ matched `/en/atlas` |
| `/console` | `src/pages/console.astro` | ✅ matched `/en/console` |
| `/archive` | `src/pages/archive.astro` | ❌ FR only |

#### `/agence/`
| Route | Fichier | Statut EN |
|---|---|---|
| `/agence/about` | `src/pages/agence/about.astro` | ❌ FR only |
| `/agence/careers` | `src/pages/agence/careers.astro` | ❌ FR only |
| `/agence/design-system` | `src/pages/agence/design-system.astro` | ❌ FR only (interne) |
| `/agence/docs` | `src/pages/agence/docs.astro` | ❌ FR only (interne) |
| `/agence/governance` | `src/pages/agence/governance.astro` | ❌ FR only |
| `/agence/methode` | `src/pages/agence/methode.astro` | ❌ FR only |
| `/agence/trust-center` | `src/pages/agence/trust-center.astro` | ❌ FR only |

#### `/bienvenue/`
| Route | Fichier | Statut EN |
|---|---|---|
| `/bienvenue/audit` | `src/pages/bienvenue/audit.astro` | ✅ matched `/en/bienvenue/audit` |
| `/bienvenue/contact` | `src/pages/bienvenue/contact.astro` | ❌ FR only |
| `/bienvenue/livre-blanc` | `src/pages/bienvenue/livre-blanc.astro` | ✅ matched `/en/bienvenue/livre-blanc` |
| `/bienvenue/newsletter` | `src/pages/bienvenue/newsletter.astro` | ✅ matched `/en/bienvenue/newsletter` |

#### `/cas/`
| Route | Fichier | Statut EN |
|---|---|---|
| `/cas` | `src/pages/cas/index.astro` | ❌ FR only |
| `/cas/caserne` | `src/pages/cas/caserne.astro` | ❌ FR only |
| `/cas/halcyon` | `src/pages/cas/halcyon.astro` | ❌ FR only |
| `/cas/northbound` | `src/pages/cas/northbound.astro` | ❌ FR only |
| `/cas/plateau` | `src/pages/cas/plateau.astro` | ❌ FR only |

#### `/ecole/`
| Route | Fichier | Statut EN |
|---|---|---|
| `/ecole` | `src/pages/ecole/index.astro` | ❌ FR only |

#### `/equipe/`
| Route | Fichier | Statut EN |
|---|---|---|
| `/equipe` | `src/pages/equipe/index.astro` | ❌ FR only |

#### `/offres/`
| Route | Fichier | Statut EN |
|---|---|---|
| `/offres` | `src/pages/offres/index.astro` | ❌ FR only |
| `/offres/audit-maturite-ia` | `src/pages/offres/audit-maturite-ia.astro` | ❌ FR only |
| `/offres/conseil` | `src/pages/offres/conseil.astro` | ❌ FR only |
| `/offres/revops` | `src/pages/offres/revops.astro` | ❌ FR only |
| `/offres/site-web-ia` | `src/pages/offres/site-web-ia.astro` | ❌ FR only |
| `/offres/site-web-ia-landing` | `src/pages/offres/site-web-ia-landing.astro` | ❌ FR only |

#### `/ressources/`
| Route | Fichier | Statut EN |
|---|---|---|
| `/ressources` | `src/pages/ressources/index.astro` | ❌ FR only |
| `/ressources/academy` | `src/pages/ressources/academy.astro` | ❌ FR only |
| `/ressources/changelog` | `src/pages/ressources/changelog.astro` | ❌ FR only |
| `/ressources/blog` | `src/pages/ressources/blog/index.astro` | ❌ FR only |
| `/ressources/blog/brain-circuit` | `src/pages/ressources/blog/brain-circuit.astro` | ❌ FR only |
| `/ressources/cookbooks` | `src/pages/ressources/cookbooks/index.astro` | ❌ FR only |
| `/ressources/cookbooks/claude-cowork-rollout` | `...cookbooks/claude-cowork-rollout.astro` | ❌ FR only |
| `/ressources/cookbooks/claude-skills-tutorial` | `...cookbooks/claude-skills-tutorial.astro` | ❌ FR only |
| `/ressources/cookbooks/mcp-server-deploy` | `...cookbooks/mcp-server-deploy.astro` | ❌ FR only |
| `/ressources/livres-blancs` | `...livres-blancs/index.astro` | ❌ FR only |
| `/ressources/livres-blancs/ai-act-readiness` | `...livres-blancs/ai-act-readiness.astro` | ❌ FR only |
| `/ressources/veille-ia` | `...veille-ia/index.astro` | ❌ FR only |

#### `/secteurs/`
| Route | Fichier | Statut EN |
|---|---|---|
| `/secteurs` | `src/pages/secteurs/index.astro` | ❌ FR only |
| `/secteurs/finance-compta` | `src/pages/secteurs/finance-compta.astro` | ❌ FR only |
| `/secteurs/industrie` | `src/pages/secteurs/industrie.astro` | ❌ FR only |
| `/secteurs/services-b2b` | `src/pages/secteurs/services-b2b.astro` | ❌ FR only |

#### `/solutions/` et `/technologies/`
| Route | Fichier | Statut EN |
|---|---|---|
| `/solutions` | `src/pages/solutions/index.astro` | ❌ FR only |
| `/technologies` | `src/pages/technologies/index.astro` | ❌ FR only |

---

### 2.2 Pages statiques EN dédiées

| Route EN | Fichier | Équivalent FR |
|---|---|---|
| `/en` | `src/pages/en/index.astro` | ✅ `/` |
| `/en/atlas` | `src/pages/en/atlas.astro` | ✅ `/atlas` |
| `/en/manifesto` | `src/pages/en/manifesto.astro` | ✅ `/manifesto` |
| `/en/console` | `src/pages/en/console.astro` | ✅ `/console` |
| `/en/bienvenue/audit` | `src/pages/en/bienvenue/audit.astro` | ✅ `/bienvenue/audit` |
| `/en/bienvenue/livre-blanc` | `src/pages/en/bienvenue/livre-blanc.astro` | ✅ `/bienvenue/livre-blanc` |
| `/en/bienvenue/newsletter` | `src/pages/en/bienvenue/newsletter.astro` | ✅ `/bienvenue/newsletter` |

**Aucune page EN orpheline** (toutes les pages EN ont un équivalent FR).

---

### 2.3 Routes EN couvertes par le catch-all (stubs, noindex)

Le `src/pages/[...slug].astro` génère des stubs EN pour ces routes via `getStaticPaths()` :

```
/en/offres, /en/solutions, /en/technologies, /en/ressources, /en/agence,
/en/contact, /en/trust, /en/careers,
/en/offres/audit-process-intelligence, /en/offres/conformite-ai-act,
/en/offres/architecture-hybride, /en/offres/diagnostic-maturite,
/en/offres/claude-cowork, /en/offres/claude-skills, /en/offres/mcp-connectors,
/en/offres/routines-plugins, /en/offres/agents-metiers, /en/offres/multi-agents,
/en/offres/tiered-routing, /en/offres/poc-mvp-sprint, /en/offres/managed-agents,
/en/offres/self-hosted, /en/offres/open-source, /en/offres/maintenance-sre,
/en/solutions/finance, /en/solutions/ventes-marketing, /en/solutions/support,
/en/solutions/juridique, /en/solutions/rh, /en/solutions/it-engineering,
/en/solutions/sante, /en/solutions/finance-industrie, /en/solutions/secteur-public,
/en/solutions/industrie, /en/solutions/retail,
/en/technologies/claude-models, /en/technologies/claude-code,
/en/technologies/claude-surfaces, /en/technologies/integrations-office,
/en/technologies/inference, /en/technologies/open-source-models,
/en/technologies/rag-prive, /en/technologies/fine-tuning,
/en/technologies/frameworks, /en/technologies/no-code, /en/technologies/observability,
/en/ressources/cas, /en/ressources/blog, /en/ressources/cookbooks,
/en/ressources/cas/plateau, /en/ressources/cas/halcyon,
/en/ressources/cas/northbound, /en/ressources/cas/caserne,
/en/ressources/cas/virtuoseos
```

Ces routes **existent** en EN (pas 404) mais sont des stubs avec `noindex, nofollow`. Elles rendent du contenu FR hardcodé dans le template (texte non traduit dans les slots).

---

## 3. Synthèse des compteurs

| Catégorie | Nombre |
|---|---|
| Pages FR statiques (hors 404/test/catch-all) | **54** |
| Pages EN statiques dédiées | **7** |
| Paires FR ↔ EN matchées (statiques) | **7** |
| Pages FR sans équivalent EN dédié | **47** |
| Pages EN orphelines (sans FR) | **0** |
| Routes EN stubs via catch-all (noindex) | ~50 |

**Taux de parité statique : 13 % (7/54)**

---

## 4. Audit des pages dynamiques

### 4.1 Inventaire des catch-alls et pages dynamiques

| Fichier | Collection | `langFromPath` ? | Routes EN générées ? |
|---|---|---|---|
| `src/pages/[...slug].astro` | Statique hardcodée | ✅ Oui | ✅ Oui (explicit flatMap EN) |
| `src/pages/offres/[...slug].astro` | `offres` MDX | ✅ Oui | ❌ Non (FR `/offres/{slug}` uniquement) |
| `src/pages/solutions/[...slug].astro` | `solutions` MDX | ? | ❌ Non |
| `src/pages/technologies/[...slug].astro` | `technologies` MDX | ? | ❌ Non |
| `src/pages/cas/[...slug].astro` | `cases` MDX | ❌ Non (FR hardcodé) | ❌ Non |
| `src/pages/secteurs/[...slug].astro` | `secteurs` MDX | ❌ Non (FR hardcodé) | ❌ Non |
| `src/pages/bienvenue/[...slug].astro` | `pages` CMS | ? | ❌ Non |
| `src/pages/equipe/[...slug].astro` | `authors` | ❌ Non | ❌ Non |
| `src/pages/ressources/blog/[...slug].astro` | `blog` | ❌ Non | ❌ Non |
| `src/pages/ressources/cookbooks/[...slug].astro` | `cookbooks` | ? | ❌ Non |
| `src/pages/ressources/livres-blancs/[...slug].astro` | `livresBlancs` | ? | ❌ Non |
| `src/pages/ressources/veille-ia/[...slug].astro` | `veilleIA` | ? | ❌ Non |
| `src/pages/ressources/outils/[...slug].astro` | `outils` | ? | ❌ Non |
| `src/pages/ecole/cours/[slug].astro` | `cours` | ? | ❌ Non |
| `src/pages/offres/[offre]/tunnel/[step].astro` | Statique | ? | ❌ Non |

### 4.2 Pattern `langFromPath` — usage correct ?

- **`src/pages/[...slug].astro`** : usage correct. `langFromPath(Astro.url.pathname)` + génération FR/EN dans `getStaticPaths()`. ✅
- **`src/pages/en/manifesto.astro`** : utilise `langFromPath(Astro.url.pathname)` — correct, se comporte comme la page FR. ✅
- **`src/pages/offres/[...slug].astro`** : `langFromPath` présent, lit `data.title_fr`/`data.title_en` selon la langue — mais `getStaticPaths()` ne génère **que** `/offres/{slug}`. La route EN `/en/offres/{slug}` n'est jamais générée. ⚠️ Partiel.
- **`src/pages/cas/[...slug].astro`** : pas de `langFromPath`, tout est hardcodé en FR (`title_fr`, `description_fr`). ❌

### 4.3 Gap critique — routes dynamiques EN manquantes

Les collections MDX contiennent des champs bilingues (`title_fr/title_en`) mais aucun routeur dynamique dans `src/pages/` ne génère de route `/en/{collection}/{slug}`. La couverture EN dynamique est donc entièrement dans le catch-all statique (stubs noindex).

---

## 5. Plan de migration (T11.x)

### T11.1 — Hubs stratégiques EN (priorité haute · ~2 jours)

**Objectif :** créer des pages EN dédiées pour les hubs à fort trafic organique potentiel.

Pages à créer :
- `src/pages/en/offres/index.astro` → `/en/offres`
- `src/pages/en/solutions/index.astro` → `/en/solutions`
- `src/pages/en/technologies/index.astro` → `/en/technologies`
- `src/pages/en/ressources/index.astro` → `/en/ressources`
- `src/pages/en/contact.astro` → `/en/contact`
- `src/pages/en/agence/about.astro` → `/en/agence/about`
- `src/pages/en/agence/methode.astro` → `/en/agence/methode`

**Approche recommandée :** dupliquer la page FR, remplacer les champs FR par EN, ajouter `langFromPath` si absent.

### T11.2 — Pages statiques conversionnelles EN (priorité moyenne · ~3 jours)

**Objectif :** couvrir les pages à fort potentiel de conversion pour les visiteurs anglophones.

Pages à créer :
- `src/pages/en/cas/index.astro` → `/en/cas` (listing des cas clients)
- `src/pages/en/secteurs/index.astro` → `/en/secteurs`
- `src/pages/en/offres/conseil.astro` → `/en/offres/conseil`
- `src/pages/en/offres/audit-maturite-ia.astro` → `/en/offres/audit-maturite-ia`
- `src/pages/en/agence/careers.astro` → `/en/agence/careers`
- `src/pages/en/agence/trust-center.astro` → `/en/agence/trust-center`
- `src/pages/en/bienvenue/contact.astro` → `/en/bienvenue/contact`

### T11.3 — Routeurs dynamiques bilingues (priorité technique · ~5 jours)

**Objectif :** faire générer aux pages dynamiques MDX des routes `/en/{collection}/{slug}`.

Fichiers à refactoriser :
1. `src/pages/offres/[...slug].astro` — ajouter `{ params: { slug: 'en/' + entry.id }, props: ... }` dans `getStaticPaths()`, router vers EN dans le template
2. `src/pages/cas/[...slug].astro` — même pattern + supprimer hardcode FR
3. `src/pages/secteurs/[...slug].astro` — même pattern
4. `src/pages/ressources/blog/[...slug].astro` — si collections bilingues
5. `src/pages/technologies/[...slug].astro` — même pattern

**Attention :** modifier `getStaticPaths()` peut doubler le nombre de pages générées → surveiller les temps de build.

**Approche alternative :** créer des fichiers miroirs dans `src/pages/en/{collection}/[...slug].astro` qui importent les mêmes collections et passent `lang='en'` explicitement (sans modifier les fichiers FR existants — moins de risque de régression).

### T11.4 — Harmonisation architecture i18n (priorité long terme · ~3 jours)

**Objectif :** unifier l'approche i18n pour éviter la dérive FR/EN à chaque nouvelle page.

Actions :
1. **Créer un composant `LangSwitch`** qui détecte la page courante et propose le lien `alternateHref` — à exposer dans le layout `Base.astro`
2. **Implémenter `hreflang` dans `Base.astro`** pour toutes les paires FR/EN connues (SEO / GEO)
3. **Créer un script de validation** `scripts/check-en-parity.ts` qui liste automatiquement les pages FR sans équivalent EN — à lancer en CI
4. **Convention de nommage** : toute nouvelle page FR doit avoir son stub EN dans le même commit (règle à documenter dans `docs/06-coding-standards.md`)

---

## 6. Recommandations i18n ciblées

### GEO / AIO
- Les pages EN manquantes = **absence totale de signaux en langue anglaise** pour les LLMs qui indexent waimia.fr. Priorité : hubs `/en/offres`, `/en/solutions`, `/en/technologies` avec contenu réel (pas stubs).
- Les stubs `noindex, nofollow` dans le catch-all **n'alimentent pas** les index LLM/GEO.

### SEO technique
- Ajouter `<link rel="alternate" hreflang="fr-FR">` et `<link rel="alternate" hreflang="en-US">` dans `Base.astro` pour toutes les paires.
- La plupart des pages FR actuelles n'ont pas de balise `alternate` pointant vers leur version EN.

### Approche recommandée pour T11.1 et T11.2
- Utiliser `langFromPath()` dans les pages EN à créer (comme `en/manifesto.astro` et `en/console.astro` qui sont déjà corrects).
- Ne PAS hardcoder `const lang = 'en'` (anti-pattern visible dans `en/atlas.astro:15`). Préférer `langFromPath(Astro.url.pathname)` pour cohérence.

### Collections MDX
- Les champs `title_en`, `description_en`, etc. existent dans les schémas mais ne sont **jamais rendus** en production (aucune route EN dynamique les expose). Valider que ces champs sont bien remplis dans les entrées CMS avant T11.3.

---

## 7. Tableau récapitulatif global

| Route FR | Statut EN | Priorité |
|---|---|---|
| `/` | ✅ `/en` | — |
| `/contact` | ❌ FR only | T11.1 |
| `/manifesto` | ✅ `/en/manifesto` | — |
| `/atlas` | ✅ `/en/atlas` | — |
| `/console` | ✅ `/en/console` | — |
| `/archive` | ❌ FR only | Basse |
| `/agence/about` | ❌ FR only | T11.1 |
| `/agence/careers` | ❌ FR only | T11.2 |
| `/agence/design-system` | ❌ FR only (interne) | Basse |
| `/agence/docs` | ❌ FR only (interne) | Basse |
| `/agence/governance` | ❌ FR only | T11.2 |
| `/agence/methode` | ❌ FR only | T11.1 |
| `/agence/trust-center` | ❌ FR only | T11.2 |
| `/bienvenue/audit` | ✅ `/en/bienvenue/audit` | — |
| `/bienvenue/contact` | ❌ FR only | T11.2 |
| `/bienvenue/livre-blanc` | ✅ `/en/bienvenue/livre-blanc` | — |
| `/bienvenue/newsletter` | ✅ `/en/bienvenue/newsletter` | — |
| `/cas` | ❌ FR only | T11.2 |
| `/cas/caserne` | ❌ FR only | T11.3 |
| `/cas/halcyon` | ❌ FR only | T11.3 |
| `/cas/northbound` | ❌ FR only | T11.3 |
| `/cas/plateau` | ❌ FR only | T11.3 |
| `/ecole` | ❌ FR only | Basse |
| `/equipe` | ❌ FR only | Basse |
| `/offres` | ❌ FR only | T11.1 |
| `/offres/audit-maturite-ia` | ❌ FR only | T11.2 |
| `/offres/conseil` | ❌ FR only | T11.2 |
| `/offres/revops` | ❌ FR only | T11.2 |
| `/offres/site-web-ia` | ❌ FR only | T11.2 |
| `/offres/site-web-ia-landing` | ❌ FR only | T11.2 |
| `/ressources` | ❌ FR only | T11.1 |
| `/ressources/academy` | ❌ FR only | T11.2 |
| `/ressources/changelog` | ❌ FR only | Basse |
| `/ressources/blog` | ❌ FR only | T11.2 |
| `/ressources/blog/brain-circuit` | ❌ FR only | T11.3 |
| `/ressources/cookbooks` | ❌ FR only | T11.2 |
| `/ressources/cookbooks/*` (3 articles) | ❌ FR only | T11.3 |
| `/ressources/livres-blancs` | ❌ FR only | T11.2 |
| `/ressources/livres-blancs/ai-act-readiness` | ❌ FR only | T11.3 |
| `/ressources/veille-ia` | ❌ FR only | T11.2 |
| `/secteurs` | ❌ FR only | T11.2 |
| `/secteurs/finance-compta` | ❌ FR only | T11.3 |
| `/secteurs/industrie` | ❌ FR only | T11.3 |
| `/secteurs/services-b2b` | ❌ FR only | T11.3 |
| `/solutions` | ❌ FR only | T11.1 |
| `/technologies` | ❌ FR only | T11.1 |
| Routes dynamiques `/offres/{slug}` (MDX) | ⚠️ `langFromPath` partiel, pas de route EN | T11.3 |
| Routes dynamiques `/cas/{slug}` (MDX) | ❌ FR hardcodé | T11.3 |
| Routes dynamiques `/secteurs/{slug}` (MDX) | ❌ FR hardcodé | T11.3 |
| Routes dynamiques `/ressources/blog/{slug}` | ❌ FR only | T11.3 |

---

*Audit produit en lecture-seule — aucune page modifiée.*
