# Progress Log

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

---

## Sesi 2026-03-26

### Yang Sudah Selesai

- ✅ **CCTV page** — fetch dari `GET /api/cctv`, stream via MJPEG (`/mjpegfeed`), AI toggle + bounding box dummy animasi
- ✅ **`next.config.ts`** — tambah `img-src 'self' data: blob: http:` ke CSP header (izinkan DroidCam stream)

### Yang Masih Perlu Diperbaiki

- 🐛 **Dropdown resolusi CCTV** — ganti resolusi tidak reload stream otomatis. Fix: force remount `<img>` dengan `key` prop yang berubah saat resolusi diganti

---

## Sesi 2026-03-25

### Yang Sudah Selesai

- ✅ `dashboardStore.ts` — dibersihkan dari sisa desain lama, interface diperbarui ke struktur baru
- ✅ `TimelineLog.tsx` — fetch dari `/api/dev/timeline-log`, render zona, kamera, periode, ringkasan
- ✅ `StatsGrid.tsx` — polling `/api/dev/stats` tiap 1 detik, tambah grade (A–F) dan level
- ✅ `TimelapseeFeed.tsx` — stream kamera laptop via `getUserMedia` (dev mode)

---

## Yang Belum Dikerjain

- [ ] **Dropdown resolusi CCTV** — fix force remount stream saat resolusi diganti
- [ ] **Guard route** — redirect ke `/sign-in` kalau tidak ada token
- [ ] **System Config page** — review apakah perlu disambungkan ke backend
- [ ] **Ganti dev endpoints** — setelah AI server nyambung: ganti `/api/dev/stats` dan `/api/dev/timeline-log` ke endpoint real

---

## Catatan Penting

- Stream MJPEG berjalan **langsung dari browser ke DroidCam** (tidak lewat backend) — stream URL adalah local IP, hanya bisa diakses dalam satu jaringan
- DroidCam hanya support **1 koneksi MJPEG per kamera** — jangan buka dua tab sekaligus
- `AI_SERVER_SECRET` wajib diisi di `.env` backend sebelum koneksi AI server bisa jalan
