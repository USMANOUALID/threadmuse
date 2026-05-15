"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithGoogle, signUpWithPassword } from "@/app/actions/auth";

/**
 * Sign-up form. Mirrors the login form's shape — server action redirects on
 * success, returns `{ ok: false, error }` on validation/auth failure, and
 * returns `{ ok: true }` (no redirect) when email confirmation is required
 * so we can render a "check your inbox" state.
 */
export function SignupForm({ redirect }: { redirect?: string }) {
  const [error, setError] = React.useState<string | null>(null);
  const [confirmEmailSent, setConfirmEmailSent] = React.useState(false);
  const [oauthPending, setOauthPending] = React.useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    const result = await signUpWithPassword(formData);
    if (!result) return; // action redirected on success
    if (result.ok) {
      // Confirmation enabled — no session yet. Show the check-your-email panel.
      setConfirmEmailSent(true);
    } else {
      setError(result.error);
    }
  }

  async function onGoogle() {
    setError(null);
    setOauthPending(true);
    const result = await signInWithGoogle(redirect);
    if (result && result.ok === false) {
      setError(result.error);
      setOauthPending(false);
    }
  }

  if (confirmEmailSent) {
    return (
      <div className="mt-6 rounded-md border border-line/10 bg-warm p-5">
        <h2 className="font-display text-[15px] font-semibold text-ink">Check your inbox</h2>
        <p className="mt-1 text-[13px] text-ink/85">
          We've sent you a confirmation link. Click it to finish signing up — you can close this
          tab.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onGoogle}
        disabled={oauthPending}
        className="h-11 w-full"
      >
        <GoogleIcon className="size-4" />
        {oauthPending ? "Redirecting…" : "Continue with Google"}
      </Button>

      <Divider />

      <form action={onSubmit} className="flex flex-col gap-3">
        {redirect && <input type="hidden" name="redirect" value={redirect} />}

        <Field label="Display name">
          <Input
            type="text"
            name="name"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Iona Park"
          />
        </Field>

        <Field
          label="Username"
          hint="3–32 characters · lowercase, numbers, dots, underscores"
        >
          <Input
            type="text"
            name="username"
            autoComplete="username"
            required
            minLength={3}
            maxLength={32}
            pattern="[a-z0-9._]+"
            placeholder="oats.and.thread"
          />
        </Field>

        <Field label="Email">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Password" hint="At least 8 characters.">
          <Input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="••••••••"
          />
        </Field>

        {error && <ErrorBanner message={error} />}

        <SubmitButton label="Create account" />

        <p className="text-[11.5px] text-muted">
          By signing up you agree to our terms and privacy policy.
        </p>
      </form>
    </div>
  );
}

// ── shared bits (mirrored from login-form to keep each form self-contained) ──

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 w-full">
      {pending ? "Working…" : label}
    </Button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold tracking-[0.01em] text-ink">{label}</span>
      {children}
      {hint && <span className="text-[11.5px] text-muted">{hint}</span>}
    </label>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-[12.5px] text-destructive"
    >
      {message}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-[11.5px] uppercase tracking-wide text-muted">
      <div className="h-px flex-1 bg-line/15" />
      <span>or</span>
      <div className="h-px flex-1 bg-line/15" />
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.51-1.13 2.79-2.41 3.65v3.04h3.9c2.28-2.1 3.59-5.19 3.59-8.93z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.04c-1.08.72-2.45 1.15-4.03 1.15-3.1 0-5.73-2.09-6.67-4.9H1.3v3.08C3.27 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.33 14.3c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3V6.62H1.3C.47 8.24 0 10.06 0 12s.47 3.76 1.3 5.38l4.03-3.08z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.3 6.62l4.03 3.08C6.27 6.84 8.9 4.75 12 4.75z"
      />
    </svg>
  );
}
