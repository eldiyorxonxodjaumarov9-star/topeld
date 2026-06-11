import { SectionWrapper } from "@/components/motion/section-wrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlogNewsGrid } from "@/components/sections/blog-news-grid";
import { getFmcsaNews } from "@/lib/fmcsa-news";

export async function BlogNews() {
  const posts = await getFmcsaNews();

  return (
    <section id="news" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionHeading
            eyebrow="News & Insights"
            title="Latest FMCSA updates for carriers"
            description="FMCSA compliance alerts, ELD updates, and federal trucking announcements — read full articles here on our site."
          />
        </SectionWrapper>

        <BlogNewsGrid posts={posts} />
      </div>
    </section>
  );
}
