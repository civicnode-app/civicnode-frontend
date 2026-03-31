# Progress Log

## Sesi 2026-03-31

### Yang Sudah Selesai

#### Tools CLI — Seed Data via Terminal

- ✅ **`tools/add-zona.mjs`** dikonversi dari readline interaktif ke CLI params (`--nama`, `--deskripsi`, `--reputasi`)
- ✅ **`tools/add-cctv.mjs`** sudah CLI params dari sesi sebelumnya (tidak ada perubahan hari ini)
- ✅ Semua tools pakai ES module (`import`), tidak ada `require`
- ✅ `npm run seed:add-zona`, `seed:add-cctv`, `seed:list`, `seed:reset` semua berjalan normal

#### Dashboard — Sinkronisasi Seed + Reaktivitas Penuh

- ✅ **`mergeNodesFromSeed(zones, cameras)`** — action baru di `useDashboardStore` untuk merge zona & kamera dari store lain, skip duplikat by ID
- ✅ **`removeZone(zoneId)`** — action baru di `useDashboardStore`; hapus zona + kamera-nya + kurangi `activeDetections`
- ✅ **`SimulationProvider`** diperbarui:
  - Sync awal on mount: `mergeFromSeed()` → mapping ke `TriageZone`/`CameraNode` → `mergeNodesFromSeed()` → `activateNullZones()`
  - Reactive subscription `useCctvStore` → camera baru langsung masuk dashboard + aktivasi zona null
  - Reactive subscription `useZonaStore` → zona baru langsung masuk dashboard
  - **Cleanup orphan on mount**: CCTV yang zona-nya sudah dihapus dari `zonaList` → `clearZona()` otomatis
  - **Cleanup deletion on mount**: zona di `useDashboardStore` yang tidak ada di `zonaList` → `removeZone()` otomatis (menangani case di mana dashboard store reset ke DUMMY_ZONES setiap refresh karena tidak dipersist)
- ✅ `activateNullZones()` — fungsi helper yang mengaktifkan zona ber-`score: null` yang kini punya kamera, mengisi score dari `zone_reputation` (default 50 jika 0)
- ✅ `zonaToTriageZone()` selalu return `score: null` — zona baru tidak punya score sampai ada kamera yang dipasang
- ✅ `cctvToCamera()` return `null` untuk CCTV tanpa zona — tidak ikut masuk ke `cameras` dashboard

#### Zona — Sinkronisasi Hapus ke Semua Store

- ✅ **`useCctvStore.clearZona(zoneId)`** — set `zona: null` untuk semua CCTV dengan zona tersebut
- ✅ **`useZona.handleDelete`** memanggil `clearZona()` + `removeZone()` langsung (tidak lewat subscription, lebih eksplisit dan reliable)
- ✅ `CCTVNode.zona` diubah dari `{ id, nama }` menjadi `{ id, nama } | null`
- ✅ `page.tsx` — filter kamera per zona pakai `c.zona?.id` (optional chaining, safe untuk null)

#### CCTV — Zona Opsional

- ✅ **`CctvModal`** — field Zona diubah dari required (`*`) menjadi opsional, pilihan default "— Tanpa Zona —"
- ✅ **`useCctv.handleSubmit`** — validasi `zona_id` dihapus; `zonaObj` bisa `null` kalau tidak dipilih
- ✅ **`useCctv.openEdit`** — handle `node.zona?.id` (safe null check)
- ✅ **`CctvCard`** — zona null tampil badge kuning italic "Tidak memantau zona"

#### ZonaCard — State Tidak Diketahui

- ✅ Zona tanpa kamera (`cameras.length === 0`) tampil abu-abu: badge "TIDAK DIKETAHUI", score bar kosong "—"
- ✅ Zona dengan kamera tampil score nyata seperti biasa
- ✅ Accent color, label badge, progress bar semuanya conditional berdasarkan `noCam`

#### Dashboard Filter — Tab Baru + Fix Logika

- ✅ **Tab "Tidak Terpantau"** ditambahkan (`score === null`) — zona tanpa CCTV tidak lagi nyempil di tab Kritis
- ✅ **Fix filter Kritis** — sebelumnya `score === null || score < 40`, sekarang hanya `score !== null && score < 40`
- ✅ Urutan tab: Semua → Tidak Terpantau → Zona Kritis → Zona Kotor → Zona Bersih

#### TopBar — Disclaimer Mode Demo

- ✅ Header popup account switcher diganti jadi banner kuning **"⚠ Mode Demo"** dengan penjelasan bahwa fitur ini hanya untuk presentasi
- ✅ Footer popup diperbarui: "Wallet address bersifat dummy — bukan akun MetaMask sungguhan"

---

### Catatan Arsitektur

**Alur data seed → frontend:**
```
tools/add-cctv.mjs / add-zona.mjs
        ↓ tulis ke
tools/db.json
        ↓ dibaca oleh
/api/seed (GET)
        ↓ di-fetch oleh
useCctvStore.mergeFromSeed() / useZonaStore.mergeFromSeed()
        ↓ di-sync oleh
SimulationProvider (on mount) → useDashboardStore.mergeNodesFromSeed()
        ↓
localStorage (persist) + in-memory simulation
```

**Alur hapus zona:**
```
useZona.handleDelete(zona)
  → deleteZona(zona.id)           [useZonaStore]
  → clearZona(zona.id)            [useCctvStore — set zona: null untuk CCTV terdampak]
  → removeZone(zona.id)           [useDashboardStore — hapus zone + cameras + kurangi activeDetections]
```

**Kenapa useDashboardStore tidak dipersist:**
Dashboard store di-reset ke `DUMMY_ZONES` setiap refresh. Ini disengaja agar score simulasi mulai segar. Tapi ini berarti setiap refresh harus sync ulang dari `useZonaStore` (yang dipersist). `SimulationProvider` menangani ini on mount.

---

## Sesi 2026-03-30 (lanjutan 4)

### Yang Sudah Selesai

#### Auth — Fix Login MetaMask & Fitur Tambahan

- ✅ **Fix "Tanda tangan tidak valid"** — `ethers.verifyMessage(nonce, sig)` → `ethers.verifyMessage(ethers.getBytes(nonce), sig)` agar nonce `0x`-prefixed diperlakukan sebagai raw bytes, sesuai cara MetaMask encode saat `personal_sign`
- ✅ **Fix "Nonce tidak valid atau sudah kedaluwarsa"** — `nonceStore` dipindah ke `global._nonceStore` agar tidak ter-reset saat HMR (Next.js hot reload) re-evaluate modul
- ✅ **Popup konfirmasi logout** — Dialog modal dengan backdrop blur, animasi `fadeUp`, tombol Batal & Keluar; klik di luar dialog = batal
- ✅ **Netlify deployment config** — `netlify.toml` + `@netlify/plugin-nextjs`; env vars yang wajib diset: `JWT_SECRET`, `NEXT_PUBLIC_AI_SERVER_URL` (opsional)

#### Catatan Deployment Netlify

- `netlify.toml` ada di root `civicnode-frontend/` (bukan root monorepo)
- `nonceStore` masih in-memory — di serverless Netlify ada kemungkinan tipis nonce hilang jika dua request kena container berbeda (acceptable untuk demo)

---

## Sesi 2026-03-30 (lanjutan 3)

### Yang Sudah Selesai

#### Auth — Migrasi ke Next.js API Routes

- ✅ **`/api/auth/nonce`** — Generate nonce random (32-byte hex), simpan di in-memory store dengan TTL 5 menit
- ✅ **`/api/auth/metamask`** — Verifikasi tanda tangan MetaMask via `ethers.verifyMessage()`, cek nonce, terbitkan JWT 24 jam
- ✅ **`/api/auth/me`** — Verifikasi JWT, kembalikan profil pengguna (tanpa database, data dari payload token)
- ✅ **`src/middleware.ts`** — Aktifkan `proxy.ts` sebagai Next.js middleware (route protection, redirect unauthenticated users)
- ✅ **`src/lib/nonce-store.ts`** — Singleton in-memory Map untuk nonce storage
- ✅ **Hapus rewrite proxy** di `next.config.ts` — tidak ada lagi forward ke `localhost:3001`
- ✅ **`sign-in/page.tsx`** — URL fetch dari `${BACKEND_URL}/api/auth/*` → `/api/auth/*` (relative)
- ✅ **`system-config/page.tsx`** — URL fetch dari `${BACKEND_URL}/api/auth/me` → `/api/auth/me`
- ✅ **`package.json`** — `ethers` + `jsonwebtoken` masuk `dependencies` (production-safe)
- ✅ **`.env` / `.env.example`** — Hapus `NEXT_PUBLIC_BACKEND_URL`, tambah `JWT_SECRET`
- ✅ **Fix TypeScript** — `DispatchModal.tsx` null guard untuk `target.score`

---

## Sesi 2026-03-30 (lanjutan 2)

### Yang Sudah Selesai

#### Dashboard & CCTV — Sinkronisasi Deteksi Real-time

- ✅ **Deteksi aktif per-kamera** — `active_detections` bukan lagi integer global, tapi per-kamera di store (`cameras: CameraNode[]`). Global total = akumulasi dari semua kamera.
- ✅ **`incrementZoneDetection(zoneId)`** — saat zona degradasi, kamera random di zona itu yang di-increment (+1), bukan counter global. Menggantikan `addDetection()`.
- ✅ **`decrementZoneDetections(zoneId, amount)`** — saat petugas recovery, deteksi di kamera zona itu yang dikurangi. Menggantikan `removeDetections()`.
- ✅ **Halaman CCTV real-time** — `useCctv.ts` subscribe ke `storeCameras` dari dashboard store; setiap card kamera otomatis re-render saat `active_detections` berubah.
- ✅ **`SimulationProvider`** — interval degradasi dipindah dari `useStats.ts` ke provider global yang di-mount di `AppLayout`. Simulasi tetap jalan di semua halaman, tidak berhenti saat user navigasi keluar dashboard.
- ✅ **Recovery timer persistent** — `recoveryTimers`, `travelTimeouts`, `returnTimeouts` di `useZoneTriage` dipindah dari `useRef` ke module-level variable. Timer tidak mati saat komponen unmount.
- ✅ **Hapus Confidence dari card CCTV** — tidak relevan untuk admin dashboard. Info grid jadi 3 kolom: IP Address · Jenis · Deteksi Aktif.
- ✅ **Redesain card CCTV** — layout horizontal (bukan aspect-ratio 1:1), grid 2 kolom, informasi lebih padat.

---

## Sesi 2026-03-30 (lanjutan)

### Yang Sudah Selesai

#### Dashboard — Penyempurnaan UI & Animasi

- ✅ **Tombol "Pasang CCTV"** — tombol "Kirim Inspeksi" di card zona tidak terpantau diganti jadi "Pasang CCTV" (icon `Cctv`), klik langsung navigasi ke halaman `/cctv`
- ✅ **Animasi reorder zona** — card zona tidak lagi blink saat urutan berubah akibat sorting kebersihan; menggunakan `motion.div layout` dari `framer-motion` (spring 300/30) sehingga card slide smooth ke posisi barunya
- ✅ **Sync data dummy Dashboard ↔ CCTV** — nama kamera, zona, dan ID disinkronkan antara `dashboard/_types.ts` dan `cctv/_hooks/useCctv.ts` + `useZona.ts`; zona z5/z6 (Lorong Pahlawan, Terminal Lama) kini muncul di halaman CCTV pada tab Zona (tanpa kamera terhubung) dan di dropdown tambah kamera
- ✅ **Sidebar rename** — label "CCTV" diganti "CCTV & ZONA" supaya user tahu halaman itu mengurus keduanya
- ✅ **`framer-motion` di-commit** — package sudah masuk `package.json` & `package-lock.json`

---

## Sesi 2026-03-30

### Yang Sudah Selesai

#### Dashboard — Simulation System (Demo Mode)

- ✅ **Sistem simulasi dispatch petugas** — Kirim petugas ke zona → badge "N Petugas di Lapangan" muncul di card, setelah `TRAVEL_TO_FIELD_MS` score zona naik `jumlah × POINTS_PER_OFFICER` per tick, saat score ≥ 90% badge hilang, setelah `TRAVEL_RETURN_MS` armada bertambah kembali
- ✅ **Active Detections & Zone Reputation sinkron** — Active Detections jadi state independen (bukan random), naik tiap `DEGRADATION_MS` + turun saat recovery. Zone Reputation = rata-rata score zona terpantau
- ✅ **`simulation.config.ts`** — Semua konstanta simulasi terpusat (travel time, degradasi, recovery speed, poin/petugas, armada awal)
- ✅ **SimulationPanel** — Panel config real-time (tombol gear pojok kanan bawah), semua parameter bisa diubah langsung dari UI tanpa edit kode
- ✅ **Dispatch dibatasi Armada Siaga** — Max personel di modal = jumlah armada siaga saat ini, tombol berubah "Armada Tidak Tersedia" kalau habis
- ✅ **Zona Tidak Terpantau** — 2 zona baru (`Lorong Pahlawan`, `Terminal Lama`) dengan `score: null`, desain card berbeda (placeholder CameraOff, tombol "Kirim Inspeksi"), selalu di bawah grid, tidak terpengaruh degradasi
- ✅ **Fix: React `{0}` rendering bug** — Badge dispatch muncul angka "0" diperbaiki ke `(value ?? 0) > 0`
- ✅ **Fix: floating point score** — Score dibulatkan di store (`Math.round(x * 100) / 100`) + display `parseFloat(toFixed(2))`
- ✅ **Docs** — tambah `docs/dashboard-simulation-system.md`

---

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
