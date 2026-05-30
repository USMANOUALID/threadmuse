"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset, updatePassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    setMessage(null);
    const result = await requestPasswordReset(formData);
    if (result.ok) setMessage("If that email exists, a secure reset link has been sent.");
    else setError(result.error);
  }

  return (
    <form action={onSubmit} className="mt-6 grid gap-4 rounded-3xl border border-line/10 bg-surface p-6 shadow-soft">
      <label className="grid gap-2 text-sm font-medium">
        Email
        <Input name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
      </label>
      {message && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}
      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <Submit label="Send reset link" />
    </form>
  );
}

export function ResetPasswordForm() {
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const result = await updatePassword(formData);
    if (result && result.ok === false) setError(result.error);
  }

  return (
    <form action={onSubmit} className="mt-6 grid gap-4 rounded-3xl border border-line/10 bg-surface p-6 shadow-soft">
      <label className="grid gap-2 text-sm font-medium">
        New password
        <Input name="password" type="password" autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" />
      </label>
      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <Submit label="Update password" />
    </form>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Working..." : label}</Button>;
}
