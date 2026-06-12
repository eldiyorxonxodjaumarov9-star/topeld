import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronLeft } from "lucide-react";
import {
  isFmcsaLogoImage,
  type FmcsaArticleDetail,
  type NewsPost,
} from "@/lib/fmcsa-news";
import { cn } from "@/lib/utils";

type NewsArticleViewProps = {
  article: FmcsaArticleDetail;
  related: NewsPost[];
};

function RelatedCard({ post }: { post: NewsPost }) {
  const logoStyle = isFmcsaLogoImage(post.image);

  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-950/5"
    >
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
            logoStyle ? "object-contain p-5" : "object-cover object-center"
          )}
          sizes="320px"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
          {post.date}
        </p>
        <h3 className="font-heading mt-2 line-clamp-3 text-base font-bold leading-snug text-slate-900 group-hover:text-orange-700">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

export function NewsArticleView({ article, related }: NewsArticleViewProps) {
  const logoStyle = isFmcsaLogoImage(article.image);

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8">
      <Link
        href="/#news"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
      >
        <ChevronLeft className="size-4" />
        Back to News
      </Link>

      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
        <Calendar className="size-4" />
        {article.date}
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] text-orange-700">
          {article.source === "fmcsa" ? "FMCSA" : "Industry Insights"}
        </span>
      </div>

      <h1 className="font-heading mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[2.65rem]">
        {article.title}
      </h1>

      <div
        className={cn(
          "relative mt-8 aspect-[21/9] overflow-hidden rounded-3xl ring-1 ring-slate-200/80",
          logoStyle
            ? "bg-gradient-to-br from-slate-50 via-white to-orange-50"
            : "bg-slate-900"
        )}
      >
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          className={cn(
            logoStyle ? "object-contain p-8 sm:p-10" : "object-cover object-center"
          )}
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>

      <div
        className="fmcsa-article-body mt-10"
        dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
      />

      <p className="mt-10 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        {article.source === "fmcsa"
          ? "Source: Federal Motor Carrier Safety Administration (FMCSA) — public government announcement."
          : "Source: TOP ELD Solutions — industry guidance for carriers and owner-operators."}
      </p>

      {related.length > 0 && (
        <section className="mt-16 border-t border-slate-200 pt-12">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            Related news
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            More FMCSA updates on similar topics
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((post) => (
              <RelatedCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
