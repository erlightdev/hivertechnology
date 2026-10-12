import type { ImageMetadata } from 'astro';
import type { Faq } from './services';

import react from '@/assets/tech/react.svg';
import nextjs from '@/assets/tech/nextjs.svg';
import typescript from '@/assets/tech/typescript.svg';
import nodejs from '@/assets/tech/nodejs.svg';
import postgresql from '@/assets/tech/postgresql.svg';
import tailwindcss from '@/assets/tech/tailwind-css.svg';
import flutter from '@/assets/tech/flutter.svg';
import python from '@/assets/tech/python.svg';
import docker from '@/assets/tech/docker.svg';
import figma from '@/assets/tech/figma.svg';
import aws from '@/assets/tech/amazon-web-services.svg';
import awsDark from '@/assets/tech/amazon-web-services-dark.svg';
import git from '@/assets/tech/git.svg';
import astro from '@/assets/tech/astro.svg';
import wordpress from '@/assets/tech/wordpress.svg';
import shopify from '@/assets/tech/shopify.svg';
import searchConsole from '@/assets/tech/google-search-console.svg';
import analytics from '@/assets/tech/google-analytics.svg';
import mailchimp from '@/assets/tech/mailchimp.svg';
import zapier from '@/assets/tech/zapier.svg';

export const problems = [
  {
    id: 'scope',
    title: 'Projects that keep growing',
    body: 'A rough plan turns a four-week job into nine weeks — and you pay for every extra hour.',
    fix: 'We agree a written plan and fixed-price stages before we start.',
  },
  {
    id: 'code',
    title: 'Software nobody can fix',
    body: 'Rushed work with no checks or notes means even small changes become risky and expensive.',
    fix: 'Testing and clear documentation are included in every project.',
  },
  {
    id: 'relay',
    title: 'Talking through middlemen',
    body: 'Your message passes through sales staff and managers before it reaches the person doing the work.',
    fix: 'You talk directly to the developer building your product.',
  },
] as const;

export const principles = [
  { title: 'Specification before code', body: 'A written scope, data model and acceptance criteria are agreed before the first sprint.' },
  { title: 'Direct engineering contact', body: 'You work with the technical lead on your project, not an account manager relaying messages.' },
  { title: 'You own everything', body: 'Code, designs, documentation and credentials transfer to you on completion of milestone payments.' },
  { title: 'No inflated claims', body: 'We publish only capabilities, work and results we can evidence. If something is not a fit, we say so.' },
];

export const process = [
  {
    step: '01',
    title: 'Understand your needs',
    body: 'We learn how your business works, who will use the software and what it must do — then write it down so everyone agrees before anything is built.',
    outcome: 'A written plan and price',
  },
  {
    step: '02',
    title: 'Build in small steps',
    body: 'We build a little at a time and show you working progress every two weeks, so you can give feedback early instead of waiting until the end.',
    outcome: 'A live demo every two weeks',
  },
  {
    step: '03',
    title: 'Check everything',
    body: 'We test that it works properly, looks right on phones and computers, loads quickly and keeps your information safe.',
    outcome: 'A tested, ready-to-use system',
  },
  {
    step: '04',
    title: 'Launch and hand over',
    body: 'We put it live without disrupting your business, train your team and hand over everything we built — it all belongs to you.',
    outcome: 'Full ownership and training',
  },
];

export const homeFaqs: Faq[] = [
  {
    q: 'What does Hiver Technology do?',
    a: 'We build custom software, websites and mobile apps, and help with online stores, Google visibility and automated follow-ups. We start with your problem, then suggest the right fix.',
  },
  {
    q: 'How do we start a project?',
    a: 'Tell us what you want to achieve, what you use today, your timeline and rough budget. We reply with a clear next step — usually a short planning session.',
  },
  {
    q: 'Where is Hiver Technology based?',
    a: 'In Imadole, Lalitpur, Nepal. We are a Nepal-registered company and we do not claim offices in other countries.',
  },
  {
    q: 'Who owns the code and intellectual property?',
    a: 'You do — 100%. Once the agreed payments are complete, we hand over all code, designs, documents and account logins.',
  },
  {
    q: 'How do you work across time zones?',
    a: 'We agree shared working hours, send written updates and record our demos so you can watch them any time.',
  },
  {
    q: 'Can you fix or improve software we already have?',
    a: 'Yes. We start with a paid review of how it is built, how fast and secure it is, and the quality of the code. Then we recommend fixing it step by step or rebuilding the weak parts.',
  },
  {
    q: 'Will you sign an NDA?',
    a: 'Yes. We are happy to sign a non-disclosure agreement before you share any details.',
  },
];

/** Logos vendored from thesvg.org — see src/assets/tech/README.md. */
export type Tech = { name: string; role: string; logo: ImageMetadata; logoDark?: ImageMetadata };

export const techStack: Tech[] = [
  { name: 'React', role: 'Web interfaces', logo: react },
  { name: 'Next.js', role: 'Websites & web apps', logo: nextjs },
  { name: 'TypeScript', role: 'Fewer bugs', logo: typescript },
  { name: 'Node.js', role: 'Server side', logo: nodejs },
  { name: 'PostgreSQL', role: 'Databases', logo: postgresql },
  { name: 'Tailwind CSS', role: 'Styling', logo: tailwindcss },
  { name: 'Flutter', role: 'Mobile apps', logo: flutter },
  { name: 'Python', role: 'Data & automation', logo: python },
  { name: 'Docker', role: 'Reliable deployment', logo: docker },
  { name: 'Figma', role: 'Design', logo: figma },
  { name: 'AWS', role: 'Cloud hosting', logo: aws, logoDark: awsDark },
  { name: 'Git', role: 'Version history', logo: git },
];

/** Extra tools shown only in service card footers and stack lists (not the home tools grid). */
export const extraTools: Tech[] = [
  { name: 'Astro', role: 'Fast websites', logo: astro },
  { name: 'WordPress', role: 'Websites', logo: wordpress },
  { name: 'Shopify', role: 'Online stores', logo: shopify },
  { name: 'Google Search Console', role: 'Search visibility', logo: searchConsole },
  { name: 'Google Analytics', role: 'Measurement', logo: analytics },
  { name: 'Mailchimp', role: 'Email', logo: mailchimp },
  { name: 'Zapier', role: 'Automation', logo: zapier },
];

/** Look up a stack logo by technology name (as used in service `stack` lists). */
export const techByName = (name: string) => [...techStack, ...extraTools].find((t) => t.name === name);
