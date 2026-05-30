import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import { rateLimit } from "@/lib/rate-limit";

const eventSchema = z.object({
  eventName: z.string().min(1).max(120).default("page_view"),
  path: z.string().min(1).max(500).optional(),
  visitorId: z.string().max(200).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!rateLimit(`analytics:${parsed.data.visitorId ?? request.headers.get("x-forwarded-for") ?? "anon"}`, 120, 60 * 1000).ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("analytics_events").insert({
      event_name: parsed.data.eventName,
      path: parsed.data.path ?? request.nextUrl.pathname,
      visitor_id: parsed.data.visitorId ?? request.headers.get("x-vercel-id") ?? null,
      metadata: (parsed.data.metadata ?? {}) as Json,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
