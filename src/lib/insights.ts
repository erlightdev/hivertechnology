import { getCollection, type CollectionEntry } from 'astro:content';

export type Insight = CollectionEntry<'insights'>;

export const insightPath = (entry: Insight) => entry.data.permalink ?? `/insights/${entry.id}/`;

export const getInsights = async () =>
  (await getCollection('insights', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

export const readingMinutes = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 220));

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
