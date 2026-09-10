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
    "Deterministic governance for systems whose decisions must remain reconstructible, inspectable and accountable. Inspect sealed L7 capsules. Reproduce offline. No opaque autonomy.",
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

const flowSteps = [
  { step: "01", title: "Action", detail: "A system acts within a governed domain." },
  { step: "02", title: "Decision", detail: "A decision is recorded against explicit rules." },
  { step: "03", title: "Evidence", detail: "A sealed record is produced — not a narrative." },
  { step: "04", title: "Verification", detail: "Independent pure verifiers reproduce the hashes." },
  { step: "05", title: "Replay", detail: "The path can be reconstructed offline." },
] as const;

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
            <div className="mb-7 lg:hidden">
              <RIHeroMark />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
              Public constitutional layer · EVO-V
            </p>
            <h1 className="royal-title mt-4 max-w-3xl text-4xl leading-[1.08] text-zinc-50 sm:text-5xl lg:text-6xl">
              Do not trust the claim.
              <span className="mt-1 block text-[#F2D675]">Inspect the evidence.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300 sm:text-xl">
              Deterministic governance for systems whose decisions must remain reconstructible,
              inspectable, and accountable.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
              Rasta Imperium is the public constitutional and verification surface around EVO-V —
              not the production execution runtime.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/verify/"
                className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#F2D675]"
              >
                Verify the evidence
              </Link>
              <Link
                href="/blueprint"
                className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/50 px-6 py-3 text-sm font-semibold text-[#F2D675]"
              >
                Explore the system
              </Link>
              <Link href="/audit/" className="text-sm text-zinc-500 transition hover:text-[#F2D675]">
                Auditor access →
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <RIHeroMark />
          </div>
        </div>
      </section>

      {/* 02 — TRUST RAIL */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/40">
        <div className="container-page py-8">
          <TrustRail />
        </div>
      </section>

      {/* 03 — WHAT IS IT */}
      <section className="border-b border-zinc-900" aria-labelledby="what-heading">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Orientation</p>
          <h2 id="what-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            What is Rasta Imperium?
          </h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">Rasta Imperium</p>
              <p className="mt-2 text-sm leading-7 text-zinc-300">
                The public constitutional and verification surface. Where claims meet sealed evidence —
                not a place that asks institutions to trust an opaque AI system.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">EVO-V</p>
              <p className="mt-2 text-sm leading-7 text-zinc-300">
                The technical kernel and architecture under development. This website is not the
                production execution runtime. It is the inspectable boundary around it.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">Evidence</p>
              <p className="mt-2 text-sm leading-7 text-zinc-300">
                Claims are labelled VERIFIED, DEMONSTRATION, or UNAVAILABLE. Verified means a frozen
                public capsule can be reproduced offline by independent pure verifiers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — WHY IT MATTERS */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/30" aria-labelledby="why-heading">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Why it matters</p>
          <h2 id="why-heading" className="mt-3 max-w-3xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            Opaque autonomy leaves institutions without a reconstructible record.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            The more autonomous a system becomes, the more important it becomes to reconstruct what
            happened and why. Opaque decision histories create liability, audit failure, and loss of
            governance control — not because autonomy is inherently bad, but because uninspectable
            autonomy cannot be governed.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Provenance", detail: "Know which rules and inputs shaped a decision." },
              { title: "Reconstructibility", detail: "Replay the path offline from sealed evidence." },
              { title: "Auditability", detail: "Independent parties can verify without trusting the UI." },
              { title: "Accountability", detail: "Boundaries are written; unavailable claims are labelled." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[rgba(242,214,117,0.15)] bg-black/20 p-5"
              >
                <p className="text-sm font-semibold text-[#F2D675]">{item.title}</p>
                <p className="mt-2 text-xs leading-5 text-zinc-400">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-xs leading-6 text-zinc-500">
            Rasta Imperium does not claim to solve every AI governance problem. It focuses on
            deterministic governance, sealed evidence, and independent verification where those
            properties can be demonstrated.
          </p>
        </div>
      </section>

      {/* 05 — HOW IT WORKS */}
      <section className="border-b border-zinc-900" aria-labelledby="how-heading">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">How it works</p>
          <h2 id="how-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            From action to replay
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            A simple path. The website UI is not the proof — sealed capsules and independent verifiers
            are.
          </p>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {flowSteps.map((item) => (
              <li
                key={item.step}
                className="rounded-xl border border-zinc-800 bg-[#0b0c0b]/50 p-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B88718]">
                  {item.step}
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-100">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{item.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 — PROVEN (Evidence observatory) */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/30" aria-labelledby="evidence-heading">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Proven · Evidence observatory
          </p>
          <h2 id="evidence-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            What can already be inspected
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Inspect what is established. Distinguish it from what remains demonstration or unavailable.
            Capsule-scoped only — not production LIVE telemetry.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ArtifactCard
              id="ART-L7-REPLAY-001"
              type="Deterministic replay"
              layer="L7 · Identity + Trust"
              status="VERIFIED"
              description="Valid-path deterministic replay (INV-001). Independent Node + Python hash agreement."
              verifyHref="/verify/"
              reproduceHref="/audit/"
              limitationsHref="/limitations/"
            />
            <ArtifactCard
              id="ART-L7-REJECT-001"
              type="Illegal transition rejection"
              layer="L7 · Identity + Trust"
              status="VERIFIED"
              description="Illegal lifecycle edge rejection with sealed receipt. State must not mutate."
              verifyHref="/verify/"
              reproduceHref="/audit/"
              limitationsHref="/limitations/"
            />
          </div>
          <div className="mt-8 max-w-3xl">
            <EvidenceChain
              artifactId="ART-L7-PARITY-001"
              status="VERIFIED"
              claim="Cross-implementation parity: Node and Python pure verifiers produce identical sealed hashes for the same capsule."
              evidence="Sealed public capsule ART-L7-PARITY-001 with frozen expected hashes."
              verification="Independent Node and Python runs; exit 0 only when hashes match."
              reproduction="Offline pure verifiers — no network, no mutation of the artifact."
              limitations="Capsule-scoped only. Does not prove production EVO-V health, LIVE telemetry, or full-kernel parity."
            />
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/proof/" className="text-[#F2D675] hover:underline">
              Proof Registry →
            </Link>
            <Link href="/verify/" className="text-zinc-400 hover:text-[#F2D675]">
              Verify →
            </Link>
            <Link href="/audit/" className="text-zinc-400 hover:text-[#F2D675]">
              Auditor handoff →
            </Link>
          </div>
        </div>
      </section>

      {/* 07 — VERIFY CTA */}
      <section className="border-b border-zinc-900" aria-labelledby="verify-heading">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Verification</p>
          <h2 id="verify-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            Do not take the claim.
            <span className="mt-1 block text-[#F2D675]">Verify it.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
            Download a sealed capsule, run a pure verifier offline, and compare deterministic results.
            The website UI is not the proof — the hashes are.
          </p>
          <div className="mt-8">
            <Link
              href="/verify/"
              className="royal-button royal-button-primary inline-block rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#F2D675]"
            >
              Open verification console →
            </Link>
          </div>
        </div>
      </section>

      {/* 08 — REPRODUCE OFFLINE */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/40" aria-labelledby="reproduce-heading">
        <div className="container-page py-14 sm:py-16">
          <h2 id="reproduce-heading" className="sr-only">
            Reproduce offline
          </h2>
          <ReproduceOffline />
        </div>
      </section>

      {/* 09 — TRUST / LIMITATIONS */}
      <section className="border-b border-zinc-900" aria-labelledby="limits-heading">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Trust · Epistemic hygiene</p>
          <h2 id="limits-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            What is independently inspectable — and what is not
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            A serious verification system makes its boundaries visible. Unproven does not mean false —
            it means sealed public artifacts are not yet attached.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-800/35 bg-emerald-950/15 p-5">
              <StatusBadge status="VERIFIED" />
              <p className="mt-3 text-sm font-semibold text-zinc-100">Established</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Three L7 capsules with independent Node + Python reproductions. Capsule-scoped only.
              </p>
            </div>
            <div className="rounded-xl border border-amber-900/35 bg-amber-950/10 p-5">
              <StatusBadge status="DEMONSTRATION" />
              <p className="mt-3 text-sm font-semibold text-zinc-100">Demonstrated</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Ledger and FSM design documentation. Not production evidence.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-black/20 p-5">
              <StatusBadge status="UNAVAILABLE" />
              <p className="mt-3 text-sm font-semibold text-zinc-100">Unavailable</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Performance benchmarks, LIVE telemetry, full-kernel parity, certification claims.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/limitations/" className="text-[#F2D675] hover:underline">
              Read the limitations →
            </Link>
            <Link href="/trust/" className="text-zinc-400 hover:text-[#F2D675]">
              Trust console →
            </Link>
          </div>
        </div>
      </section>

      {/* 10 — SYSTEM MAP (architecture depth, later in page) */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/30" aria-labelledby="system-heading">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Architecture</p>
          <h2 id="system-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            Nine-layer civilization stack
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            From human interface to cosmology. Status reflects publicly frozen evidence on this surface
            — not importance ranking. L7 currently holds the strongest sealed capsules.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {layers.map((layer) => (
              <LayerCard
                key={layer.id}
                id={layer.id}
                title={layer.title}
                description={layer.description}
                status={layer.status}
                href={layer.href}
                emphasize={layer.emphasize}
              />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/blueprint" className="text-sm text-[#F2D675] hover:underline">
              Explore the system →
            </Link>
          </div>
        </div>
      </section>

      {/* 11 — CODEX */}
      <section className="border-b border-zinc-900" aria-labelledby="codex-heading">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">Constitution</p>
          <h2 id="codex-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            The Rastafarai Codex
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Seven Articles defining the constitutional principles surrounding the system. These are
            design principles — not automatically proven production properties. Where sealed capsules
            exist, status is labelled.
          </p>
          <div className="mt-8">
            <Link
              href="/codex"
              className="royal-button royal-button-ghost inline-block rounded-lg border border-[#B8860B]/50 px-6 py-3 text-sm font-semibold text-[#F2D675]"
            >
              Enter the Codex →
            </Link>
          </div>
        </div>
      </section>

      {/* 12 — PILOT */}
      <section className="border-b border-zinc-900 bg-[#0b0c0b]/20" aria-labelledby="inst-heading">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Institutional path
          </p>
          <h2 id="inst-heading" className="mt-3 max-w-2xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            Bounded design partner pilots
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            For organisations that need reconstructible governance on a defined subset of their stack.
            Scope and success criteria are written before any claim of operational adoption. Evidence
            first; commercial engagement only after Limitations are read.
          </p>
          <ul className="mt-6 max-w-xl space-y-2 text-sm text-zinc-400">
            <li className="flex gap-2">
              <span className="text-[#B88718]" aria-hidden="true">
                →
              </span>
              Fixed scope, written constitution map, challenge path
            </li>
            <li className="flex gap-2">
              <span className="text-[#B88718]" aria-hidden="true">
                →
              </span>
              No production guarantees without sealed artifacts
            </li>
            <li className="flex gap-2">
              <span className="text-[#B88718]" aria-hidden="true">
                →
              </span>
              Separation between demonstration and deployment
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/institutional-pilots"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#F2D675]"
            >
              Discuss an institutional pilot
            </Link>
            <Link
              href="/limitations/"
              className="text-sm text-zinc-500 transition hover:text-[#F2D675]"
            >
              Read Limitations first →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
