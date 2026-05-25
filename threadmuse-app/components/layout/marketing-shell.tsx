import type { ReactNode } from "react";
import Link from "next/link";
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
      <div className="fixed bottom-20 right-4 z-40 hidden md:block">
        <Link
          href="/free-trial"
          className="inline-flex items-center justify-center rounded-full border border-accent/40 bg-gradient-to-r from-accent to-accent-2 px-5 py-3 text-sm font-bold text-white shadow-cta transition hover:-translate-y-0.5 hover:brightness-110"
        >
          Start 24h free trial
        </Link>
      </div>
      <Footer />
      <MobileNav />
    </>
  );
}
