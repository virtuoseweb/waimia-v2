// Waimia · structure mega-menu V3 simplifiée (2026-05-17)
// Ressources et Agence sont explicitement définies ici.
// Les autres sections restent mappées depuis sitemap.ts pour conserver le contenu validé.

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
          label: { fr: 'Blog', en: 'Blog' },
          href: '/ressources/blog',
          description: {
            fr: 'Insights business pour PME B2B.',
            en: 'Business insights for B2B SMBs.',
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
        {
          label: { fr: 'Veille IA', en: 'AI watch' },
          href: '/ressources/veille-ia',
          description: {
            fr: 'Mouvements marché analysés.',
            en: 'Analyzed market moves.',
          },
        },
        {
          label: { fr: 'Newsletter', en: 'Newsletter' },
          href: '/ressources/newsletter',
          description: {
            fr: 'Archives des éditions envoyées.',
            en: 'Archive of sent editions.',
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
          label: { fr: 'Cas clients', en: 'Case studies' },
          href: '/cas',
          description: {
            fr: 'Résultats mesurés en clair.',
            en: 'Measured results in the clear.',
          },
        },
      ],
      footer: {
        label: { fr: 'Catalogue outils →', en: 'Tools catalog →' },
        href: '/ressources/outils',
      },
    },
  ],
  featured: MM_RESOURCES.featured ? mapLegacyFeatured(MM_RESOURCES.featured) : undefined,
};

const SOLUTIONS = mapLegacySection(MM_SOLUTIONS);
const OFFRES = mapLegacySection(MM_OFFRES);
const CAS = mapLegacySection(MM_CASES_NEW);
const AGENCE: MegaMenuSection = {
  parent: 'agence',
  label: MM_AGENCY_NEW.label,
  parentHref: MM_AGENCY_NEW.href,
  lead: MM_AGENCY_NEW.lead,
  columns: [
    {
      kicker: { fr: "L'ÉQUIPE", en: 'THE TEAM' },
      title: { fr: 'Qui nous sommes', en: 'Who we are' },
      links: [
        {
          label: { fr: 'À propos de Waimia', en: 'About Waimia' },
          href: '/agence/about',
        },
        {
          label: { fr: 'Notre méthode · Process Intelligence', en: 'Our method · Process Intelligence' },
          href: '/agence/methode',
          description: {
            fr: 'Audit, déploiement, mesure — pas de PowerPoint.',
            en: 'Audit, deployment, measurement — no PowerPoint.',
          },
          featured: true,
        },
        {
          label: { fr: 'École Waimia', en: 'Waimia School' },
          href: '/ecole',
          description: {
            fr: 'Formations IA pour vos équipes.',
            en: 'AI training for your teams.',
          },
          featured: true,
        },
        {
          label: { fr: 'Carrières', en: 'Careers' },
          href: '/agence/careers',
        },
        {
          label: { fr: 'Simon Beros · CV Founder', en: 'Simon Beros · Founder CV' },
          href: '/equipe/simon-beros',
          description: {
            fr: 'Architecture systèmes agentiques.',
            en: 'Agentic systems architecture.',
          },
        },
      ],
    },
    {
      kicker: { fr: 'CONFIANCE', en: 'TRUST' },
      title: { fr: 'Garanties & légal', en: 'Guarantees & legal' },
      links: [
        {
          label: { fr: 'Trust Center', en: 'Trust Center' },
          href: '/agence/trust-center',
          description: {
            fr: 'AI Act, RGPD, ISO — tous les contrôles en clair.',
            en: 'AI Act, GDPR, ISO — all controls in plain text.',
          },
        },
        {
          label: { fr: 'Gouvernance', en: 'Governance' },
          href: '/agence/governance',
          description: {
            fr: 'Comité ethics IA + whistleblowing.',
            en: 'AI ethics committee + whistleblowing.',
          },
        },
        {
          label: { fr: 'Design System', en: 'Design System' },
          href: '/agence/design-system',
          description: {
            fr: 'Catalogue visible des tokens, composants et patterns.',
            en: 'Visible catalog of tokens, components, and patterns.',
          },
        },
        {
          label: { fr: 'Documentation', en: 'Documentation' },
          href: '/agence/docs',
          description: {
            fr: 'Notre stack, nos intégrations, notre méthode.',
            en: 'Our stack, integrations, and method.',
          },
        },
      ],
    },
    {
      kicker: { fr: 'CONTACT', en: 'CONTACT' },
      title: { fr: 'Discutons', en: "Let's talk" },
      links: [
        {
          label: { fr: 'Réserver un audit', en: 'Book an audit' },
          href: '/contact',
          description: {
            fr: 'Cadrage gratuit, audit honnête, ou rien.',
            en: 'Free scoping, honest audit, or nothing.',
          },
          featured: true,
        },
        {
          label: { fr: 'Espace client', en: 'Client space' },
          href: '/bienvenue/contact',
          description: {
            fr: 'Point d’entrée de suivi et coordination Waimia.',
            en: 'Entry point for Waimia follow-up and coordination.',
          },
        },
        {
          label: { fr: 'Newsletter', en: 'Newsletter' },
          href: '/ressources/newsletter',
          description: {
            fr: 'Recevoir les analyses et annonces Waimia.',
            en: 'Receive Waimia analysis and announcements.',
          },
        },
      ],
    },
  ],
  featured: MM_AGENCY_NEW.featured ? mapLegacyFeatured(MM_AGENCY_NEW.featured) : undefined,
};

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
