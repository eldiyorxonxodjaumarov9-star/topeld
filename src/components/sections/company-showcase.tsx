"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/motion/section-wrapper";
import { IMAGES } from "@/lib/images";

export function CompanyShowcase() {
  return (
    <section className="relative overflow-hidden">
      <SectionWrapper className="relative">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[21/9] min-h-[280px] overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/15 sm:min-h-[360px] lg:min-h-[420px]">
            <Image
              src={IMAGES.office}
              alt="TOP ELD SOLUTIONS corporate headquarters and office building"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-950/80 via-orange-900/50 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute inset-0 flex flex-col justify-center p-8 sm:p-12 lg:p-16"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
                Our Headquarters
              </p>
              <h2 className="font-heading mt-3 max-w-xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Built for enterprise trucking operations
              </h2>
              <p className="mt-4 max-w-lg text-base text-slate-200 sm:text-lg">
                State-of-the-art facilities supporting 1,000+ carriers nationwide
                with compliance, dispatch, and back-office excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
