import type { Metadata } from "next";
import Link from "next/link";
import { claims, evidence, benchmarks } from "../../data/evidence/manifest";
import { ProvenanceBadge, VerificationBadge } from "../../components/evidence/ProvenanceBadge";
import { TrustStatus } from "../../components/evidence/TrustStatus";
import { ClaimEvidence } from "../../components/evidence/ClaimEvidence";

export const metadata: Metadata = {
  title: "Evidence Explorer — Claim → Proof → Artifact",
  description:
    "Unified evidence layer connecting claims, proofs, and artifacts. Demonstration and unavailable states are explicit.",
};

export default function EvidencePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Evidence layer
          </p>
          <h1 className="mt-4 text-4xl text-zinc-100 sm:text-5xl">Evidence Explorer</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Flow: Claim → Proof → Artifact → Verification. Quantitative claims are never marked
            verified without published evidence.
          </p>
          <div className="mt-6">
            <TrustStatus compact />
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-xl text-zinc-100">Claims</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {claims.map((c) => (
            <ClaimEvidence key={c.claimId} claimId={c.claimId} />
          ))}
        </div>
      </section>

      <section className="container-page border-t border-zinc-900 py-12">
        <h2 className="text-xl text-zinc-100">Evidence records</h2>
        <ul className="mt-6 space-y-4">
          {evidence.map((e) => (
            <li key={e.evidenceId} id={e.evidenceId}>
              <article className="rounded-xl border border-zinc-800 bg-[#0b0c0b]/80 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-[11px] text-zinc-500">{e.evidenceId}</p>
                    <h3 className="mt-1 text-lg text-zinc-100">{e.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <VerificationBadge status={e.verificationStatus} />
                    <ProvenanceBadge kind={e.provenance} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{e.description}</p>
                <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-zinc-500">Source</dt>
                    <dd className="text-zinc-300">{e.source}</dd>
                  </div>
                  {e.verificationMethod && (
                    <div>
                      <dt className="text-zinc-500">Verification method</dt>
                      <dd className="text-zinc-300">{e.verificationMethod}</dd>
                    </div>
                  )}
                  {e.hash && (
                    <div>
                      <dt className="text-zinc-500">Hash</dt>
                      <dd className="font-mono text-zinc-300">{e.hash}</dd>
                    </div>
                  )}
                  {e.artifactId && (
                    <div>
                      <dt className="text-zinc-500">Artifact</dt>
                      <dd className="font-mono text-zinc-300">{e.artifactId}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {e.proofIds.map((pid) => (
                    <Link key={pid} href={`/proof#${pid}`} className="text-[#F2D675] hover:underline">
                      {pid}
                    </Link>
                  ))}
                  {e.relatedTrustSections.map((s) => (
                    <Link key={s} href="/trust" className="text-zinc-500 hover:text-zinc-300">
                      Trust · {s}
                    </Link>
                  ))}
                </div>
                {e.notes && <p className="mt-3 text-xs text-zinc-500">{e.notes}</p>}
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page border-t border-zinc-900 py-12">
        <h2 className="text-xl text-zinc-100">Benchmark provenance</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Homepage figures retained with explicit status. UNAVAILABLE until public artifacts exist.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                <th className="py-2 pr-4">Metric</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2 pr-4">Target</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Provenance</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b) => (
                <tr key={b.benchmarkId} className="border-b border-zinc-900">
                  <td className="py-3 pr-4 text-zinc-200">{b.metric}</td>
                  <td className="py-3 pr-4 font-mono text-zinc-100">{b.value}</td>
                  <td className="py-3 pr-4 font-mono text-zinc-400">{b.target}</td>
                  <td className="py-3 pr-4">
                    <VerificationBadge status={b.verificationStatus} />
                  </td>
                  <td className="py-3">
                    <ProvenanceBadge kind={b.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
