"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { proofs } from "../../data/evidence/manifest";
import type { ProofType, VerificationStatus } from "../../data/evidence/types";
import { ProvenanceBadge, VerificationBadge } from "../../components/evidence/ProvenanceBadge";
import { TrustStatus } from "../../components/evidence/TrustStatus";

const proofTypes: Array<ProofType | "all"> = [
  "all",
  "deterministic_replay",
  "receipt_verification",
  "chain_integrity",
  "lifecycle_transition",
  "illegal_transition_rejection",
  "invariant_enforcement",
  "cross_implementation_parity",
  "adversarial_rejection",
  "governance_decision",
  "transparency_verification",
];

const statuses: Array<VerificationStatus | "all"> = [
  "all",
  "VERIFIED",
  "DEMONSTRATION",
  "TARGET",
  "HISTORICAL",
  "UNAVAILABLE",
  "PENDING",
];

export default function ProofRegistryPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof proofTypes)[number]>("all");
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");
  const [invariant, setInvariant] = useState("");
  const [implementation, setImplementation] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return proofs.filter((p) => {
      if (type !== "all" && p.proofType !== type) return false;
      if (status !== "all" && p.status !== status) return false;
      if (invariant && !(p.invariant ?? "").toLowerCase().includes(invariant.toLowerCase()))
        return false;
      if (
        implementation &&
        !(p.implementation ?? "").toLowerCase().includes(implementation.toLowerCase())
      )
        return false;
      if (!query) return true;
      const hay = [p.proofId, p.title, p.description, p.invariant, p.source, p.relatedClaim]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [q, type, status, invariant, implementation]);

  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Public proof library
          </p>
          <h1 className="mt-4 font-cinzel text-4xl text-zinc-100 sm:text-5xl">Proof Registry</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Structured proof records. Filter by type, status, invariant, and implementation. No
            fabricated production hashes — unavailable evidence is labelled as such.
          </p>
          <div className="mt-6">
            <TrustStatus compact />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/governance-model/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
            >
              Governance model
            </Link>
            <Link
              href="/pillars/"
              className="rounded-lg border border-[#B8860B]/50 px-4 py-2.5 text-sm font-semibold text-[#F2D675]"
            >
              Pillars
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm font-semibold text-zinc-200"
            >
              Limitations
            </Link>
            <Link
              href="/challenge/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm font-semibold text-zinc-200"
            >
              Challenge Lab
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="royal-panel grid gap-3 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block text-xs text-zinc-500 lg:col-span-2">
            Search
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="proofId, title, invariant…"
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="block text-xs text-zinc-500">
            Proof type
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            >
              {proofTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-zinc-500">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-zinc-500">
            Invariant contains
            <input
              value={invariant}
              onChange={(e) => setInvariant(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="block text-xs text-zinc-500 sm:col-span-2 lg:col-span-2">
            Implementation contains
            <input
              value={implementation}
              onChange={(e) => setImplementation(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
        </div>

        <p className="mt-4 font-mono text-xs text-zinc-500">
          {filtered.length} of {proofs.length} proofs
        </p>

        <ul className="mt-6 space-y-4">
          {filtered.map((p) => (
            <li key={p.proofId} id={p.proofId}>
              <article className="royal-panel rounded-xl border p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] text-zinc-500">{p.proofId}</p>
                    <h2 className="mt-1 text-lg text-zinc-100">{p.title}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <VerificationBadge status={p.status} />
                    <ProvenanceBadge kind={p.provenance} />
                    <span className="rounded border border-zinc-700 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                      {p.proofType}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{p.description}</p>
                <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                  {p.invariant && (
                    <div>
                      <dt className="text-zinc-500">Invariant</dt>
                      <dd className="font-mono text-zinc-300">{p.invariant}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-zinc-500">Verification method</dt>
                    <dd className="text-zinc-300">{p.verificationMethod}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Source</dt>
                    <dd className="text-zinc-300">{p.source}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Replay available</dt>
                    <dd className="font-mono text-zinc-300">{p.replayAvailable ? "yes" : "no"}</dd>
                  </div>
                  {p.expectedOutcome && (
                    <div className="sm:col-span-2">
                      <dt className="text-zinc-500">Expected</dt>
                      <dd className="text-zinc-300">{p.expectedOutcome}</dd>
                    </div>
                  )}
                  {p.observedOutcome && (
                    <div className="sm:col-span-2">
                      <dt className="text-zinc-500">Observed</dt>
                      <dd className="text-zinc-300">{p.observedOutcome}</dd>
                    </div>
                  )}
                  {p.hash && (
                    <div>
                      <dt className="text-zinc-500">Hash</dt>
                      <dd className="font-mono text-zinc-300">{p.hash}</dd>
                    </div>
                  )}
                  {p.artifactId && (
                    <div>
                      <dt className="text-zinc-500">Artifact</dt>
                      <dd className="font-mono text-zinc-300">{p.artifactId}</dd>
                    </div>
                  )}
                </dl>
                {p.notes && <p className="mt-3 text-xs text-zinc-500">{p.notes}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.relatedClaim && (
                    <Link
                      href={`/evidence`}
                      className="text-xs text-[#F2D675] hover:underline"
                    >
                      Related claim {p.relatedClaim}
                    </Link>
                  )}
                  <Link href="/challenge" className="text-xs text-zinc-400 hover:text-zinc-200">
                    Challenge related invariants →
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page border-t border-zinc-900 py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">Evidence inspected. Ready for the next step?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            After reviewing sealed capsules and explicit Limitations, map a fixed-scope subset onto
            your stack under written success criteria.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/product/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Product pathway
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Design partner pilots
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Limitations first
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
