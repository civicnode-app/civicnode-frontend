import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { nonceStore } from "@/lib/nonce-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.toLowerCase();

  if (!address) {
    return NextResponse.json({ error: "address wajib diisi" }, { status: 400 });
  }

  const nonce = randomBytes(32).toString("hex");
  // Nonce berlaku 5 menit
  nonceStore.set(address, { nonce, expires: Date.now() + 5 * 60 * 1000 });

  return NextResponse.json({ data: { nonce } });
}
