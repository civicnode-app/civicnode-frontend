# Bugfix: TypeScript & ESLint Errors — Frontend

Tanggal: 2026-03-18

## Latar Belakang

Sebelum memulai pengembangan fitur lebih lanjut, dilakukan audit dan perbaikan semua error TypeScript dan ESLint yang ada di codebase frontend. Total ada 5 file yang diperbaiki.

---

## File yang Diperbaiki

### 1. `app/sign-in/page.tsx`

**Masalah:**
- `onClick={handleGoogleLogin}` — fungsi tidak ada, nama yang benar adalah `handleGoogleAuth`
- `onClick={handleMetaMaskLogin}` — fungsi belum didefinisikan sama sekali
- Dead code: `supabase.auth.signInWithOAuth(...)` dipanggil setelah `window.location.href = url` — tidak akan pernah dieksekusi karena browser sudah redirect lebih dulu
- `err: any` di catch block melanggar `@typescript-eslint/no-explicit-any`
- `window as any` untuk akses `window.ethereum`

**Perbaikan:**
- Rename `handleGoogleAuth` menjadi `handleGoogleLogin` agar konsisten dengan JSX
- Tambah implementasi `handleMetaMaskLogin`: request akun via `window.ethereum`, kirim address ke `POST /api/auth/metamask`, simpan token ke localStorage
- Hapus dead code + import `supabase` yang jadi tidak terpakai
- Ganti `err: any` dengan `err instanceof Error ? err.message : "Terjadi kesalahan."`
- Type `window.ethereum` secara eksplisit tanpa `any`

---

### 2. `lib/supabase/updateSession.ts`

**Masalah:**
- `@supabase/ssr` diinstall dari GitHub (`github:supabase/ssr`) bukan dari npm — package hanya berisi folder `src/` tanpa build artifacts, sehingga TypeScript tidak menemukan type declarations
- Parameter `cookiesToSet` implicitly bertipe `any` karena module tidak ter-resolve
- `options` di-destructure di `forEach` pertama tapi tidak dipakai (unused variable)

**Perbaikan:**
- Install ulang `@supabase/ssr` dari npm registry (`npm install @supabase/ssr@latest`)
- Annotate `cookiesToSet` dengan tipe eksplisit `{ name: string; value: string; options: CookieOptions }[]`
- Hapus `options` dari destructure `forEach` pertama karena tidak digunakan di sana

---

### 3. `lib/supabase/middleware.ts`

**Masalah:**
- Import path salah: `'./lib/supabase/updateSession.ts'`
- File ini sudah berada di dalam `lib/supabase/`, sehingga path tersebut resolve ke `lib/supabase/lib/supabase/updateSession.ts` yang tidak ada
- Ekstensi `.ts` tidak perlu disertakan dalam import

**Perbaikan:**
- Ganti import menjadi `'./updateSession'`

---

### 4. `lib/supabase/server.ts`

**Masalah:**
- `cookies()` dari `next/headers` di Next.js 15+ mengembalikan `Promise<ReadonlyRequestCookies>`, bukan langsung objek cookies
- Kode lama langsung memanggil `.getAll()` dan `.set()` pada Promise, bukan pada hasil resolved-nya
- Parameter `cookiesToSet` bertipe `any`

**Perbaikan:**
- Jadikan `createClient` async function
- Tambah `await cookies()` sebelum digunakan
- Hapus parameter `cookieStore` dari signature (sekarang di-resolve di dalam function)
- Annotate `cookiesToSet` dengan tipe eksplisit menggunakan `CookieOptions` dari `@supabase/ssr`

---

### 5. `services/token-manager.ts`

**Masalah:**
- `@types/jsonwebtoken` belum terinstall — TypeScript tidak bisa infer tipe dari module `jsonwebtoken`
- `process.env.ACCESS_TOKEN_KEY` dan `process.env.REFRESH_TOKEN_KEY` bertipe `string | undefined`, sedangkan `jwt.sign/verify` membutuhkan `string`
- Parameter `payload` dan `refreshToken` bertipe `any`
- `catch(error)` — variabel `error` tidak pernah dipakai (unused variable)
- `console.log` di production code

**Perbaikan:**
- Install `@types/jsonwebtoken` sebagai devDependency
- Tambah `!` non-null assertion pada env vars
- Ganti `any` dengan tipe yang tepat: `object` untuk payload, `string` untuk refreshToken
- Ganti `catch(error)` menjadi `catch` tanpa binding
- Ganti `console.log` dengan `return null` agar caller bisa handle token invalid

---

## Packages yang Diinstall

```bash
npm install @supabase/ssr@latest        # fix: install dari npm bukan github
npm install @supabase/supabase-js       # fix: versi placeholder diganti yang proper
npm install --save-dev @types/jsonwebtoken  # fix: type declarations untuk jsonwebtoken
```

---

## Catatan

Login via Google masih belum berfungsi end-to-end karena memerlukan konfigurasi backend (`/api/auth/google`) dan environment variables Supabase yang valid. Error yang diperbaiki di sini adalah error internal frontend (TypeScript compile errors & ESLint), bukan masalah koneksi ke backend.
