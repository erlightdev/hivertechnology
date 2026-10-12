import { BouncyAccordion } from '@/components/motion/bouncy-accordion';
import type { Faq } from '@/data/services';

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <BouncyAccordion
      defaultValue="faq-0"
      items={faqs.map((f, i) => ({ id: `faq-${i}`, title: f.q, description: f.a }))}
      classNames={{
        item: 'bg-base-default ring-1 ring-inset ring-border-secondary shadow-drop-sm dark:bg-background-secondary',
        trigger: 'py-4',
        title: 'whitespace-normal text-pretty text-foreground-primary',
        description: 'text-foreground-secondary',
      }}
    />
  );
}
