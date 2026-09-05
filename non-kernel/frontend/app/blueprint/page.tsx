import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { architectureLayers } from "../../data/evidence/architecture";
import { ArchitectureLayerCard } from "../../components/evidence/ArchitectureLayerCard";
import { TrustStatus } from "../../components/evidence/TrustStatus";

export const metadata: Metadata = {
  title: "Sovereign AI Blueprint — Verifiable Architecture",
  description:
    "Constitutional Computation: EVO-V / Rasta Imperium 9-layer stack with evidence-linked Purpose → Invariants → Evidence → Verification → Challenge.",
  openGraph: {
    title: "Sovereign AI Blueprint — Verifiable Architecture",
    description:
      "Drill L1–L9 from purpose to evidence. Missing artifacts labelled UNAVAILABLE.",
    url: "https://rastaimperium.com/blueprint/",
  },
};

const productLayers = [
  {
    id: "01",
    name: "Rastafari Codex",
    role: "Ontological substrate",
    description:
      "Foundational principles and values that define admissible states of knowledge and action.",
  },
  {
    id: "02",
    name: "Living Dashboard",
    role: "Observability & coherence",
    description:
      "Real-time visibility into system state, drift, and constitutional compliance.",
  },
  {
    id: "03",
    name: "Liquid Neural Networks",
    role: "Adaptive perception",
    description:
      "Continuous learning substrates constrained by constitutional boundaries.",
  },
  {
    id: "04",
    name: "Causal RL",
    role: "Decision under intervention",
    description:
      "Reinforcement learning that respects causal structure and policy constraints.",
  },
  {
    id: "05",
    name: "Epistemic Falsification Engine",
    role: "Admissibility filter",
    description:
      "DriftScore, ICA, EMT and Energy Law mapping of admissible vs inadmissible states.",
  },
  {
    id: "06",
    name: "Proof-Carrying Execution",
    role: "Cryptographic witness",
    description:
      "Capability checks, hash-chained receipts, and verifiable replay of every consequential transition.",
  },
  {
    id: "07",
    name: "Jurisdictional Envelopes",
    role: "Boundary control",
    description:
      "Explicit limits on what the system may perceive, decide, and act upon.",
  },
  {
    id: "08",
    name: "Deep Seed Operating Layer",
    role: "Monetisation & continuity",
    description:
      "SaaS, dual licensing, and institutional pathways that sustain the civilisation kernel.",
  },
  {
    id: "09",
    name: "Autonomy Dial",
    role: "Human-in-the-loop",
    description:
      "Lockdown semantics and graduated autonomy under continuous human oversight.",
  },
];

const pillars = [
  {
    title: "Constitutional Computation",
    body: "Transforms procedural AI into deterministic, verifiable, replayable governance systems. Every state transition carries proof of compliance with the codex.",
  },
  {
    title: "Relational Closure",
    body: "Computation is dynamical-system evolution; security is proof plus capability enforcement. The system is closed under its own constitutional physics.",
  },
  {
    title: "Plural Epistemic Civilisation",
    body: "Supports multiple legitimate knowledge traditions under a shared substrate of verifiability, falsifiability, and accountable autonomy.",
  },
];

const pdfUrl =
  "https://drive.google.com/file/d/1AMGgLZTjuGazMZDJKhnDuIOivCnW9rL-/view?usp=drivesdk";

const tabernacleUrl =
  "https://drive.google.com/file/d/1KIw9Aun87Md5RlL7KK4u6wK-NIjdBe-m/view?usp=drivesdk";

const livingCrystalUrl =
  "https://drive.google.com/file/d/1xycb92ZMLx0yof4ehlpB8w3E0Gl7t3G0/view?usp=drivesdk";

export default function BlueprintPage() {
  const linked = architectureLayers.filter((l) => l.evidenceIds.length > 0).length;
  const unavailable = architectureLayers.filter((l) => l.provenance === "UNAVAILABLE").length;

  return (
    <main className="royal-page overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[8%] top-0 h-80 w-80 rounded-full bg-[#107e3e]/12 blur-3xl" />
          <div className="absolute right-[6%] top-16 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="container-page relative py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
                Blueprint · Phase 9 verifiable architecture
              </p>
              <h1 className="mt-6 max-w-4xl font-cinzel text-4xl leading-[0.98] text-zinc-100 sm:text-5xl lg:text-6xl">
                Sovereign AI.{" "}
                <span className="text-gold-gradient">Constitutional Computation.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
                Rasta Imperium is the public constitutional and verification layer for EVO-V — not
                the execution runtime. Drill each civilization layer from purpose to evidence,
                verification, and challenge. Missing evidence is labelled UNAVAILABLE.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#verifiable-stack"
                  className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
                >
                  Evidence-linked stack
                </a>
                <Link
                  href="/governance-model/"
                  className="rounded-lg border border-[#B8860B]/50 px-5 py-3 text-sm font-semibold text-[#F2D675]"
                >
                  Governance model
                </Link>
                <Link
                  href="/architecture/"
                  className="rounded-lg border border-zinc-600 px-5 py-3 text-sm font-semibold text-zinc-100"
                >
                  Architecture split
                </Link>
              </div>
            </div>

            <div className="royal-panel relative border p-4 shadow-2xl shadow-black/30 sm:p-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-[#B8860B]/20">
                <Image
                  src="/images/blueprint-9layer.jpg"
                  alt="EVO-V 9-layer Sovereign Intelligence Stack"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
              <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#D4AF37]/80">
                9-Layer Sovereign Stack
              </p>
            </div>
          </div>

          <div className="mt-12">
            <TrustStatus compact />
          </div>
        </div>
      </section>

      <section id="verifiable-stack" className="border-b border-[#B8860B]/15 bg-black/30">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
            Verifiable architecture
          </p>
          <h2 className="mt-5 max-w-3xl font-cinzel text-3xl text-zinc-100 sm:text-4xl">
            L1–L9 · Purpose → Evidence → Verify → Challenge
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
            Civilization stack used on the public platform. Expand a layer to inspect inputs,
            outputs, invariants, linked evidence IDs, implementation notes, and challenge entry
            points. {linked} layers currently link public evidence records; {unavailable} layers
            remain UNAVAILABLE until artifacts are published.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <Link href="#L7" className="rounded border border-[#B8860B]/40 px-3 py-1.5 text-[#F2D675]">
              Jump to L7 Identity + Trust
            </Link>
            <Link href="/proof/" className="rounded border border-zinc-700 px-3 py-1.5 text-zinc-300">
              Proof Registry
            </Link>
            <Link href="/pillars/" className="rounded border border-zinc-700 px-3 py-1.5 text-zinc-300">
              Seven Articles
            </Link>
            <Link href="/challenge/" className="rounded border border-zinc-700 px-3 py-1.5 text-zinc-300">
              Challenge Lab
            </Link>
          </div>

          <div className="mt-10 space-y-3">
            {architectureLayers.map((layer) => (
              <ArchitectureLayerCard
                key={layer.layerId}
                layer={layer}
                defaultOpen={layer.layerId === "L7"}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
            Core thesis
          </p>
          <h2 className="mt-5 font-cinzel text-3xl leading-tight text-zinc-100 sm:text-4xl">
            From procedural models to constitutional systems.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pillars.map((p) => (
            <article key={p.title} className="royal-panel rounded-xl border p-7 sm:p-8">
              <h3 className="text-xl text-[#F2D675]">{p.title}</h3>
              <p className="mt-4 leading-7 text-zinc-400">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#B8860B]/15 bg-black/25">
        <div className="container-page py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Doctrine product layers
            </p>
            <h2 className="mt-5 font-cinzel text-3xl text-zinc-100 sm:text-4xl">
              Blueprint PDF stack (documentation view)
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-400">
              Naming from the published Sovereign AI Blueprint documents. This view is doctrinal
              orientation — verification still flows through the civilization stack and Trust
              surfaces above.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productLayers.map((layer) => (
              <div
                key={layer.id}
                className="royal-panel rounded-xl border p-6 transition hover:border-[#D4AF37]/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-sm text-[#D4AF37]">{layer.id}</span>
                  <span className="rounded border border-[#B8860B]/25 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-zinc-500">
                    {layer.role}
                  </span>
                </div>
                <h3 className="mt-4 text-lg text-zinc-100">{layer.name}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Execution semantics
            </p>
            <h2 className="mt-5 font-cinzel text-3xl leading-tight text-zinc-100 sm:text-4xl">
              Proof-carrying execution & lockdown
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              Every consequential transition is designed to produce a cryptographic receipt.
              Capability checks precede action. Hash-chained evidence enables full replay where
              sealed. Public inspection of what is published today starts at L7 and the Trust
              Console — not at marketing metrics.
            </p>
            <ul className="mt-8 space-y-3 text-zinc-400">
              <li className="flex gap-3">
                <span className="text-[#D4AF37]">→</span>
                Cryptographic proof verification before state change (where sealed)
              </li>
              <li className="flex gap-3">
                <span className="text-[#D4AF37]">→</span>
                Capability and jurisdictional boundary enforcement
              </li>
              <li className="flex gap-3">
                <span className="text-[#D4AF37]">→</span>
                Hash-chained receipts for reconstructible evidence
              </li>
              <li className="flex gap-3">
                <span className="text-[#D4AF37]">→</span>
                Graduated autonomy under continuous human oversight
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/challenge/"
                className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
              >
                Challenge Lab
              </Link>
              <Link
                href="/institutional-pilots/"
                className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
              >
                Institutional pilots
              </Link>
              <Link
                href="/product/"
                className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
              >
                Product
              </Link>
            </div>
          </div>

          <div className="royal-panel relative border p-8 shadow-2xl shadow-black/30">
            <div className="absolute left-0 top-0 h-1 w-24 bg-gradient-to-r from-[#107e3e] via-[#D4AF37] to-[#e01e1e]" />
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#D4AF37]">
              Unified equation
            </p>
            <p className="mt-6 text-2xl leading-snug text-zinc-100 sm:text-3xl">
              Computation = Dynamical System Evolution
            </p>
            <p className="mt-4 text-xl text-zinc-300">
              Security = Proof + Capability Enforcement
            </p>
            <p className="mt-8 text-sm leading-7 text-zinc-500">
              The system is relationally closed: every output is a function of constitutional
              inputs, admissible transitions, and recorded evidence. Drift is measurable;
              inadmissible states are rejected before they become history.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#B8860B]/20 bg-black/30">
        <div className="container-page py-16 text-center lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
            Full documents
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl font-cinzel text-3xl leading-tight text-zinc-100 sm:text-4xl">
            Sovereign doctrine & constitutional architecture
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Download the published PDFs for full doctrine. Public machine-checkable claims remain
            bound to the evidence manifest and Trust surfaces.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#D4AF37] px-8 py-3.5 text-sm font-bold text-black transition hover:bg-[#F2D675]"
            >
              Sovereign AI Blueprint (14p)
            </a>
            <a
              href={tabernacleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#107e3e] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#0d6b34]"
            >
              Digital Tabernacle (15p)
            </a>
            <a
              href={livingCrystalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#D4AF37]/60 px-8 py-3.5 text-sm font-bold text-[#F2D675] transition hover:bg-[#D4AF37]/10"
            >
              Living Crystal Blueprint (21p)
            </a>
            <Link
              href="/evidence/"
              className="rounded-lg border border-zinc-600 px-6 py-3.5 text-sm font-semibold text-zinc-200"
            >
              Evidence Explorer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
