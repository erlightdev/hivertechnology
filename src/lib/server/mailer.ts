import nodemailer, { type Transporter } from 'nodemailer';
import {
  CONTACT_FROM,
  CONTACT_TO,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
} from 'astro:env/server';
import { budgetOptions, labelFor, serviceOptions, stageOptions, type Enquiry } from '@/lib/enquiry';

let transporter: Transporter | undefined;

export const isMailConfigured = () => Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const getTransporter = () => {
  transporter ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function sendEnquiry(enquiry: Enquiry, meta: { ip: string; userAgent: string }) {
  const rows: [string, string][] = [
    ['Name', enquiry.name],
    ['Email', enquiry.email],
    ['Phone', enquiry.phone || '—'],
    ['Company', enquiry.company || '—'],
    ['Website', enquiry.website_url || '—'],
    ['Country', enquiry.country || '—'],
    ['Project type', labelFor(serviceOptions, enquiry.service)],
    ['Stage', labelFor(stageOptions, enquiry.stage)],
    ['Budget', labelFor(budgetOptions, enquiry.budget)],
  ];

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    enquiry.message,
    '',
    `— Sent from hiver.com.np/contact/ (${meta.ip}, ${meta.userAgent})`,
  ].join('\n');

  const html = `
    <table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="color:#6e6e73">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`).join('')}
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>
    <p style="font-family:system-ui,sans-serif;font-size:12px;color:#6e6e73">Sent from hiver.com.np/contact/</p>`;

  await getTransporter().sendMail({
    from: CONTACT_FROM ?? `Hiver Technology Website <${SMTP_USER}>`,
    to: CONTACT_TO,
    replyTo: { name: enquiry.name, address: enquiry.email },
    subject: `New enquiry: ${labelFor(serviceOptions, enquiry.service)} — ${enquiry.name}`,
    text,
    html,
  });
}
