import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const frontendRoot = resolve(process.cwd());
const repoRoot = resolve(frontendRoot, "../..");
const imageExts = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".ico", ".avif", ".svg"]);
const errors = [];

const trackedFiles = execFileSync("git", ["ls-files", "-z"], { cwd: repoRoot }).toString("utf8").split("\0").filter(Boolean);
const imageFiles = trackedFiles.filter((path) => imageExts.has(extname(path).toLowerCase()));

const requiredMirrors = [
  [
    join(frontendRoot, "public/images/logo-lm-3d.jpg"),
    resolve(frontendRoot, "../../backend/static/images/logo-lm-3d.jpg"),
  ],
  [
    join(frontendRoot, "public/images/logo-rasta-imperium-white.jpg"),
    resolve(frontendRoot, "../../backend/static/images/logo-rasta-imperium-white.jpg"),
  ],
];

function absolute(repoRelativePath) {
  return join(repoRoot, repoRelativePath);
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function signatureMatches(path) {
  const ext = extname(path).toLowerCase();
  const bytes = readFileSync(path).subarray(0, 64);
  if (ext === ".jpg" || ext === ".jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (ext === ".png") return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (ext === ".gif") return ["GIF87a", "GIF89a"].includes(bytes.subarray(0, 6).toString("ascii"));
  if (ext === ".webp") return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if (ext === ".avif") return bytes.includes(Buffer.from("ftypavif")) || bytes.includes(Buffer.from("ftypavis"));
  if (ext === ".ico") return bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0;
  if (ext === ".svg") {
    const text = readFileSync(path, "utf8").replace(/^\uFEFF/, "").trim();
    return /^<svg(?:\s|>)/i.test(text) && /<\/svg>\s*$/i.test(text);
  }
  return true;
}

for (const repoRelativePath of imageFiles) {
  const path = absolute(repoRelativePath);
  const size = statSync(path).size;
  if (size <= 2) errors.push(`${repoRelativePath}: placeholder/empty binary (${size} bytes)`);
  if (!signatureMatches(path)) errors.push(`${repoRelativePath}: extension does not match detected file signature`);
}

const b64 = trackedFiles.filter((path) => path.endsWith(".b64"));
if (b64.length) errors.push(`unexpected .b64 assets: ${b64.join(", ")}`);

for (const [source, exported] of requiredMirrors) {
  const sourceRel = relative(repoRoot, source);
  const exportedRel = relative(repoRoot, exported);
  if (!existsSync(source)) errors.push(`${sourceRel}: missing canonical export source`);
  if (!existsSync(exported)) errors.push(`${exportedRel}: missing static-export mirror`);
  if (existsSync(source) && existsSync(exported) && sha256(source) !== sha256(exported)) {
    errors.push(`${sourceRel} and ${exportedRel}: bytes differ`);
  }
}

if (errors.length) {
  console.error("Asset integrity FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Asset integrity OK — scanned ${imageFiles.length} tracked image assets; canonical logo mirrors match.`);
