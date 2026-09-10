#!/usr/bin/env node
/**
 * Deterministic public evidence boundary gate.
 *
 * Authoritative source: docs/evidence/EVIDENCE_MANIFEST.json
 *
 * Detects contradictions of the class:
 *   public page promotes VERIFIED ID not present in the Living Evidence Manifest
 *   (e.g. historical ART-L7-PARITY-002 labelled VERIFIED on /verify/)
 *
 * No network. No LLM. Exit 1 on failure.
 *
 * Usage:
 *   node scripts/verify-evidence-boundary.mjs
 *   node scripts/verify-evidence-boundary.mjs --self-test
 */

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(__dirname, "..");
const repoRoot = resolve(frontendRoot, "../..");

const VALID_STATUSES = new Set(["VERIFIED", "DEMONSTRATION", "UNAVAILABLE"]);

/** Historical-only IDs that must not appear as public VERIFIED promotions */
const HISTORICAL_ONLY_IDS = new Set(["ART-L7-PARITY-002"]);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function walkFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "out") continue;
    const p = join(dir, name);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walkFiles(p, acc);
    else if (/\.(tsx?|jsx?|mjs|cjs|md|json|txt)$/i.test(name)) acc.push(p);
  }
  return acc;
}

function loadManifest(manifestPath) {
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing authoritative manifest: ${manifestPath}`);
  }
  const manifest = readJson(manifestPath);
  if (!Array.isArray(manifest.claims)) {
    throw new Error("Manifest missing claims array");
  }
  return manifest;
}

function indexClaims(manifest) {
  const byId = new Map();
  const errors = [];
  for (const claim of manifest.claims) {
    if (!claim || typeof claim.id !== "string" || !claim.id.trim()) {
      errors.push("Manifest claim missing id");
      continue;
    }
    if (!VALID_STATUSES.has(claim.status)) {
      errors.push(`Invalid status vocabulary for ${claim.id}: ${claim.status}`);
    }
    if (byId.has(claim.id)) {
      errors.push(`Duplicate evidence ID in manifest: ${claim.id}`);
    }
    byId.set(claim.id, claim);
  }
  return { byId, errors };
}

function verifiedIds(byId) {
  return [...byId.entries()].filter(([, c]) => c.status === "VERIFIED").map(([id]) => id);
}

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findVerifiedPromotions(text, knownIds) {
  const promotions = new Set();
  for (const id of knownIds) {
    const re = new RegExp(
      `${escapeReg(id)}[\\s\\S]{0,240}?VERIFIED|VERIFIED[\\s\\S]{0,240}?${escapeReg(id)}`,
      "g",
    );
    if (re.test(text)) promotions.add(id);
    const jsx = new RegExp(
      `${escapeReg(id)}[\\s\\S]{0,120}?status=[\"']VERIFIED[\"']|status=[\"']VERIFIED[\"'][\\s\\S]{0,120}?${escapeReg(id)}`,
      "g",
    );
    if (jsx.test(text)) promotions.add(id);
  }
  return promotions;
}

function rel(repoRoot, abs) {
  return abs.startsWith(repoRoot) ? abs.slice(repoRoot.length + 1) : abs;
}

function validateArtifacts(repoRoot, byId, errors) {
  for (const [id, claim] of byId) {
    if (claim.status !== "VERIFIED") continue;
    const relArtifact = claim.artifact;
    if (!relArtifact || typeof relArtifact !== "string") {
      errors.push(`VERIFIED ${id}: missing artifact path in manifest`);
      continue;
    }
    const publicPath = join(repoRoot, "non-kernel/frontend/public", relArtifact.replace(/^\//, ""));
    const dataPath = join(repoRoot, "non-kernel/frontend/data/evidence/artifacts", `${id}.json`);
    const backendPath = join(repoRoot, "backend/static", relArtifact.replace(/^\//, ""));

    if (!existsSync(publicPath)) {
      errors.push(`VERIFIED ${id}: missing public export source ${rel(repoRoot, publicPath)}`);
    } else {
      try {
        const art = readJson(publicPath);
        if (art.artifactId && art.artifactId !== id) {
          errors.push(`VERIFIED ${id}: artifactId mismatch in public JSON (${art.artifactId})`);
        }
        if (typeof art !== "object" || art === null) {
          errors.push(`VERIFIED ${id}: public artifact is not a JSON object`);
        }
      } catch (e) {
        errors.push(`VERIFIED ${id}: public artifact JSON parse failed: ${e.message}`);
      }
    }

    if (existsSync(backendPath)) {
      try {
        readJson(backendPath);
      } catch (e) {
        errors.push(`VERIFIED ${id}: backend/static artifact JSON parse failed: ${e.message}`);
      }
    }

    if (existsSync(dataPath)) {
      try {
        const art = readJson(dataPath);
        if (art.artifactId && art.artifactId !== id) {
          errors.push(`VERIFIED ${id}: data artifactId mismatch (${art.artifactId})`);
        }
      } catch (e) {
        errors.push(`VERIFIED ${id}: data artifact JSON parse failed: ${e.message}`);
      }
    }
  }
}

function validatePublicSurfaces(repoRoot, verifiedSet, errors) {
  const scanRoots = [
    join(repoRoot, "non-kernel/frontend/app/verify"),
    join(repoRoot, "non-kernel/frontend/app/proof"),
    join(repoRoot, "non-kernel/frontend/app/audit"),
    join(repoRoot, "non-kernel/frontend/app/evidence"),
    join(repoRoot, "non-kernel/frontend/app/page.tsx"),
    join(repoRoot, "non-kernel/frontend/data/evidence/manifest.ts"),
    join(repoRoot, "README.md"),
  ];

  const files = [];
  for (const root of scanRoots) {
    if (!existsSync(root)) continue;
    const st = statSync(root);
    if (st.isDirectory()) walkFiles(root, files);
    else files.push(root);
  }

  const artIdRe = /ART-L7-[A-Z0-9-]+/g;

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const idsInFile = text.match(artIdRe) || [];
    const candidateIds = new Set([...idsInFile, ...verifiedSet, ...HISTORICAL_ONLY_IDS]);

    for (const hist of HISTORICAL_ONLY_IDS) {
      if (!text.includes(hist)) continue;
      const denies =
        /not part of the public|historical report|not.*VERIFIED|historical-only|not served from the static/i.test(
          text,
        );
      const promotions = findVerifiedPromotions(text, [hist]);
      if (promotions.has(hist) && !denies) {
        errors.push(
          `${rel(repoRoot, file)}: historical ${hist} promoted as VERIFIED (not in Living Evidence Manifest public set)`,
        );
      }
    }

    const promotions = findVerifiedPromotions(text, [...candidateIds]);
    for (const id of promotions) {
      if (verifiedSet.has(id)) continue;
      const denyNear =
        new RegExp(
          `${escapeReg(id)}[\\s\\S]{0,200}?(?:not part of the public|historical|not.*manifest VERIFIED|UNAVAILABLE)`,
          "i",
        ).test(text) ||
        new RegExp(
          `(?:historical|not part of the public)[\\s\\S]{0,200}?${escapeReg(id)}`,
          "i",
        ).test(text);
      if (!denyNear) {
        errors.push(
          `${rel(repoRoot, file)}: promotes ${id} as VERIFIED but Living Evidence Manifest does not`,
        );
      }
    }
  }
}

function runGate(repoRoot) {
  const manifestPath = join(repoRoot, "docs/evidence/EVIDENCE_MANIFEST.json");
  const errors = [];
  const manifest = loadManifest(manifestPath);
  const { byId, errors: indexErrors } = indexClaims(manifest);
  errors.push(...indexErrors);

  const verified = new Set(verifiedIds(byId));
  if (verified.size === 0) {
    errors.push("Manifest has zero VERIFIED claims — unexpected for public surface");
  }

  for (const required of ["ART-L7-REPLAY-001", "ART-L7-REJECT-001", "ART-L7-PARITY-001"]) {
    if (!verified.has(required)) {
      errors.push(`Required public VERIFIED capsule missing from manifest: ${required}`);
    }
  }

  const p2 = byId.get("ART-L7-PARITY-002");
  if (p2 && p2.status === "VERIFIED") {
    errors.push("ART-L7-PARITY-002 must not be VERIFIED in Living Evidence Manifest (historical only)");
  }

  validateArtifacts(repoRoot, byId, errors);
  validatePublicSurfaces(repoRoot, verified, errors);

  return { errors, verified: [...verified] };
}

function selfTest() {
  const base = mkdtempSync(join(tmpdir(), "ri-evidence-gate-"));
  const results = [];

  function write(path, content) {
    const full = join(base, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }

  function minimalCapsule(id) {
    return JSON.stringify({ artifactId: id, expected: { receipt_hash: "abc" }, scope: "test" }, null, 2);
  }

  function minimalManifest(claims) {
    return JSON.stringify({ manifestVersion: "1.0.0", claims }, null, 2);
  }

  const three = [
    { id: "ART-L7-REPLAY-001", status: "VERIFIED", artifact: "/evidence/artifacts/ART-L7-REPLAY-001.json" },
    { id: "ART-L7-REJECT-001", status: "VERIFIED", artifact: "/evidence/artifacts/ART-L7-REJECT-001.json" },
    { id: "ART-L7-PARITY-001", status: "VERIFIED", artifact: "/evidence/artifacts/ART-L7-PARITY-001.json" },
  ];

  {
    const root = join(base, "pass");
    write("pass/docs/evidence/EVIDENCE_MANIFEST.json", minimalManifest(three));
    for (const id of ["ART-L7-REPLAY-001", "ART-L7-REJECT-001", "ART-L7-PARITY-001"]) {
      write(`pass/non-kernel/frontend/public/evidence/artifacts/${id}.json`, minimalCapsule(id));
    }
    write(
      "pass/non-kernel/frontend/app/verify/page.tsx",
      'const id = "ART-L7-REPLAY-001"; <StatusBadge status="VERIFIED" />',
    );
    write("pass/README.md", "# ok\n");
    const { errors } = runGate(root);
    results.push({ name: "PASS current three VERIFIED", ok: errors.length === 0, errors });
  }

  {
    const root = join(base, "fake");
    write("fake/docs/evidence/EVIDENCE_MANIFEST.json", minimalManifest(three));
    for (const id of ["ART-L7-REPLAY-001", "ART-L7-REJECT-001", "ART-L7-PARITY-001"]) {
      write(`fake/non-kernel/frontend/public/evidence/artifacts/${id}.json`, minimalCapsule(id));
    }
    write(
      "fake/non-kernel/frontend/app/verify/page.tsx",
      '<h3>ART-L7-PARITY-002</h3><StatusBadge status="VERIFIED" />',
    );
    const { errors } = runGate(root);
    const hit = errors.some((e) => e.includes("PARITY-002") && e.includes("VERIFIED"));
    results.push({ name: "FAIL verify promotes PARITY-002", ok: hit, errors });
  }

  {
    const root = join(base, "missing");
    write("missing/docs/evidence/EVIDENCE_MANIFEST.json", minimalManifest(three));
    write(
      "missing/non-kernel/frontend/public/evidence/artifacts/ART-L7-REPLAY-001.json",
      minimalCapsule("ART-L7-REPLAY-001"),
    );
    write(
      "missing/non-kernel/frontend/public/evidence/artifacts/ART-L7-REJECT-001.json",
      minimalCapsule("ART-L7-REJECT-001"),
    );
    const { errors } = runGate(root);
    const hit = errors.some((e) => e.includes("PARITY-001") && e.includes("missing public"));
    results.push({ name: "FAIL missing public JSON", ok: hit, errors });
  }

  {
    const root = join(base, "badstatus");
    write(
      "badstatus/docs/evidence/EVIDENCE_MANIFEST.json",
      minimalManifest([
        { id: "ART-L7-REPLAY-001", status: "PROVEN", artifact: "/evidence/artifacts/ART-L7-REPLAY-001.json" },
        { id: "ART-L7-REJECT-001", status: "VERIFIED", artifact: "/evidence/artifacts/ART-L7-REJECT-001.json" },
        { id: "ART-L7-PARITY-001", status: "VERIFIED", artifact: "/evidence/artifacts/ART-L7-PARITY-001.json" },
      ]),
    );
    for (const id of ["ART-L7-REPLAY-001", "ART-L7-REJECT-001", "ART-L7-PARITY-001"]) {
      write(`badstatus/non-kernel/frontend/public/evidence/artifacts/${id}.json`, minimalCapsule(id));
    }
    const { errors } = runGate(root);
    const hit = errors.some((e) => e.includes("Invalid status") || e.includes("Required public"));
    results.push({ name: "FAIL invalid status vocabulary", ok: hit, errors });
  }

  {
    const root = join(base, "dup");
    write(
      "dup/docs/evidence/EVIDENCE_MANIFEST.json",
      minimalManifest([
        ...three,
        { id: "ART-L7-REPLAY-001", status: "VERIFIED", artifact: "/evidence/artifacts/ART-L7-REPLAY-001.json" },
      ]),
    );
    for (const id of ["ART-L7-REPLAY-001", "ART-L7-REJECT-001", "ART-L7-PARITY-001"]) {
      write(`dup/non-kernel/frontend/public/evidence/artifacts/${id}.json`, minimalCapsule(id));
    }
    const { errors } = runGate(root);
    const hit = errors.some((e) => e.includes("Duplicate"));
    results.push({ name: "FAIL duplicate ID", ok: hit, errors });
  }

  rmSync(base, { recursive: true, force: true });

  let failed = 0;
  for (const r of results) {
    if (r.ok) console.log(`SELF-TEST PASS  ${r.name}`);
    else {
      failed += 1;
      console.error(`SELF-TEST FAIL  ${r.name}`);
      for (const e of r.errors.slice(0, 8)) console.error(`  - ${e}`);
    }
  }
  if (failed) {
    console.error(`Evidence boundary self-test failed: ${failed}/${results.length}`);
    process.exit(1);
  }
  console.log(`Evidence boundary self-test OK — ${results.length} cases`);
}

const selfTestMode = process.argv.includes("--self-test");
if (selfTestMode) {
  selfTest();
} else {
  const { errors, verified } = runGate(repoRoot);
  if (errors.length) {
    console.error("Evidence boundary FAILED");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(
    `Evidence boundary OK — Living Evidence Manifest VERIFIED set: ${verified.sort().join(", ")}`,
  );
}
