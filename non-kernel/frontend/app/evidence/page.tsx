import type { Metadata } from "next";
import Link from "next/link";
import { claims, evidence, benchmarks } from "../../data/evidence/manifest";
import { ProvenanceBadge, VerificationBadge } from "../../components/evidence/ProvenanceBadge";
import { TrustStatus } from "../../components/evidence/TrustStatus";
import { ClaimEvidence } from "../../components/evidence/ClaimEvidence";

export const metadata: Metadata = {
  title: "Evidence Explorer — Claim → Proof → Artifact",
  description:
    "Unified evidence layer for deterministic AI governance: claims, proofs, sealed capsules, and explicit UNAVAILABLE labels. Inspect provenance before you trust performance figures.",
  keywords: [
    "AI evidence explorer",
    "claim proof artifact",
    "sealed capsules",
    "deterministic AI evidence",
    "auditable AI",
    "UNAVAILABLE provenance",
  ],
  openGraph: {
    title: "Evidence Explorer — Claim → Proof → Artifact",
    description:
      "Quantitative claims are never marked VERIFIED without published evidence. Browse the public evidence layer.",
    url: "https://rastaimperium.com/evidence/",
  },
};

export default function EvidencePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Evidence layer
          </p>
          <h1 className="mt-4 font-cinzel text-4xl text-zinc-100 sm:text-5xl">Evidence Explorer</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Flow: Claim → Proof → Artifact → Verification. Quantitative claims are never marked
            verified without published evidence.
          </p>
          <div className="mt-6">
            <TrustStatus compact />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/observatory/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
            >
              Open Evidence Observatory
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Proof Registry
            </Link>
            <Link
              href="/challenge/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Challenge Lab
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Limitations
            </Link>
            <Link
              href="/verify/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Verify
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <h2 className="font-cinzel text-2xl text-zinc-100">Claims</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Each claim carries an explicit verification status. Open the Observatory to inspect
          registry records with filters and reproduction links.
        </p>
        <div className="mt-8 space-y-4">
          {claims.map((c) => (
            <ClaimEvidence key={c.claimId} claim={c} />
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <h2 className="font-cinzel text-2xl text-zinc-100">Evidence objects</h2>
        <ul className="mt-6 space-y-3">
          {evidence.map((e) => (
            <li
              key={e.evidenceId}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-black/25 px-4 py-3"
            >
              <div>
                <p className="font-mono text-sm text-[#F2D675]">{e.evidenceId}</p>
                <p className="mt-1 text-sm text-zinc-400">{e.title}</p>
              </div>
              <ProvenanceBadge provenance={e.provenance} />
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-12">
        <h2 className="font-cinzel text-2xl text-zinc-100">Benchmark figures</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Benchmark labels remain UNAVAILABLE unless a sealed public artifact exists.
        </p>
        <ul className="mt-6 space-y-3">
          {benchmarks.map((b) => (
            <li
              key={b.benchmarkId}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 px-4 py-3"
            >
              <div>
                <p className="text-sm text-zinc-200">{b.label}</p>
                <p className="font-mono text-xs text-zinc-500">{b.benchmarkId}</p>
              </div>
              <VerificationBadge status={b.verificationStatus} />
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link href="/observatory/" className="text-[#F2D675] hover:underline">
            Open Evidence Observatory →
          </Link>
        </div>
      </section>
    </main>
  );
}
