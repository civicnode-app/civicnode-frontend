import { z } from "zod";

export const googleAuthRequestSchema = z.object({
  accessToken: z.string().min(1, "Access token wajib diisi"),
});

export const googleAuthResponseSchema = z.object({
  success: z.literal(true),
  user: z.object({
    id: z.union([
      z.number().int().nonnegative(),
      z.string().regex(/^\d+$/),
    ]),
    email: z.string().email(),
    full_name: z.string().min(1),
    avatar_url: z.string().url().nullable().optional(),
  }),
  backendToken: z.string().min(1),
});

export const googleAuthUrlResponseSchema = z.object({
  success: z.literal(true),
  url: z.string().url(),
});

export const oauthCallbackTokenSchema = z.object({
  access_token: z.string().min(1, "access_token tidak ditemukan"),
});

export const systemConfigSchema = z.object({
  resolution: z.enum(["720p", "1080p", "1440p"]),
  frameRate: z.coerce.number().int().min(1).max(120),
  detectionMode: z.enum(["auto", "manual"]),
  snapshotInterval: z.coerce.number().int().min(1).max(120),
});

export type GoogleAuthRequest = z.infer<typeof googleAuthRequestSchema>;
export type GoogleAuthResponse = z.infer<typeof googleAuthResponseSchema>;
export type SystemConfigInput = z.infer<typeof systemConfigSchema>;
