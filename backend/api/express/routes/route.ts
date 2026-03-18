import { Router } from 'express';
import {
  handleGoogleAuthStart,
  handleGoogleAuth,
} from '../controller/handler';
import { validateGoogleAuthPayload } from '../../validator/validate';

const router = Router();
const notImplemented = (_req: any, res: any) => {
  return res.status(501).json({ error: 'Endpoint belum diimplementasikan' });
};

// ── AUTH ────────────────────────────────────────────────────────────────────
router.get('/auth/google/url', handleGoogleAuthStart);
router.post('/auth/google', validateGoogleAuthPayload, handleGoogleAuth);
router.get('/auth/metamask', notImplemented);
router.post('/auth/logout', notImplemented);
router.get('/auth/me', notImplemented);

// ── PELANGGARAN ───────────────────────────────────────────────────────────────────
router.post('/pelanggaran', notImplemented);
router.get('/pelanggaran', notImplemented);
router.get('/pelanggaran/:id', notImplemented);
router.get('/pelanggaran/export', notImplemented);

// ── CCTV ───────────────────────────────────────────────────────────────────
router.post('/cctv', notImplemented);
router.get('/cctv', notImplemented);
router.get('/cctv/active', notImplemented);
router.get('/cctv/:id', notImplemented);
router.get('/cctv/:id/pelanggaran', notImplemented);
router.get('/cctv/:id/summary', notImplemented);
router.patch('/cctv/:id', notImplemented);
router.delete('/cctv/:id', notImplemented);

// ── ZONA ───────────────────────────────────────────────────────────────────
router.post('/zona', notImplemented);
router.get('/zona', notImplemented);
router.get('/zona/:id', notImplemented);
router.get('/zona/:id/cctv', notImplemented);
router.get('/zona/:id/skor', notImplemented);
router.get('/zona/:id/summary', notImplemented);
router.patch('/zona/:id', notImplemented);
router.delete('/zona/:id', notImplemented);

// ── STAFF ───────────────────────────────────────────────────────────────────
router.get('/staff', notImplemented);
router.get('/staff/:id', notImplemented);
router.delete('/staff/:id', notImplemented);
export default router;
