import { NextResponse, type NextRequest } from "next/server";

const PROTECTED  = ["/dashboard", "/cctv", "/zona", "/system-config"];
const ADMIN_ONLY = ["/cctv", "/system-config"];

function getTokenRole(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? "";
  } catch {
    return "";
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;

  // Sudah login → jangan bisa akses /sign-in lagi
  if (token && pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Belum login → jangan bisa akses halaman protected
  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Bukan admin/owner → jangan bisa akses halaman admin-only
  const isAdminOnly = ADMIN_ONLY.some((path) => pathname.startsWith(path));
  if (isAdminOnly && token) {
    const role = getTokenRole(token);
    if (role !== "admin" && role !== "owner") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
