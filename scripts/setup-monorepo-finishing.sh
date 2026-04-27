#!/usr/bin/env bash
# scripts/setup-monorepo-finishing.sh
#
# Script idempotent qui crée les 2 fichiers que le sandbox Claude Code a
# bloqués (à juste titre) lors de la refonte monorepo :
#
#   1. .claude/settings.local.json  (escalation perms agents IA)
#   2. .github/workflows/ci.yml     (CI Turborepo lint+typecheck+build+e2e)
#
# Usage :
#   cd /Users/simonberos/waimia-site/site
#   bash scripts/setup-monorepo-finishing.sh
#
# Pré-requis : être à la racine du monorepo (présence de pnpm-workspace.yaml).
# Idempotent : peut être lancé plusieurs fois, n'écrase un fichier existant
# que si on lui passe `--force`.

set -euo pipefail

FORCE=0
if [[ "${1:-}" == "--force" ]]; then
  FORCE=1
fi

# Vérifier qu'on est à la racine du monorepo
if [[ ! -f "pnpm-workspace.yaml" || ! -f "turbo.json" ]]; then
  echo "❌ Erreur : ce script doit être lancé à la racine du monorepo Waimia."
  echo "   Attendu : pnpm-workspace.yaml + turbo.json présents."
  echo "   Lance : cd /Users/simonberos/waimia-site/site && bash scripts/setup-monorepo-finishing.sh"
  exit 1
fi

echo "🔧 Setup monorepo finishing — Waimia"
echo "   Racine : $(pwd)"
echo

# ─── 1. .claude/settings.local.json ──────────────────────────────────
TARGET_CLAUDE=".claude/settings.local.json"

if [[ -f "$TARGET_CLAUDE" && $FORCE -eq 0 ]]; then
  echo "✅ $TARGET_CLAUDE existe déjà (passer --force pour écraser)"
else
  mkdir -p "$(dirname "$TARGET_CLAUDE")"
  cat > "$TARGET_CLAUDE" <<'JSON'
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "_comment": "Permissions élargies monorepo Waimia pour agents IA. Stratégie : autoriser large en dev, garder protections sandbox runtime sur secrets actifs.",
  "permissions": {
    "allow": [
      "Bash(*)",
      "Read(*)",
      "Write(*)",
      "Edit(*)",
      "Agent(*)",
      "WebFetch(*)",
      "WebSearch(*)",
      "mcp__playwright__*",
      "mcp__Claude_Preview__*",
      "mcp__Desktop_Commander__*",
      "mcp__context7__*",
      "mcp__exa__*",
      "mcp__github__*",
      "mcp__filesystem__*",
      "mcp__f8fc0845-fc5a-4097-9e5b-aa199e9f51e2__*"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(rm -rf ~)",
      "Bash(git push --force origin main)",
      "Bash(git push --force-with-lease origin main)"
    ]
  },
  "mode": "acceptEdits",
  "env": {
    "WAIMIA_MONOREPO_VERSION": "1.0.0"
  }
}
JSON
  echo "✅ Créé : $TARGET_CLAUDE"
fi

# ─── 2. .github/workflows/ci.yml ─────────────────────────────────────
TARGET_CI=".github/workflows/ci.yml"

if [[ -f "$TARGET_CI" && $FORCE -eq 0 ]]; then
  echo "✅ $TARGET_CI existe déjà (passer --force pour écraser)"
else
  mkdir -p "$(dirname "$TARGET_CI")"
  cat > "$TARGET_CI" <<'YAML'
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
YAML
  echo "✅ Créé : $TARGET_CI"
fi

echo
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Setup terminé"
echo
echo "Prochaines étapes :"
echo "  1. Vérifier les fichiers : ls -la .claude/ .github/workflows/"
echo "  2. Stager + commit : git add .claude .github && git commit -m 'chore: perms agents + CI workflow'"
echo "  3. (optionnel) Setup Turborepo Remote Cache : npx turbo login && npx turbo link"
echo "  4. Continue Phase 4.1 : update Vercel UI rootDirectory apps/web"
echo "═══════════════════════════════════════════════════════════════"
