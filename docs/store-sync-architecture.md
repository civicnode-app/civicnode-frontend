# Store Sync Architecture

Dokumen ini menjelaskan bagaimana tiga Zustand store (`useCctvStore`, `useZonaStore`, `useDashboardStore`) saling disinkronkan, dan mengapa `SimulationProvider` berperan sebagai jembatan di antaranya.

---

## Gambaran Store

| Store | Persist? | Sumber Data | Tujuan |
|---|---|---|---|
| `useCctvStore` | ✅ localStorage | UI form + seed tools | Daftar kamera CCTV |
| `useZonaStore` | ✅ localStorage | UI form + seed tools | Daftar zona |
| `useDashboardStore` | ❌ in-memory | DUMMY_ZONES + sync | Simulasi skor & deteksi real-time |

**Kenapa `useDashboardStore` tidak dipersist?**
Agar skor simulasi selalu mulai segar setiap refresh. Tapi konsekuensinya: setiap refresh, store ini harus di-rebuild dari `useZonaStore` dan `useCctvStore`.

---

## SimulationProvider — Jembatan Antar Store

`src/components/SimulationProvider.tsx` dipasang di `AppLayout` (global, selalu aktif).

### On Mount — Initial Sync

```
1. mergeFromSeed()               → fetch /api/seed → tambah data baru dari tools/db.json
2. Cleanup orphan zones          → CCTV yang zona-nya tidak ada di zonaList → clearZona()
3. Cleanup deleted zones         → zona di dashboardStore yang tidak ada di zonaList → removeZone()
4. mergeNodesFromSeed()          → sync semua zona & kamera ke dashboardStore
5. activateNullZones()           → zona dengan score=null yang sudah punya kamera → beri score
```

### Reactive — Saat Store Berubah

```typescript
// useCctvStore berubah → kamera baru masuk dashboard + aktivasi zona null
useCctvStore.subscribe((state) => {
  const newCameras = state.cctvList.filter(/* belum ada di dashboard */);
  mergeNodesFromSeed([], newCameras);
  activateNullZones();
});

// useZonaStore berubah → zona baru masuk dashboard
useZonaStore.subscribe((state) => {
  const newZones = state.zonaList.filter(/* belum ada di dashboard */);
  mergeNodesFromSeed(newZones, []);
});
```

> **Catatan:** Penghapusan zona tidak ditangani via subscription — lebih reliable dipanggil langsung di `useZona.handleDelete`.

---

## Alur Hapus Zona

```
useZona.handleDelete(zona)
  ├── deleteZona(zona.id)             → hapus dari useZonaStore (persist ke localStorage)
  ├── clearZona(zona.id)              → set zona: null untuk semua CCTV dengan zona itu
  └── removeZone(zona.id)             → hapus zona + kamera + kurangi activeDetections di dashboard
```

Kenapa tidak pakai subscription untuk detect delete? Karena Zustand subscription perlu compare `oldState` vs `newState`, yang bisa jadi fragile. Memanggil langsung di handler lebih eksplisit dan mudah di-debug.

---

## CCTVNode.zona — Nullable

```typescript
// src/app/cctv/_types.ts
interface CCTVNode {
  ...
  zona: { id: string; nama: string } | null;
}
```

`zona` bisa `null` dalam dua kondisi:
1. CCTV dibuat tanpa memilih zona (field zona opsional di form)
2. Zona yang tadinya dipantau dihapus → `clearZona()` dipanggil

CCTV dengan `zona: null` **tidak masuk ke `cameras` di dashboard** (`cctvToCamera()` return `null` dan di-filter), karena kamera tanpa zona tidak bisa diasosiasikan ke zona manapun untuk simulasi.

---

## activateNullZones()

Fungsi helper yang dijalankan setiap kali ada kamera baru masuk:

```typescript
function activateNullZones() {
  zones.forEach((z) => {
    if (z.score !== null) return;                         // sudah aktif
    if (!cameras.some(c => c.zone_id === z.id)) return;  // belum ada kamera
    const zona  = zonaList.find(zs => zs.id === z.id);
    const score = zona?.zone_reputation > 0 ? zona.zone_reputation : 50;
    updateZoneScore(z.id, score);                         // aktifkan
  });
}
```

Zona dengan `score: null` di `useDashboardStore` berarti **"TIDAK TERPANTAU"** — tidak ikut dihitung di Zone Reputation stats, tidak ikut degradasi simulasi.

---

## mergeNodesFromSeed() — Idempoten

```typescript
mergeNodesFromSeed: (newZones, newCameras) => set((s) => {
  // skip zona/kamera yang sudah ada (by ID)
  const zonesToAdd = newZones.filter(z => !existingZoneIds.has(z.id));
  const camsToAdd  = newCameras.filter(c => !existingCamIds.has(c.id));
  ...
})
```

Aman dipanggil berkali-kali tanpa duplikasi data.
