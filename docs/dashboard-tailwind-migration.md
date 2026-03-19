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

## Status

- [x] Inline styles dihapus dari `dashboard/page.tsx`
- [x] `dangerouslySetInnerHTML` style block dihapus
- [x] Tailwind v4 diinit di `globals.css`
- [ ] Warna brand belum di-extract ke Tailwind config (opsional)
