import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign-in problem",
  description: "We couldn't complete your sign-in.",
  path: "/auth/auth-code-error",
  noIndex: true,
});

/**
 * Landing page after a failed OAuth / email-confirm code exchange. Surfaces
 * the message from Supabase (passed through by the callback handler) so a
 * support ticket can be opened with real signal.
 */
export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; message?: string }>;
}) {
  const { reason, message } = await searchParams;

  return (
    <MarketingShell>
      <section className="bg-bg px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-md rounded-2xl border border-line/10 bg-surface p-8 shadow-soft">
          <h1 className="font-display text-h2 font-semibold text-ink">
            We couldn't complete sign-in
          </h1>
          <p className="mt-3 text-[14px] text-muted">
            The link you used has expired or was already used. This sometimes happens with email
            confirmation links that get clicked twice, or when an OAuth provider rejects the
            handshake.
          </p>

          {(reason || message) && (
            <div className="mt-4 rounded-md border border-line/10 bg-warm px-3 py-2.5 text-[12.5px] text-ink/80">
              <div className="font-semibold uppercase tracking-wide text-[10.5px] text-muted">
                Detail
              </div>
              <div className="mt-0.5">
                {reason ? `${reason}` : null}
                {reason && message ? " — " : null}
                {message}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <Button asChild>
              <Link href="/free-trial">Request help</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
