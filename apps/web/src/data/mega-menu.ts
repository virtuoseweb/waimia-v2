// Waimia · structure mega-menu V2 (2026-05-15)
// Décision Simon : 3 colonnes pour Ressources (Lectures · Pratique · Apprendre).
// École intégrée dans col 3 du mega-menu Ressources (URL séparée /ecole/).
// Cf docs/14-MASTER-PLAN-SESSION-NEXT.md section "Mega-menu structure cible".

import type { Lang } from '../lib/i18n';

export type BiText = Record<Lang, string>;

export interface MegaMenuLink {
  label: BiText;
  href: string;
  description?: BiText;
  badge?: BiText;
}

export interface MegaMenuColumn {
  title: BiText;
  links: MegaMenuLink[];
  footer?: MegaMenuLink;
}

export interface MegaMenuSection {
  /** Slug du parent (utilisé en header trigger) */
  parent: string;
  /** Label du parent dans le header */
  label: BiText;
  /** URL d'arrivée si le parent lui-même est cliquable */
  parentHref?: string;
  /** 1-3 colonnes du méga-panel */
  columns: MegaMenuColumn[];
}

/* ─── Mega-menu Ressources (3 colonnes) ─── */

const RESSOURCES: MegaMenuSection = {
  parent: 'ressources',
  label: { fr: 'Ressources', en: 'Resources' },
  parentHref: '/ressources',
  columns: [
    {
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
      title: { fr: 'Apprendre', en: 'Learn' },
      links: [
        {
          label: { fr: 'École Waimia', en: 'Waimia School' },
          href: '/ecole',
          description: {
            fr: 'Formations, parcours et certifications.',
            en: 'Courses, paths and certifications.',
          },
          badge: { fr: 'Nouveau', en: 'New' },
        },
        {
          label: { fr: 'Parcours', en: 'Learning paths' },
          href: '/ecole/parcours',
          description: {
            fr: 'Séquences multi-semaines.',
            en: 'Multi-week sequences.',
          },
        },
        {
          label: { fr: 'Cours', en: 'Courses' },
          href: '/ecole/cours',
          description: {
            fr: 'Unités de formation indépendantes.',
            en: 'Independent training units.',
          },
        },
        {
          label: { fr: 'Ateliers live', en: 'Live workshops' },
          href: '/ecole/atelier',
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
        href: '/ecole',
      },
    },
  ],
};

/* ─── Mega-menu Offres (1 colonne avec catégories) ─── */

const OFFRES: MegaMenuSection = {
  parent: 'offres',
  label: { fr: 'Offres', en: 'Services' },
  parentHref: '/offres',
  columns: [
    {
      title: { fr: 'Offres', en: 'Services' },
      links: [
        { label: { fr: 'Growth System IA', en: 'AI Growth System' }, href: '/offres/growth-system-ia' },
        { label: { fr: 'Activation IA', en: 'AI Activation' }, href: '/offres/activation-ia' },
        { label: { fr: 'Site IA-first', en: 'AI-first website' }, href: '/offres/site-web-ia' },
        { label: { fr: 'RevOps Rebuild', en: 'RevOps Rebuild' }, href: '/offres/revops' },
        { label: { fr: 'Application IA · PME', en: 'AI App · SMB' }, href: '/offres/application-ia-pme' },
        { label: { fr: 'Audit maturité IA', en: 'AI Maturity Audit' }, href: '/offres/audit-maturite-ia' },
        { label: { fr: 'Claude Cowork', en: 'Claude Cowork' }, href: '/offres/claude-cowork' },
        { label: { fr: 'Infrastructure IA', en: 'AI Infrastructure' }, href: '/offres/infrastructure-ia' },
        { label: { fr: 'Conseil', en: 'Consulting' }, href: '/offres/conseil' },
      ],
      footer: { label: { fr: 'Toutes les offres →', en: 'All services →' }, href: '/offres' },
    },
    {
      title: { fr: 'Produits', en: 'Products' },
      links: [
        { label: { fr: 'Catalogue produits', en: 'Products catalog' }, href: '/produits' },
        { label: { fr: 'Audits self-service', en: 'Self-serve audits' }, href: '/produits?type=audit-guide' },
        { label: { fr: 'Kits & templates', en: 'Kits & templates' }, href: '/produits?type=template-kit' },
        { label: { fr: 'Livres blancs premium', en: 'Premium white papers' }, href: '/produits?type=livre-blanc-premium' },
      ],
    },
    {
      title: { fr: 'Abonnements', en: 'Subscriptions' },
      links: [
        { label: { fr: 'Catalogue abonnements', en: 'Subscriptions catalog' }, href: '/abonnements' },
        { label: { fr: 'Gestion hébergement Vercel', en: 'Vercel hosting management' }, href: '/abonnements/gestion-hebergement-vercel' },
        { label: { fr: 'Monitoring IA continu', en: 'AI continuous monitoring' }, href: '/abonnements/monitoring-agents-ia' },
        { label: { fr: 'Production éditoriale', en: 'Editorial production' }, href: '/abonnements/production-editoriale-seo-geo' },
        { label: { fr: 'Espace client', en: 'Customer portal' }, href: '/espace-client' },
      ],
    },
  ],
};

/* ─── Mega-menu Solutions (par catégorie) ─── */

const SOLUTIONS: MegaMenuSection = {
  parent: 'solutions',
  label: { fr: 'Solutions', en: 'Solutions' },
  parentHref: '/solutions',
  columns: [
    {
      title: { fr: 'Par cas d’usage', en: 'By use case' },
      links: [
        { label: { fr: 'Acquisition IA', en: 'AI Acquisition' }, href: '/solutions/acquisition-ia' },
        { label: { fr: 'Contenu SEO/GEO', en: 'SEO/GEO Content' }, href: '/solutions/contenu-seo-geo-ia' },
        { label: { fr: 'CRM & Relances', en: 'CRM & Follow-ups' }, href: '/solutions/crm-relances-ia' },
        { label: { fr: 'Productivité IA', en: 'AI Productivity' }, href: '/solutions/productivite-ia' },
        { label: { fr: 'Support client IA', en: 'AI Customer Support' }, href: '/solutions/support-client-ia' },
        { label: { fr: 'Site web IA · PME', en: 'AI-first web · SMB' }, href: '/solutions/site-web-ia-pme' },
      ],
    },
    {
      title: { fr: 'Par secteur', en: 'By industry' },
      links: [
        { label: { fr: 'Finance & Compta', en: 'Finance & Accounting' }, href: '/secteurs/finance-compta' },
        { label: { fr: 'Industrie', en: 'Manufacturing' }, href: '/secteurs/industrie' },
        { label: { fr: 'Services B2B', en: 'B2B Services' }, href: '/secteurs/services-b2b' },
        { label: { fr: 'Fintech', en: 'Fintech' }, href: '/solutions/fintech' },
      ],
      footer: { label: { fr: 'Tous les secteurs →', en: 'All industries →' }, href: '/secteurs' },
    },
    {
      title: { fr: 'Atlas', en: 'Atlas' },
      links: [
        { label: { fr: 'Cartographie complète', en: 'Complete map' }, href: '/atlas' },
        { label: { fr: 'Console VirtuoseOS', en: 'VirtuoseOS Console' }, href: '/console' },
        { label: { fr: 'Manifeste', en: 'Manifesto' }, href: '/manifesto' },
      ],
    },
  ],
};

/* ─── Mega-menu L'Agence (1 colonne) ─── */

const AGENCE: MegaMenuSection = {
  parent: 'agence',
  label: { fr: "L'Agence", en: 'The Agency' },
  parentHref: '/agence/about',
  columns: [
    {
      title: { fr: 'Présentation', en: 'About' },
      links: [
        { label: { fr: 'Qui sommes-nous', en: 'About us' }, href: '/agence/about' },
        { label: { fr: 'Méthode Waimia', en: 'Waimia Method' }, href: '/agence/methode' },
        { label: { fr: 'Équipe', en: 'Team' }, href: '/equipe' },
        { label: { fr: 'Carrières', en: 'Careers' }, href: '/agence/careers' },
      ],
    },
    {
      title: { fr: 'Confiance', en: 'Trust' },
      links: [
        { label: { fr: 'Gouvernance IA', en: 'AI Governance' }, href: '/agence/governance' },
        { label: { fr: 'Trust Center', en: 'Trust Center' }, href: '/agence/trust-center' },
        { label: { fr: 'Design System', en: 'Design System' }, href: '/agence/design-system' },
        { label: { fr: 'Documentation', en: 'Documentation' }, href: '/agence/docs' },
      ],
    },
    {
      title: { fr: 'Contact', en: 'Contact' },
      links: [
        { label: { fr: 'Réserver un audit', en: 'Book an audit' }, href: '/contact' },
        { label: { fr: 'Espace client', en: 'Customer portal' }, href: '/espace-client' },
        { label: { fr: 'Newsletter', en: 'Newsletter' }, href: '/ressources/newsletter' },
      ],
      footer: { label: { fr: 'Tout l\'agence →', en: 'All about us →' }, href: '/agence/about' },
    },
  ],
};

/* ─── Mega-menu Cas (1 colonne simple) ─── */

const CAS: MegaMenuSection = {
  parent: 'cas',
  label: { fr: 'Cas', en: 'Cases' },
  parentHref: '/cas',
  columns: [
    {
      title: { fr: 'Cas clients', en: 'Client cases' },
      links: [
        { label: { fr: 'Plateau · SaaS B2B', en: 'Plateau · B2B SaaS' }, href: '/cas/plateau' },
        { label: { fr: 'Halcyon', en: 'Halcyon' }, href: '/cas/halcyon' },
        { label: { fr: 'Northbound', en: 'Northbound' }, href: '/cas/northbound' },
        { label: { fr: 'Caserne', en: 'Caserne' }, href: '/cas/caserne' },
      ],
      footer: { label: { fr: 'Tous les cas →', en: 'All cases →' }, href: '/cas' },
    },
  ],
};

/* ─── Export structure complète ─── */

export const MEGA_MENU: MegaMenuSection[] = [
  SOLUTIONS,
  OFFRES,
  CAS,
  RESSOURCES,
  AGENCE,
];

/**
 * Helper : retourne la section méga-menu pour un parent donné.
 */
export function getMegaMenuSection(parent: string): MegaMenuSection | undefined {
  return MEGA_MENU.find((s) => s.parent === parent);
}
