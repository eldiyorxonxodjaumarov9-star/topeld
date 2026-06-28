import { NextResponse } from "next/server";
import {
  addChatMessage,
  findSessionByShortId,
  resolveSessionFromTelegramReply,
} from "@/lib/chat-session-store";
import { getTelegramChatId } from "@/lib/telegram";

type TelegramUpdate = {
  message?: {
    message_id: number;
    chat: { id: number };
    text?: string;
    reply_to_message?: { message_id: number };
    from?: { is_bot?: boolean };
  };
};

function resolveSessionFromText(text: string): string | null {
  const match = text.match(/^#([a-z0-9]{6,12})\s+([\s\S]+)$/i);
  if (!match) return null;

  const tag = match[1].toLowerCase();
  const replyText = match[2].trim();
  if (!replyText) return null;

  const sessionId = findSessionByShortId(tag);
  if (!sessionId) return null;

  addChatMessage(sessionId, "bot", replyText);
  return sessionId;
}

export async function POST(request: Request) {
  try {
    const update = (await request.json()) as TelegramUpdate;
    const message = update.message;

    if (!message?.text || message.from?.is_bot) {
      return NextResponse.json({ ok: true });
    }

    const configuredChatId = getTelegramChatId();
    if (configuredChatId && String(message.chat.id) !== configuredChatId) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();

    if (message.reply_to_message?.message_id) {
      const sessionId = resolveSessionFromTelegramReply(
        message.reply_to_message.message_id
      );
      if (sessionId) {
        addChatMessage(sessionId, "bot", text);
        return NextResponse.json({ ok: true });
      }
    }

    resolveSessionFromText(text);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telegram/webhook]", error);
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    hint: "Telegram webhook endpoint. POST updates from Telegram Bot API.",
  });
}
