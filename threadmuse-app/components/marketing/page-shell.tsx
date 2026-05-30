import { Suspense } from "react";
import { AnalyticsTracker } from "@/components/marketing/analytics-tracker";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export function MarketingPageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Suspense>
        <AnalyticsTracker />
      </Suspense>
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
