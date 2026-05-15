// Waimia · tags canoniques V2 (2026-05-15)
// Décision Simon : 8 tags simplifiés (vs 16 initial).
// Cf docs/13-CONTENT-ARCHITECTURE.md section "Taxonomie".

import type { Lang } from '../lib/i18n';

export type BiText = Record<Lang, string>;

/**
 * Liste exhaustive des tags canoniques Waimia.
 * Tout slug `tags: [...]` dans les frontmatter MDX doit appartenir à cette liste.
 */
export const WAIMIA_TAGS = [
  'acquisition-ia',
  'contenu-seo-geo',
  'productivite-ia',
  'data-pilotage',
  'gouvernance-ia',
  'etudes-cas',
  'outils-techniques',
  'strategie',
] as const;

export type WaimiaTag = (typeof WAIMIA_TAGS)[number];

export const TAGS_META: Record<
  WaimiaTag,
  { label: BiText; description: BiText; color?: string }
> = {
  'acquisition-ia': {
    label: { fr: 'Acquisition IA', en: 'AI Acquisition' },
    description: {
      fr: 'Ads, landing pages, pipeline, CRM, relances, conversion.',
      en: 'Ads, landing pages, pipeline, CRM, follow-ups, conversion.',
    },
  },
  'contenu-seo-geo': {
    label: { fr: 'Contenu SEO/GEO', en: 'SEO/GEO Content' },
    description: {
      fr: 'SEO, generative engine optimization, articles, brand content.',
      en: 'SEO, generative engine optimization, articles, brand content.',
    },
  },
  'productivite-ia': {
    label: { fr: 'Productivité IA', en: 'AI Productivity' },
    description: {
      fr: 'Automation, workflows internes, gains horaires, support client IA.',
      en: 'Automation, internal workflows, time gains, AI customer support.',
    },
  },
  'data-pilotage': {
    label: { fr: 'Data & pilotage', en: 'Data & steering' },
    description: {
      fr: 'Dashboards, KPIs, analytics, GA4, attribution, alertes.',
      en: 'Dashboards, KPIs, analytics, GA4, attribution, alerts.',
    },
  },
  'gouvernance-ia': {
    label: { fr: 'Gouvernance IA', en: 'AI Governance' },
    description: {
      fr: 'AI Act, RGPD, compliance, sécurité, audit.',
      en: 'AI Act, GDPR, compliance, security, audit.',
    },
  },
  'etudes-cas': {
    label: { fr: 'Études de cas', en: 'Case Studies' },
    description: {
      fr: 'Cas terrain, lessons learned, retours mission, transformations mesurées.',
      en: 'Field cases, lessons learned, mission feedback, measured transformations.',
    },
  },
  'outils-techniques': {
    label: { fr: 'Outils techniques', en: 'Technical tools' },
    description: {
      fr: 'Cookbooks dev, MCP, Claude API, scripts, intégrations.',
      en: 'Dev cookbooks, MCP, Claude API, scripts, integrations.',
    },
  },
  strategie: {
    label: { fr: 'Stratégie', en: 'Strategy' },
    description: {
      fr: 'Vision, marché, positioning, entrepreneuriat, building Waimia.',
      en: 'Vision, market, positioning, entrepreneurship, building Waimia.',
    },
  },
};

/**
 * Helper : valide qu'un tag est dans la liste canonique.
 * Utilisé côté build pour échouer si un MDX référence un tag inconnu.
 */
export function isValidWaimiaTag(slug: string): slug is WaimiaTag {
  return (WAIMIA_TAGS as readonly string[]).includes(slug);
}

/**
 * Helper : retourne le label localisé d'un tag.
 */
export function getTagLabel(slug: WaimiaTag, lang: Lang): string {
  return TAGS_META[slug].label[lang];
}

/**
 * Helper : retourne la description localisée d'un tag.
 */
export function getTagDescription(slug: WaimiaTag, lang: Lang): string {
  return TAGS_META[slug].description[lang];
}
