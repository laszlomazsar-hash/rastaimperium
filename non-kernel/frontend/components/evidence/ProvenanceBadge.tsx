import type { ProvenanceKind, VerificationStatus } from "../../data/evidence/types";

/**
 * Evidence state badge system.
 * State is always explicit in text; the leading geometry is a secondary visual cue.
 * Do not use this component to imply evidence that is not present in the manifest.
 */
const provenanceStyles: Record<ProvenanceKind, string> = {
  LIVE: "ri-evidence-badge ri-evidence-badge--verified",
  DEMONSTRATION: "ri-evidence-badge ri-evidence-badge--caution",
  HISTORICAL: "ri-evidence-badge ri-evidence-badge--historical",
  TARGET: "ri-evidence-badge ri-evidence-badge--target",
  UNAVAILABLE: "ri-evidence-badge ri-evidence-badge--unavailable",
};

const statusStyles: Record<VerificationStatus, string> = {
  VERIFIED: "ri-evidence-badge ri-evidence-badge--verified",
  DEMONSTRATION: "ri-evidence-badge ri-evidence-badge--caution",
  TARGET: "ri-evidence-badge ri-evidence-badge--target",
  HISTORICAL: "ri-evidence-badge ri-evidence-badge--historical",
  UNAVAILABLE: "ri-evidence-badge ri-evidence-badge--unavailable",
  PENDING: "ri-evidence-badge ri-evidence-badge--pending",
};

const baseBadge =
  "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200";

export function ProvenanceBadge({ kind, className = "" }: { kind: ProvenanceKind; className?: string }) {
  return (
    <span className={`${baseBadge} ${provenanceStyles[kind]} ${className}`} title={`Provenance: ${kind}`} aria-label={`Provenance: ${kind}`}>
      <span aria-hidden="true" className="ri-evidence-badge__mark" />
      {kind}
    </span>
  );
}

export function VerificationBadge({ status, className = "" }: { status: VerificationStatus; className?: string }) {
  return (
    <span className={`${baseBadge} ${statusStyles[status]} ${className}`} title={`Verification: ${status}`} aria-label={`Verification: ${status}`}>
      <span aria-hidden="true" className="ri-evidence-badge__mark" />
      {status}
    </span>
  );
}
