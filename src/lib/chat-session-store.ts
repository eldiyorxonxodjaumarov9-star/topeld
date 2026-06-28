export type ChatMessage = {
  id: string;
  sessionId: string;
  role: "user" | "bot";
  text: string;
  createdAt: string;
};

type ChatStore = {
  messages: Map<string, ChatMessage[]>;
  telegramMsgToSession: Map<number, string>;
};

const STORE_KEY = "__topeld_chat_store__";

function getStore(): ChatStore {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: ChatStore };
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = {
      messages: new Map(),
      telegramMsgToSession: new Map(),
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

export function addChatMessage(
  sessionId: string,
  role: ChatMessage["role"],
  text: string
): ChatMessage {
  const store = getStore();
  const message: ChatMessage = {
    id: createId(),
    sessionId,
    role,
    text,
    createdAt: new Date().toISOString(),
  };

  const list = store.messages.get(sessionId) ?? [];
  list.push(message);
  store.messages.set(sessionId, list);
  return message;
}

export function getChatMessages(
  sessionId: string,
  since?: string
): ChatMessage[] {
  const list = getStore().messages.get(sessionId) ?? [];
  if (!since) return [...list];
  const sinceTime = new Date(since).getTime();
  return list.filter((m) => new Date(m.createdAt).getTime() > sinceTime);
}

export function linkTelegramMessage(
  telegramMessageId: number,
  sessionId: string
): void {
  getStore().telegramMsgToSession.set(telegramMessageId, sessionId);
}

export function resolveSessionFromTelegramReply(
  replyToMessageId: number
): string | undefined {
  return getStore().telegramMsgToSession.get(replyToMessageId);
}

export function findSessionByShortId(tag: string): string | undefined {
  const normalized = tag.toLowerCase();
  for (const sessionId of getStore().messages.keys()) {
    if (shortSessionId(sessionId) === normalized) return sessionId;
  }
  return undefined;
}

export function ensureWelcomeMessage(sessionId: string): ChatMessage[] {
  const store = getStore();
  const existing = store.messages.get(sessionId);
  if (existing && existing.length > 0) return existing;

  addChatMessage(
    sessionId,
    "bot",
    "Welcome to TOP ELD BOT! How can we help you today? Ask about Safety Score Check, ELD compliance, or your $200 service credit."
  );
  return store.messages.get(sessionId) ?? [];
}
