# 29 — Stack Decision · Astro 6 vs TanStack Start (verdict 2026-05-17)

**Statut** : ✅ FIGÉ
**Date** : 2026-05-17
**Mandat Simon (verbatim)** : *« Quel intérêt de TanStack ? Devrions nous migrer ? »*

---

## Verdict

**On garde Astro 6.** Pas de migration vers TanStack Start. Sujet clos.

## Constat empirique (audit Opus 2026-05-17)

```bash
grep -rn "@tanstack\|tanstack" apps/web/package.json apps/web/src/ → 0 résultat
```

Aucune dépendance TanStack n'est utilisée actuellement dans le projet. La question est donc hypothétique : *devrait-on migrer ?*

## Comparatif décisionnel

| Critère | Astro 6 (actuel) | TanStack Start | Verdict Waimia |
|---|---|---|---|
| **Cas d'usage cible** | Sites contenu-driven | Apps SPA dashboard | 🟢 Astro · 95 % du site = contenu |
| **SSG natif** | ✅ Par défaut (`prerender = true`) | ⚠️ Opt-in via loaders TanStack Router | 🟢 Astro |
| **Hydration** | Islands sélectif (`client:idle/visible/load`) | Full hydration React | 🟢 Astro · bundle 5-10× plus léger |
| **MDX first-class** | ✅ `@astrojs/mdx` native | ⚠️ Via lib externe | 🟢 Astro |
| **i18n** | ✅ `astro:i18n` native FR/EN | ⚠️ Configuration manuelle | 🟢 Astro |
| **ISR via Vercel adapter** | ✅ `@astrojs/vercel` config simple | ✅ Même adapter possible | 🟡 Égalité |
| **Bundle JS shipped** | ~20-50 KB (islands) | 100-500 KB (full hydration) | 🟢 Astro · LCP < 1.5s vs 1-3s |
| **SEO / GEO** | ✅ HTML statique pré-rendu, schema.org first-class | ⚠️ SSR React, schema.org via lib | 🟢 Astro |
| **Performance Lighthouse** | 95-100 typique | 70-95 typique | 🟢 Astro |
| **Maturité écosystème** | Astro 6 stable depuis 2026-01, ~50 intégrations | TanStack Start beta 2026, écosystème jeune | 🟢 Astro |
| **Coût migration** | — | ~200-300 h rewrite complet (89 pages + 19 templates + 21 collections) | 🔴 TanStack |
| **Risque régression** | — | Élevé (toolchain neuve, MDX à recâbler, i18n à reconstruire) | 🔴 TanStack |

**Score Astro** : 10 ✅ critères favorables sur 11 (1 égalité ISR).

## Quand TanStack Start serait justifié

Astro **ne serait pas** le bon choix si Waimia devenait :
- Une app SPA hautement interactive (dashboard temps réel, Notion-like)
- Avec besoin de **routing client-side complexe** (transitions stateful entre pages, scroll restoration native, deep linking d'état UI)
- Et **content négligeable** vs UI métier

→ Ce n'est pas le cas. Waimia = **site marketing/contenu B2B premium** avec quelques widgets interactifs (NewsletterSignup, CursorDot, Cal embed). Les widgets sont parfaitement servis par les **React islands** Astro.

## Décision finale

🟢 **Astro 6.1.9** reste la stack canonique Waimia. Toute proposition future de migration framework doit passer par cette doc.

## Implications opérationnelles

1. Continuer à exploiter `prerender = true` (SSG par défaut)
2. Migration `output: 'server' → 'static'` débloquée par T14.2c (bug Rolldown fixé upstream)
3. Islands React justifiées **uniquement** quand CSS pur insuffisant (cf doc 28 axe Performance)
4. Pas de réécriture vers TanStack à l'horizon roadmap Waimia 2026-2027

---

*Audit Opus 4.7 · 2026-05-17 · clos T14.1a + T14.1b*
