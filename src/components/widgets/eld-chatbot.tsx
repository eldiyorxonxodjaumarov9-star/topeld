"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Check, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_CHATBOT_DATA,
  formatUsdotInput,
  loadChatbotData,
  saveChatbotData,
  validateUsdot,
  type EldChatbotData,
} from "@/lib/chatbot-storage";
import { cn } from "@/lib/utils";

type ViewState = "closed" | "minimized" | "open";

const AUTO_OPEN_DELAY_MS = 1500;

export function EldChatbot() {
  const [view, setView] = useState<ViewState>("closed");
  const [data, setData] = useState<EldChatbotData>(DEFAULT_CHATBOT_DATA);
  const [usdot, setUsdot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const saved = loadChatbotData();
    setUsdot(saved.usdot);
    setSubmitted(false);
    setData({ ...DEFAULT_CHATBOT_DATA, usdot: saved.usdot });

    const timer = setTimeout(() => setView("open"), AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const persist = useCallback((patch: Partial<EldChatbotData>) => {
    const next = saveChatbotData(patch);
    setData(next);
    return next;
  }, []);

  const handleClose = () => {
    setView("closed");
  };

  const handleMinimize = () => {
    setView("minimized");
  };

  const handleOpen = () => {
    setView("open");
  };

  const handleYes = () => {
    persist({ acceptedBonus: true, step: 2 });
    setError(null);
  };

  const handleNoThanks = () => {
    persist({ acceptedBonus: false });
    setView("minimized");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateUsdot(usdot);
    if (validationError) {
      setError(validationError);
      return;
    }

    const formatted = formatUsdotInput(usdot);
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/telegram/usdot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usdot: formatted }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Send failed");
      }

      persist({
        usdot: formatted,
        step: "submitted",
        submittedAt: new Date().toISOString(),
      });
      setUsdot(formatted);
      setSubmitted(true);
    } catch {
      setError(
        "Could not send your USDOT. Please try again or call us directly."
      );
    } finally {
      setSending(false);
    }
  };

  const handleUsdotChange = (value: string) => {
    const formatted = formatUsdotInput(value);
    setUsdot(formatted);
    persist({ usdot: formatted });
    if (error) setError(validateUsdot(formatted));
  };

  const step = data.step;
  const showStep2 = step === 2;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-3 p-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end sm:p-0">
      <AnimatePresence mode="wait">
        {(view === "closed" || view === "minimized") && (
          <motion.button
            key="fab"
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            aria-label="Open TOP ELD BOT"
            className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-500 text-white shadow-xl shadow-orange-500/40 ring-4 ring-white/20"
          >
            <Bot className="size-7" />
            {view === "minimized" && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex size-4 rounded-full bg-orange-500 ring-2 ring-white" />
              </span>
            )}
          </motion.button>
        )}

        {view === "open" && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl shadow-orange-900/20 backdrop-blur-xl"
          >
            {/* Green header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-white/20">
                  <Bot className="size-4 text-white" />
                </div>
                <h3 className="font-heading text-sm font-bold tracking-wide text-white">
                  TOP ELD BOT
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleMinimize}
                  aria-label="Minimize chat"
                  className="flex size-8 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/20"
                >
                  <Minus className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close chat"
                  className="flex size-8 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/20"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                {submitted || step === "submitted" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="py-4 text-center"
                  >
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                      <Check className="size-6" />
                    </div>
                    <p className="font-heading font-semibold text-slate-900">
                      Thank you!
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      USDOT <span className="font-mono font-semibold">{usdot}</span>{" "}
                      received. Our team will contact you about your bonus.
                    </p>
                  </motion.div>
                ) : !showStep2 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-xl border border-orange-100 bg-orange-50/80 p-4">
                      <p className="text-sm leading-relaxed text-slate-700">
                        You&apos;ve got a{" "}
                        <span className="font-semibold text-orange-600">BONUS</span>:
                        <br />
                        <span className="mt-1 block font-medium text-slate-900">
                          FREE Safety Score Check and $200 Service Credit
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="button"
                        onClick={handleYes}
                        className="h-10 flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 font-semibold text-white shadow-md shadow-orange-500/25 hover:from-orange-500 hover:to-orange-300"
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleNoThanks}
                        className="h-10 flex-1 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        No thanks
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-heading text-base font-semibold text-slate-900">
                      Enter your USDOT number
                    </p>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                      <div>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={usdot}
                          onChange={(e) => handleUsdotChange(e.target.value)}
                          placeholder="USDOT (7 digits)"
                          maxLength={7}
                          aria-invalid={!!error}
                          className={cn(
                            "h-11 rounded-xl border-slate-200 bg-white/80 font-mono text-base tracking-wider",
                            error && "border-red-400 focus-visible:ring-red-200"
                          )}
                        />
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1.5 text-xs text-red-600"
                          >
                            {error}
                          </motion.p>
                        )}
                        <p className="mt-1.5 text-xs text-slate-500">
                          {usdot.length}/7 digits
                        </p>
                      </div>
                      <Button
                        type="submit"
                        disabled={usdot.length !== 7 || sending}
                        className="h-11 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 font-semibold text-white shadow-md shadow-orange-500/25 hover:from-orange-500 hover:to-orange-300 disabled:opacity-50"
                      >
                        {sending ? "Sending..." : "Submit"}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
