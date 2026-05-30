"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  company: z.string().max(160).optional(),
  budget: z.string().max(80).optional(),
  message: z.string().min(10).max(4000),
  redirectTo: z.string().optional(),
});

const newsletterSchema = z.object({
  email: z.string().email().max(160),
  source: z.string().max(120).optional(),
  redirectTo: z.string().optional(),
});

function safeRedirect(path: string | undefined, fallback: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}

export async function submitContactMessage(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    budget: formData.get("budget") || undefined,
    message: formData.get("message"),
    redirectTo: formData.get("redirectTo") || undefined,
  });

  const destination = safeRedirect(parsed.data?.redirectTo, "/contact");

  if (parsed.success) {
    try {
      const supabase = await createServerSupabaseClient();
      await supabase.from("contact_messages").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company ?? null,
        budget: parsed.data.budget ?? null,
        message: parsed.data.message,
        status: "new",
        source: "website",
      });
    } catch (error) {
      console.error("Failed to store contact message", error);
      redirect(`${destination}?queued=1`);
    }
  }

  redirect(`${destination}?sent=${parsed.success ? "1" : "0"}`);
}

export async function subscribeToNewsletter(formData: FormData) {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    source: formData.get("source") || "website",
    redirectTo: formData.get("redirectTo") || undefined,
  });

  const destination = safeRedirect(parsed.data?.redirectTo, "/contact");

  if (parsed.success) {
    try {
      const supabase = await createServerSupabaseClient();
      await supabase.from("newsletter_subscribers").upsert(
        {
          email: parsed.data.email,
          source: parsed.data.source ?? "website",
          status: "active",
        },
        { onConflict: "email" },
      );
    } catch (error) {
      console.error("Failed to store newsletter subscription", error);
      redirect(`${destination}?newsletter=queued`);
    }
  }

  redirect(`${destination}?newsletter=${parsed.success ? "1" : "0"}`);
}
