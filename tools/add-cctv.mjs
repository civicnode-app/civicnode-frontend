#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH   = join(__dirname, "db.json");

const C = { reset:"\x1b[0m", bold:"\x1b[1m", green:"\x1b[32m", cyan:"\x1b[36m", red:"\x1b[31m", gray:"\x1b[90m" };

// Parse --key value dari argv
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length - 1; i++) {
    if (argv[i].startsWith("--")) args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

const nama       = args.nama;
const ip         = args.ip       ?? `192.168.1.${10 + JSON.parse(readFileSync(DB_PATH,"utf-8")).cctvList.length}`;
const stream     = args.stream   ?? `rtsp://${ip}/stream`;
const zonaId     = args["zona-id"]   ?? "z1";
const zonaNama   = args["zona-nama"] ?? "";
const jenis      = args.jenis    ?? "cctv";

if (!nama || !zonaNama) {
  console.log(`
${C.bold}Usage:${C.reset}
  node tools/add-cctv.mjs --nama <nama> --zona-id <id> --zona-nama <nama> [options]

${C.bold}Required:${C.reset}
  --nama       Nama kamera
  --zona-id    ID zona (contoh: z1)
  --zona-nama  Nama zona (contoh: "Simpang Antasari")

${C.bold}Optional:${C.reset}
  --ip         IP address          ${C.gray}[auto: 192.168.1.x]${C.reset}
  --stream     Stream URL          ${C.gray}[auto: rtsp://<ip>/stream]${C.reset}
  --jenis      Jenis kamera        ${C.gray}[default: cctv]${C.reset}

${C.bold}Contoh:${C.reset}
  node tools/add-cctv.mjs --nama "CCTV Pasar Baru" --zona-id z2 --zona-nama "Pasar Sudimampur" --ip 192.168.1.20
`);
  process.exit(1);
}

const db = JSON.parse(readFileSync(DB_PATH, "utf-8"));

db.cctvList.push({
  id:                `seed-c${Date.now()}`,
  nama,
  ip_address:        ip,
  stream_url:        stream,
  status:            true,
  active_detections: 0,
  confidence_score:  0,
  jenis_kamera:      jenis,
  created_at:        new Date().toISOString(),
  zona:              { id: zonaId, nama: zonaNama },
});

writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log(`${C.green}✓ Kamera "${C.bold}${nama}${C.reset}${C.green}" ditambahkan ke ${zonaId} (${zonaNama}).${C.reset}`);
