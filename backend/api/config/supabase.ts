import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "./env";

const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

// Shared admin client for backend API access.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export const getGoogleAuthorizeUrl = (redirectTo: string) => {
  const params = new URLSearchParams({
    provider: "google",
    redirect_to: redirectTo,
    prompt: "select_account",
    access_type: "offline",
  });

  return `${supabaseUrl}/auth/v1/authorize?${params.toString()}`;
};
