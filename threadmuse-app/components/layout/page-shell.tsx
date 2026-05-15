import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { MobileTopBar, MobileSearchTrigger, MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { SubscriptionBanner } from "@/components/billing/subscription-banner";
import { getCurrentUserWithProfile } from "@/lib/auth/get-session";
import { cn } from "@/lib/utils";

/**
 * Standard page chrome composition.
 *
 *  <PageShell>
 *    <main>…</main>
 *  </PageShell>
 *
 * Renders:
 *   ─ Desktop top navbar
 *   ─ Mobile top bar + (optional) sticky search trigger
 *   ─ Subscription banner (past_due / scheduled-to-cancel)
 *   ─ children
 *   ─ Footer (desktop) / sticky mobile tab bar
 *
 * The current user is resolved server-side once and passed into both navbars.
 * `getCurrentUserWithProfile` is wrapped in React `cache()` so concurrent
 * server components on the same page still only do one round-trip.
 *
 * Pages can opt out of the mobile search trigger (post detail, upload).
 */
export async function PageShell({
  children,
  className,
  showMobileSearch = true,
  hideFooter = false,
}: {
  children: React.ReactNode;
  className?: string;
  showMobileSearch?: boolean;
  hideFooter?: boolean;
}) {
  const session = await getCurrentUserWithProfile();
  const currentUser = session
    ? {
        username: session.profile.username,
        name: session.profile.name,
        avatarUrl: session.profile.avatar_url,
      }
    : null;

  return (
    <>
      <Navbar currentUser={currentUser} />
      <MobileTopBar currentUser={currentUser} />
      {showMobileSearch && <MobileSearchTrigger />}
      <SubscriptionBanner />

      <main id="main" className={cn("pb-24 md:pb-12", className)}>
        {children}
      </main>

      {!hideFooter && <Footer />}
      <MobileNav />
    </>
  );
}
