/** Option lists shared by the contact form (client) and the enquiry schema (server). */
export const serviceOptions = [
  { value: 'web-application', label: 'Custom web application' },
  { value: 'crm-workflow', label: 'CRM / operational workflow' },
  { value: 'website', label: 'Business or WordPress website' },
  { value: 'mobile-app', label: 'Mobile app (iOS / Android)' },
  { value: 'ui-ux', label: 'UI/UX design' },
  { value: 'ecommerce', label: 'Ecommerce / Shopify' },
  { value: 'seo', label: 'SEO / technical SEO' },
  { value: 'growth', label: 'Marketing automation / lifecycle' },
  { value: 'product', label: 'School, clinic, dental or HR software' },
  { value: 'audit', label: 'Code audit / modernization' },
] as const;

export const stageOptions = [
  { value: 'planning', label: 'Planning — starting in 1–3 months' },
  { value: 'ready', label: 'Ready — starting now' },
  { value: 'existing', label: 'Existing system needs work' },
  { value: 'exploring', label: 'Just exploring' },
] as const;

export const budgetOptions = [
  { value: 'under-5k', label: 'Under US$5,000' },
  { value: '5k-15k', label: 'US$5,000–15,000' },
  { value: '15k-40k', label: 'US$15,000–40,000' },
  { value: '40k-plus', label: 'Over US$40,000' },
  { value: 'unsure', label: 'Not sure yet' },
] as const;

export const labelFor = (opts: readonly { value: string; label: string }[], value?: string) =>
  opts.find((o) => o.value === value)?.label ?? '—';
