import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";

const { url, key } = getPublicSupabaseConfig();

type CookieWrite = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: CookieWrite[]) => {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) =>
                cookieStore.set(name, value, options),
            );
          } catch {
            // No-op: cookie writes can fail in Server Component contexts.
          }
        },
      },
    },
  );
};
