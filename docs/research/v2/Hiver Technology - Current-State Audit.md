# Hiver Technology — v2 Current-State Audit

**Audit date:** 14 August 2026

> The public site is a partially built template requiring a rebuild-and-cleanup sequence, not conventional optimization. Findings are based on direct inspection, a controlled DOM check, prior sitemap crawl and client-provided v2 ground truth.

| ID | Area | Severity | Finding | Evidence / provenance | Required action |
|---|---|---|---|---|---|
| A01 | Trust / launch state | BLOCKER | The public homepage visibly states “Website Still Under Construction. Thank you!!!”. | [VERIFIED-TOOL]: Live homepage inspection, 14 August 2026, https://hiver.com.np/ | Remove the banner and every construction-template remnant before indexing, campaigns, directories or outreach. |
| A02 | Trust / social proof | BLOCKER | Visible client-logo alt text says “Brand Name : Brand Short Description Type Here.” and one logo is Hiver’s own; prompt v2 documents demo testimonials. | [VERIFIED-TOOL] + [DATA REQUIRED]: Live homepage inspection, 14 August 2026, https://hiver.com.np/; named testimonial list is client-provided ground truth pending full source crawl. | Remove all placeholder testimonials, logos, client claims and Review/AggregateRating schema. Reintroduce only named, permissioned, verified evidence. |
| A03 | Internal linking | BLOCKER | The live homepage DOM contained 79 raw href="#" anchors, including primary service and industry navigation. | [VERIFIED-TOOL]: Controlled DOM inspection, 14 August 2026, https://hiver.com.np/ | Replace every placeholder link with real URL destinations, then crawl staging/production to prevent orphans and broken internal paths. |
| A04 | Brand / domain | STRUCTURAL | The site uses the Nepal country-code namespace .com.np, while the single-word Hiver entity is visibly occupied by an established customer-service SaaS company at hiverhq.com. | [VERIFIED-TOOL] + [PUBLIC-EST]: Google international guidance; live inspection of https://hiverhq.com/ on 14 August 2026; RDAP snapshot in domain_status.csv. | Complete a domain/brand decision before final URL migration. Obtain qualified trademark review for US/AU/UK before rebrand or major international investment. |
| A05 | Technical platform | HIGH | Live assets identify WordPress with Elementor 4.1.4 and Elementor Pro 3.28.3. | [VERIFIED-TOOL]: Controlled DOM inspection, 14 August 2026, https://hiver.com.np/ | Run plugin/theme audit; retain Elementor short term only with asset controls and caching, or move the marketing surface to a lightweight block theme after a costed proof of concept. |
| A06 | Service truth | CRITICAL | Visible live service labels are Web Applications, Mobile Apps, Responsive Websites, CRM Web Applications, UI/UX Design and Digital Marketing. No public Shopify, SEO, email or automation service pages were observed. | [VERIFIED-TOOL]: Live homepage inspection, 14 August 2026, https://hiver.com.np/ | Use the Capability Gate. Do not publish Shopify, SEO, email or automation service pages until Hiver confirms delivery capability, proof, staffing and sales process. |
| A07 | Products | CRITICAL OPPORTUNITY | The footer lists School Management, Dental Management, Clinic Management, HR Software and Employee Management, but the product hub was empty in the prior crawl. | [VERIFIED-TOOL]: Live homepage inspection 14 August 2026; current sitemap audit, 14 August 2026. | Create a product evidence pack: legal ownership, live/licensable status, deployment count, ICP, markets, pricing, integrations, security, support and permissioned proof. |
| A08 | Content quality | HIGH | Live copy contains visible template/generic language and errors including “Transfering”, “Developemnt”, “help’s” and “Insitagram”; author identity is reported as superadmin. | [VERIFIED-TOOL] + [DATA REQUIRED]: Live homepage inspection 14 August 2026; superadmin metadata is client-provided ground truth pending CMS export. | Replace template copy, proofread all pages, use real author/reviewer entities and document the editorial workflow. |
| A09 | URL / content history | HIGH | Existing articles sit at root URLs while /insights/ also exists; 58 sitemap URLs were observed, mostly media assets, with only a small set of public content pages. | [VERIFIED-TOOL]: Current sitemap audit, 14 August 2026, stored in current_site_inventory.csv. | Produce URL-by-URL redirect map, retain relevant root-post URLs or redirect 301 to the closest rebuilt insight. |
| A10 | Measurement | HIGH | No GSC, GA4, rank data, server/CWV data or commercial funnel data was supplied. | [DATA REQUIRED]: No client exports or access were supplied to this engagement. | Verify Search Console and GA4 before launch; implement CRM closed-loop attribution and obtain baseline data. |

## URL and Redirect Requirement

The prior sitemap audit recorded 58 URLs, predominantly media, and observed live content URLs including `/about-us/`, `/career/`, `/category/blog/`, `/contact/`, `/insights/`, `/portfolio/`, `/products/`, `/services/`, `/team/` and root-level posts such as `/programmer-developer-and-engineer-explained/`. Every legacy indexable URL requires a closest-match target in the migration register before a rebuild or domain move. [VERIFIED-TOOL]

## Priority remediation

1. Remove construction/demo/placeholder content and replace `#` links.
2. Decide brand/domain and verify company/service/product truths.
3. Configure GSC, GA4, GTM, consent, form routing and CRM.
4. Build P0 entity, contact, legal, service hub and factual trust surfaces.
5. Only then launch capability-approved P1 pages and content.

