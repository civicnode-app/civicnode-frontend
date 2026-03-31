#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
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

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length - 1; i++) {
    if (argv[i].startsWith("--")) args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

const nama      = args.nama;
const deskripsi = args.deskripsi ?? "";
const reputasi  = parseInt(args.reputasi ?? "50", 10);

if (!nama) {
  console.log(`
${C.bold}Usage:${C.reset}
  node tools/add-zona.mjs --nama <nama> [options]

${C.bold}Required:${C.reset}
  --nama       Nama zona

${C.bold}Optional:${C.reset}
  --deskripsi  Deskripsi zona       ${C.gray}[default: ""]${C.reset}
  --reputasi   Skor reputasi 0-100  ${C.gray}[default: 50]${C.reset}

${C.bold}Contoh:${C.reset}
  node tools/add-zona.mjs --nama "Pasar Baru" --deskripsi "Kawasan pasar tradisional" --reputasi 65
`);
  process.exit(1);
}

const db = JSON.parse(readFileSync(DB_PATH, "utf-8"));

db.zonaList.push({
  id:              `seed-z${Date.now()}`,
  nama,
  deskripsi,
  zone_reputation: Math.min(100, Math.max(0, isNaN(reputasi) ? 50 : reputasi)),
});

writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log(`${C.green}✓ Zona "${C.bold}${nama}${C.reset}${C.green}" ditambahkan.${C.reset}`);
