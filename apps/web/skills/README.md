# Skills Waimia · routines éditoriales autonomes

Ce dossier contient les **skills Claude** qui pilotent la production éditoriale
autonome de Waimia. Chaque skill est un fichier `SKILL.md` consommé par Claude
Code via le tool `Skill`.

## Skills disponibles

| Skill | Rôle | Status |
|---|---|---|
| `article-add` | Génère un article MDX (blog) avec frontmatter Zod + body GEO | ✅ B9 |
| `newsletter-mensuelle` | Agrège veille IA mensuelle + envoi Resend | ⏳ B10 |
| `post-linkedin` | Génère variantes LinkedIn (texte + carousel + video) | ⏳ B11 |
| `calendrier-editorial` | Détecte trous éditoriaux + propose sujets | ⏳ B12 |

## Installation

Pour activer un skill localement :

```bash
cp -r apps/web/skills/<skill-name> ~/.claude/skills/waimia-<skill-name>
```

Ou via symlink (recommandé) :

```bash
ln -s "$(pwd)/apps/web/skills/<skill-name>" ~/.claude/skills/waimia-<skill-name>
```

## Conventions

- Tous les skills écrivent dans `src/content/<collection>/<slug>.<ext>` selon les schémas Zod de `src/content.config.ts`
- Tous les skills respectent le ton manifeste Waimia (cf SKILL.md de chaque skill)
- Tous les skills produisent des marker DONE dans `/tmp/waimia-skills/<skill-name>-DONE.md` pour traçabilité
