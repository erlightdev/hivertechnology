# Deploying to Hostinger (Node.js Web App)

The site is an Astro build with the `@astrojs/node` adapter. All pages are prerendered; `server.mjs`
serves them, compresses responses and applies redirects and security
headers.

## 1. Create the app

In hPanel, add a **Node.js Web App** and connect this repository (GitHub) or upload a zip of the
project **without** `node_modules/` and `dist/`.

| Setting | Value |
| --- | --- |
| Node.js version | 22.x or newer (24.x tested locally) |
| Install command | `npm ci` (or `npm install`) |
| Build command | `npm run build` |
| Start command / entry file | `npm start` (entry file: `server.mjs`) |
| Root directory | repository root |

Hostinger injects `PORT`; the server binds `0.0.0.0` by default. Labels in hPanel can change —
match the values above to whatever the current form calls them.

## 2. Environment variables (optional)

The contact page currently uses email, phone and WhatsApp links only — no form — so **no SMTP
settings are needed**. The form island (`src/components/contact/ContactForm.tsx`) and its API route
(`src/pages/api/contact.ts`) remain in the codebase but are not used by any page. To bring the form
back, render `<ContactForm client:load fallbackEmail={site.email} />` on the contact page and set:

Set these in the app's environment settings (see `.env.example`):

| Variable | Example | Notes |
| --- | --- | --- |
| `SMTP_HOST` | `smtp.hostinger.com` | Hostinger Email SMTP |
| `SMTP_PORT` | `465` | |
| `SMTP_SECURE` | `true` | SSL on 465 |
| `SMTP_USER` | `website@hiver.com.np` | Create a dedicated mailbox |
| `SMTP_PASS` | — | Mailbox password |
| `CONTACT_TO` | `admin@hiver.com.np` | Enquiry recipient |
| `CONTACT_FROM` | `Hiver Technology Website <website@hiver.com.np>` | Optional |

Without SMTP variables the site still runs; the form returns a friendly message asking visitors to
email directly, and the server logs `[contact] SMTP is not configured`.

## 3. Domain

1. Point `hiver.com.np` and `www.hiver.com.np` to the app in hPanel and enable SSL.
2. `server.mjs` 301-redirects `www` → apex and `http` → `https` (when the proxy sends
   `X-Forwarded-Proto`). Set `FORCE_HTTPS=false` if Hostinger already forces HTTPS and you see a loop.

## 4. Launch checklist

- [ ] Export the current WordPress URL list, Search Console and analytics data **before** cut-over.
- [ ] `curl -I https://hiver.com.np/team/` → `301` to `/about-us/` (legacy redirects in `astro.config.mjs`).
- [ ] `https://hiver.com.np/sitemap.xml` lists only indexable pages; submit it in Search Console.
- [ ] Click the email, phone and WhatsApp links on `/contact/` from a phone and a desktop.
- [ ] Check a static asset: `Cache-Control: public, max-age=31536000, immutable` on `/_astro/*`.
- [ ] Run PageSpeed Insights on `/` and `/contact/` (mobile).
- [ ] Have counsel review the privacy, terms and cookie pages (drafted 12 Oct 2026).

## Legacy URL decisions

| Old URL | Action | Why |
| --- | --- | --- |
| `/team/` | 301 → `/about-us/` | v3 spec: merge until real team profiles exist |
| `/category/blog/` | 301 → `/insights/` | Archive consolidated into insights hub |
| `/revolutionizing-software-solutions-…-in-nepal/` | 301 → `/about-us/` | Self-promotional post merged into About |
| `/programmer-developer-and-engineer-explained/` | Kept, rewritten | Preserves the indexed URL |
| `/wp-content/uploads/…` | Not migrated | Return 404 after asset-use review (v3 spec) |

Never add redirects for the Nexly reference routes in `docs/research/v3`.

## Updating

Push to the connected branch (or re-upload) and redeploy; Hostinger reruns install and build.
Run `npm run check && npm run build` locally first.
