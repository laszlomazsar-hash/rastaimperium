import Link from "next/link";
import { getClaim, getEvidence, getProof } from "../../data/evidence/manifest";
import { ProvenanceBadge, VerificationBadge } from "./ProvenanceBadge";

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
      className={`rounded-lg border border-zinc-800 bg-black/25 p-4 ${className}`}
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">Evidence</p>
          {evidenceItems.length === 0 ? (
            <p className="mt-1 text-xs text-zinc-500">None linked</p>
          ) : (
            <ul className="mt-1 space-y-1">
              {evidenceItems.map((e) =>
                e ? (
                  <li key={e.evidenceId}>
                    <Link
                      href={`/evidence#${e.evidenceId}`}
                      className="font-mono text-xs text-zinc-300 transition hover:text-[#F2D675]"
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">Proof</p>
          {proofItems.length === 0 ? (
            <p className="mt-1 text-xs text-zinc-500">None linked</p>
          ) : (
            <ul className="mt-1 space-y-1">
              {proofItems.map((p) =>
                p ? (
                  <li key={p.proofId}>
                    <Link
                      href={`/proof#${p.proofId}`}
                      className="font-mono text-xs text-zinc-300 transition hover:text-[#F2D675]"
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
          className="rounded border border-[#B8860B]/35 px-2.5 py-1 text-[11px] text-[#F2D675] transition hover:bg-[#B8860B]/10"
        >
          Verify → Evidence
        </Link>
        {claim.proofIds[0] && (
          <Link
            href={`/proof#${claim.proofIds[0]}`}
            className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-[#B8860B]/30"
          >
            Open proof
          </Link>
        )}
      </div>
    </div>
  );
}
