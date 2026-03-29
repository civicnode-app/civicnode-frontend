# Progress Log

## Sesi 2026-03-29

### Yang Sudah Selesai

- ✅ **Fix Hydration Error & Linter di TopBar** — Menunda render komponen `WalletAvatar` dan pembacaan `localStorage`/`cookie` menggunakan state `mounted`. Menggunakan metode `setTimeout` di dalam `useEffect` agar linter React compiler/Biome tidak protes soal _synchronous setState_ yang memicu cascading render.
- ✅ **Dashboard** — Menyambungkan data hit rate histori ke endpoint asli (`/api/timeline-log`) di file `TimelineLog.tsx`, menggantikan endpoint development statis (`/api/dev/timeline-log`).
- ✅ **Perombakan Arsitektur (Headless Data Node)** — Dihapusnya fitur Video Streaming di CctvCard karena AI Server dirubah menjadi *Headless*. Mengganti desain CctvCard murni menjadi Grid 1:1 aspek-rasio *glassmorphism* berbasis *Metric Analytics*, mempersingkat `useCctv.ts` (Membersihkan dummy Array, Interval, Streaming URL state, dll).

---
## Sesi 2026-03-27

### Yang Sudah Selesai

#### CCTV Page — Refactor & Bug Fix

- ✅ **Refactor `app/cctv/page.tsx`** — dipecah dari 880+ baris jadi ~130 baris orkestrator
  - Hooks: `useDialog`, `useCctv`, `useZona` (masing-masing di `_hooks/`)
  - Komponen: `CctvCard`, `CctvModal`, `ZonaCard`, `ZonaModal`, `ConfirmDialog`, `StreamImg` (di `_components/`)
  - Types & helpers: `_types.ts` (`CCTVNode`, `Zona`, `BoundingBox`, `DialogState`, `repColor`, `repLabel`)

- ✅ **Fix: hanya 2 dari 4 kamera tampil** — dihapus fitur layout view (single/dual/triple) yang membatasi jumlah kamera tampil. Diganti responsive grid.

- ✅ **Fix: kamera gepeng (rasio salah)** — container kamera pakai `aspect-square` bukan fixed height.

- ✅ **Layout responsif** — grid kamera `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

- ✅ **Badge-style tabs** — tab CCTV dan Zona pakai gaya pill/badge (bukan underline). CCTV grid pakai CSS `hidden` (bukan conditional render) agar `StreamImg` tetap mounted saat pindah tab.

- ✅ **Fix: DroidCam "Error creating image encoder" saat reload** — `StreamImg` menambahkan:
  - `beforeunload` listener → set `img.src = ""` saat page close/reload
  - 300ms delay sebelum set `activeSrc` saat mount → beri waktu browser abort koneksi lama
  - Auto-retry tiap 2 detik via `onError` handler

- ✅ **Fix: stream mati saat ganti tab CCTV ↔ Zona** — CCTV grid tidak di-unmount (pakai `hidden`), sehingga koneksi MJPEG ke DroidCam tetap hidup.

- ✅ **Docs** — tambah `docs/cctv-layout-simplification.md`

#### AI Server Integration

- ✅ **`app/cctv/_types.ts`** — tambah `AI_SERVER_URL` dari `NEXT_PUBLIC_AI_SERVER_URL` env var
- ✅ **`app/cctv/_components/CctvCard.tsx`** — stream src pakai AI server URL kalau `AI_SERVER_URL` tersedia, fallback ke DroidCam `/mjpegfeed` kalau tidak
- ✅ **`.env.example`** — tambah `NEXT_PUBLIC_AI_SERVER_URL=http://localhost:5001`

---

## Sesi 2026-03-26

### Yang Sudah Selesai

- ✅ **CCTV page** — fetch dari `GET /api/cctv`, stream via MJPEG (`/mjpegfeed`), AI toggle + bounding box dummy animasi
- ✅ **`next.config.ts`** — tambah `img-src 'self' data: blob: http:` ke CSP header (izinkan DroidCam stream)

### Yang Masih Perlu Diperbaiki

- ~~Dropdown resolusi CCTV~~ — diputuskan tidak jadi dibikin (over-engineering)

---

## Sesi 2026-03-25

### Yang Sudah Selesai

- ✅ `dashboardStore.ts` — dibersihkan dari sisa desain lama, interface diperbarui ke struktur baru
- ✅ `TimelineLog.tsx` — fetch dari `/api/dev/timeline-log`, render zona, kamera, periode, ringkasan
- ✅ `StatsGrid.tsx` — polling `/api/dev/stats` tiap 1 detik, tambah grade (A–F) dan level
- ✅ `TimelapseeFeed.tsx` — stream kamera laptop via `getUserMedia` (dev mode)

---

## Yang Belum Dikerjain

- [ ] **Guard route** — redirect ke `/sign-in` kalau tidak ada token
- [ ] **System Config page** — review apakah perlu disambungkan ke backend
- [ ] **Ganti dev endpoints** — setelah AI server nyambung: ganti `/api/dev/stats` ke endpoint real (`/api/dev/timeline-log` sudah selesai dihubungkan)

---

## Catatan Penting

- Stream MJPEG berjalan dari **AI server** ke browser (bukan langsung ke DroidCam) — AI server yang connect ke DroidCam, browser ambil stream ber-bounding-box dari AI server
- Kalau `NEXT_PUBLIC_AI_SERVER_URL` tidak diset, frontend fallback ke DroidCam stream langsung
- DroidCam hanya support **1 koneksi MJPEG per kamera** — jangan buka dua tab dan jangan frontend+AI server connect bersamaan ke DroidCam
- `AI_SERVER_SECRET` wajib sama di `.env` backend dan `.env` AI server
