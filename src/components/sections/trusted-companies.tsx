"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/motion/section-wrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import { TRUSTED_COMPANIES } from "@/lib/constants";

export function TrustedCompanies() {
  const doubled = [...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES];

  return (
    <section className="overflow-hidden border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionHeading
            eyebrow="Trusted By"
            title="Leading trucking companies nationwide"
            description="Join hundreds of carriers who rely on TOP ELD SOLUTIONS for outsourcing excellence."
          />
        </SectionWrapper>
      </div>

      <div className="relative mt-12">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent" />
        <motion.div
          className="flex w-max gap-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: TRUSTED_COMPANIES.length * 3.8,
              ease: "linear",
            },
          }}
        >
          {doubled.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 shadow-sm"
            >
              <span className="whitespace-nowrap font-heading text-lg font-bold text-slate-400">
                {name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
