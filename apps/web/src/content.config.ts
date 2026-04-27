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

export const collections = { cases, offres, solutions, technologies, blog, fieldNotes };
