# Deploying to Hostinger

The site is a **pure static Astro build**. `npm run build` writes every page to `dist/`
(with `dist/index.html` at the root). `public/.htaccess` is copied into `dist/` and handles HTTPS,
www → hiver.com.np, legacy 301 redirects, the 404 page, caching, compression and security headers.

## Hostinger settings

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Node version | 22.x |
| Root directory | `./` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | none |

## Domain

1. Point `hiver.com.np` and `www.hiver.com.np` to the app in hPanel and enable SSL.
2. `.htaccess` 301-redirects `www` → apex and `http` → `https`. If you see a redirect loop, remove the
   HTTPS block from `public/.htaccess` and enable "Force HTTPS" in hPanel instead.

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
