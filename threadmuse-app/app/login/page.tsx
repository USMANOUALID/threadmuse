import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { LoginForm } from "@/components/auth/login-form";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to ThreadMuse to save designs, follow creators, and upload your own.",
  path: "/login",
  noIndex: true,
});

/**
 * /login — server shell. The form itself is a client component so it can hold
 * `pending` state across the server action call without forcing the whole page
 * to be client-rendered.
 *
 * Already-signed-in users are bounced by `middleware.ts` before they get here.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;

  return (
    <PageShell showMobileSearch={false}>
      <section className="bg-bg px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-line/10 bg-surface p-8 shadow-soft">
            <h1 className="font-display text-h2 font-semibold text-ink">Welcome back</h1>
            <p className="mt-1.5 text-[13.5px] text-muted">
              Sign in to keep building your shop.
            </p>

            <LoginForm redirect={redirect} initialError={error} />
          </div>

          <p className="mt-5 text-center text-[13px] text-muted">
            New here?{" "}
            <Link
              href={`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="font-semibold text-ink underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
