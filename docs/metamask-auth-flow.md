# MetaMask Auth Flow — CivicNode Frontend

## Status

Sudah selesai dan berjalan. Ditest di Firefox (Brave ada bug BigNumber internal).

## Flow Lengkap

```
1. User klik "Masuk dengan MetaMask"
         ↓
2. Frontend: wallet_requestPermissions → popup MetaMask muncul, user pilih akun
         ↓
3. Frontend: GET /api/auth/nonce?address=0x...
         ↓
4. Backend: return { success: true, data: { nonce: "CivicNode sign-in: uuid" } }
         ↓
5. Frontend: personal_sign(nonce, wallet_address) → MetaMask minta user sign
         ↓
6. Frontend: POST /api/auth/metamask
   body: { wallet_address, signature, nonce }
         ↓
7. Backend verifikasi signature → cek wallet di tabel staff → return JWT
         ↓
8. Frontend simpan access_token ke localStorage → redirect ke /dashboard
```

## Kontrak Backend

### GET /api/auth/nonce?address=0x...

```json
{ "success": true, "data": { "nonce": "CivicNode sign-in: uuid" } }
```

### POST /api/auth/metamask

Request body:
```json
{ "wallet_address": "0x...", "signature": "0x...", "nonce": "CivicNode sign-in: uuid" }
```

Response:
```json
{ "success": true, "data": { "access_token": "eyJ..." } }
```

## Token

Custom JWT yang di-sign backend sendiri.
Disimpan di localStorage dengan key `access_token`.

```json
{ "staff_id": 1, "wallet_address": "0x...", "role": "owner" }
```

## Catatan Penting

### wallet_requestPermissions vs eth_requestAccounts
Frontend pakai `wallet_requestPermissions` agar popup pilih akun selalu muncul.
Dengan `eth_requestAccounts`, MetaMask skip popup kalau site sudah pernah connected.

### Bug Brave Browser
`wallet_requestPermissions` trigger bug BigNumber internal di Brave versi tertentu
karena konflik dengan Brave Wallet. **Gunakan Firefox atau Chrome untuk development.**

Fix sementara di Brave: ganti "Default Ethereum wallet" ke "Extensions" (bukan "Extensions with Brave Wallet fallback") di `brave://settings/web3`.

### Staff harus didaftarkan manual
Tidak ada endpoint registrasi — wallet_address harus diinsert manual ke tabel `staff`
di Supabase Dashboard sebelum bisa login.

## File yang Relevan

- [`frontend/app/sign-in/page.tsx`](../frontend/app/sign-in/page.tsx) — `handleMetaMaskLogin`
- [`frontend/.env`](../frontend/.env) — `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001`
