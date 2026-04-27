# 11 · Pattern de redirections URL · zéro perte SEO sur les renames

> Quand tu renommes une URL existante, **Google a déjà indexé l'ancienne**. Sans 301 redirect, tu perds le ranking acquis et tu génères des erreurs 404 dans Search Console. Ce document fixe le pattern unique pour gérer ça proprement.

## TL;DR

Tu veux renommer `/offres/site-web-ia` en `/offres/site-ia-natif` ? Avant de pousser le rename :

1. **Édite `astro.config.mjs`** dans la clé `redirects` :
   ```js
   redirects: {
     '/offres/site-web-ia': '/offres/site-ia-natif',
   }
   ```
2. **Renomme le fichier** : `src/pages/offres/site-web-ia.astro` → `src/pages/offres/site-ia-natif.astro`
3. **Update tous les liens** internes pointant vers l'ancienne URL (`grep -rn "site-web-ia" src/`)
4. **Push** → Vercel redeploy → l'ancien path renvoie un 301 vers le nouveau

## Pourquoi `astro.config.mjs` plutôt que `vercel.json`

| Critère                           | `astro.config.mjs` ✅ choisi | `vercel.json`                                |
| --------------------------------- | ---------------------------- | -------------------------------------------- |
| Portable si on change d'hébergeur | Oui                          | Non (Vercel-only)                            |
| Type-checké par Astro             | Oui                          | Non (JSON brut)                              |
| Fonctionne en `npm run dev`       | Oui                          | Non                                          |
| Single source of truth            | Oui                          | Non (split avec config Astro)                |
| Performance                       | Astro middleware → 1 hop     | Vercel edge → 0 hop (légèrement plus rapide) |

**Trade-off** : on perd ~5 ms par redirect vs Vercel edge. Acceptable pour un site agence (les redirects sont rares + ranking SEO préservé).

Si on a un jour un cas où le delta de 5 ms est critique (page haute fréquence avec millions de hits/jour), on pourra migrer vers `vercel.json` à ce moment-là — pas avant.

## Syntaxe

### 1 · Redirect simple (308 par défaut, permanent)

```js
redirects: {
  '/old-path': '/new-path',
}
```

Astro émet un **HTTP 308** (Permanent Redirect, conserve la méthode HTTP). Google traite ça comme équivalent à 301.

### 2 · Redirect avec status custom (301, 302, 307, 308)

```js
redirects: {
  '/temporary-test': { status: 302, destination: '/main-feature' },
  '/old-blog-slug': { status: 301, destination: '/ressources/blog/new-slug' },
}
```

| Status                            | Quand l'utiliser                                                       |
| --------------------------------- | ---------------------------------------------------------------------- |
| **301 Permanent**                 | Standard pour rename définitif (Google transfère le ranking)           |
| **302 Temporary**                 | Tests A/B, maintenance temporaire (Google ne transfère pas le ranking) |
| **307 Temporary (préserve POST)** | Redirect temporaire qui doit garder POST (rare)                        |
| **308 Permanent (préserve POST)** | Comme 301 mais préserve la méthode HTTP. Choix par défaut Astro.       |

### 3 · Redirect avec params dynamiques

```js
redirects: {
  '/blog/[slug]': '/ressources/blog/[slug]',  // Conserve le slug
  '/livre-blanc/[name]': { status: 301, destination: '/ressources/livres-blancs/[name]' },
}
```

Astro substitue `[slug]` côté destination automatiquement.

### 4 · Redirect d'une page externe

```js
redirects: {
  '/docs': 'https://docs.waimia.com',  // URL absolue
}
```

## Workflow type · checklist avant rename

- [ ] **Avant de modifier le fichier** : ajouter la ligne `redirects` dans `astro.config.mjs`
- [ ] **Renommer le fichier** Astro (`src/pages/old-path.astro` → `src/pages/new-path.astro`)
- [ ] **Grep tous les liens internes** : `grep -rn "old-path" src/`
  - Update les hrefs Header, Footer, breadcrumbs, CTAs, sitemap.ts (`PRIMARY_NAV`)
- [ ] **Vérifier le rendu** : `npm run build` puis `npm run preview` localement
- [ ] **Tester le redirect** : `curl -I http://localhost:4321/old-path` doit renvoyer 308 + `location: /new-path`
- [ ] **Push** → Vercel redeploy
- [ ] **Vérifier en prod** : `curl -I https://waimia.com/old-path` doit renvoyer 308 + `location: https://waimia.com/new-path`
- [ ] **Search Console** : Inspection URL → "Demander une réindexation" sur la nouvelle URL pour accélérer la mise à jour

## Cas particuliers

### Page supprimée (pas remplacée)

Ne pas faire un redirect vers la home (signal SEO confus = Google interprète "page supprimée"). Préférer :

1. Laisser la page renvoyer **404** (Astro le fait par défaut quand le fichier est supprimé)
2. **OU** rediriger vers la page parente la plus proche (`/offres/foo` supprimé → redirect vers `/offres`)

### Plusieurs anciennes URLs vers une nouvelle

```js
redirects: {
  '/offres/site-web': '/offres/site-web-ia',
  '/offres/site-vitrine': '/offres/site-web-ia',
  '/offres/landing-page': '/offres/site-web-ia',
}
```

### Migration massive (>20 redirects)

Pour les rebranding majeurs, externalise dans un fichier dédié :

```js
// astro.config.mjs
import { redirects } from "./src/config/redirects.js";
export default defineConfig({
  redirects,
  // ...
});
```

```js
// src/config/redirects.js
export const redirects = {
  "/old-1": "/new-1",
  "/old-2": "/new-2",
  // ...
};
```

## Anti-patterns à éviter

❌ **Modifier le fichier de page sans déclarer le redirect** : Google va trouver un 404 sur l'ancienne URL et dégrader le ranking
❌ **Redirect vers la home** sur des contenus supprimés : signal SEO confus
❌ **Chaîner les redirects** (`/a` → `/b` → `/c`) : performance dégradée + Google peut abandonner
❌ **Redirect sur des URLs non-indexées** : inutile, ça ajoute du bruit dans la config
❌ **Mélanger `vercel.json` et `astro.config.mjs`** : un seul fichier de vérité (= ce doc choisit `astro.config.mjs`)

## Validation Search Console

Après chaque rename + redeploy :

1. `search.google.com/search-console` → propriété `waimia.com`
2. Inspection URL → coller l'**ancienne** URL → vérifier le statut "Page redirigée"
3. Inspection URL → coller la **nouvelle** URL → "Demander l'indexation"
4. Couverture → `Pages` → vérifier qu'aucune erreur 404 n'apparaît sur les anciennes URLs

## Pourquoi pas `<meta http-equiv="refresh">` ?

Cette technique (redirect côté HTML) :

- Est **plus lente** (browser doit parser le HTML avant de rediriger)
- Est **moins respectée** par Google (signaux SEO partiels seulement)
- Casse le bouton "back" du navigateur

Toujours préférer un vrai 308/301 HTTP via `astro.config.mjs`.
