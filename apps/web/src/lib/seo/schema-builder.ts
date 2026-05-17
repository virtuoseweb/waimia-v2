/**
 * Schema.org JSON-LD builder centralise pour toutes les collections.
 *
 * Usage dans un loader :
 *   import { buildSchemaForPage } from '../../../lib/seo/schema-builder';
 *   const jsonLd = buildSchemaForPage(entry, 'blog', { lang, url, authorEntry });
 *   // puis pass a <Base jsonLd={jsonLd}>
 */

const SITE_URL = 'https://waimia.com';

type Lang = 'fr' | 'en';
type JsonLdObject = Record<string, unknown>;

interface BuildServiceInput {
  name: string;
  description: string;
  provider?: JsonLdObject;
  areaServed?: Array<string | JsonLdObject>;
  serviceType?: string;
  offers?: JsonLdObject | JsonLdObject[];
}

interface BuildOfferInput {
  name: string;
  price?: string | number;
  priceCurrency?: string;
  priceSpecification?: JsonLdObject;
  availability?: string;
  url?: string;
}

interface BuildArticleInput {
  headline: string;
  description: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author?: string | JsonLdObject;
  mainEntityOfPage?: string | JsonLdObject;
  publisher?: JsonLdObject;
  articleSection?: string;
  keywords?: string[];
  citation?: string[];
}

interface BuildHowToInput {
  name: string;
  steps: Array<string | { name?: string; text: string; url?: string }>;
  description?: string;
}

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
    '@id': `${SITE_URL}/#organization`,
    name: 'Waimia',
    url: SITE_URL,
    logo: `${SITE_URL}/og/default.png`,
    sameAs: ['https://www.linkedin.com/company/waimia'],
  };
}

function buildPersonFromAuthor(authorEntry: any, lang: Lang): JsonLdObject | undefined {
  if (!authorEntry) return undefined;
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

function withContext(schema: JsonLdObject): JsonLdObject {
  return { '@context': 'https://schema.org', ...schema };
}

function buildService(input: BuildServiceInput): JsonLdObject;
function buildService(name: string, description: string, provider?: JsonLdObject, areaServed?: Array<string | JsonLdObject>): JsonLdObject;
function buildService(
  inputOrName: BuildServiceInput | string,
  description?: string,
  provider?: JsonLdObject,
  areaServed?: Array<string | JsonLdObject>,
): JsonLdObject {
  const input =
    typeof inputOrName === 'string'
      ? { name: inputOrName, description: description ?? '', provider, areaServed }
      : inputOrName;

  return withContext({
    '@type': 'Service',
    name: input.name,
    description: input.description,
    provider: input.provider ?? { '@id': `${SITE_URL}/#organization` },
    areaServed: input.areaServed ?? ['FR', 'CH', 'BE', 'LU'],
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
    ...(input.offers ? { offers: input.offers } : {}),
  });
}

function buildOffer(input: BuildOfferInput): JsonLdObject;
function buildOffer(price: string | number, priceCurrency: string, name: string): JsonLdObject;
function buildOffer(
  inputOrPrice: BuildOfferInput | string | number,
  priceCurrency?: string,
  name?: string,
): JsonLdObject {
  const input =
    typeof inputOrPrice === 'object'
      ? inputOrPrice
      : { price: inputOrPrice, priceCurrency: priceCurrency ?? 'EUR', name: name ?? 'Waimia service' };

  return withContext({
    '@type': 'Offer',
    name: input.name,
    ...(input.price !== undefined ? { price: input.price } : {}),
    priceCurrency: input.priceCurrency ?? 'EUR',
    ...(input.priceSpecification ? { priceSpecification: input.priceSpecification } : {}),
    availability: input.availability ?? 'https://schema.org/InStock',
    ...(input.url ? { url: input.url } : {}),
  });
}

function buildArticle(input: BuildArticleInput): JsonLdObject;
function buildArticle(
  headline: string,
  description: string,
  image: string | string[] | undefined,
  datePublished: string,
  author: string | JsonLdObject,
): JsonLdObject;
function buildArticle(
  inputOrHeadline: BuildArticleInput | string,
  description?: string,
  image?: string | string[],
  datePublished?: string,
  author?: string | JsonLdObject,
): JsonLdObject {
  const input =
    typeof inputOrHeadline === 'string'
      ? {
          headline: inputOrHeadline,
          description: description ?? '',
          image,
          datePublished: datePublished ?? new Date().toISOString().split('T')[0],
          author,
        }
      : inputOrHeadline;
  const authorSchema =
    typeof input.author === 'string'
      ? { '@type': 'Person', name: input.author }
      : input.author;

  return withContext({
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    ...(input.image ? { image: Array.isArray(input.image) ? input.image : [input.image] } : {}),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(authorSchema ? { author: authorSchema } : {}),
    publisher:
      input.publisher ??
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Waimia',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/og/default.png` },
      },
    ...(input.mainEntityOfPage
      ? {
          mainEntityOfPage:
            typeof input.mainEntityOfPage === 'string'
              ? { '@type': 'WebPage', '@id': input.mainEntityOfPage }
              : input.mainEntityOfPage,
        }
      : {}),
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    ...(input.keywords && input.keywords.length > 0 ? { keywords: input.keywords } : {}),
    ...(input.citation && input.citation.length > 0 ? { citation: input.citation } : {}),
  });
}

function buildHowTo(input: BuildHowToInput): JsonLdObject;
function buildHowTo(name: string, steps: BuildHowToInput['steps']): JsonLdObject;
function buildHowTo(inputOrName: BuildHowToInput | string, steps?: BuildHowToInput['steps']): JsonLdObject {
  const input = typeof inputOrName === 'string' ? { name: inputOrName, steps: steps ?? [] } : inputOrName;

  return withContext({
    '@type': 'HowTo',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    step: input.steps.map((step, index) => {
      if (typeof step === 'string') {
        return { '@type': 'HowToStep', position: index + 1, text: step };
      }
      return {
        '@type': 'HowToStep',
        position: index + 1,
        ...(step.name ? { name: step.name } : {}),
        text: step.text,
        ...(step.url ? { url: step.url } : {}),
      };
    }),
  });
}

function buildCollectionPage(name: string, description: string, items: Array<string | JsonLdObject> = []): JsonLdObject {
  return withContext({
    '@type': 'CollectionPage',
    name,
    description,
    ...(items.length > 0
      ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item,
            })),
          },
        }
      : {}),
  });
}

function buildArticleSchema(entry: any, lang: Lang, url: string, authorEntry?: any) {
  const d = entry.data;

  return buildArticle({
    headline: lang === 'fr' ? d.title_fr : d.title_en,
    description: lang === 'fr' ? d.description_fr : d.description_en,
    datePublished: new Date(d.publishedAt).toISOString().split('T')[0],
    dateModified: d.updatedAt ? new Date(d.updatedAt).toISOString().split('T')[0] : undefined,
    author: authorEntry ? buildPersonFromAuthor(authorEntry, lang) ?? undefined : undefined,
    mainEntityOfPage: url,
    image: d.heroImage ? `${SITE_URL}${d.heroImage}` : undefined,
    articleSection: lang === 'fr' ? d.category_fr ?? d.category : d.category_en ?? d.category,
    keywords: d.tags,
    ...(d.sources && d.sources.length > 0
      ? {
          citation: d.sources.map((s: any) => s.url),
        }
      : {}),
  });
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
  return buildCollectionPage(name, description);
}

function buildCourseSchema(entry: any, lang: Lang): JsonLdObject {
  const d = entry.data;
  const title = lang === 'fr' ? d.title_fr : d.title_en;
  const description = lang === 'fr' ? d.description_fr : d.description_en;

  const provider = { '@type': 'Organization', name: 'Waimia', url: SITE_URL };

  if (d.course_type === 'atelier') {
    const ad = d;
    return withContext({
      '@type': 'Event',
      name: title,
      description,
      organizer: provider,
      location: ad.format === 'live-online'
        ? { '@type': 'VirtualLocation' }
        : { '@type': 'Place', name: `Live ${ad.format.replace('live-', '')}` },
      ...(ad.scheduled_at ? { startDate: new Date(ad.scheduled_at).toISOString() } : {}),
      eventAttendanceMode: ad.format === 'live-online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
      ...(ad.pricing_eur != null ? {
        offers: { '@type': 'Offer', price: ad.pricing_eur, priceCurrency: 'EUR' },
      } : {}),
      ...(ad.seats_remaining != null ? { remainingAttendeeCapacity: ad.seats_remaining } : {}),
    });
  }

  const levelField = d.course_type === 'certification' ? d.certification_level : d.level;
  const durationHours = d.duration_hours;
  const pricing = d.course_type === 'formation'
    ? (d.pricing?.one_time_eur ?? d.pricing?.subscription_eur)
    : d.pricing_eur;

  return withContext({
    '@type': 'Course',
    name: title,
    description,
    provider,
    ...(levelField ? { educationalLevel: levelField } : {}),
    ...(durationHours ? { timeRequired: `PT${durationHours}H` } : {}),
    ...(pricing != null ? {
      offers: { '@type': 'Offer', price: pricing, priceCurrency: 'EUR' },
    } : {}),
  });
}

function buildProductSchema(entry: any, lang: Lang): JsonLdObject {
  const d = entry.data;
  const name = lang === 'fr' ? d.title_fr : d.title_en;
  const description = lang === 'fr' ? d.description_fr : d.description_en;

  if (d.commerce_type === 'product') {
    return withContext({
      '@type': 'Product',
      name,
      description,
      sku: d.sku,
      offers: {
        '@type': 'Offer',
        price: d.price_eur,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/commerce/product/${entry.id}`,
      },
    });
  }

  const priceSpecs: JsonLdObject[] = [
    {
      '@type': 'UnitPriceSpecification',
      price: d.price_eur_monthly,
      priceCurrency: 'EUR',
      billingIncrement: 1,
      unitCode: 'MON',
    },
  ];
  if (d.price_eur_yearly) {
    priceSpecs.push({
      '@type': 'UnitPriceSpecification',
      price: d.price_eur_yearly,
      priceCurrency: 'EUR',
      billingIncrement: 1,
      unitCode: 'ANN',
    });
  }

  return withContext({
    '@type': 'Service',
    name,
    description,
    provider: { '@type': 'Organization', name: 'Waimia', url: SITE_URL },
    offers: {
      '@type': 'Offer',
      price: d.price_eur_monthly,
      priceCurrency: 'EUR',
      priceSpecification: priceSpecs,
    },
  });
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

    case 'courses': {
      schemas.push(buildCourseSchema(entry, lang));
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          { name: lang === 'fr' ? 'École' : 'Academy', url: `${SITE_URL}/ecole` },
          { name: d.course_type },
          { name: lang === 'fr' ? d.title_fr : d.title_en },
        ]),
      );
      break;
    }

    case 'commerce': {
      schemas.push(buildProductSchema(entry, lang));
      schemas.push(
        buildBreadcrumbList([
          { name: lang === 'fr' ? 'Accueil' : 'Home', url: SITE_URL },
          { name: 'Commerce', url: `${SITE_URL}/commerce` },
          { name: d.commerce_type, url: `${SITE_URL}/commerce/${d.commerce_type}` },
          { name: lang === 'fr' ? d.title_fr : d.title_en },
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
  buildArticle,
  buildCollectionPage,
  buildCollectionPageSchema,
  buildCourseSchema,
  buildHowTo,
  buildOrganization,
  buildOffer,
  buildPersonFromAuthor,
  buildProductSchema,
  buildFAQPage,
  buildService,
};
