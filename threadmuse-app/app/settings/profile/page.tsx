import { SettingsShell } from "@/components/profile/settings-shell";
import { Button } from "@/components/ui/button";
import { getCurrentUserWithProfile } from "@/lib/auth/get-session";
import { updateProfileSettings } from "@/app/actions/settings";

export default async function ProfileSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [session, params] = await Promise.all([getCurrentUserWithProfile(), searchParams]);
  if (!session) return null;
  const { profile } = session;

  return (
    <SettingsShell>
      <form action={updateProfileSettings} className="grid gap-5 rounded-3xl border border-line/10 bg-surface p-6 shadow-soft">
        <div>
          <h2 className="font-display text-2xl font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-muted">Update your public profile, avatar, and creator metadata.</p>
        </div>
        {params.saved && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">Profile saved.</p>}
        {params.error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">Unable to save profile.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Username" name="username" defaultValue={profile.username} required />
          <Field label="Display name" name="name" defaultValue={profile.name} required />
          <Field label="Location" name="location" defaultValue={profile.location ?? ""} />
          <Field label="Website" name="website" defaultValue={profile.website ?? ""} />
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Bio
          <textarea name="bio" defaultValue={profile.bio ?? ""} rows={5} maxLength={500} className="resize-y rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm outline-none focus:border-accent" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Avatar image
          <input name="avatar" type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="rounded-xl border border-line/10 bg-bg p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
        </label>
        <Button type="submit">Save profile</Button>
      </form>
    </SettingsShell>
  );
}

function Field({ label, name, defaultValue, required }: { label: string; name: string; defaultValue: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input name={name} defaultValue={defaultValue} required={required} className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm outline-none focus:border-accent" />
    </label>
  );
}
