import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ContactForm } from "@/components/marketing/contact-form";
import { buildMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Contact NoirEdge to build a premium SaaS website, CMS, AI automation, and admin dashboard.",
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; queued?: string; newsletter?: string }>;
}) {
  const params = await searchParams;

  return (
    <MarketingPageShell>
      <section className="container grid gap-12 py-20 md:py-28 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Tell us what premium system you want to launch."
            description="Your request is stored in Supabase contact messages for secure admin review."
          />
          {(params.sent === "1" || params.queued === "1" || params.newsletter === "1") && (
            <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/10 p-4 text-sm text-accent">
              Thanks. Your request was received and routed to the admin dashboard.
            </div>
          )}
          <div className="mt-8 grid gap-4">
            {[
              { icon: Mail, label: "Email", value: siteConfig.email },
              { icon: MessageSquare, label: "Response", value: "Private strategy reply within one business cycle" },
              { icon: MapPin, label: "Location", value: "Remote-first, serving global SaaS teams" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4 rounded-2xl border border-line/10 bg-surface p-4">
                <Icon className="size-5 text-accent" />
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-1 text-sm text-muted">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ContactForm redirectTo="/contact" />
      </section>
    </MarketingPageShell>
  );
}
