import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(process.cwd());
const scanRoots = [
  join(root, "public"),
  resolve(root, "../../backend/static"),
];

const requiredMirrors = [
  [
    join(root, "public/images/logo-lm-3d.jpg"),
    resolve(root, "../../backend/static/images/logo-lm-3d.jpg"),
  ],
  [
    join(root, "public/images/logo-rasta-imperium-white.jpg"),
    resolve(root, "../../backend/static/images/logo-rasta-imperium-white.jpg"),
  ],
];

const imageExts = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".ico", ".avif", ".svg"]);
const errors = [];
const files = [];

function walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else files.push(path);
  }
}

for (const dir of scanRoots) walk(dir);

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function mimeFor(path, bytes) {
  const ext = extname(path).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (ext === ".png") return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (ext === ".gif") return bytes.subarray(0, 6).toString("ascii") === "GIF87a" || bytes.subarray(0, 6).toString("ascii") === "GIF89a";
  if (ext === ".webp") return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if (ext === ".avif") return bytes.includes(Buffer.from("ftypavif")) || bytes.includes(Buffer.from("ftypavis"));
  if (ext === ".ico") return bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0;
  if (ext === ".svg") {
    const text = readFileSync(path, "utf8").replace(/^\uFEFF/, "").trim();
    return /^<svg(?:\s|>)/i.test(text) && /<\/svg>\s*$/i.test(text);
  }
  return true;
}

for (const path of files) {
  const ext = extname(path).toLowerCase();
  if (!imageExts.has(ext)) continue;
  const size = statSync(path).size;
  const rel = relative(root, path) || relative(resolve(root, "../.."), path);
  if (size === 0 || size === 1 || size === 2) errors.push(`${rel}: placeholder/empty binary (${size} bytes)`);
  if (!mimeFor(path, readFileSync(path).subarray(0, 64))) errors.push(`${rel}: extension does not match detected file signature`);
}

for (const pair of requiredMirrors) {
  const [source, exported] = pair;
  const sourceRel = relative(root, source);
  const exportedRel = relative(root, exported);
  if (!existsSync(source)) errors.push(`${sourceRel}: missing canonical export source`);
  if (!existsSync(exported)) errors.push(`${exportedRel}: missing static-export mirror`);
  if (existsSync(source) && existsSync(exported) && sha256(source) !== sha256(exported)) {
    errors.push(`${sourceRel} and ${exportedRel}: bytes differ`);
  }
}

const b64 = files.filter((path) => path.endsWith(".b64"));
if (b64.length) errors.push(`unexpected .b64 assets: ${b64.map((p) => relative(root, p)).join(", ")}`);

if (errors.length) {
  console.error("Asset integrity FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Asset integrity OK — scanned ${files.length} files; canonical logo mirrors match.`);
