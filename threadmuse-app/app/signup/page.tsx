import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create an account",
  description: "Join ThreadMuse to share your designs and earn from your Etsy shop.",
  path: "/signup",
  noIndex: true,
});

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <PageShell showMobileSearch={false}>
      <section className="bg-bg px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-line/10 bg-surface p-8 shadow-soft">
            <h1 className="font-display text-h2 font-semibold text-ink">Create an account</h1>
            <p className="mt-1.5 text-[13.5px] text-muted">
              Free forever for makers. Upgrade when your shop takes off.
            </p>

            <SignupForm redirect={redirect} />
          </div>

          <p className="mt-5 text-center text-[13px] text-muted">
            Already a maker?{" "}
            <Link
              href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="font-semibold text-ink underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
