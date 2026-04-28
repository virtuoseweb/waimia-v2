# Astro 6 + @astrojs/vercel@10 · POST handlers exclus du bundle SSR (monorepo pnpm)

> **Brouillon prêt à coller dans une issue GitHub upstream Astro.**
>
> Repo de l'issue : https://github.com/withastro/astro/issues/new/choose (template "Bug report")
>
> Contexte du brouillon : capturé empiriquement dans `waimia-v2` (commits `e1bc1a9` POST=404 vs `edb2592` ALL=200).

---

## Title

`@astrojs/vercel@10` excludes `POST` handlers from SSR bundle on monorepo (pnpm)

## Astro Info

```
Astro                        v6.1.9
@astrojs/vercel              v10.0.5
@astrojs/react               v5.0.4
@astrojs/mdx                 v5.0.4
@astrojs/sitemap             v3.7.2
Node                         24.x (Vercel) / 25 (local)
Package manager              pnpm@9.15.0
Output                       'server'
```

## Description

In a monorepo (`apps/web` + workspace root, pnpm) deployed to Vercel with `@astrojs/vercel@10` adapter and `output: 'server'`, **API route files using `export const POST = async (...)` or `export async function POST() {}` are silently excluded from the SSR bundle (`entry.mjs`)**, resulting in 404 at runtime. The build itself succeeds without warnings.

Routes using `export const GET` or `export const ALL` are correctly included in the bundle.

The issue is **specific to the `POST` keyword**, regardless of the handler signature (const arrow vs function declaration, with or without `: APIRoute` typing, with or without imports).

## Reproduction

### Minimal repro

Create a fresh Astro 6 project with `@astrojs/vercel@10` adapter, `output: 'server'`, deployed to Vercel inside an `apps/web` subdirectory of a pnpm monorepo (`rootDirectory: apps/web` in Vercel project settings).

```ts
// src/pages/api/test-get.ts
export const prerender = false;
export const GET = async () => Response.json({ ok: true });
```

```ts
// src/pages/api/test-post.ts
export const prerender = false;
export const POST = async () => Response.json({ ok: true });
```

```ts
// src/pages/api/test-all.ts
export const prerender = false;
export const ALL = async ({ request }) => Response.json({ ok: true, method: request.method });
```

Deploy and test :

```bash
curl https://example.vercel.app/api/test-get   # 200 OK ✅
curl https://example.vercel.app/api/test-post  # 404 ❌
curl https://example.vercel.app/api/test-all   # 200 OK ✅
```

Runtime log Vercel for `/api/test-post` :

```
[WARN] [router] No matching route for /api/test-post
```

### Full repro repository

`https://github.com/virtuoseweb/waimia-v2`

Specific commits demonstrating the issue :

| Commit | Test | Result |
|--------|------|--------|
| `e1bc1a9` | `export const POST: APIRoute = async ({ request })` | **404** |
| `825b4f2` | `export async function POST() {}` (function declaration) | **404** |
| `edb2592` | `export const ALL: APIRoute = async ({ request })` | **200** |
| `4327d14` | Workaround: 5 routes converted from POST to ALL+method dispatch | **200** all routes |

### Validations testées (failed hypotheses)

The following hypotheses were tested and **invalidated** :

- ❌ `outputDirectory` in `vercel.json` overriding adapter
- ❌ Catch-all `[...slug].astro` route shadowing
- ❌ `buildCommand` `cwd` issues
- ❌ Static vs dynamic imports of Resend SDK
- ❌ Static vs dynamic imports of `@react-email/components`
- ❌ `vite.ssr.noExternal` configuration
- ❌ React Email components in the import graph

The bundling exclusion is triggered by the `POST` export name itself, not by anything in the handler body.

## Workaround

Use `export const ALL` with method dispatch :

```ts
import type { APIRoute } from "astro";

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }
  // ... POST logic
};
```

Functionally equivalent to `export const POST`, with correct HTTP semantics (405 on other methods).

## Expected behavior

`export const POST = async () => ...` should be included in the SSR bundle and route correctly at runtime, identical to `GET` and `ALL` exports.

## Additional context

- The issue may be specific to the **monorepo + pnpm + Vercel adapter combination**. Single-project deployments may work correctly.
- Build cache behavior : the issue persists even on first build (no cache restore involved).
- Documentation reference internally : `docs/known-issues.md` in the repro repository.

---

## Comment poster cette issue

1. Ouvrir https://github.com/withastro/astro/issues/new?template=bug_report.yml
2. Coller les sections ci-dessus dans les champs correspondants
3. Sélectionner labels : `adapter: vercel`, `pkg: astro`, `bug`
4. Référencer le repo public `virtuoseweb/waimia-v2` dans la section "Reproduction"

Une fois l'issue créée, cross-référencer dans :
- `docs/known-issues.md` (ajouter le lien GitHub)
- Commit message du futur revert ALL → POST direct
