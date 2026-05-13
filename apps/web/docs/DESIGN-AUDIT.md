# Design Audit — V9-G · Espacements + Typographie

Genere le 2026-05-13. Scope : fichiers .astro uniquement.

---

## Atoms — conformite tokens

| Atom | Violation | Propriete | Valeur actuelle | Token recommande |
|---|---|---|---|---|
| PillCTA.astro | Oui | padding (inline) | 16px 26px | --space-4 --space-6 (16px 32px) |
| PillCTA.astro | Oui | padding (inline) | 18px 32px | --space-5 --space-6 (24px 32px) |
| PillCTA.astro | Oui | font-size (inline) | 13.5px, 14px | --text-body-sm (14px) |
| TerminalCTA.astro | Oui | padding (inline) | 12px 18px | 12px 16px (--space-3 --space-4) |
| TerminalCTA.astro | Oui | padding (inline) | 14px 22px | 16px 24px (--space-4 --space-5) |
| TerminalCTA.astro | Oui | font-size (inline) | 12.5px, 13.5px | --text-body-sm (14px) |
| Bi.astro | Conforme | — | — | — |
| Button.astro | Conforme | — | — | — |
| ChapterLabel.astro | Conforme | — | — | — |
| CursorDot.astro | Conforme | — | — | — |
| Kicker.astro | Conforme | — | — | — |
| ProgressBar.astro | Conforme | — | — | — |
| ScrollProgress.astro | Conforme | — | — | — |

Note : PillCTA et TerminalCTA utilisent des inline styles en JS — les valeurs ne peuvent pas
referencer des custom properties CSS directement. Voir fixes proposes ci-dessous.

---

## Pages avec valeurs hardcoded non-8pt

| Fichier | Ligne | Propriete | Avant | Apres |
|---|---|---|---|---|
| molecules/ServiceCatalogRow.astro | 54 | padding | 36px 0 | var(--space-7) 0 [40px] |
| molecules/EditorialWriteRow.astro | 58 | padding | 22px 0 | var(--space-5) 0 [24px] |
| molecules/AuthorCard.astro | 70 | gap | 10px | var(--space-3) [12px] |
| molecules/AuthorCard.astro | 92 | gap + margin-bottom | 20px | var(--space-5) [24px] |
| molecules/ShipmentRow.astro | 58 | gap | 6px | var(--space-2) [8px] |
| molecules/PricingTier.astro | 107 | gap | 6px | var(--space-2) [8px] |
| molecules/PricingTier.astro | 157 | gap | 10px | var(--space-3) [12px] |
| molecules/TechPillRow.astro | 46 | gap | 7px | var(--space-2) [8px] |
| templates/CaseStudyTemplate.astro | 232 | margin-bottom | 20px | var(--space-5) [24px] |
| templates/CaseStudyTemplate.astro | 345 | margin-bottom | 30px | var(--space-6) [32px] |
| templates/ServiceDetailTemplate.astro | 167 | margin-bottom | 20px | var(--space-5) [24px] |
| templates/ServiceDetailTemplate.astro | 244 | margin-bottom | 30px | var(--space-6) [32px] |
| templates/HubTemplate.astro | 189 | margin-bottom | 18px | var(--space-5) [24px] |
| templates/HubTemplate.astro | 190 | margin-bottom | 20px | var(--space-5) [24px] |
| templates/HubTemplate.astro | 262 | margin-bottom | 30px | var(--space-6) [32px] |
| templates/HubTemplate.astro | 290 | margin-bottom | 30px | var(--space-6) [32px] |
| templates/HubTemplate.astro | 325 | margin-bottom | 30px | var(--space-6) [32px] |
| templates/SolutionsDetailTemplate.astro | 566 | margin-bottom | 10px | var(--space-3) [12px] |
| templates/SolutionsDetailTemplate.astro | 857 | padding | 22px 0 | var(--space-5) 0 [24px] |
| templates/LeadMagnetTemplate.astro | 233 | margin-bottom | 20px | var(--space-5) [24px] |
| templates/LeadMagnetTemplate.astro | 387 | margin-bottom | 18px | var(--space-4) [16px] |
| templates/ConversionFunnelTemplate.astro | 350 | gap | 10px | var(--space-3) [12px] |
| templates/ConversionFunnelTemplate.astro | 509 | gap | 20px | var(--space-5) [24px] |
| templates/ConversionFunnelTemplate.astro | 531 | gap | 22px | var(--space-5) [24px] |
| templates/ConversionFunnelTemplate.astro | 565 | gap | 6px | var(--space-2) [8px] |
| templates/TrustLegalTemplate.astro | 146 | margin-bottom | 18px | var(--space-4) [16px] |
| templates/WelcomeTemplate.astro | 102 | margin-bottom | 18px | var(--space-4) [16px] |
| templates/DetailMenuTemplate.astro | 143 | margin-bottom | 18px | var(--space-4) [16px] |
| pages/agence/careers.astro | 131 | padding-bottom | 2px | 0 (border trick) |

---

## Tailles typo hors-tokens (selection principale)

| Fichier | Ligne | Avant | Token a utiliser |
|---|---|---|---|
| molecules/RelatedCards.astro | 77 | clamp(20px, 2.4vw, 32px) | --text-display-xs [clamp(28px,3vw,44px)] ou valeur inline maintenue |
| molecules/EditorialCaseCard.astro | 71 | clamp(36px,5vw,72px) | --text-display-sm [clamp(36px,5vw,64px)] approx |
| molecules/ProofBand.astro | 87 | clamp(20px, 2.8vw, 40px) | valeur specifique, maintenir |
| molecules/ProofBand.astro | 122 | clamp(26px, 3.5vw, 48px) | valeur specifique, maintenir |
| molecules/ProcessSteps.astro | 69 | clamp(52px, 7vw, 96px) | valeur specifique, maintenir |
| molecules/MetricStrip.astro | 73 | clamp(28px,3.4vw,44px) | --text-display-xs [clamp(28px,3vw,44px)] proche |
| molecules/FitColumns.astro | 84 | 26px | --text-display-xs min approx, maintenir |
| molecules/AsymmetricServiceRow.astro | 54-62 | clamp(40px,5vw,64px) | --text-display-sm approx, valeurs dediees |

Note : les clamp() inline custom dans les molecules sont des choix de design specifiques
qui ne correspondent pas exactement a l'echelle display-*. Ne pas remplacer mecaniquement.
Les valeurs body (11px, 12px, 13px) sont des micro-sizes de UI qui n'ont pas de token
exact — utiliser --text-eyebrow (11px) et --text-body-xs (13px) quand possible.

---

## Coherence rythme section par template

| Template | Section spacing utilise | Conforme |
|---|---|---|
| CaseStudyTemplate | margin-bottom hardcode (20px, 30px sur kickers) | Partiel |
| ServiceDetailTemplate | margin-bottom hardcode (20px, 30px sur kickers) | Partiel |
| SolutionsDetailTemplate | mix hardcode + var(--space-*) | Partiel |
| OffresDetailTemplate | mix hardcode + var(--space-*) | Partiel |
| HubTemplate | margin-bottom hardcode (18px, 20px, 30px) | Non conforme |
| AuthorPageTemplate | var(--space-*) systematique | Conforme |
| EssayTemplate | var(--space-*) systematique + 1px border trick | Conforme |
| LeadMagnetTemplate | mix hardcode + var(--space-*) | Partiel |
| TrustLegalTemplate | 24px + 18px hardcodes | Non conforme |
| WelcomeTemplate | 18px hardcode | Non conforme |
| DetailMenuTemplate | 18px, 24px hardcodes | Non conforme |

---

## Top 20 fixes appliques (V9-G wave 1)

Voir section suivante apres execution du worker Sonnet.

---

## Violations maintenues intentionnellement

Les violations suivantes sont conservees car elles sont des choix de design deliberes :

- `padding-bottom: 1px / 2px` dans AuthorCard, WelcomeTemplate, EssayTemplate, careers.astro :
  technique border-trick pour eviter le collapse de marge (ne PAS remplacer par 0).
- `padding: 2px 6px` dans SolutionsDetailTemplate : badge/chip ultra-compact, intentionnel.
- `padding: 7px 11px` dans ConversionFunnelTemplate : input tight, ajustement optique.
- clamp() inline dans les molecules : valeurs de design specifiques non remplacables par tokens generiques.
- font-size 11px / 11.5px / 10.5px : micro-typography UI, utiliser --text-eyebrow (11px) quand exact.
