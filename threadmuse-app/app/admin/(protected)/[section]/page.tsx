import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Database, Plus, Save, Search, Trash2 } from "lucide-react";
import { createCmsRecord, deleteCmsRecord, updateCmsRecord } from "@/app/actions/admin-cms";
import { ImageUploader } from "@/components/admin/image-uploader";
import { CmsFieldControl } from "@/components/admin/cms-field";
import { Button } from "@/components/ui/button";
import { cmsSections, isCmsSectionKey, type CmsRecord } from "@/lib/admin/cms-config";
import { displayValue, getCmsRecords } from "@/lib/admin/cms-data";

export const metadata: Metadata = {
  title: "Admin CMS · NoirEdge",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return Object.keys(cmsSections).map((section) => ({ section }));
}

function recordKey(record: CmsRecord, primaryKey: string) {
  return String(record[primaryKey] ?? "");
}

function alertClass(type: "success" | "error") {
  return type === "success"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
    : "border-red-500/30 bg-red-500/10 text-red-200";
}

export default async function AdminSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  const [{ section }, query] = await Promise.all([params, searchParams]);

  if (!isCmsSectionKey(section)) {
    notFound();
  }

  const config = cmsSections[section];
  const { records, error } = await getCmsRecords(section, query.q ?? "");

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">CMS</p>
          <h1 className="mt-2 font-display text-display font-semibold">{config.label}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{config.description}</p>
        </div>
        <form action={`/admin/${section}`} className="flex min-w-0 gap-2">
          <div className="relative min-w-0 flex-1 md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              name="q"
              defaultValue={query.q ?? ""}
              placeholder="Search records..."
              className="h-11 w-full rounded-xl border border-line/10 bg-surface pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <Button variant="outline" type="submit">Search</Button>
        </form>
      </div>

      {(query.saved || query.deleted || query.error || error) && (
        <div className={`rounded-2xl border p-4 text-sm ${alertClass(query.error || error ? "error" : "success")}`}>
          {query.error ? decodeURIComponent(query.error) : error ?? (query.deleted ? "Record deleted." : "Record saved.")}
        </div>
      )}

      {section === "analytics" && <AnalyticsSummary records={records} />}
      {section === "media" && <ImageUploader />}

      {config.createEnabled !== false && (
        <section className="rounded-3xl border border-line/10 bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Plus className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold">{config.createLabel}</h2>
              <p className="text-sm text-muted">Create a real Supabase record in <code>{config.table}</code>.</p>
            </div>
          </div>
          <form action={createCmsRecord} className="mt-6 grid gap-4 lg:grid-cols-2">
            <input type="hidden" name="section" value={section} />
            {config.fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" || field.type === "json" || field.type === "array" ? "lg:col-span-2" : undefined}>
                <CmsFieldControl field={field} value={field.type === "boolean" ? true : ""} />
              </div>
            ))}
            <div className="lg:col-span-2">
              <Button type="submit" size="lg">
                <Save className="size-4" />
                Create record
              </Button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-3xl border border-line/10 bg-surface p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Records</h2>
            <p className="mt-1 text-sm text-muted">{records.length} records loaded from Supabase.</p>
          </div>
          <Database className="size-5 text-accent" />
        </div>

        <div className="mt-6 space-y-5">
          {records.map((record) => (
            <article key={recordKey(record, config.primaryKey)} className="rounded-3xl border border-line/10 bg-bg p-5">
              <div className="grid gap-3 border-b border-line/10 pb-4 md:grid-cols-2 xl:grid-cols-4">
                {config.listFields.map((field) => (
                  <div key={field} className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted">{field.replaceAll("_", " ")}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-ink">{displayValue(record[field])}</p>
                  </div>
                ))}
              </div>

              {section === "media" && typeof record.public_url === "string" && (
                <Image src={record.public_url} alt={String(record.alt_text ?? "CMS media asset")} width={640} height={320} unoptimized className="mt-4 max-h-56 rounded-2xl border border-line/10 object-cover" />
              )}

              <form action={updateCmsRecord} className="mt-5 grid gap-4 lg:grid-cols-2">
                <input type="hidden" name="section" value={section} />
                <input type="hidden" name="id" value={recordKey(record, config.primaryKey)} />
                {config.fields.map((field) => {
                  const forceReadonly = field.name === config.primaryKey;
                  return (
                    <div key={field.name} className={field.type === "textarea" || field.type === "json" || field.type === "array" ? "lg:col-span-2" : undefined}>
                      <CmsFieldControl field={field} value={record[field.name]} forceReadonly={forceReadonly} />
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-2 lg:col-span-2">
                  <Button type="submit">
                    <Save className="size-4" />
                    Save changes
                  </Button>
                </div>
              </form>

              {config.deleteEnabled !== false && (
                <form action={deleteCmsRecord} className="mt-3">
                  <input type="hidden" name="section" value={section} />
                  <input type="hidden" name="id" value={recordKey(record, config.primaryKey)} />
                  <Button type="submit" variant="destructive" size="sm">
                    <Trash2 className="size-4" />
                    Delete record
                  </Button>
                </form>
              )}
            </article>
          ))}

          {records.length === 0 && (
            <div className="rounded-3xl border border-dashed border-line/15 bg-bg p-10 text-center">
              <h3 className="font-display text-2xl font-semibold">No records yet</h3>
              <p className="mt-2 text-sm text-muted">Create the first record above or apply the Supabase seed migration.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function AnalyticsSummary({ records }: { records: CmsRecord[] }) {
  const events = records.reduce<Record<string, number>>((acc, record) => {
    const name = String(record.event_name ?? "unknown");
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl border border-line/10 bg-surface p-5">
        <p className="text-sm text-muted">Tracked events</p>
        <p className="mt-2 font-display text-4xl font-semibold">{records.length}</p>
      </div>
      <div className="rounded-3xl border border-line/10 bg-surface p-5">
        <p className="text-sm text-muted">Unique event names</p>
        <p className="mt-2 font-display text-4xl font-semibold">{Object.keys(events).length}</p>
      </div>
      <div className="rounded-3xl border border-line/10 bg-surface p-5">
        <p className="text-sm text-muted">Top event</p>
        <p className="mt-2 truncate font-display text-2xl font-semibold">{Object.entries(events).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-"}</p>
      </div>
    </section>
  );
}
