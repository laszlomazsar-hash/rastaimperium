import type { ProvenanceKind, VerificationStatus } from "../../data/evidence/types";

const provenanceStyles: Record<ProvenanceKind, string> = {
  LIVE: "border-emerald-500/60 bg-emerald-950/50 text-emerald-200 font-bold",
  DEMONSTRATION: "border-amber-500/35 bg-amber-950/25 text-amber-200/90",
  HISTORICAL: "border-sky-500/35 bg-sky-950/25 text-sky-200/90",
  TARGET: "border-violet-500/35 bg-violet-950/25 text-violet-200/90",
  UNAVAILABLE: "border-zinc-700/60 bg-zinc-950/40 text-zinc-500 opacity-80",
};

const statusStyles: Record<VerificationStatus, string> = {
  VERIFIED: "border-emerald-500/60 bg-emerald-950/50 text-emerald-200 font-bold shadow-[0_0_12px_-4px_rgba(16,185,129,0.35)]",
  DEMONSTRATION: "border-amber-500/35 bg-amber-950/25 text-amber-200/90",
  TARGET: "border-violet-500/35 bg-violet-950/25 text-violet-200/90",
  HISTORICAL: "border-sky-500/35 bg-sky-950/25 text-sky-200/90",
  UNAVAILABLE: "border-zinc-700/60 bg-zinc-950/40 text-zinc-500 opacity-80",
  PENDING: "border-zinc-600/50 bg-zinc-950/30 text-zinc-500 opacity-75",
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
