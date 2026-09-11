/**
 * EvidenceGraph — Navigable Claim → Evidence → Artifact → Invariant → Verifier → Result chain.
 * Presentation only. All relationships derived from the Living Evidence Manifest
 * and sealed public capsules. Missing relationships render "Not established".
 *
 * Phase 22 Steps 4–5.
 */
"use client";

import React, { useState, useCallback } from "react";
import { StatusBadge, type EvidenceStatus } from "./StatusBadge";
import {
  VerificationReceipt,
  type VerificationReceiptData,
} from "./VerificationReceipt";
import { getReceipt } from "@/data/evidence/receipts";

export type GraphNodeKind =
  | "claim"
  | "evidence"
  | "artifact"
  | "invariant"
  | "verifier"
  | "result";

export interface GraphNode {
  kind: GraphNodeKind;
  id: string;
  title: string;
  status: EvidenceStatus;
  description?: string;
  hash?: string;
  path?: string;
  childrenIds?: string[];
}

export type EvidenceGraphProps = {
  /** Primary artifact that anchors the graph (one of the three L7 capsules). */
  artifactId: string;
  /** Optional claim statement for the top of the chain. */
  claimStatement?: string;
  /** Optional evidence description. */
  evidenceDescription?: string;
  /** Compact mode for side panels. */
  compact?: boolean;
  className?: string;
};

const NODE_ORDER: GraphNodeKind[] = [
  "claim",
  "evidence",
  "artifact",
  "invariant",
  "verifier",
  "result",
];

const KIND_LABEL: Record<GraphNodeKind, string> = {
  claim: "Claim",
  evidence: "Evidence",
  artifact: "Artifact",
  invariant: "Invariant",
  verifier: "Verifier",
  result: "Result",
};

export function EvidenceGraph({
  artifactId,
  claimStatement,
  evidenceDescription,
  compact = false,
  className = "",
}: EvidenceGraphProps) {
  const receipt = getReceipt(artifactId);
  const [selected, setSelected] = useState<GraphNodeKind>("artifact");

  const handleSelect = useCallback((kind: GraphNodeKind) => {
    setSelected(kind);
  }, []);

  if (!receipt) {
    return (
      <div
        className={`rounded-xl border border-[rgba(92,99,88,0.45)] bg-[rgba(19,23,16,0.94)] px-4 py-5 ${className}`}
        role="status"
      >
        <p className="font-mono text-xs text-zinc-400">
          No public receipt established for{" "}
          <span className="text-zinc-300">{artifactId}</span>.
        </p>
      </div>
    );
  }

  const nodes: Record<GraphNodeKind, GraphNode> = {
    claim: {
      kind: "claim",
      id: `claim-${artifactId}`,
      title: claimStatement ?? `Claim for ${artifactId}`,
      status: receipt.status,
      description: claimStatement,
    },
    evidence: {
      kind: "evidence",
      id: `evidence-${artifactId}`,
      title: evidenceDescription ?? "Sealed public evidence",
      status: receipt.status,
      description: evidenceDescription,
    },
    artifact: {
      kind: "artifact",
      id: artifactId,
      title: artifactId,
      status: receipt.status,
      hash: receipt.artifactHash,
      path: receipt.artifactPath,
    },
    invariant: {
      kind: "invariant",
      id: receipt.invariantId ?? "not-established",
      title: receipt.invariantId ?? "Not established",
      status: receipt.status,
      description: receipt.invariantDescription,
    },
    verifier: {
      kind: "verifier",
      id: `verifier-${artifactId}`,
      title: receipt.verifier?.implementation ?? "Not established",
      status: receipt.status,
      description: receipt.verifier?.path,
    },
    result: {
      kind: "result",
      id: `result-${artifactId}`,
      title: receipt.status,
      status: receipt.status,
      description: "See Verification Receipt for full detail.",
    },
  };

  return (
    <section
      className={`rounded-xl border border-[rgba(242,214,117,0.24)] bg-[rgba(19,23,16,0.94)] ${className}`}
      aria-label={`Evidence graph for ${artifactId}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(242,214,117,0.12)] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-[#f2d675]">{artifactId}</span>
          <StatusBadge status={receipt.status} />
          {receipt.modifiers?.map((m) => (
            <StatusBadge key={m} status={m} />
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          Evidence graph
        </span>
      </header>

      <div
        className={`grid gap-0 ${
          compact
            ? ""
            : "lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]"
        }`}
      >
        {/* Vertical chain */}
        <ol className="divide-y divide-[rgba(242,214,117,0.08)]">
          {NODE_ORDER.map((kind, i) => {
            const node = nodes[kind];
            const isSelected = selected === kind;
            return (
              <li key={kind}>
                <button
                  type="button"
                  onClick={() => handleSelect(kind)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(kind);
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={`${KIND_LABEL[kind]}: ${node.title}`}
                  className={`flex w-full gap-3 px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#d4af37] sm:gap-4 sm:px-5 sm:py-3.5 ${
                    isSelected
                      ? "bg-[rgba(242,214,117,0.06)]"
                      : "hover:bg-[rgba(242,214,117,0.03)]"
                  }`}
                >
                  <div className="flex w-6 shrink-0 flex-col items-center">
                    <span className="font-mono text-[10px] text-zinc-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {i < NODE_ORDER.length - 1 && (
                      <span
                        className="mt-1 h-full w-px bg-[rgba(242,214,117,0.15)]"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">
                      {KIND_LABEL[kind]}
                    </p>
                    <p
                      className={`mt-1 text-sm leading-6 text-zinc-300 ${
                        compact ? "line-clamp-2" : ""
                      }`}
                    >
                      {node.title}
                    </p>
                    {node.hash && !compact && (
                      <p className="mt-1 font-mono text-[10px] break-all text-zinc-500">
                        {node.hash.slice(0, 24)}…
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Inspection panel → Verification Receipt */}
        {!compact && (
          <div className="border-t border-[rgba(242,214,117,0.12)] p-4 lg:border-l lg:border-t-0 lg:p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Inspection · {KIND_LABEL[selected]}
            </p>
            {selected === "result" || selected === "artifact" ? (
              <VerificationReceipt data={receipt} compact />
            ) : (
              <div className="space-y-3 text-sm text-zinc-300">
                <p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4af37]">
                    {KIND_LABEL[selected]}
                  </span>
                </p>
                <p className="leading-6">{nodes[selected].title}</p>
                {nodes[selected].description && (
                  <p className="text-zinc-400 leading-6">
                    {nodes[selected].description}
                  </p>
                )}
                <p className="pt-2 font-mono text-[10px] text-zinc-500">
                  Select Artifact or Result to open the Verification Receipt.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Always-visible authority notice */}
      <footer className="border-t border-[rgba(242,214,117,0.08)] px-4 py-2.5 sm:px-5">
        <p className="font-mono text-[10px] leading-5 text-zinc-500">
          The UI is not the authority. Follow the chain to the sealed artifact
          and pure verifier.
        </p>
      </footer>
    </section>
  );
}
