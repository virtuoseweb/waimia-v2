# 07 · Component Patterns · Slots first

> **Référence canonique** pour Claude / tout dev qui ajoute ou refactorise un composant.
> Lue à chaque session. La règle : **moins de JS, et quand JS nécessaire, contenu via Slots**.

## Arbre de décision · « quel pattern utiliser ? »

```
Mon composant a besoin de quoi ?
│
├─ Aucun JS (juste du HTML + CSS, peut-être du @media query)
│     → Pure Astro `.astro`                            ← 98 % des cas
│       ex : Hero, Manifesto, Cases, Footer, Stub
│
├─ Un peu de JS pour un toggle / scroll listener / form
│     → Astro `.astro` + balise `<script>` interne     ← Niveau 1
│       ex : Header (mega-menu open/close), HowWeShip (sticky pin scrub)
│
├─ État React / hooks / re-render fréquent + contenu visible
│     → Astro `.astro` qui passe `children` au React island   ← Niveau 2 · PATTERN SLOTS · règle d'or
│       ex : PagePill (apparition au scroll, contenu = labels Astro)
│
└─ Animation pure (canvas, RAF, SVG path) sans contenu textuel
      → React island avec data props, pas de children          ← Niveau 3 · cas spécial documenté
        ex : LiquidHero (canvas blobs), BootSplash (animation), ProductReel (sticky scroll states)
```

## Les 4 patterns en exemple

### Pattern 1 · Pure Astro (défaut)

```astro
---
// Hero.astro · pure Astro · zéro JS
import { langFromPath, t } from '../../lib/i18n';
import { HERO_METRICS } from '../../data/sitemap';

const lang = langFromPath(Astro.url.pathname);
---
<section class="hero">
  <h1>{lang === 'fr' ? 'Bienvenue' : 'Welcome'}</h1>
  <ul>
    {HERO_METRICS.map((m) => <li>{t(m.label, lang)}</li>)}
  </ul>
</section>

<style>
  .hero { padding: clamp(60px,8vw,120px) var(--gut); }
</style>
```

**Pourquoi** : entièrement rendu par Astro. Zéro JS dans le bundle. Indexable instantanément.

### Pattern 2 · Astro + `<script>` interne

```astro
---
// Header.astro · Astro full + tiny script for state
import { PRIMARY_NAV } from '../../data/sitemap';
import { langFromPath, t } from '../../lib/i18n';

const lang = langFromPath(Astro.url.pathname);
---
<header class="hdr" data-open="">
  {PRIMARY_NAV.map((item) => (
    <button class="hdr-trigger" data-mega-trigger={item.key}>
      {t(item.label, lang)}
    </button>
  ))}
  {PRIMARY_NAV.map((item) => (
    <div class="mega" data-mega-panel={item.key}>
      {/* … contenu mega panel … */}
    </div>
  ))}
</header>

<script>
  // Run on the client. Astro bundles automatically.
  const hdr = document.querySelector('.hdr')!;
  hdr.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest('[data-mega-trigger]');
    if (!t) return;
    const key = t.getAttribute('data-mega-trigger')!;
    hdr.setAttribute('data-open', hdr.getAttribute('data-open') === key ? '' : key);
  });
</script>

<style>
  .mega { opacity: 0; pointer-events: none; transition: opacity 340ms; }
  .hdr[data-open="offres"] .mega[data-mega-panel="offres"] { opacity: 1; pointer-events: auto; }
  /* ... répéter pour chaque key, ou utiliser un sélecteur d'attribut intelligent ... */
</style>
```

**Pourquoi** : pas de framework JS chargé. Le `<script>` est traité par Astro comme un module ESM, bundlé une seule fois pour la page. Coût ~500 B au lieu de ~6 KB pour React.

### Pattern 3 · Astro + React island via Slots ⭐

```astro
---
// PagePill.astro · contenu Astro statique, React enrobe
import PagePillIsland from './PagePillIsland.tsx';
---
<PagePillIsland client:visible>
  <span>Vol. 03</span>
  <span>·</span>
  <a href="/atlas">Voir l'atlas →</a>   ← Astro SSR, dans le HTML servi
</PagePillIsland>
```

```tsx
// PagePillIsland.tsx · React MINIMAL · n'enrobe que la classe is-visible
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
      {children}  {/* HTML rendu par Astro · React ne touche pas */}
    </div>
  );
}
```

**Pourquoi** : on a besoin de React (hook `useState` + `useEffect`) mais le **contenu** (libellés, lien) reste rendu par Astro côté serveur. Indexable LLM, ~600 B de bundle React partagé.

> **Quand utiliser ce pattern** : à chaque fois qu'on a besoin de réactivité ET que le contenu contient du texte / liens / structure éditoriale.

### Pattern 4 · React island avec data props (cas spécial)

```tsx
// ProductReel.tsx · React full · pas de Slots possible
// Pourquoi React : sticky scroll-driven state, doit muter 4 panneaux internes
// Pourquoi pas Slots : la data tabulaire (workspaces, agents, pipeline) est interne
//   à l'animation, pas du contenu éditorial à indexer.
import { useEffect, useRef, useState } from 'react';

const SCREENS = [/* data interne */];

export default function ProductReel({ lang }: { lang: 'fr' | 'en' }) {
  const [step, setStep] = useState(0);
  // ...
  return <div>{/* JSX entièrement React-rendered */}</div>;
}
```

**Pourquoi accepté** : la data est **structurelle à l'animation**, pas du contenu éditorial. Les 4 panneaux du ProductReel ne sont pas indexés comme contenu textuel — ils sont des « captures de console » illustratives. Si demain on voulait indexer ces données, il faudrait passer en pattern Slots.

> **Justification écrite obligatoire** dans la tête du fichier pour tout React island en pattern 4.

## Anti-patterns à bannir

### Anti-pattern 1 · Données éditoriales en props React

```tsx
// MAUVAIS — les liens devraient être du HTML statique, pas des React props
<MyHeader links={[
  { href: '/offres', label: 'Offres' },
  { href: '/solutions', label: 'Solutions' },
]} />
```

**Pourquoi** : Astro doit rendre les `<a>` côté serveur pour qu'ils soient indexables. Si React les rend, ils n'apparaissent qu'après hydratation. Refactorer en pattern 3 (Slots) ou pattern 2 (Astro + script).

### Anti-pattern 2 · `<style is:global>` dans un composant

```astro
<MyIsland client:load>
  <button class="my-btn">Click</button>
</MyIsland>

<style is:global>
  .my-btn { background: red; }   ← Astro peut quand même scoper malgré is:global
  .my-btn.is-active { ... }      ← React-added class qui ne match pas le scope
</style>
```

**Pourquoi** : Astro peut scoper `<style is:global>` malgré la directive (cf bug rencontré sur PagePill v1). Mettre les styles dans `src/styles/global.css` directement.

### Anti-pattern 3 · Innerhtml direct pour formater du texte

```tsx
// MAUVAIS — risque XSS + le hook sécurité bloque
<span dangerously-set-inner-html={{__html: 'Status ◉ active'.replace('◉', '<span style="color:red">◉</span>')}} />
```

**Pourquoi** : XSS si la donnée vient d'ailleurs un jour. Préférer split + map :

```tsx
// BON — safe rendering
function withAccent(text: string) {
  const parts = text.split('◉');
  return parts.flatMap((p, i) =>
    i < parts.length - 1
      ? [<Fragment key={i}>{p}</Fragment>, <span key={`d${i}`} style={{ color: 'red' }}>◉</span>]
      : [<Fragment key={i}>{p}</Fragment>]
  );
}
```

### Anti-pattern 4 · Fichiers orphelins

Si un composant n'est plus importé par personne, il **doit être supprimé**. Pas de morgue. `git` garde l'historique.

Check rapide :
```bash
grep -rl "MyComponent" src/ | grep -v MyComponent.astro
```

## Décision rapide · cheatsheet

| Question | Réponse |
|---|---|
| « J'ai besoin de useEffect / useState ? » | Pattern 3 (Slots) ou 4 (justifier) |
| « Juste un toggle ou un scroll listener ? » | Pattern 2 (Astro + script) |
| « Juste afficher du contenu ? » | Pattern 1 (pure Astro) |
| « J'ai 200 lignes de logique d'état ? » | Refactorer en plusieurs composants. Si vraiment indispensable, Pattern 4 documenté. |
| « Le contenu doit être indexé par les LLM ? » | Pattern 1, 2, ou 3. **Jamais Pattern 4.** |

## En résumé

1. **Pattern 1 par défaut** — pure Astro
2. **Pattern 2 quand JS minimal** — script inline
3. **Pattern 3 quand React nécessaire** — Slots, contenu rendu par Astro
4. **Pattern 4 exception justifiée** — data props, écrire pourquoi en tête de fichier
