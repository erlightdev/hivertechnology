# Hiver Technology — v2 to v3 Changelog

| Area | v2 | v3 | Why it matters |
|---|---|---|---|
| area | v2 | v3 | impact |
| --- | --- | --- | --- |
| Architecture | 20 canonical target rows, many conditional; no full legacy route map. | 26 canonical Hiver routes, 253 supplied Nexly reference routes, 59 Hiver legacy inventory rows and explicit keep/redirect/reference rules. | URL preservation is now operational and auditable. |
| Reference workbook | Used Nexly competitors/references but did not separate all routes from Hiver ownership. | Every Nexly row is explicitly reference-only and never a Hiver redirect by default. | Prevents accidental route/content copying. |
| Hiver legacy routes | High-level redirect requirement only. | Every current Hiver route/asset receives a decision, target and indexability rule. | Developer can implement without guessing. |
| SEO fields | Page briefs but no complete stable URL SEO inventory file. | Separate page SEO CSV with title, meta, H1, canonical, indexability, intent, keyword and gate. | Direct CMS/SEO handoff. |
| Redirect implementation | Migration narrative only. | Redirect CSV plus disabled/active Apache/Nginx templates and curl validation. | Lower migration error risk. |
| Internal linking | Strategic links only. | Explicit source, target, anchor, type, status and rule for each planned link. | No placeholder # navigation. |
| Content | Gated briefs; no route-preserving copy matrix. | Per-page content system tied to stable paths, proof gate and schema. | Build content under the correct URLs. |

## v3 acceptance

The supplied Nexly audit is now attached as a reference dataset and route-by-route map, while the Hiver legacy URL inventory remains the preserve/redirect authority.