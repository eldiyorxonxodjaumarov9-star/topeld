"use client";

import { motion } from "framer-motion";
import { Network } from "lucide-react";
import { SectionWrapper } from "@/components/motion/section-wrapper";
import { Logo } from "@/components/ui/logo";
import { COMPARISON_ROWS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function RowCell({
  children,
  striped,
  className,
}: {
  children: React.ReactNode;
  striped?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[4.5rem] min-w-0 items-center break-words border-b border-slate-200/80 px-5 py-4 text-sm leading-snug sm:min-h-[5rem] sm:px-6 sm:text-[0.95rem]",
        striped ? "bg-slate-50/90" : "bg-white",
        className
      )}
    >
      {children}
    </div>
  );
}

export function FeaturesTable() {
  return (
    <section id="services" className="scroll-mt-28 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrapper className="mb-10 text-center sm:mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Why Choose Us
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            TOP ELD vs the competition
          </h2>
        </SectionWrapper>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/5"
        >
          <div className="grid min-w-0 md:grid-cols-3">
            {/* Features */}
            <div className="min-w-0 border-b border-slate-200/80 md:border-b-0 md:border-r">
              <div className="flex min-h-[3.75rem] items-center border-b border-slate-200/80 bg-white px-5 py-4 sm:px-6">
                <h3 className="font-heading text-lg font-bold text-orange-600 sm:text-xl">
                  Features
                </h3>
              </div>
              {COMPARISON_ROWS.map((row) => (
                <RowCell key={row.feature} className="font-medium text-slate-800">
                  {row.feature}
                </RowCell>
              ))}
            </div>

            {/* Competitors */}
            <div className="min-w-0 border-b border-slate-200/80 md:border-b-0 md:border-r">
              <div className="flex min-h-[3.75rem] items-center justify-between border-b border-slate-800/20 bg-slate-900 px-5 py-4 sm:px-6">
                <h3 className="font-heading text-base font-bold text-white sm:text-lg">
                  Competitors
                </h3>
                <Network className="size-5 text-white/80" strokeWidth={1.75} />
              </div>
              {COMPARISON_ROWS.map((row, i) => (
                <RowCell key={row.feature} striped={i % 2 === 1} className="text-slate-600">
                  {row.competitors}
                </RowCell>
              ))}
            </div>

            {/* TOP ELD */}
            <div className="min-w-0">
              <div className="flex min-h-[3.75rem] flex-col justify-center gap-1 border-b border-orange-700/30 bg-orange-600 px-5 py-3 sm:px-6">
                <Logo
                  width={640}
                  height={500}
                  className="h-10 w-auto max-w-[11rem] shrink-0 brightness-0 invert sm:h-11 sm:max-w-[12rem]"
                />
                <p className="text-[0.65rem] font-semibold uppercase leading-tight tracking-wide text-white/90 sm:text-xs">
                  TOP ELD SOLUTIONS INC
                </p>
              </div>
              {COMPARISON_ROWS.map((row, i) => (
                <RowCell
                  key={row.feature}
                  striped={i % 2 === 1}
                  className="font-medium text-slate-800"
                >
                  {row.ours}
                </RowCell>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
