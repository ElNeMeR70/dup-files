#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const root = process.argv[2] || ".";
const IGNORE = new Set(["node_modules", ".git", "dist", "build"]);
const hashes = {};

function hashFile(file) {
  try {
    const buf = fs.readFileSync(file);
    return crypto.createHash("sha256").update(buf).digest("hex");
  } catch { return null; }
}

function walk(dir) {
  try {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORE.has(f.name)) continue;
      const full = path.join(dir, f.name);
      if (f.isDirectory()) walk(full);
      else if (f.isFile()) {
        const h = hashFile(full);
        if (h) {
          if (!hashes[h]) hashes[h] = [];
          hashes[h].push(full);
        }
      }
    }
  } catch {}
}
console.log(`\x1b[36mScanning for duplicate files in ${root}...\x1b[0m`);
walk(root);
const dups = Object.values(hashes).filter(list => list.length > 1);
if (!dups.length) {
  console.log("\x1b[32m✔ No duplicate files found.\x1b[0m");
} else {
  console.log(`\x1b[33mFound ${dups.length} duplicate group(s):\x1b[0m\n`);
  dups.forEach((group, i) => {
    console.log(`Group ${i + 1}:`);
    group.forEach(f => console.log(`  - ${f}`));
  });
}
