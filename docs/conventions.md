# Conventions du monorepo Waimia

Référence courte pour les agents IA et humains qui contribuent au repo.

## Naming

| Type            | Convention                              | Exemple                       |
| --------------- | --------------------------------------- | ----------------------------- |
| App             | `apps/<nom-court>`                      | `apps/web`, `apps/cal`        |
| Package interne | `@waimia/<nom>`                         | `@waimia/db`, `@waimia/lib`   |
| Package name JS | `waimia-<nom>` (apps), `@waimia/<nom>` (libs) | `waimia-web`, `@waimia/lib` |
| Branch git      | `<type>/<short-desc>`                   | `feat/cal-embed`, `fix/seo-canonical` |
| Commit message  | Convention Commits FR                   | `feat(web): nouvelle page /offres/...` |

## Branches git

```
main               ← prod (waimia.com déploie automatiquement)
monorepo-pivot     ← refonte structurelle (en cours)
feat/<...>         ← features
fix/<...>          ← bug fixes
chore/<...>        ← maintenance, configs, deps
docs/<...>         ← documentation uniquement
```

Toute feature passe par une branche → PR review → merge sur `main`.
Pas de push direct sur `main` (sauf hot-fix critique documenté).

## Commits (Conventional Commits FR)

```
<type>(<scope>): <message court>

<corps optionnel · pourquoi, pas quoi>

<footer optionnel · refs PR, breaking, co-authors>
```

| Type     | Quand                                |
| -------- | ------------------------------------ |
| `feat`   | Nouvelle feature visible utilisateur |
| `fix`    | Correctif bug                        |
| `chore`  | Maintenance, deps, configs           |
| `docs`   | Documentation uniquement             |
| `refactor` | Refacto sans changement comportement |
| `test`   | Ajout/modif tests                    |
| `style`  | Format, espace, point-virgule        |
| `perf`   | Amélioration performance             |
| `revert` | Annulation d'un commit antérieur     |

Scope = nom de l'app ou du package : `feat(web): ...`, `fix(cal): ...`, `chore(monorepo): ...`.

## Lockfiles · politique

**Dev local** : lockfiles non-stricts. Les agents IA peuvent ajouter / mettre à
jour des deps sans que le lockfile out-of-sync bloque l'install. Configuré
dans `.npmrc` racine via `prefer-frozen-lockfile=false`.

**CI / Vercel prod** : passer `--frozen-lockfile` en flag CLI explicite pour
garantir builds reproductibles. Vercel l'active automatiquement quand le
lockfile est commit (donc on **commit** `pnpm-lock.yaml`).

**Cal.com (yarn 4 berry)** : lockfile à part (`apps/cal/yarn.lock`),
politique upstream Cal.com — ne pas le toucher.

## Permissions agents IA (Claude Code, Codex, Sonnet)

Le sandbox runtime de Claude Code bloque par défaut les écritures sur certains
patterns sensibles (`.env*`, `~/.ssh/*`, settings agent). Pour contourner :

- **Lire un `.env*`** : utiliser `mcp__Desktop_Commander__read_file` (perms séparées)
- **Écrire un `.env*`** : utiliser `mcp__Desktop_Commander__write_file`
- **Élargir les perms projet** : créer `.claude/settings.local.json` à la main
  (l'agent ne peut pas le faire lui-même par sécurité — c'est une protection
  contre les escalades silencieuses)

Template recommandé pour `.claude/settings.local.json` du projet :

```json
{
  "permissions": {
    "allow": [
      "Bash(*)", "Read(*)", "Write(*)", "Edit(*)", "Agent(*)",
      "WebFetch(*)", "WebSearch(*)",
      "mcp__playwright__*", "mcp__Claude_Preview__*",
      "mcp__Desktop_Commander__*", "mcp__context7__*",
      "mcp__exa__*", "mcp__github__*"
    ],
    "deny": [
      "Bash(rm -rf /)", "Bash(rm -rf ~)",
      "Bash(git push --force origin main)"
    ]
  },
  "mode": "acceptEdits"
}
```

## Stacks · pourquoi cette répartition

| App         | Stack             | Pourquoi                                      |
| ----------- | ----------------- | --------------------------------------------- |
| `apps/web`  | Astro 6 + pnpm    | Content-heavy, SSR léger, perf-first          |
| `apps/cal`  | Next 16 + yarn 4  | Convention upstream Cal.com (impératif)       |
| `apps/<futur>` | Selon besoin   | Cf [adding-an-app.md](./adding-an-app.md)     |

Pas de dogme · choisir la stack qui sert le besoin, pas l'inverse.

## Code style

- **Formatage** · Prettier 3 (`.prettierrc` racine), `pnpm format` avant push.
- **TypeScript** · `strict: true` partout (via `tsconfig.base.json`).
- **Astro components** · `.astro` pour SSR, `.tsx` islands React seulement si interactivité requise.
- **Imports** · paths absolus via TS path mapping (à venir), pas de `../../../`.
- **Comments** · français pour les commentaires métier, anglais pour les comments techniques courts (`// TODO`, `// FIXME`).

## Promotion code app → package

**Règle 2025** : 3 usages cross-app = extraction vers `packages/<nom>`.

Tant qu'un util / type / helper vit dans 1 seule app, il y reste.
Promotion prématurée = sur-architecture (versioning + build deps + doc) sans bénéfice.

## Quand ouvrir une PR vs commit direct

- **Commit direct sur `main`** · seulement pour hotfix critique prod (rare)
- **PR review** · tout le reste, même les changements solo (Simon review ses propres PR pour avoir l'historique propre)
- **PR draft** · WIP collaboratif, signale « ne pas merge encore »

## Tests

- **Unit** · Vitest (à venir, pas encore configuré)
- **E2E** · Playwright dans `apps/<nom>/tests/e2e/`
- **Smoke prod** · `apps/web/tests/e2e/` avec `PLAYWRIGHT_BASE_URL` env var

## Documentation

Tout doc qui survit à la session courante va dans `docs/`. Ne pas multiplier
les `*.md` éparpillés dans le repo. Index dans `docs/architecture.md`.
