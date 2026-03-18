'use client';
import { useAccount, useSignMessage } from 'wagmi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function LinkWallet() {
  const supabase = createClientComponentClient();
  const { address, isConnected } = useAccount(); // Dari RainbowKit/Wagmi
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);

  const handleLinkWallet = async () => {
    try {
      setLoading(true);
      // 1. Buat pesan untuk ditandatangani
      const message = `CivicNode AI: Saya memverifikasi bahwa wallet ${address} adalah milik saya.`;
      
      // 2. Minta user tanda tangan via MetaMask (muncul popup MetaMask)
      const signature = await signMessageAsync({ message });

      // 3. Kirim signature dan address ke backend Next.js kita untuk diverifikasi
      const response = await fetch('/api/verify-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, message }),
      });

      if (response.ok) {
        alert("Wallet berhasil dihubungkan ke akun Google Anda!");
      } else {
        alert("Gagal memverifikasi wallet.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-900 text-white">
      <h3>Identitas Web3</h3>
      {isConnected ? (
        <button onClick={handleLinkWallet} disabled={loading} className="bg-green-500 p-2 rounded">
          {loading ? "Memverifikasi..." : "Verifikasi & Hubungkan MetaMask"}
        </button>
      ) : (
        <p>Silakan Connect Wallet (RainbowKit) terlebih dahulu.</p>
      )}
    </div>
  );
}