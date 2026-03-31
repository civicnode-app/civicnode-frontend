#!/usr/bin/env node
"use strict";

const fs       = require("fs");
const path     = require("path");
const readline = require("readline");

const DB_PATH = path.join(__dirname, "db.json");

const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  green:  "\x1b[32m",
  cyan:   "\x1b[36m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  gray:   "\x1b[90m",
};

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultVal) {
  const hint = defaultVal ? ` ${C.gray}[${defaultVal}]${C.reset}` : "";
  return new Promise((resolve) =>
    rl.question(`  ${question}${hint}: `, (ans) => resolve(ans.trim() || defaultVal || ""))
  );
}

async function main() {
  const db = readDb();

  console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║   🎥  Tambah Kamera CCTV     ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚══════════════════════════════╝${C.reset}\n`);

  // Tampilkan zona yang sudah ada di db
  const existingZonas = [...new Map(db.cctvList.map((c) => [c.zona.id, c.zona])).values()];
  if (existingZonas.length) {
    console.log(`${C.gray}  Zona tersedia di db:${C.reset}`);
    existingZonas.forEach((z) => console.log(`  ${C.gray}  ${z.id} → ${z.nama}${C.reset}`));
    console.log();
  }

  const nama        = await ask("Nama kamera *");
  if (!nama) { console.log(`\n${C.red}  ✗ Nama kamera wajib diisi.${C.reset}\n`); rl.close(); return; }

  const ip_address  = await ask("IP Address", `192.168.1.${10 + db.cctvList.length}`);
  const stream_url  = await ask("Stream URL", `rtsp://${ip_address}/stream`);
  const zona_id     = await ask("Zona ID   ", "z1");
  const zona_nama   = await ask("Nama Zona ", existingZonas.find((z) => z.id === zona_id)?.nama || "");
  const jenis       = await ask("Jenis     ", "cctv");

  const newEntry = {
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
  };

  db.cctvList.push(newEntry);
  writeDb(db);

  console.log(`\n${C.green}  ✓ Kamera "${C.bold}${nama}${C.reset}${C.green}" ditambahkan! ${C.gray}(ID: ${newEntry.id})${C.reset}`);
  console.log(`${C.gray}  Refresh browser untuk melihat perubahan.\n${C.reset}`);
  rl.close();
}

main().catch((err) => {
  console.error(`\n${C.red}  Error:${C.reset}`, err.message);
  rl.close();
  process.exit(1);
});
