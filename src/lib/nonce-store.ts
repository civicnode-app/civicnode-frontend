/**
 * In-memory nonce store untuk MetaMask authentication.
 * Cocok untuk deployment single-instance (lokal / VPS).
 * Setiap nonce hanya berlaku 5 menit dan hangus setelah dipakai.
 */
export const nonceStore = new Map<string, { nonce: string; expires: number }>();
