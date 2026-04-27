# Ajouter une nouvelle app au monorepo

Procédure pas-à-pas validée : 15-30 min selon la stack choisie.

## Étape 1 · Décider stack + sous-domaine

| Question                              | Choix typique                              |
| ------------------------------------- | ------------------------------------------ |
| Quel sous-domaine ?                   | `app.waimia.com`, `blog.waimia.com`, etc.  |
| SSG, SSR ou hybride ?                 | Astro 6 SSR si content + form, Next 16 si app interactive lourde |
| Package manager ?                     | **pnpm** (par défaut), yarn 4 berry uniquement si l'upstream l'exige |
| TypeScript strict ?                   | Toujours · extends `tsconfig.base.json` racine |

## Étape 2 · Créer le dossier app

```bash
cd /Users/simonberos/waimia-site/site
mkdir -p apps/<nom>
cd apps/<nom>
```

## Étape 3 · Initialiser

### Option A · Astro 6 (recommandé pour content + form)

```bash
pnpm create astro@latest . -- --template minimal --typescript strict
```

### Option B · Next 16 (recommandé pour app interactive lourde)

```bash
pnpm create next-app@latest . --ts --app --tailwind --eslint
```

### Option C · Cal-style (yarn berry isolé)

Documenté à part dans `apps/cal/README.md` upstream. À éviter sauf si convention upstream l'impose.

## Étape 4 · Adapter le `package.json` au monorepo

```json
{
  "name": "waimia-<nom>",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "typecheck": "astro check",
    "lint": "echo \"lint TBD\"",
    "format": "prettier --write \"src/**/*.{astro,ts,tsx,js,jsx,md,json}\"",
    "clean": "rm -rf dist .astro .vercel .turbo"
  }
}
```

Le préfixe `waimia-*` rend le filtre pnpm explicite : `pnpm --filter waimia-<nom> dev`.

## Étape 5 · Inclure dans le workspace pnpm

`pnpm-workspace.yaml` est déjà configuré pour matcher `apps/*` via le glob (à vérifier — au moment du dernier audit, il était limité à `apps/web`). Si nécessaire :

```yaml
packages:
  - "apps/*"            # toutes les apps automatiquement
  - "packages/*"
```

## Étape 6 · Exposer en root scripts

Ajouter dans `package.json` racine :

```json
{
  "scripts": {
    "dev:<nom>": "pnpm --filter waimia-<nom> dev",
    "build:<nom>": "pnpm --filter waimia-<nom> build"
  }
}
```

## Étape 7 · Ajouter au `turbo.json` (si besoin spécifique)

Pas nécessaire si la nouvelle app suit les conventions standards (build / dev / lint / typecheck / test). Turbo détecte automatiquement.

## Étape 8 · Tester en local

```bash
pnpm install
pnpm dev:<nom>
```

L'app doit démarrer sur un port libre (Astro = 4321, 4322... · Next = 3000, 3001...).

Lancer plusieurs apps en parallèle :

```bash
pnpm dev    # turbo run dev --parallel · toutes les apps
```

## Étape 9 · Créer le projet Vercel

Voir [deploy.md](./deploy.md) section « Créer un nouveau projet Vercel ».

Points clés :

1. Dans le dashboard Vercel : New Project → Import du même repo GitHub
2. Settings → General → Root Directory = `apps/<nom>`
3. Framework auto-détecté
4. Variables d'environnement (cf `.env.example` de l'app)
5. Domains → ajouter `<nom>.waimia.com`

## Étape 10 · DNS

Dans le registrar du domaine `waimia.com` (Hostinger / OVH / Gandi) :

```
<nom>.waimia.com  CNAME  cname.vercel-dns.com.
```

Propagation TTL ~1h en moyenne.

## Étape 11 · Documenter dans `docs/architecture.md`

Ajouter une ligne dans le tableau « Évolutions prévues » avec status mis à jour (`✅ prod`).

## Checklist finale

- [ ] `apps/<nom>/package.json` avec name `waimia-<nom>`
- [ ] `apps/<nom>/tsconfig.json` extends approprié
- [ ] `apps/<nom>/.env.example` documente les vars d'env
- [ ] `apps/<nom>/README.md` présentation 30s + comment lancer
- [ ] `apps/<nom>/tests/` au moins 1 test smoke
- [ ] Root scripts `dev:<nom>` + `build:<nom>` ajoutés
- [ ] Projet Vercel créé avec rootDirectory `apps/<nom>`
- [ ] DNS sous-domaine pointé
- [ ] `docs/architecture.md` mis à jour

## Anti-patterns à éviter

- ❌ Un même `apps/<nom>` qui contient 2 apps logiques (split en 2 dossiers).
- ❌ Re-créer `node_modules` racine en npm (utiliser pnpm uniquement).
- ❌ Importer du code de `apps/web` dans `apps/<nom>` (passer par `packages/lib`).
- ❌ Hardcoder l'URL d'une autre app (utiliser `PUBLIC_*_URL` env var).
