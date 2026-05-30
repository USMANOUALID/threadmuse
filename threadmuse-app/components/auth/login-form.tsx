"use client";

import Link from "next/link";
import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithGoogle, signInWithPassword } from "@/app/actions/auth";

/**
 * Email-password + Google sign-in form.
 *
 * The auth server actions `redirect()` on success — which Next implements as
 * a thrown special error that bubbles past the action's declared return type.
 * That means we only ever see a value back when something *failed* (returned
 * `{ ok: false, error }`). Success simply unmounts the form via the redirect.
 *
 * `useFormStatus` gives us a pending state without needing to track it manually,
 * but only inside a component nested under <form>. Hence the inner button.
 */
export function LoginForm({
  redirect,
  initialError,
}: {
  redirect?: string;
  initialError?: string;
}) {
  const [error, setError] = React.useState<string | null>(initialError ?? null);
  const [oauthPending, setOauthPending] = React.useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    const result = await signInWithPassword(formData);
    if (result && result.ok === false) {
      setError(result.error);
    }
    // Success path: action threw a redirect — this line is unreachable.
  }

  async function onGoogle() {
    setError(null);
    setOauthPending(true);
    const result = await signInWithGoogle(redirect);
    if (result && result.ok === false) {
      setError(result.error);
      setOauthPending(false);
    }
    // Success path: signInWithGoogle redirects to Google.
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

        <Field label="Email">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </Field>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-semibold tracking-[0.01em] text-ink">Password</span>
            <Link href="/forgot-password" className="text-[12px] font-semibold text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            minLength={6}
            placeholder="••••••••"
          />
        </div>

        {error && <ErrorBanner message={error} />}

        <SubmitButton label="Sign in" />
      </form>
    </div>
  );
}

// ── tiny presentational bits (kept local — not worth a UI primitive yet) ──

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 w-full">
      {pending ? "Working…" : label}
    </Button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold tracking-[0.01em] text-ink">{label}</span>
      {children}
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
