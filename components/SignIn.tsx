"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Empty string = same origin; Next.js rewrites proxy /api/* → Express (port 4000)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // After OAuth redirect, backend appends ?access_token=...&refresh_token=...
  // Store them in localStorage and clean the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (accessToken) {
      localStorage.setItem("sb_access_token", accessToken);
      if (refreshToken) localStorage.setItem("sb_refresh_token", refreshToken);
      window.history.replaceState({}, "", window.location.pathname);
      router.push("/dashboard");
    }
  }, [router]);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      // Step 1: Ask backend for the Google OAuth URL (PKCE handled server-side)
      const res = await fetch(`${BACKEND_URL}/api/auth/google`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Gagal mendapatkan URL autentikasi dari server.");
      const { url } = await res.json();
      // Step 2: Redirect browser to Google login
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden">
      {/* 1. Background Bergerak Unik (Sama dengan Login) */}
      <div className="absolute -inset-10 bg-[url('/hutan.jpg')] bg-cover bg-center animate-hutan-pro -z-[2]"></div>

      {/* 2. Overlay Gelap */}
      <div className="absolute inset-0 bg-black/45 backdrop-brightness-75 -z-[1]"></div>

      {/* 3. Box Register */}
      <div className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[40px] shadow-2xl text-white mx-4 animate-fade-up">
        <h2 className="text-4xl font-bold text-center mb-10 tracking-tight">
          Create Account
        </h2>

        <form className="space-y-6">
          <div className="flex flex-col items-center gap-3 mt-6">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Menghubungkan..." : "Login dengan Google"}
            </button>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>
          <br />

          <p className="text-center text-sm opacity-80">
            Don&apos;t have an account?{" "}
            <a
              href="/SignUp"
              className="font-bold text-lime-400 hover:underline"
            >
              Sign Up Here
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
