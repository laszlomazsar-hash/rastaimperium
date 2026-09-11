"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { proofs } from "../../data/evidence/manifest";
import type { VerificationStatus } from "../../data/evidence/types";
import {
  StatusBadge,
  EvidenceChain,
  ReproduceOffline,
  TrustRail,
  TrustLadder,
  EvidenceGraph,
  VerificationReceipt,
  type EvidenceStatus,
} from "@/components/design-system";
import { listReceipts } from "@/data/evidence/receipts";

const STATUS_FILTERS: Array<VerificationStatus | "all"> = [
  "all",
  "VERIFIED",
  "DEMONSTRATION",
  "UNAVAILABLE",
];

function toEvidenceStatus(s: VerificationStatus): EvidenceStatus {
  if (s === "VERIFIED") return "VERIFIED";
  if (s === "DEMONSTRATION") return "DEMONSTRATION";
  if (s === "UNAVAILABLE") return "UNAVAILABLE";
  return "UNAVAILABLE";
}

function claimText(p: (typeof proofs)[number]): string {
  if (p.notes?.includes("Capsule-scoped"))
    return p.description + " " + (p.notes || "");
  return p.description;
}

function evidenceText(p: (typeof proofs)[number]): string {
  if (p.artifactId) {
    return `Sealed public capsule ${p.artifactId}${p.hash ? ` · hash ${p.hash.slice(0, 16)}…` : ""}. Source: ${p.source}.`;
  }
  return `Source: ${p.source}. ${p.inputFixture ? `Fixture: ${p.inputFixture}.` : ""}`;
}

function verificationText(p: (typeof proofs)[number]): string {
  const parts = [p.verificationMethod];
  if (p.observedOutcome) parts.push(`Observed: ${p.observedOutcome}`);
  if (p.expectedOutcome) parts.push(`Expected: ${p.expectedOutcome}`);
  return parts.filter(Boolean).join(" · ");
}

function reproductionText(p: (typeof proofs)[number]): string {
  if (p.replayAvailable) {
    return `${p.verificationMethod} — offline, no network required, no mutation of the artifact.`;
  }
  return "Reproduction not available as a sealed capsule on this surface. Inspect documentation source.";
}

function limitationsText(p: (typeof proofs)[number]): string {
  if (p.notes) return p.notes;
  if (p.status === "VERIFIED")
    return "Capsule-scoped only. Does not establish production LIVE telemetry or full-kernel parity.";
  if (p.status === "DEMONSTRATION")
    return "Design / documentation demonstration. Not production evidence.";
  return "No sealed public artifact is attached. Claim is not made on this surface.";
}

export default function ProofRegistryPage() {
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (status === "all") return proofs;
    return proofs.filter((p) => p.status === status);
  }, [status]);

  const counts = useMemo(() => {
    const c = { all: proofs.length, VERIFIED: 0, DEMONSTRATION: 0, UNAVAILABLE: 0 };
    for (const p of proofs) {
      if (p.status === "VERIFIED") c.VERIFIED++;
      else if (p.status === "DEMONSTRATION") c.DEMONSTRATION++;
      else if (p.status === "UNAVAILABLE") c.UNAVAILABLE++;
    }
    return c;
  }, []);

  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[rgba(242,214,117,0.18)]">
        <div className="container-page py-14 sm:py-16 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Public record
          </p>
          <h1 className="mt-3 font-cinzel text-4xl text-zinc-100 sm:text-5xl">
            Evidence Observatory
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Inspect the public evidence behind the system. This registry is a presentation of the
            Living Evidence Manifest — not a second source of truth.
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-800/35 bg-emerald-950/15 p-4">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">VERIFIED</dt>
              <dd className="mt-1 text-sm text-zinc-300">
                Sealed capsule with independent pure-verifier reproduction.
              </dd>
            </div>
            <div className="rounded-lg border border-amber-900/35 bg-amber-950/10 p-4">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-amber-200">DEMONSTRATION</dt>
              <dd className="mt-1 text-sm text-zinc-300">
                Design or documentation surface. Not production evidence.
              </dd>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-black/20 p-4">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">UNAVAILABLE</dt>
              <dd className="mt-1 text-sm text-zinc-300">
                No sealed public artifact. Claim is not made on this surface.
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <TrustRail />
          </div>
          <div className="mt-4">
            <TrustLadder variant="compact" current="proof" />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-[#0b0c0b]/40">
        <div className="container-page py-6">
          <div role="tablist" aria-label="Filter by evidence status" className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((s) => {
              const active = status === s;
              const label = s === "all" ? "All" : s;
              const count =
                s === "all"
                  ? counts.all
                  : s === "VERIFIED"
                    ? counts.VERIFIED
                    : s === "DEMONSTRATION"
                      ? counts.DEMONSTRATION
                      : counts.UNAVAILABLE;
              return (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatus(s)}
                  className={`rounded-lg border px-3 py-2 font-mono text-xs uppercase tracking-wider transition ${
                    active
                      ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#F2D675]"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {label}
                  <span className="ml-2 text-zinc-500">{count}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-xs text-zinc-500">
            Showing {filtered.length} of {proofs.length} records
          </p>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <ul className="space-y-6">
          {filtered.map((p) => {
            const es = toEvidenceStatus(p.status);
            const isOpen = expanded === p.proofId;
            return (
              <li key={p.proofId} id={p.proofId}>
                <article className="rounded-xl border border-[rgba(242,214,117,0.2)] bg-[rgba(15,18,13,0.92)]">
                  <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(242,214,117,0.1)] px-4 py-4 sm:px-5">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-semibold text-[#f2d675]">
                        {p.artifactId ?? p.proofId}
                      </p>
                      <h2 className="mt-1 text-base text-zinc-100 sm:text-lg">{p.title}</h2>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                        {p.proofType.replace(/_/g, " ")}
                        {p.invariant ? ` · ${p.invariant}` : ""}
                        {p.engineVersion ? ` · ${p.engineVersion}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={es} />
                      {p.notes?.toUpperCase().includes("FROZEN") && <StatusBadge status="FROZEN" />}
                      {p.provenance === "HISTORICAL" && <StatusBadge status="HISTORICAL" />}
                    </div>
                  </header>

                  <div className="px-4 py-4 sm:px-5">
                    <p className="text-sm leading-6 text-zinc-300">{p.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : p.proofId)}
                        className="text-[#F2D675] hover:underline"
                        aria-expanded={isOpen}
                      >
                        {isOpen ? "Collapse chain" : "Inspect chain →"}
                      </button>
                      {p.replayAvailable && (
                        <Link href="/verify/" className="text-zinc-400 hover:text-[#F2D675]">
                          Verify →
                        </Link>
                      )}
                      {p.artifactId && p.status === "VERIFIED" && (
                        <Link
                          href={`#receipt-${p.artifactId}`}
                          className="text-zinc-400 hover:text-[#F2D675]"
                        >
                          Receipt →
                        </Link>
                      )}
                      {p.replayAvailable && (
                        <Link href="/audit/" className="text-zinc-400 hover:text-[#F2D675]">
                          Reproduce offline →
                        </Link>
                      )}
                      {p.source.startsWith("/") && (
                        <a href={p.source} className="text-zinc-500 hover:text-zinc-300" target="_blank" rel="noreferrer">
                          View capsule →
                        </a>
                      )}
                      <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
                        Limitations →
                      </Link>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-[rgba(242,214,117,0.1)] px-4 py-4 sm:px-5">
                      <EvidenceChain
                        artifactId={p.artifactId ?? p.proofId}
                        status={es}
                        claim={claimText(p)}
                        evidence={evidenceText(p)}
                        verification={verificationText(p)}
                        reproduction={reproductionText(p)}
                        limitations={limitationsText(p)}
                      />
                      {p.hash && (
                        <p className="mt-4 break-all font-mono text-[11px] text-zinc-500">
                          Hash: {p.hash}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-500">No records match this filter.</p>
        )}
      </section>

      <section className="border-t border-[rgba(242,214,117,0.18)]">
        <div className="container-page py-12 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Assurance records
          </p>
          <h2 className="mt-3 font-cinzel text-2xl text-zinc-100 sm:text-3xl">
            Verification Receipts
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Public receipts for the sealed L7 capsules. The UI is not the authority — inspect the
            sealed artifact and pure verifier.
          </p>
          <div className="mt-8 space-y-8">
            {listReceipts().map((receipt) => (
              <div key={receipt.artifactId} id={`receipt-${receipt.artifactId}`} className="space-y-4">
                <EvidenceGraph
                  artifactId={receipt.artifactId}
                  claimStatement={
                    receipt.invariantDescription
                      ? `Claim for ${receipt.artifactId}: ${receipt.invariantDescription}`
                      : undefined
                  }
                />
                <VerificationReceipt data={receipt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-900 bg-[#0b0c0b]/30">
        <div className="container-page py-12">
          <ReproduceOffline />
        </div>
      </section>

      <section className="border-t border-zinc-900">
        <div className="container-page py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Authoritative source
          </p>
          <h2 className="mt-2 font-cinzel text-xl text-zinc-100">Living Evidence Manifest</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            This page is a human-readable presentation. The machine-readable manifest and frozen
            capsules remain the source of truth.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <a
              href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/EVIDENCE_MANIFEST.md"
              target="_blank"
              rel="noreferrer"
              className="text-[#F2D675] hover:underline"
            >
              Human-readable manifest →
            </a>
            <a
              href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/EVIDENCE_MANIFEST.json"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-[#F2D675]"
            >
              Raw JSON →
            </a>
            <Link href="/audit/" className="text-zinc-400 hover:text-[#F2D675]">
              Auditor handoff →
            </Link>
            <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
              Full limitations →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
