import { NextResponse } from "next/server";
import {
  escapeTelegramHtml,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";
import { validateUsdot } from "@/lib/chatbot-storage";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { usdot?: string };
    const usdot = body.usdot?.replace(/\D/g, "").slice(0, 7) ?? "";

    const validationError = validateUsdot(usdot);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!isTelegramConfigured()) {
      console.error(
        "[telegram/usdot] Token yoki Chat ID yo'q — src/config/telegram.ts ni to'ldiring"
      );
      return NextResponse.json(
        {
          error:
            "Telegram sozlanmagan. src/config/telegram.ts fayliga token va chat ID yozing, keyin serverni qayta ishga tushiring.",
        },
        { status: 503 }
      );
    }

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "medium",
      timeStyle: "short",
    });

    await sendTelegramMessage({
      text: [
        "<b>TOP ELD BOT — New USDOT Lead</b>",
        "",
        `<b>USDOT:</b> ${escapeTelegramHtml(usdot)}`,
        "<b>Bonus:</b> FREE Safety Score Check + $200 Service Credit",
        `<b>Time:</b> ${escapeTelegramHtml(submittedAt)}`,
        "<b>Source:</b> Website chatbot",
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telegram/usdot]", error);
    return NextResponse.json(
      { error: "Failed to send notification." },
      { status: 500 }
    );
  }
}
