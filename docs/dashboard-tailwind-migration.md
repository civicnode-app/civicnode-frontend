# Dashboard — Migrasi ke Tailwind CSS

## Ringkasan

Halaman `/dashboard` dimigrasi dari inline styles + `<style dangerouslySetInnerHTML>` ke Tailwind CSS v4 utility classes.

## Perubahan

### `frontend/app/dashboard/page.tsx`

- Hapus semua `style={{ ... }}` props dari setiap elemen JSX
- Hapus block `<style dangerouslySetInnerHTML={{ __html: \`...\` }} />` di bagian bawah komponen
- Ganti dengan Tailwind utility classes langsung di `className`

### `frontend/app/globals.css`

- Tambah `@import "tailwindcss"` di baris pertama (wajib untuk Tailwind v4)

## Catatan Teknis

### Yang tetap pakai inline style

Komponen `ScoreRing` (SVG ring confidence score) masih menggunakan beberapa inline styles karena nilainya dihitung secara dinamis dari prop `score` dan `size`:

```tsx
stroke={color}          // warna berubah berdasarkan nilai score
strokeWidth={size * 0.09}
fontSize={size * 0.22}
```

Nilai-nilai ini tidak bisa di-Tailwind-kan karena bersifat computed — bukan nilai statis.

### Tailwind v4 setup

Tailwind v4 tidak lagi pakai direktif `@tailwind base/components/utilities`. Cukup satu baris di globals.css:

```css
@import "tailwindcss";
```

### Custom values

Warna brand (`#588157`, `#a3b18a`, `#DAD7CD`, dll) masih pakai arbitrary values Tailwind (`bg-[#588157]`) karena belum dikonfigurasi sebagai design token di `tailwind.config`. Bisa di-extract ke config kalau dibutuhkan di banyak tempat.

## Refactor Komponen

`dashboard/page.tsx` dipecah menjadi komponen-komponen terpisah di folder `components/`:

| File | Isi |
|---|---|
| `Sidebar.tsx` | Sidebar kiri (logo + navigasi) |
| `DashboardHeader.tsx` | Search bar + bell + profile |
| `StatsGrid.tsx` | 4 kartu statistik + Confidence Score |
| `ScoreRing.tsx` | SVG ring confidence score |
| `TimelapseeFeed.tsx` | Feed CCTV kiri |
| `TimelineLog.tsx` | Timeline log kanan |

`page.tsx` sekarang hanya berisi assembly komponen (~20 baris).

## Bugfix — CSS Reset vs Tailwind v4 Cascade Layers

### Masalah

Padding dan margin dari Tailwind utility classes (`p-8`, `gap-6`, dll.) tidak berpengaruh meski sudah ditulis di `className`.

### Penyebab

Di Tailwind v4, semua utility classes di-wrap di dalam `@layer utilities`. Di CSS cascade, **unlayered styles selalu menang atas layered styles**, terlepas dari specificity. Block berikut di `globals.css`:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

Karena tidak berada dalam `@layer`, dia override semua utility classes Tailwind yang ada di `@layer utilities` — meski selector `*` punya specificity paling rendah (0,0,0). Di Tailwind v3 hal ini tidak jadi masalah karena utilities tidak di-wrap `@layer`.

### Solusi

Comment/hapus block reset tersebut. Tailwind v4 lewat `@import "tailwindcss"` sudah menyertakan Preflight yang menangani `box-sizing: border-box`.

### Bugfix — Feed Box Menyempit

`TimelapseeFeed` tidak memiliki width, sehingga langsung disqueeze oleh `TimelineLog` yang `flex-1`. Diperbaiki dengan menambah `w-120 shrink-0` (setara 480px).

## Status

- [x] Inline styles dihapus dari `dashboard/page.tsx`
- [x] `dangerouslySetInnerHTML` style block dihapus
- [x] Tailwind v4 diinit di `globals.css`
- [x] `dashboard/page.tsx` dipecah menjadi komponen terpisah
- [x] Bugfix CSS unlayered reset vs `@layer utilities`
- [x] Bugfix feed box width
- [ ] Warna brand belum di-extract ke Tailwind config (opsional)
