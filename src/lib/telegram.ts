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

type TelegramSendResult = {
  messageId: number;
};

export async function sendTelegramMessage({
  text,
  parseMode = "HTML",
}: SendTelegramOptions): Promise<TelegramSendResult> {
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

  const payload = (await response.json()) as {
    result?: { message_id?: number };
  };
  const messageId = payload.result?.message_id;
  if (!messageId) {
    throw new Error("TELEGRAM_SEND_FAILED:missing_message_id");
  }

  return { messageId };
}

export function getTelegramBotToken(): string {
  return getTelegramCredentials().token;
}

export function getTelegramChatId(): string {
  return getTelegramCredentials().chatId;
}

function getWebhookBaseUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) return siteUrl.replace(/\/$/, "");

  // Always use production domain for Telegram webhook (not preview URLs)
  if (process.env.VERCEL_ENV === "production") {
    return "https://topeldsolutions.com";
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "https://topeldsolutions.com";
}

const WEBHOOK_FLAG = "__topeld_webhook_ready__";

/** Mavjud bot tokeni bilan webhook ni avtomatik ulash (yangi bot kerak emas). */
export async function ensureTelegramWebhook(): Promise<boolean> {
  const token = getTelegramBotToken();
  if (!token) return false;

  const g = globalThis as typeof globalThis & { [WEBHOOK_FLAG]?: boolean };
  if (g[WEBHOOK_FLAG]) return true;

  const webhookUrl = `${getWebhookBaseUrl()}/api/telegram/webhook`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ["message"],
        }),
      }
    );

    const payload = (await response.json()) as { ok?: boolean; description?: string };
    if (payload.ok) {
      g[WEBHOOK_FLAG] = true;
      return true;
    }

    console.error("[telegram] setWebhook failed:", payload.description);
    return false;
  } catch (error) {
    console.error("[telegram] setWebhook error:", error);
    return false;
  }
}

export function escapeTelegramHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
