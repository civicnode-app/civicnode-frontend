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

// ── Demo accounts ────────────────────────────────────────────────────────────

export interface DemoAccount {
  id:         string;
  name:       string;
  role:       string;   // label yang ditampilkan di UI
  jwtRole:    string;   // role di dalam token (untuk proxy.ts)
  wallet:     string;   // wallet address (untuk WalletAvatar)
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id:      "acc-owner",
    name:    "Budi Santoso",
    role:    "Owner",
    jwtRole: "owner",
    wallet:  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
  {
    id:      "acc-admin",
    name:    "Dewi Rahayu",
    role:    "Admin",
    jwtRole: "admin",
    wallet:  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  },
  {
    id:      "acc-korlap",
    name:    "Ahmad Fauzi",
    role:    "Korlap Armada Kebersihan",
    jwtRole: "admin",   // akses penuh untuk keperluan demo
    wallet:  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  },
  {
    id:      "acc-operator",
    name:    "Siti Nurhaliza",
    role:    "Operator Call Center",
    jwtRole: "admin",   // akses penuh untuk keperluan demo
    wallet:  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  },
];

export function makeDemoToken(account: DemoAccount): string {
  const payload = btoa(
    JSON.stringify({
      staff_id:       account.id,
      wallet_address: account.wallet,
      role:           account.jwtRole,
    }),
  );
  return `demo.${payload}.signature`;
}
