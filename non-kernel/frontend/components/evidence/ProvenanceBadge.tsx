import type { ProvenanceKind, VerificationStatus } from "../../data/evidence/types";

const provenanceStyles: Record<ProvenanceKind, string> = {
  LIVE: "border-emerald-500/50 bg-emerald-950/40 text-emerald-300",
  DEMONSTRATION: "border-amber-500/40 bg-amber-950/30 text-amber-200",
  HISTORICAL: "border-sky-500/40 bg-sky-950/30 text-sky-200",
  TARGET: "border-violet-500/40 bg-violet-950/30 text-violet-200",
  UNAVAILABLE: "border-zinc-600 bg-zinc-900/60 text-zinc-400",
};

const statusStyles: Record<VerificationStatus, string> = {
  VERIFIED: "border-emerald-500/50 bg-emerald-950/40 text-emerald-300",
  DEMONSTRATION: "border-amber-500/40 bg-amber-950/30 text-amber-200",
  TARGET: "border-violet-500/40 bg-violet-950/30 text-violet-200",
  HISTORICAL: "border-sky-500/40 bg-sky-950/30 text-sky-200",
  UNAVAILABLE: "border-zinc-600 bg-zinc-900/60 text-zinc-400",
  PENDING: "border-zinc-500 bg-zinc-900/50 text-zinc-300",
};

export function ProvenanceBadge({
  kind,
  className = "",
}: {
  kind: ProvenanceKind;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${provenanceStyles[kind]} ${className}`}
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
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${statusStyles[status]} ${className}`}
      title={`Verification: ${status}`}
    >
      {status}
    </span>
  );
}
