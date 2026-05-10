/**
 * Schema.org JSON-LD builder centralise pour toutes les collections.
 *
 * Usage dans un loader :
 *   import { buildSchemaForPage } from '../../../lib/seo/schema-builder';
 *   const jsonLd = buildSchemaForPage(entry, 'blog', { lang, url, authorEntry });
 *   // puis pass a <Base jsonLd={jsonLd}>
 */

import type { CollectionEntry } from 'astro:content';

const SITE_URL = 'https://waimia.com';

type Lang = 'fr' | 'en';

interface BuildContext {
  lang: Lang;
  url?: string;
  authorEntry?: any;
}

function buildBreadcrumbList(items: Array<{ name: string; url?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

function buildOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Waimia',
    url: SITE_URL,
    logo: `${SITE_URL}/og/default.png`,
    sameAs: ['https://www.linkedin.com/company/waimia'],
  };
}

function buildPersonFromAuthor(authorEntry: any, lang: Lang) {
  if (!authorEntry) return null;
  const a = authorEntry.data;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: a.title_fr,
    jobTitle: lang === 'fr' ? a.role_fr : a.role_en,
    description: lang === 'fr' ? a.description_fr : a.description_en,
    image: a.photo ? `${SITE_URL}${a.photo}` : undefined,
    url: `${SITE_URL}/equipe/${authorEntry.id}`,
    sameAs: [a.social?.linkedin, a.social?.x, a.social?.github, a.social?.website].filter(Boolean),
    worksFor: {
      '@type': 'Organization',
      name: 'Waimia',
      url: SITE_URL,
    },
  };
}

function buildCitations(sources: any[]) {
  if (!sources || sources.length === 0) return [];

  return sources.map((s) => ({
    '@context': 'https://schema.org',
    '@type': s.type === 'university' ? 'ScholarlyArticle' : s.type === 'journal' ? 'NewsArticle' : 'Article',
    name: s.name,
    url: s.url,
    datePublished: s.publishedAt ? new Date(s.publishedAt).toISOString().split('T')[0] : undefined,
    author: s.author ? { '@type': 'Organization', name: s.author } : undefined,
  }));
}

function buildFAQPage(faqItems: any[]) {
  if (!faqItems || faqItems.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

function buildArticleSchema(entry: any, lang: Lang, url: string, authorEntry?: any) {
  const d = entry.data;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: lang === 'fr' ? d.title_fr : d.title_en,
    description: lang === 'fr' ? d.description_fr : d.description_en,
    datePublished: new Date(d.publishedAt).toISOString().split('T')[0],
    dateModified: d.updatedAt ? new Date(d.updatedAt).toISOString().split('T')[0] : undefined,
    author: authorEntry ? buildPersonFromAuthor(authorEntry, lang) : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Waimia',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og/default.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(d.heroImage ? { image: [`${SITE_URL}${d.heroImage}`] } : {}),
    ...(d.sources && d.sources.length > 0
      ? {
          citation: d.sources.map((s: any) => s.url),
        }
      : {}),
  };
}

function buildHowToSchema(entry: any, lang: Lang) {
  const d = entry.data;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: lang === 'fr' ? d.title_fr : d.title_en,
    description: lang === 'fr' ? d.description_fr : d.description_en,
    totalTime: d.duration_fr,
    estimatedCost: d.priceFrom ? { '@type': 'MonetaryAmount', currency: 'EUR', value: d.priceFrom } : undefined,
    ...(d.prerequisites_fr && d.prerequisites_fr.length > 0
      ? {
          supply: d.prerequisites_fr.map((p: string) => ({
            '@type': 'HowToSupply',
            name: p,
          })),
        }
      : {}),
  };
}

function buildBookSchema(entry: any, lang: Lang) {
  const d = entry.data;

  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: lang === 'fr' ? d.title_fr : d.title_en,
    description: lang === 'fr' ? d.description_fr : d.description_en,
    numberOfPages: d.pages,
    datePublished: new Date(d.publishedAt).toISOString().split('T')[0],
    publisher: { '@type': 'Organization', name: 'Waimia' },
  };
}

function buildOfferSchema(entry: any, lang: Lang) {
  const d = entry.data;

  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: lang === 'fr' ? d.title_fr : d.title_en,
    category: 'InformationalContent',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: d.requireEmail ? `${SITE_URL}/api/lead-magnet?slug=${d.apiSlug}` : undefined,
  };
}

function buildNewsArticleSchema(entry: any, lang: Lang, url: string, authorEntry?: any) {
  const article = buildArticleSchema(entry, lang, url, authorEntry);

  return { ...article, '@type': 'NewsArticle' };
}

function buildServiceSchema(entry: any, lang: Lang) {
  const d = entry.data;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: lang === 'fr' ? d.title_fr : d.title_en,
    description: lang === 'fr' ? d.description_fr : d.description_en,
    provider: {
      '@type': 'Organization',
      name: 'Waimia',
      url: SITE_URL,
    },
    areaServed: ['FR', 'CH'],
    serviceType: d.category_fr ?? 'AI integration',
    ...(d.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: d.priceFrom,
              priceCurrency: 'EUR',
            },
          },
        }
      : {}),
  };
}

function buildProfilePageSchema(personSchema: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: personSchema,
  };
}

function buildCollectionPageSchema(name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
  };
}

export function buildSchemaForPage(
  entry: any,
  collection: string,
  ctx: BuildContext,
): Array<Record<string, unknown>> {
  const { lang, url, authorEntry } = ctx;
  const fullUrl = url ?? `${SITE_URL}/`;
  const schemas: Array<Record<string, unknown>> = [];
  const d = entry.data;

  switch (collection) {
    case 'authors': {
      const person = buildPersonFromAuthor(entry, lang);
      if (person) {
        schemas.push(person);
        schemas.push(buildProfilePageSchema(person));
      }
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          {
            name: lang === 'fr' ? "L'equipe" : 'The team',
            url: `${SITE_URL}/equipe`,
          },
          { name: d.title_fr },
        ]),
      );
      break;
    }

    case 'blog': {
      schemas.push(buildArticleSchema(entry, lang, fullUrl, authorEntry));
      const citations = buildCitations(d.sources ?? []);
      if (citations.length > 0) schemas.push(...citations);
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          {
            name: lang === 'fr' ? 'Ressources' : 'Resources',
            url: `${SITE_URL}/ressources`,
          },
          {
            name: 'Blog',
            url: `${SITE_URL}/ressources/blog`,
          },
          { name: d.title_fr },
        ]),
      );
      break;
    }

    case 'cookbooks': {
      schemas.push(buildHowToSchema(entry, lang));
      schemas.push(buildArticleSchema(entry, lang, fullUrl, authorEntry));
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          {
            name: lang === 'fr' ? 'Ressources' : 'Resources',
            url: `${SITE_URL}/ressources`,
          },
          { name: 'Cookbooks', url: `${SITE_URL}/ressources/cookbooks` },
          { name: d.title_fr },
        ]),
      );
      break;
    }

    case 'livresBlancs': {
      schemas.push(buildBookSchema(entry, lang));
      schemas.push(buildArticleSchema(entry, lang, fullUrl, authorEntry));
      schemas.push(buildOfferSchema(entry, lang));
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          {
            name: lang === 'fr' ? 'Ressources' : 'Resources',
            url: `${SITE_URL}/ressources`,
          },
          {
            name: lang === 'fr' ? 'Livres blancs' : 'White papers',
            url: `${SITE_URL}/ressources/livres-blancs`,
          },
          { name: d.title_fr },
        ]),
      );
      break;
    }

    case 'veilleIA': {
      schemas.push(buildNewsArticleSchema(entry, lang, fullUrl, authorEntry));
      const citations = buildCitations(d.sources ?? []);
      if (citations.length > 0) schemas.push(...citations);
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          {
            name: lang === 'fr' ? 'Ressources' : 'Resources',
            url: `${SITE_URL}/ressources`,
          },
          { name: 'Veille IA', url: `${SITE_URL}/ressources/veille-ia` },
          { name: d.title_fr },
        ]),
      );
      break;
    }

    case 'cases':
    case 'cas': {
      schemas.push(buildArticleSchema(entry, lang, fullUrl, authorEntry));
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          {
            name: lang === 'fr' ? 'Cas clients' : 'Case studies',
            url: `${SITE_URL}/cas`,
          },
          { name: d.title_fr },
        ]),
      );
      break;
    }

    case 'secteurs': {
      schemas.push(buildServiceSchema(entry, lang));
      const faq = buildFAQPage(lang === 'fr' ? d.faq_fr : d.faq_en);
      if (faq) schemas.push(faq);
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          {
            name: lang === 'fr' ? 'Secteurs' : 'Sectors',
            url: `${SITE_URL}/secteurs`,
          },
          { name: d.title_fr },
        ]),
      );
      break;
    }

    case 'solutions': {
      schemas.push(buildServiceSchema(entry, lang));
      const faq = buildFAQPage(lang === 'fr' ? d.faq_fr : d.faq_en);
      if (faq) schemas.push(faq);
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          { name: 'Solutions', url: `${SITE_URL}/solutions` },
          { name: d.title_fr },
        ]),
      );
      break;
    }

    case 'offres': {
      schemas.push(buildServiceSchema(entry, lang));
      const faq = buildFAQPage(lang === 'fr' ? d.faq_fr : d.faq_en);
      if (faq) schemas.push(faq);
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          {
            name: lang === 'fr' ? 'Offres' : 'Services',
            url: `${SITE_URL}/offres`,
          },
          { name: d.title_fr },
        ]),
      );
      break;
    }

    default:
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          { name: d.title_fr ?? 'Page' },
        ]),
      );
  }

  return schemas;
}

export {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildOrganization,
  buildPersonFromAuthor,
  buildFAQPage,
};
