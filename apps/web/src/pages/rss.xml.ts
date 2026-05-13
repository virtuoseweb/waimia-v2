export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const [blog, veilleIA] = await Promise.all([
    getCollection('blog'),
    getCollection('veilleIA'),
  ]);

  const items = [
    ...blog.map((entry) => ({
      title: entry.data.title_fr,
      pubDate: new Date(entry.data.publishedAt),
      description: entry.data.description_fr,
      link: `/ressources/blog/${entry.id}`,
    })),
    ...veilleIA.map((entry) => ({
      title: entry.data.title_fr,
      pubDate: new Date(entry.data.publishedAt),
      description: entry.data.description_fr,
      link: `/ressources/veille-ia/${entry.id}`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Waimia · Blog & Veille IA',
    description: "Articles, essais et veille sur l'IA appliquée aux PME.",
    site: context.site ?? 'https://waimia.com',
    items,
    customData: '<language>fr-FR</language>',
  });
}
