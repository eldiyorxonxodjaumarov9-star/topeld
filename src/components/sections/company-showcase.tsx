"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/motion/section-wrapper";
import { IMAGES } from "@/lib/images";

export function CompanyShowcase() {
  return (
    <section className="relative overflow-x-clip">
      <SectionWrapper className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/15">
            <div className="relative aspect-[4/5] min-h-[360px] w-full sm:aspect-[16/9] sm:min-h-[340px] lg:aspect-[21/9] lg:min-h-[420px]">
              <Image
                src={IMAGES.office}
                alt="TOP ELD SOLUTIONS corporate headquarters and office building"
                fill
                className="object-cover object-center sm:object-[center_35%] lg:object-center"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/95 via-orange-900/70 to-orange-900/15 sm:bg-gradient-to-r sm:from-orange-950/85 sm:via-orange-900/55 sm:to-orange-900/10" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute inset-x-0 bottom-0 flex w-full flex-col justify-end p-5 sm:inset-0 sm:justify-center sm:p-8 md:p-10 lg:p-16"
              >
                <div className="w-full max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange-300 sm:text-sm">
                    Our Headquarters
                  </p>
                  <h2 className="font-heading mt-2 text-2xl font-bold leading-tight text-white sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
                    Built for enterprise trucking operations
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:mt-4 sm:text-base lg:text-lg">
                    State-of-the-art facilities supporting 1,000+ carriers nationwide
                    with compliance, dispatch, and back-office excellence.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
