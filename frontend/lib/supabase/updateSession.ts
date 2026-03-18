import { NextResponse, type NextRequest } from "next/server";

const decodeExp = (token: string): number | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(atob(base64)) as { exp?: number };
    return typeof parsed.exp === "number" ? parsed.exp : null;
  } catch {
    return null;
  }
};

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const backendToken = request.cookies.get("backend_token")?.value;

  if (!backendToken) {
    return response;
  }

  const exp = decodeExp(backendToken);
  const now = Math.floor(Date.now() / 1000);

  if (!exp || exp <= now) {
    response.cookies.set("backend_token", "", { path: "/", maxAge: 0 });
    response.cookies.set("sb_access_token", "", { path: "/", maxAge: 0 });
  }

  return response;
}