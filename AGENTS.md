## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project notes

- Company facts live in `src/config/site.ts`; per-route SEO and `indexable` flags in `src/config/pages.ts` and `src/data/`. Do not publish unverified claims (clients, results, awards, offices) — see `docs/research/v3`.
- Production is a pure static build (`dist/`) on Hostinger; redirects and headers live in `public/.htaccess`.
- shadcn/ui components go in `src/components/ui`, beUI in `src/components/motion`.
- Run `npm run check` and `npm run build` before finishing a change.
