import type { APIRoute } from 'astro';
import { pages } from '@/config/pages';
import { absoluteUrl } from '@/config/site';
import { services } from '@/data/services';
import { products } from '@/data/products';
import { industries } from '@/data/industries';
import { getInsights, insightPath } from '@/lib/insights';

/**
 * Canonical sitemap built from the same flags that drive each page's robots meta,
 * so noindex pages, redirects and gated content can never leak in (v3 runbook T05).
 */
export const GET: APIRoute = async () => {
  const entries: { path: string; lastmod?: Date }[] = [
    ...Object.entries(pages)
      .filter(([, meta]) => meta.indexable)
      .map(([path]) => ({ path })),
    ...services.filter((s) => s.indexable).map((s) => ({ path: s.path })),
    ...industries.filter((i) => i.indexable).map((i) => ({ path: i.path })),
    ...products.filter((p) => p.indexable).map((p) => ({ path: `/products/${p.slug}/` })),
    ...(await getInsights())
      .filter((e) => e.data.indexable)
      .map((e) => ({ path: insightPath(e), lastmod: e.data.updatedDate ?? e.data.publishDate })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ path, lastmod }) =>
      `  <url><loc>${absoluteUrl(path)}</loc>${lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
