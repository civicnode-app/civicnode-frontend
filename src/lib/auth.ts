const COOKIE_NAME = "access_token";
const MAX_AGE     = 60 * 60 * 24; // 24 jam

export function setAuthToken(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Strict`;
}

export function getAuthToken(): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((r) => r.startsWith(`${COOKIE_NAME}=`))
      ?.split("=")[1] ?? ""
  );
}

export function removeAuthToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export function getAuthPayload(): { staff_id?: string; wallet_address?: string; role?: string } | null {
  const token = getAuthToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}
