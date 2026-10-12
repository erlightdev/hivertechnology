/**
 * Single source of truth for company facts (NAP), navigation and SEO defaults.
 * Only verified facts belong here — see docs/research/v3 for the evidence register.
 */
export const site = {
  name: 'Hiver Technology',
  shortName: 'Hiver',
  url: 'https://hiver.com.np',
  tagline: 'Software & Digital Solutions',
  title: 'Hiver Technology | Software & Digital Solutions from Nepal',
  description:
    'Nepal-based software and digital delivery for organizations with a defined product, workflow or website need. Review our confirmed capabilities and discuss your project.',
  locale: 'en',
  ogLocale: 'en_US',
  ogImage: '/og-hiver-logo.png',
  email: 'admin@hiver.com.np',
  altEmail: 'hivertechnology@gmail.com',
  phone: '+977-9714584255',
  phoneHref: 'tel:+9779714584255',
  whatsappHref: 'https://wa.me/9779714584255',
  address: {
    locality: 'Imadole',
    region: 'Lalitpur',
    country: 'NP',
    countryName: 'Nepal',
    display: 'Imadole, Lalitpur, Nepal',
  },
  responseTime: 'one business day',
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: 'Services', href: '/services/' },
  { label: 'Industries', href: '/industries/' },
  { label: 'Products', href: '/products/' },
  { label: 'About', href: '/about-us/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'Contact', href: '/contact/' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Services',
    items: [
      { label: 'Software applications', href: '/services/#software' },
      { label: 'Websites', href: '/services/#web' },
      { label: 'Ecommerce', href: '/services/#ecommerce' },
      { label: 'SEO', href: '/services/#seo' },
      { label: 'Growth & automation', href: '/services/#growth' },
      { label: 'All services', href: '/services/' },
    ],
  },
  {
    title: 'Industries',
    items: [
      { label: 'Education', href: '/industries/education/' },
      { label: 'Healthcare', href: '/industries/healthcare/' },
      { label: 'Ecommerce', href: '/industries/ecommerce/' },
      { label: 'Logistics', href: '/industries/logistics/' },
      { label: 'Manufacturing', href: '/industries/manufacturing/' },
    ],
  },
  {
    title: 'Products',
    items: [
      { label: 'School management', href: '/products/school-management-software/' },
      { label: 'Clinic management', href: '/products/clinic-management-software/' },
      { label: 'Dental management', href: '/products/dental-management-software/' },
      { label: 'HR & payroll', href: '/products/hr-software/' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About us', href: '/about-us/' },
      { label: 'How we deliver', href: '/international-delivery/' },
      { label: 'Portfolio', href: '/portfolio/' },
      { label: 'Careers', href: '/career/' },
      { label: 'Insights', href: '/insights/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: 'Privacy', href: '/privacy-policy/' },
  { label: 'Terms', href: '/terms-of-service/' },
  { label: 'Cookies', href: '/cookie-policy/' },
];

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();
