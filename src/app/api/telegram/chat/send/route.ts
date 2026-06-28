import { NextResponse } from "next/server";
import {
  addChatMessage,
  linkTelegramMessage,
  shortSessionId,
} from "@/lib/chat-session-store";
import {
  escapeTelegramHtml,
  ensureTelegramWebhook,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      text?: string;
    };

    const sessionId = body.sessionId?.trim() ?? "";
    const text = body.text?.trim() ?? "";

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    if (!text) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long (max 2000 characters)." },
        { status: 400 }
      );
    }

    const userMessage = addChatMessage(sessionId, "user", text);

    if (isTelegramConfigured()) {
      await ensureTelegramWebhook();

      const tag = shortSessionId(sessionId);
      const { messageId } = await sendTelegramMessage({
        text: [
          `<b>Website chat</b> · #${escapeTelegramHtml(tag)}`,
          "",
          escapeTelegramHtml(text),
          "",
          `<i>Reply to this message to answer the visitor.</i>`,
        ].join("\n"),
      });

      linkTelegramMessage(messageId, sessionId);
    }

    return NextResponse.json({ ok: true, message: userMessage });
  } catch (error) {
    console.error("[telegram/chat/send]", error);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
