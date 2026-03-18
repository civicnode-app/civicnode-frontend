"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  googleAuthRequestSchema,
  googleAuthResponseSchema,
  googleAuthUrlResponseSchema,
  oauthCallbackTokenSchema,
} from "@/lib/validation";
import { TokenManager } from "@/services/token-manager";
import { useAppStore } from "@/stores/appStore";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

const getOAuthTokenFromUrl = () => {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);

  // Supabase OAuth implicit flow commonly returns access_token in hash fragment.
  const accessToken = hashParams.get("access_token") ?? queryParams.get("access_token");
  return accessToken ?? "";
};

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exchangeTokensToBackend = async (rawTokens: { access_token: string }) => {
    const payloadValidation = googleAuthRequestSchema.safeParse({
      accessToken: rawTokens.access_token,
    });

    if (!payloadValidation.success) {
      throw new Error("Payload auth Google tidak valid di sisi client.");
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadValidation.data),
    });

    const contentType = response.headers.get("content-type") ?? "";
    const responseData = contentType.includes("application/json")
      ? await response.json()
      : { error: await response.text() };

    if (!response.ok) {
      throw new Error(responseData?.error ?? "Gagal autentikasi ke backend.");
    }

    const responseValidation = googleAuthResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      throw new Error("Format response auth backend tidak sesuai skema.");
    }

    return responseValidation.data;
  };

  useEffect(() => {
    const accessToken = getOAuthTokenFromUrl();

    if (!accessToken) {
      return;
    }

    const tokenValidation = oauthCallbackTokenSchema.safeParse({
      access_token: accessToken ?? "",
    });

    if (!tokenValidation.success) {
      setError("Token callback tidak valid. Silakan login ulang.");
      return;
    }

    const processCallback = async () => {
      try {
        setLoading(true);
        setError(null);

        const authData = await exchangeTokensToBackend(tokenValidation.data);
        TokenManager.persistSession({
          accessToken: tokenValidation.data.access_token,
          backendToken: authData.backendToken,
        });

        // Keep profile pop-up synchronized right after OAuth success.
        setUser({
          name: authData.user.full_name,
          role: "OWNER",
          avatar: authData.user.avatar_url ?? undefined,
        });

        window.history.replaceState({}, "", window.location.pathname);
        router.push("/dashboard");
      } catch (callbackError) {
        const message =
          callbackError instanceof Error
            ? callbackError.message
            : "Terjadi kesalahan saat memproses callback login.";
        setError(message);
        setLoading(false);
      }
    };

    void processCallback();
  }, [router, setUser]);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BACKEND_URL}/api/auth/google/url`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const contentType = response.headers.get("content-type") ?? "";
      const responseData = contentType.includes("application/json")
        ? await response.json()
        : { error: await response.text() };
      if (!response.ok) {
        throw new Error(responseData?.error ?? "Gagal memulai login Google.");
      }

      const parsed = googleAuthUrlResponseSchema.safeParse(responseData);
      if (!parsed.success) {
        throw new Error("Response URL OAuth tidak valid.");
      }

      window.location.href = parsed.data.url;
    } catch (oauthFlowError) {
      const message =
        oauthFlowError instanceof Error
          ? oauthFlowError.message
          : "Gagal memulai login Google.";
      setError(message);
      setLoading(false);
    }
  };

  const handleMetaMaskLogin = () => {
    setError("Login dengan MetaMask belum tersedia.");
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden">
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#588157",
          padding: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "#DAD7CD",
            borderRadius: "30px",
            padding: "40px 32px",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                display: "flex",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <span style={{ color: "#000" }}>CIVIC</span>
              <span style={{ color: "#588157" }}>NODE</span>
            </div>
            <p style={{ color: "#666", marginTop: "8px", fontSize: "14px" }}>
              Masuk ke akun Anda
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                width: "100%",
                padding: "14px",
                borderRadius: "50px",
                border: "2px solid #dadce0",
                backgroundColor: "white",
                color: "#3c4043",
                fontWeight: 700,
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Memproses..." : "Masuk dengan Google"}
            </button>

            <button
              onClick={handleMetaMaskLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "50px",
                border: "2px solid #e8761b",
                backgroundColor: "white",
                color: "#e8761b",
                fontWeight: 700,
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Masuk dengan MetaMask
            </button>

            {error && (
              <p
                style={{
                  color: "#b42318",
                  fontSize: "13px",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
