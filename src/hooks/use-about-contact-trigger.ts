"use client";

import { useEffect, useRef } from "react";
import { useContactModal } from "@/components/providers/contact-modal-provider";
import { isContactRegistered } from "@/lib/contact-storage";

const ABOUT_SECTION_ID = "about";
/** Page loader tugaguncha */
const PAGE_READY_MS = 1300;

function getAboutSection(): HTMLElement | null {
  return document.getElementById(ABOUT_SECTION_ID);
}

/** About ekranda paydo bo‘lganda true */
function isAboutInView(section: HTMLElement): boolean {
  const rect = section.getBoundingClientRect();
  const viewHeight = window.innerHeight;

  return rect.top < viewHeight * 0.92 && rect.bottom > 60;
}

export function useAboutContactTrigger() {
  const { openModalAuto } = useContactModal();
  const openRef = useRef(openModalAuto);
  const canAutoOpenRef = useRef(true);

  useEffect(() => {
    openRef.current = openModalAuto;
  }, [openModalAuto]);

  useEffect(() => {
    let active = true;
    let ready = false;
    let observer: IntersectionObserver | null = null;

    const markCanOpenAgain = () => {
      canAutoOpenRef.current = true;
    };

    const tryOpen = () => {
      if (!active || !ready || !canAutoOpenRef.current) return;
      if (isContactRegistered()) return;

      const section = getAboutSection();
      if (!section || !isAboutInView(section)) return;

      canAutoOpenRef.current = false;
      openRef.current();
    };

    const onScrollOrResize = () => {
      const section = getAboutSection();
      if (!section) return;

      if (!isAboutInView(section)) {
        markCanOpenAgain();
        return;
      }

      tryOpen();
    };

    const readyTimer = window.setTimeout(() => {
      ready = true;

      const section = getAboutSection();
      if (section) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry) return;

            if (!entry.isIntersecting) {
              markCanOpenAgain();
              return;
            }

            tryOpen();
          },
          { threshold: 0, rootMargin: "0px" }
        );

        observer.observe(section);
      }

      tryOpen();
    }, PAGE_READY_MS);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      active = false;
      window.clearTimeout(readyTimer);
      observer?.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);
}
