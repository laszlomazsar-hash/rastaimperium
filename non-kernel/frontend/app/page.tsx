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

const maturitySignals = [
  {
    label: "VERIFIED",
    count: "3 capsules",
    detail: "ART-L7-REPLAY-001 · REJECT-001 · PARITY-001 (Node + Python)",
    href: "/proof/",
  },
  {
    label: "DEMONSTRATION",
    count: "Ledger + FSM",
    detail: "Append-only design and transition matrix documented",
    href: "/evidence/",
  },
  {
    label: "UNAVAILABLE",
    count: "Benchmarks",
    detail: "Ops/sec, latency, approval, reliability — provenance pending",
    href: "/evidence/",
  },
];

const boundaryItems = [
  {
    title: "What this is",
    points: [
      "Public constitutional and verification surface for EVO-V",
      "Evidence-bound claims with explicit provenance labels",
      "Replayable, challengeable artifacts for auditors and institutions",
    ],
  },
  {
    title: "What this is not",
    points: [
      "Not the execution runtime or production kernel",
      "Not a SaaS product or live monitoring dashboard",
      "Not a source of unpublished performance guarantees",
    ],
  },
];

const audiencePaths = [
  {
    role: "Auditor / reviewer",
    path: "Limitations → Proof Registry → Challenge Lab → Auditor handoff",
    href: "/limitations/",
    cta: "Start with Limitations",
  },
  {
    role: "Institutional decision-maker",
    path: "Product → Pilots → Contact",
    href: "/product/",
    cta: "Commercial pathway",
  },
  {
    role: "Technical reviewer",
    path: "Proof → Evidence → Challenge → Verify scripts",
    href: "/proof/",
    cta: "Open Proof Registry",
  },
  {
    role: "Curious visitor",
    path: "Vision → Pillars → Applications → Thanks & Praise",
    href: "/vision/",
    cta: "Start with Vision",
  },
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
      <section className="royal-hero border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="royal-kicker text-xs font-semibold uppercase tracking-[0.32em]">
            Public constitutional layer · EVO-V verification surface
          </p>
          <h1 className="royal-title mt-5 max-w-4xl text-4xl leading-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            Do not trust the claim.
            <span className="mt-2 block text-gold-gradient">Inspect the evidence.</span>
          </h1>
          <p className="royal-lede mt-6 max-w-3xl text-lg leading-8">
            Rasta Imperium is the public constitutional, architecture, and verification layer for
            EVO-V. It is not the execution runtime. Every high-value claim is bound to a proof,
            sealed artifact, or explicit UNAVAILABLE label. Verified results are capsule-scoped;
            production runtime metrics remain unpublished until independent artifacts exist.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/product/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Product & pilots
            </Link>
            <Link
              href="/proof/"
              className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/50 px-5 py-3 text-sm font-semibold text-[#F2D675]"
            >
              Open Proof Registry
            </Link>
            <Link
              href="/institutional-pilots/"
              className="royal-button royal-button-ghost rounded-lg border border-zinc-600 px-5 py-3 text-sm font-semibold text-zinc-100"
            >
              Design partner pilot
            </Link>
            <Link
              href="/limitations/"
              className="royal-button royal-button-ghost rounded-lg border border-zinc-600 px-5 py-3 text-sm font-semibold text-zinc-100"
            >
              Limitations
            </Link>
          </div>

          <div className="mt-12">
            <TrustStatus compact />
          </div>
        </div>
      </section>

      {/* Audience paths */}
      <section className="container-page border-b border-zinc-900 py-12" aria-labelledby="audience-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">Start here</p>
        <h2 id="audience-heading" className="mt-3 text-2xl text-zinc-100">
          Paths by role
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Choose a route that matches how you evaluate systems. Every path ends at evidence or an
          explicit limitation — not marketing claims.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiencePaths.map((a) => (
            <Link
              key={a.role}
              href={a.href}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition hover:border-[#B8860B]/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">{a.role}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">{a.path}</p>
              <p className="mt-3 text-sm text-[#F2D675]">{a.cta} →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Boundary clarity */}
      <section className="container-page border-b border-zinc-900 py-12" aria-labelledby="boundary-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">0 · Boundary</p>
        <h2 id="boundary-heading" className="mt-3 text-2xl text-zinc-100">
          Scope of this surface
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          This site is the public-facing constitutional and verification layer. Execution,
          production telemetry, and sealed performance claims live outside this surface until
          independent artifacts are published.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {boundaryItems.map((block) => (
            <div
              key={block.title}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
                {block.title}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                {block.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-[#B8860B]">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Maturity snapshot */}
      <section className="container-page border-b border-zinc-900 py-12" aria-labelledby="maturity-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">1 · Maturity</p>
        <h2 id="maturity-heading" className="mt-3 text-2xl text-zinc-100">
          What is proven, what is not
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          The verification surface is operational. Three frozen public capsules have independent
          Node and Python reproductions. Performance and reliability figures shown elsewhere on
          this site remain labelled UNAVAILABLE until sealed benchmark artifacts are attached.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {maturitySignals.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition hover:border-[#B8860B]/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">{s.label}</p>
              <p className="mt-2 text-lg font-semibold text-zinc-100">{s.count}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">{s.detail}</p>
            </Link>
          ))}
        </div>
        <Link href="/limitations/" className="mt-6 inline-block text-sm text-[#F2D675]">
          Full list of unproven claims →
        </Link>
      </section>

      <section className="container-page border-b border-zinc-900 py-16" aria-labelledby="explore-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">2 · Explore</p>
        <h2 id="explore-heading" className="mt-3 text-3xl text-zinc-100">
          Nine-layer civilization stack
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Constitutional architecture from human interface through cosmology. Open a layer on the
          Blueprint to inspect Purpose → Invariants → Evidence → Verify → Challenge.
        </p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {civilizationStack.map((layer) => (
            <li key={layer.layer}>
              <Link
                href={`/blueprint/#${layer.layer}`}
                className="block rounded-xl border border-zinc-800 bg-black/30 p-4 transition hover:border-[#B8860B]/40"
              >
                <p className="font-mono text-[11px] text-[#D4AF37]">{layer.layer}</p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-100">{layer.name}</h3>
                <p className="mt-2 text-xs leading-5 text-zinc-500">{layer.desc}</p>
              </Link>
            </li>
          ))}
        </ol>
        <Link
          href="/blueprint/#verifiable-stack"
          className="mt-6 inline-block text-sm text-[#F2D675]"
        >
          Verifiable architecture map →
        </Link>
      </section>

      <section className="container-page border-b border-zinc-900 py-16" aria-labelledby="verify-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">3 · Verify</p>
        <h2 id="verify-heading" className="mt-3 text-3xl text-zinc-100">
          Trust · Proof · Evidence
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          High-value claims with explicit provenance. Only sealed, independently reproducible
          capsules carry VERIFIED status. Benchmark numbers retained from prior presentation are
          labelled UNAVAILABLE until public artifacts are attached.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <ClaimEvidence claimId="CLAIM-REPLAY-001" />
          <ClaimEvidence claimId="CLAIM-LIFECYCLE-001" />
          <ClaimEvidence claimId="CLAIM-LEDGER-001" />
          <ClaimEvidence claimId="CLAIM-BENCH-REL" />
        </div>

        <h3 className="mt-12 text-lg text-zinc-100">Benchmark provenance (pending)</h3>
        <p className="mt-2 max-w-2xl text-xs leading-6 text-zinc-500">
          These figures appeared in earlier materials. They are shown for continuity only and are
          not currently backed by public, sealed benchmark capsules.
        </p>
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
        <Link href="/evidence/" className="mt-4 inline-block text-sm text-[#F2D675]">
          Evidence Explorer →
        </Link>
      </section>

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
              href="/challenge/"
              className="mt-6 inline-block rounded-lg border border-[#B8860B]/40 px-5 py-2.5 text-sm text-[#F2D675]"
            >
              Open Challenge Lab →
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">5 · Adopt</p>
            <h2 className="mt-3 text-2xl text-zinc-100">Commercial pathway</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Problem → evidence → design partner pilot → production runtime. For councils, regulated
              environments, and enterprise teams that need inspectable decision history and explicit
              constitutional bounds before scale.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/product/"
                className="inline-block rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black"
              >
                Product & capabilities →
              </Link>
              <Link
                href="/institutional-pilots/"
                className="inline-block rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200"
              >
                Design partner pilots →
              </Link>
              <Link
                href="/contact/?intent=design-partner"
                className="inline-block rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200"
              >
                Apply now →
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[11px] tracking-wide text-zinc-600">
          Static export via GitHub Actions · main branch · Railway deployment pipeline
        </p>
      </section>
    </main>
  );
}
