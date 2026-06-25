import { NextResponse } from "next/server";
import {
  escapeTelegramHtml,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

type VisitBody = {
  path?: string;
  referrer?: string;
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
    const path = body.path?.trim() || "/";
    const referrer = formatReferrer(body.referrer?.trim() ?? "");

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
        "<b>TOP ELD — New Website Visitor</b>",
        "",
        "Someone just opened the website.",
        "",
        `<b>Page:</b> ${escapeTelegramHtml(path)}`,
        `<b>Link:</b> <a href="${escapeTelegramHtml(pageUrl)}">${escapeTelegramHtml(pageUrl)}</a>`,
        `<b>Referrer:</b> ${escapeTelegramHtml(referrer)}`,
        `<b>Device:</b> ${device}`,
        `<b>Time:</b> ${escapeTelegramHtml(visitedAt)} (CT)`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telegram/visit]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
