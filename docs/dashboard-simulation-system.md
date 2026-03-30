# Dashboard Simulation System

Dokumen ini menjelaskan arsitektur dan alur kerja sistem simulasi pada halaman Dashboard CivicNode, yang dibangun untuk keperluan demonstrasi lomba (data dummy, tanpa koneksi AI server).

---

## Arsitektur File

```
src/app/dashboard/
├── simulation.config.ts          ← Semua konstanta simulasi (edit di sini)
├── _store/
│   └── useDashboardStore.ts      ← Zustand store — state + actions
├── _hooks/
│   ├── useZoneTriage.ts          ← Logika dispatch + simulasi recovery
│   └── useStats.ts               ← Derivasi stats + degradasi zona
├── _components/
│   ├── ZoneTriageList.tsx        ← Card grid zona
│   ├── DispatchModal.tsx         ← Modal kirim petugas
│   ├── StatsGrid.tsx             ← 3 kartu statistik atas
│   └── SimulationPanel.tsx       ← Panel config real-time (tombol gear)
└── _types.ts                     ← Tipe data + dummy data + helper functions
```

---

## State (useDashboardStore)

| State | Tipe | Keterangan |
|-------|------|-----------|
| `armadaSiaga` | `number` | Jumlah petugas yang standby di markas |
| `activeDetections` | `number` | Jumlah deteksi sampah aktif (independen) |
| `zones` | `TriageZone[]` | Data semua zona beserta score kebersihan |
| `zoneDispatches` | `Record<string, number>` | Zona → jumlah petugas yang sedang di lapangan |
| `config` | `SimConfig` | Parameter simulasi (dapat diubah dari UI) |

---

## Alur Simulasi Lengkap

### 1. Degradasi (Otomatis)
Berjalan terus menerus via `setInterval` di `useStats.ts`:
```
Tiap DEGRADATION_MS:
  → activeDetections + 1
  → Pilih 1 zona random yang:
      - Tidak ada petugas (zoneDispatches[id] kosong)
      - Score > 0
      - Score !== null (zona tidak terpantau tidak terpengaruh)
  → Zone score - 1
```
Interval di-restart otomatis ketika `DEGRADATION_MS` diubah dari panel config.

### 2. Dispatch Petugas
Dipicu oleh tombol "Kirim Petugas" / "Kirim Inspeksi" → DispatchModal → confirm:
```
t=0:        dispatchPersonel(zoneId, N)
              → armadaSiaga - N
              → zoneDispatches[zoneId] + N   (badge muncul di card)

t=TRAVEL_TO_FIELD_MS:
              → startRecovery(zoneId) dipanggil
```

### 3. Recovery (Zona Terpantau)
Recursive `setTimeout` di `useZoneTriage.ts`, membaca config terbaru setiap tick:
```
Tiap RECOVERY_TICK_MS:
  increment = zoneDispatches[zoneId] × POINTS_PER_OFFICER
  zone.score + increment
  activeDetections - increment

  Jika zone.score >= 90 (GREEN_THRESHOLD):
    → clearZoneDispatch(zoneId)   (badge hilang)
    → setTimeout(returnPersonel, TRAVEL_RETURN_MS)
      → armadaSiaga + N (petugas kembali)
```

### 4. Zona Tidak Terpantau (score = null)
Saat `startRecovery` dipanggil untuk zona null-score:
```
  → Tidak ada perubahan score
  → clearZoneDispatch(zoneId) langsung   (badge hilang)
  → setTimeout(returnPersonel, TRAVEL_RETURN_MS)
```

---

## Stats Derivasi

| Stat | Cara Hitung |
|------|-------------|
| **Active Detections** | State independen, naik via degradasi, turun via recovery |
| **Zone Reputation** | Rata-rata score semua zona *terpantau* (score !== null) |
| **Armada Siaga** | State langsung, berkurang saat dispatch, bertambah saat return |

---

## Zona Tidak Terpantau

Zona dengan `score: null` di `_types.ts` mendapat desain card berbeda:
- Accent bar bergaris putus-putus abu
- Placeholder "TIDAK TERPANTAU" dengan ikon `CameraOff`
- Tombol "Kirim Inspeksi" (bukan "Kirim Petugas")
- Tidak terpengaruh degradasi
- Selalu tampil paling bawah di grid (sort: null → last)

---

## Panel Config Real-Time

Tombol gear (pojok kanan bawah dashboard) membuka `SimulationPanel`:
- Semua slider mengubah `config` di store secara langsung
- Perubahan berlaku **real-time** tanpa reload:
  - `DEGRADATION_MS` → interval di-restart via `useEffect` dep
  - `RECOVERY_TICK_MS`, `POINTS_PER_OFFICER`, dll → dibaca dari `getState()` di setiap tick
- "Armada Siaga" → override langsung nilai `armadaSiaga` di store

---

## Konfigurasi (simulation.config.ts)

Nilai default (dapat diubah di file untuk mengatur starting point simulasi):

| Konstanta | Default | Keterangan |
|-----------|---------|-----------|
| `TRAVEL_TO_FIELD_MS` | 1000 | Waktu tempuh petugas ke zona |
| `TRAVEL_RETURN_MS` | 1000 | Waktu tempuh petugas pulang |
| `DEGRADATION_MS` | 500 | Interval degradasi kebersihan |
| `RECOVERY_TICK_MS` | 500 | Interval tick pembersihan |
| `POINTS_PER_OFFICER` | 0.5 | Poin per petugas per tick |
| `INITIAL_ARMADA_SIAGA` | 30 | Jumlah awal armada |
