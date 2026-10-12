/**
 * SEO registry for fixed routes. Titles, descriptions, H1s and indexability follow
 * docs/research/v3/hiver_v3_page_seo.csv. A page marked `indexable: false` renders
 * `noindex,follow` and is left out of sitemap.xml until its evidence gate is met.
 */
export type PageMeta = {
  title: string;
  description: string;
  indexable: boolean;
};

export const pages = {
  '/': {
    title: 'Hiver Technology | Software & Digital Solutions from Nepal',
    description:
      'Nepal-based software and digital delivery for organizations with a defined product, workflow or website need. Review our confirmed capabilities and discuss your project.',
    indexable: true,
  },
  '/about-us/': {
    title: 'About Hiver Technology | Team, Process & Location',
    description:
      'Meet Hiver Technology, a Nepal-based software and digital delivery team. Learn who we are, how we work and what we can genuinely deliver.',
    indexable: true,
  },
  '/career/': {
    title: 'Careers at Hiver Technology',
    description:
      'Current Hiver Technology opportunities and the working environment. Roles are listed only while they are open and actively reviewed.',
    indexable: false,
  },
  '/services/': {
    title: 'Software Development Services | Hiver Technology',
    description:
      'Hiver Technology services across five paths: software applications, websites, ecommerce, SEO, and growth marketing and automation. Start with the business problem.',
    indexable: true,
  },
  '/industries/': {
    title: 'Industries | Hiver Technology',
    description:
      'How Hiver Technology applies software, website and automation delivery to education, healthcare, ecommerce, logistics and manufacturing workflows.',
    indexable: false,
  },
  '/products/': {
    title: 'Products | Hiver Technology',
    description:
      'Configurable operational software from Hiver Technology for schools, clinics, dental practices and HR teams in Nepal. Request a walkthrough.',
    indexable: false,
  },
  '/portfolio/': {
    title: 'Hiver Technology Portfolio | Selected Work',
    description:
      'Selected Hiver Technology work, published with client permission, accurate scope and measurable outcomes where available.',
    indexable: false,
  },
  '/insights/': {
    title: 'Insights | Software, Product and Website Decisions',
    description:
      'Practical, original guidance for choosing, planning and improving software, websites and digital workflows.',
    indexable: true,
  },
  '/international-delivery/': {
    title: 'International Software Delivery from Nepal | Hiver Technology',
    description:
      'How Hiver Technology works with international clients: time zones, communication, contracts, IP ownership, data handling and support.',
    indexable: false,
  },
  '/contact/': {
    title: 'Contact Hiver Technology | Discuss a Project',
    description:
      'Tell Hiver Technology what you are trying to build, improve or manage. An engineering lead reviews every enquiry and replies within one business day.',
    indexable: true,
  },
  '/privacy-policy/': {
    title: 'Privacy Policy | Hiver Technology',
    description:
      'How Hiver Technology collects, uses, stores and protects personal information across its website and enquiry process.',
    indexable: true,
  },
  '/terms-of-service/': {
    title: 'Terms of Service | Hiver Technology',
    description:
      'Terms that govern the use of Hiver Technology’s website and any separately agreed services or products.',
    indexable: true,
  },
  '/cookie-policy/': {
    title: 'Cookie Policy | Hiver Technology',
    description:
      'Information about cookies, local storage and analytics used on Hiver Technology’s website, and how to control them.',
    indexable: true,
  },
} satisfies Record<string, PageMeta>;

export type StaticPath = keyof typeof pages;

export const pageMeta = (path: StaticPath): PageMeta & { path: StaticPath } => ({
  ...pages[path],
  path,
});
