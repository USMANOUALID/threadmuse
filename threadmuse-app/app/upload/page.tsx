import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { UploadForm } from "@/components/upload/upload-form";
import { getAllCategories } from "@/lib/queries";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Upload a design",
  description:
    "Share a design with the ThreadMuse community. We'll auto-tag it, generate a Pinterest pin, and link your Etsy shop for affiliate commissions.",
  path: "/upload",
  noIndex: true,
});

/**
 * /upload — the route is protected by `middleware.ts` (sends unauthenticated
 * users to `/login?redirect=/upload`). We fetch categories server-side so the
 * client form starts with a populated dropdown and no spinner.
 *
 * The UploadForm is a single client component that owns the entire form
 * (cover, gallery, fields, tags, submit). Visual layout mirrors Phase 2.
 */
export default async function UploadPage() {
  const categories = await getAllCategories();

  return (
    <PageShell showMobileSearch={false}>
      <UploadForm categories={categories} />

      <p className="mx-auto mt-10 max-w-[1440px] px-4 text-center text-[11px] text-muted sm:px-6 md:hidden">
        Tip: this page works best on desktop. We'll add a streamlined mobile flow in Phase 4.
      </p>
    </PageShell>
  );
}
