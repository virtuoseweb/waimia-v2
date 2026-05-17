// Waimia · structure mega-menu V2 (2026-05-17)
// Ressources garde sa structure V2 dédiée.
// Les autres sections sont mappées depuis sitemap.ts pour conserver le contenu legacy inchangé.

import type { Lang } from '../lib/i18n';
import {
  MM_AGENCY_NEW,
  MM_CASES_NEW,
  MM_OFFRES,
  MM_RESOURCES,
  MM_SOLUTIONS,
  type FeaturedCard as LegacyFeaturedCard,
  type MegaMenu as LegacyMegaMenu,
  type NavColumn as LegacyNavColumn,
  type NavItem as LegacyNavItem,
} from './sitemap';

export type BiText = Record<Lang, string>;

export interface MegaMenuLink {
  label: BiText;
  href: string;
  description?: BiText;
  badge?: BiText;
  featured?: boolean;
}

export interface MegaMenuColumn {
  title: BiText;
  kicker?: BiText;
  links: MegaMenuLink[];
  footer?: MegaMenuLink;
  tint?: string;
}

export interface MegaMenuFeatured {
  kicker: BiText;
  label: BiText;
  body: BiText;
  cta: BiText;
  href: string;
}

export interface MegaMenuSection {
  parent: string;
  label: BiText;
  parentHref?: string;
  lead?: BiText;
  columns: MegaMenuColumn[];
  featured?: MegaMenuFeatured;
}

function mapLegacyLink(item: LegacyNavItem): MegaMenuLink {
  return {
    label: item.label,
    href: item.href,
    description: item.lead,
    featured: item.featured,
  };
}

function mapLegacyColumn(column: LegacyNavColumn): MegaMenuColumn {
  return {
    title: column.label,
    kicker: column.kicker,
    tint: column.tint,
    links: column.items.map(mapLegacyLink),
  };
}

function mapLegacyFeatured(featured: LegacyFeaturedCard): MegaMenuFeatured {
  return {
    kicker: featured.kicker,
    label: featured.label,
    body: featured.body,
    cta: featured.cta,
    href: featured.href,
  };
}

function mapLegacySection(section: LegacyMegaMenu): MegaMenuSection {
  return {
    parent: section.key,
    label: section.label,
    parentHref: section.href,
    lead: section.lead,
    columns: section.cols.map(mapLegacyColumn),
    featured: section.featured ? mapLegacyFeatured(section.featured) : undefined,
  };
}

const ECOLE_HUB_HREF = '/ecole';

const RESSOURCES: MegaMenuSection = {
  parent: 'ressources',
  label: MM_RESOURCES.label,
  parentHref: MM_RESOURCES.href,
  lead: MM_RESOURCES.lead,
  columns: [
    {
      kicker: { fr: 'LECTURES', en: 'READING' },
      title: { fr: 'Lectures', en: 'Reading' },
      links: [
        {
          label: { fr: 'Blog · Formation', en: 'Blog · Training' },
          href: '/ressources/blog/formation',
          description: {
            fr: 'Tutoriels structurés pour monter en compétence.',
            en: 'Structured tutorials to level up.',
          },
        },
        {
          label: { fr: 'Blog · Essai', en: 'Blog · Essay' },
          href: '/ressources/blog/essai',
          description: {
            fr: 'Analyses long format type Stratechery.',
            en: 'Long-form analyses, Stratechery-style.',
          },
        },
        {
          label: { fr: 'Blog · Notes', en: 'Blog · Notes' },
          href: '/ressources/blog/notes',
          description: {
            fr: 'Observations courtes du terrain.',
            en: 'Short field observations.',
          },
        },
        {
          label: { fr: 'Blog · Avis', en: 'Blog · Opinions' },
          href: '/ressources/blog/avis',
          description: {
            fr: 'Prises de position assumées.',
            en: 'Owned opinions.',
          },
        },
        {
          label: { fr: 'Blog · Post', en: 'Blog · Posts' },
          href: '/ressources/blog/post',
          description: {
            fr: 'Réflexions générales courtes.',
            en: 'Short general reflections.',
          },
        },
        {
          label: { fr: 'Livres blancs', en: 'White papers' },
          href: '/ressources/livres-blancs',
          description: {
            fr: 'Analyses approfondies téléchargeables.',
            en: 'Deep downloadable analyses.',
          },
        },
      ],
      footer: {
        label: { fr: 'Tous les contenus →', en: 'All content →' },
        href: '/ressources',
      },
    },
    {
      kicker: { fr: 'PRATIQUE', en: 'PRACTICE' },
      title: { fr: 'Pratique', en: 'Practice' },
      links: [
        {
          label: { fr: 'Cookbooks', en: 'Cookbooks' },
          href: '/ressources/cookbooks',
          description: {
            fr: 'Recettes techniques actionnables.',
            en: 'Actionable technical recipes.',
          },
        },
        {
          label: { fr: 'Outils', en: 'Tools' },
          href: '/ressources/outils',
          description: {
            fr: 'Calculateurs, checklists, templates.',
            en: 'Calculators, checklists, templates.',
          },
        },
        {
          label: { fr: 'Veille IA', en: 'AI watch' },
          href: '/ressources/veille-ia',
          description: {
            fr: 'Mouvements marché analysés.',
            en: 'Market movements analyzed.',
          },
        },
        {
          label: { fr: 'Cas clients', en: 'Case studies' },
          href: '/cas',
          description: {
            fr: 'Résultats mesurés en clair.',
            en: 'Measured results in the clear.',
          },
        },
        {
          label: { fr: 'Newsletter', en: 'Newsletter' },
          href: '/ressources/newsletter',
          description: {
            fr: 'Archives des éditions envoyées.',
            en: 'Past issues archive.',
          },
        },
      ],
      footer: {
        label: { fr: 'Catalogue outils →', en: 'Tools catalog →' },
        href: '/ressources/outils',
      },
    },
    {
      kicker: { fr: 'APPRENDRE', en: 'LEARN' },
      title: { fr: 'Apprendre', en: 'Learn' },
      tint: '#C94F2E',
      links: [
        {
          label: { fr: 'École Waimia', en: 'Waimia School' },
          href: ECOLE_HUB_HREF,
          description: {
            fr: 'Formations, parcours et certifications.',
            en: 'Courses, paths and certifications.',
          },
          badge: { fr: 'Nouveau', en: 'New' },
          featured: true,
        },
        {
          label: { fr: 'Parcours', en: 'Learning paths' },
          href: ECOLE_HUB_HREF,
          description: {
            fr: 'Séquences multi-semaines.',
            en: 'Multi-week sequences.',
          },
        },
        {
          label: { fr: 'Cours', en: 'Courses' },
          href: ECOLE_HUB_HREF,
          description: {
            fr: 'Unités de formation indépendantes.',
            en: 'Independent training units.',
          },
        },
        {
          label: { fr: 'Ateliers live', en: 'Live workshops' },
          href: ECOLE_HUB_HREF,
          description: {
            fr: 'Sessions ponctuelles encadrées.',
            en: 'Scheduled supervised sessions.',
          },
        },
        {
          label: { fr: 'Field notes', en: 'Field notes' },
          href: '/ressources/blog/notes',
          description: {
            fr: 'Le journal de bord Waimia.',
            en: 'The Waimia logbook.',
          },
        },
      ],
      footer: {
        label: { fr: 'Programme école →', en: 'School program →' },
        href: ECOLE_HUB_HREF,
      },
    },
  ],
  featured: MM_RESOURCES.featured ? mapLegacyFeatured(MM_RESOURCES.featured) : undefined,
};

const SOLUTIONS = mapLegacySection(MM_SOLUTIONS);
const OFFRES = mapLegacySection(MM_OFFRES);
const CAS = mapLegacySection(MM_CASES_NEW);
const AGENCE = mapLegacySection(MM_AGENCY_NEW);

export const MEGA_MENU: MegaMenuSection[] = [
  SOLUTIONS,
  OFFRES,
  CAS,
  RESSOURCES,
  AGENCE,
];

export function getMegaMenuSection(parent: string): MegaMenuSection | undefined {
  return MEGA_MENU.find((section) => section.parent === parent);
}
