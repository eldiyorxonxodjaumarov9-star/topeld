"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  privacyAccepted: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  fullName: "",
  phone: "",
  email: "",
  privacyAccepted: false,
};

function validateForm(data: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  const phoneDigits = data.phone.replace(/\D/g, "");
  if (!phoneDigits) {
    errors.phone = "Phone number is required.";
  } else if (phoneDigits.length < 10) {
    errors.phone = "Enter a valid US phone number.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.privacyAccepted) {
    errors.privacyAccepted = "You must accept the Privacy Policy.";
  }

  return errors;
}

type ContactUsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
  onRegistered: () => void;
};

const fieldClass =
  "h-11 rounded-lg border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/15";

export function ContactUsModal({
  isOpen,
  onClose,
  onDismiss,
  onRegistered,
}: ContactUsModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSuccess(false);
    setLoading(false);
    setSubmitError(null);
  }, []);

  const handleDismiss = useCallback(() => {
    onDismiss();
    setTimeout(resetForm, 300);
  }, [onDismiss, resetForm]);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(resetForm, 300);
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleDismiss]);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/telegram/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Send failed");
      }

      onRegistered();
      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not send message. Please try again or call us."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close modal overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="relative w-full max-w-[560px] overflow-hidden rounded-2xl bg-[#f7f7f5] shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200/70"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex size-8 items-center justify-center text-orange-600 transition-colors hover:text-orange-700"
            >
              <X className="size-5 stroke-[2.5]" />
            </button>

            <div className="max-h-[90vh] overflow-y-auto px-6 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-9">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <svg
                      className="size-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-slate-900">
                    Message Sent!
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    We&apos;ll get in touch within one business day.
                  </p>
                  <Button
                    type="button"
                    onClick={handleClose}
                    className="mt-8 h-11 rounded-lg bg-orange-600 px-8 font-semibold text-white hover:bg-orange-700"
                  >
                    Done
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="pr-10">
                    <h2
                      id="contact-modal-title"
                      className="font-heading text-[1.65rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-[1.85rem]"
                    >
                      Get In Touch{" "}
                      <span className="text-orange-600">with Us</span>
                    </h2>
                    <p className="mt-2.5 max-w-md text-sm leading-relaxed text-slate-500">
                      Tell us a bit about yourself and we&apos;ll get in touch
                      within one business day.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-7">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="modal-fullName"
                          className="text-sm font-normal text-slate-600"
                        >
                          Full name <span className="text-slate-500">*</span>
                        </Label>
                        <Input
                          id="modal-fullName"
                          value={form.fullName}
                          onChange={(e) =>
                            updateField("fullName", e.target.value)
                          }
                          placeholder="e.g. John"
                          disabled={loading}
                          aria-invalid={!!errors.fullName}
                          className={cn(
                            fieldClass,
                            errors.fullName && "border-red-400"
                          )}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-red-600">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="modal-phone"
                          className="text-sm font-normal text-slate-600"
                        >
                          Phone number <span className="text-slate-500">*</span>
                        </Label>
                        <Input
                          id="modal-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+1 000 000 0000"
                          disabled={loading}
                          aria-invalid={!!errors.phone}
                          className={cn(
                            fieldClass,
                            errors.phone && "border-red-400"
                          )}
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-600">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      <Label
                        htmlFor="modal-email"
                        className="text-sm font-normal text-slate-600"
                      >
                        Email
                      </Label>
                      <Input
                        id="modal-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="example@abc.com"
                        disabled={loading}
                        aria-invalid={!!errors.email}
                        className={cn(
                          fieldClass,
                          errors.email && "border-red-400"
                        )}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className="flex cursor-pointer items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={form.privacyAccepted}
                          onChange={(e) =>
                            updateField("privacyAccepted", e.target.checked)
                          }
                          disabled={loading}
                          className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-orange-600 focus:ring-orange-500/30"
                        />
                        <span className="text-sm leading-relaxed text-slate-500">
                          I have read and accept the Privacy Policy
                        </span>
                      </label>
                      {errors.privacyAccepted && (
                        <p className="mt-1.5 text-xs text-red-600">
                          {errors.privacyAccepted}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {submitError}
                      </p>
                    )}

                    <div className="mt-7 flex justify-end">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="h-11 gap-2 rounded-lg bg-orange-600 px-5 text-sm font-semibold text-white shadow-none hover:bg-orange-700 disabled:opacity-70"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowUpRight className="size-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
