"use client";

import { useEffect } from "react";

const SESSION_KEY = "topeld-visit-notified";

export function VisitNotifier() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, "1");

    const referrer = document.referrer || "direct";

    void fetch("/api/telegram/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer,
      }),
      keepalive: true,
    }).catch(() => {
      sessionStorage.removeItem(SESSION_KEY);
    });
  }, []);

  return null;
}
