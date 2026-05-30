import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/password-reset-forms";
import { MarketingPageShell } from "@/components/marketing/page-shell";

export default function ForgotPasswordPage() {
  return (
    <MarketingPageShell>
      <section className="container max-w-md py-20 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Account recovery</p>
        <h1 className="mt-3 font-display text-display font-semibold">Reset your password</h1>
        <p className="mt-4 text-sm leading-6 text-muted">Enter your email and we will send a secure Supabase password reset link.</p>
        <ForgotPasswordForm />
        <Link href="/login" className="mt-5 inline-flex text-sm text-accent">Back to login</Link>
      </section>
    </MarketingPageShell>
  );
}
