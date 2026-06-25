import { NextResponse } from "next/server";
import {
  escapeTelegramHtml,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

const ALLOWED_HOSTS = new Set([
  "topeldsolutions.com",
  "www.topeldsolutions.com",
  "localhost",
  "127.0.0.1",
]);

function isAllowedRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  for (const value of [origin, referer]) {
    if (!value) continue;
    try {
      const host = new URL(value).hostname.toLowerCase();
      if (ALLOWED_HOSTS.has(host)) return true;
    } catch {
      // ignore invalid URLs
    }
  }

  return process.env.NODE_ENV === "development";
}

function getDeviceLabel(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "Tablet";
  if (/mobile|iphone|android/.test(ua)) return "Mobile";
  return "Desktop";
}

function getReferrerLabel(referrer: string): string {
  if (!referrer.trim()) return "Direct visit";

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host || "Direct visit";
  } catch {
    return "Direct visit";
  }
}

function buildPageUrl(request: Request, path: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? "topeldsolutions.com";
  const protocol = request.headers.get("x-forwarded-proto") ?? "https";
  const safePath = path.startsWith("/") ? path : "/";

  return `${protocol}://${host}${safePath}`;
}

export async function POST(request: Request) {
  try {
    if (!isAllowedRequest(request)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as { path?: string };
    const path =
      typeof body.path === "string" && body.path.startsWith("/")
        ? body.path.slice(0, 200)
        : "/";

    if (!isTelegramConfigured()) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const userAgent = request.headers.get("user-agent") ?? "Unknown";
    const pageUrl = buildPageUrl(request, path);
    const visitedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "medium",
      timeStyle: "short",
    });

    await sendTelegramMessage({
      text: [
        "<b>TOP ELD — New Website Visitor</b>",
        "",
        "Someone just opened the website.",
        "",
        `<b>Page:</b> <a href="${escapeTelegramHtml(pageUrl)}">${escapeTelegramHtml(pageUrl)}</a>`,
        `<b>Device:</b> ${escapeTelegramHtml(getDeviceLabel(userAgent))}`,
        `<b>Referrer:</b> ${escapeTelegramHtml(getReferrerLabel(request.headers.get("referer") ?? ""))}`,
        `<b>Time:</b> ${escapeTelegramHtml(visitedAt)} (CT)`,
        "<b>Source:</b> Website visit alert",
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telegram/visit]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
