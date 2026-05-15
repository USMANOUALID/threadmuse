import { redirect } from "next/navigation";
import { getCurrentUserWithProfile } from "@/lib/auth/get-session";

/**
 * /profile is the "your profile" entry from the mobile nav and the desktop
 * avatar link. Now that auth is wired we resolve the actual session and
 * redirect to `/profile/<username>`; unauthenticated visitors are sent to
 * `/login?redirect=/profile` so they land on their own profile after signing in.
 */
export default async function ProfileIndexRedirect() {
  const session = await getCurrentUserWithProfile();
  if (!session) {
    redirect("/login?redirect=/profile");
  }
  redirect(`/profile/${session.profile.username}`);
}
