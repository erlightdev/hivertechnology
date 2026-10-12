import { Marquee } from '@/components/motion/marquee';

type Item = { name: string; role: string; logo: string };

/** Server-rendered only: the marquee animates with CSS, so it needs no hydration. */
function Card({ t }: { t: Item }) {
  return (
    <div className="flex w-52 items-center gap-3 rounded-[6px] bg-base-default px-4 py-3 ring-1 ring-border-secondary ring-inset dark:bg-background-secondary">
      <span className="grid size-9 shrink-0 place-items-center rounded-[6px] bg-base-white p-2 ring-1 ring-border-primary ring-inset">
        <img src={t.logo} alt="" width={20} height={20} loading="lazy" decoding="async" className="size-5 object-contain" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground-primary">{t.name}</span>
        <span className="block truncate text-xs text-foreground-tertiary">{t.role}</span>
      </span>
    </div>
  );
}

/** Two rows scrolling in opposite directions. Server-rendered: CSS animation only, no hydration. */
export default function TechMarquee({ items }: { items: Item[] }) {
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)];
  return (
    <div className="reveal flex flex-col gap-3">
      {rows.map((row, r) => (
        <Marquee key={r} speed={r === 0 ? 40 : 46} gap="0.75rem" direction={r === 0 ? 'left' : 'right'} className="py-0.5">
          {row.map((t) => (
            <Card key={t.name} t={t} />
          ))}
        </Marquee>
      ))}
    </div>
  );
}
