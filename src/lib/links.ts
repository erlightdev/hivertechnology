/**
 * Resolve internal paths (from the copy deck's related-links lists) to display cards.
 */
import type { LucideIcon } from 'lucide-react';
import { BookOpen, Briefcase, Building2, Mail, Layers } from 'lucide-react';
import { services } from '@/data/services';
import { industries } from '@/data/industries';
import { products } from '@/data/products';

export type LinkCard = { href: string; name: string; summary: string; icon: LucideIcon; kind: string };

const staticCards: Record<string, Omit<LinkCard, 'href'>> = {
  '/services/': { name: 'All services', summary: 'Five service paths, from software applications to growth and automation.', icon: Layers, kind: 'Services' },
  '/portfolio/': { name: 'Selected work', summary: 'How we document projects: problem, approach, scope and verified outcomes.', icon: Briefcase, kind: 'Work' },
  '/about-us/': { name: 'About Hiver Technology', summary: 'Who we are, where we are based and how we deliver.', icon: Building2, kind: 'Company' },
  '/insights/': { name: 'Insights', summary: 'Decision guides on software, websites and digital workflows.', icon: BookOpen, kind: 'Guides' },
  '/contact/': { name: 'Contact', summary: 'Tell us what you need to build, fix or improve.', icon: Mail, kind: 'Contact' },
};

export function linkCard(href: string): LinkCard | undefined {
  const service = services.find((s) => s.path === href);
  if (service) return { href, name: service.name, summary: service.summary, icon: service.icon, kind: 'Service' };
  const industry = industries.find((i) => i.path === href);
  if (industry) return { href, name: industry.name, summary: industry.summary, icon: industry.icon, kind: 'Industry' };
  const product = products.find((p) => `/products/${p.slug}/` === href);
  if (product) return { href, name: product.name, summary: product.summary, icon: product.icon, kind: 'Product' };
  const card = staticCards[href];
  return card ? { href, ...card } : undefined;
}

/** Cards for related links, excluding the current page and the contact page (covered by the CTA). */
export const relatedCards = (paths: string[], self: string) =>
  [...new Set(paths)]
    .filter((p) => p !== self && p !== '/contact/')
    .map(linkCard)
    .filter((c): c is LinkCard => Boolean(c));

/** Map a deck secondary-CTA label to a sensible destination. */
export function secondaryHref(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('how we work')) return '#process';
  if (l.includes('work')) return '/portfolio/';
  if (l.includes('software application')) return '/services/#software';
  if (l.includes('web application')) return '/services/web-application-development/';
  if (l.includes('ecommerce')) return '/services/ecommerce-development/';
  if (l.includes('shopify')) return '/services/shopify-development/';
  if (l.includes('seo')) return '/services/seo/';
  if (l.includes('automation')) return '/services/marketing-automation/';
  if (l.includes('service')) return '/services/';
  return '#included';
}
