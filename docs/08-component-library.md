# 08 · Bibliothèque de composants — Atoms & Molecules

> **Charte** : tout pattern qui apparaît **≥ 3 fois** dans le code doit être promu en atome (`src/components/ui/atoms/`) ou en molécule (`src/components/ui/molecules/`). Tout pattern à 1-2 occurrences reste inline — on n'invente pas un atome pour un cas marginal.
>
> Pourquoi : un atome à instance unique alourdit l'API, dérègle la cohérence, et complique le refactoring. La règle des 3 force la sélection des patterns vraiment partagés.

---

## Sommaire

1. [Atomes](#atomes-srccomponentsuiatoms)
2. [Molécules](#molécules-srccomponentsuimolecules)
3. [Décisions de design](#décisions-de-design)
4. [Quand créer un atome](#quand-créer-un-atome)

---

## Atomes (`src/components/ui/atoms/`)

Les atomes sont les briques minimales : un seul rôle, pas de logique métier, pas de composition.

### `Kicker.astro`

Bande mono uppercase color-muted. Le pattern le plus dupliqué (≥ 30 occurrences avant refactor).

| Prop    | Type                           | Défaut    | Description                                     |
| ------- | ------------------------------ | --------- | ----------------------------------------------- |
| `as`    | `'div' \| 'span' \| 'p'`       | `'div'`   | Élément HTML rendu                              |
| `tone`  | `'muted' \| 'accent' \| 'dim'` | `'muted'` | `accent` = terracotta, `dim` = on-dark .5 alpha |
| `size`  | `number`                       | `11`      | Taille px                                       |
| `class` | `string`                       | `''`      | Classes additionnelles                          |

**Usage** :

```astro
<Kicker>§ 01 · LEDE</Kicker>
<Kicker tone="accent">§ FIG II</Kicker>
<Kicker tone="dim">/feed.xml</Kicker>
```

**Override marges** : utiliser `:global(.ma-class)` car le scoping Astro ne s'applique pas aux composants enfants.

### `ChapterLabel.astro`

Variante du Kicker avec un dot terracotta + numéro + séparateur + titre acte. Pattern récurrent (5 occurrences).

| Prop    | Type               | Défaut    | Description                                           |
| ------- | ------------------ | --------- | ----------------------------------------------------- |
| `num`   | `string`           | —         | Numéro de figure · ex: `"II · 2.0"`, `"FIG IV · 4.0"` |
| `title` | `string`           | —         | Titre de l'acte · ex: `"Acte II — La méthode"`        |
| `tone`  | `'muted' \| 'dim'` | `'muted'` | `dim` pour fond ink                                   |
| `noDot` | `boolean`          | `false`   | Sans dot terracotta                                   |

**Usage** :

```astro
<ChapterLabel num="II · 2.0" title="Acte II — La méthode" />
<ChapterLabel num="FIG IV · 4.0" title="Les preuves" tone="dim" />
```

### `Button.astro`

Wrapper sur les classes legacy `.btn .btn-{primary|ghost|accent|link}` du `global.css`. Centralise variantes + magnetic + accessibility.

| Prop      | Type                                         | Défaut      | Description                        |
| --------- | -------------------------------------------- | ----------- | ---------------------------------- |
| `href`    | `string`                                     | —           | URL si lien                        |
| `variant` | `'primary' \| 'ghost' \| 'accent' \| 'link'` | `'primary'` | Style visuel                       |
| `size`    | `'md' \| 'lg'`                               | `'md'`      | `lg` pour CTA principaux           |
| `mag`     | `number`                                     | —           | Force magnétique au survol (0-0.3) |
| `as`      | `'a' \| 'button'`                            | `'a'`       | Forcer `<button>` pour les forms   |
| `type`    | `'button' \| 'submit' \| 'reset'`            | `'button'`  | Pour `<button>`                    |

**Usage** :

```astro
<Button href="/contact" variant="primary" size="lg" mag={0.18}>Réserver →</Button>
<Button href="mailto:hello@x" variant="ghost">hello@x</Button>
<Button as="button" type="submit" variant="accent">Envoyer</Button>
```

### `MastheadRow.astro`

Newspaper meta row : `Vol. 03 · Paris/Genève · Bilingue · Booking T2`. Un atome dédié à un pattern fixe (1 occurrence en hero, mais pattern stable et réutilisable).

| Prop    | Type     | Défaut |
| ------- | -------- | ------ |
| `class` | `string` | `''`   |

**Usage** :

```astro
<MastheadRow />
```

---

## Molécules (`src/components/ui/molecules/`)

Les molécules composent ≥ 2 atomes ou éléments structurés. Elles ont un rôle UI complet.

### `SectionHeader.astro`

Header standard d'une section · grid 1.3fr 1fr (legacy `.sec-hd`). Le pattern le plus dupliqué (≥ 7 occurrences avant ce refactor).

| Prop    | Type                | Défaut     | Description                                       |
| ------- | ------------------- | ---------- | ------------------------------------------------- |
| `roman` | `string`            | —          | Numéro romain terracotta · ex: `"II"`, `"FIG IV"` |
| `label` | `string`            | —          | Texte mono uppercase à côté du roman              |
| `id`    | `string`            | —          | id du `<h2>` pour `aria-labelledby`               |
| `tone`  | `'accent' \| 'dim'` | `'accent'` | `dim` sur fond ink                                |

**Slots** :

- `default` ou `heading` · contenu du `<h2>`
- `aside` · texte court à droite (optionnel)
- `chapter` · alternative complète au bloc kicker

**Usage** :

```astro
<SectionHeader roman="II" label="Acte II — La méthode" id="pyramid-h2">
  <Fragment slot="heading">Quatre <i>paliers</i>, une seule architecture.</Fragment>
  <Fragment slot="aside">Du diagnostic à l'infrastructure souveraine.</Fragment>
</SectionHeader>
```

### `ShipmentRow.astro`

Ligne unifiée pour les feeds de shipments / blog rows. Date + tag + titre + arrow.

| Prop      | Type               | Défaut    |
| --------- | ------------------ | --------- |
| `date`    | `string`           | —         |
| `tag`     | `string`           | —         |
| `href`    | `string`           | —         |
| `tone`    | `'paper' \| 'ink'` | `'paper'` |
| `compact` | `boolean`          | `false`   |

**Slot** : `default` · le titre/texte de la ligne.

### `TerminalMockup.astro`

Frame de terminal/console · 3 dots + label + status + body en slot. 4 variantes inline existaient (OperatingLayer, /manifesto, /console hero, /console reel) → unifiées ici.

| Prop          | Type               | Défaut  |
| ------------- | ------------------ | ------- |
| `label`       | `string`           | `''`    |
| `status`      | `string`           | `''`    |
| `tone`        | `'ink' \| 'paper'` | `'ink'` |
| `bodyPadding` | `number`           | `14`    |

**Slot** : `default` · le contenu de la console (commandes, logs, table…).

**Usage** :

```astro
<TerminalMockup label="virtuoseos · plateau-saas" status="◉ live" tone="ink">
  <pre>$ virtuose ship pipeline.agent</pre>
</TerminalMockup>
```

### `Footnotes.astro`

Bar éditoriale de footnotes · `[mark, text]` items.

| Prop    | Type                                    |
| ------- | --------------------------------------- |
| `items` | `Array<{ mark: string, text: string }>` |
| `tone`  | `'paper' \| 'ink'`                      |

**Usage** :

```astro
<Footnotes items={[
  { mark: '¹', text: 'Tous les chiffres re-mesurables sous NDA.' },
  { mark: '²', text: 'Claude Opus 4.7 · Sonnet 4.6 · Haiku 4.5.' },
]} />
```

### `MetricStrip.astro`

Wrapper sur la classe legacy `.metrics` · 4 chiffres clés en grille.

| Prop      | Type                                             | Défaut    |
| --------- | ------------------------------------------------ | --------- |
| `metrics` | `Array<{ k: string, n: string, label: string }>` | —         |
| `tone`    | `'paper' \| 'ink'`                               | `'paper'` |
| `reveal`  | `boolean`                                        | `true`    |

**Usage** :

```astro
<MetricStrip metrics={[
  { k: '01', n: '120+', label: 'agents shipped' },
  { k: '02', n: '€14M', label: 'pipeline added' },
]} />
```

---

## Décisions de design

### Pourquoi ces atomes et pas d'autres ?

L'audit pré-refactor a recensé les patterns récurrents :

| Pattern                                                                                                        | Occurrences avant | Atome créé          |
| -------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------- |
| `font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)` | 30+               | ✅ `Kicker`         |
| `<div class="chapter-label"><span class="dot"></span><span>FIG X</span>...`                                    | 5                 | ✅ `ChapterLabel`   |
| `<a class="btn btn-primary btn-lg" data-mag>`                                                                  | 9+ fichiers       | ✅ `Button`         |
| `<header class="sec-hd"><div class="n">...<h2>...<p class="aside">`                                            | 7+                | ✅ `SectionHeader`  |
| Terminal frame `3 dots + label + status + body`                                                                | 4                 | ✅ `TerminalMockup` |

Les patterns à 1-2 occurrences (ex : marquee dark de `/manifesto`, `chapter-label` simple de `WritingNotes`) restent inline. Promouvoir un atome à instance unique alourdit l'API sans bénéfice.

### Comment styler un atome rendu par un sous-composant ?

Astro applique le scoping CSS au composant **où** la balise est déclarée. Si un atome est rendu par un sous-composant et que vous voulez ajouter une marge depuis le parent, le sélecteur CSS scoped ne fonctionne pas.

**Solution** :

```astro
<style>
  /* :global pour cibler une classe rendue par un sous-composant */
  :global(.manifesto-acte-iv){margin-bottom:32px}
</style>
```

Voir : `src/pages/manifesto.astro` et `src/pages/console.astro`.

### Slots vs props

- **Slot** quand le contenu peut contenir du JSX riche (italic, br, conditionnels) → `SectionHeader`, `TerminalMockup`, `Button`.
- **Props string** quand le contenu est une chaîne simple → `ChapterLabel.num`, `MastheadRow`.

Voir aussi : `docs/07-component-patterns.md` § 4 patterns + arbre de décision.

---

## Quand créer un atome

Avant de créer un atome, répondre à ces 3 questions :

1. **Le pattern apparaît-il déjà 3 fois ou plus ?** Sinon, garder inline. La règle des 3 évite les abstractions prématurées.
2. **Le pattern est-il stable ?** Si vous prévoyez des variantes substantielles à chaque usage, l'atome devra avoir trop de props et perdra son intérêt.
3. **L'API tient-elle en 5 props max ?** Au-delà, c'est probablement deux atomes différents.

Si oui aux 3 questions → créer l'atome. Sinon → laisser inline (et documenter pourquoi en commentaire si la duplication semble suspecte).

---

## Références croisées

- `docs/06-coding-standards.md` § 4 — règles de nommage atomes/molécules
- `docs/07-component-patterns.md` — patterns Slots vs Props (4 patterns + arbre de décision)
- `docs/01-architecture.md` — architecture globale du projet
