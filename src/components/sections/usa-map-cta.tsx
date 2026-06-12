"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ContactUsButton } from "@/components/ui/contact-us-button";
import { SectionWrapper } from "@/components/motion/section-wrapper";

function UsaMapSvg() {
  return (
    <Image
      src="/usa-map.svg"
      alt=""
      width={640}
      height={384}
      unoptimized
      className="h-auto w-full max-w-lg drop-shadow-[0_0_40px_rgba(34,197,94,0.35)]"
      aria-hidden
    />
  );
}

export function UsaMapCta() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-950 py-20 sm:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(22,101,52,0.35)_0%,_transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.15)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionWrapper>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
              Nationwide Coverage
            </p>
            <h2 className="font-heading mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Empowering{" "}
              <span className="text-orange-400">1000+</span> trucking companies
            </h2>
            <p className="mt-6 max-w-lg text-lg text-slate-400">
              From coast to coast, TOP ELD SOLUTIONS delivers compliance, dispatch, and
              back-office support that keeps American carriers moving forward.
            </p>
            <div className="mt-10 flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <ContactUsButton size="lg" />
              <Link
                href="#services"
                className="group inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-8 font-semibold text-white transition-colors hover:bg-white/10"
              >
                View Services
                <ArrowRight className="size-4 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.15} className="flex min-w-0 justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <UsaMapSvg />
            </motion.div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  );
}
