import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NewsArticleView } from "@/components/sections/news-article-view";
import { EldChatbot } from "@/components/widgets/eld-chatbot";
import { BLOG_POSTS } from "@/lib/constants";
import {
  getFmcsaArticleBySlug,
  getFmcsaNews,
  getRelatedNews,
} from "@/lib/fmcsa-news";

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getFmcsaArticleBySlug(slug);

  if (!article) {
    return { title: "News not found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getFmcsaNews(12);
  const slugs = new Set(posts.map((post) => post.slug));

  for (const post of BLOG_POSTS) {
    slugs.add(post.slug);
  }

  return [...slugs].map((slug) => ({ slug }));
}

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = await getFmcsaArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allPosts = await getFmcsaNews(12);
  const related = getRelatedNews(allPosts, article, 3);

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <NewsArticleView article={article} related={related} />
      </main>
      <Footer />
      <EldChatbot />
    </>
  );
}
