# Demo Mode & Simulasi Akun

Dokumen ini menjelaskan fitur-fitur yang ada **hanya untuk keperluan presentasi/demo** dan tidak mencerminkan sistem nyata.

---

## Account Switcher

**Lokasi:** `src/components/TopBar.tsx` → `AccountSwitcher`

Popup yang muncul saat klik profile pill di TopBar, memungkinkan berpindah antara 4 akun demo:

| Nama | Role UI | Role JWT |
|---|---|---|
| Budi Santoso | Owner | `owner` |
| Dewi Rahayu | Admin | `admin` |
| Ahmad Fauzi | Korlap Armada Kebersihan | `admin` |
| Siti Nurhaliza | Operator Call Center | `admin` |

**Cara kerja:**
1. Klik profil pill → popup terbuka
2. Pilih akun → `setAuthToken(makeDemoToken(account))` + `window.location.reload()`
3. Token baru terbaca oleh `proxy.ts` dan semua komponen yang pakai `getAuthPayload()`

**Di sistem nyata:** Tidak ada account switcher. Setiap pengguna login sendiri via MetaMask dari halaman `/sign-in`. Setiap wallet address punya satu identitas tetap.

### Disclaimer di UI

Popup menampilkan banner kuning **"⚠ Mode Demo"** dengan penjelasan bahwa fitur ini hanya untuk presentasi. Ini sengaja dibuat agar penonton demo tidak salah paham.

---

## Fake Authentication

**Lokasi:** `src/app/sign-in/page.tsx`, `src/lib/auth.ts`

Login halaman sign-in tidak benar-benar verify MetaMask signature. Alurnya:
1. Klik "Hubungkan MetaMask" → delay 1.5 detik (animasi loading)
2. `setAuthToken(makeDemoToken(DEMO_ACCOUNTS[0]))` → langsung login sebagai Budi Santoso (Owner)
3. Redirect ke `/dashboard`

**Format token demo:**
```
demo.<base64(JSON payload)>.signature
```
Token ini dikenali oleh `getAuthPayload()` dan `proxy.ts` sebagai valid.

**Di sistem nyata:** Login via MetaMask → nonce challenge → `personal_sign` → verifikasi di `/api/auth/metamask` → JWT asli. Kode backend masih ada di `src/app/api/auth/`.

---

## Simulasi Dashboard

Seluruh data di dashboard (score kebersihan, active detections, zona triage) adalah simulasi lokal berbasis timer — tidak ada koneksi ke AI server atau backend.

Lihat `docs/dashboard-simulation-system.md` untuk detail lengkap.

---

## Data CCTV & Zona

Data awal (dummy) di-hardcode di:
- `src/app/cctv/_store/useCctvStore.ts` → `INITIAL_CCTVS`
- `src/app/cctv/_store/useZonaStore.ts` → `INITIAL_ZONAS`

Data tambahan bisa di-inject via CLI tools (`tools/add-cctv.mjs`, `tools/add-zona.mjs`) atau via UI form. Semua disimpan di localStorage.

Lihat `docs/seed-tools-system.md` untuk cara pakai CLI tools.
