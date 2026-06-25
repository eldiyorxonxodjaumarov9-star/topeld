import { NextResponse } from "next/server";
import {
  escapeTelegramHtml,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

type VisitBody = {
  visitorId?: string;
  path?: string;
  referrer?: string;
  language?: string;
  timezone?: string;
  screen?: string;
};

function isLikelyBot(userAgent: string): boolean {
  return /bot|crawler|spider|slurp|facebookexternalhit|preview|headless/i.test(
    userAgent
  );
}

function formatReferrer(referrer: string): string {
  if (!referrer || referrer === "direct") {
    return "Direct visit";
  }

  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return referrer.slice(0, 120);
  }
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "Unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "Unknown";
}

function parseBrowser(userAgent: string): string {
  if (/edg\//i.test(userAgent)) return "Microsoft Edge";
  if (/crios/i.test(userAgent)) return "Chrome (iOS)";
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) {
    return "Google Chrome";
  }
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/samsungbrowser/i.test(userAgent)) return "Samsung Internet";
  return "Unknown browser";
}

function parseOs(userAgent: string): string {
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/mac os/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Unknown OS";
}

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get("user-agent") ?? "";

    if (isLikelyBot(userAgent)) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    if (!isTelegramConfigured()) {
      console.error(
        "[telegram/visit] Token or Chat ID missing — fill in src/config/telegram.ts"
      );
      return NextResponse.json({ ok: false, skipped: "not_configured" });
    }

    const body = (await request.json().catch(() => ({}))) as VisitBody;
    const visitorId = body.visitorId?.trim() || "Unknown";
    const path = body.path?.trim() || "/";
    const referrer = formatReferrer(body.referrer?.trim() ?? "");
    const language = body.language?.trim() || "Unknown";
    const timezone = body.timezone?.trim() || "Unknown";
    const screen = body.screen?.trim() || "Unknown";
    const ip = getClientIp(request);
    const browser = parseBrowser(userAgent);
    const os = parseOs(userAgent);

    const host = request.headers.get("host") ?? "topeldsolutions.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const pageUrl = `${protocol}://${host}${path.startsWith("/") ? path : `/${path}`}`;

    const visitedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const device = /mobile|android|iphone|ipad/i.test(userAgent)
      ? "Mobile"
      : "Desktop";

    await sendTelegramMessage({
      text: [
        "<b>TOP ELD — Visitor Entered Website</b>",
        "",
        "A user confirmed entry to the website.",
        "",
        `<b>Visitor ID:</b> <code>${escapeTelegramHtml(visitorId)}</code>`,
        `<b>IP Address:</b> <code>${escapeTelegramHtml(ip)}</code>`,
        `<b>Browser:</b> ${escapeTelegramHtml(browser)}`,
        `<b>OS:</b> ${escapeTelegramHtml(os)}`,
        `<b>Device:</b> ${device}`,
        `<b>Language:</b> ${escapeTelegramHtml(language)}`,
        `<b>Timezone:</b> ${escapeTelegramHtml(timezone)}`,
        `<b>Screen:</b> ${escapeTelegramHtml(screen)}`,
        `<b>Page:</b> ${escapeTelegramHtml(path)}`,
        `<b>Link:</b> <a href="${escapeTelegramHtml(pageUrl)}">${escapeTelegramHtml(pageUrl)}</a>`,
        `<b>Referrer:</b> ${escapeTelegramHtml(referrer)}`,
        `<b>Time:</b> ${escapeTelegramHtml(visitedAt)} (CT)`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telegram/visit]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
