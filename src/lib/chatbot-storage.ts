export type EldChatbotData = {
  step: 1 | 2 | "chat";
  acceptedBonus: boolean | null;
  accessCode: string;
  chatUnlocked: boolean;
  dismissed: boolean;
};

const STORAGE_KEY = "top-eld-chatbot";

export const DEFAULT_CHATBOT_DATA: EldChatbotData = {
  step: 1,
  acceptedBonus: null,
  accessCode: "",
  chatUnlocked: false,
  dismissed: false,
};

export function loadChatbotData(): EldChatbotData {
  if (typeof window === "undefined") return DEFAULT_CHATBOT_DATA;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHATBOT_DATA;
    const parsed = JSON.parse(raw) as Partial<EldChatbotData>;
    return {
      ...DEFAULT_CHATBOT_DATA,
      ...parsed,
      step:
        parsed.step === 2 || parsed.step === "chat"
          ? parsed.step
          : parsed.chatUnlocked
            ? "chat"
            : 1,
    };
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

export function validateAccessCode(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Access code is required.";
  if (digits.length !== 6) return "Code must be exactly 6 digits.";
  return null;
}

export function formatAccessCodeInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}
