# Hiver Technology — v3 Research & Evidence Register

**Research date:** 14 August 2026

## Evidence scope

| Source | Scope | What it is used for | What it is not |
|---|---|---|---|
| Hiver live audit and current-site inventory | Current Hiver routes, construction banner, links, platform markers, services/products and public SEO baseline. | Hiver legacy URL preservation and blocker list. | Not a complete GSC/backlink/revenue baseline. |
| Supplied Nexly route/SEO workbook | 253 routes; Page Inventory, Full Content, SEO Metadata, Headings, Keywords, links, images and issues. | Reference architecture, SEO field design and benchmark patterns. | Not Hiver ownership, Hiver traffic or Hiver rankings. |
| Google Search Central site-move guidance | URL mapping, redirects, canonicals, sitemap and monitoring. | v3 migration runbook. | Not a guarantee of ranking recovery. |
| Google Search Central canonical guidance | Redirect, canonical and sitemap signals. | v3 canonical rules. | Not a rule that forces Google’s selected canonical. |

## Supplied Nexly crawl summary

The workbook contains **253** Page Inventory rows, all status `200` in the supplied crawl, spanning route types {'home': 1, 'about': 8, 'blog': 119, 'book-a-call': 1, 'case-studies': 7, 'category': 16, 'contact': 1, 'cookie-policy': 1, 'integrations': 15, 'migrations': 11, 'privacy-policy': 1, 'project-enquiry': 2, 'services': 69, 'terms-of-service': 1}. It also contains internal links, external links, images, page-level keywords and SEO issues. These counts are **reference-crawl values**, not Hiver metrics.

| Reference issue | Count | v3 treatment |
|---|---:|---|
| Images missing alt text | 253 | Use as a QA category only; re-crawl Hiver staging/production before acting. |
| Title over 60 characters | 122 | Use as a QA category only; re-crawl Hiver staging/production before acting. |
| Title under 30 characters | 34 | Use as a QA category only; re-crawl Hiver staging/production before acting. |
| Missing meta description | 31 | Use as a QA category only; re-crawl Hiver staging/production before acting. |
| Missing OG description | 31 | Use as a QA category only; re-crawl Hiver staging/production before acting. |
| Thin visible content under 300 words | 27 | Use as a QA category only; re-crawl Hiver staging/production before acting. |
| Meta description over 160 characters | 21 | Use as a QA category only; re-crawl Hiver staging/production before acting. |
| Meta description under 70 characters | 1 | Use as a QA category only; re-crawl Hiver staging/production before acting. |

## Missing data that blocks final ranking claims

Hiver still needs Search Console, GA4, CRM, backlinks/referring domains, country SERPs/rank tracking, paid keyword volume/difficulty/CPC, hosting/CWV field data, legal entity data, capability proof, product proof, permissions and review-platform profiles. v3 intentionally labels these as `DATA REQUIRED` rather than fabricating values.

## References

[1]: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes "Google Search Central: How to move a site"
[2]: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls "Google Search Central: Specify canonical URLs"
[3]: https://developers.google.com/search/docs/appearance/ai-features "Google Search Central: AI features and your website"
