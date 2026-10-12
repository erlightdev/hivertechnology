# Hiver Technology — v2 WordPress + Elementor Technical SEO Specification

**Version date:** 14 August 2026

> The live stack shows WordPress with Elementor 4.1.4 and Elementor Pro 3.28.3. This specification is developer-ready only after the domain/brand decision and plugin/hosting access are supplied. Do not claim performance, WCAG or security compliance until tested by qualified people.

| Requirement | Priority | Provenance | Implementation | Acceptance |
|---|---|---|---|---|
| Remove construction and demo content | P0 | [VERIFIED-TOOL] | Remove under-construction banner, all placeholder testimonials/logos/alt text, generic template copy and # links before launch. Do not retain review markup. | Production crawl has zero construction text, placeholder testimonial identifiers, generic logo alt text or href="#" navigation. |
| Canonical host and HTTPS | P0 | [STRATEGIC-JUDGEMENT] | Select one primary HTTPS host and trailing-slash policy. Enforce one-hop 301 redirects and self-referencing canonical tags on indexable URLs. | Crawl confirms one canonical response per indexable page and no chains. |
| Domain migration decision | P0 | [VERIFIED-TOOL] + [STRATEGIC-JUDGEMENT] | Do not finalize URL architecture until leadership resolves keep/migrate/rebrand. For a gTLD migration: URL inventory → 1:1 301 map → staging crawl → update canonicals, hreflang only if applicable, analytics, GSC verification/Change of Address, sitemap, key links and brand assets. | Migration register is approved, every legacy URL has one target, and daily GSC/analytics monitoring plan exists. |
| WordPress / Elementor audit | P0 | [VERIFIED-TOOL] | Inventory theme, Elementor/Pro, all plugins, templates, widgets, fonts and third-party scripts. Remove unused plugins/widgets, minimize widget nesting, disable unused Elementor assets/experiments where compatible, replace decorative motion and duplicate carousels. | Plugin/asset register approved; no unused plugin or unnecessary third-party script remains on P0 templates. |
| Elementor architecture choice | P1 | [STRATEGIC-JUDGEMENT] | Short term: retain Elementor only with page caching, asset reduction and template discipline. Midterm: prototype a lightweight WordPress block-theme marketing template. Use headless only if real product/application requirements justify its operating cost. | Decision memo compares implementation cost, editing workflow, CWV field data, accessibility, release process and maintenance burden. |
| Core Web Vitals field targets | P0 | [PUBLIC-EST] | Measure field data separately on mobile and desktop. Google documents good thresholds of LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile. Use CrUX/Search Console plus real-user monitoring; do not promise a score before data exists. | Baseline and post-launch field report with page-template segmentation. |
| Performance stack | P0 | [STRATEGIC-JUDGEMENT] | Assess hosting for international latency; use CDN edge delivery, full-page cache, object cache if database load warrants it, WebP/AVIF, srcset, reserved dimensions, lazy-load below fold but exclude LCP media, font subsetting/font-display, critical CSS and deferred nonessential JS. | Mobile template tests show no obvious render-blocking or layout-shift regressions; field monitoring is active. |
| Crawl/index controls | P0 | [STRATEGIC-JUDGEMENT] | Create segmented XML sitemaps containing canonical indexable pages only. Use robots.txt to permit essential public assets and block only appropriate private/duplicate areas. Noindex internal search, thank-you, staging and low-value archive/tag pages as appropriate after a crawl review. | Sitemap, robots, noindex, canonical and indexability checks pass on staging and production. |
| Redirect register | P0 | [VERIFIED-TOOL] | Map all existing root-level posts, /insights/, /products/, /services/, /portfolio/, /team/, /about-us/ and any media-related paths to the closest relevant new URL; use one-hop 301s only. | Redirect map covers the current URL inventory; no redirect chain, mass-home redirect or unresolved 404 for legacy indexable content. |
| Accessibility WCAG 2.2 AA | P0 | [STRATEGIC-JUDGEMENT] | Build semantic headings/landmarks, keyboard navigation, visible focus, contrast, labeled forms/errors, target size, reduced-motion behavior, accessible menus and meaningful alt text. Obtain qualified audit before compliance claims. | Automated and manual keyboard/screen-reader test log exists; do not claim legal compliance without qualified validation. |
| Schema | P0 | [STRATEGIC-JUDGEMENT] | Organization and WebSite only with verified real data; LocalBusiness only for the real Nepal location; BreadcrumbList for deep pages; Service only confirmed services; SoftwareApplication only verified products; Article/BlogPosting only real authors; no Review/AggregateRating on placeholders. | Rich Results/Schema validation has no material errors and each markup field matches visible text. |
| Measurement and security | P0 | [DATA REQUIRED] | Verify GSC and Bing Webmaster properties, GA4/GTM, consent controls, heatmap/session tool if approved, WordPress update policy, backups, WAF, spam protection, form routing and incident owner. | Named owner, documented configuration and test events exist before campaign launch. |

## Core Web Vitals context

Google recommends good-field targets of LCP no more than 2.5 seconds, INP no more than 200 milliseconds and CLS no more than 0.1 at the 75th percentile, assessed separately by device class.[1] Gather real-user data before setting a project baseline.

## Release gates

A page cannot launch indexable until it has a unique title, meta description, H1, self-canonical, accessible semantic structure, non-placeholder copy, valid internal links, accurate visible schema, tested CTA/form, appropriate image alt text, event coverage and an owner for content updates.

## Reference

[1]: https://developers.google.com/search/docs/appearance/core-web-vitals "Google Search Central: Core Web Vitals"
