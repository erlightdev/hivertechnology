/**
 * Site-wide click, scroll, lead, search, and interaction measurement.
 * Loaded once from BaseLayout.
 */
import { track, trackLead, trackSearch, trackSelectItem } from '@/lib/analytics';

document.addEventListener(
  'click',
  (event) => {
    const link = (event.target as Element | null)?.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    const label = link.textContent?.trim().replace(/\s+/g, ' ') ?? '';

    // Phone leads
    if (href.startsWith('tel:')) {
      track('phone_click', { destination: href });
      trackLead({ method: 'phone', event_label: href });
      return;
    }

    // Email leads
    if (href.startsWith('mailto:')) {
      track('email_click', { destination: href });
      trackLead({ method: 'email', event_label: href });
      return;
    }

    // WhatsApp leads
    if (href.includes('wa.me/')) {
      track('whatsapp_click', { destination: href });
      trackLead({ method: 'whatsapp', event_label: href });
      return;
    }

    // Product item selection from cards
    const productSlug = link.dataset.productSlug;
    if (productSlug) {
      const productName = link.dataset.productName ?? label;
      const productCategory = link.dataset.productCategory;
      trackSelectItem({
        items: [
          {
            item_id: productSlug,
            item_name: productName,
            item_category: productCategory,
          },
        ],
      });
    }

    // General CTA and high-intent button tracking
    const isCta = link.hasAttribute('data-cta') || link.classList.contains('btn-cta') || link.getAttribute('role') === 'button';
    const isContactIntent =
      href.includes('/contact/') ||
      label.toLowerCase().includes('walkthrough') ||
      label.toLowerCase().includes('brief') ||
      label.toLowerCase().includes('discuss') ||
      label.toLowerCase().includes('get in touch');

    if (isCta || isContactIntent) {
      const ctaLocation =
        link.dataset.ctaLocation ??
        link.closest('section[id], header, footer')?.id ??
        link.closest('header, footer')?.tagName.toLowerCase() ??
        'content';

      track('cta_click', {
        cta_label: label,
        cta_location: ctaLocation,
        destination: href,
      });

      if (isContactIntent) {
        trackLead({
          method: 'contact_cta',
          event_label: label,
          destination: href,
          cta_location: ctaLocation,
        });
      }
    }
  },
  { capture: true },
);

// Form submission tracking (guarantees generate_lead on any form)
document.addEventListener('submit', (event) => {
  const form = event.target as HTMLFormElement | null;
  if (!form) return;

  const formId = form.id || form.getAttribute('name') || 'general_form';
  trackLead({
    method: 'form',
    form_id: formId,
    event_label: form.getAttribute('action') ?? window.location.pathname,
  });
});

// Search query detection from URL params (e.g. ?q=..., ?search=..., ?s=...)
try {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('q') || urlParams.get('search') || urlParams.get('s') || urlParams.get('query');
  if (searchParam) {
    trackSearch(searchParam);
  }
} catch {}

// Search input submit detection
document.addEventListener('search', (event) => {
  const input = event.target as HTMLInputElement | null;
  if (input && input.value) {
    trackSearch(input.value);
  }
});

// Scroll depth tracking
let scrolled75 = false;
window.addEventListener(
  'scroll',
  () => {
    if (scrolled75) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0 && window.scrollY / max >= 0.75) {
      scrolled75 = true;
      track('scroll_75');
    }
  },
  { passive: true },
);
