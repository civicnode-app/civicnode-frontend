import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './api/express/routes/route';
import { loadEnv } from './api/config/env';

loadEnv();

const app = express();
const PORT = process.env.PORT ?? 3001;
const HOST = 'localhost';

const allowedOrigins = (
  process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? 'http://localhost:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl/postman) and configured browser origins.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api', apiRouter);

// Legacy: deteksi logs endpoint
app.post('/api/detection-logs', (req: any, res: any) => {
  const { status, timestamp } = req.body;
  console.log(`Log Pelanggaran Masuk: ${status} pada ${new Date(timestamp * 1000)}`);
  res.status(200).send('Log Tercatat');
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅  Express API berjalan di http://${HOST}:${PORT}`);
  console.log(`   Auth Google : POST http://${HOST}:${PORT}/api/auth/google`);
});
