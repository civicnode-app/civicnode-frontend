"use client";
import { useAppStore } from "@/stores/appStore";
import { getAuthPayload } from "@/lib/auth";
import { WalletAvatar } from "@/components/WalletAvatar";

export function UserProfile() {
  const { user } = useAppStore();
  const payload = getAuthPayload();
  const walletAddress = payload?.wallet_address ?? "";

  return (
    <div className="bg-[#a3b18a] px-5 py-1.5 rounded-full flex items-center gap-3 text-white shadow-md">
      {walletAddress ? (
        <WalletAvatar address={walletAddress} size={38} className="border-2 border-[#333]" />
      ) : (
        <div className="w-10 h-10 bg-[#eee] rounded-full border-2 border-[#333] shrink-0" />
      )}
      <div className="leading-tight">
        <p className="font-extrabold text-[15px] m-0">{user.name}</p>
        <p className="text-[10px] opacity-80 m-0">{user.role.toUpperCase()}</p>
      </div>
    </div>
  );
}
