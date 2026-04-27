# 04 · Motion System

> Discipline motion : 1 effet d'entrée max par section + 1 micro-interaction éventuelle.
> Tempo lent (1100-1600ms) > tempo nerveux. Toujours respecter `prefers-reduced-motion`.

## Famille d'effets

### Reveals (entrée de section)

| Effet           | Classe legacy   | Quand l'utiliser                                   |
|-----------------|-----------------|----------------------------------------------------|
| Fade + up       | `.reveal` / `.reveal-up` | Défaut · headlines, paragraphs                |
| Fade            | `.reveal-fade`  | Visuels ambient, images d'illustration             |
| Stagger         | `.reveal-stagger` | Listes, grilles (8 enfants max)                  |
| Scale-in        | `.scale-in`     | Cards, blocs accentués                             |
| Blur-in         | `.blur-in`      | Images cinématiques (1×/page max)                  |
| Clip-up         | `.clip-up`      | Text mask reveal éditorial (1×/page max)           |
| Hair-draw       | `.hair-draw`    | Lignes horizontales (séparateurs sections)         |
| Row-lines       | `.row-lines`    | Listes en lignes (cas, métiers) — anim séquentiel  |

### Micro-interactions

| Effet            | Implé          | Usage                                              |
|------------------|----------------|----------------------------------------------------|
| Magnetic hover   | `[data-mag]` + JS | CTA principaux uniquement (pas d'overuse)       |
| Cursor dot       | `initCursorDot()` | Desktop pointer:fine seulement                  |
| Tilt 3D          | (optionnel · Atlas) | Cards Atlas direction 3 uniquement            |
| Lift             | `.lift`        | Hover cards (translateY -4px + soft shadow)        |

### Scroll continu

| Effet            | Implé              | Usage                                              |
|------------------|--------------------|---------------------------------------------------|
| Parallax layers  | `.par[data-par]`   | Hero meta-rows, signature ornaments               |
| Sticky pin       | sticky CSS + scrub | How we ship (4 steps)                             |
| Kinetic headline | KineticHeadline.tsx| Hero seulement (1×)                               |

### Transitions

| Effet                  | Implé              | Usage                                          |
|------------------------|--------------------|------------------------------------------------|
| Background color shift | section + body class | Entre Thesis (ink) → Pyramide (paper-2) → Cases (paper) |
| Morphing border-radius | inline / class     | Zoom Reveal entre Thesis et Pyramide (1×/page max) |

## Règles d'usage

1. **1 effet d'entrée max par section.** Jamais empilé.
2. **Respecter `prefers-reduced-motion`** : tout fallback = contenu statique lisible (ce qui est déjà le défaut dans `site.css`).
3. **Mobile** : désactiver tilt 3D et cursor follower (`pointer:coarse`).
4. **Parallax léger** (`-0.04` à `-0.08`) — pas de drift cinétique violent.
5. **JS fail-safe** : aucune section motion ne doit rendre du contenu inaccessible si JS désactivé.

## Implémentation Astro/React

- Reveals = pure CSS (classes legacy) + `IntersectionObserver` léger dans un script Astro inline.
- KineticHeadline = React island `client:visible`.
- StickyPin = pure CSS + `position:sticky` + JS minimal pour activer la step courante.
- BootSplash = React `client:only="react"` (évite flash SSR).
- BackgroundColorShift = data-attribute sur `<body>` switché par IntersectionObserver.

## Direction 1 — pacing motion homepage

| # | Section          | Effet d'entrée            | Micro-interaction          |
|---|------------------|---------------------------|----------------------------|
| 1 | BootSplash       | Splash 620ms gone         | —                          |
| 2 | Hero kinetic     | Split text scrub (KineticHeadline · scroll-driven font-weight + scale) | Pulse dot live on `.kick` |
| 3 | Trust marquee    | Slide infinite (95s)      | —                          |
| 4 | Silence quote    | `.reveal-fade` + drop-cap | —                          |
| 5 | Thesis dark      | `.clip-up` sur h2 + `.row-lines` sur grid · **bg ink** | Hair-draw separator |
| 6 | Pyramide 4 tiers | `.scale-in` sur cards + `.row-lines` | `.lift` hover sur card |
| 7 | Departments      | `.reveal-stagger` sur ec-grid | `.lift` hover            |
| 8 | How we ship      | **Sticky pin scrub** (signature de la page) | step opacity scrub  |
| 9 | Cases table      | `.row-lines`              | `.case-row:hover` padding shift |
| 10| Field notes      | `.reveal-stagger`         | `.lift`                   |
| 11| Offices split    | `.reveal-fade`            | `.office:hover` bg shift  |
| 12| CTA band         | **Zoom Reveal** (border-radius morph + scale) — **moment fort** | Magnetic CTA button |
| 13| Sig band         | `.clip-up` sur wordmark   | —                         |

= **2 moments forts** (Sticky pin sur How we ship · Zoom Reveal sur CTA band) bien espacés. Le reste est sobre.

## Direction 3 — pacing motion `/atlas`

| # | Section          | Effet d'entrée                         | Micro-interaction          |
|---|------------------|----------------------------------------|----------------------------|
| 1 | Hero court       | `.reveal-fade`                         | Magnetic CTA               |
| 2 | Atlas grid 2×2   | `.reveal-stagger`                      | **Tilt 3D** sur cards (signature) |
| 3 | Persona switcher | Fade clip-path sur changement persona  | Magnetic                   |
| 4 | Cases derived    | `.row-lines`                           | `.case-row:hover`          |
| 5 | Voronoi map      | `.scale-in`                            | hover spotlight            |
| 6 | Field notes      | `.reveal-stagger`                      | `.lift`                    |
| 7 | CTA              | `.reveal-up`                           | Magnetic                   |

= **1 moment fort** (Tilt 3D Atlas grid). Atlas est plus structurel, moins cinématique.

## Performance budget

- **CLS < 0.1**, **LCP < 2.5s** sur fibre, **INP < 200ms**.
- React islands ≤ 3 par page critique (header, kinetic-headline, sticky-pin).
- Aucune lib motion lourde (Framer Motion, GSAP) — tout est custom léger.
