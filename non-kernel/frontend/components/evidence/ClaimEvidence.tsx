import Link from "next/link";
import { getClaim, getEvidence, getProof } from "../../data/evidence/manifest";
import { ProvenanceBadge, VerificationBadge } from "./ProvenanceBadge";

/**
 * ClaimEvidence — Rasta Royal evidence card.
 * Explicit provenance + linked evidence/proofs. No marketing claims.
 */
export function ClaimEvidence({
  claimId,
  className = "",
}: {
  claimId: string;
  className?: string;
}) {
  const claim = getClaim(claimId);
  if (!claim) {
    return (
      <div className={`rounded border border-zinc-800 p-3 text-xs text-zinc-500 ${className}`}>
        Claim {claimId} not found in evidence manifest.
      </div>
    );
  }

  const evidenceItems = claim.evidenceIds.map((id) => getEvidence(id)).filter(Boolean);
  const proofItems = claim.proofIds.map((id) => getProof(id)).filter(Boolean);

  return (
    <div
      className={`royal-panel group rounded-xl border border-zinc-800 bg-[linear-gradient(145deg,rgba(19,23,16,0.94),rgba(15,18,13,0.82))] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition hover:border-[rgba(242,214,117,0.35)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_20px_rgba(242,214,117,0.06)] ${className}`}
      role="group"
      aria-label={`Claim ${claim.claimId}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Claim</span>
        <VerificationBadge status={claim.verificationStatus} />
        <ProvenanceBadge kind={claim.provenance} />
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{claim.statement}</p>
      {claim.notes && <p className="mt-2 text-xs leading-5 text-zinc-500">{claim.notes}</p>}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--royal-gold-deep,#B8860B)]">
            Evidence
          </p>
          {evidenceItems.length === 0 ? (
            <p className="mt-1 text-xs text-zinc-500">None linked</p>
          ) : (
            <ul className="mt-1 space-y-1">
              {evidenceItems.map((e) =>
                e ? (
                  <li key={e.evidenceId}>
                    <Link
                      href={`/evidence#${e.evidenceId}`}
                      className="font-mono text-xs text-zinc-300 transition hover:text-[var(--royal-gold)]"
                    >
                      {e.evidenceId}
                    </Link>
                    <span className="ml-2 text-xs text-zinc-500">{e.title}</span>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--royal-gold-deep,#B8860B)]">
            Proof
          </p>
          {proofItems.length === 0 ? (
            <p className="mt-1 text-xs text-zinc-500">None linked</p>
          ) : (
            <ul className="mt-1 space-y-1">
              {proofItems.map((p) =>
                p ? (
                  <li key={p.proofId}>
                    <Link
                      href={`/proof#${p.proofId}`}
                      className="font-mono text-xs text-zinc-300 transition hover:text-[var(--royal-gold)]"
                    >
                      {p.proofId}
                    </Link>
                    <span className="ml-2 text-xs text-zinc-500">{p.title}</span>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/evidence#${claim.evidenceIds[0] ?? ""}`}
          className="royal-button rounded border border-[rgba(184,134,11,0.35)] px-2.5 py-1 text-[11px] text-[var(--royal-gold)] transition hover:bg-[rgba(184,134,11,0.1)]"
        >
          Verify → Evidence
        </Link>
        {claim.proofIds[0] && (
          <Link
            href={`/proof#${claim.proofIds[0]}`}
            className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-[rgba(184,134,11,0.3)]"
          >
            Open proof
          </Link>
        )}
      </div>
    </div>
  );
}
