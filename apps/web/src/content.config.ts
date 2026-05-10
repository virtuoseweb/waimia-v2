// Waimia · content collections · Zod schemas
// Cf docs/03-content-models.md pour le rationale de chaque champ.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

// ─── Cases ───
const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: z.object({
    ...baseFields,
    client: z.string(),
    sector_fr: z.string(),
    sector_en: z.string(),
    duration: z.string(),
    stack: z.array(z.string()),
    impact_fr: z.string(),
    impact_en: z.string(),
    metrics: z
      .array(
        z.object({
          label_fr: z.string(),
          label_en: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
    ndaProtected: z.boolean().default(false),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
  }),
});

// ─── Offres ───
const offres = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/offres' }),
  schema: z.object({
    ...baseFields,
    tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    category_fr: z.string(),
    category_en: z.string(),
    priceFrom: z.string().optional(),
    duration: z.string(),
    deliverables_fr: z.array(z.string()),
    deliverables_en: z.array(z.string()),
    relatedSolutions: z.array(z.string()).default([]),
    relatedTechnologies: z.array(z.string()).default([]),
    caseStudies: z.array(z.string()).default([]),
  }),
});

// ─── Solutions ───
const solutions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/solutions' }),
  schema: z.object({
    ...baseFields,
    kind: z.enum(['department', 'industry']),
    icon: z.string().optional(),
    metricsHero: z
      .array(
        z.object({
          label_fr: z.string(),
          label_en: z.string(),
          value: z.string(),
        }),
      )
      .default([]),
    useCases_fr: z.array(z.string()),
    useCases_en: z.array(z.string()),
    constraints_fr: z.array(z.string()).optional(),
    constraints_en: z.array(z.string()).optional(),
    relatedOffres: z.array(z.string()).default([]),
    caseStudies: z.array(z.string()).default([]),
  }),
});

// ─── Technologies ───
const technologies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/technologies' }),
  schema: z.object({
    ...baseFields,
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
    relatedOffres: z.array(z.string()).default([]),
  }),
});

// ─── Blog (long-form) ───
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    ...baseFields,
    category: z.enum(['Field Note', 'Case', 'Essay', 'Cookbook', 'Tutorial']),
    author: z.object({
      name: z.string(),
      url: z.string().url().optional(),
      bio_fr: z.string().optional(),
      bio_en: z.string().optional(),
    }),
    readingTime: z.number().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]),
  }),
});

// ─── Field notes (court) ───
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

// ─── Secteurs (pillar SEO/GEO par industrie) ───
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
    metricsHero: z
      .array(
        z.object({
          label_fr: z.string(),
          label_en: z.string(),
          value: z.string(),
        }),
      )
      .default([]),
    caseRef: z.string().optional(),
    visible: z.boolean().default(true),
    ctaPrimary_fr: z.string(),
    ctaPrimary_en: z.string(),
  }),
});

// ─── Livres blancs (lead magnets gated) ───
const livresBlancs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/livres-blancs' }),
  schema: z.object({
    ...baseFields,
    pages: z.number().int().positive(),
    audience_fr: z.string(),
    audience_en: z.string(),
    chapters_fr: z.array(z.string()).min(3),
    chapters_en: z.array(z.string()).min(3),
    pdfUrl: z.string().optional(),
    requireEmail: z.boolean().default(true),
    apiSlug: z.string().regex(/^[a-z0-9-]+$/),
    relatedOffres: z.array(z.string()).default([]),
    coverUrl: z.string().optional(),
    format_fr: z.string(),
    format_en: z.string(),
  }),
});

// ─── Cookbooks (guides techniques actionnables) ───
const cookbooks = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cookbooks' }),
  schema: z.object({
    ...baseFields,
    duration_fr: z.string(),
    duration_en: z.string(),
    difficulty: z.enum(['Débutant', 'Intermédiaire', 'Avancé']),
    prerequisites_fr: z.array(z.string()).default([]),
    prerequisites_en: z.array(z.string()).default([]),
    steps: z.number().int().positive(),
    technologies: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    author: z.object({
      name: z.string(),
      role: z.string().optional(),
      url: z.string().url().optional(),
    }),
    relatedCookbooks: z.array(z.string()).default([]),
  }),
});

// ─── Outils (calculateurs, checklists, templates) ───
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
          format: z
            .enum(['integer', 'decimal2', 'currency-eur', 'percent'])
            .optional(),
        }),
      )
      .default([]),
    captureEmail: z.boolean().default(false),
    apiSlug: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    relatedPages: z.array(z.string()).default([]),
    category_fr: z.string().optional(),
    category_en: z.string().optional(),
  }),
});

// ─── Veille IA (posts marché courts) ───
const veilleIA = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/veille-ia' }),
  schema: z.object({
    ...baseFields,
    date: z.coerce.date(),
    impact_fr: z.string().min(40).max(280),
    impact_en: z.string().min(40).max(280),
    sources: z
      .array(
        z.object({
          name: z.string(),
          url: z.string().url(),
          publishedAt: z.coerce.date().optional(),
        }),
      )
      .default([]),
    sectors: z.array(z.string()).default([]),
    author: z.object({
      name: z.string(),
      url: z.string().url().optional(),
    }),
    tags: z.array(z.string()).default([]),
  }),
});

// ─── Pages standalone (about, contact, manifesto, etc.) ───
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

// ─── Authors (CV intégré, social, bibliographie) ───
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

export const collections = {
  cases,
  offres,
  solutions,
  technologies,
  blog,
  fieldNotes,
  // NEW v1
  secteurs,
  livresBlancs,
  cookbooks,
  outils,
  veilleIA,
  pages,
  authors,
};
