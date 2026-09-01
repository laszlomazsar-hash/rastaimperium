import Link from "next/link";
import type { ArchitectureLayer } from "../../data/evidence/architecture";
import { ProvenanceBadge, VerificationBadge } from "./ProvenanceBadge";

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
      className="group rounded-xl border border-zinc-800 bg-[#0b0c0b]/90 open:border-[#B8860B]/35"
      open={defaultOpen || undefined}
    >
      <summary className="cursor-pointer list-none p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] text-[#D4AF37]">{layer.layerId}</p>
            <h3 className="mt-1 text-lg text-zinc-100 group-open:text-[#F2D675]">{layer.name}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{layer.purpose}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <VerificationBadge status={layer.verificationStatus} />
            <ProvenanceBadge kind={layer.provenance} />
          </div>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-zinc-600 group-open:hidden">
          Expand · Purpose → … → Challenge
        </p>
      </summary>

      <div className="border-t border-zinc-900 px-5 pb-6 pt-4 sm:px-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              Inputs
            </dt>
            <dd className="mt-2">
              <ul className="space-y-1 text-sm text-zinc-300">
                {layer.inputs.map((i) => (
                  <li key={i}>· {i}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              Outputs
            </dt>
            <dd className="mt-2">
              <ul className="space-y-1 text-sm text-zinc-300">
                {layer.outputs.map((o) => (
                  <li key={o}>· {o}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
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
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
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
                        className="font-mono text-xs text-[#F2D675] hover:underline"
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
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
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
                        className="font-mono text-xs text-[#F2D675] hover:underline"
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
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              Implementation
            </dt>
            <dd className="mt-2 text-sm text-zinc-300">{layer.implementation}</dd>
          </div>
          {layer.notes && (
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                Notes
              </dt>
              <dd className="mt-2 text-sm text-zinc-500">{layer.notes}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={layer.verificationHref}
            className="rounded-lg border border-[#B8860B]/40 px-3 py-2 text-xs text-[#F2D675] transition hover:bg-[#B8860B]/10"
          >
            Verify · {layer.verificationLabel}
          </Link>
          <Link
            href={layer.challengeHref}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:border-[#B8860B]/30"
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
