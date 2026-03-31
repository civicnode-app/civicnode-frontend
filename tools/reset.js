#!/usr/bin/env node
"use strict";

const fs       = require("fs");
const path     = require("path");
const readline = require("readline");

const DB_PATH = path.join(__dirname, "db.json");

const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  red:    "\x1b[31m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  gray:   "\x1b[90m",
};

const db   = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const total = db.cctvList.length + db.zonaList.length;

if (total === 0) {
  console.log(`\n${C.gray}  db.json sudah kosong, tidak ada yang perlu di-reset.${C.reset}\n`);
  process.exit(0);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log(`\n${C.yellow}  ⚠️  Reset akan menghapus:${C.reset}`);
console.log(`     ${C.bold}${db.cctvList.length}${C.reset} kamera CCTV`);
console.log(`     ${C.bold}${db.zonaList.length}${C.reset} zona\n`);

rl.question(`  Lanjutkan? ${C.gray}[y/N]${C.reset}: `, (ans) => {
  if (ans.trim().toLowerCase() === "y") {
    fs.writeFileSync(DB_PATH, JSON.stringify({ cctvList: [], zonaList: [] }, null, 2));
    console.log(`\n${C.green}  ✓ db.json berhasil dikosongkan.${C.reset}\n`);
  } else {
    console.log(`\n${C.gray}  Dibatalkan.${C.reset}\n`);
  }
  rl.close();
});
