"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { getAuthToken } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

interface StaffProfile {
  id: string;
  full_name: string;
  role: string;
  wallet_address: string;
  created_at: string;
}

function truncateWallet(address: string) {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function SystemConfigPage() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => { if (json.success) setProfile(json.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-end items-center gap-4">
          <div className="text-[22px] cursor-pointer relative leading-none">
            🔔
            <div className="absolute top-0 right-0 w-2.25 h-2.25 bg-red-500 rounded-full border-2 border-[#588157]"></div>
          </div>
          <div className="bg-[#a3b18a] py-1.5 px-5 rounded-full flex items-center gap-3 text-white">
            <div className="w-9.5 h-9.5 bg-[#eee] rounded-full border-2 border-[#333] shrink-0"></div>
            <div className="leading-[1.3]">
              <p className="font-extrabold m-0 text-sm">
                {profile?.full_name ?? "—"}
              </p>
              <p className="text-[10px] m-0 opacity-80 uppercase">
                {profile?.role ?? "—"}
              </p>
            </div>
          </div>
        </header>

        {/* Config Grid */}
        <div className="bg-[#CADBB7] rounded-[45px] p-9 flex-1 grid grid-cols-3 gap-5">
          {/* ── KOLOM 1: Profil ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                👤 PROFILE
              </p>
              <div className="flex items-center gap-3.5 mt-3.5">
                <div className="w-13 h-13 bg-[#DAD7CD] rounded-full border-[3px] border-[#588157] shrink-0"></div>
                <div>
                  <p className="m-0 font-black text-[16px]">
                    {profile?.full_name ?? "—"}
                  </p>
                  <p className="m-0 mt-0.5 text-xs text-[#588157] font-bold uppercase">
                    {profile?.role ?? "—"}
                  </p>
                  <p className="m-0 mt-0.5 text-[11px] text-[#888] font-mono">
                    {profile ? truncateWallet(profile.wallet_address) : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── KOLOM 2: System Info ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                ⚙️ SYSTEM INFO
              </p>
              <div className="mt-3.5 flex flex-col gap-2.5">
                {[
                  { label: "App Version", value: "v1.0.0" },
                  { label: "AI Model", value: "YOLOv8n" },
                  { label: "Environment", value: "Production" },
                  { label: "Last Updated", value: "09 Mar 2026" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center border-b border-[#e0e8d8] pb-2"
                  >
                    <span className="text-xs text-[#666] font-semibold">{row.label}</span>
                    <span className={`text-xs font-extrabold ${row.value === "v1.0.0" ? "text-[#588157]" : "text-[#333]"}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── KOLOM 3: About ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                ℹ️ ABOUT
              </p>
              <div className="mt-3.5">
                <p className="m-0 font-black text-[15px] text-[#222]">CivicNode AI</p>
                <p className="m-0 mt-1.5 text-xs text-[#666] leading-[1.6]">
                  Smart environmental surveillance platform powered by Computer
                  Vision &amp; MetaMask authentication.
                </p>
                <p className="m-0 mt-3 text-[11px] text-[#a3b18a] font-bold">
                  © 2026 CivicNode Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
