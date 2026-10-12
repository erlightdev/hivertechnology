/**
 * Measurement events from the v2 event plan (docs/research/v2/hiver_website_content_system.json → events).
 * Events are pushed to `window.dataLayer` only. Nothing is sent anywhere until a tag manager
 * or analytics tool is added — update the Cookie Policy and consent handling when that happens.
 */
type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, landing_page: window.location.pathname, ...params });
}
