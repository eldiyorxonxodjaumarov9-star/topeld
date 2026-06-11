const STORAGE_KEY = "top-eld-contact-registered";

export function isContactRegistered(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markContactRegistered(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, "1");
}

/** Sinash uchun — brauzer console: localStorage.removeItem('top-eld-contact-registered') */
export function clearContactRegistration(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
