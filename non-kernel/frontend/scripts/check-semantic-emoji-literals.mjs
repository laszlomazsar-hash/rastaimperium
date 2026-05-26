#!/usr/bin/env node
import { execSync } from "node:child_process";

const diffBase = process.env.EMOJI_DIFF_BASE || "origin/main...HEAD";
const disallowed = new Set(["✦", "📜", "⚡", "🔮", "🧬", "🛡️"]);
const allowlist = [/^\+\+\+ b\/app\/components\/icons\/registry\.tsx$/];

let diffOutput = "";
try {
  diffOutput = execSync(`git diff --unified=0 --no-color ${diffBase} -- app`, { encoding: "utf8" });
} catch (error) {
  diffOutput = typeof error.stdout === "string" ? error.stdout : "";
}

const violations = [];
let currentFile = "";
let currentLine = null;

for (const line of diffOutput.split("\n")) {
  if (line.startsWith("+++ b/")) {
    currentFile = line.slice(6);
    continue;
  }
  const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if (hunk) {
    currentLine = Number.parseInt(hunk[1], 10);
    continue;
  }
  if (!currentFile || currentLine === null || !line.startsWith("+") || line.startsWith("+++")) continue;
  if (allowlist.some((p) => p.test(`+++ b/${currentFile}`))) {
    currentLine += 1;
    continue;
  }
  for (const emoji of disallowed) {
    if (line.includes(emoji)) violations.push(`${currentFile}:${currentLine}`);
  }
  currentLine += 1;
}

if (violations.length) {
  console.error("Semantic emoji check failed. Use capability-key icons from registry.");
  [...new Set(violations)].forEach((v) => console.error(`- ${v}`));
  process.exit(1);
}
console.log("Semantic emoji check passed.");
