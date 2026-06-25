"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "topeld_visit_notified_v1";

export function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    const notifyVisit = async () => {
      try {
        const response = await fetch("/api/telegram/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname || "/",
          }),
          keepalive: true,
        });

        if (response.ok) {
          sessionStorage.setItem(SESSION_KEY, "1");
        }
      } catch {
        // Silent fail — visitor experience should not be affected.
      }
    };

    const timer = window.setTimeout(() => {
      void notifyVisit();
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
