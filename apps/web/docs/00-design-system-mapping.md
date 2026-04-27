# 00 · Design System Mapping

> Mapping entre `handoff/waimia/project/parts/ds-tokens.css` et `site/src/styles/tokens.css`.
> Source de vérité = handoff DS. **Ne jamais inventer un token sans le déclarer ici d'abord.**

## Univers

Le DS Waimia n'est **pas** un dark minimal tech (Linear/Vercel-like). C'est un **parchemin éditorial avec accent terracotta**, dans la lignée de :
- Anthropic Design (claude.ai/design) — la nouvelle identité parchment-warm.
- Are.na, Cabin, vinyl-edition, manifesto-grade typography.
- Slow tempo (`--reveal-slow: 1400ms`) — contemplation > excitation.

Les sections « Thesis » dark (`var(--ink)` background) sont des **respirations** qui rythment les chapitres, pas la dominante.

## Palette

| Token       | Hex       | Sémantique                          |
|-------------|-----------|-------------------------------------|
| `--paper`   | `#F6F1E8` | Background principal · parchemin    |
| `--paper-2` | `#EFE9DD` | Background subtil (hover, sections) |
| `--paper-3` | `#E6E0D0` | Background relevé (cards)           |
| `--ink`     | `#0C0B09` | Foreground principal · near-black   |
| `--ink-2`   | `#1A1814` | Texte secondaire foncé              |
| `--ink-3`   | `#2B2620` | Texte tertiaire foncé               |
| `--muted`   | `#6B6560` | Texte muté                          |
| `--muted-2` | `#9A948D` | Texte très muté                     |
| `--accent`  | `#C94F2E` | Terracotta · interactif, accents    |
| `--accent-2`| `#A83D20` | Hover accent                        |

## Typographie · trinité

- **Display** : `Instrument Serif` (italic-friendly, weight 400 uniquement). Headlines, citations, drop-caps.
- **Sans** : `Inter Tight` (weights 100-900). Body, UI, navigation. Activer feature-settings `"ss01","cv11"`.
- **Mono** : `JetBrains Mono` (10-13px, tracking 0.12-0.22em). Kickers, fig labels, chapter labels, technical content.

**Interdits** : Inter (le « plain »), Space Grotesk, Geist, IBM Plex. Le brief les exclut.

## Échelle typo (clamp)

```
--text-display-xl: clamp(72px, 14vw, 240px)   → hero kinetic
--text-display-lg: clamp(56px, 9vw, 148px)    → thesis dark
--text-display-md: clamp(44px, 6vw, 96px)     → section h2
--text-display-sm: clamp(36px, 5vw, 64px)     → section h3
--text-display-xs: clamp(28px, 3vw, 44px)
--text-body-lg: 21px · --text-body-md: 17px · --text-body-sm: 14px · --text-body-xs: 13px
--text-mono-lg: 13px · --text-mono-md: 11px · --text-mono-sm: 10.5px · --text-mono-xs: 10px
```

## Composant unifié · `.editorial-cell`

Remplace 5 anciennes variantes (pyra-tier, dept, fn-card, case-row, office, how-row).
Structure obligatoire :

```html
<div class="editorial-cell">
  <span class="e-num">I</span>           <!-- chiffre romain optionnel -->
  <span class="e-tag">CONSEIL</span>     <!-- kicker mono uppercase -->
  <h3 class="e-title">Audit & Stratégie</h3>
  <p class="e-body">Lead court, 2 lignes max.</p>
  <ul class="e-list">…</ul>
  <span class="e-go">Lire →</span>
</div>
```

Wrapper grid : `<div class="ec-grid cols-4">…</div>` (cols-2/3/4/5 disponibles).

## Easing curves

- `--ease`       = `cubic-bezier(0.22, 1, 0.36, 1)` — défaut
- `--ease-out`   = `cubic-bezier(0.16, 1, 0.30, 1)` — sorties
- `--ease-sharp` = `cubic-bezier(0.20, 0, 0.00, 1)` — accents

## Mapping Tailwind v4 (CSS-first)

Les tokens DS sont exposés à Tailwind via `@theme` dans `src/styles/tokens.css`.
Cela permet d'écrire `class="text-ink bg-paper border-hairline"` tout en restant fidèle au DS.

| DS token         | Tailwind utility                |
|------------------|---------------------------------|
| `--paper`        | `bg-paper` / `text-paper`       |
| `--ink`          | `bg-ink` / `text-ink`           |
| `--accent`       | `bg-accent` / `text-accent`     |
| `--muted`        | `text-muted`                    |
| `--font-display` | `font-display`                  |
| `--font-sans`    | `font-sans`                     |
| `--font-mono`    | `font-mono`                     |

## Règles d'override

- Si un besoin n'a pas de token → **stop, signaler à Simon, ne pas inventer**.
- Les classes legacy (`.editorial-cell`, `.case-row`, `.hdr`, `.mega`, `.btn`, `.signature-grid`) sont **portées telles quelles** dans `global.css` car elles encodent du comportement non trivial.
- Les composants Astro/React utilisent en priorité les classes legacy + Tailwind comme glue.
