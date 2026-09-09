import type { Metadata } from "next";
import Link from "next/link";
import {
  TrustRail,
  ReproduceOffline,
  ArtifactCard,
  EvidenceChain,
  LayerCard,
  StatusBadge,
} from "@/components/design-system";
import RIHeroMark from "@/components/RIHeroMark";

export const metadata: Metadata = {
  title: "Rasta Imperium — Constitutional Intelligence Infrastructure",
  description:
    "Deterministic governance, verifiable evidence, and accountable machine decision-making. Inspect sealed L7 capsules. Reproduce offline. No opaque autonomy.",
};

const layers = [
  { id: "L9", title: "Cosmology", description: "Mythic narrative and civilizational meaning.", status: "UNAVAILABLE" as const },
  { id: "L8", title: "Constitutional", description: "Seven Articles — governance physics as constitutional constraints.", status: "UNAVAILABLE" as const, href: "/codex" },
  { id: "L7", title: "Identity + Trust", description: "Immutable replay ledger and cryptographic proofs. Strongest frozen public evidence.", status: "VERIFIED" as const, emphasize: true, href: "/proof" },
  { id: "L6", title: "Epistemic Governance", description: "Bayesian calibration and drift detection.", status: "UNAVAILABLE" as const },
  { id: "L5", title: "Deterministic Intelligence", description: "Causal modeling and symbolic reasoning.", status: "UNAVAILABLE" as const },
  { id: "L4", title: "Agentic Infrastructure", description: "Deep Seed agent orchestration.", status: "UNAVAILABLE" as const },
  { id: "L3", title: "Operational Systems", description: "Real-time invariant enforcement. Demonstration-level documentation.", status: "DEMONSTRATION" as const },
  { id: "L2", title: "Economic + Institutional", description: "Enterprise integration and compliance.", status: "UNAVAILABLE" as const },
  { id: "L1", title: "Human Interface", description: "Progressive initiation and witness portals.", status: "UNAVAILABLE" as const },
];

export default function HomePage() {
  return (
    <main className="royal-page overflow-hidden">
      {/* 01 — HERO */}
      <section className="royal-hero relative border-b border-[rgba(242,214,117,0.18)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#107e3e]/10 blur-3xl" />
          <div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-[#B8860B]/08 blur-3xl" />
        </div>
        <div className="container-page relative grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:py-24">
          <div>
            <div className="mb-7 lg:hidden"><RIHeroMark /></div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Public constitutional layer · EVO-V</p>
            <h1 className="royal-title mt-4 max-w-3xl text-4xl leading-[1.05] text-zinc-50 sm:text-5xl lg:text-6xl">RASTA IMPERIUM</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-300 sm:text-xl">Constitutional intelligence infrastructure built around deterministic governance, verifiable evidence, and accountable machine decision-making.</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">Constitution · Intelligence · Verification</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/verify/" className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#F2D675]">Verify the evidence</Link>
              <Link href="/blueprint" className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/50 px-6 py-3 text-sm font-semibold text-[#F2D675]">Explore the system</Link>
              <Link href="/audit/" className="text-sm text-zinc-500 transition hover:text-[#F2D675]">Auditor access →</Link>
            </div>
          </div>
          <div className="hidden lg:block"><RIHeroMark /></div>
        </div>
      </section>

      {/* 02 — TRUST RAIL */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/40"><div className="container-page py-8"><TrustRail /></div></section>

      {/* 03 — WHAT IS IT */}
      <section className="border-b border-zinc-900" aria-labelledby="what-heading"><div className="container-page py-14 sm:py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Orientation</p>
        <h2 id="what-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">What is Rasta Imperium?</h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">Rasta Imperium</p><p className="mt-2 text-sm leading-7 text-zinc-300">The public constitutional and verification surface. A civilization-scale project concerned with how autonomous systems remain accountable to explicit rules and inspectable records.</p></div>
          <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">EVO-V</p><p className="mt-2 text-sm leading-7 text-zinc-300">The technical kernel and architecture under development. This website is not the production execution runtime. It is the place where claims meet sealed evidence.</p></div>
          <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">Evidence</p><p className="mt-2 text-sm leading-7 text-zinc-300">Claims are labelled VERIFIED, DEMONSTRATION, or UNAVAILABLE. Verified means a frozen public capsule can be reproduced offline by independent pure verifiers.</p></div>
        </div>
      </div></section>

      {/* 04 — SYSTEM MAP */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/30" aria-labelledby="system-heading"><div className="container-page py-14 sm:py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Architecture</p>
        <h2 id="system-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">Nine-layer civilization stack</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">From human interface to cosmology. Status reflects publicly frozen evidence on this surface — not importance ranking. L7 currently holds the strongest sealed capsules.</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{layers.map((layer) => <LayerCard key={layer.id} id={layer.id} title={layer.title} description={layer.description} status={layer.status} href={layer.href} emphasize={layer.emphasize} />)}</div>
        <div className="mt-8"><Link href="/blueprint" className="text-sm text-[#F2D675] hover:underline">Explore the system →</Link></div>
      </div></section>

      {/* 05 — EVIDENCE OBSERVATORY */}
      <section className="border-b border-zinc-900" aria-labelledby="evidence-heading"><div className="container-page py-14 sm:py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Evidence observatory</p>
        <h2 id="evidence-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">What is established</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Inspect what is established. Distinguish it from what remains demonstration or unavailable. Capsule-scoped only — not production LIVE telemetry.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ArtifactCard id="ART-L7-REPLAY-001" type="Deterministic replay" layer="L7 · Identity + Trust" status="VERIFIED" description="Valid-path deterministic replay (INV-001). Independent Node + Python hash agreement." verifyHref="/verify/" reproduceHref="/audit/" limitationsHref="/limitations/" />
          <ArtifactCard id="ART-L7-REJECT-001" type="Illegal transition rejection" layer="L7 · Identity + Trust" status="VERIFIED" description="Illegal lifecycle edge rejection with sealed receipt. State must not mutate." verifyHref="/verify/" reproduceHref="/audit/" limitationsHref="/limitations/" />
        </div>
        <div className="mt-8 max-w-3xl"><EvidenceChain artifactId="ART-L7-PARITY-001" status="VERIFIED" claim="Cross-implementation parity: Node and Python pure verifiers produce identical sealed hashes for the same capsule." evidence="Sealed public capsule ART-L7-PARITY-001 with frozen expected hashes." verification="Independent Node and Python runs; exit 0 only when hashes match." reproduction="Offline pure verifiers — no network, no mutation of the artifact." limitations="Capsule-scoped only. Does not prove production EVO-V health, LIVE telemetry, or full-kernel parity." /></div>
        <div className="mt-8 flex flex-wrap gap-4 text-sm"><Link href="/proof/" className="text-[#F2D675] hover:underline">Proof Registry →</Link><Link href="/verify/" className="text-zinc-400 hover:text-[#F2D675]">Verify →</Link><Link href="/audit/" className="text-zinc-400 hover:text-[#F2D675]">Auditor handoff →</Link></div>
      </div></section>

      {/* 06 — VERIFY CTA */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/40" aria-labelledby="verify-heading"><div className="container-page py-14 sm:py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Verification</p>
        <h2 id="verify-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">Do not take the claim.<span className="mt-1 block text-[#F2D675]">Verify it.</span></h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">Download a sealed capsule, run a pure verifier offline, and compare deterministic results. The website UI is not the proof — the hashes are.</p>
        <div className="mt-8"><Link href="/verify/" className="royal-button royal-button-primary inline-block rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#F2D675]">Open verification console →</Link></div>
      </div></section>

      {/* 07 — REPRODUCE OFFLINE */}
      <section className="border-b border-zinc-900" aria-labelledby="reproduce-heading"><div className="container-page py-14 sm:py-16"><h2 id="reproduce-heading" className="sr-only">Reproduce offline</h2><ReproduceOffline /></div></section>

      {/* 08 — LIMITATIONS */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/30" aria-labelledby="limits-heading"><div className="container-page py-14 sm:py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Epistemic hygiene</p>
        <h2 id="limits-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">What this does not prove</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">A serious verification system makes its boundaries visible. Unproven does not mean false — it means sealed public artifacts are not yet attached.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-800/35 bg-emerald-950/15 p-5"><StatusBadge status="VERIFIED" /><p className="mt-3 text-sm font-semibold text-zinc-100">Established</p><p className="mt-1 text-xs leading-5 text-zinc-400">Three L7 capsules with independent Node + Python reproductions. Capsule-scoped only.</p></div>
          <div className="rounded-xl border border-amber-900/35 bg-amber-950/10 p-5"><StatusBadge status="DEMONSTRATION" /><p className="mt-3 text-sm font-semibold text-zinc-100">Demonstrated</p><p className="mt-1 text-xs leading-5 text-zinc-400">Ledger and FSM design documentation. Not production evidence.</p></div>
          <div className="rounded-xl border border-zinc-700 bg-black/20 p-5"><StatusBadge status="UNAVAILABLE" /><p className="mt-3 text-sm font-semibold text-zinc-100">Unavailable</p><p className="mt-1 text-xs leading-5 text-zinc-400">Performance benchmarks, LIVE telemetry, full-kernel parity, certification claims.</p></div>
        </div>
        <div className="mt-8"><Link href="/limitations/" className="text-sm text-[#F2D675] hover:underline">Read the limitations →</Link></div>
      </div></section>

      {/* 09 — CODEX */}
      <section className="border-b border-zinc-900" aria-labelledby="codex-heading"><div className="container-page py-14 sm:py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Constitution</p>
        <h2 id="codex-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">The Rastafarai Codex</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">Seven Articles defining the constitutional principles surrounding the system. These are design principles — not automatically proven production properties. Where sealed capsules exist, status is labelled.</p>
        <div className="mt-8"><Link href="/codex" className="royal-button royal-button-ghost inline-block rounded-lg border border-[#B8860B]/50 px-6 py-3 text-sm font-semibold text-[#F2D675]">Enter the Codex →</Link></div>
      </div></section>

      {/* 10 — INSTITUTIONAL */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/20" aria-labelledby="inst-heading"><div className="container-page py-14 sm:py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Institutional path</p>
        <h2 id="inst-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">From principle to practice</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">For organisations exploring constitutional intelligence systems, governance architecture, verification, or fixed-scope design partner pilots. Evidence first; commercial engagement only after scope is written and Limitations are read.</p>
        <div className="mt-8"><Link href="/institutional-pilots" className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-200 transition hover:border-[#B8860B]/40 hover:text-[#F2D675]">Explore institutional pilots →</Link></div>
      </div></section>
    </main>
  );
}
