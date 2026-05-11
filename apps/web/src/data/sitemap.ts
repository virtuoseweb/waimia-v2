// Waimia · sitemap.ts
// Source de vérité du mega-menu, footer, trust badges, marquee, content homepage.
// Portage typé de handoff/parts/sitemap-data.jsx — types stricts pour DX.

import type { Lang } from '../lib/i18n';

export type BiText = { en: string; fr: string };

export type NavItem = {
  href: string;
  label: BiText;
  lead?: BiText;
  featured?: boolean;
};

export type NavColumn = {
  kicker: BiText;
  label: BiText;
  tint?: string;
  items: NavItem[];
};

export type FeaturedCard = {
  kicker: BiText;
  label: BiText;
  body: BiText;
  cta: BiText;
  href: string;
};

export type MegaMenu = {
  key: string;
  label: BiText;
  href: string;
  lead: BiText;
  cols: NavColumn[];
  featured?: FeaturedCard;
};

export type SimpleNav = { key: string; label: BiText; href: string; simple: true };

// ─── MEGA-MENU 1 · SOLUTIONS
export const MM_SOLUTIONS_NEW: MegaMenu = {
  key: 'solutions',
  label: { en: 'Solutions', fr: 'Solutions' },
  href: '/solutions',
  lead: {
    en: 'Five AI systems built around recurring SMB pain points — acquisition, customer relations, productivity, intelligence, operations.',
    fr: "Cinq systèmes IA qui adressent les douleurs récurrentes des PME — acquisition, relation client, productivité, pilotage, opérations.",
  },
  cols: [
    {
      kicker: { en: 'BY PROBLEM', fr: 'PAR PROBLÈME' },
      label: { en: 'Business use cases', fr: "Cas d'usage business" },
      items: [
        { href: '/solutions/acquisition-ia', label: { en: 'AI Acquisition', fr: 'Acquisition IA' }, lead: { en: 'More qualified leads, without hiring.', fr: 'Plus de leads qualifiés, sans recruter.' } },
        { href: '/solutions/crm-relances-ia', label: { en: 'CRM & AI follow-ups', fr: 'CRM & relances IA' }, lead: { en: 'A sales pipeline that never sleeps.', fr: 'Pipeline commercial qui ne dort jamais.' } },
        { href: '/solutions/contenu-seo-geo-ia', label: { en: 'SEO/GEO content with AI', fr: 'Contenu SEO / GEO IA' }, lead: { en: 'Content found by Google AND AI engines.', fr: 'Du contenu trouvé par Google ET les IA.' } },
        { href: '/solutions/productivite-ia', label: { en: 'AI Productivity', fr: 'Productivité IA' }, lead: { en: 'Your Excel and Office teams, augmented.', fr: 'Vos équipes Excel et Office, augmentées.' } },
        { href: '/solutions/support-client-ia', label: { en: 'AI Customer Support', fr: 'Support client IA' }, lead: { en: '24/7 answers, smart human escalation.', fr: 'Réponses 24/7, escalade humaine intelligente.' } },
      ],
    },
    {
      kicker: { en: 'BY SECTOR', fr: 'PAR SECTEUR' },
      label: { en: 'Adapted to your industry', fr: 'Adapté à votre métier' },
      items: [
        { href: '/secteurs/services-b2b', label: { en: 'B2B Services', fr: 'Services B2B' }, lead: { en: 'Consulting, agencies, services firms.', fr: 'Cabinets, conseil, agences, prestataires.' } },
        { href: '/secteurs/industrie', label: { en: 'Industry & manufacturing SMBs', fr: 'Industrie & PME industrielles' }, lead: { en: 'Connected ERP, maintenance, quality.', fr: 'ERP connecté, maintenance, qualité.' } },
        { href: '/secteurs/finance-compta', label: { en: 'Finance & accounting firms', fr: 'Finance & cabinets comptables' }, lead: { en: 'Reconciliation, reporting, compliance.', fr: 'Réconciliation, reporting, conformité.' } },
        { href: '/secteurs', label: { en: 'All sectors →', fr: 'Tous les secteurs →' } },
      ],
    },
  ],
  featured: {
    kicker: { en: 'FEATURED CASE', fr: 'CAS CLIENT VEDETTE' },
    label: { en: '+€2.4M pipeline recovered', fr: '+€2,4 M de pipeline récupéré' },
    body: {
      en: 'Sales pipeline reconnected, qualification automated, real-time visibility. B2B SaaS · 10 weeks.',
      fr: 'Pipeline commercial reconnecté, qualification automatisée, visibilité temps réel. SaaS B2B · 10 semaines.',
    },
    cta: { en: 'Read the case →', fr: 'Lire le cas →' },
    href: '/cas/plateau',
  },
};

export const MM_SOLUTIONS: MegaMenu = MM_SOLUTIONS_NEW;

// ─── MEGA-MENU 2 · OFFRES
export const MM_OFFRES_NEW: MegaMenu = {
  key: 'offres',
  label: { en: 'Services', fr: 'Offres' },
  href: '/offres',
  lead: {
    en: 'Three systems for the business levers — a starter format to activate quickly, an enterprise format for larger ambitions.',
    fr: "Trois systèmes pour adresser les leviers business — un format starter pour activer rapidement, un format ETI quand l'ambition est plus forte.",
  },
  cols: [
    {
      kicker: { en: '01 · THE 3 PILLARS', fr: '01 · LES 3 PILIERS' },
      label: { en: 'Business systems', fr: 'Systèmes business' },
      tint: '#C94F2E',
      items: [
        { href: '/offres/growth-system-ia', label: { en: 'AI Growth System', fr: 'Growth System IA' }, lead: { en: 'Automated acquisition and conversion system. Site, CRM, follow-ups, dashboards — all connected.', fr: "Système d'acquisition et de conversion automatisé. Site, CRM, relances, dashboards — tout connecté." }, featured: true },
        { href: '/offres/growth-intelligence', label: { en: 'Growth Intelligence', fr: 'Growth Intelligence' }, lead: { en: 'Real-time intelligence and data clarity for faster decisions.', fr: 'Pilotage temps réel et lisibilité des données pour décider plus vite.' } },
        { href: '/offres/productivite-operationnelle-ia', label: { en: 'Operational AI', fr: 'Productivité Opérationnelle IA' }, lead: { en: 'Repetitive tasks automated, internal workflows streamlined.', fr: 'Tâches répétitives automatisées, workflows internes fluidifiés.' } },
        { href: '/offres/site-web-ia', label: { en: 'AI website', fr: 'Site web IA' }, lead: { en: 'Astro + AI site · showcase + acquisition.', fr: 'Site Astro + IA · vitrine + acquisition.' } },
        { href: '/offres/revops', label: { en: 'RevOps Rebuild', fr: 'RevOps Rebuild' }, lead: { en: 'CRM + warehouse + billing reconciled · 10 wks.', fr: 'CRM + entrepôt + billing réconciliés · 10 sem.' } },
      ],
    },
    {
      kicker: { en: '02 · TIERS', fr: '02 · NIVEAUX' },
      label: { en: 'Activation & infrastructure', fr: 'Activation & infrastructure' },
      items: [
        { href: '/offres/activation-ia', label: { en: 'AI Activation · 1 week', fr: 'Activation IA · 1 semaine' }, lead: { en: 'Audit + team training. The fast-track entry point.', fr: "Audit + formation des équipes. La porte d'entrée pour activer rapidement." } },
        { href: '/offres/infrastructure-ia', label: { en: 'AI Infrastructure · Enterprise', fr: 'Infrastructure IA · ETI' }, lead: { en: 'Connected systems at scale, multi-team, multi-site.', fr: 'Systèmes connectés à grande échelle, multi-équipes, multi-sites.' } },
        { href: '/offres/application-ia-pme', label: { en: 'AI Application for SMBs', fr: 'Application IA pour PME' }, lead: { en: 'Dedicated app 8–12 wks. ETI/SMB.', fr: 'App dédiée 8–12 sem. ETI/PME.' } },
        { href: '/offres/conseil', label: { en: 'AI Consulting & audit', fr: 'Conseil & audit IA' }, lead: { en: '7 audit/roadmap/governance services.', fr: '7 services audit/roadmap/gouvernance.' } },
      ],
    },
  ],
  featured: {
    kicker: { en: 'FLAGSHIP SERVICE', fr: 'OFFRE PHARE' },
    label: { en: 'AI Growth System', fr: 'Growth System IA' },
    body: {
      en: 'An automated acquisition and conversion system. Site, CRM, follow-ups, dashboards — connected and AI-driven. €5–20k.',
      fr: "Un système d'acquisition et de conversion automatisé. Site, CRM, relances, dashboards — connectés et pilotés par l'IA. 5 à 20 k€.",
    },
    cta: { en: 'See the system →', fr: 'Découvrir le système →' },
    href: '/offres/growth-system-ia',
  },
};

export const MM_OFFRES: MegaMenu = MM_OFFRES_NEW;

// ─── MEGA-MENU 3 · CAS CLIENTS
export const MM_CASES_NEW: MegaMenu = {
  key: 'cas',
  label: { en: 'Case studies', fr: 'Cas clients' },
  href: '/cas',
  lead: {
    en: 'Pipelines reconnected, qualification automated, operations streamlined. Measured ROI, not promised.',
    fr: 'Pipelines reconnectés, qualifications automatisées, opérations fluidifiées. ROI mesurés, pas promis.',
  },
  cols: [
    {
      kicker: { en: 'BY PAIN POINT', fr: 'PAR DOULEUR' },
      label: { en: 'Flagship cases', fr: 'Cas vedettes' },
      items: [
        { href: '/cas/plateau', label: { en: 'Plateau · +€2.4M pipeline recovered', fr: 'Plateau · +€2,4M pipeline récupéré' }, lead: { en: 'B2B SaaS · 10 weeks · qualification + automated follow-ups.', fr: 'SaaS B2B · 10 semaines · qualification + relances automatisées.' }, featured: true },
        { href: '/cas/halcyon', label: { en: 'Halcyon · −38% triage time', fr: 'Halcyon · −38% temps de triage' }, lead: { en: 'Healthtech · 6 weeks · AI request routing.', fr: 'Santé-tech · 6 semaines · routage IA des demandes.' } },
        { href: '/cas/northbound', label: { en: 'Northbound · ×3.1 SQL conversion', fr: 'Northbound · ×3,1 conversion SQL' }, lead: { en: 'EU Fintech · 14 weeks · automated lead scoring.', fr: 'Fintech EU · 14 semaines · lead scoring automatisé.' } },
        { href: '/cas/caserne', label: { en: 'Caserne · 1,200 hours/year saved', fr: 'Caserne · 1 200 h/an récupérées' }, lead: { en: 'FR Industry · 8 weeks · back-office automation.', fr: 'Industrie FR · 8 semaines · automatisation back-office.' } },
      ],
    },
    {
      kicker: { en: 'BY SECTOR', fr: 'PAR SECTEUR' },
      label: { en: 'Similar profiles', fr: 'Profils similaires' },
      items: [
        { href: '/cas?secteur=services-b2b', label: { en: 'B2B Services', fr: 'Services B2B' } },
        { href: '/cas?secteur=industrie', label: { en: 'Industry', fr: 'Industrie' } },
        { href: '/cas?secteur=finance', label: { en: 'Finance & accounting', fr: 'Finance & compta' } },
        { href: '/cas', label: { en: 'See all cases →', fr: 'Voir tous les cas →' } },
      ],
    },
  ],
  featured: {
    kicker: { en: 'TESTIMONIAL', fr: 'TÉMOIGNAGE' },
    label: { en: 'How Plateau doubled its follow-up rate', fr: 'Comment Plateau a doublé son taux de relance' },
    body: { en: 'Before: 12% of leads followed up. After: 67%. Without hiring.', fr: 'Avant : 12% des leads relancés. Après : 67%. Sans recrutement.' },
    cta: { en: 'Read the story →', fr: "Lire l'histoire →" },
    href: '/cas/plateau',
  },
};

// ─── MEGA-MENU 3 · TECHNOLOGIES
export const MM_TECH: MegaMenu = {
  key: 'technologies',
  label: { en: 'Technologies', fr: 'Technologies' },
  href: '/technologies',
  lead: {
    en: 'The stack we ship on. Anthropic-first · open-source when sovereignty demands it.',
    fr: "La stack qu'on déploie. Anthropic d'abord · open-source quand la souveraineté l'exige.",
  },
  cols: [
    {
      kicker: { en: 'THE CLAUDE ECOSYSTEM', fr: 'ÉCOSYSTÈME CLAUDE' },
      label: { en: 'Anthropic · primary', fr: 'Anthropic · premier partenaire' },
      tint: '#C94F2E',
      items: [
        { href: '/technologies/claude-models', label: { en: 'Claude models · Opus · Sonnet · Haiku', fr: 'Modèles Claude · Opus · Sonnet · Haiku' }, lead: { en: 'Opus 4.7 · Sonnet 4.6 · Haiku 4.5.', fr: 'Opus 4.7 · Sonnet 4.6 · Haiku 4.5.' } },
        { href: '/technologies/claude-code', label: { en: 'Claude Code & Managed Agents', fr: 'Claude Code & Managed Agents' } },
        { href: '/technologies/claude-surfaces', label: { en: 'Claude Cowork · Skills · MCP', fr: 'Claude Cowork · Skills · MCP' } },
        { href: '/technologies/integrations-office', label: { en: 'Office · Chrome · Excel · PPT · Word · Slack', fr: 'Office · Chrome · Excel · PPT · Word · Slack' } },
      ],
    },
    {
      kicker: { en: 'OPEN SOURCE · SOVEREIGN', fr: 'OPEN SOURCE · SOUVERAIN' },
      label: { en: 'Self-hosted', fr: 'Self-hosted' },
      items: [
        { href: '/technologies/virtuoseos', label: { en: 'VirtuoseOS · sovereign agent runtime', fr: 'VirtuoseOS · runtime souverain' }, lead: { en: 'Our open agent OS · self-hosted, audit-ready.', fr: "Notre OS d'agents · self-hosted, traçable." }, featured: true },
        { href: '/technologies/inference', label: { en: 'vLLM · Ollama · Prem AI', fr: 'vLLM · Ollama · Prem AI' } },
        { href: '/technologies/open-source-models', label: { en: 'Qwen 3.5 · Llama 4 · DeepSeek V3.2 · GLM-5', fr: 'Qwen 3.5 · Llama 4 · DeepSeek V3.2 · GLM-5' } },
        { href: '/technologies/rag-prive', label: { en: 'Private RAG · vector DBs', fr: 'RAG privé · vector DBs' } },
        { href: '/technologies/fine-tuning', label: { en: 'Fine-tuning on private data', fr: 'Fine-tuning sur données privées' } },
      ],
    },
    {
      kicker: { en: 'FRAMEWORKS · ORCHESTRATION', fr: 'FRAMEWORKS · ORCHESTRATION' },
      label: { en: 'Multi-agent & no-code', fr: 'Multi-agents & no-code' },
      items: [
        { href: '/technologies', label: { en: 'Technologies hub · the full stack', fr: 'Hub Technologies · la stack complète' }, lead: { en: 'Anthropic · open-source · orchestration.', fr: "Anthropic · open-source · orchestration." }, featured: true },
        { href: '/technologies/frameworks', label: { en: 'LangGraph · CrewAI · AutoGen', fr: 'LangGraph · CrewAI · AutoGen' } },
        { href: '/technologies/no-code', label: { en: 'Make · n8n · Zapier', fr: 'Make · n8n · Zapier' } },
        { href: '/technologies/observability', label: { en: 'Observability · LangSmith · Helicone', fr: 'Observabilité · LangSmith · Helicone' } },
      ],
    },
  ],
  featured: {
    kicker: { en: 'PARTNERSHIP', fr: 'PARTENARIAT' },
    label: { en: 'Anthropic Partner · in progress', fr: 'Partenaire Anthropic · en cours' },
    body: { en: 'Francophone expert track. Claude Certified Architect.', fr: 'Parcours expert francophone. Claude Certified Architect.' },
    cta: { en: 'Our certifications →', fr: 'Nos certifications →' },
    href: '/agence#certifications',
  },
};

// ─── MEGA-MENU 4 · RESSOURCES
export const MM_RESOURCES: MegaMenu = {
  key: 'ressources',
  label: { en: 'Resources', fr: 'Ressources' },
  href: '/ressources',
  lead: {
    en: 'Business insights, proof, and practical tools for SMBs adopting AI without theatre.',
    fr: 'Insights business, preuves et outils pratiques pour les PME qui activent l’IA sans théâtre.',
  },
  cols: [
    {
      kicker: { en: 'PROOF', fr: 'PREUVES' },
      label: { en: 'Case files & testimonials', fr: 'Cas & témoignages' },
      items: [
        { href: '/ressources/cas', label: { en: 'Case studies · measured ROI', fr: 'Études de cas · ROI mesuré' } },
        { href: '/ressources/temoignages', label: { en: 'Client testimonials', fr: 'Témoignages clients' } },
        { href: '/ressources/cas/virtuoseos', label: { en: 'VirtuoseOS · blueprint case', fr: 'VirtuoseOS · cas blueprint' }, featured: true },
        { href: '/ressources/academy', label: { en: 'Academy · Claude training', fr: 'Academy · formations Claude' }, lead: { en: 'Technical Claude + agents sessions.', fr: 'Sessions techniques Claude + agents.' } },
        { href: '/ressources/changelog', label: { en: 'Changelog · Claude versions', fr: 'Changelog · versions Claude' }, lead: { en: 'Anthropic product releases watch.', fr: 'Veille produit Anthropic releases.' } },
      ],
    },
    {
      kicker: { en: 'BUSINESS INSIGHTS', fr: 'INSIGHTS BUSINESS' },
      label: { en: 'SMB/SME applied AI', fr: 'IA appliquée PME/ETI' },
      items: [
        { href: '/ressources/cookbooks/claude-cowork-rollout', label: { en: 'Cookbook · Claude Cowork rollout', fr: 'Cookbook · Déploiement Claude Cowork' }, lead: { en: 'Roll out Claude in a team without losing the week.', fr: 'Déployer Claude dans une équipe sans perdre la semaine.' }, featured: true },
        { href: '/ressources/blog', label: { en: 'Blog · business insights', fr: 'Blog · insights business' } },
        { href: '/ressources/cookbooks', label: { en: 'Cookbooks & tutorials', fr: 'Cookbooks & tutoriels' }, lead: { en: 'Practical automation patterns for SMB teams.', fr: 'Patterns d’automatisation concrets pour équipes PME.' } },
        { href: '/ressources/livres-blancs', label: { en: 'White papers · in-depth', fr: 'Livres blancs · études' } },
      ],
    },
    {
      kicker: { en: 'DEEP READS', fr: 'LECTURES LONGUES' },
      label: { en: 'White papers & essays', fr: 'Livres blancs & essais' },
      tint: '#C94F2E',
      items: [
        { href: '/ressources/livres-blancs/ai-act-readiness', label: { en: 'White paper · AI Act Readiness', fr: "Livre blanc · Préparation à l'AI Act" }, lead: { en: 'The compliance dossier · downloadable.', fr: 'Le dossier de conformité · téléchargeable.' }, featured: true },
        { href: '/ressources/blog/brain-circuit', label: { en: 'Essay · Brain circuit', fr: 'Essai · Brain circuit' }, lead: { en: 'How operational AI rewires the company.', fr: "Comment l'IA opérationnelle recâble l'entreprise." } },
        { href: '/ressources/livres-blancs', label: { en: 'All white papers', fr: 'Tous les livres blancs' } },
        { href: '/ressources/veille-ia', label: { en: 'AI watch · weekly briefs', fr: 'Veille IA · synthèses hebdo' } },
        { href: '/technologies', label: { en: 'Technologies archive · the stack', fr: 'Archives technologies · la stack' }, lead: { en: 'Claude ecosystem + open-source + frameworks.', fr: "Écosystème Claude + open-source + frameworks." } },
      ],
    },
  ],
  featured: {
    kicker: { en: 'WHITE PAPER', fr: 'LIVRE BLANC' },
    label: { en: 'AI Act Readiness Dossier', fr: "Dossier Préparation à l'AI Act" },
    body: { en: 'The complete compliance dossier to anticipate the AI Act before launching an operational AI project.', fr: "Le dossier de conformité complet pour anticiper l'AI Act avant de lancer un projet IA opérationnel." },
    cta: { en: 'Open the white paper →', fr: 'Ouvrir le livre blanc →' },
    href: '/ressources/livres-blancs/ai-act-readiness',
  },
};

// ─── MEGA-MENU 5 · AGENCE
export const MM_AGENCY_NEW: MegaMenu = {
  key: 'agence',
  label: { en: 'The Agency', fr: "L'Agence" },
  href: '/agence',
  lead: {
    en: 'A team based in Paris and Geneva. An anti-theatre method. A Trust Center that details everything.',
    fr: 'Une équipe basée à Paris et Genève. Une méthode anti-théâtre. Un Trust Center qui détaille tout.',
  },
  cols: [
    {
      kicker: { en: 'THE TEAM', fr: "L'ÉQUIPE" },
      label: { en: 'Who we are', fr: 'Qui nous sommes' },
      items: [
        { href: '/agence/about', label: { en: 'About Waimia', fr: 'À propos de Waimia' } },
        { href: '/agence/methode', label: { en: 'Our method · Process Intelligence', fr: 'Notre méthode · Process Intelligence' }, lead: { en: 'Audit, deployment, measurement — no PowerPoint.', fr: 'Audit, déploiement, mesure — pas de PowerPoint.' }, featured: true },
        { href: '/agence/careers', label: { en: 'Careers', fr: 'Carrières' } },
        { href: '/equipe/simon-beros', label: { en: 'Simon Beros · Founder CV', fr: 'Simon Beros · CV Founder' }, lead: { en: 'Agentic systems architecture.', fr: 'Architecture systèmes agentiques.' } },
      ],
    },
    {
      kicker: { en: 'TRUST', fr: 'CONFIANCE' },
      label: { en: 'Guarantees & legal', fr: 'Garanties & légal' },
      items: [
        { href: '/agence/trust-center', label: { en: 'Trust Center · AI Act, GDPR, ISO', fr: 'Trust Center · AI Act, RGPD, ISO' }, lead: { en: 'All controls, in plain text.', fr: 'Tous les contrôles, en clair.' } },
        { href: '/contact', label: { en: 'Contact us · 45 min', fr: 'Nous contacter · 45 min' }, lead: { en: 'Free scoping, honest audit, or nothing.', fr: 'Cadrage gratuit, audit honnête, ou rien.' } },
        { href: '/agence/governance', label: { en: 'Governance · ethics committee', fr: 'Gouvernance · ethics committee' }, lead: { en: 'AI ethics committee + whistleblowing.', fr: 'Comité ethics IA + whistleblowing.' } },
        { href: '/agence/docs', label: { en: 'Technical documentation', fr: 'Documentation technique' }, lead: { en: 'Our stack + integrations.', fr: 'Notre stack + intégrations.' } },
      ],
    },
  ],
  featured: {
    kicker: { en: 'LOCATION', fr: 'ANCRAGE' },
    label: { en: 'Paris · Geneva', fr: 'Paris · Genève' },
    body: { en: 'Two offices. One method. French and Swiss parity.', fr: 'Deux bureaux. Une seule méthode. Parité française et helvétique.' },
    cta: { en: 'See the offices →', fr: 'Voir les bureaux →' },
    href: '/agence/about#bureaux',
  },
};

// ─── PRIMARY NAV
export const PRIMARY_NAV: Array<MegaMenu | SimpleNav> = [
  MM_SOLUTIONS_NEW,
  MM_OFFRES_NEW,
  MM_CASES_NEW,
  MM_RESOURCES,
  MM_AGENCY_NEW,
];

// ─── FOOTER (5 colonnes)
export type FooterCol = {
  heading: BiText;
  shield?: boolean;
  items: Array<{ label: BiText; href: string }>;
};

export const FOOTER_COLS: FooterCol[] = [
  // Col 1 — L'Agence
  {
    heading: { en: 'The Agency', fr: "L'Agence" },
    items: [
      { href: '/agence/about', label: { en: 'About Waimia', fr: 'À propos' } },
      {
        href: '/agence/methode',
        label: {
          en: 'Our method · Process Intelligence',
          fr: 'Notre méthode · Process Intelligence',
        },
      },
      {
        href: '/agence/trust-center',
        label: { en: 'Trust Center', fr: 'Trust Center' },
      },
      { href: '/agence/careers', label: { en: 'Careers', fr: 'Carrières' } },
      { href: '/contact', label: { en: 'Contact', fr: 'Nous contacter' } },
    ],
  },
  // Col 2 — Solutions
  {
    heading: { en: 'Solutions', fr: 'Solutions' },
    items: [
      {
        href: '/solutions/acquisition-ia',
        label: { en: 'AI Acquisition', fr: 'Acquisition IA' },
      },
      {
        href: '/solutions/crm-relances-ia',
        label: { en: 'CRM & AI follow-ups', fr: 'CRM & relances IA' },
      },
      {
        href: '/solutions/contenu-seo-geo-ia',
        label: { en: 'SEO/GEO content with AI', fr: 'Contenu SEO/GEO IA' },
      },
      {
        href: '/solutions/productivite-ia',
        label: { en: 'AI Productivity', fr: 'Productivité IA' },
      },
      {
        href: '/solutions/support-client-ia',
        label: { en: 'AI Customer Support', fr: 'Support client IA' },
      },
      { href: '/secteurs', label: { en: 'By sector →', fr: 'Par secteur →' } },
    ],
  },
  // Col 3 — Offres
  {
    heading: { en: 'Services', fr: 'Offres' },
    items: [
      {
        href: '/offres/growth-system-ia',
        label: { en: 'AI Growth System', fr: 'Growth System IA' },
      },
      {
        href: '/offres/growth-intelligence',
        label: { en: 'Growth Intelligence', fr: 'Growth Intelligence' },
      },
      {
        href: '/offres/productivite-operationnelle-ia',
        label: { en: 'Operational AI', fr: 'Productivité Opérationnelle IA' },
      },
      {
        href: '/offres/activation-ia',
        label: {
          en: 'AI Activation · 1 week',
          fr: 'Activation IA · 1 semaine',
        },
      },
      {
        href: '/offres/infrastructure-ia',
        label: {
          en: 'AI Infrastructure · Enterprise',
          fr: 'Infrastructure IA · ETI',
        },
      },
    ],
  },
  // Col 4 — Ressources (enrichie : ajout outils + newsletter + veille)
  {
    heading: { en: 'Resources', fr: 'Ressources' },
    items: [
      { href: '/cas', label: { en: 'Case studies', fr: 'Cas clients' } },
      {
        href: '/ressources/blog',
        label: { en: 'Blog · 2026', fr: 'Blog · 2026' },
      },
      {
        href: '/ressources/cookbooks',
        label: { en: 'Cookbooks · guides', fr: 'Cookbooks · guides' },
      },
      {
        href: '/ressources/livres-blancs',
        label: { en: 'White papers', fr: 'Livres blancs' },
      },
      {
        href: '/ressources/outils',
        label: { en: 'Free tools', fr: 'Outils gratuits' },
      },
      {
        href: '/ressources/veille-ia',
        label: { en: 'AI watch', fr: 'Veille IA' },
      },
      {
        href: '/ressources/newsletter',
        label: { en: 'Newsletter', fr: 'Newsletter' },
      },
    ],
  },
  // Col 5 — Légal & Archive
  {
    heading: { en: 'Trust & Legal', fr: 'Légal & Archive' },
    shield: true,
    items: [
      {
        href: '/agence/trust-center',
        label: {
          en: 'Trust Center · AI Act, GDPR, ISO',
          fr: 'Trust Center · AI Act, RGPD, ISO',
        },
      },
      {
        href: '/agence/trust-center#ai-act',
        label: { en: 'AI Act · GDPR · LPD', fr: 'AI Act · RGPD · LPD' },
      },
      {
        href: '/agence/trust-center#privacy',
        label: { en: 'Privacy policy', fr: 'Politique de confidentialité' },
      },
      {
        href: '/agence/trust-center#cgv',
        label: { en: 'Terms & conditions', fr: 'Mentions légales & CGV' },
      },
      {
        href: '/agence/trust-center#cookies',
        label: { en: 'Cookie settings', fr: 'Gestion des cookies' },
      },
      {
        href: '/archive',
        label: { en: 'Site archive', fr: 'Archive du site' },
      },
    ],
  },
];

// ─── TRUST BADGES
export type TrustBadge = { k: string; label: BiText; kind: 'partner' | 'cert' | 'compliance' };
export const TRUST_BADGES: TrustBadge[] = [
  { k: 'ANTHROPIC',   kind: 'partner',    label: { en: 'Anthropic Partner · in progress', fr: 'Partenaire Anthropic · en cours' } },
  { k: 'CLAUDE-ARCH', kind: 'cert',       label: { en: 'Claude Certified Architect', fr: 'Claude Certified Architect' } },
  { k: 'FRANCENUM',   kind: 'cert',       label: { en: 'Francenum · AI & digital expert', fr: 'Activateur Francenum · expert IA' } },
  { k: 'AI-ACT',      kind: 'compliance', label: { en: 'AI Act ready', fr: 'AI Act ready' } },
  { k: 'RGPD',        kind: 'compliance', label: { en: 'GDPR · RGPD', fr: 'RGPD' } },
  { k: 'ISO-27001',   kind: 'compliance', label: { en: 'ISO 27001 · aligned', fr: 'ISO 27001 · aligné' } },
];

// ─── CLIENT LOGOS (marquee)
export const CLIENT_LOGOS = [
  'Ayla', 'Veriform', 'Northbound', 'Plateau', 'Halcyon', 'Opalfield',
  'Stratoclay', 'Meridian&Fils', 'Vireo', 'Caserne', 'Ouest.io', 'Nimbra',
  'Kilnwright', 'Hestia Labs', 'Obsidienne', 'Brume', 'Perla Finance', 'Verger',
] as const;

// ─── HOMEPAGE · core content
export const HERO_METRICS = [
  { k: '01', n: '12h/sem', label: { en: 'reclaimed per team weekly', fr: 'récupérées par équipe en moyenne' } },
  { k: '02', n: '23', label: { en: 'workflows automated on average', fr: 'workflows automatisés en moyenne' } },
  { k: '03', n: '+€840K', label: { en: 'pipeline reactivated · median', fr: 'pipeline relancé · médiane' } },
  { k: '04', n: '3,4×', label: { en: 'measured ROI at 12 months', fr: 'ROI mesuré à 12 mois' } },
];

export const PYRAMID_TIERS = [
  {
    n: 'I',
    tag: { en: 'ACTIVATION', fr: 'ACTIVATION' },
    label: { en: 'Fast activation', fr: 'Activation rapide' },
    lead: { en: 'One week to identify the lever, train the team, and ship the first quick win.', fr: "Une semaine pour identifier le levier, former l'équipe et livrer le premier quick win." },
    items: ['Audit process · 5j', 'Formation équipe · 1 sem', 'Quick win Excel'],
    href: '/offres#tier-1',
  },
  {
    n: 'II',
    tag: { en: 'PRODUCTIVITY', fr: 'PRODUCTIVITÉ' },
    label: { en: 'Operational productivity', fr: 'Productivité opérationnelle' },
    lead: { en: 'Remove recurring tasks and make internal workflows run without daily chasing.', fr: 'Supprimer les tâches récurrentes et fluidifier les workflows internes.' },
    items: ['Workflows métiers', 'Tâches répétitives', 'Support client'],
    href: '/offres#tier-2',
  },
  {
    n: 'III',
    tag: { en: 'GROWTH', fr: 'ACQUISITION' },
    label: { en: 'Acquisition & intelligence', fr: 'Acquisition & pilotage' },
    lead: { en: 'Connect site, CRM, follow-ups, content, and business visibility into one growth system.', fr: 'Connecter site, CRM, relances, contenu et visibilité business dans un même système.' },
    items: ["Système d'acquisition", 'Pipeline commercial', 'Dashboards pilotage', 'Contenu SEO/GEO'],
    href: '/offres#tier-3',
  },
  {
    n: 'IV',
    tag: { en: 'ENTERPRISE', fr: 'ETI' },
    label: { en: 'Enterprise infrastructure', fr: 'Infrastructure ETI' },
    lead: { en: 'Connected systems for larger teams, stricter governance, and multi-site operations.', fr: 'Systèmes connectés pour équipes élargies, gouvernance stricte et opérations multi-sites.' },
    items: ['Architecture connectée', 'Sécurité & gouvernance', 'Multi-équipes & multi-sites'],
    href: '/offres#tier-4',
  },
];

export const DEPARTMENTS_GRID = [
  { slug: 'acquisition-ia', label: { en: 'Acquisition', fr: 'Acquisition' }, tag: { en: 'Leads · landing · GEO', fr: 'Leads · landing · GEO' } },
  { slug: 'crm-relances-ia', label: { en: 'CRM & Follow-ups', fr: 'CRM & Relances' }, tag: { en: 'Pipeline · qualification · nurturing', fr: 'Pipeline · qualification · nurturing' } },
  { slug: 'contenu-seo-geo-ia', label: { en: 'SEO/GEO Content', fr: 'Contenu SEO/GEO' }, tag: { en: 'Articles · landings · AI indexing', fr: 'Articles · landing · indexation IA' } },
  { slug: 'productivite-ia', label: { en: 'Productivity', fr: 'Productivité' }, tag: { en: 'Excel · Office · internal workflows', fr: 'Excel · Office · workflows internes' } },
  { slug: 'support-client-ia', label: { en: 'Customer Support', fr: 'Support client' }, tag: { en: 'Triage · resolution · escalation', fr: 'Triage · résolution · escalade' } },
];

export const CASE_FEED = [
  { slug: 'plateau',    client: 'Plateau',        sector: { en: 'B2B SaaS',         fr: 'SaaS B2B' },         duration: '10 wk',     stack: 'Claude · HubSpot · dbt',         impact: { en: '+€2.4M pipeline reactivated · automated qualification', fr: '+€2,4 M de pipeline récupéré · qualification automatisée' } },
  { slug: 'halcyon',    client: 'Halcyon Health', sector: { en: 'Healthtech',       fr: 'Santé-tech' },       duration: '6 wk',      stack: 'Claude · Snowflake',             impact: { en: '−38% triage time · 24/7 response', fr: '−38% de temps de triage · réponse 24/7' } },
  { slug: 'northbound', client: 'Northbound',     sector: { en: 'Fintech · EU',     fr: 'Fintech · UE' },     duration: '14 wk',     stack: 'Claude · Segment · dbt',         impact: { en: '×3.1 conversion · automated scoring', fr: '×3,1 conversion · scoring automatisé' } },
  { slug: 'caserne',    client: 'Caserne',        sector: { en: 'Industry · FR',    fr: 'Industrie · FR' },   duration: '8 wk',      stack: 'Claude · custom RAG · SAP',      impact: { en: '1,200 h/year saved · streamlined back office', fr: '1 200 h/an récupérées · back-office fluidifié' } },
  { slug: 'virtuoseos', client: 'VirtuoseOS',     sector: { en: 'Internal blueprint', fr: 'Blueprint interne' }, duration: 'ongoing', stack: 'Claude · open-source · multi-agent', impact: { en: 'The operating system under every delivery', fr: 'Le système opérationnel sous chaque livraison' }, featured: true },
];

export const FIELD_NOTES = [
  { date: '04.2026', tag: { en: 'CASE',       fr: 'CAS' },     text: { en: 'Halcyon Health — AI triage routing in 6 weeks.',                                  fr: 'Halcyon Health — triage IA routé en 6 semaines.' } },
  { date: '04.2026', tag: { en: 'RELEASE',    fr: 'RELEASE' }, text: { en: 'VirtuoseOS 2.4 — multi-workspace kernels, French locale.',                        fr: 'VirtuoseOS 2.4 — kernels multi-workspace, locale FR.' } },
  { date: '03.2026', tag: { en: 'FIELD NOTE', fr: 'NOTE' },    text: { en: 'HubSpot + Claude: the unglamorous pattern that actually ships.',                  fr: 'HubSpot + Claude : le pattern sans relief qui livre vraiment.' } },
  { date: '03.2026', tag: { en: 'ESSAY',      fr: 'ESSAI' },   text: { en: 'Against the brain-circuit aesthetic.',                                            fr: "Contre l'esthétique cerveau-circuit." } },
  { date: '02.2026', tag: { en: 'CASE',       fr: 'CAS' },     text: { en: 'Plateau SaaS — RevOps rebuild, €2.4M pipeline recovered.',                        fr: 'Plateau SaaS — refonte RevOps, 2,4 M€ de pipeline récupéré.' } },
];

// ─── 6 services taught by doing — Acte II
export const SIX_SERVICES = [
  { k: '01', label: { en: '30-min diagnostic', fr: 'Diagnostic 30 min' }, body: { en: 'We identify the business lever before the technology.', fr: 'On identifie le levier business avant la techno.' } },
  { k: '02', label: { en: 'Acquisition system', fr: "Système d'acquisition" }, body: { en: 'Pipeline reconnected, qualification automated.', fr: 'Pipeline reconnecté, qualification automatisée.' } },
  { k: '03', label: { en: 'Augmented CRM', fr: 'CRM augmenté' }, body: { en: 'The CRM that does its work for you.', fr: 'Le CRM qui fait son travail à votre place.' } },
  { k: '04', label: { en: 'Data clarity', fr: 'Lisibilité des données' }, body: { en: 'Clear reporting, faster decisions.', fr: 'Reporting clair, décision rapide.' } },
  { k: '05', label: { en: 'Repetitive tasks removed', fr: 'Tâches répétitives éliminées' }, body: { en: 'Workflows that run without you.', fr: 'Workflows qui tournent sans vous.' } },
  { k: '06', label: { en: 'Enterprise custom build', fr: 'Sur-mesure ETI' }, body: { en: 'When the market stack is not enough.', fr: 'Quand la stack du marché ne suffit pas.' } },
];

// ─── 4 FIG rows — Acte I · Why AI stalls
export const WHY_AI_STALLS = [
  { fig: 'FIG 1.1', text: { en: 'A growing SMB rarely lacks tools. It lacks continuity between the CRM, inboxes, spreadsheets, and the site.', fr: 'Une PME en croissance manque rarement d’outils. Elle manque de continuité entre CRM, boîtes mail, tableurs et site.' } },
  { fig: 'FIG 1.2', text: { en: 'AI without structured business data turns every answer into an expensive guess.', fr: 'L’IA sans données métier structurées transforme chaque réponse en pari coûteux.' } },
  { fig: 'FIG 1.3', text: { en: 'Projects that reach production in less than 8 weeks keep momentum. After that, adoption usually becomes the real risk.', fr: 'Les projets livrés en moins de 8 semaines gardent l’élan. Après, le vrai risque devient l’adoption.' } },
  { fig: 'FIG 1.4', text: { en: "The rebuild reflex is usually wrong. The money leaks in handoffs: lead to CRM, CRM to sales, sales to delivery.", fr: 'Le réflexe de tout refaire trompe souvent. L’argent fuit dans les passations : lead vers CRM, CRM vers vente, vente vers livraison.' } },
];

// ─── i18n helper · tire la chaîne dans la langue active
export function pick(t: BiText, lang: Lang): string {
  return t[lang];
}
