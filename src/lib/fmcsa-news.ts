import {
  FMCSA_BASE_URL,
  FMCSA_NEWSROOM_URL,
  FMCSA_NEWS_RSS_URL,
  FMCSA_PRESS_RELEASES_URL,
  NEWS_FETCH_LIMIT,
  NEWS_REVALIDATE_SECONDS,
} from "@/config/news";
import { BLOG_POSTS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  url: string;
  source: "fmcsa" | "fallback";
};

export type FmcsaArticleDetail = NewsPost & {
  bodyHtml: string;
};

const FMCSA_DEFAULT_IMAGE = `${FMCSA_BASE_URL}/themes/custom/dot_cms/images/seal_dot.png`;

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.fmcsa.dot.gov/",
  "Cache-Control": "no-cache",
};

function decodeHtml(text: string): string {
  return text
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function stripHtml(text: string): string {
  return decodeHtml(text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function toAbsoluteUrl(path: string): string {
  const decoded = decodeHtml(path);
  if (decoded.startsWith("http")) return decoded;
  return `${FMCSA_BASE_URL}${decoded.startsWith("/") ? decoded : `/${decoded}`}`;
}

export function slugFromNewsPath(path: string): string {
  return decodeHtml(path)
    .replace(/^\/?newsroom\/?/, "")
    .replace(/\/$/, "");
}

export function slugFromNewsUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return slugFromNewsPath(pathname);
  } catch {
    return slugFromNewsPath(url);
  }
}

function readMetaContent(html: string, key: string): string {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }

  return "";
}

export function extractArticleImage(html: string): string {
  const fileImages = [
    ...html.matchAll(
      /src="(\/sites\/fmcsa\.dot\.gov\/files\/[^"]+\.(?:jpg|jpeg|png|webp|gif)[^"]*)"/gi
    ),
  ]
    .map((match) => decodeHtml(match[1]))
    .filter(
      (path) =>
        !/\/logo\.png$/i.test(path) &&
        !/icon/i.test(path) &&
        !/pixel/i.test(path)
    );

  if (fileImages.length > 0) {
    return toAbsoluteUrl(fileImages[0]);
  }

  const ogImage = readMetaContent(html, "og:image");
  if (ogImage && !ogImage.includes("seal_dot")) {
    return toAbsoluteUrl(ogImage);
  }

  const twitterImage = readMetaContent(html, "twitter:image");
  if (twitterImage) {
    return toAbsoluteUrl(twitterImage);
  }

  return FMCSA_DEFAULT_IMAGE;
}

export function extractArticleExcerpt(html: string): string {
  const twitterDescription = readMetaContent(html, "twitter:description");
  if (twitterDescription) return twitterDescription.slice(0, 220);

  const description = readMetaContent(html, "description");
  if (description) return description.slice(0, 220);

  return "Official announcement from the Federal Motor Carrier Safety Administration (FMCSA).";
}

export function parseFmcsaPressReleasesHtml(
  html: string,
  limit: number
): NewsPost[] {
  const items: NewsPost[] = [];
  const rows = html.split('<div class="views-row">').slice(1);

  for (const row of rows) {
    if (items.length >= limit) break;

    const dateMatch = row.match(/<time[^>]*>([^<]+)<\/time>/);
    const linkMatch = row.match(
      /<a href="(\/newsroom\/[^"]+)" rel="bookmark">([\s\S]*?)<\/a>/
    );
    const excerptMatch = row.match(/<\/h2>\s*([\s\S]*?)<\/div>\s*\n\s*<\/div>/);

    if (!dateMatch || !linkMatch) continue;

    const title = stripHtml(linkMatch[2]);
    const url = toAbsoluteUrl(linkMatch[1]);
    const excerptRaw = excerptMatch ? stripHtml(excerptMatch[1]) : "";

    if (!title || !url || url.includes("news-archive")) continue;

    items.push({
      slug: slugFromNewsPath(linkMatch[1]),
      title,
      excerpt:
        excerptRaw.slice(0, 220) ||
        "Official announcement from the Federal Motor Carrier Safety Administration (FMCSA).",
      date: decodeHtml(dateMatch[1]),
      image: FMCSA_DEFAULT_IMAGE,
      url,
      source: "fmcsa",
    });
  }

  return items;
}

export function parseFmcsaNewsroomHtml(html: string, limit: number): NewsPost[] {
  const items: NewsPost[] = [];
  const rowPattern =
    /<div class="news-item views-row">[\s\S]*?<div class="views-field views-field-field-effective-date"><div class="field-content">([^<]+)<\/div><\/div><div class="views-field views-field-title"><span class="field-content"><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null && items.length < limit) {
    const date = decodeHtml(match[1]);
    const url = toAbsoluteUrl(decodeHtml(match[2]));
    const title = stripHtml(match[3]);

    if (!title || !url) continue;

    items.push({
      slug: slugFromNewsPath(match[2]),
      title,
      excerpt:
        "Official announcement from the Federal Motor Carrier Safety Administration (FMCSA).",
      date,
      image: FMCSA_DEFAULT_IMAGE,
      url,
      source: "fmcsa",
    });
  }

  return items;
}

export function parseFmcsaRss(xml: string, limit: number): NewsPost[] {
  const items: NewsPost[] = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/gi;

  let block: RegExpExecArray | null;
  while ((block = itemPattern.exec(xml)) !== null && items.length < limit) {
    const chunk = block[1];
    const title = stripHtml(
      chunk.match(/<title>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/title>/i)?.[1] ??
        chunk.match(/<title>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/title>/i)?.[2] ??
        ""
    );
    const link = decodeHtml(
      chunk.match(/<link>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/link>/i)?.[1] ??
        chunk.match(/<link>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/link>/i)?.[2] ??
        ""
    );
    const pubDate = decodeHtml(
      chunk.match(/<pubDate>([^<]*)<\/pubDate>/i)?.[1] ?? ""
    );
    const description = stripHtml(
      chunk.match(
        /<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/description>/i
      )?.[1] ??
        chunk.match(
          /<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/description>/i
        )?.[2] ??
        ""
    );

    if (!title || !link) continue;

    const formattedDate = pubDate
      ? new Date(pubDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recent";

    items.push({
      slug: slugFromNewsUrl(link),
      title,
      excerpt: description.slice(0, 220) || "Official FMCSA newsroom update.",
      date: formattedDate,
      image: FMCSA_DEFAULT_IMAGE,
      url: toAbsoluteUrl(link),
      source: "fmcsa",
    });
  }

  return items;
}

async function fetchArticleImage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: FETCH_HEADERS,
    next: { revalidate: NEWS_REVALIDATE_SECONDS },
  });

  if (!response.ok) return FMCSA_DEFAULT_IMAGE;

  const html = await response.text();
  return extractArticleImage(html);
}

async function enrichNewsImages(posts: NewsPost[]): Promise<NewsPost[]> {
  return Promise.all(
    posts.map(async (post) => {
      try {
        const image = await fetchArticleImage(post.url);
        return { ...post, image };
      } catch (error) {
        console.error("[fmcsa-news] Image fetch failed:", post.url, error);
        return post;
      }
    })
  );
}

function getFallbackNews(limit: number): NewsPost[] {
  return BLOG_POSTS.slice(0, limit).map((post, index) => ({
    slug: `fallback-${index + 1}`,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    image: post.image,
    url: FMCSA_NEWSROOM_URL,
    source: "fallback" as const,
  }));
}

async function fetchFmcsaPressReleases(limit: number): Promise<NewsPost[]> {
  const response = await fetch(FMCSA_PRESS_RELEASES_URL, {
    headers: FETCH_HEADERS,
    next: { revalidate: NEWS_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`FMCSA press releases ${response.status}`);
  }

  const html = await response.text();
  const items = parseFmcsaPressReleasesHtml(html, limit);
  if (items.length === 0) return items;
  return enrichNewsImages(items);
}

async function fetchFmcsaNewsHtml(limit: number): Promise<NewsPost[]> {
  const response = await fetch(FMCSA_NEWSROOM_URL, {
    headers: FETCH_HEADERS,
    next: { revalidate: NEWS_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`FMCSA HTML ${response.status}`);
  }

  const html = await response.text();
  const items = parseFmcsaNewsroomHtml(html, limit);
  if (items.length === 0) return items;
  return enrichNewsImages(items);
}

async function fetchFmcsaNewsRss(limit: number): Promise<NewsPost[]> {
  const response = await fetch(FMCSA_NEWS_RSS_URL, {
    headers: {
      ...FETCH_HEADERS,
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    next: { revalidate: NEWS_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`FMCSA RSS ${response.status}`);
  }

  const xml = await response.text();
  if (xml.includes("Access Denied")) {
    throw new Error("FMCSA RSS blocked");
  }

  const items = parseFmcsaRss(xml, limit);
  if (items.length === 0) return items;
  return enrichNewsImages(items);
}

export function isFmcsaLogoImage(url: string): boolean {
  return /seal_dot|logo\.png/i.test(url);
}

export async function getFmcsaNews(
  limit = NEWS_FETCH_LIMIT
): Promise<NewsPost[]> {
  try {
    const pressItems = await fetchFmcsaPressReleases(limit);
    if (pressItems.length > 0) return pressItems;
  } catch (error) {
    console.error("[fmcsa-news] Press releases fetch failed:", error);
  }

  try {
    const htmlItems = await fetchFmcsaNewsHtml(limit);
    if (htmlItems.length > 0) return htmlItems;
  } catch (error) {
    console.error("[fmcsa-news] HTML fetch failed:", error);
  }

  try {
    const rssItems = await fetchFmcsaNewsRss(limit);
    if (rssItems.length > 0) return rssItems;
  } catch (error) {
    console.error("[fmcsa-news] RSS fetch failed:", error);
  }

  return getFallbackNews(limit);
}

function sanitizeArticleHtml(raw: string): string {
  let html = raw
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/<a[^>]*subscribe-button[^>]*>[\s\S]*?<\/a>/gi, "");

  html = html.replace(/src="(\/[^"]+)"/gi, (_, path: string) => {
    return `src="${toAbsoluteUrl(path)}"`;
  });

  html = html.replace(/href="(\/[^"]+)"/gi, (_, path: string) => {
    return `href="${toAbsoluteUrl(path)}"`;
  });

  html = html.replace(/<a\s+/gi, '<a target="_blank" rel="noopener noreferrer" ');

  return html.trim();
}

export function parseFmcsaArticleHtml(html: string, slug: string): FmcsaArticleDetail | null {
  const articleBlock = html.match(
    /<article[^>]*node--type-article[\s\S]*?<\/article>/i
  )?.[0];

  if (!articleBlock) return null;

  const title = stripHtml(
    articleBlock.match(/<h1 class="page__title[^"]*">([\s\S]*?)<\/h1>/i)?.[1] ??
      ""
  );
  const date = stripHtml(
    articleBlock.match(/<div class=['"]mb-4['"]>\s*([^<]+)\s*<\/div>/i)?.[1] ??
      ""
  );

  const bodyMatch = articleBlock.match(
    /<div class="mb-4 clearfix">\s*([\s\S]*?)<\/div>\s*<div class="supplemental-content/i
  );

  let bodyHtml = bodyMatch?.[1] ?? "";
  bodyHtml = bodyHtml.replace(/<div class="align-center">[\s\S]*?<\/div>\s*/i, "");
  bodyHtml = sanitizeArticleHtml(bodyHtml);

  if (!title || !bodyHtml) return null;

  const image = extractArticleImage(html);
  const url = `${FMCSA_BASE_URL}/newsroom/${slug}`;

  return {
    slug,
    title,
    date: date || "Recent",
    excerpt: stripHtml(bodyHtml).slice(0, 220),
    image,
    url,
    source: "fmcsa",
    bodyHtml,
  };
}

export async function getFmcsaArticleBySlug(
  slug: string
): Promise<FmcsaArticleDetail | null> {
  const response = await fetch(`${FMCSA_BASE_URL}/newsroom/${slug}`, {
    headers: FETCH_HEADERS,
    next: { revalidate: NEWS_REVALIDATE_SECONDS },
  });

  if (!response.ok) return null;

  const html = await response.text();
  return parseFmcsaArticleHtml(html, slug);
}

export function getRelatedNews(
  posts: NewsPost[],
  current: NewsPost,
  limit = 3
): NewsPost[] {
  const keywords = new Set(
    current.title
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3)
  );

  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score: post.title
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => keywords.has(word)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
