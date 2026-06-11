"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import { ContactUsButton } from "@/components/ui/contact-us-button";
import { useContactModal } from "@/components/providers/contact-modal-provider";
import { COMPANY } from "@/lib/constants";
import { IMAGES, VIDEOS } from "@/lib/images";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openModal } = useContactModal();
  const motionControls = useAnimationControls();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startPlayback = () => {
      video.playbackRate = 1;
      void video.play().catch(() => {});
    };

    startPlayback();
    video.addEventListener("loadeddata", startPlayback);
    video.addEventListener("canplay", startPlayback);

    return () => {
      video.removeEventListener("loadeddata", startPlayback);
      video.removeEventListener("canplay", startPlayback);
    };
  }, []);

  useEffect(() => {
    void motionControls.start({
      scale: [1.05, 1.14, 1.05],
      x: [32, -12, 32],
      transition: {
        duration: 22,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [motionControls]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen min-h-[100dvh] items-center overflow-hidden"
    >
      <motion.div animate={motionControls} className="absolute inset-0 will-change-transform">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={IMAGES.heroPoster}
          aria-hidden
          className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-[58%_center] brightness-[0.48] contrast-[1.2] saturate-[0.92] lg:object-[62%_55%]"
        >
          <source src={VIDEOS.heroTruck} type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 bg-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/97 from-0% via-slate-950/85 via-45% to-slate-950/20 to-100%" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-900/30" />
      <div className="pointer-events-none absolute inset-0 bg-orange-950/12 mix-blend-soft-light" />

      <button
        type="button"
        onClick={openModal}
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-l-xl bg-orange-600 px-3.5 py-6 text-sm font-semibold text-white shadow-xl shadow-orange-950/40 transition-colors hover:bg-orange-500 lg:flex"
        aria-label="Contact us"
      >
        <span
          className="[writing-mode:vertical-rl] rotate-180 uppercase"
          style={{ letterSpacing: "0.14em" }}
        >
          Contact Us
        </span>
        <ArrowUpRight className="size-4 rotate-90" />
      </button>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-44 sm:px-6 sm:pb-28 sm:pt-52 lg:px-8 lg:pt-56">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-heading text-[2.35rem] font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.35rem] xl:text-6xl"
          >
            Experience the power of{" "}
            <span className="text-orange-400">Business Transformation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-slate-300/95 sm:text-lg"
          >
            Empowering carriers with innovative outsourcing solutions to optimize
            operations and drive growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            className="mt-10 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <ContactUsButton
              size="lg"
              className="h-12 gap-2 rounded-md bg-orange-600 px-8 text-base font-semibold shadow-lg shadow-orange-950/40 hover:bg-orange-500"
            >
              Contact Us
              <ArrowUpRight className="size-4" />
            </ContactUsButton>
            <a
              href={`tel:${COMPANY.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2.5 text-base font-medium text-white/90 transition-colors hover:text-orange-300"
            >
              <Phone className="size-4 text-orange-400" />
              {COMPANY.phone}
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[2] h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
