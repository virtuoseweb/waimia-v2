# 08 · Bibliothèque de composants — Atomic Design rigoureux

> **Charte** : tout pattern qui apparaît **≥ 3 fois** dans le code doit être promu en atome (`src/components/ui/atoms/`) ou en molécule (`src/components/ui/molecules/`). Tout pattern à 1-2 occurrences reste inline — on n'invente pas un atome pour un cas marginal.
>
> Pourquoi : un atome à instance unique alourdit l'API, dérègle la cohérence, et complique le refactoring. La règle des 3 force la sélection des patterns vraiment partagés.

> **Atomic Design rigoureux** (Brad Frost, étendu pour Astro) :
>
> 1. **Atomes** (`src/components/ui/atoms/`) — éléments **indivisibles** : pas d'imports d'autres atomes/molécules, un seul rôle (Kicker, Button, Bi).
> 2. **Molécules** (`src/components/ui/molecules/`) — **composent au moins 1 atome** ou structurent ≥ 2 éléments en unité fonctionnelle (SectionHeader, MetricStrip, EditorialTable).
> 3. **Organismes** (`src/components/ui/organisms/`) — sections complètes d'UI composées de molécules + atomes (Hero, Pyramid, Cases, OperatingLayer, Manifesto…).
> 4. **Templates** (`src/layouts/`) — squelettes de page (Base.astro avec Header + Footer + slot principal).
> 5. **Pages** (`src/pages/`) — instances finales (`/`, `/manifesto`, `/console`, `/atlas`).

---

## Sommaire

1. [Atomes](#atomes-srccomponentsuiatoms)
2. [Molécules](#molécules-srccomponentsuimolecules)
3. [Organismes](#organismes-srccomponentsuiorganisms)
4. [Décisions de design](#décisions-de-design)
5. [Quand créer un atome](#quand-créer-un-atome)

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

### `PillCTA.astro`

CTA pill (border-radius:999px) pour les hero canvas dark. **6 occurrences vérifiées** (manifesto.astro × 2 hero CTAs + 1 Acte III, × 2 EN versions).

Différent de `Button` (qui utilise `.btn` legacy avec padding/font distincts) : `PillCTA` est dédié aux hero terracotta dark.

| Prop      | Type                                        | Défaut     | Description                                                                                   |
| --------- | ------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| `href`    | `string`                                    | —          | URL cible                                                                                     |
| `variant` | `'accent' \| 'ghost-dark' \| 'accent-mono'` | `'accent'` | `accent` (CTA hero principal), `ghost-dark` (CTA hero secondaire), `accent-mono` (CTA Acte ▸) |
| `mag`     | `number`                                    | —          | Force magnétique au survol                                                                    |

**Usage** :

```astro
<PillCTA href="/contact" variant="accent" mag={0.18}>Prendre RDV →</PillCTA>
<PillCTA href="/console" variant="ghost-dark">La plateforme</PillCTA>
<PillCTA href="/console" variant="accent-mono" mag={0.18}>▸ Voir la Console</PillCTA>
```

### `TerminalCTA.astro`

CTA terminal-style (border-radius:6-8px, font-mono) pour `/console`. **8 occurrences vérifiées** (console.astro × 4 → hero CTAs + Acte V CTAs, × 2 EN versions).

Différent de `Button` (rounded 999px) et `PillCTA` (rounded 999px) : ici radius square pour cohérence avec les terminal mockups.

| Prop      | Type                                               | Défaut  | Description                                                                                                                          |
| --------- | -------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `href`    | `string`                                           | —       | URL cible                                                                                                                            |
| `variant` | `'ink' \| 'ink-ghost' \| 'accent' \| 'ghost-dark'` | `'ink'` | `ink` (primaire fond clair), `ink-ghost` (secondaire fond clair), `accent` (primaire fond dark), `ghost-dark` (secondaire fond dark) |
| `size`    | `'md' \| 'sm'`                                     | `'md'`  | `md` (rounded 8px), `sm` (rounded 6px)                                                                                               |
| `mag`     | `number`                                           | —       | Force magnétique au survol                                                                                                           |

**Usage** :

```astro
<TerminalCTA href="#act-3" variant="ink" size="md" mag={0.18}>▸ ouvrir la console</TerminalCTA>
<TerminalCTA href="/contact" variant="ink-ghost" size="md">prendre une séance →</TerminalCTA>
<TerminalCTA href="/contact" variant="accent" size="sm" mag={0.18}>▸ schedule</TerminalCTA>
<TerminalCTA href="mailto:hello@x" variant="ghost-dark" size="sm">hello@x</TerminalCTA>
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

### `EditorialWriteRow.astro`

Row éditorial pour blog/changelog · grid `[date · tag · text · arrow]`. Unifie 3 variantes inline qui existaient :

- `.writing-row` (WritingNotes.astro · paper)
- `.b-write-row` (manifesto.astro · ink, border rgba paper)
- `.c-write-row` (console.astro · paper, border hairline)

**5 instances par fichier × 3 fichiers = 15 rows** consolidées.

| Prop   | Type               | Défaut    | Description                           |
| ------ | ------------------ | --------- | ------------------------------------- |
| `date` | `string`           | —         | Date affichée à gauche                |
| `tag`  | `string`           | —         | Tag/catégorie · ex: `"Field note"`    |
| `href` | `string`           | —         | URL cible                             |
| `tone` | `'paper' \| 'ink'` | `'paper'` | `ink` pour les sections sur fond dark |

**Slot** : `default` · le titre/texte de la ligne.

**Usage** :

```astro
<EditorialWriteRow date="2026-04-15" tag="Field note" href="/blog/x" tone="paper">
  Le pipeline a livré 18% de plus avant le café.
</EditorialWriteRow>
```

### `AsymmetricServiceRow.astro`

Service row qui alterne gauche/droite (signature visuelle de `/manifesto` Acte II). Pattern : grid 4 colonnes `[num · name · body · arr]` qui se renverse en miroir quand `reverse=true`.

**12 instances** (6 services × 2 fichiers fr/en) consolidées.

| Prop      | Type      | Défaut  | Description                                 |
| --------- | --------- | ------- | ------------------------------------------- |
| `num`     | `string`  | —       | Numéro · ex: `"01"`, `"02"`                 |
| `label`   | `string`  | —       | Nom du service                              |
| `body`    | `string`  | —       | Corps descriptif                            |
| `reverse` | `boolean` | `false` | Inverser le sens (alternance gauche↔droite) |

**Usage** :

```astro
{SIX_SERVICES.map((s, i) => (
  <AsymmetricServiceRow num={s.k} label={t(s.label, lang)} body={t(s.body, lang)} reverse={i % 2 === 1} />
))}
```

### `EditorialCaseCard.astro`

Card éditoriale pour cas client (signature visuelle de `/manifesto` Acte IV). Card `paper-2` avec idx+sector + client + stack/impact en 2 colonnes. Padding 18px radius 18px, hover border accent + translateY(-4px).

**8 instances** (4 cas × 2 fichiers fr/en) consolidées.

| Prop       | Type     | Défaut | Description                               |
| ---------- | -------- | ------ | ----------------------------------------- |
| `idx`      | `number` | —      | Index dans la liste (rendu `CASE 0X`)     |
| `client`   | `string` | —      | Nom client                                |
| `sector`   | `string` | —      | Secteur (déjà localisé)                   |
| `stack`    | `string` | —      | Stack tech                                |
| `impact`   | `string` | —      | Texte d'impact (déjà localisé)            |
| `duration` | `string` | —      | Durée du projet · ex: `"6 weeks"`         |
| `href`     | `string` | —      | URL cible                                 |
| `offset`   | `number` | `0`    | Décalage vertical en px (alternance 0/60) |

**Usage** :

```astro
<EditorialCaseCard
  idx={1}
  client="ACME"
  sector="Fintech"
  stack="Claude / HubSpot / Drizzle"
  impact="+€14M pipeline"
  duration="6 weeks"
  href="/cas/acme"
  offset={60}
/>
```

### `EditorialTable.astro`

Frame de table éditoriale terminal-style · header (mono uppercase) + slot pour rows. Border 1px solid ink + radius 10px + head bg paper-2.

Unifie les 2 tables de `/console` : `c-services-tbl` (4 cols) et `c-cases-tbl` (7 cols). Le pattern grid est paramétré via `cols` pour réutilisation.

| Prop      | Type               | Défaut    | Description                                          |
| --------- | ------------------ | --------- | ---------------------------------------------------- |
| `cols`    | `string`           | —         | Grid template columns · ex: `"60px 180px 1fr 120px"` |
| `headers` | `string[]`         | —         | Headers de la table (1 par colonne)                  |
| `tone`    | `'paper' \| 'ink'` | `'paper'` | Tone fond head                                       |

**Slot** : `default` · les rows. Chaque row doit utiliser `class="u-edit-tbl-row"` pour bénéficier du grid + hover.

**Usage** :

```astro
<EditorialTable cols="60px 180px 1fr 120px" headers={['id', 'service', 'description', 'status']}>
  {SIX_SERVICES.map((s) => (
    <a href="..." class="u-edit-tbl-row">
      <span>{s.k}</span>
      <span>{s.label}</span>
      <span>{s.body}</span>
      <span>◉ active</span>
    </a>
  ))}
</EditorialTable>
```

---

## Décisions de design

### Pourquoi ces atomes et pas d'autres ?

L'audit pré-refactor a recensé les patterns récurrents :

| Pattern                                                                                                        | Occurrences avant          | Composant créé                          |
| -------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------- |
| `font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)` | 30+                        | ✅ `Kicker`                             |
| `<div class="chapter-label"><span class="dot"></span><span>FIG X</span>...`                                    | 5                          | ✅ `ChapterLabel`                       |
| `<a class="btn btn-primary btn-lg" data-mag>`                                                                  | 9+ fichiers                | ✅ `Button`                             |
| `<a style="background:var(--accent);...border-radius:999px">` (hero CTAs)                                      | 6                          | ✅ `PillCTA` (atomic-deep)              |
| `<a style="background:var(--ink);...border-radius:8px;font-mono">` (terminal CTAs)                             | 8                          | ✅ `TerminalCTA` (atomic-deep)          |
| `<header class="sec-hd"><div class="n">...<h2>...<p class="aside">`                                            | 9                          | ✅ `SectionHeader`                      |
| Terminal frame `3 dots + label + status + body`                                                                | 4                          | ✅ `TerminalMockup`                     |
| `.b-write-row` + `.c-write-row` + `.writing-row` (date/tag/text/arrow)                                         | 15 instances · 3 variantes | ✅ `EditorialWriteRow` (atomic-deep)    |
| `.b-service-row` asymétrique (signature `/manifesto`)                                                          | 12 instances               | ✅ `AsymmetricServiceRow` (atomic-deep) |
| `.b-case-card` cards décalées (`/manifesto` Acte IV)                                                           | 8 instances                | ✅ `EditorialCaseCard` (atomic-deep)    |
| `.c-services-tbl` + `.c-cases-tbl` (tables terminal `/console`)                                                | 4 frames · 20 rows         | ✅ `EditorialTable` (atomic-deep)       |

Les patterns à 1-2 occurrences (ex : marquee dark de `/manifesto`, hero atlas de `/atlas`, manifesto stats `43`/`<9`/`×4`, FAQ singleton) restent inline. Promouvoir un atome à instance unique alourdit l'API sans bénéfice.

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

## Templates de page (`src/components/templates/`)

Squelettes de page réutilisables pour le contenu Waimia (handoff2). Chaque template est un **organisme** qui compose atomes + molécules + organismes existants, et expose des **slots Astro** pour permettre du JSX riche sans sérialisation.

### `HubTemplate.astro`

Pillar page d'un hub d'offres / hub thématique.

**Mapping handoff2** : `hub-consulting.html` → `/offres/conseil` · `virtuoseos.html` → `/technologies/virtuoseos` (à venir)

**Slots** : `headline`, `lede`, `manifesto` (optionnel), `catalog`, `catalog-meta`, `fit-headline`

**Props clés** : `hubNum`, `stats: Stat[]`, `fitYesItems[]`, `fitNoItems[]`, `relatedCards[]`

**Composé de** · Kicker, Bi, ChapterLabel · StatRow, FitColumns, RelatedCards · CtaBand

Page exemple : `src/pages/offres/conseil.astro`

### `ServiceDetailTemplate.astro`

Page détaillée d'UN service du catalogue (problème → méthode → livrables → preuve).

**Mapping handoff2** : `service-revops.html`, `silo-anthropic.html`, `industry-fintech.html`, `loc-paris.html`

**Slots** : `headline`, `lede`, `problem`, `approach-headline`, `approach-aside`, `deliverables` (optionnel), `stack-lead`

**Props clés** : `serviceNum`, `problemStats[]?`, `steps[]`, `proofMetrics[]?`, `techPills[]`, `relatedCards[]`

**Composé de** · Kicker, Bi · StatRow, ProcessSteps, ProofBand, TechPillRow, RelatedCards · CtaBand

Page exemple : `src/pages/offres/revops.astro`

### `CaseStudyTemplate.astro`

Cas client long-form avec spec bar et témoignage.

**Mapping handoff2** : `case-plateau.html` (et autres cas à venir)

**Slots** : `headline`, `context` (HTML riche), `approach-headline`, `approach-aside`, `stack-lead`

**Props clés** : `caseNum`, `specs[]` (5 typiquement), `steps[]`, `proofMetrics[]`, `techPills[]`, `relatedCards[]`

**Composé de** · Kicker, Bi, ChapterLabel · ProcessSteps, ProofBand, TechPillRow, RelatedCards · CtaBand

Page exemple : `src/pages/ressources/cas/plateau.astro`

### `EssayTemplate.astro`

Article éditorial long-form avec typographie editor (h2, h3, blockquote, p, ul/ol, code).

**Mapping handoff2** : `essay-brain-circuit.html`, `changelog.html`, futurs blog posts

**Slots** : `headline`, `lede`, `body` (rich text)

**Props clés** : `kicker`, `date`, `author`, `readingTime?`, `relatedCards[]`

**Composé de** · Kicker, Bi · RelatedCards · CtaBand

Page exemple : `src/pages/ressources/blog/brain-circuit.astro`

> Décision : `.essay-prose` est le SEUL endroit où on définit des sélecteurs nestés (h2 i, blockquote, etc.) — utilisé dans 1 template uniquement. Pas un cas marginal de variable utility, c'est la stylesheet typographique de l'editor body.

### `ListIndexTemplate.astro`

Index/listing d'éléments (cas, articles, knowledge base, changelog).

**Mapping handoff2** : `cases-index.html`, `writing-index.html`, `knowledge-base.html`, `changelog.html`

**Slots** : `headline`, `lede`, `filters` (optionnel), `list`

**Props clés** : `kicker`

**Composé de** · Kicker · CtaBand. Le `list` slot accepte n'importe quelle molécule de listing (EditorialCaseCard, EditorialWriteRow, etc.).

Page exemple : `src/pages/ressources/cas/index.astro`

---

## Méthode des Slots — Astro hydratation sélective

Tous les templates et la plupart des organismes utilisent **des slots nommés** plutôt que des props string pour le contenu riche.

**Pourquoi** (cf message Simon 2026-04-26 + docs/07-component-patterns.md) :

- Astro pré-rend le contenu statique avant l'envoi (hydratation sélective)
- Pas de sérialisation JSON pour HTML riche (italic, br, strong, lien)
- Indexable GEO/AIO sans coût React
- Permet de mixer Markdown, autres composants Astro, ou JSX inline

**Exemple** :

```astro
<HubTemplate hubNum="02" stats={...}>
  <Fragment slot="headline">
    La couche <i>sans relief</i>, avant que les agents ne touchent à quoi que ce soit.
  </Fragment>
  <Fragment slot="lede">Sept prestations qui...</Fragment>
</HubTemplate>
```

L'`<i>` est rendu en HTML statique côté serveur — aucun JS n'est requis pour le voir, et un crawler LLM (GPT, Perplexity, Google AI Overview) le lit comme du texte enrichi.

---

## Atom `Bi` — bilingue avec deux modes

Pour rester en cohérence avec la méthode Slots :

```astro
{/* Mode 1 · Props string (texte simple) */}
<Bi en="Hello" fr="Bonjour" />

{/* Mode 2 · Slots (JSX riche · recommandé pour HTML structuré) */}
<Bi>
  <Fragment slot="fr">Construire du <i>revenue</i>.</Fragment>
  <Fragment slot="en">Build <i>revenue</i>.</Fragment>
</Bi>
```

L'atome détecte automatiquement le mode utilisé via `Astro.slots.has('fr') || Astro.slots.has('en')`.

---

## Références croisées

- `docs/06-coding-standards.md` § 4 — règles de nommage atomes/molécules
- `docs/07-component-patterns.md` — patterns Slots vs Props (4 patterns + arbre de décision)
- `docs/01-architecture.md` — architecture globale du projet
