import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Login",
  description: "Secure admin login for the NoirEdge CMS dashboard.",
  path: "/admin/login",
  noIndex: true,
});

export default function AdminLoginPage() {
  return (
    <main className="premium-grid grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-accent/35 bg-accent/15 font-black text-accent">
            N
          </span>
          <span className="font-display text-xl font-semibold">NoirEdge</span>
        </Link>
        <Suspense>
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  );
}
