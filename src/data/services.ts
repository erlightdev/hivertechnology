/**
 * Services = copy from the v2 Page Copy Deck (src/data/deck.ts) + Hiver-specific extras,
 * organized into the five service paths used by the services hub and navigation.
 *
 * Indexing follows the v3 capability gate (docs/research/v3): service pages render
 * `noindex, follow` and stay out of sitemap.xml until `indexable` is set to true after
 * the capability and proof review for that service.
 */
import type { LucideIcon } from 'lucide-react';
import {
  AppWindow,
  ArrowRightLeft,
  Gauge,
  Globe,
  LayoutTemplate,
  Mail,
  Megaphone,
  PenTool,
  Search,
  SearchCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react';
import { deckPage, type DeckPage, type DeckSection } from './deck';

export type Faq = { q: string; a: string };

export type ServiceGroupId = 'software' | 'web' | 'ecommerce' | 'seo' | 'growth';

/**
 * - `live`: shown on the current Hiver site (v2 live verification, 14 Aug 2026).
 * - `gated`: capability not yet evidenced per the v2/v3 capability gate; confirm before indexing.
 */
export type CapabilityStatus = 'live' | 'gated';

export type Service = DeckPage & {
  slug: string;
  group: ServiceGroupId;
  icon: LucideIcon;
  /** Card summary for hubs and related links. */
  summary: string;
  tag: string;
  status: CapabilityStatus;
  indexable: boolean;
  /** Optional detail cards for the buyer-problem section. */
  problems?: DeckSection[];
  goodFit?: string[];
  notFit?: string[];
  stack?: string[];
};

type Extras = Omit<Service, keyof DeckPage | 'slug'> & {
  /** v3 SEO spec overrides for routes it defines. */
  title?: string;
  description?: string;
  extraFaqs?: Faq[];
};

const extras: Record<string, Extras> = {
  'web-application-development': {
    group: 'software',
    icon: AppWindow,
    summary: 'SaaS products, role-based client portals and data dashboards built on typed APIs and relational databases.',
    tag: 'React · Next.js · Node · Postgres',
    status: 'live',
    indexable: false,
    title: 'Custom Web Application Development | Hiver Technology',
    description:
      'Custom web applications for defined workflows, portals and operational systems, planned and engineered by a Nepal-based Hiver team.',
    problems: [
      { heading: 'Workarounds everywhere', body: 'Teams copy data between tools, rebuild the same report every week and rely on one person who knows how it all fits together.' },
      { heading: 'Off-the-shelf misfit', body: 'Subscription software covers most of the process, and the remaining part is where the business actually differentiates.' },
      { heading: 'Fragile first versions', body: 'An earlier build works, but without tests, migrations or documentation nobody wants to change it.' },
    ],
    goodFit: [
      'You can describe the workflow, the users and the decisions the software must support',
      'You want to own the code and infrastructure outright',
      'You are ready to review progress every sprint',
    ],
    notFit: [
      'An unvalidated idea that needs market research before any engineering',
      'A fixed price without a discovery phase for a large, undefined scope',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    extraFaqs: [
      {
        q: 'Can you take over an existing application?',
        a: 'Yes. We begin with a paid technical audit covering architecture, database performance, security and code quality, then recommend incremental refactoring or an isolated rewrite.',
      },
    ],
  },
  'crm-web-applications': {
    group: 'software',
    icon: Workflow,
    summary: 'Tailored systems for sales tracking, onboarding, dispatch and reporting where off-the-shelf CRM does not fit your pipeline.',
    tag: 'Roles · Pipelines · Reporting',
    status: 'live',
    indexable: false,
    title: 'CRM Web Application Development | Hiver Technology',
    description:
      'CRM web applications for organizations that need a clearer lead, customer or operational workflow, scoped from your real pipeline.',
    problems: [
      { heading: 'Pipeline in five places', body: 'Leads live in email, spreadsheets and chat; follow-ups depend on memory instead of the system.' },
      { heading: 'Licences for unused features', body: 'Per-seat pricing grows while the team uses a fraction of the platform and still exports to Excel.' },
      { heading: 'No single source of truth', body: 'Managers cannot see stage, owner and next action without asking someone.' },
    ],
    goodFit: [
      'Your process has steps a standard CRM handles poorly',
      'You need ownership of customer data and the logic around it',
      'You want reports that match how you actually measure the business',
    ],
    notFit: ['A standard sales pipeline that an existing CRM platform already fits well'],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  'mobile-app-development': {
    group: 'software',
    icon: Smartphone,
    summary: 'Cross-platform iOS and Android apps from one codebase, with offline sync, secure sign-in and clean backend integrations.',
    tag: 'Flutter · iOS · Android',
    status: 'live',
    indexable: false,
    title: 'Mobile App Development | Hiver Technology',
    description:
      'Mobile application development for a defined product or workflow, built cross-platform for iOS and Android with a shared backend.',
    goodFit: [
      'Users need device features, offline access or push notifications',
      'You already have, or plan, a web platform the app should share',
    ],
    notFit: ['Content that would work equally well as a fast mobile website'],
    stack: ['Flutter', 'Node.js', 'PostgreSQL'],
  },
  'ui-ux-design': {
    group: 'software',
    icon: PenTool,
    summary: 'User flows, interactive Figma prototypes, design tokens and developer-ready handoff for web and mobile products.',
    tag: 'Figma · Tokens · Handoff',
    status: 'live',
    indexable: false,
    title: 'UX Design for Web & Mobile Products | Hiver Technology',
    description:
      'UX and interface design for web, mobile and workflow products: user flows, prototypes, design systems and developer handoff.',
    goodFit: ['You are planning a new product or major feature', 'Your existing product feels inconsistent or hard to use'],
    notFit: ['Brand identity or logo design as a standalone project'],
    stack: ['Figma', 'Tailwind CSS', 'React'],
  },
  'website-design-development': {
    group: 'web',
    icon: Globe,
    summary: 'Fast, accessible business websites with structured metadata, a maintainable CMS and Core Web Vitals treated as a requirement.',
    tag: 'Performance · SEO · Accessibility',
    status: 'live',
    indexable: false,
    title: 'Business Website Design & Development | Hiver Technology',
    description:
      'Business websites designed and developed around a clear audience, message, conversion path and maintainable CMS.',
    goodFit: [
      'You are replacing a slow or outdated site',
      'You want measurable enquiries, not only a visual refresh',
      'You need a URL-preserving migration that protects existing search traffic',
    ],
    notFit: ['Bulk template sites or link-scheme SEO packages'],
    stack: ['Astro', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    extraFaqs: [
      {
        q: 'Will we lose search rankings when we redesign?',
        a: 'Not if the migration is planned. We inventory current URLs, preserve paths where possible, map one-hop 301 redirects for anything that moves and verify canonicals and sitemaps before launch.',
      },
    ],
  },
  'wordpress-development': {
    group: 'web',
    icon: LayoutTemplate,
    summary: 'WordPress builds and rebuilds with lean themes, editor-friendly content blocks and a clear maintenance plan.',
    tag: 'WordPress · Gutenberg · Performance',
    status: 'gated',
    indexable: false,
  },
  'ecommerce-development': {
    group: 'ecommerce',
    icon: ShoppingCart,
    summary: 'Ecommerce planning, builds and improvements focused on product discovery, checkout and operations.',
    tag: 'Catalog · Checkout · Operations',
    status: 'gated',
    indexable: false,
  },
  'shopify-development': {
    group: 'ecommerce',
    icon: ShoppingBag,
    summary: 'Shopify store setup, theme development and app integrations built around how your customers buy.',
    tag: 'Shopify · Themes · Apps',
    status: 'gated',
    indexable: false,
  },
  'shopify-migration': {
    group: 'ecommerce',
    icon: ArrowRightLeft,
    summary: 'Platform migrations to Shopify with data mapping, URL redirects and launch checks that protect revenue and search.',
    tag: 'Data · Redirects · QA',
    status: 'gated',
    indexable: false,
  },
  'shopify-seo': {
    group: 'ecommerce',
    icon: SearchCheck,
    summary: 'Technical and on-page SEO for Shopify: collections, product content, structured data and site speed.',
    tag: 'Collections · Schema · Speed',
    status: 'gated',
    indexable: false,
  },
  seo: {
    group: 'seo',
    icon: Search,
    summary: 'SEO foundations for websites and ecommerce: research, architecture, content and measurement without ranking promises.',
    tag: 'Research · Content · Reporting',
    status: 'gated',
    indexable: false,
  },
  'technical-seo': {
    group: 'seo',
    icon: Gauge,
    summary: 'Crawlability, indexing, Core Web Vitals, structured data and migration audits with a prioritized fix list.',
    tag: 'Crawl · Index · Vitals',
    status: 'gated',
    indexable: false,
  },
  'growth-marketing': {
    group: 'growth',
    icon: TrendingUp,
    summary: 'Connected acquisition, conversion and retention work with measurement in place from the start.',
    tag: 'Acquisition · Conversion · Retention',
    status: 'gated',
    indexable: false,
  },
  'marketing-automation': {
    group: 'growth',
    icon: Zap,
    summary: 'Automated follow-up, lead routing and CRM workflows that reduce manual work and missed opportunities.',
    tag: 'Workflows · CRM · Routing',
    status: 'gated',
    indexable: false,
  },
  'email-lifecycle-marketing': {
    group: 'growth',
    icon: Mail,
    summary: 'Welcome, onboarding, re-engagement and retention journeys built on consented, segmented data.',
    tag: 'Lifecycle · Segments · Consent',
    status: 'gated',
    indexable: false,
  },
  'digital-marketing': {
    group: 'growth',
    icon: Megaphone,
    summary: 'Digital marketing strategy tied to a measurable business goal, channel by channel.',
    tag: 'Strategy · Channels · Measurement',
    status: 'live',
    indexable: false,
    title: 'Digital Marketing | Hiver Technology',
  },
};

export const services: Service[] = Object.entries(extras).map(([slug, x]) => {
  const page = deckPage(`/services/${slug}/`);
  const { extraFaqs = [], title, description, ...rest } = x;
  return {
    ...page,
    ...rest,
    slug,
    title: title ?? page.title,
    description: description ?? page.description,
    faqs: [...page.faqs, ...extraFaqs],
  };
});

export type ServiceGroup = {
  id: ServiceGroupId;
  name: string;
  eyebrow: string;
  intro: string;
  /** One plain-language line for compact cards (home page). */
  short: string;
  services: Service[];
};

const groupCopy: Record<ServiceGroupId, Omit<ServiceGroup, 'id' | 'services'>> = {
  software: {
    name: 'Software applications',
    eyebrow: deckPage('group:software').eyebrow,
    intro: deckPage('group:software').intro,
    short: 'Custom tools for your team and customers — portals, dashboards, CRMs and mobile apps.',
  },
  web: {
    name: 'Websites',
    eyebrow: 'Websites that lead to a next step',
    intro: 'Business websites and WordPress builds planned around audience, message, conversion path and a CMS your team can run.',
    short: 'Fast, clear business websites that your team can update.',
  },
  ecommerce: {
    name: 'Ecommerce',
    eyebrow: deckPage('/services/ecommerce-development/').eyebrow,
    intro: deckPage('/services/ecommerce-development/').intro,
    short: 'Online stores that are easy to browse and easy to buy from.',
  },
  seo: {
    name: 'SEO',
    eyebrow: deckPage('/services/seo/').eyebrow,
    intro: deckPage('/services/seo/').intro,
    short: 'Help the right people find your business on Google.',
  },
  growth: {
    name: 'Growth & automation',
    eyebrow: deckPage('/services/growth-marketing/').eyebrow,
    intro: deckPage('/services/growth-marketing/').intro,
    short: 'Automatic follow-ups and email journeys that save your team time.',
  },
};

export const serviceGroups: ServiceGroup[] = (Object.keys(groupCopy) as ServiceGroupId[]).map((id) => ({
  id,
  ...groupCopy[id],
  services: services.filter((s) => s.group === id),
}));

/** Copy for the software-applications path (deck page without its own route). */
export const softwareGroupPage = deckPage('group:software');

export const getService = (slug: string) => services.find((s) => s.slug === slug);
