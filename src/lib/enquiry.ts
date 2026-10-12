/**
 * Contact enquiry contract shared by the form island and the API route.
 * Keep option values stable: they are stored in the outgoing email and analytics.
 */
import { z } from 'astro/zod';
import { budgetOptions, serviceOptions, stageOptions } from './enquiry-options';

export { budgetOptions, labelFor, serviceOptions, stageOptions } from './enquiry-options';

const values = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]];

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.email('Please enter a valid email address.').trim().max(200),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().max(160).optional().default(''),
  website_url: z.string().trim().max(200).optional().default(''),
  country: z.string().trim().max(80).optional().default(''),
  service: z.enum(values(serviceOptions), { error: 'Please choose a project type.' }),
  // Radix selects submit "" when nothing is chosen; treat that as not provided.
  stage: z.preprocess((v) => (v === '' ? undefined : v), z.enum(values(stageOptions)).optional()),
  budget: z.preprocess((v) => (v === '' ? undefined : v), z.enum(values(budgetOptions)).optional()),
  message: z
    .string()
    .trim()
    .min(20, 'Please add a little more detail (at least 20 characters).')
    .max(5000, 'Please keep the summary under 5,000 characters.'),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional().default(''),
  // Render timestamp, used to reject instant bot submissions.
  startedAt: z.coerce.number().optional(),
});

export type Enquiry = z.infer<typeof enquirySchema>;
