export type EldChatbotStep = 1 | 2 | "chat";

export function validateAccessCode(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Access code is required.";
  if (digits.length !== 6) return "Code must be exactly 6 digits.";
  return null;
}

export function formatAccessCodeInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}
