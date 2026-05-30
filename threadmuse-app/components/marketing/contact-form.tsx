import { submitContactMessage } from "@/app/actions/cms";
import { Button } from "@/components/ui/button";

export function ContactForm({ redirectTo = "/contact" }: { redirectTo?: string }) {
  return (
    <form action={submitContactMessage} className="grid gap-4 rounded-3xl border border-line/10 bg-surface/80 p-5 shadow-lift backdrop-blur md:p-6">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Name
          <input
            required
            name="name"
            minLength={2}
            placeholder="Maya Chen"
            className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Work email
          <input
            required
            name="email"
            type="email"
            placeholder="maya@company.com"
            className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Company
          <input
            name="company"
            placeholder="SignalForge"
            className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Monthly budget
          <select
            name="budget"
            className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            defaultValue="$10k-$25k"
          >
            <option>$5k-$10k</option>
            <option>$10k-$25k</option>
            <option>$25k-$75k</option>
            <option>Enterprise</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-ink">
        What should we build?
        <textarea
          required
          name="message"
          minLength={10}
          rows={5}
          placeholder="Tell us about your SaaS website, CMS, automation, or dashboard goals."
          className="resize-none rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
        />
      </label>
      <Button type="submit" size="lg" className="w-full">
        Request private strategy call
      </Button>
      <p className="text-center text-xs leading-5 text-muted">
        We store submissions securely in Supabase and never sell your information.
      </p>
    </form>
  );
}
