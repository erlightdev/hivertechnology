// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = 'https://hiver.com.np';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // URL policy from the v3 SEO spec: lowercase, hyphenated, trailing slash.
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  // Every page is prerendered to static HTML. Only routes that opt out with
  // `export const prerender = false` (the contact API) run on the Node server.
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  integrations: [react()],

  // Legacy WordPress URLs consolidated under the v3 architecture.
  // See docs/DEPLOYMENT.md before adding rules; never add Nexly reference routes.
  redirects: {
    '/team/': { status: 301, destination: '/about-us/' },
    '/category/blog/': { status: 301, destination: '/insights/' },
    '/revolutionizing-software-solutions-hiver-technology-leading-the-way-in-nepal/': {
      status: 301,
      destination: '/about-us/',
    },
  },

  security: {
    // Hostinger's proxy may not forward the original protocol, which breaks Astro's
    // global origin check. The contact route performs its own host-based check instead.
    checkOrigin: false,
  },

  env: {
    schema: {
      SMTP_HOST: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PORT: envField.number({ context: 'server', access: 'secret', default: 465 }),
      SMTP_SECURE: envField.boolean({ context: 'server', access: 'secret', default: true }),
      SMTP_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PASS: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', default: 'admin@hiver.com.np' }),
      CONTACT_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  image: {
    responsiveStyles: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
