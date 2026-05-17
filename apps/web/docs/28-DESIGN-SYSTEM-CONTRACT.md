# 28 — Design System Contract

## Section 0 · Statut + sommaire

**Statut** : ✅ FIGÉ 2026-05-17

**Mandat Simon verbatim** : « cadre déterministe et fix · contrat parfait qui suit les meilleures pratiques de développement web, d'accessibilité, de performance, de design, de style, et de SEO/GEO. Le design system doit plus être libre mais déterminé et fix. »

**Portée** :
- Ce document est le contrat opérationnel du design system Waimia.
- Il ne remplace pas les cartographies et audits ; il les verrouille en règles exécutables.
- Toutes les sources requises étaient présentes au moment du gel.

**Axes obligatoires** :
1. Structure
2. Props
3. Styles
4. Accessibilité
5. Performance
6. SEO / GEO
7. Style
8. Telemetry + Monitoring

**Workflow modification + CI spec** :
- Toute modification de composant global suit la procédure §9.
- Tout verrouillage automatisé suit la spec minimale §10.
- Toute divergence entre rendu réel et documentation est tranchée par les sources de vérité §11.

**Sources lues et à référencer en cas d'arbitrage** :

| Source | Rôle |
|---|---|
| `docs/17-COMPONENTS-CARTOGRAPHY.md` | Première cartographie composants |
| `docs/18-DESIGN-SYSTEM-CARTOGRAPHY.md` | Audit brut tokens, doublons, anti-patterns |
| `docs/19-DESIGN-SYSTEM-CLOSED.md` | Système fermé, tiers, procédures |
| `docs/20-DESIGN-SYSTEM-CATALOGUE-PLAN.md` | Plan showcase `/agence/design-system` |
| `docs/29-STACK-DECISION.md` | Stack canonique Astro et doctrine islands |
| `docs/31-COMPONENTS-DOUBLONS-MAPPING.md` | Inventaire 147 composants, doublons, dead code, batchs |
| `docs/32-TEMPLATES-DEEP-AUDIT.md` | Audit 19 templates, familles canoniques |
| `docs/33-PAGES-TAXONOMY-AUDIT.md` | Audit pages, drift design, batchs de remédiation |

Références principales : `docs/18§A.0`, `docs/19§B.0`, `docs/20§C.5`, `docs/29§Décision finale`, `docs/31§1`, `docs/32§4`, `docs/33§6`.

---

## Section 1 · Axe Structure

**Principe** : la taxonomie atomique est obligatoire et fermée. Aucun composant nouveau ne contourne cette grille.

| Couche | Définition stricte | Règle d'usage |
|---|---|---|
| `atoms` | Primitive unique, sans logique métier, sans composition lourde | Bouton, kicker, label, helper bilingue |
| `molecules` | Assemblage court de primitives réutilisables | Breadcrumb, proof row, cards, form rows |
| `organisms` | Assemblage riche encore légitime quand l'identité de page l'exige | Réservé aux signatures ou cas déjà validés |
| `sections` | Bloc composable de page, autonome, prop-driven, prêt pour showcase | Cible par défaut pour toute nouvelle structure de page |
| `templates` | Coque de taxonomie ou de collection | Doit converger par famille, pas diverger page par page |
| `editorial` | Atomes de corps long-form | Utilisables dans MDX et templates éditoriaux |
| `motion` | Effet visuel ou animation encapsulée | Autorisé seulement si utile et contrôlable |
| `seo` | Helpers de rendu sémantique ou JSON-LD | Centralisés, sans duplication métier |

**Règles de structure** :
- Toute idée réutilisable est promue dès la 1re utilisation si son intent dépasse la page locale.
- Le composant canonique est celui qui gagne sur trois critères cumulatifs : meilleur rendu, propreté tokens, accessibilité vérifiable.
- Les `sections` sont la cible par défaut pour les nouveaux patterns de page ; les `organisms` ne servent pas de refuge pour des sections non normalisées.
- Les différences offre / solution / technologie / ressource doivent passer par la donnée, les slots et des variants documentés, pas par de nouvelles coques concurrentes.
- Les doublons confirmés ou legacy ne peuvent plus recevoir de nouveaux usages.

**Doctrine de promotion** :
- Usage unique mais concept réutilisable : promotion immédiate.
- Usage unique et concept non réutilisable : rester local à la page.
- Doute : arbitrer au profit de la couche la plus basse qui conserve la lisibilité.

**Verdicts structurels déjà actés** :
- Référentiel composants réel : `147` composants mesurés, pas `114` (`docs/31§1`, `docs/31§2`).
- Famille détail : convergence vers une seule coque canonique par famille (`docs/32§4.1`).
- Famille hub / index : éviter la répétition des hubs customs quasi identiques (`docs/32§4.3`, `docs/33§3.5`).
- Pages secteurs statiques legacy : hors contrat, à éliminer (`docs/33§2.3`, `docs/33§5.1`).

**Élimination des doublons** :
- La liste précise, les candidats sûrs, les batchs et l'ordre d'attaque sont externalisés dans `docs/31§3`, `docs/31§5`, `docs/31§6`, `docs/31§7`.
- Le présent contrat interdit toute réintroduction de ces doublons.

Références : `docs/17§Inventaire actuel`, `docs/18§A.5`, `docs/19§B.0.1`, `docs/31§3`, `docs/32§4.1`, `docs/33§3.5`.

---

## Section 2 · Axe Props

**Principe** : le contrat d'API composant est typé, explicite, bilingue et déterministe.

**Obligations** :
- `Props` exportée obligatoire pour tout composant public.
- `lang?: 'fr' | 'en'` obligatoire dès qu'un composant rend du texte ou commute un libellé.
- Variants explicites via union typée ; jamais via concaténation libre de classes.
- `slug?` autorisé uniquement comme mécanisme de résolution de contenu via `getEntry`.
- Priorité de résolution : override direct des props > données récupérées via `slug` > erreur explicite.
- Les classes additionnelles utilisateur sont additives sur le wrapper racine uniquement ; elles ne doivent jamais casser les styles internes, le spacing canonique ou les tokens du composant.
- `any` interdit.
- Prop non documentée interdite.

**Contrat minimal attendu** :

```ts
export interface Props {
  lang?: 'fr' | 'en';
  variant?: 'default' | 'compact';
  slug?: string;
  class?: string;
}
```

**Règles de conception** :
- Si un composant accepte des données riches, elles doivent être typées structurellement, pas passées en `Record<string, unknown>`.
- Si un composant a un mode `slug`, il doit aussi accepter les données résolues en direct pour éviter le couplage forcé au content layer.
- Les props textuelles bilingues suivent la même logique que les pages existantes : soit un `lang`, soit des champs `*_fr` / `*_en` au niveau data, jamais un mélange opaque.
- Les variants admis doivent apparaître dans le showcase et dans le doc de statut.

**Contrat d'erreur** :
- Pas de fallback silencieux.
- Si `slug` est invalide ou incomplet, le composant échoue explicitement au build ou au render.
- Si un variant inconnu est reçu, il est rejeté par le typage, pas absorbé en runtime.

Références : `docs/19§B.5.2`, `docs/20§C.1.3`, `docs/32§4.1`, `docs/32§4.2`.

---

## Section 3 · Axe Styles

**Principe** : tokens only. Le style Waimia ne se code pas en valeurs libres.

**Règles absolues** :
- Styles via `var(--token)` uniquement.
- Audit brut de référence : `147` tokens dans `docs/18§A.1`.
- Source fermée de décision : tiers et procédures de `docs/19`.
- Zéro hex, zéro `px` hardcodé, zéro couleur inline hors SVG métier exceptionnel documenté.
- Tout fallback CSS pointe vers un autre token, jamais vers une valeur brute.
- Les styles restent scoped dans le composant ; les globals servent au socle, pas aux exceptions ad hoc.

**Règles de fallback** :
- Autorisé : `color: var(--fg, var(--ink));`
- Interdit : `color: var(--fg, #0C0B09);`

**Règles de cohérence visuelle** :
- Hairlines : un seul langage par direction artistique, défini par `docs/19§B.1.3`.
- Radius cards : un rayon canonique unique. La cible normative de ce contrat est `var(--radius-sm)` ; si le token n'existe pas encore dans le set fermé courant, son ajout suit `docs/19§B.5.1` dans le même commit que son premier usage.
- Spacing : échelle 8 pt et rythmes de section uniquement (`docs/19§B.1.12`, `docs/19§B.1.13`).
- Les aliases transitoires n'ouvrent aucun droit créatif ; ils servent uniquement de pont de migration (`docs/19§B.1.14`).

**Anti-patterns interdits** :
- Token fantôme.
- Alias sémantique inutile.
- Nom de composant identique entre dossiers.
- Section sans container interne.
- Hero sans compensation du header sticky.

Références : `docs/18§A.1`, `docs/18§A.6.4`, `docs/19§B.1`, `docs/19§B.6`.

---

## Section 4 · Axe Accessibilité

**Principe** : conformité française obligatoire, WCAG 2.2 AA partout, AAA ciblé là où la conversion et la compréhension sont critiques.

| Niveau | Portée |
|---|---|
| RGAA 4.1 | Obligatoire sur tout le site |
| WCAG 2.2 AA | Plancher universel |
| WCAG 2.2 AAA ciblé | `/contact`, pages offres, `audit-maturite-ia`, glossaire |

**Règles obligatoires** :
- Rôles ARIA explicites quand le HTML natif ne suffit pas.
- `aria-label` sur tout bouton icône, contrôle sans texte visible, carrousel, input non auto-explicite.
- `aria-hidden="true"` sur tout décoratif pur.
- `prefers-reduced-motion` sur toute animation > 200 ms.
- Focus visible obligatoire via tokens d'outline.
- Contraste minimal `4.5:1` pour le corps ; `7:1` sur les cibles AAA.
- Skip links et landmarks obligatoires.
- Tableaux riches avec entêtes correctement reliés.
- Contenus bilingues cohérents avec `lang`.

**Cibles de validation** :
- Lighthouse accessibilité : `100` sur pages critiques, `>= 95` partout.
- Test manuel VoiceOver Safari minimal sur les pages critiques.
- Aucune page critique ne passe en stable si un contrôle clavier ou lecteur d'écran casse le parcours principal.

**Conséquence de gouvernance** :
- Une réussite visuelle ne compense pas un échec RGAA.
- Une animation sans mode réduit est hors contrat.

Références : `docs/12§Critères qualité`, `docs/19§B.5.2`, `docs/31§3`, `docs/32§1.2`.

---

## Section 5 · Axe Performance

**Principe** : le design figé doit rester compatible avec des Core Web Vitals stricts. L'optimisation systématique est exécutée en Phase 3, pas avant le verrouillage design.

| Indicateur | Cible contractuelle |
|---|---|
| LCP | `< 1.2 s` |
| INP | `< 200 ms` |
| CLS | `< 0.05` |
| Bundle JS initial | `<= 60 KB gzip` |

**Règles obligatoires** :
- Pas d'island React sauf si CSS pur impossible.
- `client:idle` par défaut.
- `client:visible` pour le below-the-fold.
- `client:load` uniquement pour l'interaction critique above-the-fold.
- `loading="lazy"` et `decoding="async"` sur toutes les images sauf hero critique.
- `<script is:inline>` limité à `3 KB` pour le critique.
- Tokens critiques injectables dans le `<head>` si cela réduit le coût de rendu initial.
- Aucune animation ou lib motion ne justifie à elle seule une hydratation lourde.

**Doctrine Astro** :
- Astro reste la stack canonique.
- Le modèle islands sélectif est la règle ; la full hydration est un anti-pattern Waimia.
- Les widgets React sont des exceptions justifiées, pas la norme.

**Temporalité de mise en oeuvre** :
- Le présent doc fixe le contrat.
- Les budgets, mesures et verrouillages sont exécutés en Phase 3 de la séquence stratégique.

Références : `docs/12§Méta-critères techniques`, `docs/29§Verdict`, `docs/29§Implications opérationnelles`.

---

## Section 6 · Axe SEO / GEO

**Principe** : la structure sémantique et la lisibilité machine sont de première classe, pas un habillage final.

| Entité | Schéma obligatoire |
|---|---|
| Article | `Article` + `BreadcrumbList` |
| Offre | `Service` + `Offer` |
| Cours | `Course` |
| Produit | `Product` |
| FAQ | `FAQPage` |

**Règles obligatoires** :
- Builders JSON-LD centralisés dans `src/lib/jsonld/*`.
- `additionalJsonLd` autorisé au niveau template, mais pas de JSON-LD inline dupliqué page par page.
- OG image dynamique via `/api/og.png`.
- `hreflang` systématique : `fr`, `en`, `x-default`.
- Sitemap avec `lastmod`.
- `llms.txt` enrichi et maintenu comme artefact GEO.
- Lighthouse SEO cible `100`.

**Règles de gouvernance** :
- Toute taxonomie ou template nouveau doit déclarer son type schema.org avant mise en stable.
- `BreadcrumbList` ne doit pas être dupliqué entre helpers concurrents.
- Les pages critiques FR et EN doivent partager la même discipline canonique de métadonnées.

Références : `docs/12§Méta-critères techniques`, `docs/29§Comparatif décisionnel`, `docs/31§3`, `docs/32§2.2`.

---

## Section 7 · Axe Style

**Principe** : la direction artistique Waimia est fermée. Elle n'est ni libre, ni interprétative.

**Règles de style** :
- Référence canonique système fermé : `docs/19`.
- Référence de qualité narrative et hero : `docs/12§Les 14 axes du brief Simon`.
- Tier 1 obligatoire.
- Tier 2 seulement s'il est déjà validé.
- Tier 3 interdit.
- Aucun gradient.
- Aucun lift hover.
- Hairlines uniques.
- Cards : rayon canonique unique, cible `var(--radius-sm)` à normaliser via `docs/19§B.5.1` si absent du set courant.
- Couleurs sémantiques : `paper`, `ink`, `muted`, `accent`.
- Typographie figée :
  - `--font-display` = Instrument Serif
  - `--font-sans` = Inter Tight
  - `--font-mono` = JetBrains Mono

**Conséquences** :
- Un rendu spectaculaire mais non conforme au vocabulaire Waimia est refusé.
- Une nouvelle page ne peut pas « inventer son langage ».
- Les pages standalone gardent une latitude de composition, jamais de vocabulaire visuel.

Références : `docs/12§Les 14 axes du brief Simon`, `docs/19§B.0.2`, `docs/19§B.2`, `docs/33§4`, `docs/33§5`.

---

## Section 8 · Axe Telemetry + Monitoring

**Principe** : un design system figé doit aussi être observable.

**Obligations** :
- Vercel Analytics activé pour visiteurs, pays, devices.
- Vercel Speed Insights activé pour les Core Web Vitals réels.
- Sentry activé pour erreurs JS et exceptions SSR.
- Tracking d'usage composant pour chaque composant global.
- Mise à jour mensuelle de `docs/19` avec statistiques d'usage.

**Métriques minimales à suivre** :

| Signal | Cible |
|---|---|
| `% de pages utilisatrices` par composant global | Mesurable par grep ou métadonnées showcase |
| Composants `0-use` | Traités comme dette active |
| Régressions visuelles détectées | Corrigées avant merge |
| Erreurs runtime par composant/template | Corrigées avant promotion stable |

**Règle de gouvernance** :
- Un composant global non observé est incomplet.
- Un composant `0-use` non justifié ne peut pas rester indéfiniment en Tier 1.

Références : `docs/31§5`, `docs/31§7`, `docs/20§C.5`.

---

## Section 9 · Workflow modification composant global

1. Toute modification d'un composant global propage automatiquement à toutes les pages utilisatrices. Le composant global est donc traité comme une surface critique.
2. Des snapshots Playwright détectent les régressions visuelles avant merge.
3. Si le contrat de props change, le showcase est bumpé en major et `docs/19` est mis à jour dans le même commit.
4. Tout composant ajouté dans `src/components/` doit apparaître dans `/agence/design-system` avec exemple live FR et miroir EN.

**Procédure obligatoire** :
- Vérifier d'abord l'existant.
- Modifier ensuite le composant canonique, jamais une copie locale concurrente.
- Répercuter la démo dans le showcase.
- Mettre à jour le statut documentaire avant merge.

Références : `docs/19§B.5.2`, `docs/20§C.1.3`, `docs/20§C.5`, `docs/31§6`.

---

## Section 10 · CI check spec

**Phase 6 · Lock + CI** : implémenter au minimum le verrou suivant.

```bash
# Pre-commit hook ou CI GitHub Action
# Refuse merge si composant ajouté/modifié dans src/components/ mais absent du showcase

components_in_repo=$(find apps/web/src/components -name "*.astro" | xargs -I{} basename {} .astro)
components_in_showcase=$(grep -oE "<[A-Z][a-zA-Z]+" apps/web/src/pages/agence/design-system.astro | sort -u | tr -d '<')

missing=$(comm -23 <(echo "$components_in_repo" | sort) <(echo "$components_in_showcase" | sort))
if [ -n "$missing" ]; then
  echo "ERROR · composants absents du showcase :"
  echo "$missing"
  exit 1
fi
```

**Extension recommandée après v1** :
- Vérifier aussi le miroir EN.
- Vérifier les snapshots Playwright.
- Vérifier qu'un composant modifié garde un statut documentaire cohérent dans `docs/19`.

Références : `docs/20§C.5`, `docs/20§C.6`.

---

## Section 11 · Source de vérité

| Source | Rôle |
|---|---|
| `/agence/design-system` (showcase) | Source de vérité vivante (rendu réel) |
| `apps/web/docs/28-DESIGN-SYSTEM-CONTRACT.md` | Source de vérité documentaire (contrat écrit) |
| `apps/web/docs/19-DESIGN-SYSTEM-CLOSED.md` | Statuts composants Tier 1 / 2 / 3 |
| `apps/web/tests/visual/*` | Source de vérité régression |

**Règle de priorité** :
1. Si le rendu réel et le doc divergent, corriger l'un des deux avant merge.
2. Si le showcase et un composant divergent, le composant n'est pas stable.
3. Si `docs/19` et `docs/28` divergent, `docs/28` gouverne le contrat et `docs/19` doit être synchronisé.

Références : `docs/19§B.0.1`, `docs/20§C.5`.

---

## Section 12 · Critères de validation contrat

Pour qu'un composant soit `✅ STABLE Tier 1`, il doit satisfaire tous les critères suivants :

| Critère | Exigence |
|---|---|
| Typage | Interface `Props` exportée et stricte |
| Bilingue | Oui si le composant est textuel |
| Styles | Tokens only |
| Hardcoded | `grep -cE "[0-9]+px|#[0-9a-fA-F]{3,8}" = 0` hors cas SVG métier documenté |
| Tokens | `grep -c "var(--" > 0` |
| Accessibilité | rôle + aria minimum + focus + contraste |
| Showcase | Présent en FR et miroir EN |
| Tests visuels | Snapshot disponible si la zone est couverte |
| Statut documentaire | `docs/19` à jour avec statut `🟢` |

**Compléments obligatoires** :
- Le composant ne doit pas dépendre d'un doublon legacy.
- Le composant ne doit pas réintroduire un anti-pattern listé en `docs/19§B.6`.
- Le composant doit rester compatible avec la doctrine performance Astro de `docs/29`.

Références : `docs/19§B.5.2`, `docs/19§B.6`, `docs/20§C.1.3`, `docs/29§Implications opérationnelles`.

---

## Section 13 · Plan d'application post-audit

**Workstream 1 · Élimination doublons composants**

| Ordre | Action | Référence |
|---|---|---|
| 1 | Supprimer sans débat `BreadcrumbSchema`, `MetricStrip`, `ProcessSteps`, `StatRow`, `TrustMarquee`, `FormationDetailTemplate`, `Stub` | `docs/31§7` |
| 2 | Migrer puis supprimer `CapabilityStrip`, `ProofBar`, `CtaBand`, `FAQ` | `docs/31§7` |
| 3 | Traiter les batchs dans l'ordre H → D → F → C → B → G → E → A | `docs/31§6`, `docs/31§7` |

**Workstream 2 · Élimination doublons templates**

| Ordre | Action | Référence |
|---|---|---|
| 1 | `FormationDetailTemplate` → `CourseDetailTemplate` | `docs/32§2.1`, `docs/32§5.3` |
| 2 | `ServiceDetailTemplate` → `OffresDetailTemplate` | `docs/32§2.1`, `docs/32§2.2`, `docs/32§5.4` |
| 3 | `DetailMenuTemplate` → `OffresDetailTemplate` ou `SectionsRenderer` | `docs/32§2.1`, `docs/32§5.3` |
| 4 | Rationaliser `HubTemplate` / `EcoleHubTemplate` / `ListIndexTemplate` | `docs/32§2.1`, `docs/32§4.3`, `docs/32§5.3` |

**Workstream 3 · Migration pages drift**

| Priorité | Action | Référence |
|---|---|---|
| 1 | Corriger les tokens fantômes transversaux | `docs/33§5.7`, `docs/33§7` |
| 2 | Supprimer les secteurs statiques legacy et basculer sur la route dynamique | `docs/33§2.3`, `docs/33§5.1`, `docs/33§6` |
| 3 | Corriger hubs ressources et pages statiques doublons | `docs/33§2.7`, `docs/33§5.2`, `docs/33§5.3`, `docs/33§6` |
| 4 | Harmoniser les offres niveaux | `docs/33§2.5`, `docs/33§6` |
| 5 | Refondre les hubs taxonomiques répétés | `docs/33§3.5`, `docs/33§6` |

**Workstream 4 · Compléter le showcase**

| Action | Référence |
|---|---|
| Couvrir 100 % des couches, pas seulement un squelette partiel | `docs/20§C.0`, `docs/20§C.1` |
| Ajouter les blocs helpers et les previews templates | `docs/20§C.2`, `docs/20§C.1.4` |
| Mettre en place les garde-fous d'exhaustivité | `docs/20§C.5` |

**Workstream 5 · Mettre à jour `docs/19`**

| Action | Référence |
|---|---|
| Reclasser les statuts Tier 1 / 2 / 3 après chaque batch | `docs/19§B.0.1`, `docs/19§B.5.3` |
| Documenter tout changement de token ou composant dans le même commit | `docs/19§B.5.1`, `docs/19§B.5.2` |
| Publier mensuellement l'usage réel des composants globaux | `docs/20§C.5`, `docs/31§5` |

**Séquence d'application recommandée** :
1. Doublons sûrs composants
2. Fusions templates évidentes
3. Drift pages critique
4. Exhaustivité showcase
5. Synchronisation statuts `docs/19`

Références : `docs/20§C.4`, `docs/31§6`, `docs/31§7`, `docs/32§5`, `docs/33§6`, `docs/33§7`.
