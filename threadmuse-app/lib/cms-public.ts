import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { blogPosts, faqs, pricingPlans, services, testimonials } from "@/lib/saas-content";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function publicClient() {
  if (!hasSupabaseEnv()) return null;
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getPublicServices() {
  const supabase = publicClient();
  if (!supabase) return [...services];
  const { data } = await supabase.from("services").select("slug,title,description,deliverables").eq("is_published", true).order("display_order");
  return data?.length ? data : [...services];
}

export async function getPublicPricingPlans() {
  const supabase = publicClient();
  if (!supabase) return [...pricingPlans];
  const { data } = await supabase.from("pricing_plans").select("slug,name,price,cadence,description,features,cta_label,is_featured").eq("is_published", true).order("display_order");
  return data?.length
    ? data.map((plan) => ({ ...plan, cta: plan.cta_label, featured: plan.is_featured }))
    : [...pricingPlans];
}

export async function getPublicTestimonials() {
  const supabase = publicClient();
  if (!supabase) return [...testimonials];
  const { data } = await supabase.from("testimonials").select("quote,name,role,company,avatar_url").eq("is_featured", true).order("display_order");
  return data?.length ? data : [...testimonials];
}

export async function getPublicFaqs() {
  const supabase = publicClient();
  if (!supabase) return [...faqs];
  const { data } = await supabase.from("faq_items").select("question,answer,category").eq("is_published", true).order("display_order");
  return data?.length ? data : [...faqs];
}

export async function getPublicBlogPosts() {
  const supabase = publicClient();
  if (!supabase) return [...blogPosts];
  const { data } = await supabase
    .from("blog_posts")
    .select("slug,title,excerpt,category,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data?.length
    ? data.map((post) => ({
        ...post,
        readTime: "6 min read",
        date: post.published_at ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(post.published_at)) : "Draft",
      }))
    : [...blogPosts];
}
