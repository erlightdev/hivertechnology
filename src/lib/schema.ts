/**
 * JSON-LD builders following docs/research/v3/hiver_v3_schema_plan.json:
 * no fake offices, sameAs profiles, ratings, reviews or pricing.
 */
import { absoluteUrl, site } from '@/config/site';
import type { Faq } from '@/data/services';

type Json = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export const organization = (): Json => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: site.name,
  url: `${site.url}/`,
  logo: absoluteUrl('/icon-512.png'),
  email: site.email,
  telephone: site.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: `${site.address.locality}, ${site.address.region}`,
    addressCountry: site.address.country,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: site.email,
    telephone: site.phone,
    availableLanguage: ['en', 'ne'],
  },
});

export const website = (): Json => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${site.url}/`,
  name: site.name,
  publisher: { '@id': ORG_ID },
  inLanguage: site.locale,
});

export const webPage = (path: string, name: string, description: string): Json => ({
  '@type': 'WebPage',
  '@id': `${absoluteUrl(path)}#webpage`,
  url: absoluteUrl(path),
  name,
  description,
  isPartOf: { '@id': WEBSITE_ID },
  inLanguage: site.locale,
});

export type Crumb = { name: string; path: string };

export const breadcrumbs = (crumbs: Crumb[]): Json => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

export const faqPage = (faqs: Faq[]): Json => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const service = (path: string, name: string, description: string): Json => ({
  '@type': 'Service',
  name,
  description,
  url: absoluteUrl(path),
  provider: { '@id': ORG_ID },
  areaServed: 'Worldwide',
});

export const softwareApplication = (path: string, name: string, description: string, category: string): Json => ({
  '@type': 'SoftwareApplication',
  name,
  description,
  url: absoluteUrl(path),
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: category,
  operatingSystem: 'Web',
  publisher: { '@id': ORG_ID },
});

export const article = (opts: {
  path: string;
  title: string;
  description: string;
  published: Date;
  modified?: Date;
  author: string;
}): Json => ({
  '@type': 'BlogPosting',
  headline: opts.title,
  description: opts.description,
  url: absoluteUrl(opts.path),
  mainEntityOfPage: absoluteUrl(opts.path),
  datePublished: opts.published.toISOString(),
  dateModified: (opts.modified ?? opts.published).toISOString(),
  author: { '@type': opts.author === site.name ? 'Organization' : 'Person', name: opts.author },
  publisher: { '@id': ORG_ID },
  image: absoluteUrl(site.ogImage),
});

/** Wrap nodes in a single @graph document. */
export const graph = (...nodes: Json[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
});
