const stripQuotes = (value?: string) => value?.trim().replace(/^"|"$/g, "");

export const getPublicSupabaseConfig = () => {
  const url = stripQuotes(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key =
    stripQuotes(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) ||
    stripQuotes(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !key) {
    throw new Error(
      "Missing Supabase public config. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.",
    );
  }

  return { url, key };
};
