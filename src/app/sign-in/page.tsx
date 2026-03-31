"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken, DEMO_ACCOUNTS, makeDemoToken } from "@/lib/auth";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simulasi delay MetaMask
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Login sebagai Owner (akun pertama) secara default
    setAuthToken(makeDemoToken(DEMO_ACCOUNTS[0]));
    router.push("/dashboard");
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden">
      <div className="flex min-h-screen items-center justify-center bg-[#588157]">
        <div className="bg-[#DAD7CD] rounded-[30px] py-12.5 px-10 w-full max-w-100 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
          <div className="text-center mb-8.75">
            <div className="text-[28px] font-extrabold flex justify-center gap-1">
              <span className="text-black">CIVIC</span>
              <span className="text-[#588157]">NODE</span>
            </div>
            <p className="text-[#666] mt-2 text-sm">Masuk ke akun Anda</p>
          </div>

          <div className="flex flex-col gap-3.5">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full py-4 px-8 rounded-full border-2 border-[#e8761b] bg-white text-[#e8761b] font-bold text-[15px] cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#e8761b" strokeWidth="3" />
                    <path className="opacity-75" fill="#e8761b" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Menghubungkan...
                </>
              ) : (
                <>
                  <svg width="22" height="22" viewBox="0 0 318.6 318.6" xmlns="http://www.w3.org/2000/svg">
                    <polygon fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" points="274.1,35.5 174.6,109.4 193,65.8" />
                    <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="44.4,35.5 143.1,110.1 125.6,65.8" />
                    <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7" />
                    <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8" />
                    <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,104.1" />
                    <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="214.9,138.2 176.3,103.4 174.6,164.6 230.8,162.1" />
                    <polygon fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" points="106.8,247.4 140.6,230.9 111.4,208.1" />
                    <polygon fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" points="177.9,230.9 211.8,247.4 207.1,208.1" />
                    <polygon fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" points="211.8,247.4 177.9,230.9 180.6,253 180.3,262.3" />
                    <polygon fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" points="106.8,247.4 138.3,262.3 138.1,253 140.6,230.9" />
                    <polygon fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" points="138.8,193.5 110.6,185.2 130.5,176.1" />
                    <polygon fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" points="179.7,193.5 187.9,176.1 208,185.2" />
                    <polygon fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" points="106.8,247.4 111.6,206.8 80.3,207.7" />
                    <polygon fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" points="207,206.8 211.8,247.4 238.3,207.7" />
                    <polygon fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" points="230.8,162.1 174.6,164.6 179.7,193.5 187.9,176.1 208,185.2" />
                    <polygon fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" points="110.6,185.2 130.5,176.1 138.8,193.5 144.1,164.6 87.8,162.1" />
                    <polygon fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" points="87.8,162.1 111.4,208.1 110.6,185.2" />
                    <polygon fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" points="208,185.2 207.1,208.1 230.8,162.1" />
                    <polygon fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" points="144.1,164.6 138.8,193.5 145.4,227.6 146.9,182.7" />
                    <polygon fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" points="174.6,164.6 171.9,182.6 173.1,227.6 179.7,193.5" />
                    <polygon fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" points="179.7,193.5 173.1,227.6 177.9,230.9 207.1,208.1 208,185.2" />
                    <polygon fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" points="110.6,185.2 111.4,208.1 140.6,230.9 145.4,227.6 138.8,193.5" />
                    <polygon fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round" points="180.3,262.3 180.6,253 178.1,250.8 140.4,250.8 138.1,253 138.3,262.3 106.8,247.4 117.8,256.4 140.1,271.9 178.4,271.9 200.8,256.4 211.8,247.4" />
                    <polygon fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" points="177.9,230.9 173.1,227.6 145.4,227.6 140.6,230.9 138.1,253 140.4,250.8 178.1,250.8 180.6,253" />
                    <polygon fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" points="278.3,114.2 286.8,73.4 274.1,35.5 177.9,106.9 214.9,138.2 267.2,153.5 278.8,140 273.8,136.4 281.8,129.1 275.6,124.3 283.6,118.2" />
                    <polygon fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" points="31.8,73.4 40.3,114.2 34.9,118.2 42.9,124.3 36.8,129.1 44.8,136.4 39.8,140 51.3,153.5 103.6,138.2 140.6,106.9 44.4,35.5" />
                    <polygon fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" points="267.2,153.5 214.9,138.2 230.8,162.1 207.1,208.1 238.3,207.7 284.8,207.7" />
                    <polygon fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" points="103.6,138.2 51.3,153.5 33.9,207.7 80.3,207.7 111.4,208.1 87.8,162.1" />
                    <polygon fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" points="174.6,164.6 177.9,106.9 193.2,65.8 125.6,65.8 140.6,106.9 144.1,164.6 145.3,182.8 145.4,227.6 173.1,227.6 173.3,182.8" />
                  </svg>
                  Masuk dengan MetaMask
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
