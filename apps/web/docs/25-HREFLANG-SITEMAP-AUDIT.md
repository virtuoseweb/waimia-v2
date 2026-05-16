# 25 — Audit hreflang et sitemap EN

Audit lecture-seule · généré 2026-05-16 · build `dist/client/sitemap-0.xml`

---

## 1. Stats brutes sitemap

| Métrique | Valeur |
|---|---|
| Total URLs sitemap | 223 |
| URLs FR (root, hors `/en/`) | 184 |
| URLs EN (`/en/...`) | 38 |
| `hreflang="fr-FR"` references | 78 |
| `hreflang="en-US"` references | 78 |
| URLs sans paire hreflang (mono-lingue) | ~145 |

Pondération brute : ~42 % des URLs FR ont une version EN référencée dans le sitemap. Reste 58 % monolingues.

---

## 2. Couverture hreflang dans Base.astro

`src/layouts/Base.astro:81-83` injecte systématiquement :

```html
<link rel="alternate" hreflang="{HREFLANG[lang]}" href="{canonicalUrl}" />
<link rel="alternate" hreflang="{HREFLANG[lang === 'fr' ? 'en' : 'fr']}" href="{altUrl}" />
<link rel="alternate" hreflang="x-default" href="{siteUrl}/" />
```

Cela signifie que **chaque page rendue** déclare ses 3 hreflang. Le sitemap, lui, ne référence les paires que si Astro detect une paire FR↔EN explicite via la config `@astrojs/sitemap`.

**Conclusion** : Les hreflang en `<head>` sont systématiques (✅), mais le sitemap omet la paire pour les pages dont la version inverse n'est pas un fichier `.astro` détectable au build (ex : pages purement programmatiques sans miroir EN).

---

## 3. Pages FR sans miroir EN détecté

Liste des URLs FR sans `hreflang="en-US"` dans le sitemap (échantillon — 5 premières) :

```
https://waimia.com/agence/careers
https://waimia.com/agence/docs
https://waimia.com/agence/governance
https://waimia.com/agence/trust-center
https://waimia.com/archive
```

Voir `dist/client/sitemap-0.xml` pour la liste complète (~106 URLs).

---

## 4. Pages EN sans miroir FR détecté

Liste des URLs `/en/...` sans `hreflang="fr-FR"` dans le sitemap (échantillon) :

```
(à vérifier — script ci-dessous)
```

Commande de scan :

```bash
grep -oE '<loc>https://waimia.com/en[^<]+</loc>' dist/client/sitemap-0.xml | sort -u
```

---

## 5. Recommandations P0-P2

### P0 · Pages stratégiques sans EN à créer (priorité business)

Pour atteindre 80%+ de couverture EN :

- `/agence/careers` → `/en/agence/careers`
- `/agence/governance` → `/en/agence/governance`
- `/agence/trust-center` → `/en/agence/trust-center`
- `/agence/docs` → `/en/agence/docs` (selon ouverture publique)
- `/contact` → vérifier que `/en/contact` existe
- `/blog/[slug]` → migrer les articles existants avec champ `*_en` complet

### P1 · Sitemap-en.xml dédié

Actuellement Astro génère un seul `sitemap-0.xml` mêlant FR et EN. Recommandation : générer un `sitemap-en.xml` via la config `@astrojs/sitemap` avec filtre par lang pour soumission séparée à Google Search Console.

### P2 · Script de validation cross-lang

Créer `scripts/validate-hreflang.ts` qui :
1. Liste toutes les URLs FR du sitemap.
2. Pour chaque URL, vérifier que `/en/<path>` existe (HTTP 200 sur dev server).
3. Idem inverse pour les URLs EN.
4. Rapport des paires manquantes.

À automatiser dans CI (warning, pas blocker).

---

## 6. Validation Tier 13.3 + 11.3 + 11.4

| Action | Status |
|---|---|
| T11.3 · hreflang validation cross-pages | 🟡 Partielle · Base.astro OK (3 hreflang/page) mais ~58% FR sans miroir EN |
| T11.4 · /sitemap-en.xml validation | 🟡 Sitemap unique mêlé · sitemap-en.xml séparé non implémenté |
| T13.6 · hreflang `x-default` + FR + EN systématique | ✅ Implémenté `src/layouts/Base.astro:81-83` |

**Décision** : Les hreflang fondamentaux (P0 = head HTML) sont OK et conformes SEO. La couverture EN incomplète est un sujet de **contenu** (pages à créer), pas d'infrastructure. T13.6 peut être cochée ✅. T11.3 + T11.4 restent 🟡 jusqu'à création des miroirs EN manquants.
