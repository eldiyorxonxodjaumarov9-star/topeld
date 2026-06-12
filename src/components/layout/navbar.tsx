"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactUsButton } from "@/components/ui/contact-us-button";
import { Logo } from "@/components/ui/logo";
import { useContactModal } from "@/components/providers/contact-modal-provider";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

export function Navbar() {
  const { openModal } = useContactModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isSolid = scrolled || mobileOpen;

  const linkClass = cn(
    "text-sm font-medium transition-colors duration-300",
    isSolid ? "text-slate-600 hover:text-orange-600" : "text-white/90 hover:text-white"
  );

  const menuButtonClass = cn(
    "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-2xl transition-colors",
    isSolid
      ? "border-white/70 bg-white/92 text-slate-900 shadow-lg shadow-orange-950/5 hover:bg-orange-50 hover:text-orange-600"
      : "border-white/15 bg-slate-950/45 text-white shadow-xl shadow-black/25 hover:bg-white/10"
  );

  const navPillClass = cn(
    "flex h-14 flex-1 items-center justify-between gap-2 rounded-2xl border px-5 backdrop-blur-2xl",
    isSolid
      ? "border-white/70 bg-white/92 shadow-lg shadow-orange-950/5"
      : "border-white/10 bg-slate-950/50 shadow-xl shadow-black/25"
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-x-clip">
      {/* Mobile */}
      <div className="flex min-w-0 items-center justify-between gap-2 px-4 pt-4 sm:gap-3 sm:px-5 lg:hidden">
        <Link
          href="#home"
          onClick={() => setMobileOpen(false)}
          className="min-w-0 shrink"
        >
          <motion.div
            initial={false}
            animate={{ scale: isSolid ? 0.92 : 1 }}
            transition={navTransition}
            style={{ transformOrigin: "center left" }}
          >
            <Logo
              width={640}
              height={500}
              priority
              onDark={!isSolid}
              className={cn(
                "h-auto w-auto max-w-[calc(100vw-5.5rem)] object-contain object-left transition-[max-height] duration-300 sm:max-w-[18rem]",
                isSolid ? "max-h-24 sm:max-h-28" : "max-h-28 sm:max-h-32"
              )}
            />
          </motion.div>
        </Link>

        <button
          type="button"
          className={menuButtonClass}
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Desktop — logo chap chetda, navbar pill alohida */}
      <div className="relative hidden pt-4 lg:block">
        <motion.div
          initial={false}
          animate={{ scale: isSolid ? 0.82 : 1 }}
          transition={navTransition}
          style={{ transformOrigin: "center left" }}
          className={cn(
            "pointer-events-auto absolute top-4 z-[60]",
            "left-[max(0.25rem,calc((100vw-80rem)/2-22rem))]",
            "xl:left-[max(0.5rem,calc((100vw-80rem)/2-26rem))]"
          )}
        >
          <Link href="#home" onClick={() => setMobileOpen(false)}>
            <Logo
              width={640}
              height={500}
              priority
              onDark={!isSolid}
              className={cn(
                "w-auto object-contain object-left transition-[height] duration-300",
                isSolid
                  ? "h-28 max-w-[18rem]"
                  : cn(
                      "h-48 max-w-[20rem]",
                      "xl:h-52 xl:max-w-[23rem]",
                      "2xl:h-56 2xl:max-w-[26rem]"
                    )
              )}
            />
          </Link>
        </motion.div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={navPillClass}>
            <div className="hidden flex-1 items-center justify-center gap-5 xl:gap-7 lg:flex">
              {NAV_LINKS.map((link) =>
                "modal" in link && link.modal ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={openModal}
                    className={linkClass}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link key={link.href} href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                )
              )}
            </div>

            <div className="ml-auto flex items-center gap-2.5">
              <ContactUsButton
                variant={isSolid ? "primary" : "outline"}
                className={
                  !isSolid
                    ? "border-white/40 text-white hover:bg-white/10 hover:text-white"
                    : undefined
                }
              />
              <Button
                nativeButton={false}
                render={<Link href="#services" />}
                className="h-10 rounded-xl bg-orange-600 px-5 text-white hover:bg-orange-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={navTransition}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,22rem)] flex-col border-l border-white/70 bg-white/95 shadow-2xl shadow-orange-950/10 backdrop-blur-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4">
                <Logo width={320} height={250} className="h-16 w-auto" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, ...navTransition }}
                  >
                    {"modal" in link && link.modal ? (
                      <button
                        type="button"
                        className="w-full rounded-xl px-4 py-3.5 text-left font-heading text-lg font-semibold text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-600"
                        onClick={() => {
                          openModal();
                          setMobileOpen(false);
                        }}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="block rounded-xl px-4 py-3.5 font-heading text-lg font-semibold text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-600"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="space-y-3 border-t border-slate-200/80 p-5">
                <ContactUsButton
                  size="lg"
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                />
                <Button
                  nativeButton={false}
                  render={<Link href="#services" onClick={() => setMobileOpen(false)} />}
                  className="h-12 w-full rounded-xl bg-orange-600 text-base font-semibold text-white hover:bg-orange-700"
                >
                  Get Started
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
