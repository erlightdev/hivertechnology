import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatefulButton, type ButtonState } from '@/components/motion/button/stateful';
import { AnimatedToastStack, useAnimatedToastStack } from '@/components/motion/animated-toast-stack';
import { budgetOptions, serviceOptions, stageOptions } from '@/lib/enquiry-options';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

type Errors = Partial<Record<string, string>>;

type Props = {
  /** Shown in error messages as the manual fallback. */
  fallbackEmail: string;
};

function Field({
  id,
  label,
  error,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm">
        {label}
        {optional && <span className="font-normal text-foreground-tertiary"> (optional)</span>}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({ fallbackEmail }: Props) {
  const [state, setState] = useState<ButtonState>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [startedAt, setStartedAt] = useState('');
  // Remounting the form clears uncontrolled inputs, including Radix selects.
  const [formKey, setFormKey] = useState(0);
  const formStarted = useRef(false);
  const { toasts, showToast, dismissToast } = useAnimatedToastStack({ defaultDuration: 6000 });

  useEffect(() => {
    setStartedAt(String(Date.now()));
    if (new URLSearchParams(window.location.search).has('error')) {
      showToast({
        status: 'error',
        title: 'Your enquiry was not sent',
        description: `Please check the form and try again, or email ${fallbackEmail}.`,
      });
    }
  }, [fallbackEmail, showToast]);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setErrors({});
    setState('loading');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const result = (await response.json()) as { ok: boolean; message?: string; errors?: Errors };

      if (!result.ok) {
        setErrors(result.errors ?? {});
        setState('error');
        showToast({ status: 'error', title: 'Not sent yet', description: result.message });
        const first = result.errors && Object.keys(result.errors)[0];
        if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        return;
      }

      setState('success');
      showToast({
        status: 'success',
        title: 'Enquiry received',
        description: result.message ?? 'We will reply within one business day.',
      });
      const data = new FormData(form);
      const params = {
        form_name: 'project_enquiry',
        form_variant: 'project_enquiry',
        service_or_product: String(data.get('service') ?? ''),
        country: String(data.get('country') ?? ''),
        budget_band: String(data.get('budget') ?? ''),
        timeline: String(data.get('stage') ?? ''),
      };
      track('form_submit', params);
      track('generate_lead', params);
      setFormKey((k) => k + 1);
      setStartedAt(String(Date.now()));
    } catch {
      setState('error');
      showToast({
        status: 'error',
        title: 'Network error',
        description: `Please try again or email ${fallbackEmail}.`,
      });
    } finally {
      window.setTimeout(() => setState('idle'), 3500);
    }
  }

  const describedBy = (name: string) => (errors[name] ? `${name}-error` : undefined);

  return (
    <>
      <form
        key={formKey}
        action="/api/contact/"
        method="post"
        onSubmit={onSubmit}
        onFocusCapture={() => {
          if (!formStarted.current) {
            formStarted.current = true;
            track('form_start', { form_name: 'project_enquiry' });
          }
        }}
        className="grid gap-5 sm:grid-cols-2"
      >
        <Field id="name" label="Full name" error={errors.name}>
          <Input id="name" name="name" autoComplete="name" required minLength={2} maxLength={120} aria-invalid={!!errors.name} aria-describedby={describedBy('name')} className="h-11" />
        </Field>
        <Field id="email" label="Work email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required maxLength={200} aria-invalid={!!errors.email} aria-describedby={describedBy('email')} className="h-11" />
        </Field>
        <Field id="phone" label="Phone / WhatsApp" optional error={errors.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className="h-11" />
        </Field>
        <Field id="company" label="Organization" optional error={errors.company}>
          <Input id="company" name="company" autoComplete="organization" maxLength={160} className="h-11" />
        </Field>
        <Field id="website_url" label="Current website" optional error={errors.website_url}>
          <Input id="website_url" name="website_url" type="text" inputMode="url" autoComplete="url" placeholder="https://" maxLength={200} className="h-11" />
        </Field>
        <Field id="country" label="Country" optional error={errors.country}>
          <Input id="country" name="country" autoComplete="country-name" maxLength={80} className="h-11" />
        </Field>
        <Field id="service" label="Project type" error={errors.service}>
          <Select name="service" required>
            <SelectTrigger id="service" aria-invalid={!!errors.service} aria-describedby={describedBy('service')} className="h-11! w-full">
              <SelectValue placeholder="Select a project type" />
            </SelectTrigger>
            <SelectContent>
              {serviceOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="stage" label="Timeline" optional error={errors.stage}>
          <Select name="stage">
            <SelectTrigger id="stage" className="h-11! w-full">
              <SelectValue placeholder="Where are you now?" />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="budget" label="Budget range" optional error={errors.budget}>
          <Select name="budget">
            <SelectTrigger id="budget" className="h-11! w-full">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              {budgetOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="message" label="What do you need to build, fix or improve?" error={errors.message} className="sm:col-span-2">
          <Textarea
            id="message"
            name="message"
            required
            minLength={20}
            maxLength={5000}
            rows={6}
            placeholder="Users, current tools, key workflows, integrations, deadlines…"
            aria-invalid={!!errors.message}
            aria-describedby={describedBy('message')}
            className="min-h-36 resize-y"
          />
        </Field>

        {/* Spam controls: hidden honeypot and render timestamp. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="startedAt" value={startedAt} />

        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-xs leading-relaxed text-foreground-tertiary">
            We use these details only to reply to your enquiry. See our{' '}
            <a href="/privacy-policy/" className="underline underline-offset-2 hover:text-foreground-primary">
              privacy policy
            </a>
            .
          </p>
          <StatefulButton
            type="submit"
            size="lg"
            state={state}
            loadingText="Sending"
            successText="Sent"
            errorText="Try again"
            icon={<Send className="h-4 w-4" aria-hidden="true" />}
            className="rounded-full"
          >
            Send enquiry
          </StatefulButton>
        </div>
      </form>
      <AnimatedToastStack toasts={toasts} onDismiss={dismissToast} position="bottom-right" fixed portal />
    </>
  );
}
