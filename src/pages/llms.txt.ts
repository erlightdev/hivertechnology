import type { APIRoute } from 'astro';
import { pages } from '@/config/pages';
import { absoluteUrl, site } from '@/config/site';
import { serviceGroups } from '@/data/services';
import { industries } from '@/data/industries';
import { products } from '@/data/products';
import { getInsights, insightPath } from '@/lib/insights';

/**
 * llms.txt — a plain summary for AI assistants and answer engines (v2 AI-search plan:
 * consistent entity facts, crawlable links, extractable answers). Lists indexable pages only,
 * so it never contradicts robots meta or the sitemap.
 */
export const GET: APIRoute = async () => {
  const line = (path: string, name: string, note?: string) => `- [${name}](${absoluteUrl(path)})${note ? `: ${note}` : ''}`;
  const services = serviceGroups.flatMap((g) => g.services).filter((s) => s.indexable);
  const insights = (await getInsights()).filter((e) => e.data.indexable);

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is a software company registered in Nepal, based in ${site.address.display}. Contact: ${site.email}, ${site.phone}. Clients own the code, designs and credentials delivered to them. The company does not claim overseas offices, awards or certifications.`,
    '',
    '## Company',
    ...(['/', '/about-us/', '/services/', '/contact/'] as const)
      .filter((p) => pages[p].indexable)
      .map((p) => line(p, pages[p].title, pages[p].description)),
    '',
    '## Service paths',
    ...serviceGroups.map((g) => `- ${g.name}: ${g.services.map((s) => s.name).join(', ')}`),
    ...services.map((s) => line(s.path, s.name, s.summary)),
    '',
    '## Products',
    ...products.map((p) => `- ${p.name}: ${p.summary}`),
    '',
    '## Industries',
    ...industries.map((i) => `- ${i.name}: ${i.summary}`),
    '',
    '## Guides',
    ...insights.map((e) => line(insightPath(e), e.data.h1, e.data.description)),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
