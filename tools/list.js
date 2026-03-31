#!/usr/bin/env node
"use strict";

const fs   = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  green:  "\x1b[32m",
  cyan:   "\x1b[36m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  gray:   "\x1b[90m",
  white:  "\x1b[37m",
};

function pad(str, len) {
  return String(str ?? "").slice(0, len).padEnd(len);
}

function repLabel(score) {
  if (score >= 80) return `${C.green}BERSIH${C.reset}`;
  if (score >= 60) return `${C.yellow}CUKUP${C.reset} `;
  if (score >= 40) return `${C.yellow}KOTOR${C.reset} `;
  return `${C.red}KRITIS${C.reset}`;
}

const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

console.log(`\n${C.bold}${C.cyan}  CivicNode — Seed Database${C.reset}  ${C.gray}(tools/db.json)${C.reset}\n`);

// ── CCTV ─────────────────────────────────────────────────────────────────────
console.log(`${C.bold}  🎥 CCTV List ${C.gray}(${db.cctvList.length} entri)${C.reset}`);
if (db.cctvList.length === 0) {
  console.log(`${C.gray}     (kosong)${C.reset}`);
} else {
  console.log(`${C.gray}  ┌─${"─".repeat(22)}─┬─${"─".repeat(16)}─┬─${"─".repeat(16)}─┬─${"─".repeat(14)}─┐${C.reset}`);
  console.log(`${C.gray}  │${C.reset} ${C.bold}${pad("ID", 22)}${C.reset} ${C.gray}│${C.reset} ${C.bold}${pad("Nama", 16)}${C.reset} ${C.gray}│${C.reset} ${C.bold}${pad("IP", 16)}${C.reset} ${C.gray}│${C.reset} ${C.bold}${pad("Zona", 14)}${C.reset} ${C.gray}│${C.reset}`);
  console.log(`${C.gray}  ├─${"─".repeat(22)}─┼─${"─".repeat(16)}─┼─${"─".repeat(16)}─┼─${"─".repeat(14)}─┤${C.reset}`);
  db.cctvList.forEach((c) => {
    console.log(`${C.gray}  │${C.reset} ${pad(c.id, 22)} ${C.gray}│${C.reset} ${pad(c.nama, 16)} ${C.gray}│${C.reset} ${pad(c.ip_address, 16)} ${C.gray}│${C.reset} ${pad(c.zona?.nama, 14)} ${C.gray}│${C.reset}`);
  });
  console.log(`${C.gray}  └─${"─".repeat(22)}─┴─${"─".repeat(16)}─┴─${"─".repeat(16)}─┴─${"─".repeat(14)}─┘${C.reset}`);
}

// ── Zona ─────────────────────────────────────────────────────────────────────
console.log(`\n${C.bold}  🗺️  Zona List ${C.gray}(${db.zonaList.length} entri)${C.reset}`);
if (db.zonaList.length === 0) {
  console.log(`${C.gray}     (kosong)${C.reset}`);
} else {
  console.log(`${C.gray}  ┌─${"─".repeat(20)}─┬─${"─".repeat(20)}─┬─${"─".repeat(8)}─┐${C.reset}`);
  console.log(`${C.gray}  │${C.reset} ${C.bold}${pad("ID", 20)}${C.reset} ${C.gray}│${C.reset} ${C.bold}${pad("Nama", 20)}${C.reset} ${C.gray}│${C.reset} ${C.bold}${pad("Status", 8)}${C.reset} ${C.gray}│${C.reset}`);
  console.log(`${C.gray}  ├─${"─".repeat(20)}─┼─${"─".repeat(20)}─┼─${"─".repeat(8)}─┤${C.reset}`);
  db.zonaList.forEach((z) => {
    console.log(`${C.gray}  │${C.reset} ${pad(z.id, 20)} ${C.gray}│${C.reset} ${pad(z.nama, 20)} ${C.gray}│${C.reset} ${repLabel(z.zone_reputation)}  ${C.gray}│${C.reset}`);
  });
  console.log(`${C.gray}  └─${"─".repeat(20)}─┴─${"─".repeat(20)}─┴─${"─".repeat(8)}─┘${C.reset}`);
}

console.log();
