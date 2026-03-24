# Arsitektur Data — CivicNode Frontend

## Prinsip Utama

Frontend hanya berkomunikasi dengan **satu server: Backend (`NEXT_PUBLIC_BACKEND_URL`)**. Tidak ada request langsung ke AI server dari frontend.

---

## Sumber Data Per Komponen

### Dashboard — `StatsGrid`

| Stat                | Sumber                | Endpoint        |
| ------------------- | --------------------- | --------------- |
| `active_detections` | Kolom di tabel `cctv` | `GET /api/cctv` |
| `confidence_score`  | Kolom di tabel `cctv` | `GET /api/cctv` |
| `zone_reputation`   | Kolom di tabel `zona` | `GET /api/zona` |

Nilai-nilai ini di-update backend secara periodik (flush dari in-memory setiap 5 detik setelah menerima push dari AI server). Frontend cukup polling `GET /api/cctv` dan `GET /api/zona` dengan interval yang wajar (misal 5–10 detik).

### Dashboard — `TimelineLog`

- Sumber: `GET /api/timeline-log`
- Auth: JWT Bearer token (Warga+)
- Query params: `?zona_id=&cctv_id=&from=&to=&limit=`

### CCTV Monitor — `cctvStore`

- Sumber: `GET /api/cctv`
- Field yang dipakai: `id`, `nama`, `ip_address`, `stream_url`, `status`, `active_detections`, `confidence_score`

---

## Environment Variables

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001   # satu-satunya URL yang dikenal frontend
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

> Tidak ada `NEXT_PUBLIC_AI_SERVER_URL` — frontend tidak perlu tahu keberadaan AI server.

---

## Flow Real-time Stats

```
AI Server ──POST /api/realtime-stats──→ Backend
                                           │ update in-memory Map
                                           │ setInterval(5s) flush ke DB
                                           ↓
Frontend ──polling GET /api/cctv──→ Backend → { ..., active_detections, confidence_score }
Frontend ──polling GET /api/zona──→ Backend → { ..., zone_reputation }
```

---

## Referensi

- Backend architecture: [`backend-anyar/docs/architecture.md`](../../backend-anyar/docs/architecture.md)
- Google auth flow: [`docs/google-auth-flow.md`](./google-auth-flow.md)
- MetaMask auth flow: [`docs/metamask-auth-flow.md`](./metamask-auth-flow.md)
