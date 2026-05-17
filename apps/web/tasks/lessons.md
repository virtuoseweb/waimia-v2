# Lessons

## Master Plan « Site Ready »

- Pour une mission de planification multi-sessions sur Waimia, croiser `docs/16-EXECUTION-TRACKER.md` avec `docs/SESSION-HANDOFF-PHASE-1.md` avant de planifier : le tracker garde 94 tâches ouvertes, mais le handoff clôt déjà 9/9 batchs Phase 1 Design ; sinon on risque de réouvrir des chantiers déjà fermés.
- Si `docs/SESSION-HANDOFF-CURRENT.md` n’existe pas, le créer explicitement dans la même session que le plan maître ; sans ce relais, la continuité entre sessions reste dépendante d’un handoff historique figé et le prochain agent repart en exploration.
- Pour le header Waimia, cacher un mega menu ou le sheet mobile uniquement en CSS ne suffit pas : il faut synchroniser `aria-hidden` et `inert`, puis rendre le focus au trigger sur `Escape` pour conserver un parcours clavier continu.
- Dans `Breadcrumb.astro`, forcer le dernier item en `aria-current="page"` même si un `href` est fourni évite de rendre la page courante cliquable et stabilise le contrat d’accessibilité côté templates.

## Batch H — Legacy templates + dead code elimination

- `src/pages/ecole/cours/[slug].astro` lisait déjà la collection `courses` ; la migration vers `CourseDetailTemplate` ne demande que le contrat canonique `entry + lang + slot`, sans wrapper `Base` supplémentaire puisque le template l'embarque déjà.
- Pour qualifier un composant supprimable dans `src/`, distinguer consommateurs runtime (imports / balises Astro) et simples mentions textuelles dans le showcase ou les commentaires ; `MetricStrip` n'avait plus d'usage direct mais restait cité hors périmètre.
- En shell Zsh, toujours protéger les chemins contenant `[...]` dans `sed`, `git diff` ou équivalent pour éviter l'expansion de glob.

## T6.5 — Guarantees MDX Waimia

- Pour la collection `guarantees`, garder le nom de fichier MDX strictement aligne sur le `slug` frontmatter simplifie les usages futurs de `getEntry()` et evite toute couche de mapping editoriale.
- Quand une mission propose des exemples de `related_offres` mais demande de verifier les vrais slugs du depot, prendre les slugs reels de `src/content/offres/*.mdx` avant redaction pour eviter une erreur Zod evitable.

## T9.2 — Articles blog bilingues

- Quand une mission impose un frontmatter « exact » avec de nouvelles valeurs éditoriales, vérifier tout de suite le schéma `blog` : ici `editorialType` n'acceptait pas `Note` ni `Review`, donc il fallait étendre l'enum avant de laisser l'orchestrateur valider.
- Pour des MDX bilingues avec volume cible par langue, compter séparément les mots FR et EN après le séparateur `---` ; un contrôle visuel suffit rarement à repérer qu'une version EN reste juste sous le plancher.

## T5.3 — Comparisons collection + routes /comparer

- Pour un miroir EN `src/pages/en/...` derive dun snippet FR, il faut adapter les imports relatifs et prefixer les hrefs en `/en`, meme si la logique de langue reste partagee via `langFromPath`.
- Sur une collection MDX a frontmatter tres contraint, un parse YAML local via Node avant livraison permet de verifier vite les longueurs SEO, les verdicts et le nombre de dimensions sans lancer le build.

## T2.5 — Design system showcase FR/EN

- Pour un miroir EN de design system Astro, un fichier plus court reste acceptable s’il conserve la même navigation logique, des imports strictement réels et au moins un échantillon valide des composants et sections stratégiques.
- Quand une mission demande une démo motion « réelle », montrer explicitement `data-mag="0.18"` dans le markup et des classes reveal existantes évite de laisser la preuve cachée derrière un prop ou un composant intermédiaire.
- `npm run build` peut passer alors que `astro check` reste rouge pour des erreurs typées historiques hors périmètre ; documenter précisément les fichiers bloquants évite de confondre dette existante et régression du patch courant.

## T6.4 — Proof points inline

- Pour la collection `proofPoints`, garder le nom de fichier MDX strictement aligné sur le `slug` frontmatter permet d’utiliser `getEntry('proofPoints', slug)` sans couche de mapping supplémentaire dans les composants éditoriaux.
- Quand une mission impose un body MDX vide, fermer le frontmatter immédiatement après `publishedAt` évite d’introduire du contenu parasite ou des sauts de section involontaires.

## T5.2 — Collection integrations

- La collection `integrations` du Tier 5 duplique volontairement le slug en frontmatter et en nom de fichier ; pour les routes Astro, garder `entry.id` pour `getStaticPaths()` et les hrefs tant que les fichiers restent plats dans `src/content/integrations/`.
- Le snippet d’index fourni pour `/integrations` déclare un `byCategory` non rendu ; le supprimer ou le remplacer par un tri explicite évite de laisser du frontmatter mort dans les pages Astro.

## T4.5 — Knowledge-Base RAG-ready

- Pour une collection `knowledge-base` destinée au RAG, chaque `##` doit pouvoir vivre seul : éviter les ouvertures dépendantes d'une conclusion globale et expliciter les métriques ou phases dans la section elle-même.
- Quand une mission impose un frontmatter « exact », valider hors build les longueurs de `summary` et les volumes de body avec un script local avant livraison ; c'est plus fiable qu'un contrôle visuel sur 10 MDX.

## T4.3 — Bibliothèque prompts

- Pour la collection `prompts`, tous les champs texte longs du frontmatter (`purpose_*`, `system_prompt_*`, `sample_output_*`) doivent rester en YAML bloc (`|` ou `>-`) ; les versions quoted sur une ligne cassent vite la lisibilité et la vérification manuelle.
- Tant qu’aucune route détail `/agence/prompts/[slug]` n’existe, l’index doit rendre des cartes non cliquables plutôt que fabriquer des liens morts depuis la bibliothèque.

## V9-D-FR — Copywriting FR éditorial

- Quand une mission demande de préserver les bodies MDX, limiter les changements content collections aux champs explicitement cités (`title_fr`, `description_fr`, `lead_fr`) et ne pas corriger les `<Bi fr=...>` ni les FAQ frontmatter hors périmètre.
- Les pages Astro d'offres mélangent souvent `*_fr`, `*_en` et slots FR dans le même fichier : modifier uniquement les chaînes FR et laisser les champs `*_en` intacts, même quand un grep jargon remonte ces champs.
- Les composants partagés peuvent afficher des textes venant de `src/data/sitemap.ts` plutôt que du composant lui-même ; vérifier les constantes rendues par `Hero`, `SixServices` et les sections home/offres avant de considérer l'audit terminé.
- `astro check` et `pnpm build` peuvent rester verts avec des warnings/hints existants (collections MDX vides, `z` déprécié, import CSS) ; les noter comme hors périmètre si la mission ne touche que la copie.

## V9-M — Motion polish profond

- Astro ViewTransitions exige un `transition:name` unique par page ; pour les continuités card → détail, utiliser `card-${slug}` sur la card source et sur le hero détail, puis réserver `hero-h1-${slug}` et `hero-img-${slug}` aux éléments hero internes.
- Charger `gsap/SplitText` en lazy uniquement quand `.reveal-split-letter` existe évite de pousser SplitText dans le bundle initial ; en `prefers-reduced-motion`, ne pas importer SplitText et laisser les titres non splittés.
- Avec l'adapter Vercel, `astro preview` est indisponible localement ; pour QA visuelle après `pnpm build`, utiliser `astro dev` ou servir `dist/client` en statique selon le besoin.
- Le pattern V8-H `ScrollTrigger.getAll().forEach((t) => t.kill())` doit rester dans les trois pages signature avant chaque réinitialisation GSAP.

## V9-L — CRO copywriting pages signature

- Les routes `/en/offres/*` n'existent pas dans `apps/web` ; quand une mission demande à la fois de ne pas toucher `/en/*` et d'adapter le bilingue, garder les champs `*_en` déjà présents dans les pages FR, sans créer ni modifier de route `/en`.
- `ConversionFunnelTemplate.astro` est dédié au flagship `/offres/site-web-ia` ; l'étendre avec des props optionnelles de href CTA et des slots nommés (`hero-benefits`, `hero-proof`) préserve les slots existants et évite un patch JavaScript sur les liens du hero.
- Pour ajouter du CRO page-spécifique aux pages `OffresDetailTemplate`, privilégier les slots `related` et `body-end` avec des sections hairline autonomes ; ne pas toucher `Header`, `Footer` ou `Base` pour une mission de copywriting.

## V9-A — Navigation interne

- `Breadcrumb.astro` injecte déjà le JSON-LD `BreadcrumbList` ; quand il est ajouté aux templates, éviter de supprimer les breadcrumbs hero historiques sans demande explicite afin de préserver le rendu existant.
- Les routes ressources prerender avec `getStaticPaths()` doivent passer uniquement les arguments attendus par leurs helpers locaux ; `astro check` signale immédiatement les restes d’anciennes signatures.

## V8-I — Migration SSG des routes content dynamiques

- Dans un fichier Astro, `getStaticPaths()` est exécuté en contexte module : les helpers non exportés du frontmatter peuvent disparaître du chunk de pré-rendu. Garder les helpers nécessaires dans `getStaticPaths()` ou les exporter explicitement.
- Les collections content vides (`cookbooks`, `livresBlancs`, `veilleIA`, `outils`, `pages`) peuvent déclencher des messages Astro pendant le build ; `getCollection()` retourne tout de même une liste exploitable et `getStaticPaths()` peut retourner `[]`.
- Pour les routes agrégées catégorie/tag/silo, pré-calculer les `items` dans les props statiques évite de relire les collections au runtime et conserve le rendu HTML attendu.

## V9-C — GEO structured data + llms.txt

- `astro.config.mjs` contient déjà `sitemap({ i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en-US' } } })` ; ne pas le modifier si la mission demande seulement de l'ajouter si manquant.
- Les pages offres historiques ne passent pas toutes de JSON-LD au template ; `OffresDetailTemplate.astro` doit donc générer un `Service` + `Offer` minimal depuis ses props existantes et exposer `additionalJsonLd` sans toucher `src/pages/*`.
- `EssayTemplate.astro` reçoit parfois une date déjà localisée depuis les routes dynamiques ; pour un Article schema plus précis, garder des props optionnelles `datePublished` / `dateModified` plutôt que forcer une conversion fragile.

## V8-D — HubTemplate polish

- `HubTemplate.astro` est consommé par `/offres/conseil` et `/technologies/virtuoseos` via les mêmes props et slots ; le polish doit donc rester dans le template, sans modifier les pages appelantes.
- Pour remplacer `StatRow` par `KeyMetric` sans perdre la parité FR/EN, dériver le label avec `langFromPath(Astro.url.pathname)` plutôt que concaténer `label_fr` et `label_en`.
- Les composants slottés `ServiceCatalogRow`, `FitColumns` et `RelatedCards` peuvent être polis depuis le parent avec des classes passées au wrapper et des sélecteurs `:global(...)`, ce qui évite de toucher les molécules déjà utilisées ailleurs.

## V8-C — ConversionFunnelTemplate polish

- `ConversionFunnelTemplate.astro` ne consomme pas `Astro.slots.render()` : les slots nommés doivent rester rendus en `<slot name="...">` pour préserver l'API des pages existantes.
- Les props anglaises de preuve (`proofQuoteEn`, `proofAttrEn`) appartiennent toujours à l'interface publique même si le rendu actuel est francophone ; ne pas les retirer de `Props`.
- Pour passer les étapes à `Timeline`, générer des événements dérivés depuis `steps` et typer `variant` avec `as const`, comme sur les autres templates polis.

## V8-B — LeadMagnetTemplate polish

- `LeadMagnetTemplate.astro` ne consommait que les slots `headline`, `lede` et `extra` ; les rendre via `Astro.slots.render()` permet d'ajouter des wrappers éditoriaux sans changer les props publiques ni perdre le rendu serveur du contenu slotté.
- Le formulaire lead magnet est l'API critique du template : conserver `method="post"`, `action="/api/lead-magnet"`, `name="lead-magnet"` et les noms d'inputs (`slug`, `email`, `company`, `role`) avant toute retouche visuelle.
- `Timeline.astro` exige un `body` pour chaque événement ; pour transformer le `toc` historique en timeline, fournir un corps court généré et typer `variant` en union littérale avec `as const`.

## V8-A — TechnologiesDetailTemplate polish

- `TechnologiesDetailTemplate.astro` consomme historiquement les slots `capabilities`, `when-use`, `when-avoid`, `integration-nodes` et `ecosystem` ; ajouter des alias (`capabilities-grid`, `when-to-use`, `when-not-to-use`, `integration-flow`, `ecosystem-grid`) côté template évite de casser les pages existantes.
- `EditorialTable.astro` attend des lignes structurées en props, pas des `<tr>` slottés ; parser le slot `models-rows` permet de l'utiliser tout en conservant un fallback table HTML.
- Pour convertir l'ancien flow horizontal en `Timeline`, typer explicitement `variant: 'highlight' as const` / `'default' as const` afin de satisfaire `astro check`.

## V5-E — Polish hubs restants

- Les hubs ressources dynamiques (`categorie`, `tag`, `silo`) n'importent pas tous `CtaBand` par défaut ; l'ajouter au frontmatter avant d'insérer le composant juste avant `</Base>`.
- Pour les routes Astro avec `[...]` dans le chemin, protéger les chemins shell avec des guillemets afin d'éviter l'expansion Zsh.

## V4-F3 — Author CV signature

- Le frontmatter `bio_fr` / `bio_en` peut contenir du Markdown brut ; quand il est rendu hors pipeline MDX dans un template Astro, nettoyer au minimum les marqueurs `**` pour éviter qu'ils apparaissent dans le hero.
- `Timeline.astro` type strictement `variant` en union littérale ; les tableaux construits par `.map()` doivent renvoyer `variant: 'highlight' as const` / `'default' as const` pour passer `astro check`.
- `Base.astro` rend déjà le `<main id="main">` global ; les templates enfants doivent utiliser un wrapper neutre (`div`) et ne pas imbriquer un second `<main>`.

## V4-F2 — SolutionsDetailTemplate polish

- Les slots optionnels Astro doivent être normalisés avec `?? ''` avant parsing : `Astro.slots.render()` peut rendre `undefined` en runtime même quand `astro check` passe.
- Les pages secteurs ne fournissent pas toujours de slot `stack` ; garder un fallback éditorial dans le template évite une section « Outils déployés » vide.

## V4-F1 — OffresDetailTemplate polish

- Les trois pages `offres/*` utilisent encore des slots HTML, pas des props structurées : parser les slots côté template permet d'adopter `Timeline`, `KeyMetric` et la grille 12 colonnes sans casser les instances.
- Les sections ajoutées par le slot `related` doivent être polies via wrapper CSS global ou rendu conditionnel template ; ne pas supposer que le template peut transformer directement tout contenu slotté en composants.
- Les offsets `start-9/start-10` ajoutés localement doivent être neutralisés sur tablette, car `grid.css` ne reset que `start-1` à `start-8`.

## V4-E1 — SVG geometric

- Dans les composants Astro SVG, éviter les objets spreadés pour les attributs SVG typés (`stroke-linecap`, `vector-effect`) : `astro check` infère souvent `string` trop large. Préférer les attributs explicites sur chaque primitive.
- Les composants décoratifs réutilisables gardent `aria-hidden="true"` par défaut ; les diagrammes informatifs doivent porter `role="img"` et un `aria-label` complet.

## V4-D — Scroll reveal motion

- `Base.astro` contient deja un observer inline historique qui ajoute `.in` aux classes reveal existantes ; pour V4-D, ajouter le nouveau module `.is-visible` sans supprimer ce comportement hors perimetre.
- Le test local `curl -s http://localhost:4321/ | grep -c "scroll-reveal"` attend la presence du nom dans le HTML servi, pas une inspection visuelle.

## B9 — Skill article-add

- Le schéma blog attend `author: reference('authors')` sous forme de slug nu, et `cluster` est optionnel : omettre le champ si aucun cluster n'est validé plutôt que générer `null`.
- Les skills versionnés restent sous `apps/web/skills/` ; ne pas les copier automatiquement vers `~/.claude/skills/`.

## M2 — Solutions horizontales

- Le layout `Base.astro` rend déjà `Header` et `Footer`; les pages hub sous `Base` ne doivent pas les rendre une seconde fois.
- `Departments.astro` porte encore un libellé « Six métiers » alors que `DEPARTMENTS_GRID` contient 5 entrées M1 ; ne pas le réutiliser dans le hub M2 tant que ce composant n'est pas recadré.
- Les noms de modèles et outils techniques restent cantonnés aux colonnes `wf-model` et à la stack ; en surface, préférer « IA génératives » ou « assistants IA ».

## M3 — Offres

- Le layout `Base.astro` rend déjà `Header` et `Footer`; les hubs qui l'utilisent ne doivent pas les importer/rendre à nouveau, même si un snippet de mission montre ces composants explicitement.
- `OffresDetailTemplate.astro` est traité comme fixe pour M3 : les nouvelles pages doivent adapter leur contenu aux slots existants plutôt que modifier le template.

## M4 — Home business-first

- `FAQ.astro` ne contient pas d'accordéon ni de compteur hardcodé ; le texte « Sept questions » venait de `index.astro`.
- Le grep jargon M4 couvre tous les organisms, pas seulement ceux rendus par la home : `AtlasGrid.astro` et `PersonaSwitcher.astro` peuvent remonter même hors parcours principal.
- `Departments.astro` doit rester indexé sur `DEPARTMENTS_GRID` et ses slugs `/solutions/*` ; ne plus réintroduire de wording « métier » dans ce composant.

## B5 — Auteurs articles

- Les loaders article doivent accepter les deux formes auteur pendant la transition B4 : `reference('authors')` via `id`/`slug`, legacy string, legacy `{ name, url }`.
- `EssayTemplate`, `CaseStudyTemplate` et `LeadMagnetTemplate` ne doivent pas être modifiés pour les bylines : injecter dans les slots existants (`body`, `context`, `extra`).
- `AuthorCard` doit rester silencieux si l'auteur n'est pas résolu ; `AuthorByline` garde au moins date / reading time quand disponibles.

## B4 — Références auteurs

- Avec `reference('authors')`, le frontmatter doit contenir le slug auteur nu (`author: simon-beros`), pas l'objet legacy `{ name, url, bio }`.
- Les collections sans contenu MDX existant peuvent être migrées côté schéma sans migration de fichiers ; vérifier la liste via `find src/content -name "*.mdx" -not -name ".gitkeep"`.
