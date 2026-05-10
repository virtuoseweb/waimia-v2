import type { Lang } from '../lib/i18n';

export type BiText = Record<Lang, string>;

export const CATEGORIES: Record<
  string,
  { label: BiText; description: BiText; color?: string }
> = {
  acquisition: {
    label: { fr: 'Acquisition', en: 'Acquisition' },
    description: {
      fr: 'Pipeline commercial, leads, qualification',
      en: 'Sales pipeline, leads, qualification',
    },
  },
  crm: {
    label: { fr: 'CRM & Relances', en: 'CRM & Follow-ups' },
    description: {
      fr: 'CRM nettoyé, relances IA, scoring',
      en: 'Clean CRM, AI follow-ups, scoring',
    },
  },
  'contenu-seo-geo': {
    label: { fr: 'Contenu SEO/GEO', en: 'SEO/GEO Content' },
    description: {
      fr: 'Articles, indexation Google + IA génératives',
      en: 'Articles, Google + AI engines indexing',
    },
  },
  productivite: {
    label: { fr: 'Productivité', en: 'Productivity' },
    description: {
      fr: 'Excel augmenté, Office, workflows internes',
      en: 'Augmented Excel, Office, internal workflows',
    },
  },
  support: {
    label: { fr: 'Support client', en: 'Customer Support' },
    description: {
      fr: 'Triage IA, résolution N1, escalade humaine',
      en: 'AI triage, L1 resolution, human escalation',
    },
  },
  pilotage: {
    label: { fr: 'Pilotage data', en: 'Data Intelligence' },
    description: {
      fr: 'KPI temps réel, dashboards, lisibilité',
      en: 'Real-time KPIs, dashboards, clarity',
    },
  },
  data: {
    label: { fr: 'Data & ETL', en: 'Data & ETL' },
    description: {
      fr: 'Connecteurs, structuration, qualité',
      en: 'Connectors, structure, quality',
    },
  },
  gouvernance: {
    label: { fr: 'Gouvernance IA', en: 'AI Governance' },
    description: {
      fr: 'AI Act, RGPD, conformité',
      en: 'AI Act, GDPR, compliance',
    },
  },
};

export const CLUSTERS: Record<
  string,
  { label: BiText; pillarSlug?: string; targetSize: number }
> = {
  'pilier-acquisition-pme-2026': {
    label: { fr: 'Acquisition PME B2B 2026', en: 'B2B SMB Acquisition 2026' },
    pillarSlug: 'guide-acquisition-pme-b2b-2026',
    targetSize: 8,
  },
  'pilier-crm-relances-pme-2026': {
    label: { fr: 'CRM & relances PME 2026', en: 'SMB CRM & follow-ups 2026' },
    targetSize: 6,
  },
  'pilier-productivite-excel-2026': {
    label: {
      fr: 'Productivité Excel & Office IA 2026',
      en: 'Excel & Office AI Productivity 2026',
    },
    targetSize: 6,
  },
};

export const SOURCE_TYPES = {
  state: {
    label: { fr: 'Source publique', en: 'Public source' },
    color: '#1e40af',
  },
  university: {
    label: { fr: 'Recherche académique', en: 'Academic research' },
    color: '#7c3aed',
  },
  journal: { label: { fr: 'Presse', en: 'Press' }, color: '#374151' },
  enterprise: {
    label: { fr: 'Communiqué entreprise', en: 'Enterprise release' },
    color: '#C94F2E',
  },
  research: {
    label: { fr: 'Étude / cabinet', en: 'Research / firm' },
    color: '#ea580c',
  },
};
