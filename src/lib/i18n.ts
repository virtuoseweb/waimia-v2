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

/**
 * Tire la chaîne dans la bonne langue depuis un objet { en, fr }.
 */
export function t<T extends Record<Lang, string>>(o: T, lang: Lang): string {
  return o[lang];
}
