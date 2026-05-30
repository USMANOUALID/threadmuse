"use client";

import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";

function getVisitorId() {
  const key = "noiredge_visitor_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const visitorId = getVisitorId();
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventName: "page_view", path, visitorId, metadata: { referrer: document.referrer || null } }),
      keepalive: true,
    });
  }, [pathname, searchParams]);

  return null;
}
