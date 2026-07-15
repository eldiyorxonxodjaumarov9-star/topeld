import { NextResponse } from "next/server";
import {
  addChatMessage,
  ensureWelcomeMessage,
  registerSession,
  shortSessionId,
} from "@/lib/chat-session-store";
import { validateAccessCode } from "@/lib/chatbot-storage";
import {
  escapeTelegramHtml,
  ensureTelegramWebhook,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";
import { isRedisConfigured } from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      code?: string;
      sessionId?: string;
    };

    const code = body.code?.replace(/\D/g, "").slice(0, 6) ?? "";
    const sessionId = body.sessionId?.trim() ?? "";

    const validationError = validateAccessCode(code);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    await registerSession(sessionId);
    await ensureWelcomeMessage(sessionId);

    if (isTelegramConfigured()) {
      await ensureTelegramWebhook();

      const submittedAt = new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago",
        dateStyle: "medium",
        timeStyle: "short",
      });

      await sendTelegramMessage({
        text: [
          "<b>TOP ELD BOT — Chat session started</b>",
          "",
          `<b>Session:</b> #${escapeTelegramHtml(shortSessionId(sessionId))}`,
          `<b>Code entered:</b> ${escapeTelegramHtml(code)}`,
          `<b>Visitor ID:</b> <code>${escapeTelegramHtml(sessionId)}</code>`,
          `<b>Time:</b> ${escapeTelegramHtml(submittedAt)}`,
          isRedisConfigured() ? "" : "<b>⚠ Redis not configured — replies may not reach the website.</b>",
          "",
          "<i>Reply to user messages in this group to respond on the website.</i>",
        ]
          .filter(Boolean)
          .join("\n"),
      });
    }

    await addChatMessage(
      sessionId,
      "bot",
      "You're connected! Type your message below — our team will reply shortly."
    );

    return NextResponse.json({ ok: true, unlocked: true });
  } catch (error) {
    console.error("[telegram/chat/verify]", error);
    return NextResponse.json(
      { error: "Could not verify access code." },
      { status: 500 }
    );
  }
}
