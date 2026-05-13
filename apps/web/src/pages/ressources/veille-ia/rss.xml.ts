export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const veilleIA = await getCollection('veilleIA');

  const items = veilleIA
    .sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime())
    .map((entry) => ({
      title: entry.data.title_fr,
      pubDate: new Date(entry.data.publishedAt),
      description: entry.data.description_fr,
      link: `/ressources/veille-ia/${entry.id}`,
    }));

  return rss({
    title: 'Waimia · Veille IA',
    description: "Notes courtes de veille sur l'IA appliquée aux PME.",
    site: context.site ?? 'https://waimia.com',
    items,
    customData: '<language>fr-FR</language>',
  });
}
