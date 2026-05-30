import { MessageCircle } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function MessagesPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("messages").select("id,subject,body,is_read,created_at").order("created_at", { ascending: false }).limit(50);

  return (
    <PageShell showMobileSearch={false}>
      <section className="bg-bg px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent"><MessageCircle className="size-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Inbox</p>
              <h1 className="font-display text-display font-semibold text-ink">Messages</h1>
            </div>
          </div>
          <div className="space-y-3">
            {(data ?? []).map((item) => (
              <article key={item.id} className="rounded-2xl border border-line/10 bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-ink">{item.subject}</h2>
                  {!item.is_read && <span className="rounded-full bg-accent px-2 py-1 text-xs font-semibold text-white">New</span>}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </article>
            ))}
            {(data ?? []).length === 0 && <p className="rounded-3xl border border-line/10 bg-surface p-8 text-center text-sm text-muted">No messages yet.</p>}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
