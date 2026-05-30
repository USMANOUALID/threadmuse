import { SettingsShell } from "@/components/profile/settings-shell";
import { Button } from "@/components/ui/button";
import { deleteAccount, updateAccountEmail } from "@/app/actions/settings";
import { getCurrentUser } from "@/lib/auth/get-session";

export default async function AccountSettingsPage({ searchParams }: { searchParams: Promise<{ email?: string; password?: string; error?: string }> }) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  if (!user) return null;

  return (
    <SettingsShell>
      <div className="grid gap-6">
        <form action={updateAccountEmail} className="grid gap-5 rounded-3xl border border-line/10 bg-surface p-6 shadow-soft">
          <div>
            <h2 className="font-display text-2xl font-semibold">Account email</h2>
            <p className="mt-1 text-sm text-muted">Supabase will send a confirmation email when this changes.</p>
          </div>
          {params.email && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">Email update requested.</p>}
          {params.password && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">Password updated.</p>}
          {params.error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">Unable to update account.</p>}
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input name="email" type="email" defaultValue={user.email ?? ""} required className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm outline-none focus:border-accent" />
          </label>
          <Button type="submit">Update email</Button>
        </form>

        <form action={deleteAccount} className="grid gap-4 rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
          <h2 className="font-display text-2xl font-semibold">Delete account</h2>
          <p className="text-sm leading-6 text-muted">This soft-deletes your profile and signs you out. Contact support for full data removal.</p>
          <Button type="submit" variant="destructive">Delete my account</Button>
        </form>
      </div>
    </SettingsShell>
  );
}
