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
  const hint = defaultVal !== undefined ? ` ${C.gray}[${defaultVal}]${C.reset}` : "";
  return new Promise((resolve) =>
    rl.question(`  ${question}${hint}: `, (ans) => resolve(ans.trim() || (defaultVal ?? "")))
  );
}

async function main() {
  const db = readDb();

  console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║   🗺️   Tambah Zona Baru       ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚══════════════════════════════╝${C.reset}\n`);

  const nama = await ask("Nama zona  *");
  if (!nama) { console.log(`\n${C.red}  ✗ Nama zona wajib diisi.${C.reset}\n`); rl.close(); return; }

  const deskripsi  = await ask("Deskripsi  ", "");
  const reputasi   = await ask("Reputasi   ", "50");
  const repNum     = Math.min(100, Math.max(0, parseInt(reputasi, 10) || 50));

  const newEntry = {
    id:              `seed-z${Date.now()}`,
    nama,
    deskripsi,
    zone_reputation: repNum,
  };

  db.zonaList.push(newEntry);
  writeDb(db);

  console.log(`\n${C.green}  ✓ Zona "${C.bold}${nama}${C.reset}${C.green}" ditambahkan! ${C.gray}(ID: ${newEntry.id}, reputasi: ${repNum})${C.reset}`);
  console.log(`${C.gray}  Refresh browser untuk melihat perubahan.\n${C.reset}`);
  rl.close();
}

main().catch((err) => {
  console.error(`\n${C.red}  Error:${C.reset}`, err.message);
  rl.close();
  process.exit(1);
});
