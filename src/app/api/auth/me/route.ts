import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ?? "civicnode-dev-secret-change-in-production";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token tidak ditemukan" },
      { status: 401 },
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      staff_id: string;
      wallet_address: string;
      role: string;
    };

    return NextResponse.json({
      success: true,
      data: {
        id:             payload.staff_id,
        full_name:      "Demo Admin",
        role:           payload.role,
        wallet_address: payload.wallet_address,
        created_at:     new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Token tidak valid" },
      { status: 401 },
    );
  }
}
