import {
  TELEGRAM_BOT_TOKEN as CONFIG_BOT_TOKEN,
  TELEGRAM_CHAT_ID as CONFIG_CHAT_ID,
} from "@/config/telegram";

const PLACEHOLDER_TOKEN = "YOUR_BOT_TOKEN_HERE";
const PLACEHOLDER_CHAT_ID = "YOUR_CHAT_ID_HERE";

function getTelegramCredentials(): { token: string; chatId: string } {
  const envToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const envChatId = process.env.TELEGRAM_CHAT_ID?.trim();

  const configToken = CONFIG_BOT_TOKEN.trim();
  const configChatId = CONFIG_CHAT_ID.trim();

  const token =
    envToken ||
    (configToken && configToken !== PLACEHOLDER_TOKEN ? configToken : "");
  const chatId =
    envChatId ||
    (configChatId && configChatId !== PLACEHOLDER_CHAT_ID ? configChatId : "");

  return { token, chatId };
}

type SendTelegramOptions = {
  text: string;
  parseMode?: "HTML" | "Markdown";
};

export function isTelegramConfigured(): boolean {
  const { token, chatId } = getTelegramCredentials();
  return Boolean(token && chatId);
}

export async function sendTelegramMessage({
  text,
  parseMode = "HTML",
}: SendTelegramOptions): Promise<void> {
  const { token, chatId } = getTelegramCredentials();

  if (!token || !chatId) {
    throw new Error("TELEGRAM_NOT_CONFIGURED");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`TELEGRAM_SEND_FAILED:${detail}`);
  }
}

export function escapeTelegramHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
