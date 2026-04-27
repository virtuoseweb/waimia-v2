# 06 · Coding Standards · Waimia

> **Charte projet** lue par Claude au début de chaque session de code.
> Toute contribution doit respecter ces règles. Si quelque chose dévie, **on refuse le PR ou on demande clarification**.

## 1. Hiérarchie de décision · « moins de JS d'abord »

Pour chaque morceau d'UI, choisir dans cet ordre. Descendre d'un cran seulement si nécessité prouvée.

| Niveau | Outil | Quand |
|---|---|---|
| **0** | **Pure Astro `.astro`** + CSS | Contenu statique, pas d'interactivité (98 % des sections) |
| **1** | **Astro + `<script>`** inline ou `is:client` | Interactivité simple : toggle, scroll-state, form basique. **Pas de React.** |
| **2** | **Astro + îlot React via Slots pattern** | Logique d'état complexe avec **contenu rendu par Astro** (cf §2) |
| **3** | **Astro + îlot React avec data props** | Cas spéciaux uniquement. Doit être justifié dans le commentaire de tête. |

**Anti-pattern** : créer un composant React parce que « c'est plus pratique ». Pratique pour qui ? Le crawler IA et l'utilisateur final paient le coût en bundle JS et en perte d'indexabilité.

## 2. Pattern Slots · règle d'or du projet

> Quand on a besoin de React (état, hooks), **passer le contenu HTML/Astro statique en `children`**, pas en data props.
> Astro rend le contenu côté serveur → indexable LLM, instantané, zéro hydratation pour le contenu.

### Exemple canonique · `PagePill` (référence du projet)

```astro
---
// PagePill.astro
import PagePillIsland from './PagePillIsland.tsx';
---
<PagePillIsland client:visible>
  <span>Vol. 03</span>                ← Astro SSR
  <a href="/atlas">Voir l'atlas →</a>  ← Astro SSR (lien indexable)
</PagePillIsland>
```

```tsx
// PagePillIsland.tsx
import { useEffect, useState, type ReactNode } from 'react';

export default function PagePillIsland({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 220);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={'page-pill' + (visible ? ' is-visible' : '')}>
      {children}  {/* contenu rendu par Astro, indexable */}
    </div>
  );
}
```

**Règle dérivée** : quand on hésite entre data props et children, **toujours children** sauf raison écrite explicite.

### Quand PAS utiliser Slots

- Le composant React **génère** un graphisme (canvas, SVG animé) — `LiquidHero`, `BootSplash`. Pas de contenu sémantique à exposer.
- Le composant a **besoin de la data structurée** côté JS pour piloter une animation (ex : `ProductReel` avec ses 4 panneaux qui mutent au scroll). Les panneaux sont du contenu interne à l'animation, pas du contenu éditorial.

Dans ces cas : `client:visible` + props internes = OK, **mais commenter pourquoi**.

## 3. Structure de dossiers

```
src/
├── components/
│   ├── header/         Header.astro (avec script inline pour state)
│   ├── footer/         Footer.astro
│   ├── motion/         React islands purs animation : BootSplash, LiquidHero, ProductReel
│   ├── seo/            JsonLd, FAQ — composants SEO/GEO/AIO réutilisables
│   ├── sections/       Sections de page (Hero, Manifeste, Cases…) · pure Astro
│   └── ui/             Atomes (Bi, PagePill, PagePillIsland) · réutilisables partout
├── content/            Astro content collections + Zod schemas
├── data/               Données typées TS (sitemap, navigation)
├── layouts/            Layouts Astro (Base.astro)
├── lib/                Helpers TS (i18n, seo)
├── pages/              Routes Astro
│   └── en/             Mirror EN des routes FR
└── styles/             tokens.css (DS) + global.css (legacy ported)
```

### Règles de placement

- **Section vs UI** : si le composant est utilisé sur **plusieurs pages**, c'est `ui/`. Sinon c'est `sections/`.
- **Motion vs section** : si le composant produit une **animation** (canvas, scroll-driven, RAF), c'est `motion/`. Sinon c'est `sections/` ou `ui/`.
- **Pas de barrel files** (`index.ts` qui ré-exporte) — chaque import nomme son fichier source.

## 4. Conventions de nommage

- **Composants Astro** : `PascalCase.astro` (ex : `Hero.astro`)
- **React islands** : `PascalCaseIsland.tsx` quand c'est un wrapper minimal pour le pattern Slots (ex : `PagePillIsland.tsx`). Sinon juste `PascalCase.tsx`.
- **Fichiers data** : `kebab-case.ts` (ex : `sitemap.ts`)
- **Helpers** : `kebab-case.ts` (ex : `i18n.ts`)
- **Pages** : `kebab-case.astro` (ex : `manifesto.astro`)

## 5. Imports · ordre standardisé

Dans chaque fichier `.astro`, suivre cet ordre :

```ts
// 1. Layouts (Base, etc.)
import Base from '../layouts/Base.astro';

// 2. React islands (motion components)
import LiquidHero from '../components/motion/LiquidHero.tsx';

// 3. Astro sections / UI
import Hero from '../components/sections/Hero.astro';
import PagePill from '../components/ui/PagePill.astro';

// 4. Data + types
import { CASE_FEED, FIELD_NOTES } from '../data/sitemap';

// 5. Helpers
import { langFromPath, t, localizeHref } from '../lib/i18n';
```

Ne pas mélanger ces blocs. Toujours dans cet ordre.

## 6. Tête de fichier · commentaire obligatoire

Chaque fichier `.astro` ou `.tsx` commence par un bloc de commentaires qui répond à 3 questions :

```ts
// Composant · {nom et rôle}
// Variant : {layout / pattern visuel choisi}
// Motion / interactivité : {effet ou logique}
// {Optionnel} Mémorable : {ce qui rend cette section unique}
```

Pour un fichier React island :

```tsx
/* {Nom} · React island {role}
 * Pourquoi React : {raison précise — état, hook, RAF, canvas}
 * Pourquoi Slots / data props : {justification}
 * Coût bundle estimé : {~600 B / ~2 KB / etc.} */
```

## 7. CSS · règles strictes

- **Source de vérité tokens** : `src/styles/tokens.css` (variables DS + `@theme`).
- **Ne jamais inventer** un token. Toujours réutiliser `--paper`, `--ink`, `--accent`, etc.
- **Classes legacy** (editorial-cell, hero-a, mega…) sont dans `global.css` et restent intouchées.
- **Composant scoped** : utiliser `<style>` (sans `is:global`) pour les styles spécifiques au composant.
- **Composant global** : éviter `<style is:global>` qui peut être scopé par Astro malgré la directive. Préférer ajouter dans `global.css` directement et commenter le pourquoi.
- **Pas de `style=""` inline** sauf pour des valeurs dynamiques (ex : `style={\`--kw:\${weight}\`}`). Préférer les classes.

## 8. TypeScript · types stricts

- **Pas de `any`** sans justification.
- Utiliser les types exportés depuis `data/sitemap.ts` (`BiText`, `MegaMenu`, `NavItem`, etc.).
- React props : déclarer une `interface Props` au-dessus du composant.

## 9. i18n · règles

- **Toutes les pages** ont leur miroir `/en/`.
- **Le composant `<Bi en="" fr="" />`** (`ui/Bi.astro`) est la primitive bilingue interne aux composants. Détecte la langue via `Astro.url.pathname`.
- **Helper `t(o, lang)`** dans `lib/i18n.ts` pour piocher la chaîne dans un objet `BiText`.
- **Helper `localizeHref(path, lang)`** pour préfixer `/en` quand `lang === 'en'`.

## 10. Performance budget

- **Bundle JS total** : < 30 KB après gzip. Le seul React utilisé doit être pour les îlots.
- **LCP** : < 2.5 s sur fibre.
- **CLS** : < 0.1.
- **Hydratation directives** : préférer `client:visible` à `client:load`. `client:idle` pour les éléments pas-immédiats.
- **Pas de polyfills** pour navigateurs morts (IE11, Edge legacy).

## 11. Accessibility · AA minimum

- Tout `<a>` qui contient un `→`, `↗` ou autre signe directionnel doit avoir un `aria-label` explicite.
- `prefers-reduced-motion: reduce` doit désactiver toutes les animations RAF / parallax / scrub.
- Contraste minimum 4.5:1 sur le texte.
- Heading hierarchy : 1 `<h1>` par page, pas de saut.

## 12. SEO / GEO / AIO · checklist

Pour chaque page :

- [ ] Title unique, < 60 chars
- [ ] Description unique, 140-160 chars
- [ ] 1 `<h1>` unique
- [ ] Hreflang pointing vers la version EN/FR alternative
- [ ] Canonical défini
- [ ] OG image (1200×630)
- [ ] JSON-LD `Organization` + `WebSite` (auto via Base.astro) + spécifique selon le type
- [ ] Au moins une FAQ visible avec JSON-LD `FAQPage` (sur les pages-hub)

## 13. Process Git

- **Branches** : `feat/`, `refactor/`, `fix/`, `docs/`. Toujours préfixées.
- **Commits** : message court (60 chars) + détail si nécessaire. Conventional Commits encouragés mais pas exigés.
- **Pas de force push sur main**. Toujours via merge commit `--no-ff` pour garder l'historique des branches.
- **Auto-deploy** Vercel actif sur main.

## 14. Tests

- Pas de tests unitaires obligatoires pour les composants (ils sont SSR donc le rendu est statique).
- **Smoke test build** : `pnpm build` doit passer sans erreur ni warning.
- **Astro check** : `pnpm astro check` doit passer (TypeScript + Zod).
- **Preview manuel** : ouvrir 4 directions + scroll-test avant chaque PR vers main.

## 15. Avant chaque PR vers main

- [ ] `pnpm astro check` passe
- [ ] `pnpm build` passe (zéro erreur, warnings documentés)
- [ ] Pas d'`any` non justifié
- [ ] Pas de fichiers orphelins
- [ ] Imports dans l'ordre standardisé
- [ ] Tête de fichier présente
- [ ] Pour tout nouveau React island : justification explicite (pas Slots) ou usage de Slots
- [ ] FAQ + JSON-LD si page nouvelle hub
- [ ] Hreflang FR/EN miroir si page nouvelle
