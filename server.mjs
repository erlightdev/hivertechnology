/**
 * Production entry for Hostinger Node.js Web Apps.
 *
 * Wraps Astro's standalone Node handler with:
 *  - gzip compression for text responses
 *  - canonical host / HTTPS redirects (www → apex, http → https behind the proxy)
 *  - baseline security headers
 *
 * Start with `npm start`. Hostinger provides PORT; HOST defaults to 0.0.0.0.
 */
import http from 'node:http';
import compression from 'compression';

// Stop the adapter from starting its own server; we start ours below.
process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

const PORT = Number(process.env.PORT ?? 4321);
const HOST = process.env.HOST ?? '0.0.0.0';
const CANONICAL_HOST = process.env.CANONICAL_HOST ?? 'hiver.com.np';
const FORCE_HTTPS = process.env.FORCE_HTTPS !== 'false';

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

const compress = compression({ threshold: 1024 });

const server = http.createServer((req, res) => {
  const host = (req.headers['x-forwarded-host'] ?? req.headers.host ?? '').toString().split(',')[0].trim();
  const proto = (req.headers['x-forwarded-proto'] ?? '').toString().split(',')[0].trim();
  const isCanonicalDomain = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`;

  // One-hop redirect to https://<canonical host> for production traffic only.
  if (isCanonicalDomain && (host !== CANONICAL_HOST || (FORCE_HTTPS && proto === 'http'))) {
    res.writeHead(301, { Location: `https://${CANONICAL_HOST}${req.url ?? '/'}` });
    res.end();
    return;
  }

  for (const [key, value] of Object.entries(securityHeaders)) res.setHeader(key, value);
  if (proto === 'https') res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  compress(req, res, () => handler(req, res));
});

server.listen(PORT, HOST, () => {
  console.log(`Hiver Technology site listening on http://${HOST}:${PORT}`);
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
