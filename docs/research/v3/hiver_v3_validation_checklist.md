# Hiver Technology — v3 Validation & Acceptance Checklist

**Version date:** 14 August 2026

| ID | Stage | Check | Owner | Evidence | Pass condition |
|---|---|---|---|---|---|
| id | stage | check | owner | evidence | pass_condition |
| --- | --- | --- | --- | --- | --- |
| V01 | Pre-build | Confirm Hiver legal entity, approved brand/domain path and URL host. | Leadership/counsel | Signed decision record | No domain migration begins before decision. |
| V02 | Pre-build | Export Hiver GSC 16 months, GA4, backlinks, forms and server/CWV baseline. | SEO/technical | Exports and access log | Data package stored and dated. |
| V03 | Pre-build | Every Hiver legacy page and asset has KEEP, MERGE, REDIRECT, 404/410 or REVIEW decision. | SEO/content/dev | Hiver Legacy Routes sheet | 100% route coverage. |
| V04 | Pre-build | Every Nexly reference route is marked reference-only, not Hiver redirect. | SEO/dev | Nexly Reference Routes sheet | 253/253 rows labeled. |
| V05 | Staging | Run crawl for status, title, meta, H1, canonical, robots, schema, links, images and accessibility. | SEO/dev | Staging crawl | No P0 errors; planned noindex/gated pages behave as intended. |
| V06 | Staging | Test redirects with curl and browser; verify no chains and destination relevance. | Developer | Redirect test CSV/log | Every active redirect one hop to 200/approved target. |
| V07 | Launch | Submit only approved canonical indexable URLs in XML sitemap. | SEO | Sitemap and GSC submission | No reference-only, noindex, redirect or 404 URLs. |
| V08 | Launch | Test forms, consent, CRM attribution and notifications. | Marketing/dev | Event debug and CRM record | Test lead reaches owner and CRM lifecycle. |
| V09 | Post-launch | Monitor old/new URLs, GSC index coverage, queries, leads, redirects, errors and field performance weekly. | SEO/marketing/dev | Weekly dashboard/log | Issues triaged and assigned; no ranking/revenue guarantee assumed. |

## Non-negotiable route rule

The supplied Nexly workbook has 253 reference routes. They must not be imported as Hiver legacy redirects merely because they look commercially useful. The Hiver legacy inventory is a separate source of truth.

## Final acceptance rule

The v3 build is not ready for promotion if any P0 blocker remains: construction/demo text, placeholder proof, unresolved `#` navigation, missing Hiver route decision, broken active redirects, unsupported service/product claims, wrong canonical/sitemap, untested forms, false schema, privacy/cookie gaps or absent owner for a published page.
