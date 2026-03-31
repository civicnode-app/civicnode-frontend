# Seed Tools System

Dokumen ini menjelaskan sistem CLI tools untuk mengisi data CCTV dan Zona ke frontend tanpa perlu membuka UI. Digunakan terutama saat demo atau testing awal.

---

## Lokasi File

```
civicnode-frontend/
└── tools/
    ├── db.json          ← Database lokal (JSON), diisi oleh CLI tools
    ├── add-cctv.mjs     ← Tambah kamera CCTV
    ├── add-zona.mjs     ← Tambah zona
    ├── list.mjs         ← Lihat semua data di db.json
    └── reset.mjs        ← Kosongkan db.json (dengan konfirmasi)
```

---

## Cara Pakai

### Tambah Zona
```bash
node tools/add-zona.mjs --nama "Pasar Baru" --deskripsi "Kawasan pasar tradisional" --reputasi 65
```
| Parameter     | Wajib | Default | Keterangan                    |
|---------------|-------|---------|-------------------------------|
| `--nama`      | ✅    | —       | Nama zona                     |
| `--deskripsi` | ❌    | `""`    | Deskripsi zona                |
| `--reputasi`  | ❌    | `50`    | Skor kebersihan awal (0–100)  |

### Tambah CCTV
```bash
node tools/add-cctv.mjs --nama "CCTV Pasar Baru 01" --zona-id <id-zona> --zona-nama "Pasar Baru" --ip 192.168.1.20
```
| Parameter      | Wajib | Default                    | Keterangan              |
|----------------|-------|----------------------------|-------------------------|
| `--nama`       | ✅    | —                          | Nama kamera             |
| `--zona-id`    | ✅    | —                          | ID zona (dari db.json)  |
| `--zona-nama`  | ✅    | —                          | Nama zona               |
| `--ip`         | ❌    | `192.168.1.{10+n}`         | IP address kamera       |
| `--stream`     | ❌    | `rtsp://<ip>/stream`       | URL stream RTSP         |
| `--jenis`      | ❌    | `cctv`                     | Jenis kamera            |

### Lihat Semua Data
```bash
node tools/list.mjs
# atau via npm
npm run seed:list
```

### Reset (Kosongkan)
```bash
npm run seed:reset
# Akan minta konfirmasi y/N
```

---

## Alur Data: Tools → Frontend

```
node tools/add-zona.mjs ...
        ↓ tulis ke
tools/db.json
        ↓ dibaca oleh (saat dev server jalan)
GET /api/seed  (src/app/api/seed/route.ts)
        ↓ di-fetch oleh
useZonaStore.mergeFromSeed()
useCctvStore.mergeFromSeed()
        ↓ dipanggil oleh
SimulationProvider (on mount, setiap kali halaman pertama dibuka)
        ↓ disync ke
useDashboardStore via mergeNodesFromSeed()
localStorage (Zustand persist)
```

**Catatan penting:**
- Data dari tools **tidak langsung muncul** — baru terbaca setelah browser refresh atau navigasi (karena `mergeFromSeed` dipanggil on mount di `SimulationProvider`)
- ID zona yang dipakai di `--zona-id` harus sesuai dengan ID yang ada di `db.json` (bisa cek dengan `npm run seed:list`)
- `zone_reputation` dari `--reputasi` hanya dipakai kalau zona sudah punya CCTV; kalau belum ada kamera, score tetap tampil sebagai "Tidak Diketahui"

---

## npm Scripts (package.json)

```json
"seed:add-cctv": "node tools/add-cctv.mjs",
"seed:add-zona": "node tools/add-zona.mjs",
"seed:list":     "node tools/list.mjs",
"seed:reset":    "node tools/reset.mjs"
```

---

## Format db.json

```json
{
  "cctvList": [
    {
      "id": "seed-c1234567890",
      "nama": "CCTV Pasar Baru 01",
      "ip_address": "192.168.1.20",
      "stream_url": "rtsp://192.168.1.20/stream",
      "status": true,
      "active_detections": 0,
      "confidence_score": 0,
      "jenis_kamera": "cctv",
      "created_at": "2026-03-31T...",
      "zona": { "id": "seed-z1234567890", "nama": "Pasar Baru" }
    }
  ],
  "zonaList": [
    {
      "id": "seed-z1234567890",
      "nama": "Pasar Baru",
      "deskripsi": "Kawasan pasar tradisional",
      "zone_reputation": 65
    }
  ]
}
```
