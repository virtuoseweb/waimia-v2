# Matrice de rendu · Ressources + Archive

> Généré : 2026-05-17 · Mission 02 Session-03 Performance Static

## Principes de classification

| Mode | Définition dans ce projet | Quand l'utiliser |
|---|---|---|
| **SSG** | `prerender = true` — HTML baked au build, servi depuis CDN Vercel, TTL infini jusqu'au prochain deploy | Contenu immutable ou dont la fraîcheur est couplée au deploy (fichiers MDX dans le repo) |
| **ISR** | `prerender = false` + `isr.expiration` (actuellement 3600s) — Vercel Function cachée à TTL, régénérée au 1er hit après expiry | Contenu collection-driven ET publiable sans redeploy (CMS externe, base de données) |
| **SSR** | `prerender = false`, hors `isr.exclude` — rendu frais à chaque requête | Données live, formulaires avec mutations, webhooks |

**Règle d'or** : ISR n'apporte de la fraîcheur que si le contenu peut changer **sans redeploy**. Tant que le contenu est dans le repo (MDX), SSG + redeploy est strictement optimal (CDN, coût zéro, latence nulle).

---

## `/archive.astro`

| Champ | Valeur |
|---|---|
| **Route** | `/archive` |
| **Mode actuel** | SSG (`prerender = true`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | Contenu 100 % hardcodé (tableau `sections`). N'a aucune dépendance collection. Stable pendant des mois. ISR n'apporterait rien. |

---

## `/ressources` (hub landing)

| Champ | Valeur |
|---|---|
| **Route** | `/ressources` |
| **Mode actuel** | SSG (`prerender = true`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | Contenu hardcodé (arrays `tools`, `cookbookCards`, `caseCards`, `blogCards`). Pas de `getCollection`. Newsletter form géré via Astro Actions (compatible SSG). Aucune fraîcheur à gagner via ISR. |

---

## `/ressources/blog`

### Index

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/blog` |
| **Mode actuel** | SSG (`prerender = true`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | Liste construite à partir de `FIELD_NOTES` (import statique depuis `data/sitemap.ts`), pas via `getCollection`. Même si on basculait sur `getCollection`, les posts blog sont dans le repo → redeploy requis de toute façon. |

### Pages articles

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/blog/[...slug]` |
| **Mode actuel** | SSG (`prerender = true` + `getStaticPaths`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | Articles MDX immutables après publication. Corriger un typo = commit + deploy = rebuild. ISR apporterait une latence (Vercel Function cold start vs fichier CDN) sans aucun gain de fraîcheur. |

### Pages manuelles (stubs)

| Champ | Valeur |
|---|---|
| **Routes** | `/ressources/blog/brain-circuit` |
| **Mode recommandé** | **SSG** |
| **Justification** | Pages d'articles statiques hardcodées. Identique aux pages MDX. |

### RSS feed

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/blog/rss.xml` |
| **Mode actuel** | SSG (`prerender = true`) |
| **Mode recommandé** | **SSG** |
| **Justification** | Feed généré au build depuis la collection. Les lecteurs RSS tolerent une fraîcheur alignée sur le cycle de deploy (quelques fois par semaine max). |

---

## `/ressources/cookbooks`

### Index

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/cookbooks` |
| **Mode actuel** | SSG (`prerender = true`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | 6 cookbooks hardcodés dans l'array `cookbooks`. Aucune collection. Les cartes pointent vers `mailto:`, pas vers des pages détail dynamiques. |

### Pages détail

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/cookbooks/[...slug]` |
| **Mode actuel** | SSG (`prerender = true` + `getStaticPaths`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | MDX immutable. Même logique que blog articles. |

### Pages manuelles (stubs)

| Champ | Valeur |
|---|---|
| **Routes** | `/ressources/cookbooks/claude-cowork-rollout`, `/claude-skills-tutorial`, `/mcp-server-deploy` |
| **Mode recommandé** | **SSG** |

---

## `/ressources/livres-blancs`

### Index

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/livres-blancs` |
| **Mode actuel** | SSG (`prerender = true`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | 1 livre blanc + empty state hardcodés. Pas de `getCollection`. Livres blancs publiés à une cadence trimestrielle max → le redeploy suffit amplement. |

### Pages détail

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/livres-blancs/[...slug]` |
| **Mode actuel** | SSG (`prerender = true` + `getStaticPaths`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | MDX immutable. LeadMagnet template avec formulaire téléchargement = compatible SSG via Astro Actions. |

### Pages manuelles

| Champ | Valeur |
|---|---|
| **Routes** | `/ressources/livres-blancs/ai-act-readiness` |
| **Mode recommandé** | **SSG** |

---

## `/ressources/veille-ia`

### Index

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/veille-ia` |
| **Mode actuel** | SSG (`prerender = true`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | Page "coming soon" entièrement hardcodée. Aucun `getCollection`. Pas de contenu dynamique. |
| **Note future** | Quand la veille hebdo démarrera avec un CMS : **ISR TTL 3 600s** (1h) — briefs publiés le vendredi matin, fraîcheur intraday suffisante. |

### Pages détail

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/veille-ia/[...slug]` |
| **Mode actuel** | SSG (`prerender = true` + `getStaticPaths`) |
| **Mode recommandé** | **SSG** |
| **Justification** | Briefs MDX immutables après publication. Même logique que blog. |

### RSS feed

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/veille-ia/rss.xml` |
| **Mode recommandé** | **SSG** |

---

## `/ressources/outils`

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/outils/[...slug]` |
| **Mode actuel** | SSG (`prerender = true` + `getStaticPaths`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | Fiches outils MDX immutables. Mises à jour rare (trimestriel). |

---

## `/ressources/personas`

### Index

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/personas` |
| **Mode actuel** | SSG (`prerender = true` + `getCollection('personas')`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | 3 personas stables, définies une fois par campagne. Collection in-repo. Pas de freshness value en ISR. |

### Pages détail

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/personas/[slug]` |
| **Mode recommandé** | **SSG** |

---

## `/ressources/testimonials`

### Index

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/testimonials` |
| **Mode actuel** | SSG (`prerender = true` + `getCollection('testimonials')`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | Témoignages ajoutés manuellement après validation client (process long, délai semaines). Fraîcheur non critique entre deux deploys. |
| **Note future** | Si l'approbation client passe par un CMS : **ISR TTL 86 400s** (24h) — témoignages ont une shelf-life longue. |

### Pages détail

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/testimonials/[slug]` |
| **Mode recommandé** | **SSG** |

---

## `/ressources/field-notes`

### Index

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/field-notes` |
| **Mode actuel** | SSG (`prerender = true` + `getCollection('fieldNotes')`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | Index collection-driven mais contenu in-repo. "Au fil des engagements" = cadence mission (quelques semaines), déclenchée par commit. Un redeploy est toujours impliqué. |
| **Note future** | Si pipeline CI automatisé publie des notes de mission → **ISR TTL 3 600s** (1h). |

### Pages détail

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/field-notes/[slug]` |
| **Mode recommandé** | **SSG** |

---

## `/ressources/changelog`

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/changelog` |
| **Mode actuel** | SSG (`prerender = true`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | 8 entrées hardcodées dans un array. Mis à jour par les devs directement dans le fichier. Rythme mensuel ou moins. |

---

## `/ressources/academy`

| Champ | Valeur |
|---|---|
| **Route** | `/ressources/academy` |
| **Mode actuel** | SSG (`prerender = true`) |
| **Mode recommandé** | **SSG** |
| **TTL** | — |
| **Justification** | Formulaire statique (12 questions hardcodées). Mutation via Astro Actions compatible SSG. Les résultats du diagnostic sont envoyés par email côté serveur (API route séparée). |
| **Attention** | Ne jamais passer en ISR/SSR : les Astro Actions sur formulaires SSG fonctionnent car l'action est résolue par une API route distincte, pas par la page elle-même. |

---

## Taxonomies dynamiques

Ces trois pages sont les **seules candidates légitimes à l'ISR** dans l'architecture actuelle, car elles agrègent 5 collections simultanément. Un seul article ajouté invalide potentiellement des dizaines de pages de taxonomie.

### `/ressources/silo/[...slug]`

| Champ | Valeur |
|---|---|
| **Mode actuel** | SSG (`prerender = true` + `getStaticPaths` sur `CLUSTERS`) |
| **Mode recommandé** | **SSG → ISR conditionnel** |
| **TTL si ISR** | **3 600s** (1h) |
| **Condition de bascule** | Quand le contenu est publié via CMS sans redeploy, OU quand le build dépasse 3 min à cause de la recompilation des clusters |
| **Justification ISR** | Agrège `blog + cookbooks + livresBlancs + veilleIA + cases` par `cluster`. Ajouter 1 article dans une collection invalide tous les silos du cluster correspondant. ISR évite de rebuilder toute la matrice à chaque publication. |
| **Implémentation future** | Retirer `getStaticPaths`, passer `prerender = false`, ajouter guard `if (!CLUSTERS[slug]) return Astro.redirect('/ressources', 301)` |

### `/ressources/categorie/[...slug]`

| Champ | Valeur |
|---|---|
| **Mode actuel** | SSG (`prerender = true` + `getStaticPaths` sur `CATEGORIES`) |
| **Mode recommandé** | **SSG → ISR conditionnel** |
| **TTL si ISR** | **3 600s** (1h) |
| **Condition de bascule** | Identique à silo |
| **Justification ISR** | Même pattern que silo mais par catégorie. Catégories définies dans `data/taxonomies.ts` (CATEGORIES constant), bornées et stables — évite les 404 sur slugs inconnus même en ISR. |
| **Implémentation future** | Retirer `getStaticPaths`, passer `prerender = false`, ajouter guard `if (!CATEGORIES[slug]) return Astro.redirect('/ressources', 301)` |

### `/ressources/tag/[...slug]`

| Champ | Valeur |
|---|---|
| **Mode actuel** | SSG (`prerender = true` + `getStaticPaths` via dédoublonnage des tags dans les 5 collections) |
| **Mode recommandé** | **SSG → ISR conditionnel** |
| **TTL si ISR** | **3 600s** (1h) |
| **Condition de bascule** | Identique + quand le nombre de tags dépasse ~50 (génération SSG trop lente) |
| **Justification ISR** | Tags les plus dynamiques : un nouvel article peut introduire un nouveau tag jamais vu → SSG ne le découvre qu'au prochain build. Avec ISR, toute URL `/ressources/tag/<nouveau-tag>` génère la page au 1er hit. Comportement gracieux : tag inexistant → liste vide, pas de 404. |
| **Avantage ISR spécifique** | C'est le **seul cas** où ISR offre quelque chose qu'SSG ne peut pas faire : servir des tags créés dynamiquement sans redeploy. |

---

## Résumé exécutif

| Mode | Routes | Count |
|---|---|---|
| **SSG** ✅ (actuel + cible) | Tout le reste | ~25 routes |
| **ISR** ⏳ (conditionnel, non activé) | `silo/[...slug]`, `categorie/[...slug]`, `tag/[...slug]` | 3 routes |
| **SSR** ❌ | Aucune dans `/ressources/**` ni `/archive` | 0 |

### Pourquoi ISR n'est pas activé aujourd'hui

1. **Tout le contenu est dans le repo** (MDX + arrays hardcodés). Publier = committer = redeployer. SSG + CDN est strictement optimal dans ce cas.
2. **ISR = Vercel Function cold start** vs **SSG = fichier CDN**. ISR est plus lent et plus coûteux pour du contenu qui ne change qu'au deploy.
3. **Aucun CMS externe**, aucune base de données en lecture pour les routes ressources.

### Conditions pour activer l'ISR sur les 3 taxonomies

- [ ] Adoption d'un headless CMS (Sanity, Contentful, Notion API…) OU d'un pipeline CI qui publie du contenu sans commit humain
- [ ] Build time > 3 min sur ces pages ou count tags > 50
- [ ] Ajout d'un `ISR_BYPASS_TOKEN` en Vercel env vars (déjà prévu dans `astro.config.mjs`)

### Ce qui NE doit PAS devenir ISR

- Pages avec forms Astro Actions (`/ressources/academy`, `/ressources`) — les actions sont résolues côté serveur via des API routes séparées, pas via la page elle-même.
- Pages MDX d'articles individuels — immutables par définition, ISR = coût sans bénéfice.
- Pages hardcodées (changelog, index cookbooks…) — aucune collection à rafraîchir.
