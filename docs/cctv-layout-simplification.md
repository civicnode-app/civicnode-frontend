# CCTV Layout — Penghapusan Fitur View Mode

## Perubahan

Fitur **Layout View** (single/dual/triple) dihapus dari halaman `app/cctv/page.tsx`.

## Sebelumnya

- Ada tipe `ViewMode = "single" | "dual" | "triple"` dan `VIEW_OPTIONS` array
- State `viewMode` disimpan di `localStorage` (`cctv_view_mode`)
- Hanya menampilkan kamera sejumlah `visibleCount` (1, 2, atau 3), sisanya `hidden`
- Ada tombol `⋮` di header yang membuka dropdown pemilih layout

## Sesudahnya

- Semua kamera ditampilkan dalam **grid 2 kolom** (`grid grid-cols-2 gap-5`)
- Jika kamera lebih dari 2, otomatis wrap ke baris berikutnya
- Tidak ada batasan jumlah kamera yang tampil

## Alasan

Fitur view mode menyebabkan kamera ke-3, ke-4, dst. tidak tampil sama sekali karena tersembunyi oleh logika `isVisible`. Grid CSS sudah cukup untuk menangani banyak kamera tanpa perlu konfigurasi tambahan.

## File yang Diubah

- `app/cctv/page.tsx`
