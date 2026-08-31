import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sovereign AI Blueprint — EVO-V v9",
  description:
    "Constitutional Computation: the Rasta Imperium / EVO-V v9 Blueprint. A relationally closed physics of plural epistemic civilisation — 9-layer sovereign stack, proof-carrying execution, and deterministic governance.",
};

const layers = [
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
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[8%] top-0 h-80 w-80 rounded-full bg-[#107e3e]/12 blur-3xl" />
          <div className="absolute right-[6%] top-16 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="container-page relative py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
                Blueprint / EVO-V v9
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl leading-[0.98] text-zinc-100 sm:text-6xl lg:text-7xl">
                Sovereign AI.{" "}
                <span className="text-gold-gradient">Constitutional Computation.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
                The Rasta Imperium / EVO-V v9 Blueprint — a relationally closed physics of plural
                epistemic civilisation. Deterministic governance, proof-carrying execution, and a
                9-layer sovereign intelligence stack.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#F2D675] hover:shadow-lg hover:shadow-[#B8860B]/20 active:scale-[0.97]"
                >
                  Blueprint PDF (14p)
                </a>
                <a
                  href={tabernacleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#107e3e] px-6 py-3 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#0d6b34] hover:shadow-lg hover:shadow-[#107e3e]/30 active:scale-[0.97]"
                >
                  Digital Tabernacle (15p)
                </a>
                <a
                  href={livingCrystalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#D4AF37]/60 bg-[#0b0c0b] px-6 py-3 text-sm font-bold text-[#F2D675] transition duration-200 hover:-translate-y-0.5 hover:border-[#F2D675] hover:bg-[#D4AF37]/10 hover:shadow-lg hover:shadow-[#B8860B]/15 active:scale-[0.97]"
                >
                  Living Crystal Blueprint (21p)
                </a>
                <Link
                  href="/technology"
                  className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/70 hover:text-[#F2D675] active:scale-[0.97]"
                >
                  Explore technology
                </Link>
              </div>
            </div>

            <div className="relative border border-[#B8860B]/30 bg-[#0b0c0b]/80 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-5">
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
              <p className="mt-3 text-center font-courier text-[0.65rem] uppercase tracking-[0.2em] text-[#D4AF37]/80">
                9-Layer Sovereign Stack
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-page py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
            Core thesis
          </p>
          <h2 className="mt-5 text-3xl leading-tight text-zinc-100 sm:text-4xl">
            From procedural models to constitutional systems.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="panel p-7 transition duration-300 hover:scale-[1.02] sm:p-8"
            >
              <h3 className="text-xl text-gold">{p.title}</h3>
              <p className="mt-4 leading-7 text-zinc-400">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 9 Layers */}
      <section className="border-y border-[#B8860B]/15 bg-black/25">
        <div className="container-page py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Architecture
            </p>
            <h2 className="mt-5 text-3xl text-zinc-100 sm:text-4xl">
              The 9-layer sovereign intelligence stack
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-400">
              Each layer is a jurisdictional envelope. Together they form a closed constitutional
              physics in which computation, security, and epistemic integrity are inseparable.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className="group relative border border-[#B8860B]/20 bg-[#0b0c0b]/90 p-6 transition duration-300 hover:border-[#D4AF37]/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-courier text-sm text-[#D4AF37]">{layer.id}</span>
                  <span className="rounded border border-[#B8860B]/25 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-zinc-500">
                    {layer.role}
                  </span>
                </div>
                <h3 className="mt-4 text-lg text-zinc-100 group-hover:text-[#F2D675] transition-colors">
                  {layer.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof & Lockdown */}
      <section className="container-page py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Execution semantics
            </p>
            <h2 className="mt-5 text-3xl leading-tight text-zinc-100 sm:text-4xl">
              Proof-carrying execution & lockdown
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              Every consequential transition produces a cryptographic receipt. Capability checks
              precede action. Hash-chained evidence enables full replay. The Autonomy Dial and
              lockdown semantics keep a human horizon on the system at every scale.
            </p>
            <ul className="mt-8 space-y-3 text-zinc-400">
              <li className="flex gap-3">
                <span className="text-[#D4AF37]">→</span>
                Cryptographic proof verification before state change
              </li>
              <li className="flex gap-3">
                <span className="text-[#D4AF37]">→</span>
                Capability and jurisdictional boundary enforcement
              </li>
              <li className="flex gap-3">
                <span className="text-[#D4AF37]">→</span>
                Hash-chained receipts for court-grade evidence
              </li>
              <li className="flex gap-3">
                <span className="text-[#D4AF37]">→</span>
                Graduated autonomy under continuous human oversight
              </li>
            </ul>
          </div>

          <div className="relative border border-[#B8860B]/30 bg-[#0b0c0b]/80 p-8 shadow-2xl shadow-black/30">
            <div className="absolute left-0 top-0 h-1 w-24 bg-gradient-to-r from-[#107e3e] via-[#D4AF37] to-[#e01e1e]" />
            <p className="font-courier text-[0.68rem] uppercase tracking-[0.22em] text-[#D4AF37]">
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

      {/* CTA */}
      <section className="border-t border-[#B8860B]/20 bg-black/30">
        <div className="container-page py-20 text-center lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
            Full documents
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl leading-tight text-zinc-100 sm:text-4xl">
            Sovereign doctrine & constitutional architecture
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Download the 14-page Sovereign AI Blueprint, the 15-page Digital Tabernacle, and the
            21-page Living Crystal Blueprint (RASTA IMPERIUM v2.1.7) — Nine-layer stack, recursive
            safety, ironclad isolation, and production-grade Omega infrastructure.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#D4AF37] px-8 py-3.5 text-sm font-bold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#F2D675] hover:shadow-lg hover:shadow-[#B8860B]/20 active:scale-[0.97]"
            >
              Sovereign AI Blueprint (14p)
            </a>
            <a
              href={tabernacleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#107e3e] px-8 py-3.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#0d6b34] hover:shadow-lg hover:shadow-[#107e3e]/30 active:scale-[0.97]"
            >
              Digital Tabernacle (15p)
            </a>
            <a
              href={livingCrystalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#D4AF37]/60 bg-[#0b0c0b] px-8 py-3.5 text-sm font-bold text-[#F2D675] transition duration-200 hover:-translate-y-0.5 hover:border-[#F2D675] hover:bg-[#D4AF37]/10 hover:shadow-lg hover:shadow-[#B8860B]/15 active:scale-[0.97]"
            >
              Living Crystal Blueprint (21p)
            </a>
            <Link
              href="/library"
              className="rounded-lg border border-zinc-600 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition duration-200 hover:border-[#D4AF37]/70 hover:text-[#F2D675] active:scale-[0.97]"
            >
              Visit the Library
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-zinc-600 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition duration-200 hover:border-[#D4AF37]/70 hover:text-[#F2D675] active:scale-[0.97]"
            >
              Discuss institutional use
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
