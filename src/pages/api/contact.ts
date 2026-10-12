import type { APIRoute } from 'astro';
import { enquirySchema } from '@/lib/enquiry';
import { isMailConfigured, sendEnquiry } from '@/lib/server/mailer';
import { site } from '@/config/site';

// Runs on the Node server; every other route is static.
export const prerender = false;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 2500;
const hits = new Map<string, number[]>();

const rateLimited = (ip: string) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
};

/** Reject cross-site posts: the Origin (or Referer) host must match the requested host. */
const isSameSite = (request: Request) => {
  const source = request.headers.get('origin') ?? request.headers.get('referer');
  if (!source) return false;
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '').split(',')[0].trim();
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
};

const clientIp = (request: Request, fallback: string) =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || fallback;

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false;
  const respond = (status: number, body: Record<string, unknown>) => {
    if (wantsJson) return Response.json(body, { status });
    return redirect(body.ok ? '/contact/thank-you/' : '/contact/?error=1#enquiry', 303);
  };

  if (!isSameSite(request)) {
    return new Response('Cross-site form submissions are not allowed.', { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(400, { ok: false, message: 'Invalid form submission.' });
  }

  const parsed = enquirySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      errors[key] ??= issue.message;
    }
    // Silently accept honeypot hits so bots get no signal.
    if (errors.website) return respond(200, { ok: true });
    return respond(422, { ok: false, message: 'Please check the highlighted fields.', errors });
  }

  const enquiry = parsed.data;
  if (enquiry.startedAt && Date.now() - enquiry.startedAt < MIN_FILL_MS) {
    return respond(200, { ok: true });
  }

  const ip = clientIp(request, clientAddress);
  if (rateLimited(ip)) {
    return respond(429, { ok: false, message: 'Too many enquiries from this connection. Please try again later.' });
  }

  if (!isMailConfigured()) {
    console.error('[contact] SMTP is not configured; enquiry not sent.');
    return respond(503, {
      ok: false,
      message: `The form is temporarily unavailable. Please email ${site.email} directly.`,
    });
  }

  try {
    await sendEnquiry(enquiry, { ip, userAgent: request.headers.get('user-agent') ?? 'unknown' });
  } catch (error) {
    console.error('[contact] Failed to send enquiry', error);
    return respond(502, {
      ok: false,
      message: `We could not send your message. Please email ${site.email} directly.`,
    });
  }

  return respond(200, { ok: true, message: 'Thank you. An engineering lead will reply within one business day.' });
};

export const ALL: APIRoute = () => new Response(null, { status: 405, headers: { Allow: 'POST' } });
