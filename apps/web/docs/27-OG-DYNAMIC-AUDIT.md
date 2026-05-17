# 27 · Audit OG dynamique — Waimia

## Mécanisme existant

`Base.astro` génère automatiquement un OG via `/api/og.png?title=...&kicker=...`
si aucune `ogImage` explicite n'est passée. Ce fallback couvre **toutes les pages**.

```
const finalOgImage = ogImage ?? dynamicOgUrl;
// dynamicOgUrl = `https://waimia.com/api/og.png?title=${ogTitle}&kicker=${ogKicker}`
```

## Routes prioritaires — ogImage explicite recommandée

| Route | Template | Recommandation | Priorité |
|-------|----------|----------------|----------|
| `/cas/[slug]` | CaseStudyTemplate | Passer `heroImage` frontmatter si disponible | ⭐ Haute |
| `/ressources/blog/[slug]` | EssayTemplate | Prop `image` déjà câblée, vérifier frontmatter MDX | ⭐ Haute |
| `/offres/[slug]` | OffresDetailTemplate | OG dynamique suffisant | Normale |
| `/solutions/[slug]` | SolutionsDetailTemplate | OG dynamique suffisant | Normale |
| `/glossaire/[slug]` | page directe | OG dynamique suffisant | Basse |
| `/technologies/[slug]` | TechnologiesDetailTemplate | OG dynamique suffisant | Normale |

## Héritage Base.astro vérifié

Tous les templates héritent de `Base.astro` directement.
Le fallback `finalOgImage` est universel.

| Template | Passe ogImage ? | Statut |
|----------|----------------|--------|
| OffresDetailTemplate | Non — utilise `additionalJsonLd` prop distincte | ✅ Fallback actif |
| SolutionsDetailTemplate | Non | ✅ Fallback actif |
| CaseStudyTemplate | Non | ⚠️ Opportunité : ajouter prop `ogImage` |
| EssayTemplate | Oui via prop `image` → base64/URL | ✅ Câblé si fourni |
| glossaire/[slug] | Non | ✅ Fallback actif (suffisant) |

## Kicker OG dynamique

Actuellement `Base.astro` utilise `§ Waimia` comme kicker générique.
Amélioration possible : passer un `ogKicker` prop depuis chaque template pour avoir
`§ Blog`, `§ Cas client`, `§ Offre`, `§ Glossaire` selon le contexte.

## Conclusion

Le système OG est fonctionnel. Aucune page sans OG image.
Actions prioritaires :
1. Ajouter prop `ogImage` dans CaseStudyTemplate + la passer depuis les pages MDX cas clients
2. Vérifier que les articles blog avec `image` frontmatter passent bien la prop à EssayTemplate
3. Optionnel : ogKicker contextualisé par template
