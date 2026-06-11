"use client";

import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionWrapper } from "@/components/motion/section-wrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionHeading
            eyebrow="Testimonials"
            title="What our clients say"
            description="Trusted by owner-operators and fleet managers across the United States."
          />
        </SectionWrapper>

        <SectionWrapper delay={0.1} className="mt-14">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {TESTIMONIALS.map((t) => (
                <CarouselItem
                  key={t.name}
                  className="basis-full pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <article className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm sm:p-8">
                    <Quote className="size-8 text-orange-600/20" />
                    <div className="mt-4 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 text-slate-600 leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 border-t border-slate-200 pt-6">
                      <p className="font-heading font-semibold text-slate-900">
                        {t.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center gap-2">
              <CarouselPrevious className="static translate-y-0 rounded-xl border-slate-200 hover:border-orange-300 hover:bg-orange-50" />
              <CarouselNext className="static translate-y-0 rounded-xl border-slate-200 hover:border-orange-300 hover:bg-orange-50" />
            </div>
          </Carousel>
        </SectionWrapper>
      </div>
    </section>
  );
}
