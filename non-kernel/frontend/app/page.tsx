"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TrustStatus } from "../components/evidence/TrustStatus";
import { ProvenanceBadge, VerificationBadge } from "../components/evidence/ProvenanceBadge";
import { ClaimEvidence } from "../components/evidence/ClaimEvidence";
import { benchmarks as evidenceBenchmarks } from "../data/evidence/manifest";
import { generateTelemetrySnapshot, telemetryStatusLabel } from "./motion/telemetry";

const civilizationStack = [
  { layer: "L9", name: "Cosmology Layer", desc: "Mythic narrative and civilizational meaning" },
  { layer: "L8", name: "Constitutional Layer", desc: "Seven Articles — hardware-enforced governance physics" },
  { layer: "L7", name: "Identity + Trust Layer", desc: "Immutable replay ledger and cryptographic proofs" },
  { layer: "L6", name: "Epistemic Governance Layer", desc: "Bayesian calibration and drift detection" },
  { layer: "L5", name: "Deterministic Intelligence Layer", desc: "Causal modeling and symbolic reasoning" },
  { layer: "L4", name: "Agentic Infrastructure Layer", desc: "Deep Seed agent orchestration" },
  { layer: "L3", name: "Operational Systems Layer", desc: "Real-time invariant enforcement" },
  { layer: "L2", name: "Economic + Institutional Layer", desc: "Enterprise integration and compliance" },
  { layer: "L1", name: "Human Interface Layer", desc: "Progressive initiation and witness portals" },
];

const trustPillars = [
  "Deterministic replay under identical inputs and event order",
  "Append-only audit lineage with hash-linked chronology",
  "FSM-governed lifecycle transitions with illegal-edge rejection",
  "Counterexample generation for every critical invariant failure",
];

export default function HomePage() {
  const [tick, setTick] = useState(0);
  const telemetry = generateTelemetrySnapshot(tick, "rastaimperium-home");

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="royal-page overflow-hidden">
      {/* UNDERSTAND */}
      <section className="royal-hero border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="royal-kicker text-xs font-semibold uppercase tracking-[0.32em]">
            Public constitutional layer · EVO-V verification surface
          </p>
          <h1 className="royal-title mt-5 max-w-4xl text-4xl leading-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            Do not trust the claim.
            <span className="mt-2 block text-gold-gradient">Inspect the evidence.</span>
          </h1>
          <p className="royal-lede mt-6 text-lg leading-8">
            Rasta Imperium is the public constitutional, architecture, and verification layer for
            EVO-V. It is not the execution runtime. Claims here connect to proofs, artifacts, and
            safe challenges — with demonstration and unavailable states labelled explicitly.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/blueprint"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Explore Architecture
            </Link>
            <Link
              href="/trust"
              className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/50 px-5 py-3 text-sm font-semibold text-[#F2D675]"
            >
              Verify the System
            </Link>
            <Link
              href="/challenge"
              className="royal-button royal-button-ghost rounded-lg border border-zinc-600 px-5 py-3 text-sm font-semibold text-zinc-100"
            >
              Challenge the Claims
            </Link>
            <Link
              href="/institutional-pilots"
              className="royal-button royal-button-ghost rounded-lg border border-zinc-600 px-5 py-3 text-sm font-semibold text-zinc-100"
            >
              Institutional Pilot
            </Link>
          </div>

          <div className="mt-12">
            <TrustStatus compact />
          </div>
        </div>
      </section>

      {/* EXPLORE — architecture */}
      <section className="container-page border-b border-zinc-900 py-16" aria-labelledby="explore-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">2 · Explore</p>
        <h2 id="explore-heading" className="mt-3 text-3xl text-zinc-100">
          Nine-layer civilization stack
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Constitutional architecture from human interface through cosmology. Evidence for each layer
          is published only where it exists — otherwise marked unavailable.
        </p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {civilizationStack.map((layer) => (
            <li key={layer.layer} className="rounded-xl border border-zinc-800 bg-black/30 p-4">
              <p className="font-mono text-[11px] text-[#D4AF37]">{layer.layer}</p>
              <h3 className="mt-1 text-sm font-semibold text-zinc-100">{layer.name}</h3>
              <p className="mt-2 text-xs leading-5 text-zinc-500">{layer.desc}</p>
            </li>
          ))}
        </ol>
        <Link href="/blueprint" className="mt-6 inline-block text-sm text-[#F2D675]">
          Full Blueprint →
        </Link>
      </section>

      {/* VERIFY */}
      <section className="container-page border-b border-zinc-900 py-16" aria-labelledby="verify-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">3 · Verify</p>
        <h2 id="verify-heading" className="mt-3 text-3xl text-zinc-100">
          Trust · Proof · Evidence
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          High-value claims with explicit provenance. Benchmark numbers retained from prior
          presentation are labelled UNAVAILABLE until public artifacts are attached.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <ClaimEvidence claimId="CLAIM-REPLAY-001" />
          <ClaimEvidence claimId="CLAIM-LEDGER-001" />
          <ClaimEvidence claimId="CLAIM-LIFECYCLE-001" />
          <ClaimEvidence claimId="CLAIM-BENCH-REL" />
        </div>

        <h3 className="mt-12 text-lg text-zinc-100">Benchmark provenance</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500">
                <th className="py-2 pr-3">Metric</th>
                <th className="py-2 pr-3">Value</th>
                <th className="py-2 pr-3">Target</th>
                <th className="py-2 pr-3">Verification</th>
                <th className="py-2">Provenance</th>
              </tr>
            </thead>
            <tbody>
              {evidenceBenchmarks.map((b) => (
                <tr key={b.benchmarkId} className="border-b border-zinc-900">
                  <td className="py-3 pr-3 text-zinc-200">{b.metric}</td>
                  <td className="py-3 pr-3 font-mono text-zinc-100">{b.value}</td>
                  <td className="py-3 pr-3 font-mono text-zinc-500">{b.target}</td>
                  <td className="py-3 pr-3">
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
        <Link href="/evidence" className="mt-4 inline-block text-sm text-[#F2D675]">
          Evidence Explorer →
        </Link>
      </section>

      {/* Telemetry discipline */}
      <section className="container-page border-b border-zinc-900 py-12">
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <ProvenanceBadge kind="DEMONSTRATION" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">
              Synthetic telemetry · local visual proof · not production monitoring
            </p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs text-zinc-400 sm:grid-cols-5">
            <div>
              <dt className="text-zinc-600">coherence</dt>
              <dd className="text-zinc-200">{telemetry.coherence}</dd>
            </div>
            <div>
              <dt className="text-zinc-600">drift</dt>
              <dd className="text-zinc-200">{telemetry.drift}</dd>
            </div>
            <div>
              <dt className="text-zinc-600">agents</dt>
              <dd className="text-zinc-200">{telemetry.agents}</dd>
            </div>
            <div>
              <dt className="text-zinc-600">block</dt>
              <dd className="text-zinc-200">{telemetry.block}</dd>
            </div>
            <div>
              <dt className="text-zinc-600">hash</dt>
              <dd className="text-zinc-200">{telemetry.hash}</dd>
            </div>
          </dl>
          <p className="mt-3 text-[11px] text-zinc-500">
            SOURCE local PRNG · STATUS {telemetryStatusLabel(telemetry.systemState)} · not LIVE
          </p>
        </div>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {trustPillars.map((t) => (
            <li key={t} className="rounded-lg border border-zinc-800 px-4 py-3 text-sm text-zinc-400">
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* CHALLENGE + ADOPT */}
      <section className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">4 · Challenge</p>
            <h2 className="mt-3 text-2xl text-zinc-100">Try to break the invariant</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Illegal transitions, replay mismatch, altered receipts — deterministic fixtures only.
              No production mutation endpoints on this surface.
            </p>
            <Link
              href="/challenge"
              className="mt-6 inline-block rounded-lg border border-[#B8860B]/40 px-5 py-2.5 text-sm text-[#F2D675]"
            >
              Open Challenge Lab →
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">5 · Adopt</p>
            <h2 className="mt-3 text-2xl text-zinc-100">Institutional pathway</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Problem → method → evidence → challenge → pilot → assurance. Suitable for councils,
              regulated environments, and enterprise governance teams.
            </p>
            <Link
              href="/institutional-pilots"
              className="mt-6 inline-block rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Institutional pilots →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
