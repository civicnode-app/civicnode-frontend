import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";

const { url, key } = getPublicSupabaseConfig();

export const supabase = createClient(url, key);
