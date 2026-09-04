import Link from "next/link";
import type { ArchitectureLayer } from "../../data/evidence/architecture";
import { ProvenanceBadge, VerificationBadge } from "./ProvenanceBadge";

/**
 * Architecture Layer Card — Rasta Royal expandable panel.
 * Purpose → Invariants → Evidence → Verify → Challenge.
 */
export function ArchitectureLayerCard({
  layer,
  defaultOpen = false,
}: {
  layer: ArchitectureLayer;
  defaultOpen?: boolean;
}) {
  return (
    <details
      id={layer.layerId}
      className="group royal-panel rounded-xl border border-zinc-800 bg-[linear-gradient(145deg,rgba(19,23,16,0.94),rgba(15,18,13,0.82))] open:border-[rgba(184,134,11,0.4)] open:shadow-[0_0_24px_rgba(242,214,117,0.06)] transition-all duration-300"
      open={defaultOpen || undefined}
    >
      <summary className="cursor-pointer list-none p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] text-[var(--royal-gold)]">{layer.layerId}</p>
            <h3 className="mt-1 font-cinzel text-lg text-zinc-100 transition group-open:text-[var(--royal-gold)]">
              {layer.name}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{layer.purpose}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <VerificationBadge status={layer.verificationStatus} />
            <ProvenanceBadge kind={layer.provenance} />
          </div>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-zinc-600 transition group-open:hidden">
          Expand · Purpose → … → Challenge
        </p>
      </summary>

      <div className="border-t border-zinc-900/80 px-5 pb-6 pt-4 sm:px-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--royal-gold-deep,#B8860B)]">
              Inputs
            </dt>
            <dd className="mt-2">
              <ul className="space-y-1 text-sm text-zinc-300">
                {layer.inputs.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--royal-gold-deep,#B8860B)]">·</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--royal-gold-deep,#B8860B)]">
              Outputs
            </dt>
            <dd className="mt-2">
              <ul className="space-y-1 text-sm text-zinc-300">
                {layer.outputs.map((o) => (
                  <li key={o} className="flex gap-2">
                    <span className="text-[var(--royal-gold-deep,#B8860B)]">·</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--royal-gold-deep,#B8860B)]">
              Invariants
            </dt>
            <dd className="mt-2 space-y-1 text-sm text-zinc-300">
              {layer.invariantIds.length > 0 ? (
                <p className="font-mono text-xs text-zinc-200">{layer.invariantIds.join(" · ")}</p>
              ) : null}
              {layer.invariantNotes.map((n) => (
                <p key={n} className="text-zinc-400">
                  {n}
                </p>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--royal-gold-deep,#B8860B)]">
              Evidence
            </dt>
            <dd className="mt-2">
              {layer.evidenceIds.length === 0 ? (
                <p className="text-sm text-zinc-500">Evidence not currently published.</p>
              ) : (
                <ul className="space-y-1">
                  {layer.evidenceIds.map((id) => (
                    <li key={id}>
                      <Link
                        href={`/evidence/#${id}`}
                        className="font-mono text-xs text-[var(--royal-gold)] hover:underline"
                      >
                        {id}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--royal-gold-deep,#B8860B)]">
              Proofs
            </dt>
            <dd className="mt-2">
              {layer.proofIds.length === 0 ? (
                <p className="text-sm text-zinc-500">None linked</p>
              ) : (
                <ul className="space-y-1">
                  {layer.proofIds.map((id) => (
                    <li key={id}>
                      <Link
                        href={`/proof/#${id}`}
                        className="font-mono text-xs text-[var(--royal-gold)] hover:underline"
                      >
                        {id}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--royal-gold-deep,#B8860B)]">
              Implementation
            </dt>
            <dd className="mt-2 text-sm text-zinc-300">{layer.implementation}</dd>
          </div>
          {layer.notes && (
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--royal-gold-deep,#B8860B)]">
                Notes
              </dt>
              <dd className="mt-2 text-sm text-zinc-500">{layer.notes}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={layer.verificationHref}
            className="royal-button rounded-lg border border-[rgba(184,134,11,0.4)] px-3 py-2 text-xs text-[var(--royal-gold)] transition hover:bg-[rgba(184,134,11,0.1)]"
          >
            Verify · {layer.verificationLabel}
          </Link>
          <Link
            href={layer.challengeHref}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:border-[rgba(184,134,11,0.3)]"
          >
            Challenge
            {layer.challengeIds.length > 0 ? ` (${layer.challengeIds.length})` : ""}
          </Link>
          {layer.challengeIds[0] && (
            <Link
              href={`/challenge/`}
              className="rounded-lg border border-zinc-800 px-3 py-2 font-mono text-[10px] text-zinc-500"
            >
              {layer.challengeIds[0]}
            </Link>
          )}
        </div>
      </div>
    </details>
  );
}
