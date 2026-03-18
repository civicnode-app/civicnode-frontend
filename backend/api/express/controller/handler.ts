import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail, upsertUser } from "../model/model";
import {
  googleAuthRequestSchema,
  googleAuthResponseSchema,
  googleAuthUrlResponseSchema,
  userProfileSchema,
  userUpsertSchema,
} from "../../validator/validate";
import { getRequiredEnv } from "../../config/env";
import { getGoogleAuthorizeUrl, supabaseAdmin } from "../../config/supabase";

export const handleGoogleAuthStart = async (_req: Request, res: Response) => {
  try {
    const redirectTo =
      process.env.GOOGLE_REDIRECT_URL ??
      `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/sign-in`;
    const authUrl = getGoogleAuthorizeUrl(redirectTo);
    const responseValidation = googleAuthUrlResponseSchema.safeParse({
      success: true,
      url: authUrl,
    });

    if (!responseValidation.success) {
      return res.status(500).json({
        error: "URL auth Google gagal divalidasi",
        detail: responseValidation.error.issues,
      });
    }

    return res.status(200).json(responseValidation.data);
  } catch (error) {
    console.error("Google auth start error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Endpoint: POST /auth/google
export const handleGoogleAuth = async (req: Request, res: Response) => {
  try {
    // Re-validate in controller so direct invocation still gets guarded.
    const payloadResult = googleAuthRequestSchema.safeParse(req.body);
    if (!payloadResult.success) {
      return res.status(400).json({
        error: "Payload auth Google tidak valid",
        detail: payloadResult.error.issues,
      });
    }

    const { accessToken } = payloadResult.data;
    
    // Verifikasi access token dari Supabase
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      return res
        .status(401)
        .json({ error: "Token tidak valid atau kedaluwarsa" });
    }

    // Ambil atau buat user di database
    let dbUser = await getUserByEmail(user.email!);

    if (!dbUser) {
      // Jika user tidak ada, buat user baru
      const dataInput = {
        email: user.email!,
        full_name: user.user_metadata?.full_name || "User Tanpa Nama",
        avatar_url: user.user_metadata?.avatar_url || null,
      };

        // 2. Validasi dengan Zod (Gatekeeper)
        const validasi = userUpsertSchema.safeParse(dataInput);

      if (!validasi.success) {
        console.error("Validasi profil gagal:", validasi.error.format());
        return res.status(400).json({
          error: "Gagal membuat profil: Data Google tidak valid",
          detail: validasi.error.issues,
        });
      }

      // 3. Simpan data yang sudah divalidasi 100% oleh Zod
      // validasi.data berisi objek yang sudah dijamin sesuai tipe dan aturannya
      dbUser = await upsertUser(validasi.data);
    }

    const dbUserValidation = userProfileSchema.safeParse(dbUser);
    if (!dbUserValidation.success) {
      return res.status(500).json({
        error: "Data user di database tidak sesuai skema",
        detail: dbUserValidation.error.issues,
      });
    }

    // Generate JWT payload (opsional, untuk keperluan backend sendiri)
    const jwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.user_metadata?.full_name,
    };

    const backendJWT = jwt.sign(jwtPayload, getRequiredEnv("JWT_SECRET"), {
      expiresIn: "1h",
    });

    const responsePayload = {
      success: true,
      user: dbUserValidation.data,
      backendToken: backendJWT, // Token backend untuk validasi endpoint lain
    };

    const responseValidation = googleAuthResponseSchema.safeParse(responsePayload);
    if (!responseValidation.success) {
      return res.status(500).json({
        error: "Response auth Google gagal divalidasi",
        detail: responseValidation.error.issues,
      });
    }

    return res.status(200).json(responseValidation.data);
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware: Validasi JWT
export const verifyJWT = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, getRequiredEnv("JWT_SECRET"));
    req.body.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Token tidak valid atau kedaluwarsa" });
  }
};
