import { NextResponse } from "next/server";
import {
  addChatMessage,
  extractFullSessionId,
  extractSessionTag,
  findSessionByShortId,
  resolveSessionFromTelegramReply,
} from "@/lib/chat-session-store";
import { getTelegramChatId } from "@/lib/telegram";

type TelegramUpdate = {
  message?: {
    message_id: number;
    chat: { id: number };
    text?: string;
    reply_to_message?: {
      message_id: number;
      text?: string;
      caption?: string;
    };
    from?: { is_bot?: boolean };
  };
};

async function resolveSessionId(
  message: NonNullable<TelegramUpdate["message"]>
): Promise<string | undefined> {
  if (message.reply_to_message?.message_id) {
    const byReplyId = await resolveSessionFromTelegramReply(
      message.reply_to_message.message_id
    );
    if (byReplyId) return byReplyId;

    const quoted =
      message.reply_to_message.text ?? message.reply_to_message.caption ?? "";

    const fullId = extractFullSessionId(quoted);
    if (fullId) return fullId;

    const tag = extractSessionTag(quoted);
    if (tag) {
      const byTag = await findSessionByShortId(tag);
      if (byTag) return byTag;
    }
  }

  const tagFromBody = extractSessionTag(message.text ?? "");
  if (tagFromBody) {
    return findSessionByShortId(tagFromBody);
  }

  return undefined;
}

function extractReplyBody(text: string): string {
  const tagged = text.match(/^#([a-z0-9]{6,12})\s+([\s\S]+)$/i);
  if (tagged?.[2]) return tagged[2].trim();
  return text.trim();
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

    const sessionId = await resolveSessionId(message);
    if (!sessionId) {
      console.warn("[telegram/webhook] No session found for reply");
      return NextResponse.json({ ok: true });
    }

    const replyText = extractReplyBody(message.text);
    if (!replyText) {
      return NextResponse.json({ ok: true });
    }

    await addChatMessage(sessionId, "bot", replyText);
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
