// Waimia · Stripe Payment Links V2 (2026-05-15)
// Pattern : sitewebastro / VirtuoseWeb — Stripe Billing Portal URL statique + Payment Links par produit/abonnement/formation.
// Pas de SDK Node côté serveur — toutes les URL sont configurées dans Stripe Dashboard Waimia.
// Cf docs/14-MASTER-PLAN-SESSION-NEXT.md décision 4.
//
// ⚠️ Placeholders à remplacer par les vraies URL Stripe Dashboard Waimia.
// Une fois remplacées, ces URL deviennent immutables (référencées partout via slug).

/* ─── Customer Portal (Stripe Billing) ─── */

/**
 * URL du portail client Stripe Waimia.
 * Le client renseigne son email, reçoit un magic link, accède à sa facturation.
 * Pas de mot de passe, pas d'accès aux données bancaires côté Waimia.
 *
 * À configurer dans Stripe Dashboard → Settings → Billing → Customer Portal.
 */
export const STRIPE_CUSTOMER_PORTAL_URL =
  'https://billing.stripe.com/p/login/PLACEHOLDER_WAIMIA_BILLING_PORTAL';

/* ─── Payment Links · Produits (one-shot purchase) ─── */

/**
 * Map SKU produit → URL Stripe Payment Link.
 * Format SKU : WAI-{TYPE}-{NUM} (cf schema produits).
 */
export const PRODUITS_PAYMENT_LINKS: Record<string, string> = {
  // Audits guide self-service
  'WAI-AUD-001': 'https://buy.stripe.com/PLACEHOLDER_audit-maturite-ia-self',

  // Template kits
  'WAI-KIT-001': 'https://buy.stripe.com/PLACEHOLDER_kit-prompts-hubspot-50',

  // Livres blancs premium
  'WAI-LBP-001': 'https://buy.stripe.com/PLACEHOLDER_growth-system-ia-playbook-premium',

  // Masterclass replays
  'WAI-MCR-001': 'https://buy.stripe.com/PLACEHOLDER_masterclass-pipeline-editorial-seo',

  // Workbooks
  'WAI-WBK-001': 'https://buy.stripe.com/PLACEHOLDER_workbook-cartographie-pipeline',

  // Starter packs (bundles)
  'WAI-BDL-001': 'https://buy.stripe.com/PLACEHOLDER_starter-pack-acquisition-ia',
};

/* ─── Payment Links · Abonnements (subscriptions récurrentes) ─── */

/**
 * Map SKU abonnement → URL Stripe Subscription Payment Link.
 * Format SKU : WAI-SUB-{TYPE}-{NUM}.
 * Le client souscrit, Stripe gère le cycle mensuel/annuel.
 */
export const ABONNEMENTS_PAYMENT_LINKS: Record<string, string> = {
  'WAI-SUB-HST-001': 'https://buy.stripe.com/PLACEHOLDER_gestion-hebergement-vercel',
  'WAI-SUB-MAI-001': 'https://buy.stripe.com/PLACEHOLDER_maintenance-site-ia-first',
  'WAI-SUB-MON-001': 'https://buy.stripe.com/PLACEHOLDER_monitoring-agents-ia',
  'WAI-SUB-CON-001': 'https://buy.stripe.com/PLACEHOLDER_production-editoriale-seo-geo',
  'WAI-SUB-CRM-001': 'https://buy.stripe.com/PLACEHOLDER_gestion-crm-continue',
  'WAI-SUB-SUP-001': 'https://buy.stripe.com/PLACEHOLDER_support-premium-pme',
};

/* ─── Payment Links · Formations (one-shot ou subscription) ─── */

/**
 * Map slug formation → URL Stripe Payment Link.
 * Les formations peuvent être one-shot OU subscription selon `pricing` dans le frontmatter MDX.
 */
export const FORMATIONS_PAYMENT_LINKS: Record<string, string> = {
  'intro-ia-pme-b2b': 'https://buy.stripe.com/PLACEHOLDER_formation-intro-ia-pme',
  'prompter-claude-pour-les-non-tech': 'https://buy.stripe.com/PLACEHOLDER_formation-prompter-claude',
  'automatiser-relances-crm-en-4-heures': 'https://buy.stripe.com/PLACEHOLDER_formation-relances-crm',
  'pipeline-editorial-seo-geo-systematique': 'https://buy.stripe.com/PLACEHOLDER_formation-pipeline-editorial',
  'architecture-multi-agents-pme': 'https://buy.stripe.com/PLACEHOLDER_formation-archi-multi-agents',
};

/**
 * Map slug parcours → URL Stripe Payment Link.
 */
export const PARCOURS_PAYMENT_LINKS: Record<string, string> = {
  'parcours-acquisition-ia-4-semaines': 'https://buy.stripe.com/PLACEHOLDER_parcours-acquisition',
  'parcours-revops-ia-6-semaines': 'https://buy.stripe.com/PLACEHOLDER_parcours-revops',
};

/**
 * Map slug atelier → URL Stripe Payment Link.
 */
export const ATELIERS_PAYMENT_LINKS: Record<string, string> = {
  'atelier-decouverte-virtuoseos': 'https://buy.stripe.com/PLACEHOLDER_atelier-virtuoseos',
};

/* ─── Helpers ─── */

/**
 * Récupère le Payment Link Stripe pour un SKU/slug donné.
 * Retourne `undefined` si pas mappé.
 */
export function getStripeLink(
  sku: string,
  type: 'produit' | 'abonnement' | 'formation' | 'parcours' | 'atelier',
): string | undefined {
  switch (type) {
    case 'produit':
      return PRODUITS_PAYMENT_LINKS[sku];
    case 'abonnement':
      return ABONNEMENTS_PAYMENT_LINKS[sku];
    case 'formation':
      return FORMATIONS_PAYMENT_LINKS[sku];
    case 'parcours':
      return PARCOURS_PAYMENT_LINKS[sku];
    case 'atelier':
      return ATELIERS_PAYMENT_LINKS[sku];
  }
}

/**
 * Détecte si une URL est encore un placeholder (à remplacer par la vraie URL Stripe).
 * À utiliser côté CTA pour griser le bouton tant que Simon n'a pas configuré Stripe.
 */
export function isStripePlaceholder(url: string | undefined): boolean {
  if (!url) return true;
  return url.includes('PLACEHOLDER');
}

/**
 * Récupère l'URL du portail client Stripe (espace abonné).
 */
export function getCustomerPortalUrl(): string {
  return STRIPE_CUSTOMER_PORTAL_URL;
}
