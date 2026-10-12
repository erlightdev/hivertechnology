# Hiver Technology website

Company website for [Hiver Technology](https://hiver.com.np) — built with Astro 7, React islands,
Tailwind CSS v4, shadcn/ui and beUI motion components. Every page is prerendered to static HTML;
only the contact API runs on the Node server.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies (Node ≥ 22.12) |
| `npm run dev` | Dev server at http://localhost:4321 (`astro dev --background` for background mode) |
| `npm run check` | Type-check Astro, TS and TSX files |
| `npm run build` | Build to `dist/` (static pages in `dist/client`, server in `dist/server`) |
| `npm start` | Preview the built site locally |
| `npm run preview` | Build, then preview locally |

## Structure

```
server.mjs                  Production entry: gzip, www/https redirects, security headers
astro.config.mjs            Site URL, trailing-slash policy, legacy 301s, env schema
src/
  config/site.ts            Company facts (NAP), navigation — single source of truth
  config/pages.ts           Title / description / indexable flag for every fixed route
  data/                     Services, products, process, FAQs, tech stack
  content/insights/         Articles (Markdown) — schema in src/content.config.ts
  components/
    ui/                     shadcn/ui primitives (generated — avoid hand edits)
    motion/                 beUI components (accordion, marquee, toast, stateful button, 404)
    layout/                 Header, footer, mobile nav, theme toggle, logo
    sections/               Home-page sections and shared cards
    common/                 Section, PageHero, CTA band, FAQ, breadcrumbs, button link
    contact/                Contact form island
    insights/               Article template and cards
    seo/                    <head> metadata
  layouts/                  BaseLayout (all pages), LegalLayout
  lib/                      JSON-LD builders, enquiry schema, mailer (server only)
  pages/                    Routes; pages/api/contact.ts is the only on-demand route
  styles/global.css         Design tokens (light/dark), utilities
  assets/                   Brand mark, tech logos, stock images (see assets/stock/CREDITS.md)
public/                     Favicons, OG image, manifest, robots.txt
docs/                       Research, SEO deliverables, deployment guide, legacy static site
```

## Design system

Tokens live in `src/styles/global.css` and are exposed as Tailwind utilities — reference them,
never raw hex/oklch values:

- **Color:** `bg-background-{primary,secondary,tertiary}`, `text-foreground-{primary,secondary,tertiary,muted}`,
  `border-border-{line,primary,secondary,tertiary,muted}`, `brand-{base,vivid,8,10,20}` (brand shifts
  hue between light and dark — always use the token), `base-{default,invert,white,black}`.
- **Type:** `font-sans` (Inter), `font-mono` (Geist Mono), `font-serif` (Newsreader, editorial
  headings), `font-paper` (labels). Section headings use the `section-heading` utility with an
  optional muted second line (`<span class="block text-foreground-tertiary">`).
- **Layout:** `container-page` / `grid-layout` / `grid-layout-inner` / `bleed`, driven by
  `--grid-columns` (4 / 12 / 24), `--grid-gap`, `--grid-margin` and `--grid-max-width` (1088px).
  `data-rail` draws the vertical edge rails; `data-line` a bottom hairline.
- **Elevation:** `shadow-button-sm`, `shadow-drop-sm`, `shadow-drop-md`, `shadow-feature-card`,
  `shadow-navbar-bg`, `shadow-editor-tooltip`. A surface with a drop shadow gets its edge from
  `ring-1 ring-inset`, not `border`.
- **Shape:** 4px buttons, 6px cards/media, 10px large panels, `rounded-full` for pills/CTAs.
- **Motion:** `ease-out-soft`, `ease-out-expo`, `ease-in-out-smooth`, `ease-out-strong`,
  `ease-in-out-strong`; UI transitions 150–250ms. All animation is disabled under
  `prefers-reduced-motion`; Lenis smooth scroll is skipped too.

## Editing content

### Copy deck (services, industries, company pages)

Service, industry and most company-page copy comes from the v2 Page Copy Deck
(`docs/research/v2/Hiver Technology - Page Copy Deck.md`). It is converted to
`src/data/generated/copy-deck.json` by:

```bash
python3 scripts/import-copy-deck.py
```

Edit the deck, re-run the script and rebuild. Deck paths are mapped to the v3 URL architecture in
`PATH_MAP` inside the script. Hiver-specific additions (icons, summaries, fit lists, stack, v3 titles)
live in `src/data/services.ts` and `src/data/industries.ts`; FAQ answers that the deck wrote as
editorial notes are overridden in `src/data/deck.ts`.

| Area | Source |
| --- | --- |
| Services (16, five paths) | Copy deck + `src/data/services.ts` |
| Industries (5) | Copy deck + `src/data/industries.ts` |
| About, Portfolio, Contact, Insights | v3 SEO spec + copy-deck sections |
| Products, legal, careers, international delivery | v3 spec / written for this site |

### Measurement

`src/scripts/measurement.ts` and the contact form push the v2 event plan to `window.dataLayer`
(`cta_click`, `phone_click`, `email_click`, `whatsapp_click`, `scroll_75`, `form_start`,
`form_submit`, `generate_lead`). Nothing leaves the browser until you add a tag manager —
update the Cookie Policy and consent handling when you do.

- **Company details** (phone, email, address): `src/config/site.ts`.
- **Page titles and descriptions**: `src/config/pages.ts`; services/products in `src/data/`.
- **Articles**: add a Markdown file to `src/content/insights/`. Frontmatter is validated at build.
- **Open roles**: the `roles` array in `src/pages/career.astro`.
- **Testimonials**: `src/data/testimonials.ts`. Add only quotes you have written permission to
  publish, with real names. While the list is empty, the home page shows delivery commitments in
  the same marquee layout.

### Indexing gates (v3 SEO spec)

Pages follow the evidence gates in `docs/research/v3/hiver_v3_page_seo.csv`. Service details, industries,
products, portfolio, careers, international delivery and the three decision guides render
`noindex, follow` and are kept out of `sitemap.xml` until their proof is approved. To publish one,
flip its `indexable` flag (`src/config/pages.ts`, `src/data/*.ts` or the article frontmatter).
`sitemap.xml` is generated from the same flags, so robots meta and sitemap never disagree.

## Adding UI components

```bash
npx shadcn@latest add <component>        # shadcn/ui → src/components/ui
npx shadcn@latest add @beui/<slug>       # beUI → src/components/motion
```

Note: `src/styles/shadcn.css` is a vendored copy of `shadcn/tailwind.css`, so the shadcn CLI is not a
runtime dependency.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Hostinger Node.js Web App setup.
