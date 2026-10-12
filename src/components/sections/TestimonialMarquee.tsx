import type { ReactNode } from 'react';
import { Marquee } from '@/components/motion/marquee';

export type MarqueeCard = {
  key: string;
  body: string;
  quoted: boolean;
  name: string;
  meta: string;
  avatar: ReactNode;
  /** Optimized image URL; replaces the gradient avatar when present. */
  photo?: string;
  /** Show `avatar` (an icon) on top of the photo. */
  overlay?: boolean;
};

const AVATARS = [
  'from-base-white to-brand-vivid',
  'from-brand-vivid to-brand-orange',
  'from-base-white to-foreground-muted',
  'from-brand-20 to-brand-orange',
];

function Card({ card, index }: { card: MarqueeCard; index: number }) {
  return (
    <figure className="flex h-full w-[300px] flex-col justify-between gap-6 rounded-[6px] bg-base-default p-6 ring-1 ring-border-secondary ring-inset sm:w-[340px] dark:bg-background-secondary">
      <blockquote className="text-[15px]/6 text-foreground-primary">
        {card.quoted ? `“${card.body}”` : card.body}
      </blockquote>
      <figcaption className="flex items-center gap-3">
        {card.photo ? (
          <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-border-secondary">
            <img
              src={card.photo}
              alt=""
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            {card.overlay && (
              <span className="relative grid size-full place-items-center bg-base-black/35 text-base-white">{card.avatar}</span>
            )}
          </span>
        ) : (
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-medium text-base-black ${AVATARS[index % AVATARS.length]}`}
          >
            {card.avatar}
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground-primary">{card.name}</span>
          <span className="block truncate text-xs text-foreground-tertiary">{card.meta}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Two counter-scrolling rows. Server-rendered: animation is CSS only, no hydration. */
export default function TestimonialMarquee({ cards }: { cards: MarqueeCard[] }) {
  const half = Math.ceil(cards.length / 2);
  const rows = [cards.slice(0, half), cards.slice(half)];

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, r) => (
        <Marquee key={r} speed={r === 0 ? 60 : 70} gap="1rem" direction={r === 0 ? 'left' : 'right'} fade={false} className="py-0.5">
          {row.map((card, i) => (
            <Card key={card.key} card={card} index={i + r} />
          ))}
        </Marquee>
      ))}
    </div>
  );
}
