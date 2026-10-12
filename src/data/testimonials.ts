import type { ImageMetadata } from 'astro';
import type { LucideIcon } from 'lucide-react';
import { Clock, FileSignature, FlaskConical, Globe, KeyRound, LockKeyhole, MessagesSquare, Scale } from 'lucide-react';

/**
 * Client testimonials. Add entries ONLY with the client's written permission and a
 * real name/role (v3 content rules: no invented or anonymised quotes, no ratings,
 * no stock photos standing in for real people).
 * While this list is empty the home page shows `commitments` in the same layout.
 *
 * Example:
 *   import janeDoe from '@/assets/testimonials/jane-doe.jpg';
 *   { quote: '…', name: 'Jane Doe', role: 'Operations Manager', company: 'Acme School', photo: janeDoe }
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Headshot in src/assets/testimonials/. Falls back to initials when omitted. */
  photo?: ImageMetadata;
};

export const testimonials: Testimonial[] = [];

export type Commitment = { statement: string; title: string; detail: string; icon: LucideIcon };

export const commitments: Commitment[] = [
  { statement: 'A written plan you approve before we start building.', title: 'Written plan', detail: 'Before we start', icon: FileSignature },
  { statement: 'A working demo every two weeks, recorded for anyone who missed it.', title: 'Regular demos', detail: 'Every two weeks', icon: Clock },
  { statement: 'You talk to the person building your product — not a salesperson.', title: 'Direct contact', detail: 'Your own developer', icon: MessagesSquare },
  { statement: 'All code, designs and account logins are handed over to you.', title: 'You own it', detail: 'At handover', icon: KeyRound },
  { statement: 'Testing and clear documentation are included — never an extra.', title: 'Built to last', detail: 'Tested and documented', icon: FlaskConical },
  { statement: 'If ready-made software suits you better, we will tell you.', title: 'Honest advice', detail: 'Build or buy', icon: Scale },
  { statement: 'Shared working hours and written updates if you are in another time zone.', title: 'Across time zones', detail: 'Shared hours', icon: Globe },
  { statement: 'We will sign an NDA before you share anything private.', title: 'Confidential', detail: 'NDA on request', icon: LockKeyhole },
];
