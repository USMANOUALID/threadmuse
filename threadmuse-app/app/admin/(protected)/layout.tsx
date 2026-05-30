import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const role = String(profile?.role ?? adminRole?.role ?? "member");
  const allowed = Boolean(profile?.is_admin) || ["owner", "admin", "editor"].includes(role) || Boolean(adminRole);

  if (!allowed) {
    redirect("/admin/login?error=forbidden");
  }

  return <AdminShell adminEmail={user.email}>{children}</AdminShell>;
}
