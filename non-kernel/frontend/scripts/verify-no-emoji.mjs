#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";

const targets = [
  "out/empire/index.html",
  "../../backend/static/empire/index.html",
];

const emojiRegex = /[\p{Extended_Pictographic}]/gu;
let failed = false;

for (const relativePath of targets) {
  if (!existsSync(relativePath)) {
    console.error(`[verify-no-emoji] Missing generated file: ${relativePath}`);
    failed = true;
    continue;
  }

  const content = readFileSync(relativePath, "utf8");
  const matches = content.match(emojiRegex) ?? [];
  if (matches.length > 0) {
    console.error(`[verify-no-emoji] Emoji glyphs found in ${relativePath}: ${[...new Set(matches)].join(" ")}`);
    failed = true;
  } else {
    console.log(`[verify-no-emoji] OK: ${relativePath}`);
  }
}

if (failed) process.exit(1);
