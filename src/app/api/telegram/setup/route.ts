import { NextResponse } from "next/server";
import {
  ensureTelegramWebhook,
  getTelegramBotToken,
  isTelegramConfigured,
} from "@/lib/telegram";
import { isRedisConfigured } from "@/lib/redis";

export async function GET() {
  if (!isTelegramConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Telegram not configured" },
      { status: 503 }
    );
  }

  const webhookOk = await ensureTelegramWebhook(true);
  const token = getTelegramBotToken();

  let info: unknown = null;
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/getWebhookInfo`
    );
    const payload = (await response.json()) as {
      ok?: boolean;
      result?: { url?: string; pending_update_count?: number; last_error_message?: string };
    };
    info = {
      ok: payload.ok,
      url: payload.result?.url,
      pending: payload.result?.pending_update_count,
      lastError: payload.result?.last_error_message ?? null,
    };
  } catch (error) {
    info = { error: error instanceof Error ? error.message : "failed" };
  }

  return NextResponse.json({
    ok: webhookOk,
    redis: isRedisConfigured(),
    webhookUrl: "https://www.topeldsolutions.com/api/telegram/webhook",
    info,
  });
}
