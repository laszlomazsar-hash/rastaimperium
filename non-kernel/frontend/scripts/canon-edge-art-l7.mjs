#!/usr/bin/env node
/** Canonicalization edge cases for json-canonical-sorted-keys-1 */
import { createHash } from "crypto";

function canonicalize(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`).join(",")}}`;
}

const cases = [];
function test(id, fn) {
  try {
    cases.push({ id, ...fn() });
  } catch (e) {
    cases.push({ id, pass: false, note: "throw:" + e.message });
  }
}

test("CE01-key-order", () => {
  const a = canonicalize({ b: 1, a: 2 });
  const b = canonicalize({ a: 2, b: 1 });
  return { pass: a === b, note: a };
});
test("CE02-nested-key-order", () => {
  const a = canonicalize({ z: { b: 1, a: 2 }, y: 0 });
  const b = canonicalize({ y: 0, z: { a: 2, b: 1 } });
  return { pass: a === b };
});
test("CE03-array-order-preserved", () => {
  return { pass: canonicalize([1, 2, 3]) !== canonicalize([3, 2, 1]), note: "arrays ordered" };
});
test("CE04-gt-lt-no-html-escape", () => {
  const s = canonicalize("a>b<c");
  return { pass: s === '"a>b<c"' && !s.includes("\\u003"), note: s };
});
test("CE05-quote-backslash", () => {
  const s = canonicalize('say "hi" \\');
  return { pass: s === JSON.stringify('say "hi" \\'), note: s };
});
test("CE06-control-newline", () => {
  const s = canonicalize("a\nb");
  return { pass: s === '"a\\nb"', note: s };
});
test("CE07-unicode-plane0", () => {
  const s = canonicalize("café");
  return { pass: typeof s === "string" && s.startsWith('"'), note: s, status: "OBSERVED" };
});
test("CE08-no-insignificant-whitespace", () => {
  const s = canonicalize({ a: 1 });
  return { pass: s === '{"a":1}', note: s };
});
test("CE09-integer", () => ({ pass: canonicalize(1) === "1" }));
test("CE10-negative-zero", () => {
  const s = canonicalize(-0);
  return { pass: s === "0", note: "JS -0 → 0", status: "OBSERVED_JS_BEHAVIOR" };
});
test("CE11-null-bool", () => ({
  pass: canonicalize(null) === "null" && canonicalize(true) === "true",
}));
test("CE12-forward-slash", () => {
  const s = canonicalize("a/b");
  return { pass: s === '"a/b"', note: "slash unescaped" };
});
test("CE13-nonfinite-unspecified", () => ({
  pass: true,
  note: "non-finite not used in L7 capsules; JSON.stringify(Infinity)=" + JSON.stringify(Infinity),
  status: "UNSPECIFIED_FOR_CAPSULES",
}));
test("CE14-exponent-unspecified", () => ({
  pass: true,
  note: "scientific notation not used in sealed L7 capsules",
  status: "UNSPECIFIED_FOR_CAPSULES",
}));

const pass = cases.every((c) => c.pass);
console.log(JSON.stringify({ suite: "canon-edge-art-l7-v1", pass, count: cases.length, cases }, null, 2));
process.exit(pass ? 0 : 1);
