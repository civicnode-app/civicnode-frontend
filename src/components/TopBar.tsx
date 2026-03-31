"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, LogOut, ChevronDown, Check } from "lucide-react";
import { WalletAvatar } from "@/components/WalletAvatar";
import { useAppStore } from "@/stores/appStore";
import {
  getAuthPayload, removeAuthToken,
  setAuthToken, makeDemoToken,
  DEMO_ACCOUNTS, type DemoAccount,
} from "@/lib/auth";

// ── Logout confirmation dialog ───────────────────────────────────────────────

function LogoutDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-[#DAD7CD] rounded-2xl shadow-2xl px-8 py-7 w-80 flex flex-col items-center gap-4 animate-[fadeUp_0.18s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-100 rounded-full p-3">
          <LogOut size={24} className="text-red-500" strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <p className="font-extrabold text-[15px] text-[#333]">Keluar dari aplikasi?</p>
          <p className="text-[12px] text-[#777] mt-1">Sesi Anda akan diakhiri dan Anda perlu masuk ulang.</p>
        </div>
        <div className="flex gap-3 w-full mt-1">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-full border-2 border-[#a3b18a] text-[#588157] font-bold text-[13px] bg-white hover:bg-[#f0f0ec] transition-colors cursor-pointer">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-[13px] transition-colors cursor-pointer border-none">
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Account switcher dropdown ────────────────────────────────────────────────

function AccountSwitcher({
  currentWallet,
  onSwitch,
  onClose,
}: {
  currentWallet: string;
  onSwitch: (account: DemoAccount) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden animate-[fadeUp_0.15s_ease-out]"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <p className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">Ganti Akun Simulasi</p>
      </div>

      {/* Account list */}
      <div className="p-2 flex flex-col gap-0.5">
        {DEMO_ACCOUNTS.map((acc) => {
          const isActive = acc.wallet.toLowerCase() === currentWallet.toLowerCase();
          return (
            <button
              key={acc.id}
              onClick={() => { onSwitch(acc); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 cursor-pointer border-none ${
                isActive ? "bg-[#f0f5ee]" : "bg-transparent hover:bg-slate-50"
              }`}
            >
              <WalletAvatar address={acc.wallet} size={36} className="border-2 border-white shadow-sm shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="m-0 font-black text-[13px] text-slate-800 truncate">{acc.name}</p>
                <p className="m-0 text-[10px] text-slate-400 font-semibold truncate">{acc.role}</p>
              </div>
              {isActive && <Check size={14} className="text-[#588157] shrink-0" strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
        <p className="text-[10px] text-slate-400 text-center">Akun simulasi — tidak terhubung ke wallet nyata</p>
      </div>
    </div>
  );
}

// ── TopBar ───────────────────────────────────────────────────────────────────

export function TopBar() {
  const { user, setUser } = useAppStore();
  const router = useRouter();

  const [mounted, setMounted]               = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSwitcher, setShowSwitcher]     = useState(false);

  const payload       = getAuthPayload();
  const walletAddress = payload?.wallet_address ?? "";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  function handleLogout() {
    removeAuthToken();
    router.push("/sign-in");
  }

  function handleSwitch(account: DemoAccount) {
    setAuthToken(makeDemoToken(account));
    setUser({ name: account.name, role: account.role });
    // Hard reload agar payload di cookie terbaca ulang oleh proxy & komponen lain
    window.location.reload();
  }

  return (
    <>
      <header className="w-full bg-[#DAD7CD] border-b-2 border-[#588157] px-6 py-3 flex items-center gap-4 shrink-0">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0 no-underline">
          <Image src="/logo cv.png" alt="CivicNode" width={36} height={36} className="transition-transform duration-500 hover:rotate-180" />
          <div className="flex gap-1 text-xl font-extrabold">
            <span className="text-black">CIVIC</span>
            <span className="text-[#588157]">NODE</span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2 mx-6 w-80">
          <Search size={15} className="text-[#888] shrink-0" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-[#333] w-full placeholder:text-[#bbb] font-medium" />
        </div>

        {/* Profile + Logout */}
        <div className="ml-auto flex items-center gap-2">

          {/* Profile pill — clickable, opens account switcher */}
          <div className="relative">
            <button
              onClick={() => setShowSwitcher((v) => !v)}
              className="flex items-center gap-3 bg-[#a3b18a] hover:bg-[#8fa377] py-1.5 px-4 rounded-full text-white transition-colors duration-200 cursor-pointer border-none"
            >
              {mounted && walletAddress
                ? <WalletAvatar address={walletAddress} size={34} className="border-2 border-[#333]" />
                : <div className="w-9 h-9 bg-[#eee] rounded-full border-2 border-[#333] shrink-0" />
              }
              <div className="leading-tight text-left">
                <p className="m-0 font-extrabold text-[13px]">{mounted ? user.name : "..."}</p>
                <p className="m-0 text-[10px] opacity-80 uppercase">{mounted ? user.role : "..."}</p>
              </div>
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                className={`ml-1 transition-transform duration-200 ${showSwitcher ? "rotate-180" : ""}`}
              />
            </button>

            {showSwitcher && mounted && (
              <AccountSwitcher
                currentWallet={walletAddress}
                onSwitch={handleSwitch}
                onClose={() => setShowSwitcher(false)}
              />
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={() => setShowLogoutDialog(true)}
            title="Logout"
            className="p-2.5 rounded-full bg-white/60 hover:bg-red-50 text-[#888] hover:text-red-500 transition-colors duration-200 cursor-pointer border-none"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {showLogoutDialog && (
        <LogoutDialog
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutDialog(false)}
        />
      )}
    </>
  );
}
