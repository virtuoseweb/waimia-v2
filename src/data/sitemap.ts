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

// ─── MEGA-MENU 1 · OFFRES (pyramide 4 niveaux)
export const MM_OFFRES: MegaMenu = {
  key: 'offres',
  label: { en: 'Services', fr: 'Offres' },
  href: '/offres',
  lead: {
    en: 'From process audit to hosted sovereign infrastructure — four tiers, one continuous layer.',
    fr: "De l'audit process à l'infrastructure souveraine — quatre paliers, une couche continue.",
  },
  cols: [
    {
      kicker: { en: '01 · ADVISORY', fr: '01 · CONSEIL' },
      label: { en: 'Consulting & Audit', fr: 'Conseil & Audit' },
      tint: '#C94F2E',
      items: [
        { href: '/offres/audit-process-intelligence', label: { en: 'Process Intelligence Audit', fr: 'Audit Process Intelligence' }, lead: { en: 'Map the SOPs before the agents.', fr: 'Cartographier les SOPs avant les agents.' } },
        { href: '/offres/conformite-ai-act', label: { en: 'AI Act · GDPR · LPD Compliance', fr: 'Conformité AI Act · RGPD · LPD' }, lead: { en: 'Audit + remediation + dossier.', fr: 'Audit + remédiation + dossier.' } },
        { href: '/offres/architecture-hybride', label: { en: 'Hybrid Architecture Strategy', fr: "Stratégie d'architecture hybride" }, lead: { en: 'Claude + open-source · the split.', fr: "Claude + open-source · l'équilibre." } },
        { href: '/offres/diagnostic-maturite', label: { en: 'AI Readiness Diagnostic · 5 days', fr: 'Diagnostic maturité IA · 5 jours' } },
      ],
    },
    {
      kicker: { en: '02 · LIGHT DEPLOYMENT', fr: '02 · DÉPLOIEMENT LIGHT' },
      label: { en: 'Claude at every desk', fr: 'Claude sur chaque poste' },
      tint: '#C94F2E',
      items: [
        { href: '/offres/claude-cowork', label: { en: 'Claude Cowork & Artifacts Rollout', fr: 'Déploiement Claude Cowork & Artifacts' }, lead: { en: 'Team-wide rollout with adoption scripts.', fr: "Rollout équipe avec scripts d'adoption." } },
        { href: '/offres/claude-skills', label: { en: 'Custom Claude Skills', fr: 'Claude Skills sur-mesure' }, lead: { en: 'One skill per recurrent workflow.', fr: 'Un skill par workflow récurrent.' } },
        { href: '/offres/mcp-connectors', label: { en: 'MCP Connectors · Notion · Drive · Slack', fr: 'Connecteurs MCP · Notion · Drive · Slack' } },
        { href: '/offres/routines-plugins', label: { en: 'Routines · Plugins · Chrome integration', fr: 'Routines · Plugins · intégration Chrome' } },
      ],
    },
    {
      kicker: { en: '03 · ORCHESTRATION', fr: '03 · ORCHESTRATION' },
      label: { en: 'Autonomous agents & MVP', fr: 'Agents autonomes & MVP' },
      tint: '#C94F2E',
      items: [
        { href: '/offres/agents-metiers', label: { en: 'Custom Business Agents', fr: 'Agents métiers autonomes' }, lead: { en: 'One job, one agent, audit trail.', fr: 'Un job, un agent, trace auditable.' } },
        { href: '/offres/multi-agents', label: { en: 'Multi-Agent Systems · LangGraph / CrewAI', fr: 'Systèmes multi-agents · LangGraph / CrewAI' } },
        { href: '/offres/tiered-routing', label: { en: 'Tiered Routing', fr: 'Tiered Routing · routage dynamique' }, lead: { en: 'Route to Haiku, escalate to Opus.', fr: 'Router vers Haiku, escalader vers Opus.' } },
        { href: '/offres/poc-mvp-sprint', label: { en: '4-Week POC / MVP Sprint', fr: 'Sprint POC / MVP · 4 semaines' } },
      ],
    },
    {
      kicker: { en: '04 · ENTERPRISE', fr: '04 · ENTERPRISE' },
      label: { en: 'Scale & sovereignty', fr: 'Scale & souveraineté' },
      tint: '#C94F2E',
      items: [
        { href: '/offres/managed-agents', label: { en: 'Claude Managed Agents · async cloud', fr: 'Claude Managed Agents · cloud async' }, lead: { en: 'Anthropic-hosted, long-running agents.', fr: 'Agents longs hébergés Anthropic.' } },
        { href: '/offres/self-hosted', label: { en: 'Self-Hosted Infrastructure', fr: 'Infrastructure Self-Hosted' }, lead: { en: 'On your hardware · total governance.', fr: 'Sur votre infra · gouvernance totale.' } },
        { href: '/offres/open-source', label: { en: 'Open-Source Model Deployment', fr: 'Déploiement modèles open-source' }, lead: { en: 'Llama 4 · DeepSeek · Qwen · GLM.', fr: 'Llama 4 · DeepSeek · Qwen · GLM.' } },
        { href: '/offres/maintenance-sre', label: { en: 'Maintenance & SRE · 24/7', fr: 'Maintenance & SRE · 24/7' } },
      ],
    },
  ],
  featured: {
    kicker: { en: 'FEATURED · PYRAMID', fr: 'À LA UNE · PYRAMIDE' },
    label: { en: 'The 4-tier service pyramid', fr: 'La pyramide des services IA' },
    body: { en: 'From audit to sovereign scale — the shape of every Waimia engagement.', fr: "De l'audit au scale souverain — la forme de chaque intervention Waimia." },
    cta: { en: 'See pricing grid →', fr: 'Voir la grille tarifaire →' },
    href: '/offres',
  },
};

// ─── MEGA-MENU 2 · SOLUTIONS
export const MM_SOLUTIONS: MegaMenu = {
  key: 'solutions',
  label: { en: 'Solutions', fr: 'Solutions' },
  href: '/solutions',
  lead: {
    en: 'Agentic AI for every department — from finance to legal — and the industry constraints that frame it.',
    fr: "IA agentique pour chaque département — de la finance au juridique — et les contraintes d'industrie qui l'encadrent.",
  },
  cols: [
    {
      kicker: { en: 'BY DEPARTMENT', fr: 'PAR MÉTIER' },
      label: { en: 'Use cases that ship', fr: "Cas d'usage qui livrent" },
      items: [
        { href: '/solutions/finance', label: { en: 'Finance & Accounting', fr: 'Finance & Comptabilité' }, lead: { en: 'Reconciliation · memos · Claude for Excel.', fr: 'Réconciliation · mémos · Claude for Excel.' } },
        { href: '/solutions/ventes-marketing', label: { en: 'Sales & Marketing', fr: 'Ventes & Marketing' }, lead: { en: 'Lead scoring · content · Claude Design.', fr: 'Lead scoring · contenu · Claude Design.' } },
        { href: '/solutions/support', label: { en: 'Customer Support', fr: 'Support Client' }, lead: { en: 'N1 triage · N2 resolution agents.', fr: 'Triage N1 · agents de résolution N2.' } },
        { href: '/solutions/juridique', label: { en: 'Legal', fr: 'Juridique' }, lead: { en: 'Contract review · Claude for Word.', fr: 'Revue de contrats · Claude for Word.' } },
        { href: '/solutions/rh', label: { en: 'HR & Training', fr: 'RH & Formation' }, lead: { en: 'Onboarding · CV screening · SOP creation.', fr: 'Onboarding · tri CV · création SOPs.' } },
        { href: '/solutions/it-engineering', label: { en: 'IT & Engineering', fr: 'IT & Ingénierie' }, lead: { en: 'Legacy modernization · Claude Code.', fr: 'Modernisation legacy · Claude Code.' } },
      ],
    },
    {
      kicker: { en: 'BY INDUSTRY', fr: 'PAR INDUSTRIE' },
      label: { en: 'Security-framed', fr: 'Contraintes de sécurité' },
      items: [
        { href: '/solutions/sante', label: { en: 'Healthcare & Life Sciences', fr: 'Santé & Sciences de la vie' }, lead: { en: 'HIPAA · LPD-ready deployments.', fr: 'Déploiements HIPAA · LPD-ready.' } },
        { href: '/solutions/finance-industrie', label: { en: 'Banking, Finance & Insurance', fr: 'Banque, Finance & Assurance' }, lead: { en: 'ACPR · DORA · PCI-aware.', fr: 'ACPR · DORA · PCI.' } },
        { href: '/solutions/secteur-public', label: { en: 'Public Sector & Defense', fr: 'Secteur Public & Défense' }, lead: { en: 'Sovereign self-hosted · SecNumCloud.', fr: 'Souverain self-hosted · SecNumCloud.' } },
        { href: '/solutions/industrie', label: { en: 'Industry & Manufacturing', fr: 'Industrie & Manufacturing' } },
        { href: '/solutions/retail', label: { en: 'Retail & E-commerce', fr: 'Retail & E-commerce' } },
      ],
    },
  ],
  featured: {
    kicker: { en: 'CASE FILE', fr: 'CAS CLIENT' },
    label: { en: '€2.4M pipeline recovered · SaaS B2B', fr: '2,4 M€ pipeline récupéré · SaaS B2B' },
    body: { en: 'Finance agents, CRM cleanup, multi-agent sequencing. 10 weeks.', fr: 'Agents finance, CRM nettoyé, multi-agent orchestré. 10 semaines.' },
    cta: { en: 'Read the file →', fr: 'Lire le dossier →' },
    href: '/ressources/cas/plateau',
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
    en: 'Field notes · proofs · free tools. Built for GEO and for humans in equal parts.',
    fr: 'Notes de terrain · preuves · outils libres. Pensés pour le GEO et pour les humains à parts égales.',
  },
  cols: [
    {
      kicker: { en: 'PROOF', fr: 'PREUVES' },
      label: { en: 'Case files & testimonials', fr: 'Cas & témoignages' },
      items: [
        { href: '/ressources/cas', label: { en: 'Case studies · measured ROI', fr: 'Études de cas · ROI mesuré' } },
        { href: '/ressources/temoignages', label: { en: 'Client testimonials', fr: 'Témoignages clients' } },
        { href: '/ressources/cas/virtuoseos', label: { en: 'VirtuoseOS · blueprint case', fr: 'VirtuoseOS · cas blueprint' }, featured: true },
      ],
    },
    {
      kicker: { en: 'LEARNING', fr: 'APPRENTISSAGE' },
      label: { en: 'Blog · cookbooks · masterclass', fr: 'Blog · cookbooks · masterclass' },
      items: [
        { href: '/ressources/blog', label: { en: 'Blog · agentic insights', fr: 'Blog · insights agentiques' } },
        { href: '/ressources/cookbooks', label: { en: 'Cookbooks & tutorials', fr: 'Cookbooks & tutoriels' }, lead: { en: 'How to build a Claude Skill.', fr: 'Créer une Claude Skill.' } },
        { href: '/ressources/webinaires', label: { en: 'Webinars & masterclass', fr: 'Webinaires & masterclass' } },
        { href: '/ressources/newsletter', label: { en: 'Newsletter · Intelligence Opérationnelle', fr: 'Newsletter · Intelligence Opérationnelle' } },
      ],
    },
    {
      kicker: { en: 'FREE TOOLS', fr: 'OUTILS GRATUITS' },
      label: { en: 'Lead-gen utilities', fr: 'Utilitaires de qualification' },
      tint: '#C94F2E',
      items: [
        { href: '/ressources/outils/tco-calculator', label: { en: 'AI Agent TCO Calculator', fr: 'Calculateur coût TCO agents' }, lead: { en: 'Model your true agent cost.', fr: 'Modéliser le vrai coût agent.' } },
        { href: '/ressources/outils/roi-calculator', label: { en: 'ROI & Time-saved Calculator', fr: 'Calculateur ROI & temps gagné' } },
        { href: '/ressources/outils/ai-act-checklist', label: { en: 'AI Act Readiness Checklist', fr: "Checklist prêt pour l'AI Act" } },
      ],
    },
  ],
  featured: {
    kicker: { en: 'FREE TOOL', fr: 'OUTIL GRATUIT' },
    label: { en: 'AI Agent TCO Calculator', fr: "Calculateur TCO d'un agent IA" },
    body: { en: 'The real cost, end-to-end · inference + orchestration + ops + retries.', fr: 'Le coût réel, bout-en-bout · inférence + orchestration + ops + retries.' },
    cta: { en: 'Open the calculator →', fr: 'Ouvrir le calculateur →' },
    href: '/ressources/outils/tco-calculator',
  },
};

// ─── PRIMARY NAV
export const PRIMARY_NAV: Array<MegaMenu | SimpleNav> = [
  MM_OFFRES,
  MM_SOLUTIONS,
  MM_TECH,
  MM_RESOURCES,
  { key: 'agence', label: { en: 'The Agency', fr: "L'Agence" }, href: '/agence', simple: true },
];

// ─── FOOTER (5 colonnes)
export type FooterCol = {
  heading: BiText;
  shield?: boolean;
  items: Array<{ label: BiText; href: string }>;
};

export const FOOTER_COLS: FooterCol[] = [
  {
    heading: { en: 'The Agency', fr: "L'Agence" },
    items: [
      { href: '/agence', label: { en: 'About Waimia', fr: 'À propos' } },
      { href: '/agence#vision', label: { en: 'Our vision · Process Intelligence', fr: 'Notre vision · Process Intelligence' } },
      { href: '/agence#certifications', label: { en: 'Partnerships & certifications', fr: 'Partenariats & certifications' } },
      { href: '/careers', label: { en: 'Careers', fr: 'Carrières' } },
      { href: '/agence#bureaux', label: { en: 'Offices · Paris · Geneva', fr: 'Bureaux · Paris · Genève' } },
      { href: '/contact', label: { en: 'Contact', fr: 'Nous contacter' } },
    ],
  },
  {
    heading: { en: 'Services', fr: 'Offres' },
    items: [
      { href: '/offres/audit-process-intelligence', label: { en: 'Process Intelligence Audit', fr: 'Audit Process Intelligence' } },
      { href: '/offres/claude-cowork', label: { en: 'Claude Cowork · Skills', fr: 'Claude Cowork · Skills' } },
      { href: '/offres/agents-metiers', label: { en: 'Agent Orchestration · MVP', fr: "Orchestration d'agents · MVP" } },
      { href: '/offres/managed-agents', label: { en: 'Claude Managed Agents', fr: 'Claude Managed Agents' } },
      { href: '/offres/self-hosted', label: { en: 'Self-Hosted Infrastructure', fr: 'Infrastructure Self-Hosted' } },
      { href: '/offres/maintenance-sre', label: { en: 'Maintenance & AI Act', fr: 'Maintenance & AI Act' } },
    ],
  },
  {
    heading: { en: 'Use Cases', fr: "Cas d'usage" },
    items: [
      { href: '/solutions/finance', label: { en: 'AI for Finance', fr: 'IA pour la Finance' } },
      { href: '/solutions/support', label: { en: 'AI for Support', fr: 'IA pour le Service Client' } },
      { href: '/solutions/ventes-marketing', label: { en: 'AI for Sales & Marketing', fr: 'IA pour Ventes & Marketing' } },
      { href: '/solutions/rh', label: { en: 'AI for HR', fr: 'IA pour les RH' } },
      { href: '/solutions/it-engineering', label: { en: 'AI for IT & Code', fr: "IA pour l'IT & le code" } },
      { href: '/solutions/juridique', label: { en: 'AI for Legal', fr: 'IA pour le Juridique' } },
    ],
  },
  {
    heading: { en: 'Resources', fr: 'Ressources' },
    items: [
      { href: '/ressources/blog', label: { en: 'Blog · 2026', fr: 'Le Blog IA 2026' } },
      { href: '/ressources/outils/roi-calculator', label: { en: 'ROI Calculator', fr: 'Calculateur ROI IA' } },
      { href: '/ressources/cookbooks', label: { en: 'Cookbooks & tutorials', fr: 'Cookbooks & tutoriels' } },
      { href: '/ressources/cas', label: { en: 'Case studies', fr: 'Études de cas chiffrées' } },
      { href: '/ressources/newsletter', label: { en: 'Newsletter', fr: 'Newsletter' } },
    ],
  },
  {
    heading: { en: 'Trust & Legal', fr: 'Confiance & Légal' },
    shield: true,
    items: [
      { href: '/trust', label: { en: 'Trust Center', fr: 'Centre de confiance' } },
      { href: '/trust#ai-act', label: { en: 'AI Act · GDPR · LPD', fr: 'AI Act · RGPD · LPD' } },
      { href: '/trust#privacy', label: { en: 'Privacy policy', fr: 'Politique de confidentialité' } },
      { href: '/trust#cgv', label: { en: 'Terms & conditions', fr: 'Mentions légales & CGV' } },
      { href: '/trust#cookies', label: { en: 'Cookie settings', fr: 'Gestion des cookies' } },
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
  { k: '04', n: '120+', label: { en: 'enterprise agents shipped', fr: 'agents enterprise livrés' } },
  { k: '03', n: '6 wk', label: { en: 'median time-to-production', fr: 'time-to-prod médian' } },
  { k: '02', n: '€14M', label: { en: 'pipeline recovered · 2025',  fr: 'pipeline récupéré · 2025' } },
  { k: '01', n: '4.2×', label: { en: 'avg. ROI year 1', fr: 'ROI moyen année 1' } },
];

export const PYRAMID_TIERS = [
  {
    n: 'I',
    tag: { en: 'CONSULTING', fr: 'CONSEIL' },
    label: { en: 'Audit & Strategy', fr: 'Audit & Stratégie' },
    lead: { en: 'Map the SOPs before you buy any model.', fr: "Cartographier les SOPs avant d'acheter un modèle." },
    items: ['Process Intelligence', 'AI Act · RGPD', 'Hybrid architecture'],
    href: '/offres#tier-1',
  },
  {
    n: 'II',
    tag: { en: 'LIGHT', fr: 'LIGHT' },
    label: { en: 'Claude at every desk', fr: 'Claude sur chaque poste' },
    lead: { en: 'Cowork · Skills · MCP · Routines. Adoption over deployment.', fr: "Cowork · Skills · MCP · Routines. L'adoption avant le déploiement." },
    items: ['Claude Cowork rollout', 'Custom Skills', 'MCP connectors', 'Routines & plugins'],
    href: '/offres#tier-2',
  },
  {
    n: 'III',
    tag: { en: 'ORCHESTRATION', fr: 'ORCHESTRATION' },
    label: { en: 'Autonomous agents & MVPs', fr: 'Agents autonomes & MVPs' },
    lead: { en: 'One job, one agent, one audit trail humans can read.', fr: 'Un job, un agent, une trace auditable lisible.' },
    items: ['Business agents', 'Multi-agent (LangGraph/CrewAI)', 'Tiered routing', '4-wk MVP sprint'],
    href: '/offres#tier-3',
  },
  {
    n: 'IV',
    tag: { en: 'ENTERPRISE', fr: 'ENTERPRISE' },
    label: { en: 'Scale & sovereignty', fr: 'Scale & souveraineté' },
    lead: { en: 'Anthropic-managed async · or fully self-hosted on your hardware.', fr: 'Async managé Anthropic · ou self-hosted sur votre hardware.' },
    items: ['Claude Managed Agents', 'Self-hosted (vLLM, Ollama)', 'Open-source models', 'SRE · 24/7'],
    href: '/offres#tier-4',
  },
];

export const DEPARTMENTS_GRID = [
  { slug: 'finance',          label: { en: 'Finance', fr: 'Finance' },                     tag: { en: 'Reconciliation · memos · Excel', fr: 'Réconciliation · mémos · Excel' } },
  { slug: 'ventes-marketing', label: { en: 'Sales & Marketing', fr: 'Ventes & Marketing' }, tag: { en: 'Lead scoring · content · Design', fr: 'Lead scoring · contenu · Design' } },
  { slug: 'support',          label: { en: 'Customer Support', fr: 'Support Client' },     tag: { en: 'Triage · resolution agents', fr: 'Triage · agents de résolution' } },
  { slug: 'juridique',        label: { en: 'Legal', fr: 'Juridique' },                     tag: { en: 'Contract review · Word', fr: 'Revue contrats · Word' } },
  { slug: 'rh',               label: { en: 'HR', fr: 'RH' },                                tag: { en: 'Onboarding · CV · SOPs', fr: 'Onboarding · CV · SOPs' } },
  { slug: 'it-engineering',   label: { en: 'IT & Engineering', fr: 'IT & Ingénierie' },    tag: { en: 'Legacy · Claude Code', fr: 'Legacy · Claude Code' } },
];

export const CASE_FEED = [
  { slug: 'plateau',    client: 'Plateau',        sector: { en: 'SaaS B2B',         fr: 'SaaS B2B' },         duration: '10 wk',     stack: 'Claude · HubSpot · dbt',         impact: { en: '+€2.4M pipeline recovered', fr: '+2,4 M€ pipeline récupéré' } },
  { slug: 'halcyon',    client: 'Halcyon Health', sector: { en: 'Healthtech',       fr: 'Santé-tech' },       duration: '6 wk',      stack: 'Claude · Snowflake',             impact: { en: '−38% triage time', fr: '−38% temps de triage' } },
  { slug: 'northbound', client: 'Northbound',     sector: { en: 'Fintech · EU',     fr: 'Fintech · EU' },     duration: '14 wk',     stack: 'Claude · Segment · dbt',         impact: { en: '×3.1 SQL conversion', fr: '×3,1 conversion SQL' } },
  { slug: 'caserne',    client: 'Caserne',        sector: { en: 'Industry · FR',    fr: 'Industrie · FR' },   duration: '8 wk',      stack: 'Claude · custom RAG · SAP',      impact: { en: '1 200 h/year reclaimed', fr: '1 200 h/an récupérées' } },
  { slug: 'virtuoseos', client: 'VirtuoseOS',     sector: { en: 'Internal blueprint', fr: 'Blueprint interne' }, duration: 'ongoing', stack: 'Claude · open-source · multi-agent', impact: { en: 'The OS under every shipment', fr: "L'OS sous chaque livraison" }, featured: true },
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
  { k: '01', label: { en: 'AI strategy',          fr: 'Stratégie IA' },        body: { en: "Six-week diagnostic that separates theatre from leverage. Ships an ordered backlog, not a slide deck.",  fr: 'Diagnostic de six semaines qui sépare le théâtre du levier. Livre un backlog ordonné, pas un PowerPoint.' } },
  { k: '02', label: { en: 'RevOps rebuild',       fr: 'Refonte RevOps' },      body: { en: "Funnel, handoffs, attribution. We touch the CRM ourselves.",                                              fr: 'Funnel, passations, attribution. On met les mains dans le CRM.' } },
  { k: '03', label: { en: 'HubSpot operations',   fr: 'HubSpot opérations' },  body: { en: "Certified partner work — data model, automations, custom objects, GDPR-clean.",                          fr: 'Partenaire certifié — modèle de données, automatisations, objets custom, RGPD propre.' } },
  { k: '04', label: { en: 'Data foundation',      fr: 'Fondation data' },      body: { en: "Warehouse, semantic layer, lineage. The layer every AI claim sits on.",                                  fr: 'Entrepôt, couche sémantique, lignée. La couche sur laquelle repose chaque promesse d’IA.' } },
  { k: '05', label: { en: 'AI automation',        fr: 'Automatisation IA' },   body: { en: "Agents that do one job well, with audit trails humans can read.",                                        fr: 'Des agents qui font une seule chose bien, avec des traces auditables.' } },
  { k: '06', label: { en: 'Platform engineering', fr: 'Plateforme produit' },  body: { en: "We build custom tooling when the market doesn’t. See VirtuoseOS.",                                  fr: 'On construit l’outil quand le marché n’existe pas. Voir VirtuoseOS.' } },
];

// ─── 4 FIG rows — Acte I · Why AI stalls
export const WHY_AI_STALLS = [
  { fig: 'FIG 1.1', text: { en: 'The average RevOps stack holds 43 tools. Fewer than 9 touch the same customer record consistently.',           fr: 'La stack RevOps moyenne compte 43 outils. Moins de 9 touchent le même enregistrement client de manière cohérente.' } },
  { fig: 'FIG 1.2', text: { en: 'A generative model without a clean warehouse is a very expensive guess.',                                       fr: 'Un modèle génératif sans entrepôt propre est une conjecture très coûteuse.' } },
  { fig: 'FIG 1.3', text: { en: 'Agents shipped under 6 weeks succeed four times as often as those shipped under 6 months.',                     fr: 'Les agents livrés en moins de 6 semaines réussissent quatre fois plus que ceux livrés en moins de 6 mois.' } },
  { fig: 'FIG 1.4', text: { en: "The replatforming instinct is almost always wrong. The question is rarely which stack. It is which handoff.", fr: 'L’instinct de refonte a presque toujours tort. La question n’est pas quelle stack. C’est quelle passation.' } },
];

// ─── i18n helper · tire la chaîne dans la langue active
export function pick(t: BiText, lang: Lang): string {
  return t[lang];
}
