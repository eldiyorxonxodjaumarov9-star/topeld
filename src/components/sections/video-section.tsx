"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { SectionWrapper } from "@/components/motion/section-wrapper";
import { IMAGES } from "@/lib/images";

export function VideoSection() {
  return (
    <section id="video" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionWrapper>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
              Company Overview
            </p>
            <h2 className="font-heading mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Your trusted partner in{" "}
              <span className="text-orange-600">trucking excellence</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              For over seven years, TOP ELD SOLUTIONS has helped motor carriers across
              America streamline operations, reduce compliance risk, and grow
              profitably. Watch how we deliver enterprise-grade support to fleets
              of every size.
            </p>
            <ul className="mt-8 space-y-3 text-slate-700">
              {[
                "Nationwide carrier support network",
                "Dedicated compliance & safety team",
                "Proven ROI for owner-operators & fleets",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="size-1.5 rounded-full bg-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="#services"
              className="group mt-10 inline-flex h-12 items-center gap-2 rounded-xl bg-orange-600 px-8 font-semibold text-white hover:bg-orange-900"
            >
              Get Started Today
              <ArrowRight className="size-4 group-hover:translate-x-0.5" />
            </Link>
          </SectionWrapper>

          <SectionWrapper delay={0.15}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group relative aspect-video overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200"
            >
              <Image
                src={IMAGES.videoThumb}
                alt="TOP ELD SOLUTIONS company video thumbnail"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
              <div className="absolute inset-0 bg-slate-900/40 transition-colors group-hover:bg-slate-900/30" />
              <button
                type="button"
                aria-label="Play company video"
                className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange-600 text-white shadow-xl transition-transform group-hover:scale-110 sm:size-20"
              >
                <Play className="ml-1 size-7 fill-current sm:size-8" />
              </button>
            </motion.div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  );
}
