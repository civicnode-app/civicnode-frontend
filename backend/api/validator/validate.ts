import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const googleAuthRequestSchema = z.object({
  accessToken: z.string().min(1, "accessToken wajib diisi"),
});

const userIdSchema = z.union([
  z.number().int().nonnegative(),
  z.string().regex(/^\d+$/, "ID user tidak valid"),
]);

export const userUpsertSchema = z.object({
  email: z.string().email("Email user tidak valid").max(100),
  full_name: z.string().min(1, "Nama user wajib diisi").max(100),
  avatar_url: z.string().url("avatar_url harus URL valid").nullable().optional(),
});

export const userProfileSchema = userUpsertSchema.extend({
  id: userIdSchema,
});

export const googleAuthResponseSchema = z.object({
  success: z.literal(true),
  user: userProfileSchema,
  backendToken: z.string().min(1, "backendToken kosong"),
});

export const googleAuthUrlResponseSchema = z.object({
  success: z.literal(true),
  url: z.string().url("URL OAuth Google tidak valid"),
});

export const emailSchema = z.string().email("Email tidak valid");

export const validateGoogleAuthPayload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parsed = googleAuthRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Payload /auth/google tidak valid",
      details: parsed.error.issues,
    });
  }

  req.body = parsed.data;
  return next();
};
