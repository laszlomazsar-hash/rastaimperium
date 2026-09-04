import type { ProvenanceKind, VerificationStatus } from "../../data/evidence/types";

/**
 * Rasta Royal evidence badge system.
 * Semantic color vocabulary for claim provenance & verification status.
 * Monospace + tight tracking (0.14em) = classified / intelligence-brief aesthetic.
 */
const provenanceStyles: Record<ProvenanceKind, string> = {
  LIVE: "border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.12)]",
  DEMONSTRATION: "border-amber-500/40 bg-amber-950/30 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.08)]",
  HISTORICAL: "border-sky-500/40 bg-sky-950/30 text-sky-200",
  TARGET: "border-violet-500/40 bg-violet-950/30 text-violet-200",
  UNAVAILABLE: "border-zinc-600 bg-zinc-900/60 text-zinc-400",
};

const statusStyles: Record<VerificationStatus, string> = {
  VERIFIED: "border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.12)]",
  DEMONSTRATION: "border-amber-500/40 bg-amber-950/30 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.08)]",
  TARGET: "border-violet-500/40 bg-violet-950/30 text-violet-200",
  HISTORICAL: "border-sky-500/40 bg-sky-950/30 text-sky-200",
  UNAVAILABLE: "border-zinc-600 bg-zinc-900/60 text-zinc-400",
  PENDING: "border-zinc-500 bg-zinc-900/50 text-zinc-300",
};

const baseBadge =
  "inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-shadow duration-300";

export function ProvenanceBadge({
  kind,
  className = "",
}: {
  kind: ProvenanceKind;
  className?: string;
}) {
  return (
    <span
      className={`${baseBadge} ${provenanceStyles[kind]} ${className}`}
      title={`Provenance: ${kind}`}
    >
      {kind}
    </span>
  );
}

export function VerificationBadge({
  status,
  className = "",
}: {
  status: VerificationStatus;
  className?: string;
}) {
  return (
    <span
      className={`${baseBadge} ${statusStyles[status]} ${className}`}
      title={`Verification: ${status}`}
    >
      {status}
    </span>
  );
}
