"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Minus, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatAccessCodeInput,
  validateAccessCode,
  type EldChatbotStep,
} from "@/lib/chatbot-storage";
import { getOrCreateVisitorId } from "@/lib/visitor-id";
import { cn } from "@/lib/utils";

type ViewState = "closed" | "minimized" | "open";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  createdAt: string;
};

const AUTO_OPEN_DELAY_MS = 1500;
const POLL_INTERVAL_MS = 2500;

export function EldChatbot() {
  const [view, setView] = useState<ViewState>("closed");
  const [step, setStep] = useState<EldChatbotStep>(1);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastPollRef = useRef<string | undefined>(undefined);
  const verifyLockRef = useRef(false);

  useEffect(() => {
    localStorage.removeItem("top-eld-chatbot");
    setSessionId(getOrCreateVisitorId());
    const timer = setTimeout(() => setView("open"), AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (step === "chat") scrollToBottom();
  }, [messages, step, scrollToBottom]);

  const pollMessages = useCallback(async () => {
    if (!sessionId || step !== "chat") return;

    try {
      const params = new URLSearchParams({ sessionId });
      if (lastPollRef.current) params.set("since", lastPollRef.current);

      const response = await fetch(`/api/telegram/chat/messages?${params}`);
      if (!response.ok) return;

      const payload = (await response.json()) as { messages?: ChatMessage[] };
      const incoming = payload.messages ?? [];
      if (incoming.length === 0) return;

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        const merged = [...prev];
        for (const msg of incoming) {
          if (!ids.has(msg.id)) merged.push(msg);
        }
        return merged.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      const latest = incoming[incoming.length - 1];
      lastPollRef.current = latest.createdAt;
    } catch {
      // silent poll failure
    }
  }, [sessionId, step]);

  useEffect(() => {
    if (view !== "open" || step !== "chat") return;

    void pollMessages();
    const timer = setInterval(() => void pollMessages(), POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [view, step, pollMessages]);

  const loadInitialMessages = useCallback(async (sid: string) => {
    try {
      const response = await fetch(
        `/api/telegram/chat/messages?sessionId=${encodeURIComponent(sid)}`
      );
      if (!response.ok) return;
      const payload = (await response.json()) as { messages?: ChatMessage[] };
      const list = payload.messages ?? [];
      setMessages(list);
      if (list.length > 0) {
        lastPollRef.current = list[list.length - 1].createdAt;
      }
    } catch {
      // ignore
    }
  }, []);

  const verifyAndEnterChat = useCallback(
    async (code: string) => {
      const validationError = validateAccessCode(code);
      if (validationError) {
        setError(validationError);
        return;
      }

      if (verifyLockRef.current || verifying) return;

      verifyLockRef.current = true;
      setVerifying(true);
      setError(null);

      try {
        const response = await fetch("/api/telegram/chat/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, sessionId }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(payload?.error ?? "Verification failed");
        }

        setStep("chat");
        setView("open");
        await loadInitialMessages(sessionId);
      } catch (err) {
        verifyLockRef.current = false;
        setError(
          err instanceof Error ? err.message : "Could not start chat. Try again."
        );
      } finally {
        setVerifying(false);
      }
    },
    [sessionId, verifying, loadInitialMessages]
  );

  const handleClose = () => setView("closed");
  const handleMinimize = () => setView("minimized");
  const handleOpen = () => setView("open");

  const handleYes = () => {
    setStep(2);
    setError(null);
    setAccessCode("");
    verifyLockRef.current = false;
  };

  const handleNoThanks = () => {
    setView("minimized");
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyAndEnterChat(accessCode);
  };

  const handleCodeChange = (value: string) => {
    const formatted = formatAccessCodeInput(value);
    setAccessCode(formatted);
    if (error) setError(validateAccessCode(formatted));

    if (formatted.length === 6 && step === 2) {
      void verifyAndEnterChat(formatted);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);
    setDraft("");

    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const response = await fetch("/api/telegram/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, text }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Send failed");
      }

      const payload = (await response.json()) as { message?: ChatMessage };
      if (payload.message) {
        setMessages((prev) => {
          const withoutOptimistic = prev.filter((m) => m.id !== optimistic.id);
          return [...withoutOptimistic, payload.message!];
        });
        lastPollRef.current = payload.message.createdAt;
      }

      void pollMessages();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setDraft(text);
      setError("Could not send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const showStep2 = step === 2;
  const showChat = step === "chat";

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
            className={cn(
              "pointer-events-auto flex w-full max-w-[380px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl shadow-orange-900/20 backdrop-blur-xl",
              showChat && "h-[min(520px,calc(100dvh-2rem))]"
            )}
          >
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3">
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

            <div className={cn("flex min-h-0 flex-1 flex-col", !showChat && "p-4")}>
              <AnimatePresence mode="wait">
                {!showStep2 && !showChat ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4"
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
                ) : showStep2 ? (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="p-4"
                  >
                    <p className="font-heading text-base font-semibold text-slate-900">
                      Enter your 6-digit code
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Enter any 6-digit code — chat opens automatically.
                    </p>
                    <form onSubmit={handleVerifyCode} className="mt-4 space-y-3">
                      <div>
                        <Input
                          type="text"
                          inputMode="numeric"
                          autoFocus
                          value={accessCode}
                          onChange={(e) => handleCodeChange(e.target.value)}
                          placeholder="000000"
                          maxLength={6}
                          disabled={verifying}
                          aria-invalid={!!error}
                          className={cn(
                            "h-11 rounded-xl border-slate-200 bg-white/80 text-center font-mono text-lg tracking-[0.35em]",
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
                          {verifying
                            ? "Opening chat..."
                            : `${accessCode.length}/6 digits`}
                        </p>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-0 flex-1 flex-col"
                  >
                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/80 px-4 py-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            message.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                              message.role === "user"
                                ? "rounded-br-md bg-gradient-to-r from-orange-500 to-orange-400 text-white"
                                : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                            )}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    <form
                      onSubmit={handleSendMessage}
                      className="shrink-0 border-t border-slate-200 bg-white p-3"
                    >
                      {error && showChat && (
                        <p className="mb-2 text-xs text-red-600">{error}</p>
                      )}
                      <div className="flex gap-2">
                        <Input
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder="Type a message..."
                          maxLength={2000}
                          disabled={sending}
                          className="h-10 flex-1 rounded-xl border-slate-200 bg-slate-50"
                        />
                        <Button
                          type="submit"
                          disabled={!draft.trim() || sending}
                          aria-label="Send message"
                          className="size-10 shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 p-0 text-white hover:from-orange-500 hover:to-orange-300 disabled:opacity-50"
                        >
                          <Send className="size-4" />
                        </Button>
                      </div>
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
