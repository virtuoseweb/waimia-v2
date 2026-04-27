# Known issues · bugs ouverts trackés

Ce document liste les bugs identifiés mais non résolus, avec les hypothèses testées et le contexte pour reprendre l'investigation.

---

## 🟢 #1 · 404 sur API routes POST · CAUSE TROUVÉE + WORKAROUND APPLIQUÉ

**Status** · ✅ **Workaround actif · 6/6 forms fonctionnels** (commit `4327d14`)
**Cause root** · Bug `@astrojs/vercel@10.0.5` adapter monorepo : exclut spécifiquement les exports `POST` du bundle SSR
**Solution** · Workaround `export const ALL` + dispatch méthode interne
**Impact résiduel** · Issue GitHub Astro à ouvrir pour fix upstream

### Validation empirique (5 endpoints diag)

| Export pattern | Bundle inclus ? | Status prod |
| -------------- | :-------------: | :---------: |
| `export const GET = ()` | ✅ | 200 |
| `export const GET = async ({ request }) =>` | ✅ | 200 |
| `export const POST: APIRoute = async (...)` | ❌ | 404 |
| `export async function POST() {...}` | ❌ | 404 |
| **`export const ALL = async (...)`** | **✅** | **200** |

→ Bug **spécifique au mot-clé `POST`**, pas aux imports ni à la signature async.

### Workaround appliqué (commit `4327d14`)

5 forms (`contact`, `newsletter`, `lead-magnet`, `devis`, `academy`) passés en :

```ts
export const ALL: APIRoute = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }
  // ... logique POST identique à avant
};
```

Comportement HTTP correct : 405 `Method Not Allowed` sur GET/PUT/DELETE, logique POST inchangée.

### Hypothèses préalablement écartées (~15 commits, 7+ deploys)

| Tentative | Commit | Conclusion |
|-----------|--------|------------|
| `outputDirectory` vercel.json | `46b41f1` | Pas la cause |
| Catch-all `[...slug].astro` shadowe | `aca070e` | Invalidé empiriquement |
| `buildCommand` cwd issue | `349cc46` | Pas la cause |
| Import dynamique de Resend SDK | `f795896` | Pas la cause |
| `vite.ssr.noExternal` resend + react-email | `761e6be` | Pas la cause |
| Refactor lib/resend en `fetch()` direct | `b958316` | Pas la cause (mais code plus propre) |
| Imports dynamiques emails dans /api/*.ts | `9fcb6a2` | Pas la cause |
| Refactor emails React → HTML strings | `485317c` | Pas la cause (mais 0 React Email = bonus) |

### Reverse en POST direct (futur)

Quand le bug `@astrojs/vercel` sera fixé upstream, reverser en 1 ligne par fichier :

```ts
// Avant (workaround)
export const ALL: APIRoute = async ({ request }) => {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  // ...
};

// Après (POST direct)
export const POST: APIRoute = async ({ request }) => {
  // ...
};
```

### Issue GitHub Astro à ouvrir

Repro minimal :
1. Astro 6 + `@astrojs/vercel@10.0.5` + monorepo pnpm + `output: 'server'`
2. Créer `src/pages/api/test.ts` avec `export const POST = async () => Response.json({ok:true})`
3. Build + deploy Vercel : route 404, runtime log `[router] No matching route`
4. Idem avec `export const ALL` → route 200

Lien repo de référence : https://github.com/virtuoseweb/waimia-v2 commits `e1bc1a9` (POST 404) vs `edb2592` (ALL 200).

### Symptômes

- `/api/healthcheck` (sans imports externes) → ✅ **200 JSON**
- `/api/contact`, `/api/newsletter`, etc. (avec imports lib/resend + emails React) → ❌ **404**
- Runtime log Vercel : `[WARN] [router] No matching route` quand on hit /api/contact
- Build NE plante PAS — juste les routes invisibles dans le bundle

### Cause racine probable

L'import `import { Resend } from "resend"` ou `import { Tailwind, Img, ... } from "@react-email/components"` provoque l'**exclusion silencieuse** des fichiers qui les transitent du bundle SSR Astro émis par Vite/Rolldown.

Hypothèse de fond : `resend@6.12.2` ou `@react-email/components@1.0.12` ont des exports ESM/CJS que Vite/Rolldown 1.0.0-rc.17 ne sait pas résoudre proprement en bundle SSR sur Vercel monorepo.

Cela ne plantait pas avant le pivot monorepo (deploy commit `6575282` avait /api/contact qui répondait), mais depuis la bascule la résolution a changé.

### Hypothèses testées (toutes invalidées)

| Tentative                                                | Commit       | Résultat                          |
| -------------------------------------------------------- | ------------ | --------------------------------- |
| outputDirectory `.vercel/output` dans vercel.json        | `46b41f1` etc. | 404 persiste (4 itérations)       |
| Catch-all `[...slug].astro` shadowe les API SSR          | `aca070e`    | API 404 même catch-all désactivé  |
| buildCommand `cd ../..` cwd issue                        | `349cc46`    | 404 persiste                      |
| Import dynamique de Resend SDK                           | `f795896`    | 404 persiste                      |
| `vite.ssr.noExternal` resend + @react-email              | `761e6be`    | 404 persiste                      |

### Évidence empirique discriminante

```
/api/healthcheck (sans imports)        → 200 JSON  ✅
/api/diag-resend (import lib/resend)   → 200 HTML  ⚠ catch-all (route absente bundle)
/api/contact, etc.                     → 404       ❌
```

→ **L'API discovery Astro fonctionne**, le routing SSR fonctionne, mais l'`entry.mjs` Vercel ne contient pas les routes qui importent ces packages.

### Pistes pour la suite

1. **Reproduce local** · faire un build local qui marche (downgrade Vite 8 RC → 7 stable + Tailwind 4 → 3) pour pouvoir inspecter `dist/server/entry.mjs` et confirmer l'exclusion
2. **Downgrade `resend`** à v5.x ou v4.x pour voir si le format export change
3. **Réécrire `lib/resend.ts` sans le SDK** : utiliser `fetch('https://api.resend.com/emails', ...)` directement avec `Authorization: Bearer ${apiKey}`. Évite tout l'enjeu d'import SDK.
4. **Réécrire les emails sans React Email** : générer du HTML inline via template literals. Moins joli mais 100% fiable.
5. **Tester avec un autre adapter** : `@astrojs/node` standalone pour exclure un bug spécifique `@astrojs/vercel` + monorepo.
6. **Issue upstream Astro** : ouvrir un report avec repro minimal si confirmé bug Astro 6 + monorepo pnpm.

### Solution courte terme recommandée

**Option 3** (réécrire sans SDK Resend) est la plus pragmatique. Le SDK Resend n'apporte qu'une fonction `emails.send()` qu'on peut faire en `fetch()` direct. Ça :
- Élimine l'import problématique
- Garde React Email pour les templates (déjà importés via @react-email/render qui est plus simple)
- Reste compatible avec toute la logique existante

Estimation : ~30 minutes de refactor. À planifier sans urgence.

### Workaround actuel

- Forms publics waimia.com pointent encore vers `mailto:contact@virtuoseweb.fr`
- Pas de form fonctionnel via /api/* — confirmation visuelle / email automatique non disponibles
- Les pages elles-mêmes (Welcome, LeadMagnet, ConversionFunnel) rendent OK, juste leur action POST échoue

### Liens d'investigation

- Build logs derniers deploys : https://vercel.com/simonberos-projects/waimia-v2/deployments
- Astro SSR docs : https://docs.astro.build/en/guides/server-side-rendering/
- Vite SSR externals : https://vite.dev/guide/ssr.html#ssr-externals

---

## 🟡 #2 · Build local Tailwind v4 + Vite 8 + Rolldown rc.17

**Status** · Ouvert · Impact dev local seulement (Vercel build marche grâce à Node 24 vs Node 25 local)
**Erreur** · `[@tailwindcss/vite:generate:build] Missing field tsconfigPaths on BindingViteResolvePluginConfig.resolveOptions`

### Cause

Bug de la combinaison de versions :
- Vite 8.0.10 (release candidate)
- Rolldown 1.0.0-rc.17 (release candidate)
- Tailwind 4.2.4
- Node.js 25 local (Vercel utilise Node 24)

### Workaround

- En local : ne pas faire `pnpm build:web` directement, laisser Vercel faire
- Pour valider le code : `pnpm typecheck` (qui passe 0 erreur)

### Solution future

Quand Vite 8 sortira en stable + Rolldown 1.0 stable, le bug devrait être résolu. Suivi : https://github.com/vitejs/rolldown-vite

---

## 🟡 #3 · Import des emails React émet des warnings TS inutilisés

**Status** · Ouvert · Impact zéro (warnings, pas erreurs)
**Origine** · Astro check / TypeScript

### Symptômes

```
src/lib/emails/_layout.tsx(12,3): warning ts(6133): 'Img' is declared but its value is never read.
src/lib/emails/ContactConfirmation.tsx(7,1): warning ts(6133): 'React' is declared but its value is never read.
```

### Cause

JSX runtime React 17+ automatique (`jsxImportSource: "react"`) ne nécessite plus l'import explicite de React. Les imports legacy traînent.

### Solution future

Cleanup quand on touchera ces fichiers : retirer les imports `import * as React from "react"` et `import { Img, Heading } from "@react-email/components"` quand non utilisés.
