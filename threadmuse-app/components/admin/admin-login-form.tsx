"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        setError(loginError.message);
        return;
      }
      router.push(searchParams.get("redirect") ?? "/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-line/10 bg-surface p-6 shadow-lift">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Lock className="size-5" />
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold">Admin login</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Sign in with a Supabase Auth account that has an admin role.
        </p>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Password
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </label>
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}
      <Button type="submit" size="lg" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Sign in securely
      </Button>
    </form>
  );
}
