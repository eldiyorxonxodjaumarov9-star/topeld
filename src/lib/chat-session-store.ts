import { getRedis } from "@/lib/redis";

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: "user" | "bot";
  text: string;
  createdAt: string;
};

type MemoryStore = {
  messages: Map<string, ChatMessage[]>;
  telegramMsgToSession: Map<number, string>;
  shortIdToSession: Map<string, string>;
};

const STORE_KEY = "__topeld_chat_store__";
const MSG_TTL_SECONDS = 60 * 60 * 24; // 24h

function getMemoryStore(): MemoryStore {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: MemoryStore };
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = {
      messages: new Map(),
      telegramMsgToSession: new Map(),
      shortIdToSession: new Map(),
    };
  }
  return g[STORE_KEY];
}

function createId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function shortSessionId(sessionId: string): string {
  return sessionId.replace(/-/g, "").slice(0, 8).toLowerCase();
}

function messagesKey(sessionId: string): string {
  return `chat:msgs:${sessionId}`;
}

function telegramLinkKey(messageId: number): string {
  return `chat:tg:${messageId}`;
}

function shortIdKey(tag: string): string {
  return `chat:short:${tag.toLowerCase()}`;
}

export async function registerSession(sessionId: string): Promise<void> {
  const tag = shortSessionId(sessionId);
  const redis = getRedis();

  if (redis) {
    await redis.set(shortIdKey(tag), sessionId, { ex: MSG_TTL_SECONDS });
    return;
  }

  getMemoryStore().shortIdToSession.set(tag, sessionId);
}

export async function addChatMessage(
  sessionId: string,
  role: ChatMessage["role"],
  text: string
): Promise<ChatMessage> {
  const message: ChatMessage = {
    id: createId(),
    sessionId,
    role,
    text,
    createdAt: new Date().toISOString(),
  };

  const redis = getRedis();
  if (redis) {
    const key = messagesKey(sessionId);
    await redis.rpush(key, JSON.stringify(message));
    await redis.expire(key, MSG_TTL_SECONDS);
    await registerSession(sessionId);
    return message;
  }

  const store = getMemoryStore();
  const list = store.messages.get(sessionId) ?? [];
  list.push(message);
  store.messages.set(sessionId, list);
  store.shortIdToSession.set(shortSessionId(sessionId), sessionId);
  return message;
}

export async function getChatMessages(
  sessionId: string,
  since?: string
): Promise<ChatMessage[]> {
  const redis = getRedis();
  let list: ChatMessage[] = [];

  if (redis) {
    const raw = await redis.lrange<string>(messagesKey(sessionId), 0, -1);
    list = raw.map((item) => {
      if (typeof item === "string") return JSON.parse(item) as ChatMessage;
      return item as unknown as ChatMessage;
    });
  } else {
    list = [...(getMemoryStore().messages.get(sessionId) ?? [])];
  }

  if (!since) return list;
  const sinceTime = new Date(since).getTime();
  return list.filter((m) => new Date(m.createdAt).getTime() > sinceTime);
}

export async function linkTelegramMessage(
  telegramMessageId: number,
  sessionId: string
): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(telegramLinkKey(telegramMessageId), sessionId, {
      ex: MSG_TTL_SECONDS,
    });
    await registerSession(sessionId);
    return;
  }

  getMemoryStore().telegramMsgToSession.set(telegramMessageId, sessionId);
  getMemoryStore().shortIdToSession.set(shortSessionId(sessionId), sessionId);
}

export async function resolveSessionFromTelegramReply(
  replyToMessageId: number
): Promise<string | undefined> {
  const redis = getRedis();
  if (redis) {
    const sessionId = await redis.get<string>(telegramLinkKey(replyToMessageId));
    return sessionId ?? undefined;
  }

  return getMemoryStore().telegramMsgToSession.get(replyToMessageId);
}

export async function findSessionByShortId(
  tag: string
): Promise<string | undefined> {
  const normalized = tag.toLowerCase();
  const redis = getRedis();

  if (redis) {
    const sessionId = await redis.get<string>(shortIdKey(normalized));
    return sessionId ?? undefined;
  }

  return getMemoryStore().shortIdToSession.get(normalized);
}

export function extractSessionTag(text: string): string | null {
  const match = text.match(/#([a-z0-9]{6,12})\b/i);
  return match?.[1]?.toLowerCase() ?? null;
}

export function extractFullSessionId(text: string): string | null {
  const match = text.match(
    /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i
  );
  return match?.[1]?.toLowerCase() ?? null;
}

export async function ensureWelcomeMessage(
  sessionId: string
): Promise<ChatMessage[]> {
  const existing = await getChatMessages(sessionId);
  if (existing.length > 0) return existing;

  await registerSession(sessionId);
  await addChatMessage(
    sessionId,
    "bot",
    "Welcome to TOP ELD BOT! How can we help you today? Ask about Safety Score Check, ELD compliance, or your $200 service credit."
  );
  return getChatMessages(sessionId);
}
