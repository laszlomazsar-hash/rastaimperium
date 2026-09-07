/**
 * EvidenceChain — Claim → Evidence → Verification → Reproduction → Limitations
 * Presentation component. Does not invent or alter evidence.
 */
import React from "react";
import { StatusBadge, type EvidenceStatus } from "./StatusBadge";

export type EvidenceChainProps = {
  claim: string;
  evidence: string;
  verification: string;
  reproduction: string;
  limitations: string;
  status: EvidenceStatus;
  artifactId?: string;
  compact?: boolean;
  className?: string;
};

const STAGES = [
  { key: "claim", label: "Claim" },
  { key: "evidence", label: "Evidence" },
  { key: "verification", label: "Verification" },
  { key: "reproduction", label: "Reproduction" },
  { key: "limitations", label: "Limitations" },
] as const;

export function EvidenceChain({
  claim,
  evidence,
  verification,
  reproduction,
  limitations,
  status,
  artifactId,
  compact = false,
  className = "",
}: EvidenceChainProps) {
  const values = { claim, evidence, verification, reproduction, limitations };

  return (
    <article
      className={`rounded-xl border border-[rgba(242,214,117,0.24)] bg-[rgba(19,23,16,0.94)] ${className}`}
      aria-label={artifactId ? `Evidence chain for ${artifactId}` : "Evidence chain"}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(242,214,117,0.12)] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          {artifactId && (
            <span className="font-mono text-xs text-[#f2d675]">{artifactId}</span>
          )}
          <StatusBadge status={status} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          Evidence chain
        </span>
      </header>

      <ol className={`divide-y divide-[rgba(242,214,117,0.08)] ${compact ? "" : ""}`}>
        {STAGES.map((stage, i) => (
          <li key={stage.key} className="flex gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5">
            <div className="flex w-6 shrink-0 flex-col items-center">
              <span className="font-mono text-[10px] text-zinc-500">{String(i + 1).padStart(2, "0")}</span>
              {i < STAGES.length - 1 && (
                <span className="mt-1 h-full w-px bg-[rgba(242,214,117,0.15)]" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">
                {stage.label}
              </p>
              <p className={`mt-1 text-sm leading-6 text-zinc-300 ${compact ? "line-clamp-2" : ""}`}>
                {values[stage.key]}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
