/**
 * Measurement and GA4 event tracking.
 * Complies with Google Consent Mode v2 and GA4 standard recommended events:
 * - view_item_list / view_item / select_item (E-commerce / products)
 * - generate_lead (Contact flow, mailto, phone, whatsapp, walk-through requests)
 * - search (Internal / URL discovery)
 */

type EventParams = Record<string, unknown>;

export type EcommerceItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_brand?: string;
  price?: number;
  quantity?: number;
  index?: number;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    hiverOpenCookiePreferences?: () => void;
    hiverLoadGA4?: () => void;
  }
}

/**
 * Pushes event to dataLayer and triggers GA4 gtag('event', ...) if gtag is loaded.
 */
export function track(event: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return;

  const payload = {
    event,
    landing_page: window.location.pathname,
    ...params,
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, {
      landing_page: window.location.pathname,
      ...params,
    });
  }
}

/**
 * GA4 recommended event: generate_lead
 * Triggered on form submissions, mailto brief clicks, phone inquiries, and WhatsApp conversions.
 */
export function trackLead(params: {
  method: 'email' | 'phone' | 'whatsapp' | 'form' | 'contact_cta';
  value?: number;
  currency?: string;
  event_label?: string;
  [key: string]: unknown;
}) {
  track('generate_lead', params);
}

/**
 * GA4 recommended event: view_item_list
 * Triggered on product catalog / listing pages.
 */
export function trackViewItemList(params: {
  item_list_id?: string;
  item_list_name?: string;
  items: EcommerceItem[];
}) {
  track('view_item_list', {
    item_list_id: params.item_list_id ?? 'hiver_products_catalog',
    item_list_name: params.item_list_name ?? 'Hiver Software Products',
    items: params.items,
  });
}

/**
 * GA4 recommended event: view_item
 * Triggered on individual product pages.
 */
export function trackViewItem(params: {
  currency?: string;
  value?: number;
  items: EcommerceItem[];
}) {
  track('view_item', {
    currency: params.currency ?? 'USD',
    value: params.value,
    items: params.items,
  });
}

/**
 * GA4 recommended event: select_item
 * Triggered when a user clicks a product from a listing.
 */
export function trackSelectItem(params: {
  item_list_id?: string;
  item_list_name?: string;
  items: EcommerceItem[];
}) {
  track('select_item', {
    item_list_id: params.item_list_id ?? 'hiver_products_catalog',
    item_list_name: params.item_list_name ?? 'Hiver Software Products',
    items: params.items,
  });
}

/**
 * GA4 recommended event: begin_checkout
 * Triggered when a user clicks to request a demo/walkthrough or order a specific product.
 */
export function trackBeginCheckout(params: {
  items: EcommerceItem[];
  coupon?: string;
  value?: number;
  currency?: string;
  [key: string]: unknown;
}) {
  const { items, currency = 'USD', value, ...rest } = params;
  track('begin_checkout', {
    currency,
    value,
    items,
    ...rest,
  });
}

/**
 * GA4 recommended event: add_to_cart
 * Triggered when a user selects a product workflow / module.
 */
export function trackAddToCart(params: {
  items: EcommerceItem[];
  value?: number;
  currency?: string;
}) {
  track('add_to_cart', {
    currency: params.currency ?? 'USD',
    value: params.value,
    items: params.items,
  });
}

/**
 * GA4 recommended event: search
 * Triggered when user performs or lands on a search query.
 */
export function trackSearch(searchTerm: string) {
  if (!searchTerm.trim()) return;
  track('search', { search_term: searchTerm.trim() });
}
