import { ResetPasswordForm } from "@/components/auth/password-reset-forms";
import { MarketingPageShell } from "@/components/marketing/page-shell";

export default function ResetPasswordPage() {
  return (
    <MarketingPageShell>
      <section className="container max-w-md py-20 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Secure update</p>
        <h1 className="mt-3 font-display text-display font-semibold">Choose a new password</h1>
        <p className="mt-4 text-sm leading-6 text-muted">Use the email link from Supabase, then set a new password here.</p>
        <ResetPasswordForm />
      </section>
    </MarketingPageShell>
  );
}
