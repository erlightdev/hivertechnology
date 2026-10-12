/** Site-wide click and scroll events (v2 event plan). Loaded once from BaseLayout. */
import { track } from '@/lib/analytics';

document.addEventListener(
  'click',
  (event) => {
    const link = (event.target as Element | null)?.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';

    if (href.startsWith('tel:')) return track('phone_click');
    if (href.startsWith('mailto:')) return track('email_click');
    if (href.includes('wa.me/')) return track('whatsapp_click');

    if (link.hasAttribute('data-cta')) {
      track('cta_click', {
        cta_label: link.textContent?.trim().replace(/\s+/g, ' '),
        cta_location: link.dataset.ctaLocation ?? link.closest('section[id], header, footer')?.id ?? link.closest('header, footer')?.tagName.toLowerCase(),
        destination: href,
      });
    }
  },
  { capture: true },
);

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
