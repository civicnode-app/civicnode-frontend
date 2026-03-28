# Google Auth Flow — CivicNode Frontend

## Status

Sudah selesai dan berjalan. Backend dan frontend sudah sinkron.

## Flow Lengkap

```
1. User klik "Masuk dengan Google"
         ↓
2. Frontend: GET /api/auth/google
         ↓
3. Backend: return { url: "https://accounts.google.com/o/oauth2/auth?..." }
         ↓
4. Frontend: window.location.href = url  → redirect ke halaman Google Login
         ↓
5. User login di Google
         ↓
6. Google redirect ke backend callback:
   http://localhost:3001/api/auth/google/callback?code=...
         ↓
7. Backend tukar code → dapat info user dari Google → upsert ke public.users
   → sign custom JWT { user_id, email, role: "warga" }
         ↓
8. Backend redirect ke frontend:
   http://localhost:3000/sign-in?access_token=TOKEN
         ↓
9. useEffect di sign-in/page.tsx nangkep token dari URL params
   → simpan ke localStorage dengan key "access_token"
   → bersihkan URL
   → redirect ke /dashboard
```

## Kontrak Backend

### GET /api/auth/google

Response **tidak pakai `success()` wrapper** — return langsung:

```json
{ "url": "https://accounts.google.com/o/oauth2/auth?..." }
```

> Endpoint lain pakai `{ success: true, data: {...} }`. Hanya endpoint ini yang berbeda karena frontend destructure `{ url }` langsung dari root.

### GET /api/auth/google/callback

- Menerima `?code=...` dari Google
- Redirect ke: `http://localhost:3000/sign-in?access_token=TOKEN`
- `refresh_token` tidak dikirim — token expire 24h, user login ulang

## Token

Custom JWT yang di-sign backend sendiri — bukan Supabase native token.
Disimpan di localStorage dengan key `access_token`.

```json
{ "user_id": "uuid", "email": "user@gmail.com", "role": "warga" }
```

## File yang Relevan

- [`frontend/app/sign-in/page.tsx`](../frontend/app/sign-in/page.tsx) — `handleGoogleLogin` + `useEffect` token receiver
- [`frontend/.env`](../frontend/.env) — `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001`
- [`frontend/next.config.ts`](../frontend/next.config.ts) — proxy `/api/*` → `http://localhost:3001/api/*`
