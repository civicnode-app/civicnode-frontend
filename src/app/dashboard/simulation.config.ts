// ─────────────────────────────────────────────────────────────────────────────
//  Simulation Config — CivicNode Dashboard
//  Semua konstanta simulasi terpusat di sini. Edit file ini untuk
//  menyesuaikan kecepatan dan parameter simulasi demo.
// ─────────────────────────────────────────────────────────────────────────────

/** Waktu tempuh petugas dari markas menuju zona (milidetik) */
export const TRAVEL_TO_FIELD_MS = 1_000;

/** Waktu tempuh petugas kembali ke markas setelah zona bersih (milidetik) */
export const TRAVEL_RETURN_MS = 1_000;

/**
 * Interval degradasi kebersihan (milidetik).
 * Setiap interval ini, zona yang tidak sedang dikerjakan petugas
 * akan turun 1 poin — simulasi sampah terus berdatangan.
 */
export const DEGRADATION_MS = 500;

/**
 * Interval tick pembersihan (milidetik).
 * Setiap tick, score zona naik sebesar (jumlah_petugas × POINTS_PER_OFFICER).
 */
export const RECOVERY_TICK_MS = 500;

/**
 * Poin kebersihan yang disumbang per petugas per tick.
 * Contoh default: 1 petugas × 1 poin/tick = naik 1 poin/detik.
 * Naikkan nilai ini agar petugas bekerja lebih cepat.
 */
export const POINTS_PER_OFFICER = 0.5;

/** Jumlah personel Armada Siaga pada awal simulasi */
export const INITIAL_ARMADA_SIAGA = 30;
