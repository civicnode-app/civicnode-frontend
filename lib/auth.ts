const COOKIE_NAME = "access_token";
const MAX_AGE     = 60 * 60 * 24; // 24 jam

export function setAuthToken(token: string) {
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Strict`;
}

export function getAuthToken(): string {
  return (
    document.cookie
      .split("; ")
      .find((r) => r.startsWith(`${COOKIE_NAME}=`))
      ?.split("=")[1] ?? ""
  );
}

export function removeAuthToken() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
