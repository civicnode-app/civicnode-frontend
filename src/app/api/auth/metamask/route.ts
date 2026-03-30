import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import { nonceStore } from "@/lib/nonce-store";

const JWT_SECRET =
  process.env.JWT_SECRET ?? "civicnode-dev-secret-change-in-production";

export async function POST(request: Request) {
  try {
    const { wallet_address, signature, nonce } = await request.json();

    if (!wallet_address || !signature || !nonce) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Cek nonce — harus ada dan belum kedaluwarsa
    const stored = nonceStore.get(wallet_address.toLowerCase());
    if (!stored || stored.nonce !== nonce || Date.now() > stored.expires) {
      return NextResponse.json(
        { error: "Nonce tidak valid atau sudah kedaluwarsa" },
        { status: 401 },
      );
    }

    // Verifikasi tanda tangan MetaMask
    // Nonce ber-prefix 0x → perlakukan sebagai raw bytes (sesuai cara MetaMask encode saat personal_sign)
    const recovered = ethers.verifyMessage(ethers.getBytes(nonce), signature);
    if (recovered.toLowerCase() !== wallet_address.toLowerCase()) {
      return NextResponse.json(
        { error: "Tanda tangan tidak valid" },
        { status: 401 },
      );
    }

    // Hapus nonce — satu kali pakai
    nonceStore.delete(wallet_address.toLowerCase());

    // Terbitkan JWT (berlaku 24 jam)
    const access_token = jwt.sign(
      { staff_id: wallet_address, wallet_address, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    return NextResponse.json({ data: { access_token } });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
