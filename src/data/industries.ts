/**
 * Industry pages from the v2 Page Copy Deck. The v2 product decisions defer generic
 * sector pages until a case study or product supports them, so every industry page is
 * `noindex, follow` and outside sitemap.xml until `indexable` is set after review.
 */
import type { LucideIcon } from 'lucide-react';
import { Factory, GraduationCap, HeartPulse, ShoppingCart, Truck } from 'lucide-react';
import { deckPage, type DeckPage } from './deck';

export type Industry = DeckPage & {
  slug: string;
  icon: LucideIcon;
  summary: string;
  /** Related product slugs (src/data/products.ts). */
  products: string[];
  indexable: boolean;
};

const meta: Record<string, Omit<Industry, keyof DeckPage | 'slug'>> = {
  education: {
    icon: GraduationCap,
    summary: 'Websites, admissions workflows, portals and communication journeys for schools and colleges.',
    products: ['school-management-software'],
    indexable: false,
  },
  healthcare: {
    icon: HeartPulse,
    summary: 'Patient-facing websites, appointment workflows and clinic operations software.',
    products: ['clinic-management-software', 'dental-management-software'],
    indexable: false,
  },
  ecommerce: {
    icon: ShoppingCart,
    summary: 'Store builds, migrations, search visibility and lifecycle automation for online retailers.',
    products: [],
    indexable: false,
  },
  logistics: {
    icon: Truck,
    summary: 'Booking, tracking, dispatch and customer-update workflows for logistics operators.',
    products: [],
    indexable: false,
  },
  manufacturing: {
    icon: Factory,
    summary: 'Product-information websites, customer portals, enquiry management and internal workflow tools for manufacturers.',
    products: [],
    indexable: false,
  },
};

export const industries: Industry[] = Object.entries(meta).map(([slug, m]) => ({
  ...deckPage(`/industries/${slug}/`),
  ...m,
  slug,
}));

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
