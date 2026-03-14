import jwt from "jsonwebtoken";

export const TokenManager = {
  generateAccessToken: (payload: any) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload: any) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),

  verifyRefreshToken: (refreshToken: any) => {
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        return payload;
    } catch(error) {
        console.log("Refresh token tidak valid");
    }
  }
};

