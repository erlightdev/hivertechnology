/**
 * Typed access to the v2 Page Copy Deck, converted by scripts/import-copy-deck.py
 * into src/data/generated/copy-deck.json. Edit the deck, re-run the script, rebuild.
 */
import deck from './generated/copy-deck.json';
import type { Faq } from './services';

export type DeckSection = { heading: string; body: string };

export type DeckPage = {
  name: string;
  deckPath: string;
  /** Path on this site (v3 URL architecture). `group:*` marks group copy without its own page. */
  path: string;
  priority: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intent: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  problem: DeckSection | null;
  approach: DeckSection | null;
  included: string[];
  steps: string[];
  faqs: Faq[];
  related: string[];
  finalCta: DeckSection | null;
};

/**
 * Answers rewritten for visitors where the deck holds an editorial note, or where the
 * site makes a firmer commitment (IP ownership, support). Keyed by path, then question.
 */
const faqOverrides: Record<string, Record<string, string>> = {
  '/services/': {
    'Do you offer ongoing support?':
      'Yes. After launch we agree support in writing: response times, updates, monitoring and a monthly allowance for improvements, sized to the systems we delivered.',
  },
  '/services/web-application-development/': {
    'Will we own the application?':
      'Yes. Code, designs, documentation and cloud credentials transfer to your organization on completion of milestone payments, as set out in the contract.',
  },
  '/services/digital-marketing/': {
    'Do you manage every digital channel?':
      'No. We agree channel scope with you based on your audience, your goal and the channels we can run well, and say so when another specialist is a better fit.',
  },
};

export const deckPages = (deck.pages as DeckPage[]).map((page) => {
  const overrides = faqOverrides[page.path];
  if (!overrides) return page;
  return { ...page, faqs: page.faqs.map((f) => (overrides[f.q] ? { ...f, a: overrides[f.q] } : f)) };
});

export function deckPage(path: string): DeckPage {
  const page = deckPages.find((p) => p.path === path);
  if (!page) throw new Error(`Copy deck has no page for ${path}`);
  return page;
}

/** Sentence-case a deck CTA ("Plan Your Web Application" → "Plan your web application"). */
export const ctaLabel = (label: string) =>
  label
    .split(' ')
    .map((w, i) => (i === 0 || /^[A-Z]{2,}|^(UI|UX|CRM|SEO|Shopify|WordPress|Hiver)/.test(w) ? w : w.toLowerCase()))
    .join(' ');
