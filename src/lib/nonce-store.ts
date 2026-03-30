/**
 * In-memory nonce store untuk MetaMask authentication.
 * Menggunakan global object agar tidak ter-reset saat HMR di dev mode.
 * Cocok untuk deployment single-instance (lokal / VPS).
 * Setiap nonce hanya berlaku 5 menit dan hangus setelah dipakai.
 */
type NonceEntry = { nonce: string; expires: number };

const g = global as typeof globalThis & { _nonceStore?: Map<string, NonceEntry> };
if (!g._nonceStore) g._nonceStore = new Map();

export const nonceStore = g._nonceStore;
