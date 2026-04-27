# Known issues · bugs ouverts trackés

Ce document liste les bugs identifiés mais non résolus, avec les hypothèses testées et le contexte pour reprendre l'investigation.

---

## 🔴 #1 · 404 sur toutes les API routes Astro `/api/*` en prod

**Status** · Ouvert · Impact moyen (forms /contact, /newsletter, /lead-magnet, /devis, /academy non fonctionnels en prod)
**Découvert** · 2026-04-27 post-bascule monorepo
**Build local** · Healthcheck OK, Resend SDK fonctionne en dev (port 4321)
**Build Vercel** · Build OK, mais `entry.mjs` exclut silencieusement les API routes qui importent `lib/resend` ou `@react-email/components`

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
