"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import { isFmcsaLogoImage, type NewsPost } from "@/lib/fmcsa-news";
import { cn } from "@/lib/utils";

type BlogNewsGridProps = {
  posts: NewsPost[];
};

export function BlogNewsGrid({ posts }: BlogNewsGridProps) {
  return (
    <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => {
        const logoStyle = isFmcsaLogoImage(post.image);

        return (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.45 }}
            whileHover={{ y: -4 }}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:border-orange-200/80 hover:shadow-xl hover:shadow-orange-950/10"
          >
            <Link href={`/news/${post.slug}`} className="flex flex-1 flex-col">
              <div
                className={cn(
                  "relative aspect-[16/10] overflow-hidden",
                  logoStyle
                    ? "bg-gradient-to-br from-slate-50 via-white to-orange-50"
                    : "bg-slate-900"
                )}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className={cn(
                    "transition-transform duration-700 ease-out group-hover:scale-[1.03]",
                    logoStyle
                      ? "object-contain p-7 sm:p-8"
                      : "object-cover object-center"
                  )}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {!logoStyle && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                )}

                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-orange-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-orange-950/25">
                    FMCSA
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                  <Calendar className="size-3.5" />
                  {post.date}
                </div>

                <h3 className="font-heading mt-3 line-clamp-3 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-orange-700">
                  {post.title}
                </h3>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition-colors group-hover:border-orange-300 group-hover:bg-orange-100">
                  Read article
                  <ArrowUpRight className="size-4 shrink-0" />
                </span>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
