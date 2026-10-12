import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Insights and decision guides. v3 SEO spec: articles need a named author and
 * reviewer before they are indexable, so `indexable` defaults to false.
 */
const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(170),
    h1: z.string(),
    excerpt: z.string(),
    category: z.enum(['Decision guide', 'Planning', 'Engineering']),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Hiver Technology'),
    reviewer: z.string().optional(),
    indexable: z.boolean().default(false),
    /** Serve at a legacy root URL instead of /insights/<id>/. */
    permalink: z.string().startsWith('/').endsWith('/').optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights };
