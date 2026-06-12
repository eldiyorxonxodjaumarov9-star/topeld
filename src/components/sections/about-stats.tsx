"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { SectionWrapper } from "@/components/motion/section-wrapper";
import { ABOUT_STATS } from "@/lib/constants";
import { IMAGES, VIDEOS } from "@/lib/images";
import { cn } from "@/lib/utils";
import { useAboutContactTrigger } from "@/hooks/use-about-contact-trigger";

const COLLAGE = {
  dashboard: { src: IMAGES.driver, alt: "Professional truck driver" },
  meeting: { src: IMAGES.meeting, alt: "Fleet monitoring and dispatch center" },
  compliance: { src: IMAGES.compliance, alt: "Safety compliance documents" },
} as const;

function CollageVideoTile({
  src,
  className,
  index,
}: {
  src: string;
  className?: string;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startPlayback = () => {
      video.playbackRate = 1;
      void video.play().catch(() => {});
    };

    video.addEventListener("loadeddata", startPlayback);
    video.addEventListener("canplay", startPlayback);

    return () => {
      video.removeEventListener("loadeddata", startPlayback);
      video.removeEventListener("canplay", startPlayback);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "group relative min-h-[140px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-orange-900/5 sm:min-h-[160px]",
        className
      )}
    >
      <div className="absolute inset-0 z-10 bg-orange-900/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        aria-label="Trucking operations video"
      >
        <source src={src} type="video/mp4" />
      </video>
    </motion.div>
  );
}

function CollageTile({
  src,
  alt,
  className,
  index,
}: {
  src: string;
  alt: string;
  className?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "group relative min-h-[140px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-orange-900/5 sm:min-h-[160px]",
        className
      )}
    >
      <div className="absolute inset-0 z-10 bg-orange-900/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 50vw, 280px"
      />
    </motion.div>
  );
}

export function AboutStats() {
  useAboutContactTrigger();

  return (
    <section id="about" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionWrapper className="order-2 lg:order-1">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
              <CollageVideoTile
                src={VIDEOS.aboutCollage}
                className="row-span-2 min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]"
                index={0}
              />
              <CollageTile {...COLLAGE.dashboard} index={1} />
              <CollageTile {...COLLAGE.meeting} index={2} />
            </div>
            <div className="mt-3 sm:mt-4">
              <CollageTile {...COLLAGE.compliance} className="min-h-[140px] sm:min-h-[160px]" index={3} />
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.1} className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
              About Us
            </p>
            <h2 className="font-heading mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[2.5rem]">
              <span className="text-orange-600">Experience</span> and{" "}
              <span className="text-orange-600">successful</span> actions guarantee
              that your <span className="text-orange-600">MC</span> achieves the{" "}
              <span className="text-orange-600">desired results</span>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Our company is made up of experienced and professional experts in
              the trucking industry who excel at providing top-notch Dispatch,
              Safety, Accounting, and Hiring services. We serve the transportation
              sector both in the USA and worldwide.
            </p>
            <Link
              href="#services"
              className="group mt-10 inline-flex h-12 items-center gap-2 rounded-xl bg-orange-600 px-8 font-semibold text-white shadow-lg shadow-orange-900/20 transition-all hover:bg-orange-900"
            >
              Learn More
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SectionWrapper>
        </div>

        <SectionWrapper delay={0.15} className="mt-20 border-t border-slate-200 pt-16 sm:mt-28">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:divide-x lg:divide-slate-200">
            {ABOUT_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center lg:px-6"
              >
                <p className="font-heading text-4xl font-bold text-orange-600 sm:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <div className="mx-auto mt-3 h-px w-10 bg-orange-600/25" />
                <p className="mt-3 text-sm font-medium text-slate-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </div>
    </section>
  );
}
