// Waimia · content collections · Zod schemas
// Cf docs/03-content-models.md pour le rationale de chaque champ.
// V2 (2026-05-15) : extension pour CMS headless complet · cf docs/13-CONTENT-ARCHITECTURE.md + 14-MASTER-PLAN

import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { sectionsArraySchema } from './schemas/sections';

// ─── Mixin commun (SEO/GEO/AIO) ───
const seoBlock = z
  .object({
    ogImage: z.string().optional(),
    noindex: z.boolean().default(false),
  })
  .optional();

const faqArray = z
  .array(z.object({ q: z.string(), a: z.string() }))
  .optional();

const baseFields = {
  title_fr: z.string().min(1),
  title_en: z.string().min(1),
  description_fr: z.string().min(40).max(180),
  description_en: z.string().min(40).max(180),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'kebab-case lowercase'),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  canonical: z.string().url().optional(),
  seo: seoBlock,
  faq_fr: faqArray,
  faq_en: faqArray,
};

// ─── Mixin taxonomies ───
const taxonomyFields = {
  category: z
    .enum([
      'acquisition',
      'crm',
      'contenu-seo-geo',
      'productivite',
      'support',
      'pilotage',
      'data',
      'gouvernance',
    ])
    .optional(),
  cluster: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'kebab-case')
    .optional(),
  tags: z.array(z.string().regex(/^[a-z0-9-]+$/, 'kebab-case')).default([]),
  sources: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.enum(['state', 'university', 'journal', 'enterprise', 'research']),
        publishedAt: z.coerce.date().optional(),
        author: z.string().optional(),
      }),
    )
    .default([]),
  relatedSolutions: z.array(z.string()).default([]),
  relatedOffres: z.array(z.string()).default([]),
  relatedCases: z.array(z.string()).default([]),
  relatedSecteurs: z.array(z.string()).default([]),
};

// ─── Sous-schémas réutilisables ───
const bilingualMetric = z.object({
  value: z.string(),
  label_fr: z.string(),
  label_en: z.string(),
});

const methodStep = z.object({
  num: z.string(),
  label_fr: z.string(),
  label_en: z.string(),
  body_fr: z.string(),
  body_en: z.string(),
  meta_fr: z.string().optional(),
  meta_en: z.string().optional(),
  duration_fr: z.string().optional(),
  duration_en: z.string().optional(),
});

const deliverableItem = z.object({
  title_fr: z.string(),
  title_en: z.string(),
  body_fr: z.string(),
  body_en: z.string(),
  tag: z.string(),
});

const proofBlock = z.object({
  quote_fr: z.string(),
  quote_en: z.string(),
  attribution: z.string(),
  metrics: z.array(bilingualMetric).default([]),
});

// ─── Cases ───
const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    client: z.string(),
    sector_fr: z.string(),
    sector_en: z.string(),
    duration: z.string(),
    stack: z.array(z.string()),
    impact_fr: z.string(),
    impact_en: z.string(),
    metrics: z.array(bilingualMetric).optional(),
    ndaProtected: z.boolean().default(false),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    author: reference('authors').optional(),
    contributors: z.array(reference('authors')).default([]),
    // Composable V2 (D.7 extension) : sections optionnelles
    sections: sectionsArraySchema.optional(),
  }),
});

// ─── Offres (étendu V2) ───
const offres = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/offres' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    // Legacy v1 (rétrocompat)
    tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
    category_fr: z.string().optional(),
    category_en: z.string().optional(),
    priceFrom: z.string().optional(),
    duration: z.string().optional(),
    deliverables_fr: z.array(z.string()).optional(),
    deliverables_en: z.array(z.string()).optional(),
    relatedTechnologies: z.array(z.string()).default([]),
    caseStudies: z.array(z.string()).default([]),
    // V2 (extension pour migration hardcoded → MDX)
    tier_fr: z.string().optional(),
    tier_en: z.string().optional(),
    tier_label_fr: z.string().optional(),
    tier_label_en: z.string().optional(),
    meta_fr: z.string().optional(),
    meta_en: z.string().optional(),
    price_from_eur: z.number().int().nonnegative().optional(),
    price_to_eur: z.number().int().nonnegative().optional(),
    duration_min_weeks: z.number().int().positive().optional(),
    duration_max_weeks: z.number().int().positive().optional(),
    cta_label_fr: z.string().optional(),
    cta_label_en: z.string().optional(),
    cta_href: z.string().optional(),
    lead_fr: z.string().optional(),
    lead_en: z.string().optional(),
    problem_statement_fr: z.string().optional(),
    problem_statement_en: z.string().optional(),
    problem_annotations: z
      .array(
        z.object({
          value: z.string(),
          label_fr: z.string(),
          label_en: z.string(),
        }),
      )
      .default([]),
    method_aside_fr: z.string().optional(),
    method_aside_en: z.string().optional(),
    method_steps: z.array(methodStep).default([]),
    deliverables_aside_fr: z.string().optional(),
    deliverables_aside_en: z.string().optional(),
    deliverable_items: z.array(deliverableItem).default([]),
    proof: proofBlock.optional(),
    cta_title_fr: z.string().optional(),
    cta_title_en: z.string().optional(),
    cta_body_fr: z.string().optional(),
    cta_body_en: z.string().optional(),
    inclusions_fr: z.array(z.string()).default([]),
    inclusions_en: z.array(z.string()).default([]),
    pricing_table: z
      .array(
        z.object({
          formula_fr: z.string(),
          formula_en: z.string(),
          included_fr: z.string(),
          included_en: z.string(),
          delay_fr: z.string(),
          delay_en: z.string(),
          price: z.string(),
        }),
      )
      .default([]),
    has_tunnel: z.boolean().default(false),
    // Composable V2 (D.7) : sections data-driven optionnelles · cf docs/19-DESIGN-SYSTEM-CLOSED.md §B.7
    // Si présent → /offres/[slug].astro utilise SectionsRenderer au lieu de OffresDetailTemplate
    sections: sectionsArraySchema.optional(),
  }),
});

// ─── Solutions (étendu V2) ───
const solutions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/solutions' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    kind: z.enum(['department', 'industry']),
    icon: z.string().optional(),
    metricsHero: z.array(bilingualMetric).default([]),
    useCases_fr: z.array(z.string()),
    useCases_en: z.array(z.string()),
    constraints_fr: z.array(z.string()).optional(),
    constraints_en: z.array(z.string()).optional(),
    caseStudies: z.array(z.string()).default([]),
    // V2
    lead_fr: z.string().optional(),
    lead_en: z.string().optional(),
    pains: z
      .array(
        z.object({
          title_fr: z.string(),
          title_en: z.string(),
          body_fr: z.string(),
          body_en: z.string(),
        }),
      )
      .default([]),
    workflows: z.array(methodStep).default([]),
    roi_metrics: z.array(bilingualMetric).default([]),
    stack: z
      .array(
        z.object({
          name: z.string(),
          role_fr: z.string(),
          role_en: z.string(),
          category: z.string().optional(),
        }),
      )
      .default([]),
    livrables_fr: z.array(z.string()).default([]),
    livrables_en: z.array(z.string()).default([]),
    // ─── SolutionsDetailTemplate fields (V2+) ───
    dept_badge: z.string().optional(),
    dept_label: z.string().optional(),
    meta_hero: z.string().optional(),
    tags_fr: z.array(z.string()).default([]),
    tags_en: z.array(z.string()).default([]),
    case_kicker: z.string().optional(),
    case_body_fr: z.string().optional(),
    case_body_en: z.string().optional(),
    case_cta_label_fr: z.string().optional(),
    case_cta_label_en: z.string().optional(),
    case_results: z
      .array(z.object({ value: z.string(), label_fr: z.string(), label_en: z.string() }))
      .default([]),
    cta_title_fr: z.string().optional(),
    cta_title_en: z.string().optional(),
    cta_body_fr: z.string().optional(),
    cta_body_en: z.string().optional(),
    cta_href: z.string().optional(),
    cta_label_fr: z.string().optional(),
    cta_label_en: z.string().optional(),
    // Composable V2 (D.7 extension) : sections optionnelles · cf docs/19-DESIGN-SYSTEM-CLOSED.md
    sections: sectionsArraySchema.optional(),
  }),
});

// ─── Technologies (étendu V2) ───
const technologies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/technologies' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    family: z.enum(['Claude', 'OpenSource', 'Frameworks', 'Office']),
    vendor: z.string().optional(),
    modelVersion: z.string().optional(),
    contextWindow: z.string().optional(),
    strengths_fr: z.array(z.string()),
    strengths_en: z.array(z.string()),
    limits_fr: z.array(z.string()).optional(),
    limits_en: z.array(z.string()).optional(),
    useWhen_fr: z.string(),
    useWhen_en: z.string(),
    // V2
    positioning_fr: z.string().optional(),
    positioning_en: z.string().optional(),
    capabilities: z
      .array(
        z.object({
          name_fr: z.string(),
          name_en: z.string(),
          description_fr: z.string(),
          description_en: z.string(),
          status: z.enum(['active', 'beta', 'planned']).default('active'),
        }),
      )
      .default([]),
    models: z
      .array(
        z.object({
          name: z.string(),
          version: z.string(),
          use_case_fr: z.string(),
          use_case_en: z.string(),
        }),
      )
      .default([]),
    ecosystem: z
      .array(
        z.object({
          name: z.string(),
          role_fr: z.string(),
          role_en: z.string(),
        }),
      )
      .default([]),
    benchmarks: z.array(bilingualMetric).default([]),
    integration_flow: z.array(methodStep).default([]),
  }),
});

// ─── Blog (étendu V2 avec sous-types) ───
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    // V1 legacy (rétrocompat)
    editorialType: z
      .enum(['Field Note', 'Case', 'Essay', 'Cookbook', 'Tutorial'])
      .optional(),
    // V2 type discriminator (décision Simon 2026-05-15) — optionnel pour rétrocompat V1
    type: z.enum(['formation', 'essai', 'notes', 'avis', 'post']).optional(),
    author: reference('authors'),
    contributors: z.array(reference('authors')).default([]),
    readingTime: z.number().optional(),
    heroImage: z.string().optional(),
    excerpt_fr: z.string().optional(),
    excerpt_en: z.string().optional(),
    relatedPosts: z.array(z.string()).default([]),
    // Spécifique formation
    duration_minutes: z.number().int().positive().optional(),
    prerequisites_fr: z.array(z.string()).optional(),
    prerequisites_en: z.array(z.string()).optional(),
    // Spécifique essai
    pull_quotes: z
      .array(
        z.object({
          text: z.string(),
          context: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

// ─── Field notes ───
const fieldNotes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/field-notes' }),
  schema: z.object({
    ...baseFields,
    date: z.coerce.date(),
    tag_fr: z.enum(['NOTE', 'CAS', 'ESSAI', 'RECETTE']),
    tag_en: z.enum(['FIELD NOTE', 'CASE', 'ESSAY', 'COOKBOOK']),
    sourceUrl: z.string().url().optional(),
  }),
});

// ─── Secteurs ───
const secteurs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/secteurs' }),
  schema: z.object({
    ...baseFields,
    icp_fr: z.string(),
    icp_en: z.string(),
    icpSize: z.object({
      min: z.number().int().positive(),
      max: z.number().int().positive(),
    }),
    pains_fr: z.array(z.string()).min(3).max(6),
    pains_en: z.array(z.string()).min(3).max(6),
    workflowsCible: z.array(z.string()).default([]),
    kpis_fr: z.array(z.string()).default([]),
    kpis_en: z.array(z.string()).default([]),
    metricsHero: z.array(bilingualMetric).default([]),
    caseRef: z.string().optional(),
    visible: z.boolean().default(true),
    ctaPrimary_fr: z.string(),
    ctaPrimary_en: z.string(),
  }),
});

// ─── Livres blancs ───
const livresBlancs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/livres-blancs' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    pages: z.number().int().positive(),
    audience_fr: z.string(),
    audience_en: z.string(),
    chapters_fr: z.array(z.string()).min(3),
    chapters_en: z.array(z.string()).min(3),
    pdfUrl: z.string().optional(),
    requireEmail: z.boolean().default(true),
    apiSlug: z.string().regex(/^[a-z0-9-]+$/),
    coverUrl: z.string().optional(),
    format_fr: z.string(),
    format_en: z.string(),
    author: reference('authors'),
    contributors: z.array(reference('authors')).default([]),
    isPremium: z.boolean().default(false),
    premium_price_eur: z.number().positive().optional(),
    premium_stripe_link: z.string().url().optional(),
  }),
});

// ─── Cookbooks ───
const cookbooks = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cookbooks' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    duration_fr: z.string(),
    duration_en: z.string(),
    difficulty: z.enum(['Débutant', 'Intermédiaire', 'Avancé']),
    prerequisites_fr: z.array(z.string()).default([]),
    prerequisites_en: z.array(z.string()).default([]),
    steps: z.number().int().positive(),
    technologies: z.array(z.string()).default([]),
    author: reference('authors'),
    contributors: z.array(reference('authors')).default([]),
    relatedCookbooks: z.array(z.string()).default([]),
  }),
});

// ─── Outils ───
const outils = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/outils' }),
  schema: z.object({
    ...baseFields,
    type: z.enum(['calculator', 'checklist', 'template', 'audit']),
    inputs: z
      .array(
        z.object({
          key: z.string().regex(/^[a-z][a-zA-Z0-9]*$/),
          label_fr: z.string(),
          label_en: z.string(),
          type: z.enum(['number', 'text', 'select', 'currency']),
          unit: z.string().optional(),
          defaultValue: z.union([z.number(), z.string()]).optional(),
          min: z.number().optional(),
          max: z.number().optional(),
          options: z
            .array(
              z.object({
                value: z.string(),
                label_fr: z.string(),
                label_en: z.string(),
              }),
            )
            .optional(),
        }),
      )
      .default([]),
    outputs: z
      .array(
        z.object({
          key: z.string(),
          formula: z.string(),
          label_fr: z.string(),
          label_en: z.string(),
          unit: z.string().optional(),
          format: z.enum(['integer', 'decimal2', 'currency-eur', 'percent']).optional(),
        }),
      )
      .default([]),
    captureEmail: z.boolean().default(false),
    apiSlug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    relatedPages: z.array(z.string()).default([]),
    category_fr: z.string().optional(),
    category_en: z.string().optional(),
  }),
});

// ─── Veille IA ───
const veilleIA = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/veille-ia' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    date: z.coerce.date(),
    impact_fr: z.string().min(40).max(280),
    impact_en: z.string().min(40).max(280),
    sectors: z.array(z.string()).default([]),
    author: reference('authors'),
    contributors: z.array(reference('authors')).default([]),
  }),
});

// ─── Pages standalone ───
const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  schema: z.object({
    ...baseFields,
    template: z.enum(['utility', 'trust-legal', 'welcome', 'essay']),
    kicker_fr: z.string().optional(),
    kicker_en: z.string().optional(),
    align: z.enum(['left', 'centered']).default('left'),
    showCta: z.boolean().default(true),
    sections: z
      .array(
        z.object({
          id: z.string(),
          label_fr: z.string(),
          label_en: z.string(),
        }),
      )
      .optional(),
    revisedAt: z.coerce.date().optional(),
    version: z.string().optional(),
    nextSteps: z
      .array(
        z.object({
          number: z.string(),
          label_fr: z.string(),
          label_en: z.string(),
          body_fr: z.string(),
          body_en: z.string(),
          ctaLabel_fr: z.string().optional(),
          ctaLabel_en: z.string().optional(),
          ctaHref: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

// ─── Authors ───
const authors = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/authors' }),
  schema: z.object({
    ...baseFields,
    role_fr: z.string(),
    role_en: z.string(),
    bio_fr: z.string().min(120),
    bio_en: z.string().min(120),
    photo: z.string().optional(),
    photoAlt_fr: z.string().optional(),
    photoAlt_en: z.string().optional(),
    education: z
      .array(
        z.object({
          year: z.string(),
          institution: z.string(),
          degree_fr: z.string(),
          degree_en: z.string(),
          url: z.string().url().optional(),
        }),
      )
      .default([]),
    experience: z
      .array(
        z.object({
          year: z.string(),
          role_fr: z.string(),
          role_en: z.string(),
          company: z.string(),
          companyUrl: z.string().url().optional(),
          summary_fr: z.string().optional(),
          summary_en: z.string().optional(),
        }),
      )
      .default([]),
    publications: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          venue: z.string(),
          year: z.string(),
          type: z.enum(['paper', 'talk', 'book', 'podcast', 'press']).optional(),
        }),
      )
      .default([]),
    awards: z
      .array(
        z.object({
          year: z.string(),
          label_fr: z.string(),
          label_en: z.string(),
        }),
      )
      .default([]),
    expertise: z.array(z.string()).default([]),
    social: z
      .object({
        x: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        github: z.string().url().optional(),
        website: z.string().url().optional(),
        email: z.string().email().optional(),
        bluesky: z.string().url().optional(),
        mastodon: z.string().url().optional(),
      })
      .default({}),
    status: z.enum(['active', 'alumni', 'guest']).default('active'),
    featured: z.boolean().default(false),
  }),
});

// ═════════════════════════════════════════════════════════════════
// ─── NOUVELLES COLLECTIONS V2 (2026-05-15) ───
// ═════════════════════════════════════════════════════════════════

// ─── Tunnels conversion (multi-étapes par offre) ───
const tunnels = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tunnels' }),
  schema: z.object({
    ...baseFields,
    offre_slug: z.string().regex(/^[a-z0-9-]+$/),
    step: z.number().int().min(1).max(6),
    step_title_fr: z.string(),
    step_title_en: z.string(),
    next_step: z.string().optional(),
    prev_step: z.string().optional(),
    cta_label_fr: z.string(),
    cta_label_en: z.string(),
    cta_href: z.string(),
    cta_variant: z.enum(['primary', 'accent', 'ghost']).default('primary'),
    progress_total: z.number().int().min(2).max(6).default(4),
  }),
});

// ─── Welcome pages (post-conversion) ───
const welcomePages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/welcome-pages' }),
  schema: z.object({
    ...baseFields,
    trigger: z.enum([
      'audit-booking',
      'contact-form',
      'livre-blanc-download',
      'newsletter-signup',
      'formation-signup',
      'parcours-signup',
      'atelier-signup',
      'produit-purchase',
      'abonnement-souscription',
    ]),
    headline_fr: z.string(),
    headline_en: z.string(),
    lede_fr: z.string(),
    lede_en: z.string(),
    next_steps: z
      .array(
        z.object({
          num: z.string(),
          title_fr: z.string(),
          title_en: z.string(),
          body_fr: z.string(),
          body_en: z.string(),
          timing_fr: z.string().optional(),
          timing_en: z.string().optional(),
        }),
      )
      .min(2)
      .max(4),
    bonus_resources: z
      .array(
        z.object({
          type: z.enum(['case', 'cookbook', 'livre-blanc', 'blog', 'outil', 'formation']),
          slug: z.string(),
        }),
      )
      .default([]),
    signature_quote_fr: z.string().optional(),
    signature_quote_en: z.string().optional(),
    signature_author: reference('authors').optional(),
    fallback_doors: z
      .array(
        z.object({
          label_fr: z.string(),
          label_en: z.string(),
          href: z.string(),
        }),
      )
      .default([]),
  }),
});

// ─── École : Formations (cours unitaires) ───
const formations = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ecole/formations' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    format: z.enum(['video', 'texte', 'live', 'mixte', 'sprint']),
    duration_hours: z.number().positive(),
    level: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
    prerequisites_fr: z.array(z.string()).default([]),
    prerequisites_en: z.array(z.string()).default([]),
    learning_objectives_fr: z.array(z.string()).min(3).max(8),
    learning_objectives_en: z.array(z.string()).min(3).max(8),
    modules: z
      .array(
        z.object({
          num: z.string(),
          title_fr: z.string(),
          title_en: z.string(),
          duration_minutes: z.number().int().positive(),
          type: z.enum(['lecture', 'exercice', 'projet', 'evaluation']),
        }),
      )
      .min(3),
    instructor: reference('authors'),
    pricing: z
      .object({
        currency: z.literal('EUR'),
        one_time_eur: z.number().int().nonnegative().optional(),
        subscription_eur: z.number().int().nonnegative().optional(),
        stripe_payment_link: z.string().url().optional(),
      })
      .optional(),
    next_session_at: z.coerce.date().optional(),
    seats_total: z.number().int().positive().optional(),
    seats_remaining: z.number().int().nonnegative().optional(),
    certification: z.boolean().default(false),
    related_offres: z.array(z.string()).default([]),
  }),
});

// ─── École : Parcours (séquences de cours) ───
const parcours = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ecole/parcours' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    duration_weeks: z.number().int().positive(),
    total_hours: z.number().positive(),
    level: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
    target_audience: z.array(
      z.enum([
        'ceo',
        'cto',
        'cmo',
        'cso',
        'cfo',
        'marketing-manager',
        'sales-manager',
        'product-manager',
        'developer',
        'designer',
        'consultant',
      ]),
    ),
    courses: z.array(z.string()).min(2),
    outcomes_fr: z.array(z.string()).min(3),
    outcomes_en: z.array(z.string()).min(3),
    pricing_eur: z.number().int().positive(),
    stripe_payment_link: z.string().url().optional(),
    certification: z.boolean().default(true),
  }),
});

// ─── École : Ateliers (live ponctuels) ───
const ateliers = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ecole/ateliers' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    scheduled_at: z.coerce.date(),
    duration_hours: z.number().positive(),
    format: z.enum(['live-online', 'live-paris', 'live-geneve', 'replay-only']),
    seats_total: z.number().int().positive(),
    seats_remaining: z.number().int().nonnegative(),
    instructor: reference('authors'),
    pricing_eur: z.number().int().nonnegative().default(0),
    stripe_payment_link: z.string().url().optional(),
    replay_available: z.boolean().default(true),
    recording_url: z.string().url().optional(),
  }),
});

// ─── École : Courses · discriminated union (T3.1a — ajout progressif, ne remplace pas formations/parcours/ateliers) ───
const courses = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ecole/courses' }),
  schema: z.discriminatedUnion('course_type', [
    // ── formation ──────────────────────────────────────────────────
    z.object({
      course_type: z.literal('formation'),
      ...baseFields,
      ...taxonomyFields,
      format: z.enum(['video', 'texte', 'live', 'mixte', 'sprint']),
      duration_hours: z.number().positive(),
      level: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
      prerequisites_fr: z.array(z.string()).default([]),
      prerequisites_en: z.array(z.string()).default([]),
      learning_objectives_fr: z.array(z.string()).min(3).max(8),
      learning_objectives_en: z.array(z.string()).min(3).max(8),
      modules: z
        .array(
          z.object({
            num: z.string(),
            title_fr: z.string(),
            title_en: z.string(),
            duration_minutes: z.number().int().positive(),
            type: z.enum(['lecture', 'exercice', 'projet', 'evaluation']),
          }),
        )
        .min(3),
      instructor: reference('authors'),
      pricing: z
        .object({
          currency: z.literal('EUR'),
          one_time_eur: z.number().int().nonnegative().optional(),
          subscription_eur: z.number().int().nonnegative().optional(),
          stripe_payment_link: z.string().url().optional(),
        })
        .optional(),
      next_session_at: z.coerce.date().optional(),
      seats_total: z.number().int().positive().optional(),
      seats_remaining: z.number().int().nonnegative().optional(),
      certification: z.boolean().default(false),
      related_offres: z.array(z.string()).default([]),
    }),
    // ── parcours ───────────────────────────────────────────────────
    z.object({
      course_type: z.literal('parcours'),
      ...baseFields,
      ...taxonomyFields,
      duration_weeks: z.number().int().positive(),
      total_hours: z.number().positive(),
      level: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
      target_audience: z.array(
        z.enum([
          'ceo', 'cto', 'cmo', 'cso', 'cfo',
          'marketing-manager', 'sales-manager', 'product-manager',
          'developer', 'designer', 'consultant',
        ]),
      ),
      courses: z.array(z.string()).min(2),
      outcomes_fr: z.array(z.string()).min(3),
      outcomes_en: z.array(z.string()).min(3),
      pricing_eur: z.number().int().positive(),
      stripe_payment_link: z.string().url().optional(),
      certification: z.boolean().default(true),
    }),
    // ── atelier ────────────────────────────────────────────────────
    z.object({
      course_type: z.literal('atelier'),
      ...baseFields,
      ...taxonomyFields,
      scheduled_at: z.coerce.date(),
      duration_hours: z.number().positive(),
      format: z.enum(['live-online', 'live-paris', 'live-geneve', 'replay-only']),
      seats_total: z.number().int().positive(),
      seats_remaining: z.number().int().nonnegative(),
      instructor: reference('authors'),
      pricing_eur: z.number().int().nonnegative().default(0),
      stripe_payment_link: z.string().url().optional(),
      replay_available: z.boolean().default(true),
      recording_url: z.string().url().optional(),
    }),
    // ── certification (NOUVEAU type) ───────────────────────────────
    z.object({
      course_type: z.literal('certification'),
      ...baseFields,
      ...taxonomyFields,
      certification_level: z.enum(['debutant', 'intermediaire', 'avance']),
      validation_method: z.string(),
      duration_hours: z.number().positive(),
      exam_format: z.enum(['qcm', 'projet', 'oral', 'mixte']),
      prerequisites_fr: z.array(z.string()).default([]),
      prerequisites_en: z.array(z.string()).default([]),
      passing_score: z.number().min(0).max(100).optional(),
      validity_years: z.number().int().positive().optional(),
      instructor: reference('authors').optional(),
      pricing_eur: z.number().int().nonnegative().default(0),
      stripe_payment_link: z.string().url().optional(),
      related_formations: z.array(z.string()).default([]),
    }),
  ]),
});

// ─── Produits (artefacts achetables) ───
const produits = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/produits' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    sku: z.string().regex(/^WAI-[A-Z]+-\d{3}$/, 'format SKU Waimia'),
    product_type: z.enum([
      'audit-guide',
      'template-kit',
      'livre-blanc-premium',
      'masterclass-replay',
      'workbook',
      'starter-pack',
    ]),
    pricing: z.object({
      currency: z.literal('EUR'),
      list_price_eur: z.number().positive(),
      promo_price_eur: z.number().positive().optional(),
      promo_until: z.coerce.date().optional(),
      stripe_payment_link: z.string().url(),
    }),
    format: z.array(z.enum(['pdf', 'notion', 'airtable', 'figma', 'video', 'audio', 'zip'])),
    pages_or_minutes: z.number().int().positive(),
    deliverables_fr: z.array(z.string()).min(2),
    deliverables_en: z.array(z.string()).min(2),
    target_audience_fr: z.array(z.string()),
    target_audience_en: z.array(z.string()),
    instant_download: z.boolean().default(true),
    license: z.enum(['personnel', 'equipe-5', 'entreprise-illimite']).default('personnel'),
    related_formations: z.array(z.string()).default([]),
    related_offres: z.array(z.string()).default([]),
    download_url: z.string().optional(),
  }),
});

// ─── Abonnements (revenus récurrents) ───
const abonnements = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/abonnements' }),
  schema: z.object({
    ...baseFields,
    ...taxonomyFields,
    sku: z.string().regex(/^WAI-SUB-[A-Z]+-\d{3}$/, 'format SKU abonnement'),
    subscription_type: z.enum([
      'hosting-management',
      'maintenance',
      'monitoring',
      'ai-monitoring',
      'content-production',
      'support-premium',
      'crm-management',
      'security-audit',
    ]),
    billing_cycle: z.enum(['monthly', 'quarterly', 'annual']),
    pricing: z.object({
      currency: z.literal('EUR'),
      monthly_eur: z.number().positive(),
      annual_eur: z.number().positive().optional(),
      annual_discount_pct: z.number().min(0).max(50).optional(),
      setup_fee_eur: z.number().nonnegative().optional(),
      stripe_payment_link: z.string().url(),
      stripe_portal_url: z.string().url().optional(),
    }),
    sla: z
      .object({
        response_time_business_hours: z.string().optional(),
        response_time_critical: z.string().optional(),
        uptime_guarantee: z.string().optional(),
        monthly_hours_included: z.number().nonnegative().optional(),
      })
      .optional(),
    deliverables_fr: z.array(z.string()).min(3),
    deliverables_en: z.array(z.string()).min(3),
    onboarding_duration_days: z.number().int().positive(),
    cancellation_terms_fr: z.string(),
    cancellation_terms_en: z.string(),
    target_audience_fr: z.array(z.string()),
    target_audience_en: z.array(z.string()),
    related_offres: z.array(z.string()).default([]),
    custom_quote_required: z.boolean().default(false),
  }),
});

// ─── Landing pages (LP campagnes) ───
const landingPages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lp' }),
  schema: z.object({
    ...baseFields,
    campaign: z.string(),
    utm_source: z.string().optional(),
    primary_offer_slug: z.string(),
    hero_variant: z.enum(['split', 'centered', 'full-bleed']).default('split'),
    sections: z
      .array(z.enum(['proof', 'method', 'case-study', 'faq', 'pricing', 'inclusions']))
      .default([]),
    cta_primary_label_fr: z.string(),
    cta_primary_label_en: z.string(),
    cta_primary_href: z.string(),
    cta_secondary_label_fr: z.string().optional(),
    cta_secondary_label_en: z.string().optional(),
    cta_secondary_href: z.string().optional(),
    valid_until: z.coerce.date().optional(),
  }),
});

// ─── Newsletter (archives) ───
const newsletter = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/newsletter' }),
  schema: z.object({
    ...baseFields,
    issue_number: z.number().int().positive(),
    sent_at: z.coerce.date(),
    open_rate: z.number().min(0).max(1).optional(),
    subscriber_count_at_send: z.number().int().positive().optional(),
    excerpt_fr: z.string(),
    excerpt_en: z.string(),
    author: reference('authors').optional(),
  }),
});

// ─── Personas (Tier 4.1) · profils d'acheteurs typiques pour PersonaSwitcher + targeting ───
const personas = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/personas' }),
  schema: z.object({
    ...baseFields,
    role_fr: z.string(),
    role_en: z.string(),
    pain_points_fr: z.array(z.string()).min(3).max(7),
    pain_points_en: z.array(z.string()).min(3).max(7),
    decision_criteria_fr: z.array(z.string()).min(3).max(7),
    decision_criteria_en: z.array(z.string()).min(3).max(7),
    objections_fr: z.array(z.string()).min(2).max(5),
    objections_en: z.array(z.string()).min(2).max(5),
    proof_points_fr: z.array(z.string()).min(3).max(7),
    proof_points_en: z.array(z.string()).min(3).max(7),
    budget_range_fr: z.string(),
    budget_range_en: z.string(),
    timeline_fr: z.string(),
    timeline_en: z.string(),
    company_size_fr: z.string(),
    company_size_en: z.string(),
    sectors: z.array(z.string()).default([]),
  }),
});

// ─── Brand Voice (Tier 4.2) · doctrine éditoriale V5-V7 · singleton ───
const brandVoice = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/brand-voice' }),
  schema: z.object({
    title_fr: z.string(),
    title_en: z.string(),
    publishedAt: z.coerce.date(),
    doctrine_fr: z.string(),
    doctrine_en: z.string(),
    tone_principles_fr: z.array(z.string()).min(5).max(12),
    tone_principles_en: z.array(z.string()).min(5).max(12),
    forbidden_words_fr: z.array(z.string()).default([]),
    forbidden_words_en: z.array(z.string()).default([]),
    preferred_words_fr: z.array(z.string()).default([]),
    preferred_words_en: z.array(z.string()).default([]),
    sample_phrases_fr: z.array(z.string()).min(3).max(10),
    sample_phrases_en: z.array(z.string()).min(3).max(10),
    typography_rules_fr: z.array(z.string()).default([]),
    typography_rules_en: z.array(z.string()).default([]),
  }),
});

// ─── Commerce (Tier 3.2) · fusion produits + abonnements via discriminated union ───
const commerce = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/commerce' }),
  schema: z.discriminatedUnion('commerce_type', [
    // Produit one-shot (audit-guide, kit-prompts, livre-blanc-premium, workbook, etc.)
    z.object({
      commerce_type: z.literal('product'),
      ...baseFields,
      ...taxonomyFields,
      sku: z.string(),
      price_eur: z.number().int().nonnegative(),
      stripe_payment_link: z.string().url(),
      delivery_format: z.enum(['pdf', 'epub', 'video', 'pack-zip', 'notion', 'mixte']),
      pages_count: z.number().int().positive().optional(),
      duration_minutes: z.number().int().positive().optional(),
      preview_url: z.string().url().optional(),
      benefits_fr: z.array(z.string()).min(3).max(8),
      benefits_en: z.array(z.string()).min(3).max(8),
      faq_items: z
        .array(z.object({ q_fr: z.string(), q_en: z.string(), a_fr: z.string(), a_en: z.string() }))
        .default([]),
    }),
    // Abonnement récurrent (membership Atelier, accès content premium, etc.)
    z.object({
      commerce_type: z.literal('subscription'),
      ...baseFields,
      ...taxonomyFields,
      sku: z.string(),
      price_eur_monthly: z.number().int().nonnegative(),
      price_eur_yearly: z.number().int().nonnegative().optional(),
      stripe_billing_portal: z.string().url(),
      includes_fr: z.array(z.string()).min(3).max(10),
      includes_en: z.array(z.string()).min(3).max(10),
      tier: z.enum(['starter', 'pro', 'team']).default('starter'),
    }),
  ]),
});

// ─── Testimonials (Tier 6.1) · témoignages clients pour Conversion + Trust ───
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/testimonials' }),
  schema: z.object({
    quote_fr: z.string(),
    quote_en: z.string(),
    author: z.string(),
    role_fr: z.string(),
    role_en: z.string(),
    company: z.string(),
    avatar: z.string().optional(),
    sector: z.enum(['services-b2b', 'industrie', 'finance', 'tech', 'agence', 'autre']),
    engagement_type: z.enum(['activation-1-semaine', 'growth-system', 'audit', 'conseil']),
    publishedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    metrics_fr: z.array(z.string()).default([]),
    metrics_en: z.array(z.string()).default([]),
  }),
});

// ─── Glossary (Tier 5.1) · termes IA/business pour SEO programmatique ───
const glossary = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/glossary' }),
  schema: z.object({
    term_fr: z.string(),
    term_en: z.string(),
    slug: z.string(),
    definition_fr: z.string(),
    definition_en: z.string(),
    short_explanation_fr: z.string(),
    short_explanation_en: z.string(),
    examples_fr: z.array(z.string()).min(1).max(5),
    examples_en: z.array(z.string()).min(1).max(5),
    related_terms: z.array(z.string()).default([]),
    category: z.enum(['ia-technique', 'ia-business', 'data', 'workflow', 'gouvernance']),
    publishedAt: z.coerce.date(),
    seo: z.object({
      meta_description_fr: z.string().max(160),
      meta_description_en: z.string().max(160),
    }),
  }),
});

// ═════════════════════════════════════════════════════════════════
// Tier 4 · prompts (bibliothèque AI internal/public) — T4.3
// ═════════════════════════════════════════════════════════════════

const prompts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/prompts' }),
  schema: z.object({
    name_fr: z.string().min(1),
    name_en: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    purpose_fr: z.string().min(40).max(280),
    purpose_en: z.string().min(40).max(280),
    system_prompt_fr: z.string().min(20),
    system_prompt_en: z.string().min(20),
    variables: z
      .array(
        z.object({
          name: z.string(),
          label_fr: z.string(),
          label_en: z.string(),
          required: z.boolean().default(true),
        }),
      )
      .default([]),
    sample_output_fr: z.string().optional(),
    sample_output_en: z.string().optional(),
    category: z.enum([
      'audit',
      'copywriting',
      'persona',
      'brand',
      'schema',
      'diagnostic',
      'autre',
    ]),
    visibility: z.enum(['internal', 'public']).default('internal'),
    publishedAt: z.coerce.date(),
    seo: z.object({
      meta_description_fr: z.string().max(160),
      meta_description_en: z.string().max(160),
    }).optional(),
  }),
});

// ═════════════════════════════════════════════════════════════════
// Tier 4 · pain-points (catalogue cross-référencé personas × secteurs) — T4.4
// ═════════════════════════════════════════════════════════════════

const painPoints = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pain-points' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    pain_fr: z.string().min(20).max(280),
    pain_en: z.string().min(20).max(280),
    severity: z.enum(['critical', 'high', 'medium', 'low']),
    affected_personas: z.array(z.string()).default([]),
    affected_secteurs: z.array(z.string()).default([]),
    solution_fr: z.string().min(20),
    solution_en: z.string().min(20),
    related_offres: z.array(z.string()).default([]),
    related_solutions: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
  }),
});

// ═════════════════════════════════════════════════════════════════
// Tier 5 · integrations (outils tiers connectables Waimia) — T5.2
// ═════════════════════════════════════════════════════════════════

const integrations = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/integrations' }),
  schema: z.object({
    tool_name: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    vendor: z.string().min(1),
    category: z.enum([
      'crm',
      'data',
      'automation',
      'analytics',
      'communication',
      'productivity',
      'ai-platform',
      'commerce',
      'hosting',
      'autre',
    ]),
    use_cases_fr: z.array(z.string()).min(1),
    use_cases_en: z.array(z.string()).min(1),
    native_or_via_api: z.enum(['native', 'api', 'zapier-make', 'manual']),
    logo_url: z.string().optional(),
    description_fr: z.string().min(40).max(400),
    description_en: z.string().min(40).max(400),
    pricing_note_fr: z.string().optional(),
    pricing_note_en: z.string().optional(),
    publishedAt: z.coerce.date(),
    seo: z.object({
      meta_description_fr: z.string().max(160),
      meta_description_en: z.string().max(160),
    }).optional(),
  }),
});

// ═════════════════════════════════════════════════════════════════
// Tier 4 · knowledge-base (RAG-ready chunks pour agents) — T4.5
// ═════════════════════════════════════════════════════════════════

const knowledgeBase = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/knowledge-base' }),
  schema: z.object({
    title_fr: z.string().min(1),
    title_en: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    summary_fr: z.string().min(40).max(280),
    summary_en: z.string().min(40).max(280),
    category: z.enum([
      'methode',
      'doctrine',
      'design',
      'ia-strategy',
      'culture',
      'process',
      'tooling',
    ]),
    tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
    embedding_ready: z.boolean().default(true),
    publishedAt: z.coerce.date(),
  }),
});

// ═════════════════════════════════════════════════════════════════

export const collections = {
  // V1 existantes
  cases,
  offres,
  solutions,
  technologies,
  blog,
  fieldNotes,
  secteurs,
  livresBlancs,
  cookbooks,
  outils,
  veilleIA,
  pages,
  authors,
  // V2 nouvelles (2026-05-15)
  tunnels,
  welcomePages,
  formations,
  parcours,
  ateliers,
  courses,
  produits,
  abonnements,
  landingPages,
  newsletter,
  // Tier 4 AI-first + Tier 5 SEO (2026-05-15)
  personas,
  brandVoice,
  glossary,
  testimonials,
  commerce,
  // Tier 4 AI-first + Tier 5 (2026-05-16)
  prompts,
  painPoints,
  integrations,
  knowledgeBase,
};
