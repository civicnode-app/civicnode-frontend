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
  const hint = defaultVal !== undefined ? ` ${C.gray}[${defaultVal}]${C.reset}` : "";
  rl.question(`  ${question}${hint}: `, (ans) => resolve(ans.trim() || (defaultVal ?? "")));
});

const db = readDb();

console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════╗${C.reset}`);
console.log(`${C.bold}${C.cyan}║   🗺️   Tambah Zona Baru       ║${C.reset}`);
console.log(`${C.bold}${C.cyan}╚══════════════════════════════╝${C.reset}\n`);

const nama = await ask("Nama zona  *");
if (!nama) { console.log(`\n${C.red}  ✗ Nama zona wajib diisi.${C.reset}\n`); rl.close(); process.exit(1); }

const deskripsi = await ask("Deskripsi  ", "");
const reputasi  = await ask("Reputasi   ", "50");

db.zonaList.push({
  id:              `seed-z${Date.now()}`,
  nama,
  deskripsi,
  zone_reputation: Math.min(100, Math.max(0, parseInt(reputasi, 10) || 50)),
});

writeDb(db);
console.log(`\n${C.green}  ✓ Zona "${C.bold}${nama}${C.reset}${C.green}" ditambahkan!${C.reset}`);
console.log(`${C.gray}  Refresh browser untuk melihat perubahan.\n${C.reset}`);
rl.close();
