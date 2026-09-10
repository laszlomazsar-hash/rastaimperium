"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { proofs } from "@/data/evidence/manifest";
import type { VerificationStatus } from "@/data/evidence/types";
import { StatusBadge, type EvidenceStatus } from "@/components/design-system";

const STATUS_FILTERS: Array<VerificationStatus | "all"> = [
  "all",
  "VERIFIED",
  "DEMONSTRATION",
  "UNAVAILABLE",
];

function toEvidenceStatus(s: VerificationStatus): EvidenceStatus {
  if (s === "VERIFIED") return "VERIFIED";
  if (s === "DEMONSTRATION") return "DEMONSTRATION";
  return "UNAVAILABLE";
}

export default function ObservatoryRegistry() {
  const [status, setStatus] = useState<VerificationStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { all: proofs.length, VERIFIED: 0, DEMONSTRATION: 0, UNAVAILABLE: 0 };
    for (const p of proofs) {
      if (p.status === "VERIFIED") c.VERIFIED++;
      else if (p.status === "DEMONSTRATION") c.DEMONSTRATION++;
      else c.UNAVAILABLE++;
    }
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return proofs.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      const hay = [p.proofId, p.artifactId, p.title, p.description, p.invariant, p.notes, p.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [status, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
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
        <label className="block w-full sm:max-w-xs">
          <span className="sr-only">Search evidence metadata</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by ID, claim, invariant…"
            className="w-full rounded-md border border-zinc-700 bg-[#090a09] px-3 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-[#F2D675]"
          />
        </label>
      </div>
      <p className="mt-3 font-mono text-xs text-zinc-500">
        Showing {filtered.length} of {proofs.length} records · authoritative frontend evidence
        manifest
      </p>

      <ul className="mt-8 space-y-5">
        {filtered.length === 0 && (
          <li className="rounded-xl border border-zinc-800 px-4 py-8 text-center text-sm text-zinc-400">
            No matching evidence found.
          </li>
        )}
        {filtered.map((p) => {
          const es = toEvidenceStatus(p.status);
          const id = p.artifactId ?? p.proofId;
          const isOpen = expanded === p.proofId;
          return (
            <li key={p.proofId} id={p.proofId}>
              <article className="rounded-xl border border-[rgba(242,214,117,0.2)] bg-[rgba(15,18,13,0.92)]">
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(242,214,117,0.1)] px-4 py-4 sm:px-5">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-[#f2d675]">{id}</p>
                    <h2 className="mt-1 text-base text-zinc-100 sm:text-lg">{p.title}</h2>
                  </div>
                  <StatusBadge status={es} />
                </header>

                <div className="space-y-3 px-4 py-4 text-sm leading-6 text-zinc-300 sm:px-5">
                  <p>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      Claim ·{" "}
                    </span>
                    {p.description}
                  </p>
                  {p.invariant && (
                    <p>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                        Invariant ·{" "}
                      </span>
                      {p.invariant}
                    </p>
                  )}
                  <p>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      Scope ·{" "}
                    </span>
                    {p.notes || (p.status === "VERIFIED" ? "Capsule-scoped only" : p.source)}
                  </p>
                </div>

                <div className="border-t border-zinc-900 px-4 py-3 sm:px-5">
                  <button
                    type="button"
                    className="font-mono text-xs uppercase tracking-wider text-[#F2D675]"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : p.proofId)}
                  >
                    {isOpen ? "Hide inspection −" : "Inspect record +"}
                  </button>
                  {isOpen && (
                    <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
                      <p>
                        <span className="text-zinc-500">Evidence · </span>
                        {p.artifactId
                          ? `Sealed capsule ${p.artifactId}${p.hash ? ` · ${p.hash.slice(0, 16)}…` : ""}`
                          : `Source: ${p.source}`}
                      </p>
                      <p>
                        <span className="text-zinc-500">Verification · </span>
                        {p.verificationMethod}
                        {p.observedOutcome ? ` · Observed: ${p.observedOutcome}` : ""}
                      </p>
                      <p>
                        <span className="text-zinc-500">Reproduction · </span>
                        {p.replayAvailable
                          ? "Offline pure verifiers available — no network, no mutation of the artifact."
                          : "No sealed capsule reproduction on this surface."}
                      </p>
                      <p>
                        <span className="text-zinc-500">Limitations · </span>
                        {p.notes ||
                          (p.status === "VERIFIED"
                            ? "Does not establish LIVE telemetry, full-kernel parity, or certification."
                            : "Not production evidence.")}
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        {p.replayAvailable && (
                          <Link href="/verify/" className="text-[#F2D675] hover:underline">
                            Verify this evidence →
                          </Link>
                        )}
                        {p.artifactId && (
                          <a
                            href={p.source.startsWith("/") ? p.source : `/${p.source}`}
                            className="text-zinc-400 hover:text-[#F2D675]"
                          >
                            Download JSON
                          </a>
                        )}
                        <Link href="/challenge/" className="text-zinc-400 hover:text-[#F2D675]">
                          Challenge Lab
                        </Link>
                        <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
                          Limitations
                        </Link>
                        <Link href="/evaluate/" className="text-zinc-500 hover:text-zinc-300">
                          Evaluate
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
