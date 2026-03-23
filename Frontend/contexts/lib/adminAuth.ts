const SESSION_KEY = "boldtapAdminSession";

function expectedPassword(): string {
  return (
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_BOLDTAP_ADMIN_PASSWORD) ||
    "boldtap-admin"
  );
}

export function loginAdmin(password: string): boolean {
  if (typeof window === "undefined") return false;
  if (password !== expectedPassword()) return false;
  sessionStorage.setItem(SESSION_KEY, "1");
  return true;
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
