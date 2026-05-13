export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');

  const items = blog
    .sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime())
    .map((entry) => ({
      title: entry.data.title_fr,
      pubDate: new Date(entry.data.publishedAt),
      description: entry.data.description_fr,
      link: `/ressources/blog/${entry.id}`,
    }));

  return rss({
    title: 'Waimia · Blog',
    description: "Essais et articles sur l'IA appliquée aux PME B2B.",
    site: context.site ?? 'https://waimia.com',
    items,
    customData: '<language>fr-FR</language>',
  });
}
