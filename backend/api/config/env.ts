import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let loaded = false;

const loadEnv = () => {
  if (loaded) return;

  const candidates = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), "backend/.env.local"),
    path.resolve(__dirname, "../../.env.local"),
  ];

  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      loaded = true;
      break;
    }
  }

  // Fallback to default behavior (.env in cwd)
  dotenv.config();
  loaded = true;
};

export const getRequiredEnv = (name: string) => {
  loadEnv();

  const value = process.env[name]?.trim().replace(/^"|"$/g, "");
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export { loadEnv };
