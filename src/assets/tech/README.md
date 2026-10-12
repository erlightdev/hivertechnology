# Technology logos

Brand SVGs vendored from [theSVG](https://thesvg.org) with its CLI (no runtime dependency).
Logos are trademarks of their owners and are shown only to identify technologies we use.

Add or refresh a logo (use the slug from `npx @thesvg/cli search <name>`):

```bash
npx @thesvg/cli add <slug> --dir src/assets/tech
```

Logos render on a white chip, so prefer the `default` variant, or `light` when the default has white
text (Amazon Web Services uses `--variant light`). Then register it in `src/data/company.ts`.
