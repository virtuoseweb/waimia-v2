// Waimia · i18n helpers
// FR par défaut à `/`, EN à `/en/*`. URL canonique différente par langue (meilleur SEO/GEO).

export const LANGS = ['fr', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'fr';

/**
 * Détecte la langue depuis Astro.url.pathname.
 * Ex: '/en/offres' → 'en', '/offres' → 'fr'.
 */
export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';
}

/**
 * Préfixe une URL avec la langue active.
 * Le défaut FR n'a pas de préfixe (route à `/`), EN a `/en`.
 */
export function localizeHref(href: string, lang: Lang): string {
  if (!href.startsWith('/')) return href;
  if (lang === DEFAULT_LANG) return href;
  return `/${lang}${href === '/' ? '' : href}`;
}

/**
 * URL miroir pour le toggle FR/EN (même page, autre langue).
 */
export function alternateHref(pathname: string, currentLang: Lang): string {
  if (currentLang === 'en') return pathname.replace(/^\/en(\/|$)/, '/') || '/';
  return `/en${pathname === '/' ? '' : pathname}`;
}

/**
 * Codes hreflang ISO complets pour balises SEO.
 */
export const HREFLANG: Record<Lang, string> = { fr: 'fr-FR', en: 'en-US' };

// Pages statiques FR qui n'ont pas de miroir EN (→ pas de hreflang en-US à émettre).
const FR_ONLY_STATIC = new Set([
  '/offres/conseil', '/offres/revops', '/offres/site-web-ia',
  '/offres/site-web-ia-landing', '/offres/audit-maturite-ia',
  '/agence/careers', '/agence/docs', '/agence/governance', '/agence/trust-center',
  '/ressources/blog', '/ressources/blog/brain-circuit', '/ressources/academy',
  '/ressources/changelog',
  '/ressources/cookbooks', '/ressources/cookbooks/claude-cowork-rollout',
  '/ressources/cookbooks/claude-skills-tutorial', '/ressources/cookbooks/mcp-server-deploy',
  '/ressources/livres-blancs', '/ressources/livres-blancs/ai-act-readiness',
  '/ressources/field-notes',
  '/glossaire', '/secteurs', '/secteurs/finance-compta',
  '/secteurs/industrie', '/secteurs/services-b2b',
  '/equipe', '/archive', '/ecole', '/commerce',
]);

// Préfixes de routes FR-only (contenu dynamique sans équivalent EN).
const FR_ONLY_PREFIXES = [
  '/glossaire/', '/secteurs/',
  '/ressources/cookbooks/', '/ressources/livres-blancs/', '/ressources/field-notes/',
  '/ressources/personas/', '/ressources/testimonials/', '/ressources/veille-ia/',
  '/ressources/categorie/', '/ressources/outils/', '/ressources/silo/', '/ressources/tag/',
  '/equipe/', '/ecole/', '/commerce/',
];

/**
 * Retourne `true` si la page à `pathname` a un miroir anglais.
 * Utilisé pour n'émettre `hreflang="en-US"` que sur les pages effectivement traduites.
 */
export function hasBilingualMirror(pathname: string): boolean {
  if (FR_ONLY_STATIC.has(pathname)) return false;
  return !FR_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Tire la chaîne dans la bonne langue depuis un objet { en, fr }.
 */
export function t<T extends Record<Lang, string>>(o: T, lang: Lang): string {
  return o[lang];
}
