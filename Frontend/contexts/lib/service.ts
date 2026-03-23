export type ServiceId = "nfc-business" | "loyalty" | "e-invitation";

export const SERVICE_IDS: ServiceId[] = ["nfc-business", "loyalty", "e-invitation"];

export function isValidServiceId(value: string): value is ServiceId {
  return SERVICE_IDS.includes(value as ServiceId);
}

const STORAGE_KEY = "selectedService";

function getAuthStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  if (localStorage.getItem("authToken")) return localStorage;
  if (sessionStorage.getItem("authToken")) return sessionStorage;
  return null;
}

export function getSelectedService(): ServiceId | null {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
  if (!raw || !isValidServiceId(raw)) return null;
  return raw;
}

export function setStoredService(id: ServiceId): void {
  if (typeof window === "undefined") return;
  const storage = getAuthStorage();
  if (storage) {
    storage.setItem(STORAGE_KEY, id);
    return;
  }
  localStorage.setItem(STORAGE_KEY, id);
}

export function clearStoredService(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}
