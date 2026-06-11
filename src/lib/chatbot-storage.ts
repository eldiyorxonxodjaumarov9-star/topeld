export type EldChatbotData = {
  step: 1 | 2 | "submitted";
  acceptedBonus: boolean | null;
  usdot: string;
  submittedAt: string | null;
  dismissed: boolean;
};

const STORAGE_KEY = "top-eld-chatbot";

export const DEFAULT_CHATBOT_DATA: EldChatbotData = {
  step: 1,
  acceptedBonus: null,
  usdot: "",
  submittedAt: null,
  dismissed: false,
};

export function loadChatbotData(): EldChatbotData {
  if (typeof window === "undefined") return DEFAULT_CHATBOT_DATA;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHATBOT_DATA;
    return { ...DEFAULT_CHATBOT_DATA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CHATBOT_DATA;
  }
}

export function saveChatbotData(data: Partial<EldChatbotData>): EldChatbotData {
  const current = loadChatbotData();
  const next = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function validateUsdot(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "USDOT number is required.";
  if (digits.length !== 7) return "USDOT must be exactly 7 digits.";
  return null;
}

export function formatUsdotInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 7);
}
