"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/motion/section-wrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import { ELD_PROVIDERS } from "@/lib/constants";

export function OurPartners() {
  return (
    <section id="partners" className="scroll-mt-28 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionHeading
            eyebrow="Our Partners"
            title="Trusted ELD technology partners"
            description="We work with leading FMCSA-registered ELD providers to keep your fleet compliant, connected, and running smoothly."
          />
        </SectionWrapper>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ELD_PROVIDERS.map((provider, index) => (
            <motion.a
              key={provider.name}
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/60 transition-shadow hover:shadow-xl hover:shadow-orange-900/10"
            >
              <div className="flex aspect-[5/3] items-center justify-center bg-slate-50 p-6 sm:p-8">
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={220}
                  height={80}
                  unoptimized={provider.logo.endsWith(".svg")}
                  className="max-h-14 w-full max-w-[220px] object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16"
                />
              </div>

              <div className="border-t border-slate-100 p-5 text-center">
                <h3 className="font-heading text-base font-semibold text-slate-900">
                  {provider.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-orange-600">
                  ELD Partner
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
