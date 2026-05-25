import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { MobileTopBar, MobileSearchTrigger, MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";

export function MarketingShell({
  children,
  showMobileSearch = false,
}: {
  children: ReactNode;
  showMobileSearch?: boolean;
}) {
  return (
    <>
      <Navbar />
      <MobileTopBar />
      {showMobileSearch && <MobileSearchTrigger />}
      <main id="main" className="overflow-hidden pb-24 md:pb-12">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
