"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Generate or retrieve persistent local visitor ID
    let visitorId = localStorage.getItem("vodafone_visitor_id");
    if (!visitorId) {
      visitorId = `vis_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      localStorage.setItem("vodafone_visitor_id", visitorId);
    }

    const sendPing = () => {
      fetch("/api/analytics/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          path: pathname || "/",
        }),
      }).catch(() => {});
    };

    // Send initial ping on route load
    sendPing();

    // Heartbeat ping every 40 seconds
    const interval = setInterval(sendPing, 40000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
