# Déploiement Waimia

Procédures Vercel + DNS + sous-domaines pour le monorepo.

## Vue d'ensemble

| Sous-domaine     | App          | Projet Vercel | rootDirectory  | Status  |
| ---------------- | ------------ | ------------- | -------------- | ------- |
| `waimia.com`     | `apps/web`   | `waimia-v2`   | `apps/web`     | ✅ prod |
| `cal.waimia.com` | `apps/cal`   | `waimia-cal`  | `apps/cal`     | 🚧 setup |

Convention · 1 app = 1 projet Vercel = 1 rootDirectory = 1 sous-domaine.

## Bascule monorepo (waimia-v2)

Quand le projet `waimia-v2` est passé d'app simple à monorepo, il faut update le rootDirectory dans Vercel UI :

1. **Avant le merge prod** :
   - Dashboard Vercel → projet `waimia-v2` → Settings → General
   - Root Directory · `apps/web` (au lieu de vide / `.`)
   - Build Command : laisser auto-détecté (`astro build`)
   - Output Directory : laisser auto-détecté (`.vercel/output`)
   - Install Command : `pnpm install` (auto-détecté car pnpm-workspace.yaml présent)

2. **Merge prod** :
   ```bash
   git checkout main
   git merge monorepo-pivot
   git push origin main
   ```

3. **Vérifications post-deploy** :
   - Vercel Functions → `_render.func` listée
   - Logs → 0 erreur startup
   - `curl -I https://waimia.com` → 200
   - `curl -I https://waimia.com/contact` → 200
   - `curl https://waimia.com/sitemap-index.xml` → XML valide

## Variables d'environnement Vercel

Les variables `.env*` ne sont **pas** committées. Sur Vercel, set via :

**Option A · Dashboard** :
Settings → Environment Variables → Add (par environnement Production / Preview / Development).

**Option B · CLI Vercel** (recommandé pour batch) :

```bash
cd apps/web
echo "re_xxxxx" | vercel env add RESEND_API_KEY production
echo "Waimia <hello@waimia.com>" | vercel env add EMAIL_FROM production
# etc. cf .env.example pour la liste complète
```

**Option C · Push depuis `.env` local** :

```bash
# Lire un fichier .env local et push toutes les vars en prod
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" == \#* ]] && continue
  value="${value%\"}"
  value="${value#\"}"
  echo "$value" | vercel env add "$key" production
done < .env
```

Variables minimales requises pour `apps/web` prod : `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `EMAIL_INTERNAL_TO`, `PUBLIC_CAL_USERNAME`, `PUBLIC_CAL_EVENT_TYPE`, `PUBLIC_SITE_URL`. Cf [`apps/web/.env.example`](../apps/web/.env.example).

## Créer un nouveau projet Vercel (futur sous-domaine)

1. Vercel dashboard → New Project → Import du même repo GitHub
2. Project Name · `waimia-<nom>` (ex: `waimia-blog`)
3. Framework Preset · auto-détecté (Astro / Next / etc.)
4. Root Directory · `apps/<nom>`
5. Build & Output Settings · auto-détecté
6. Environment Variables · cf `.env.example` de l'app
7. Deploy · attendre le build OK
8. Domains → ajouter `<nom>.waimia.com`

## DNS sous-domaines

Registrar du domaine `waimia.com` (vérifier dans Hostinger / OVH / Gandi).

Pour ajouter `<nom>.waimia.com` :

```
Type    Name    Value                       TTL
CNAME   <nom>   cname.vercel-dns.com.       3600
```

Propagation TTL ~1h en moyenne. Vérifier :

```bash
dig +short <nom>.waimia.com
# → cname.vercel-dns.com.
```

## Ignored Build Step (économie minutes Vercel)

Pour qu'un push qui touche uniquement `apps/cal` ne déclenche pas un rebuild
inutile de `waimia-v2` (et inversement), configurer dans chaque projet Vercel :

Settings → Git → Ignored Build Step :

```bash
# Pour waimia-v2 (rootDirectory apps/web) — ne build que si apps/web ou packages changent :
git diff HEAD^ HEAD --quiet ./ ../../packages/
```

```bash
# Pour waimia-cal (rootDirectory apps/cal) — ne build que si apps/cal change :
git diff HEAD^ HEAD --quiet ./
```

Exit code 0 = skip build, exit code 1 = rebuild.

## Rollback prod

Tag de rollback créé avant le pivot monorepo : `pre-monorepo-2026-04-27`.

En cas de problème post-bascule :

```bash
git checkout main
git reset --hard pre-monorepo-2026-04-27
git push origin main --force-with-lease
# Dans Vercel UI : revenir Root Directory à vide / "."
```

⚠️ Force push = action destructive · demander validation explicite Simon avant.

## Smoke tests post-deploy

```bash
# Apps/web · pages publiques critiques
for path in "" "/offres" "/cas/halcyon" "/contact" "/sitemap-index.xml"; do
  status=$(curl -o /dev/null -s -w "%{http_code}" "https://waimia.com$path")
  echo "$path → $status"
done

# Apps/web · API routes (POST réel · attention envoie email)
# À ne lancer qu'avec un email de test
curl -X POST https://waimia.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"smoke","email":"smoke@test.com","message":"smoke test"}'
```

Tous les codes attendus 200 / 201 / 308 (redirect canonical).

## Monitoring (à venir)

- **Vercel Analytics** · activé sur le projet (free tier)
- **Sentry** · à configurer (clé existante côté VirtuoseWeb à réutiliser)
- **Resend webhooks** · monitoring bounce / complaints email

## Liens utiles

- [Architecture](./architecture.md)
- [Adding an app](./adding-an-app.md)
- [Conventions](./conventions.md)
- Vercel skill local : `~/.claude/plugins/cache/claude-plugins-official/vercel/`
