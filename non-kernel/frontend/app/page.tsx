"use client";

import Link from "next/link";
import { TrustStatus } from "../components/evidence/TrustStatus";

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
    tone: "verified" as const,
  },
  {
    label: "DEMONSTRATION",
    count: "Ledger + FSM",
    detail: "Append-only design and transition matrix documented",
    href: "/evidence/",
    tone: "demonstration" as const,
  },
  {
    label: "UNAVAILABLE",
    count: "Performance benchmarks",
    detail: "No sealed public benchmark capsules published yet",
    href: "/limitations/",
    tone: "unavailable" as const,
  },
];

const maturityToneClass: Record<string, string> = {
  verified:
    "border-emerald-700/45 bg-emerald-950/25 ring-1 ring-emerald-800/30",
  demonstration:
    "border-amber-900/40 bg-amber-950/15 opacity-90",
  unavailable:
    "border-zinc-800/80 bg-black/20 opacity-80",
};

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

const institutionalValue = [
  {
    title: "Reconstructible decisions",
    body: "When agents act, institutions need a clear record of inputs, rules applied, and outcomes — not opaque model logs.",
  },
  {
    title: "Bounded autonomy",
    body: "High-consequence systems should operate inside explicit constitutional limits rather than retrospective interpretation.",
  },
  {
    title: "Audit-ready evidence",
    body: "Sealed capsules and challenge fixtures give boards and auditors a concrete surface to examine.",
  },
  {
    title: "Scoped pilots",
    body: "Fixed-scope design partner engagements with written success criteria before any claim of operational adoption.",
  },
];

const audiencePaths = [
  {
    role: "Auditor / reviewer",
    path: "Verify → Limitations → Proof → Audit",
    href: "/verify/",
    cta: "Run the proof",
    primary: true,
  },
  {
    role: "Technical reviewer",
    path: "Verify → Proof → Trust → Challenge",
    href: "/proof/",
    cta: "Open Proof Registry",
    primary: false,
  },
  {
    role: "Institutional decision-maker",
    path: "Limitations → Why Deterministic → Product → Pilots",
    href: "/limitations/",
    cta: "Start with Limitations",
    primary: false,
  },
  {
    role: "Curious visitor",
    path: "Vision → Apps → Codex → Thanks & Praise",
    href: "/vision/",
    cta: "Start with Vision",
    primary: false,
  },
];

export default function HomePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="royal-hero relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#107e3e]/12 blur-3xl" />
          <div className="absolute -right-16 top-20 h-80 w-80 rounded-full bg-[#B8860B]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#e01e1e]/08 blur-3xl" />
        </div>
        <div className="container-page relative grid gap-8 py-12 sm:gap-10 sm:py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#B8860B]/30 bg-black/30 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] sm:text-[11px] sm:tracking-[0.22em]">
                Public constitutional layer · EVO-V
              </p>
            </div>
            <h1 className="royal-title mt-5 max-w-3xl text-3xl leading-[1.05] text-zinc-50 sm:mt-6 sm:text-5xl md:text-[2.75rem] lg:text-6xl">
              Do not trust the claim.
              <span className="mt-2 block text-gold-gradient">Inspect the evidence.</span>
            </h1>
            <p className="royal-lede mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:mt-6 sm:text-lg sm:leading-8">
              Deterministic governance for institutions that cannot afford opaque autonomy.
              Sealed capsules, explicit Limitations, and scoped design partner pilots — not a
              self-serve SaaS storefront.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-9 sm:gap-3">
              <Link href="/verify/" className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#F2D675] sm:px-6 sm:py-3">Verify the evidence</Link>
              <Link href="/proof/" className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/50 px-5 py-2.5 text-sm font-semibold text-[#F2D675] sm:px-6 sm:py-3">Proof Registry</Link>
              <Link href="/limitations/" className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-100 sm:px-6 sm:py-3">Read Limitations first</Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-500 sm:mt-6 sm:gap-x-5">
              <Link href="/trust/" className="hover:text-[#F2D675]">Trust Console</Link>
              <Link href="/audit/" className="hover:text-[#F2D675]">Auditor handoff</Link>
              <Link href="/product/" className="hover:text-[#F2D675]">Product & pilots</Link>
              <Link href="/institutional-pilots/" className="hover:text-[#F2D675]">Pilot pathway</Link>
            </div>
            <div className="mt-8 sm:mt-10"><TrustStatus compact /></div>
          </div>
          <aside className="relative overflow-hidden rounded-2xl border border-emerald-800/40 bg-[#0b0c0b]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-6 md:p-6 lg:p-7">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-600 via-[#D4AF37] to-emerald-700/60" />
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/90 sm:text-[11px] sm:tracking-[0.2em]">Proven on this surface</p>
              <span className="ri-evidence-badge ri-evidence-badge--verified inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">
                <span aria-hidden="true" className="ri-evidence-badge__mark" />
                VERIFIED
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              Three frozen public capsules with independent Node and Python reproductions. Scope is capsule-only — not production LIVE telemetry.
            </p>
            <ul className="mt-4 space-y-2 font-mono text-[11px] text-zinc-400">
              <li className="flex gap-2"><span className="text-emerald-400">●</span><span>ART-L7-REPLAY-001 · deterministic replay</span></li>
              <li className="flex gap-2"><span className="text-emerald-400">●</span><span>ART-L7-REJECT-001 · illegal-edge rejection</span></li>
              <li className="flex gap-2"><span className="text-emerald-400">●</span><span>ART-L7-PARITY-001 · Node ↔ Python parity</span></li>
            </ul>
            <div className="mt-5 space-y-2 border-t border-zinc-800 pt-4 sm:mt-6 sm:pt-5">
              <Link href="/verify/" className="flex items-center justify-between rounded-lg border border-emerald-800/40 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-200 transition hover:border-emerald-700/50 hover:bg-emerald-950/35 sm:py-2.5"><span className="font-medium">Run the proof yourself</span><span aria-hidden="true">→</span></Link>
              <Link href="/proof/" className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:border-[#B8860B]/40 hover:text-[#F2D675] sm:py-2.5"><span>Proof Registry</span><span aria-hidden="true">→</span></Link>
              <Link href="/audit/" className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:border-[#B8860B]/40 hover:text-[#F2D675] sm:py-2.5"><span>Auditor handoff</span><span aria-hidden="true">→</span></Link>
            </div>
            <p className="mt-4 font-mono text-[10px] leading-4 text-zinc-600">
              Synthetic surface metrics are DEMONSTRATION only · not LIVE · see Limitations
            </p>
          </aside>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-[#0b0c0b]/50" aria-labelledby="value-heading">
        <div className="container-page py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">Why institutions engage</p>
          <h2 id="value-heading" className="mt-3 max-w-2xl text-2xl text-zinc-100">Reduce liability from opaque autonomy</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Boards, CISOs, and regulated operators need reconstructible decision trails and enforceable bounds — not another model-monitoring dashboard.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {institutionalValue.map((item) => (
              <div key={item.title} className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition hover:border-[#B8860B]/30">
                <h3 className="text-base font-semibold text-[#F2D675]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/product/" className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black">View product pathway</Link>
            <Link href="/why-deterministic-governance/" className="rounded-lg border border-[#B8860B]/40 px-5 py-2.5 text-sm text-[#F2D675]">Why deterministic governance</Link>
            <Link href="/institutional-pilots/" className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm text-zinc-100">Design partner pilots</Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12" aria-labelledby="audience-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">Start here</p>
        <h2 id="audience-heading" className="mt-3 text-2xl text-zinc-100">Paths by role</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Choose a route that matches how you evaluate systems. Every path ends at evidence or an explicit limitation — not marketing claims.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiencePaths.map((a) => (
            <Link key={a.role} href={a.href} className={`rounded-xl border p-4 transition hover:border-[#B8860B]/40 sm:p-5 ${a.primary ? "border-emerald-800/40 bg-emerald-950/15" : "border-zinc-800 bg-black/30"}`}>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">{a.role}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">{a.path}</p>
              <p className="mt-3 text-sm text-[#F2D675]">{a.cta} →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12" aria-labelledby="boundary-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">0 · Boundary</p>
        <h2 id="boundary-heading" className="mt-3 text-2xl text-zinc-100">Scope of this surface</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">This site is the public-facing constitutional and verification layer. Execution, production telemetry, and sealed performance claims live outside this surface until independent artifacts are published.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {boundaryItems.map((block) => (
            <div key={block.title} className="rounded-xl border border-zinc-800 bg-black/30 p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">{block.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">{block.points.map((p) => (<li key={p} className="flex gap-2"><span className="text-[#B8860B]">·</span><span>{p}</span></li>))}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-10 sm:py-12" aria-labelledby="maturity-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">1 · Maturity</p>
        <h2 id="maturity-heading" className="mt-3 text-2xl text-zinc-100">What is proven, what is not</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Three frozen public capsules have independent Node and Python reproductions. Performance benchmarks and LIVE telemetry are not claimed until sealed artifacts exist.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {maturitySignals.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className={`rounded-xl border p-4 transition hover:border-[#B8860B]/40 sm:p-5 ${maturityToneClass[s.tone]}`}
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">{s.label}</p>
              <p className="mt-2 text-lg font-semibold text-zinc-100">{s.count}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">{s.detail}</p>
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/verify/" className="font-semibold text-[#F2D675]">Verify →</Link>
          <Link href="/limitations/" className="text-zinc-400 hover:text-[#F2D675]">Full list of unproven claims →</Link>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-10 sm:py-12" aria-labelledby="explore-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">2 · Explore</p>
        <h2 id="explore-heading" className="mt-3 text-2xl text-zinc-100">Nine-layer civilization stack</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Constitutional architecture from human interface through cosmology. Verification lives in Proof and Evidence.</p>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {civilizationStack.map((layer) => (
            <div key={layer.layer} className="rounded-xl border border-zinc-800/90 bg-black/25 p-3.5 transition hover:border-[#B8860B]/30 sm:p-4">
              <p className="font-mono text-[11px] text-[#D4AF37]">{layer.layer}</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">{layer.name}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{layer.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/blueprint/" className="text-sm text-[#F2D675]">Blueprint →</Link>
          <Link href="/architecture/" className="text-sm text-zinc-400 hover:text-[#F2D675]">Architecture →</Link>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-10 sm:py-12" aria-labelledby="pillars-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">3 · Trust pillars</p>
        <h2 id="pillars-heading" className="mt-3 text-2xl text-zinc-100">What verification requires</h2>
        <ul className="mt-5 max-w-2xl space-y-2.5 text-sm text-zinc-300">
          {trustPillars.map((p) => (<li key={p} className="flex gap-2"><span className="text-[#B8860B]">·</span><span>{p}</span></li>))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/verify/" className="font-semibold text-[#F2D675]">Verify →</Link>
          <Link href="/proof/" className="text-zinc-400 hover:text-[#F2D675]">Proof Registry →</Link>
          <Link href="/challenge/" className="text-zinc-400 hover:text-[#F2D675]">Challenge Lab →</Link>
          <Link href="/trust/" className="text-zinc-400 hover:text-[#F2D675]">Trust Console →</Link>
        </div>
      </section>

      <section className="container-page py-12 sm:py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-6 text-center sm:p-8">
          <h2 className="font-cinzel text-2xl text-zinc-100">Ready to engage</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">Inspect evidence, read Limitations, then apply for a fixed-scope design partner pilot with written success criteria.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/verify/" className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black">Verify the evidence</Link>
            <Link href="/limitations/" className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]">Limitations</Link>
            <Link href="/contact/?intent=design-partner" className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100">Apply · design partner</Link>
          </div>
        </div>
        <p className="mt-10 text-center text-[11px] tracking-wide text-zinc-600">Static export via GitHub Actions · main branch · Railway deployment pipeline</p>
      </section>
    </main>
  );
}
