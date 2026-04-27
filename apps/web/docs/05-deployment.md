# 05 · Deployment & Git Strategy

## Repo cible

`https://github.com/virtuoseweb/waimia` — déjà connecté à `https://waimia.vercel.app/`.

## Stratégie git de migration

L'existant est qualifié de « mal fait » par Simon. Trois options possibles :

### Option A · branche refonte (recommandée)
1. Cloner `virtuoseweb/waimia`.
2. Créer `git checkout -b refonte/v2-direction-apparatus`.
3. Reset `git rm -r src/* public/* astro.config.mjs package.json` puis remplacer par le nouveau scaffold.
4. Préserver `public/favicon*` (déjà fait).
5. Push branche → preview Vercel automatique.
6. PR vers `main` quand validé.

**Avantage** : on peut comparer ancien vs nouveau via Vercel preview avant merge.

### Option B · push direct sur main
Plus rapide mais on perd l'ancien live.

### Option C · nouveau repo
Pas pertinent : Simon a confirmé que c'est le bon repo.

→ **On part sur A.** Implémenté à la fin du sprint, après validation locale.

## Configuration Vercel

L'adapter Astro recommandé sur Vercel : `@astrojs/vercel`.
À installer si déploiement nécessite des fonctions edge (sinon SSG pur fonctionne sans adapter).

Variables d'env Vercel :
- `PUBLIC_SITE_URL=https://waimia.com` (ou `waimia.vercel.app` en preview)
- `PUBLIC_DEFAULT_LANG=fr`

## Domaine

`waimia.vercel.app` actuellement. Rediriger ou pointer le domaine custom (`waimia.com` ?) au moment du go-live.

## Pages CMS

Une fois l'auth GitHub faite via pagescms.org, la config repose dans `.pages.yml` à la racine.
URL admin : `https://app.pagescms.org/virtuoseweb/waimia/main`.

## CI/CD

Pour le moment : déploiement Vercel branch-aware, suffisant.
Ajouter plus tard si besoin :
- `pnpm astro check` (typecheck Astro)
- `pnpm build` doit passer
- Lighthouse CI (perf budget)

## Lighthouse cibles

- Performance ≥ 95 sur mobile
- Accessibility ≥ 95 (AA minimum)
- Best practices = 100
- SEO = 100
