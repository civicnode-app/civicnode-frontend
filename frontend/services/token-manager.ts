const ACCESS_TOKEN_STORAGE_KEY = "sb_access_token";
const BACKEND_TOKEN_STORAGE_KEY = "backend_token";

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

const getCookieMaxAge = (token: string): number => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return 0;

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
};

const setTokenCookie = (name: string, token: string) => {
  const maxAge = getCookieMaxAge(token);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
};

export const TokenManager = {
  persistSession: (tokens: { accessToken: string; backendToken: string }) => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
    localStorage.setItem(BACKEND_TOKEN_STORAGE_KEY, tokens.backendToken);

    setTokenCookie(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
    setTokenCookie(BACKEND_TOKEN_STORAGE_KEY, tokens.backendToken);
  },

  clearSession: () => {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(BACKEND_TOKEN_STORAGE_KEY);

    document.cookie = `${ACCESS_TOKEN_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `${BACKEND_TOKEN_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
  },

  isExpired: (token: string) => {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  },

  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
  getBackendToken: () => localStorage.getItem(BACKEND_TOKEN_STORAGE_KEY),
};

