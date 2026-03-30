"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, LogOut } from "lucide-react";
import { WalletAvatar } from "@/components/WalletAvatar";
import { useAppStore } from "@/stores/appStore";
import { getAuthPayload, removeAuthToken } from "@/lib/auth";

function LogoutDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative bg-[#DAD7CD] rounded-2xl shadow-2xl px-8 py-7 w-80 flex flex-col items-center gap-4 animate-[fadeUp_0.18s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="bg-red-100 rounded-full p-3">
          <LogOut size={24} className="text-red-500" strokeWidth={2.5} />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="font-extrabold text-[15px] text-[#333]">Keluar dari aplikasi?</p>
          <p className="text-[12px] text-[#777] mt-1">Sesi Anda akan diakhiri dan Anda perlu masuk ulang.</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full border-2 border-[#a3b18a] text-[#588157] font-bold text-[13px] bg-white hover:bg-[#f0f0ec] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-[13px] transition-colors cursor-pointer border-none"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

export function TopBar() {
  const { user } = useAppStore();
  const router = useRouter();
  const payload = getAuthPayload();
  const walletAddress = payload?.wallet_address ?? "";

  const [mounted, setMounted] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  function handleLogout() {
    removeAuthToken();
    router.push("/sign-in");
  }

  return (
    <>
      <header className="w-full bg-[#DAD7CD] border-b-2 border-[#588157] px-6 py-3 flex items-center gap-4 shrink-0">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0 no-underline">
          <Image
            src="/logo cv.png"
            alt="CivicNode"
            width={36}
            height={36}
            className="transition-transform duration-500 hover:rotate-180"
          />
          <div className="flex gap-1 text-xl font-extrabold">
            <span className="text-black">CIVIC</span>
            <span className="text-[#588157]">NODE</span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2 mx-6 w-80">
          <Search size={15} className="text-[#888] shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-[#333] w-full placeholder:text-[#bbb] font-medium"
          />
        </div>

        {/* Profile + Logout */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-3 bg-[#a3b18a] py-1.5 px-4 rounded-full text-white">
            {mounted && walletAddress
              ? <WalletAvatar address={walletAddress} size={34} className="border-2 border-[#333]" />
              : <div className="w-9 h-9 bg-[#eee] rounded-full border-2 border-[#333] shrink-0" />
            }
            <div className="leading-tight">
              <p className="m-0 font-extrabold text-[13px]">{mounted ? user.name : "..."}</p>
              <p className="m-0 text-[10px] opacity-80 uppercase">{mounted ? user.role : "..."}</p>
            </div>
          </div>
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
