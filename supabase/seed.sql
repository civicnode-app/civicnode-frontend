-- ============================================================
-- SUPABASE TRIGGER: Auto-create profile saat user baru daftar
-- Jalankan query ini di Supabase SQL Editor (sekali saja)
-- ============================================================

-- Fungsi trigger yang dipanggil setiap kali row baru masuk ke auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'user'   -- role default untuk Google login
  )
  ON CONFLICT (id) DO NOTHING; -- Jangan timpa jika sudah ada (e.g. admin yang sudah diset manual)

  RETURN NEW;
END;
$$;

-- Pasang trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) untuk tabel profiles
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User hanya bisa lihat & edit profil sendiri
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role (server-side) bisa akses semua
-- (Sudah otomatis ketika menggunakan service_role key)

-- ============================================================
-- CONTOH: Daftarkan admin/owner secara manual
-- Ganti <UUID> dan <WALLET_ADDRESS> sesuai kebutuhan
-- ============================================================
-- UPDATE public.profiles
--   SET role = 'admin', wallet_address = '0xYourWalletAddress'
--   WHERE id = '<UUID from auth.users>';

-- UPDATE public.profiles
--   SET role = 'owner', wallet_address = '0xYourOwnerWalletAddress'
--   WHERE id = '<UUID from auth.users>';
