import { useState } from 'react';
import { ArrowRight, Mail, Menu, Phone } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/config/site';

type Props = {
  items: NavItem[];
  currentPath: string;
  email: string;
  phone: string;
  phoneHref: string;
};

export default function MobileNav({ items, currentPath, email, phone, phoneHref }: Props) {
  const [open, setOpenState] = useState(false);
  const setOpen = (next: boolean) => {
    setOpenState(next);
    // BaseLayout pauses Lenis smooth scrolling while the menu is open.
    window.dispatchEvent(new CustomEvent('hiver:scroll-lock', { detail: next }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-10 touch-manipulation items-center justify-center rounded-[6px] text-foreground-primary hover:bg-background-secondary md:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent data-lenis-prevent side="right" className="w-full gap-0 bg-background-primary p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-sm">
        <SheetHeader className="border-b border-border-line px-5 py-4">
          <SheetTitle className="text-left font-medium">Hiver Technology</SheetTitle>
          <SheetDescription className="text-left text-foreground-tertiary">Software & digital solutions from Nepal</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-2 py-3">
          {items.map((item) => {
            const active = currentPath.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center justify-between rounded-[4px] px-3 py-3 text-lg font-medium tracking-[-0.3px] transition-colors duration-150 hover:bg-background-secondary',
                  active ? 'text-foreground-primary' : 'text-foreground-secondary',
                )}
              >
                {item.label}
                <ArrowRight className="size-4 text-foreground-muted" aria-hidden="true" />
              </a>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 border-t border-border-line px-5 py-6 text-sm">
          <a href={`mailto:${email}`} className="flex items-center gap-3 text-foreground-secondary hover:text-foreground-primary">
            <Mail className="size-4" aria-hidden="true" /> {email}
          </a>
          <a href={phoneHref} className="flex items-center gap-3 text-foreground-secondary hover:text-foreground-primary">
            <Phone className="size-4" aria-hidden="true" /> {phone}
          </a>
          <a
            href="/contact/"
            className="mt-2 flex h-11 items-center justify-center gap-2 rounded-full bg-honey font-medium text-base-black shadow-button-sm ring-1 ring-border-secondary ring-inset"
          >
            Discuss a project <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
