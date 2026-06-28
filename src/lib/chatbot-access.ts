import { CHATBOT_ACCESS_CODE as CONFIG_ACCESS_CODE } from "@/config/chatbot";

export function getChatbotAccessCode(): string {
  const envCode = process.env.CHATBOT_ACCESS_CODE?.trim();
  if (envCode && /^\d{6}$/.test(envCode)) return envCode;
  return CONFIG_ACCESS_CODE.replace(/\D/g, "").slice(0, 6);
}

export function isValidAccessCode(code: string): boolean {
  const digits = code.replace(/\D/g, "");
  return digits.length === 6 && digits === getChatbotAccessCode();
}
