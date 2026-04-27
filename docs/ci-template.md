# CI GitHub Actions · template à activer manuellement

Le sandbox Claude Code bloque la création directe de fichiers `.github/workflows/*.yml` (protection : un workflow = mécanisme d'exécution de code à chaque push, donc nécessite une autorisation utilisateur explicite).

## Étapes pour activer la CI

### 1 · Créer le fichier

```bash
mkdir -p /Users/simonberos/waimia-site/site/.github/workflows
```

Puis créer `.github/workflows/ci.yml` avec le contenu de la section ci-dessous.

### 2 · Configurer Turborepo Remote Cache (optionnel mais recommandé)

```bash
cd /Users/simonberos/waimia-site/site
npx turbo login
npx turbo link
```

Vercel offre du Remote Cache gratuit. Une fois lié, ajouter dans GitHub repo Settings → Secrets and variables → Actions :

- `TURBO_TOKEN` (secret) · token Vercel
- `TURBO_TEAM` (variable) · slug team Vercel

### 3 · Push pour déclencher

```bash
git add .github/
git commit -m "ci: turborepo workflow lint+typecheck+build+e2e"
git push
```

## Contenu de `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

jobs:
  lint-typecheck-build:
    name: Lint · Typecheck · Build
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.15.0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm turbo run lint --cache-dir=.turbo

      - name: Typecheck
        run: pnpm turbo run typecheck --cache-dir=.turbo

      - name: Build
        run: pnpm turbo run build --cache-dir=.turbo
        env:
          PUBLIC_SITE_URL: https://waimia.com
          PUBLIC_CAL_USERNAME: waimia
          PUBLIC_CAL_EVENT_TYPE: 45min

  e2e:
    name: E2E Playwright (waimia-web)
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: lint-typecheck-build

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.15.0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm --filter waimia-web exec playwright install --with-deps chromium

      - name: Run E2E tests
        run: pnpm --filter waimia-web test:e2e
        env:
          PUBLIC_SITE_URL: http://localhost:4321
          PUBLIC_CAL_USERNAME: waimia
          PUBLIC_CAL_EVENT_TYPE: 45min

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: apps/web/playwright-report/
          retention-days: 14
```

## Sécurité workflows

Conventions à respecter pour éviter command injection :

❌ Ne jamais faire :
```yaml
run: echo "${{ github.event.issue.title }}"
```

✅ Toujours faire :
```yaml
env:
  TITLE: ${{ github.event.issue.title }}
run: echo "$TITLE"
```

Ce template ne contient pas d'inputs untrusted dans `run:` — il est safe.

## Évolutions futures

- **`preview.yml`** · Vercel preview comments sur PR
- **`release.yml`** · Changesets pour versionning packages partagés (si publication npm un jour)
- **`security.yml`** · Snyk / Socket.dev sur deps
