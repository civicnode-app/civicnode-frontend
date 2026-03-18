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
  const accessToken = hashParams.get("access_token") ?? queryParams.get("access_token");
  return accessToken ?? "";
};

export default function SignIn() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenValidation = oauthCallbackTokenSchema.safeParse({
      access_token: getOAuthTokenFromUrl(),
    });

    if (!tokenValidation.success) {
      return;
    }

    const syncAuth = async () => {
      try {
        const payload = googleAuthRequestSchema.parse({
          accessToken: tokenValidation.data.access_token,
        });

        const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type") ?? "";
        const responseData = contentType.includes("application/json")
          ? await response.json()
          : { error: await response.text() };

        if (!response.ok) {
          throw new Error(responseData?.error ?? "Autentikasi backend gagal.");
        }

        const parsedResponse = googleAuthResponseSchema.parse(responseData);
        TokenManager.persistSession({
          accessToken: tokenValidation.data.access_token,
          backendToken: parsedResponse.backendToken,
        });

        setUser({
          name: parsedResponse.user.full_name,
          role: "OWNER",
          avatar: parsedResponse.user.avatar_url ?? undefined,
        });

        window.history.replaceState({}, "", window.location.pathname);
        router.push("/dashboard");
      } catch (syncError) {
        const message =
          syncError instanceof Error
            ? syncError.message
            : "Terjadi kesalahan sinkronisasi autentikasi.";
        setError(message);
      }
    };

    void syncAuth();
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "1px solid #d0d5dd",
          backgroundColor: "white",
          color: "#344054",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Memproses..." : "Login dengan Google"}
      </button>

      {error && (
        <p style={{ color: "#b42318", margin: 0, fontSize: "12px" }}>{error}</p>
      )}
    </div>
  );
}
