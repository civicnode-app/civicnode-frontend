import jwt from "jsonwebtoken";

export const TokenManager = {
  generateAccessToken: (payload: object) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_KEY!),
  generateRefreshToken: (payload: object) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_KEY!),

  verifyRefreshToken: (refreshToken: string) => {
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY!);
        return payload;
    } catch {
        return null;
    }
  }
};

