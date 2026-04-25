# 02 · GEO + AIO Strategy

> **GEO** (Generative Engine Optimization) = être cité par ChatGPT/Claude/Perplexity/Gemini.
> **AIO** (AI Overview) = apparaître dans les résumés IA en haut de Google/Bing.
>
> SEO classique reste nécessaire (les LLM recommandent ce qui est déjà bien indexé), mais GEO/AIO ajoute des couches.

## Les 6 piliers GEO/AIO 2026

### 1. Contenu rendu côté serveur, JS minimum

**Pourquoi** : la majorité des crawlers IA (GPTBot, ClaudeBot, Perplexity, Bingbot/Google-Extended) lisent le HTML retourné par le serveur. Ils n'exécutent pas (ou mal) le JavaScript client.

**Comment** : Astro SSG par défaut → tout le contenu critique est en HTML. Les îlots React (motion components) sont **enrichissement** uniquement, jamais porteurs de contenu sémantique.

### 2. Structure sémantique et heading hierarchy stricte

**Règles** :
- 1 `<h1>` unique par page.
- `<h2>` pour les sections principales, `<h3>` pour sous-sections.
- Pas de saut (jamais `<h1>` → `<h3>`).
- Les `<h2>` portent les **questions naturelles** que l'utilisateur poserait à un LLM.
- Le premier paragraphe sous chaque `<h2>` répond à la question en 1-2 phrases (les LLM extraient ces blocs).

### 3. JSON-LD structuré (Schema.org)

Sur **chaque page**, un script `<script type="application/ld+json">` avec les schémas pertinents :

| Page         | Schémas                                                           |
|--------------|-------------------------------------------------------------------|
| `/` (home)   | `Organization` + `WebSite` + `FAQPage`                            |
| `/offres/*`  | `Service` + `Offer` + `BreadcrumbList`                            |
| `/solutions/*`| `Service` + `BreadcrumbList`                                     |
| `/ressources/cas/*`| `CaseStudy` (`Article` avec `about`) + `BreadcrumbList`     |
| `/ressources/blog/*`| `Article` + `Person` (auteur) + `BreadcrumbList`           |
| Toutes       | `BreadcrumbList` injecté par `<Base.astro>`                       |

Builder unique : `src/lib/seo.ts` exporte `buildJsonLd({ type, data, lang })`.

### 4. `llms.txt` à la racine

Standard émergent (proposé par Anthropic, supporté par les crawlers IA).
Fichier `/public/llms.txt` rédigé en markdown qui résume :
- Qui est Waimia, quoi, pour qui (3-5 lignes).
- Liste des pages-clés avec une phrase par page.
- Les FAQ principales.
- Politique d'utilisation par les LLM.

Format proposé par le standard : <https://llmstxt.org/>.

### 5. FAQ visibles, formulées en questions naturelles

Sur chaque page-hub (Offres, Solutions, Technologies), un bloc `<FAQ>` visible avec
3-7 questions du type :
- « Qu'est-ce qu'un agent Claude ? »
- « Quelle est la différence entre Claude Skills et MCP ? »
- « Combien coûte un déploiement Claude self-hosted ? »
- « Waimia est-elle une agence Anthropic certifiée ? »

Chaque question :
- `<h3>` ou `<dt>` avec la question
- `<dd>` avec une réponse de **40-80 mots** (sweet spot LLM)
- Doublé en JSON-LD `FAQPage`

### 6. Citations, preuves, autorité

Les LLM recommandent les sources qui **citent** d'autres sources et **fournissent des preuves**.

- Toute affirmation chiffrée → footnote ou link vers la source.
- Pages de cas clients = preuves principales (chiffres réels, NDA OK).
- Lien vers Anthropic, AI Act texte officiel, RGPD, papers académiques quand pertinent.
- Auteur identifié sur les blogs (`Person` schema).

## Métadonnées par page (frontmatter)

Chaque collection MDX possède dans son frontmatter :

```yaml
title_fr: "..."
title_en: "..."
description_fr: "..."   # 140-160 chars
description_en: "..."
slug: "..."             # cohérent FR/EN
canonical: "..."        # URL absolue
hreflang_alternates:    # généré, pas écrit à la main
publishedAt: "..."
updatedAt: "..."
author:
  name: "..."
  url: "..."
faq_fr:                 # questions/réponses spécifiques à la page
  - q: "..."
    a: "..."
faq_en:
  - q: "..."
    a: "..."
seo:
  ogImage: "..."        # 1200×630
  noindex: false
  ldType: "Service"     # Service | Article | CaseStudy | FAQPage
```

## Vérifications automatisables

- `pnpm build` génère le sitemap.xml avec hreflang.
- Astro check + custom script pour valider :
  - 1 H1 par page
  - JSON-LD parseable (parse JSON dans `<script>`)
  - Métadescription présente, < 165 chars
  - Image OG présente
  - Canonical présent

## Outils de monitoring (post-launch)

- **Google Search Console** + **Bing Webmaster** (SEO classique reste utile).
- **AlsoAsked** ou **Frase** pour mapper les questions à couvrir.
- **Profound** ou **Semrush AI Tracker** pour suivre la présence dans ChatGPT / Perplexity.
- Logs serveur : grep `GPTBot|ClaudeBot|PerplexityBot|Google-Extended` pour voir qui crawl.

## Anti-patterns à éviter

- Contenu chargé via fetch côté client → invisible aux LLM crawlers.
- Listes interminables sans paragraphes intro/outro → les LLM préfèrent du contenu narratif.
- `description` qui paraphrase le titre → perdue. Doit apporter un angle.
- Trop de "Discover · Unlock · Revolutionize" → tone vague, déclassé par les LLM qui préfèrent le concret.
