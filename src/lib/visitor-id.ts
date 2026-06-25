const VISITOR_ID_KEY = "topeld-visitor-id";

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "unknown";

  const existing = localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(VISITOR_ID_KEY, id);
  return id;
}
