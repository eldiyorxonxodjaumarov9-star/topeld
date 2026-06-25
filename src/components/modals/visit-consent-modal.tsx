"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrCreateVisitorId } from "@/lib/visitor-id";

const CONSENT_KEY = "topeld-visit-consent";
const SHOW_DELAY_MS = 1400;

export function VisitConsentModal() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (sessionStorage.getItem(CONSENT_KEY)) return;
    setOpen(true);
  }, [ready]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const closeModal = useCallback((status: "accepted" | "declined") => {
    sessionStorage.setItem(CONSENT_KEY, status);
    setOpen(false);
  }, []);

  const handleEnter = async () => {
    setLoading(true);

    try {
      await fetch("/api/telegram/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: getOrCreateVisitorId(),
          path: window.location.pathname,
          referrer: document.referrer || "direct",
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screen: `${window.screen.width}x${window.screen.height}`,
        }),
      });
    } catch {
      // Allow entry even if notification fails.
    } finally {
      setLoading(false);
      closeModal("accepted");
    }
  };

  const handleCancel = () => {
    closeModal("declined");
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close welcome dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={handleCancel}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="visit-consent-title"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/25 ring-1 ring-slate-200/80"
          >
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-white/15">
                  <Globe className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange-100">
                    Welcome
                  </p>
                  <h2
                    id="visit-consent-title"
                    className="font-heading text-lg font-bold leading-tight"
                  >
                    TOP ELD SOLUTIONS
                  </h2>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <p className="text-base leading-relaxed text-slate-700">
                Would you like to enter our website and continue browsing?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                By selecting OK, you confirm that you want to access TOP ELD
                SOLUTIONS and view our services.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => void handleEnter()}
                  className="h-11 flex-1 rounded-xl bg-orange-600 font-semibold text-white hover:bg-orange-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    "OK, Enter Site"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={handleCancel}
                  className="h-11 flex-1 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
