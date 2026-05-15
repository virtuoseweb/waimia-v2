// Waimia · Section registry V2 (2026-05-15)
// Mapping `section.type` → composant Astro pour rendu data-driven.
// Cf docs/16-EXECUTION-TRACKER.md T2.3
//
// Pattern : nouvelle section = ajouter import + entry registry.
// Le SectionsRenderer.astro consomme ce registry.

import type { ComponentType } from 'astro';
import type { SectionType } from '../schemas/sections';

// Imports section components (sera étendu Wave T2.2 par worker Sonnet)
import HeroSplit from '../components/sections/HeroSplit.astro';
import HeroCentered from '../components/sections/HeroCentered.astro';
import HeroFullBleed from '../components/sections/HeroFullBleed.astro';
import ProofBar from '../components/sections/ProofBar.astro';
import StatBlock from '../components/sections/StatBlock.astro';
import SocialProof from '../components/sections/SocialProof.astro';
import MethodTimeline from '../components/sections/MethodTimeline.astro';
import FeatureGrid from '../components/sections/FeatureGrid.astro';
import ComparisonTable from '../components/sections/ComparisonTable.astro';
import TimelineBlock from '../components/sections/TimelineBlock.astro';
import MediaBlock from '../components/sections/MediaBlock.astro';
import PricingTable from '../components/sections/PricingTable.astro';
import FaqAccordion from '../components/sections/FaqAccordion.astro';
import ObjectionHandler from '../components/sections/ObjectionHandler.astro';
import CtaFinal from '../components/sections/CtaFinal.astro';
import CtaBand from '../components/sections/CtaBand.astro';
import CtaInline from '../components/sections/CtaInline.astro';
import TestimonialBlock from '../components/sections/TestimonialBlock.astro';
import GuaranteeBlock from '../components/sections/GuaranteeBlock.astro';

/**
 * Section registry — single source of truth pour mapping type → component.
 * Le SectionsRenderer.astro itère sur sections[] et appelle le bon composant via ce registry.
 */
export const SECTION_REGISTRY: Record<SectionType, ComponentType> = {
  'hero-split': HeroSplit,
  'hero-centered': HeroCentered,
  'hero-full-bleed': HeroFullBleed,
  'proof-bar': ProofBar,
  'stat-block': StatBlock,
  'social-proof': SocialProof,
  'method-timeline': MethodTimeline,
  'feature-grid': FeatureGrid,
  'comparison-table': ComparisonTable,
  'timeline-block': TimelineBlock,
  'media-block': MediaBlock,
  'pricing-table': PricingTable,
  'faq-accordion': FaqAccordion,
  'objection-handler': ObjectionHandler,
  'cta-final': CtaFinal,
  'cta-band': CtaBand,
  'cta-inline': CtaInline,
  'testimonial-block': TestimonialBlock,
  'guarantee-block': GuaranteeBlock,
};

/**
 * Helper : récupère le composant pour un type donné. Retourne undefined si type inconnu.
 */
export function getSectionComponent(type: SectionType): ComponentType | undefined {
  return SECTION_REGISTRY[type];
}
