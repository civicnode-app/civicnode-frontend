import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/sign-in"];
const PROTECTED_PREFIXES = ["/dashboard", "/cctv", "/system-config"];

const decodeExp = (token: string): number | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const parsed = JSON.parse(json) as { exp?: number };
    return typeof parsed.exp === "number" ? parsed.exp : null;
  } catch {
    return null;
  }
};

const isProtectedPath = (pathname: string) => {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const backendToken = request.cookies.get("backend_token")?.value;
  if (!backendToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const exp = decodeExp(backendToken);
  const now = Math.floor(Date.now() / 1000);

  if (!exp || exp <= now) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.set("backend_token", "", { path: "/", maxAge: 0 });
    response.cookies.set("sb_access_token", "", { path: "/", maxAge: 0 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
