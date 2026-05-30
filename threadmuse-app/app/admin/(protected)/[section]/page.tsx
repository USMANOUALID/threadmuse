import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus, Save } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { adminSections, type AdminSectionKey } from "@/lib/saas-content";

export const metadata: Metadata = {
  title: "Admin CMS · NoirEdge",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return Object.keys(adminSections).map((section) => ({ section }));
}

function isAdminSectionKey(section: string): section is AdminSectionKey {
  return section in adminSections;
}

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!isAdminSectionKey(section)) {
    notFound();
  }

  const config = adminSections[section];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">CMS</p>
          <h1 className="mt-2 font-display text-display font-semibold">{config.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{config.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="size-4" />
            New item
          </Button>
          <Button>
            <Save className="size-4" />
            Save draft
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-line/10 bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Content editor</h2>
              <p className="mt-1 text-sm text-muted">Structured fields ready to bind to Supabase CMS records.</p>
            </div>
          </div>
          <form className="mt-6 grid gap-4">
            {config.fields.map((field, index) => (
              <label key={field} className="grid gap-2 text-sm font-medium">
                {field}
                {index === 3 ? (
                  <textarea
                    rows={4}
                    defaultValue={config.rows[index % config.rows.length]}
                    className="resize-none rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-accent"
                  />
                ) : (
                  <input
                    defaultValue={config.rows[index % config.rows.length]}
                    className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-accent"
                  />
                )}
              </label>
            ))}
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-line/10 bg-surface p-6">
            <h2 className="font-display text-2xl font-semibold">Records</h2>
            <div className="mt-5 space-y-3">
              {config.rows.map((row) => (
                <div key={row} className="rounded-2xl border border-line/10 bg-bg p-4">
                  <p className="text-sm font-semibold">{row}</p>
                  <p className="mt-1 text-xs text-muted">Published · updated recently</p>
                </div>
              ))}
            </div>
          </section>
          {section === "media" && <ImageUploader />}
        </aside>
      </div>
    </div>
  );
}
