// Waimia · Section schemas V2 (2026-05-15)
// Composable architecture — discriminated union de tous les types de section data-driven.
// Cf docs/15-STRATEGIC-AUDIT.md Tier 2 + docs/16-EXECUTION-TRACKER.md T2.1
//
// Pattern : chaque page = `sections: Section[]`. Le renderer mappe `type` → composant Astro.
// Ajouter une nouvelle section = (1) ajouter schema ici, (2) créer composant, (3) inscrire dans registry.

import { z } from 'astro:content';

/* ─── Sous-schémas réutilisables ─── */

const bilingualString = z.object({
  fr: z.string(),
  en: z.string(),
});

const ctaSchema = z.object({
  label_fr: z.string(),
  label_en: z.string(),
  href: z.string(),
  variant: z.enum(['primary', 'accent', 'ghost', 'ghost-dark', 'terminal']).default('primary'),
  mag: z.number().min(0).max(1).optional(),
});

const metricSchema = z.object({
  value: z.string(),
  label_fr: z.string(),
  label_en: z.string(),
  emphasis: z.boolean().default(false),
});

const featureItemSchema = z.object({
  icon: z.string().optional(), // SVG name dans components/svg
  title_fr: z.string(),
  title_en: z.string(),
  body_fr: z.string(),
  body_en: z.string(),
});

const stepSchema = z.object({
  num: z.string(),
  label_fr: z.string(),
  label_en: z.string(),
  body_fr: z.string(),
  body_en: z.string(),
  meta_fr: z.string().optional(),
  meta_en: z.string().optional(),
  duration_fr: z.string().optional(),
});

const faqItemSchema = z.object({
  q_fr: z.string(),
  q_en: z.string(),
  a_fr: z.string(),
  a_en: z.string(),
});

const pricingTierSchema = z.object({
  name_fr: z.string(),
  name_en: z.string(),
  price: z.string(),
  features_fr: z.array(z.string()),
  features_en: z.array(z.string()),
  cta: ctaSchema,
  featured: z.boolean().default(false),
});

const testimonialSchema = z.object({
  quote_fr: z.string(),
  quote_en: z.string(),
  author: z.string(),
  role_fr: z.string(),
  role_en: z.string(),
  company: z.string().optional(),
  avatar: z.string().optional(),
});

const comparisonRowSchema = z.object({
  feature_fr: z.string(),
  feature_en: z.string(),
  values: z.array(z.union([z.string(), z.boolean()])),
});

const timelineEventSchema = z.object({
  date: z.string(),
  title_fr: z.string(),
  title_en: z.string(),
  body_fr: z.string(),
  body_en: z.string(),
});

/* ─── Section schemas (20 types) ─── */

// HERO variants
export const heroSplitSchema = z.object({
  type: z.literal('hero-split'),
  kicker_fr: z.string().optional(),
  kicker_en: z.string().optional(),
  h1_fr: z.string(),
  h1_en: z.string(),
  lede_fr: z.string(),
  lede_en: z.string(),
  cta_primary: ctaSchema,
  cta_secondary: ctaSchema.optional(),
  meta_fr: z.string().optional(),
  meta_en: z.string().optional(),
  right_block: z
    .object({
      kind: z.enum(['mini-map', 'workflow-svg', 'stats', 'image', 'mockup-terminal']),
      data: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

export const heroCenteredSchema = z.object({
  type: z.literal('hero-centered'),
  kicker_fr: z.string().optional(),
  kicker_en: z.string().optional(),
  h1_fr: z.string(),
  h1_en: z.string(),
  lede_fr: z.string(),
  lede_en: z.string(),
  cta_primary: ctaSchema,
  cta_secondary: ctaSchema.optional(),
});

export const heroFullBleedSchema = z.object({
  type: z.literal('hero-full-bleed'),
  h1_fr: z.string(),
  h1_en: z.string(),
  lede_fr: z.string().optional(),
  lede_en: z.string().optional(),
  background_kind: z.enum(['liquid-canvas', 'gradient-mesh', 'signature-grid', 'ink-paper']),
  cta_primary: ctaSchema.optional(),
});

// PROOF / STATS
export const proofBarSchema = z.object({
  type: z.literal('proof-bar'),
  kicker_fr: z.string().optional(),
  kicker_en: z.string().optional(),
  metrics: z.array(metricSchema).min(2).max(6),
  layout: z.enum(['horizontal', 'vertical-stack']).default('horizontal'),
});

export const statBlockSchema = z.object({
  type: z.literal('stat-block'),
  h2_fr: z.string().optional(),
  h2_en: z.string().optional(),
  lede_fr: z.string().optional(),
  lede_en: z.string().optional(),
  metrics: z.array(metricSchema).min(1).max(8),
  layout: z.enum(['grid-3', 'grid-4', 'rows-hairlines']).default('grid-3'),
});

export const socialProofSchema = z.object({
  type: z.literal('social-proof'),
  kicker_fr: z.string().optional(),
  kicker_en: z.string().optional(),
  logos: z.array(z.object({ name: z.string(), src: z.string().optional() })),
  marquee: z.boolean().default(true),
});

// CONTENT
export const methodTimelineSchema = z.object({
  type: z.literal('method-timeline'),
  kicker_fr: z.string().optional(),
  kicker_en: z.string().optional(),
  h2_fr: z.string(),
  h2_en: z.string(),
  lede_fr: z.string().optional(),
  lede_en: z.string().optional(),
  steps: z.array(stepSchema).min(2).max(6),
});

export const featureGridSchema = z.object({
  type: z.literal('feature-grid'),
  kicker_fr: z.string().optional(),
  kicker_en: z.string().optional(),
  h2_fr: z.string(),
  h2_en: z.string(),
  features: z.array(featureItemSchema).min(3).max(8),
  columns: z.enum(['2', '3', '4']).default('3'),
});

export const comparisonTableSchema = z.object({
  type: z.literal('comparison-table'),
  h2_fr: z.string(),
  h2_en: z.string(),
  column_headers_fr: z.array(z.string()).min(2),
  column_headers_en: z.array(z.string()).min(2),
  rows: z.array(comparisonRowSchema).min(2),
});

export const timelineBlockSchema = z.object({
  type: z.literal('timeline-block'),
  h2_fr: z.string(),
  h2_en: z.string(),
  events: z.array(timelineEventSchema).min(2),
});

export const mediaBlockSchema = z.object({
  type: z.literal('media-block'),
  caption_fr: z.string().optional(),
  caption_en: z.string().optional(),
  media_kind: z.enum(['image', 'svg', 'video', 'embed']),
  src: z.string(),
  alt_fr: z.string().optional(),
  alt_en: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

// PRICING
export const pricingTableSchema = z.object({
  type: z.literal('pricing-table'),
  kicker_fr: z.string().optional(),
  kicker_en: z.string().optional(),
  h2_fr: z.string(),
  h2_en: z.string(),
  tiers: z.array(pricingTierSchema).min(1).max(5),
});

// FAQ / OBJECTIONS
export const faqAccordionSchema = z.object({
  type: z.literal('faq-accordion'),
  kicker_fr: z.string().optional(),
  kicker_en: z.string().optional(),
  h2_fr: z.string(),
  h2_en: z.string(),
  items: z.array(faqItemSchema).min(2),
});

export const objectionHandlerSchema = z.object({
  type: z.literal('objection-handler'),
  h2_fr: z.string(),
  h2_en: z.string(),
  objections: z
    .array(
      z.object({
        objection_fr: z.string(),
        objection_en: z.string(),
        response_fr: z.string(),
        response_en: z.string(),
      }),
    )
    .min(2),
});

// CTA
export const ctaFinalSchema = z.object({
  type: z.literal('cta-final'),
  h2_fr: z.string(),
  h2_en: z.string(),
  body_fr: z.string().optional(),
  body_en: z.string().optional(),
  cta_primary: ctaSchema,
  cta_secondary: ctaSchema.optional(),
  background: z.enum(['paper', 'paper-2', 'ink', 'accent']).default('ink'),
});

export const ctaBandSchema = z.object({
  type: z.literal('cta-band'),
  text_fr: z.string(),
  text_en: z.string(),
  cta: ctaSchema,
  background: z.enum(['paper-2', 'ink', 'accent']).default('paper-2'),
});

export const ctaInlineSchema = z.object({
  type: z.literal('cta-inline'),
  text_fr: z.string(),
  text_en: z.string(),
  cta: ctaSchema,
});

// SOCIAL / TRUST
export const testimonialBlockSchema = z.object({
  type: z.literal('testimonial-block'),
  kicker_fr: z.string().optional(),
  kicker_en: z.string().optional(),
  h2_fr: z.string().optional(),
  h2_en: z.string().optional(),
  testimonials: z.array(testimonialSchema).min(1).max(6),
  layout: z.enum(['carousel', 'grid-2', 'rows']).default('grid-2'),
});

export const guaranteeBlockSchema = z.object({
  type: z.literal('guarantee-block'),
  guarantees: z
    .array(
      z.object({
        title_fr: z.string(),
        title_en: z.string(),
        body_fr: z.string(),
        body_en: z.string(),
      }),
    )
    .min(1)
    .max(4),
});

/* ─── Union discriminée pour validation ─── */

export const sectionSchema = z.discriminatedUnion('type', [
  heroSplitSchema,
  heroCenteredSchema,
  heroFullBleedSchema,
  proofBarSchema,
  statBlockSchema,
  socialProofSchema,
  methodTimelineSchema,
  featureGridSchema,
  comparisonTableSchema,
  timelineBlockSchema,
  mediaBlockSchema,
  pricingTableSchema,
  faqAccordionSchema,
  objectionHandlerSchema,
  ctaFinalSchema,
  ctaBandSchema,
  ctaInlineSchema,
  testimonialBlockSchema,
  guaranteeBlockSchema,
]);

export type SectionData = (typeof sectionSchema)['_output'];

/**
 * Schema usable directement dans content collections :
 * ```ts
 * import { sectionsArraySchema } from '../schemas/sections';
 * schema: z.object({
 *   ...baseFields,
 *   sections: sectionsArraySchema,
 * })
 * ```
 */
export const sectionsArraySchema = z.array(sectionSchema).default([]);

/* ─── Type helpers ─── */

export type SectionType = SectionData['type'];

export type SectionByType<T extends SectionType> = Extract<SectionData, { type: T }>;
