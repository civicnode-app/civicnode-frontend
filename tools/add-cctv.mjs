#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH   = join(__dirname, "db.json");

const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  green:  "\x1b[32m",
  cyan:   "\x1b[36m",
  red:    "\x1b[31m",
  gray:   "\x1b[90m",
};

const readDb  = () => JSON.parse(readFileSync(DB_PATH, "utf-8"));
const writeDb = (data) => writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (question, defaultVal) => new Promise((resolve) => {
  const hint = defaultVal ? ` ${C.gray}[${defaultVal}]${C.reset}` : "";
  rl.question(`  ${question}${hint}: `, (ans) => resolve(ans.trim() || defaultVal || ""));
});

const db = readDb();

console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════╗${C.reset}`);
console.log(`${C.bold}${C.cyan}║   🎥  Tambah Kamera CCTV     ║${C.reset}`);
console.log(`${C.bold}${C.cyan}╚══════════════════════════════╝${C.reset}\n`);

const existingZonas = [...new Map(db.cctvList.map((c) => [c.zona.id, c.zona])).values()];
if (existingZonas.length) {
  console.log(`${C.gray}  Zona tersedia di db:${C.reset}`);
  existingZonas.forEach((z) => console.log(`  ${C.gray}  ${z.id} → ${z.nama}${C.reset}`));
  console.log();
}

const nama       = await ask("Nama kamera *");
if (!nama) { console.log(`\n${C.red}  ✗ Nama kamera wajib diisi.${C.reset}\n`); rl.close(); process.exit(1); }

const ip_address = await ask("IP Address", `192.168.1.${10 + db.cctvList.length}`);
const stream_url = await ask("Stream URL", `rtsp://${ip_address}/stream`);
const zona_id    = await ask("Zona ID   ", "z1");
const zona_nama  = await ask("Nama Zona ", existingZonas.find((z) => z.id === zona_id)?.nama || "");
const jenis      = await ask("Jenis     ", "cctv");

db.cctvList.push({
  id:                `seed-c${Date.now()}`,
  nama,
  ip_address,
  stream_url,
  status:            true,
  active_detections: 0,
  confidence_score:  0,
  jenis_kamera:      jenis,
  created_at:        new Date().toISOString(),
  zona:              { id: zona_id, nama: zona_nama },
});

writeDb(db);
console.log(`\n${C.green}  ✓ Kamera "${C.bold}${nama}${C.reset}${C.green}" ditambahkan!${C.reset}`);
console.log(`${C.gray}  Refresh browser untuk melihat perubahan.\n${C.reset}`);
rl.close();
