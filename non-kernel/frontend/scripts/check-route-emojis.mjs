#!/usr/bin/env node
import { execSync } from 'node:child_process';

const ROUTE_FILE_PATTERN = /^non-kernel\/frontend\/app\/.+\/(page|layout|template)\.tsx$/;
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;
const diffBase = process.env.EMOJI_DIFF_BASE || 'origin/main...HEAD';

let diffOutput = '';
try {
  diffOutput = execSync(`git diff --unified=0 --no-color ${diffBase} -- non-kernel/frontend/app`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
} catch (error) {
  if (typeof error.stdout === 'string') {
    diffOutput = error.stdout;
  } else {
    console.error('Unable to read git diff for emoji route check.');
    console.error(String(error));
    process.exit(2);
  }
}

const violations = [];
let currentFile = null;
let currentLine = null;

for (const line of diffOutput.split('\n')) {
  if (line.startsWith('+++ b/')) {
    currentFile = line.slice('+++ b/'.length);
    continue;
  }

  const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if (hunk) {
    currentLine = Number.parseInt(hunk[1], 10);
    continue;
  }

  if (!currentFile || !ROUTE_FILE_PATTERN.test(currentFile) || currentLine === null) {
    continue;
  }

  if (line.startsWith('+') && !line.startsWith('+++')) {
    const addedText = line.slice(1);
    if (EMOJI_PATTERN.test(addedText)) {
      violations.push(`${currentFile}:${currentLine}: direct emoji usage in route diff`);
    }
    currentLine += 1;
    continue;
  }

  if (line.startsWith(' ') || (!line.startsWith('-') && line.length > 0)) {
    currentLine += 1;
  }
}

if (violations.length > 0) {
  console.error('Emoji route check failed. Use icon-map semantic keys instead of direct emojis in route diffs.');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('Emoji route diff check passed (no newly introduced route emojis).');
