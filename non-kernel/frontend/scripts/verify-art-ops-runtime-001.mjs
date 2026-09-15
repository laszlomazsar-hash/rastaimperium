#!/usr/bin/env node
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT = join(__dirname, "../../../docs/evidence/artifacts/ART-OPS-RUNTIME-REF-001.json");
const SCHEMA = "ri-ops-event-0.1.0", PRODUCER = "ri-ops-runtime-v1", ALLOWED = new Set(["OPS_HEARTBEAT"]);
function canonicalize(value) {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") { if (!Number.isFinite(value)) throw new Error("rejectNonFiniteNumbers"); return JSON.stringify(value); }
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (typeof value === "object") { const keys = Object.keys(value).sort(); return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`).join(",")}}`; }
  throw new Error(`unsupported type ${typeof value}`);
}
function sha256Hex(input) { return createHash("sha256").update(input, "utf8").digest("hex"); }
function fail(code, detail) { return { result: "FAIL", reason: code, detail: detail || null }; }
function publicPayload(record) {
  return { schemaVersion: record.schemaVersion, artifactId: record.artifactId ?? null, invariantId: record.invariantId, eventId: record.eventId, producerId: record.producerId, producerVersion: record.producerVersion, eventType: record.eventType, observedAt: record.observedAt, sequence: record.sequence, scope: record.scope, environment: record.environment, payload: record.payload, limitations: record.limitations, productionAuthority: record.productionAuthority, status: record.status };
}
export function verifyRecord(record) {
  if (record === null || typeof record !== "object" || Array.isArray(record)) return fail("MALFORMED", "record must be object");
  for (const k of ["schemaVersion","invariantId","eventId","producerId","producerVersion","eventType","observedAt","sequence","scope","environment","payload","limitations","productionAuthority","status","integrity"]) if (!(k in record)) return fail("MALFORMED", `missing ${k}`);
  if (record.schemaVersion !== SCHEMA) return fail("MALFORMED", "schemaVersion");
  if (typeof record.eventId !== "string" || !record.eventId) return fail("MALFORMED", "eventId");
  if (record.producerId !== PRODUCER) return fail("MALFORMED", "producerId");
  if (!ALLOWED.has(record.eventType)) return fail("UNKNOWN_EVENT_TYPE", record.eventType);
  if (typeof record.observedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(record.observedAt)) return fail("MALFORMED", "observedAt");
  if (typeof record.sequence !== "number" || !Number.isFinite(record.sequence) || record.sequence < 1) return fail("SEQUENCE_ANOMALY", "sequence");
  if (record.productionAuthority !== false) return fail("MALFORMED", "productionAuthority must be false");
  const integ = record.integrity;
  if (!integ || typeof integ !== "object" || integ.algorithm !== "sha256") return fail("MALFORMED", "integrity");
  if (typeof integ.digest !== "string" || !/^[0-9a-f]{64}$/.test(integ.digest)) return fail("MALFORMED", "integrity.digest");
  let computed; try { computed = sha256Hex(canonicalize(publicPayload(record))); } catch (e) { return fail("MALFORMED", String(e.message || e)); }
  if (computed !== integ.digest) return fail("INTEGRITY_FAILURE", { expected: integ.digest, computed });
  return { result: "PASS", reason: "INVARIANT_HOLD", invariantId: "INV-OPS-001", producerId: record.producerId, eventId: record.eventId, digest: computed };
}
const path = process.argv[2] || DEFAULT;
let record; try { record = JSON.parse(readFileSync(path, "utf8")); } catch (e) { console.error(JSON.stringify({ result: "FAIL", reason: "MALFORMED", detail: String(e) })); process.exit(1); }
const out = verifyRecord(record); console.log(JSON.stringify(out, null, 2)); process.exit(out.result === "PASS" ? 0 : 1);
