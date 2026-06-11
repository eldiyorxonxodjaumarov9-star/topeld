"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ContactUsModal } from "@/components/modals/contact-us-modal";
import {
  isContactRegistered,
  markContactRegistered,
} from "@/lib/contact-storage";

/** X bosilganda qayta ochilish vaqti (ms) */
const DISMISS_RETRY_MS = 50_000;

type ContactModalContextValue = {
  isOpen: boolean;
  openModal: () => void;
  /** About scroll kabi avtomatik trigger — faqat ro‘yxatdan o‘tmaganlar uchun */
  openModalAuto: () => void;
  closeModal: () => void;
  dismissModal: () => void;
  completeRegistration: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(
  null
);

export function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  /** Qo‘lda bosilganda har doim ochiladi */
  const openModal = useCallback(() => {
    clearRetryTimer();
    setIsOpen(true);
  }, [clearRetryTimer]);

  const openModalAuto = useCallback(() => {
    if (isContactRegistered()) return;
    clearRetryTimer();
    setIsOpen(true);
  }, [clearRetryTimer]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const dismissModal = useCallback(() => {
    setIsOpen(false);
    if (isContactRegistered()) return;

    clearRetryTimer();
    retryTimerRef.current = setTimeout(() => {
      if (!isContactRegistered()) {
        setIsOpen(true);
      }
    }, DISMISS_RETRY_MS);
  }, [clearRetryTimer]);

  const completeRegistration = useCallback(() => {
    markContactRegistered();
    clearRetryTimer();
  }, [clearRetryTimer]);

  useEffect(() => () => clearRetryTimer(), [clearRetryTimer]);

  const value = useMemo(
    () => ({
      isOpen,
      openModal,
      openModalAuto,
      closeModal,
      dismissModal,
      completeRegistration,
    }),
    [isOpen, openModal, openModalAuto, closeModal, dismissModal, completeRegistration]
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactUsModal
        isOpen={isOpen}
        onClose={closeModal}
        onDismiss={dismissModal}
        onRegistered={completeRegistration}
      />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return context;
}
