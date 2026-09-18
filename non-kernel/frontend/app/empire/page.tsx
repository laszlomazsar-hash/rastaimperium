// @ts-nocheck
"use client";

import { useState } from "react";

import { SovereignIcon } from "../../components/icons/SovereignIcon";
import type { IconKey } from "../../components/icons/iconMap";

/**
 * Empire surface — cosmology, lineage, and constitutional narrative.
 * Not an evidence registry. Quantitative performance and production
 * authority claims are intentionally absent; see /proof/, /observatory/,
 * and /limitations/ for sealed public evidence.
 */

const stabilityRegimes = [
  {
    name: "Stable Attractor",
    lambda: "λ < -0.2",
    color: "#107e3e",
    desc: "Conceptual regime: trajectories converge under declared constraints. Illustrative model only — not a measured production state.",
  },
  {
    name: "False Stable",
    lambda: "-0.2 ≤ λ < 0",
    color: "#B8860B",
    desc: "Conceptual regime: apparent calm with latent risk. Illustrative model only — not production monitoring.",
  },
  {
    name: "Structured Chaos",
    lambda: "0 ≤ λ < 0.5",
    color: "#e07c1e",
    desc: "Conceptual regime: exploration within bounds. Illustrative model only — not verified operational behaviour.",
  },
  {
    name: "Explosive",
    lambda: "λ ≥ 0.5",
    color: "#e01e1e",
    desc: "Conceptual regime: intended lockdown semantics under severe drift. Design doctrine — not a sealed production control claim.",
  },
];

const kernelLayers = [
  {
    name: "L1: EVO-V Ultra Kernel",
    posture: "CONSTITUTIONAL / INTENT",
    desc: "Conceptual base operating layer in the nine-layer model — architectural framing, not a publicly verified runtime measurement.",
  },
  {
    name: "L2: Liquid Neural Networks",
    posture: "CONSTITUTIONAL / INTENT",
    desc: "Design concept for adaptive processing under continuous-time dynamics. Not established by sealed public performance evidence.",
  },
  {
    name: "L3: Operational decision layer",
    posture: "VERIFIED — capsule-scoped",
    desc: "Public sealed capsule ART-L3-DECISION-001 establishes deterministic decision evidence under INV-L3-001 only. Does not establish production enforcement or full EVO-V runtime verification.",
  },
  {
    name: "L4: Values & ritual encoding",
    posture: "CONSTITUTIONAL / INTENT",
    desc: "Narrative and design concept for encoding declared values into system rhythms. Not a verified operational metric.",
  },
  {
    name: "L5: Symbolic translation",
    posture: "CONSTITUTIONAL / INTENT",
    desc: "Design concept for cultural and symbolic expression alongside technical outputs. Not sealed performance evidence.",
  },
  {
    name: "L6: Alignment layer",
    posture: "CONSTITUTIONAL / INTENT",
    desc: "Architectural alignment concept. Public evidence does not establish continuous production alignment measurement.",
  },
  {
    name: "L7: Identity + Trust ledgers",
    posture: "VERIFIED / FROZEN",
    desc: "Sealed public capsules ART-L7-REPLAY-001, ART-L7-REJECT-001, and ART-L7-PARITY-001 support capsule-scoped replay, rejection, and cross-implementation parity. Not full-kernel or LIVE production proof.",
  },
  {
    name: "L8: Constitutional layer",
    posture: "UNAVAILABLE",
    desc: "Constitutional design intent (Codex). Not established as verified runtime enforcement on the public evidence surface.",
  },
  {
    name: "L9: Cosmology / observability intent",
    posture: "UNAVAILABLE",
    desc: "Architectural intent for observability and meaning. LIVE operational telemetry remains UNAVAILABLE; demonstration streams elsewhere are not production monitoring.",
  },
];

const foundationCards: { title: string; icon: IconKey; desc: string }[] = [
  {
    title: "Cosmology",
    icon: "cosmology_starfield",
    desc: "A sovereign frame for how value, identity, and responsibility cohere under one constitutional field. Narrative and design orientation — not a performance claim.",
  },
  {
    title: "Lineage",
    icon: "governance_scroll",
    desc: "The founder pathway and continuity from doctrine to product surfaces. Published works provide intellectual context; they are not substitutes for sealed evidence.",
  },
  {
    title: "The Machine Spirit",
    icon: "machine_spirit",
    desc: "A narrative image of deterministic self-governance within declared boundaries. Conceptual framing — not production authority.",
  },
];

const designPrinciples: { title: string; icon: IconKey; desc: string }[] = [
  {
    title: "Self-Representation",
    icon: "self_representation",
    desc: "Design principle: the system should model its own state and capabilities. Architectural intent, not a verified live capability score.",
  },
  {
    title: "Self-Modification",
    icon: "self_modification",
    desc: "Design principle: controlled evolution within an admissible manifold defined by constitutional constraints. Intent, not measured drift performance.",
  },
  {
    title: "Self-Preservation",
    icon: "recovery_shield",
    desc: "Design principle: identity continuity under transformation through declared constraints. Doctrine, not a recovery-time guarantee.",
  },
];

export default function EmpirePage() {
  const [activeRegime, setActiveRegime] = useState(0);
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);

  return (
    <main className="container-page royal-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold-gradient">The Empire</h1>
        <p className="text-zinc-400 mt-3 text-lg">Cosmology, lineage, and constitutional narrative</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
          This surface is narrative and design doctrine. It is not the Evidence Observatory.
          Sealed public proof lives under Proof, Observatory, and Verify. Production authority remains
          NOT ESTABLISHED. LIVE telemetry remains UNAVAILABLE.
        </p>
        <div className="mx-auto mt-4 h-0.5 w-24 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600" />
      </section>

      <section className="panel royal-panel mt-6 p-8 transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl text-gold">The Sovereign Mythic-Technical Foundation</h2>
        <p className="mt-4 leading-relaxed text-zinc-200">
          The Empire is the cosmology layer of Rasta Imperium: lineage, covenant, and narrative
          architecture. Mythic declarations define intent; technical protocols define proposed
          execution. The Rastafarai Codex expresses constitutional design principles intended to
          constrain admissible behaviour — doctrine and architecture, not a claim that hardware
          enforcement or full runtime control has been established by sealed public evidence.
        </p>
      </section>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {foundationCards.map((item) => (
          <article
            key={item.title}
            className="panel royal-panel group cursor-default p-6 transition-all duration-300 hover:scale-105"
          >
            <div className="mb-3 text-3xl group-hover:animate-pulse">
              <SovereignIcon icon={item.icon} className="h-8 w-8" />
            </div>
            <h3 className="text-xl text-gold">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-zinc-300">{item.desc}</p>
          </article>
        ))}
      </div>

      <section className="panel royal-panel mt-8 p-8">
        <h2 className="text-2xl text-gold">Conceptual dynamical framing</h2>
        <p className="mt-4 leading-relaxed text-zinc-200">
          The architecture is often described as a two-timescale dynamical system: a fast core loop
          for local reasoning hypotheses, and a slower update path for calibration. That description
          is conceptual design language. It does not establish measured production throughput,
          latency, fault tolerance, or recovery times on this public surface.
        </p>

        <h3 className="mb-4 mt-8 text-lg text-gold">Stability regimes — conceptual model</h3>
        <p className="mb-4 text-sm text-zinc-500">
          Illustrative categories only. Not LIVE monitoring and not a verified operational dashboard.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stabilityRegimes.map((regime, index) => (
            <button
              key={regime.name}
              type="button"
              onClick={() => setActiveRegime(index)}
              className={`rounded-lg border p-4 text-left transition-all duration-300 ${
                activeRegime === index ? "scale-105 shadow-lg" : "border-zinc-700 opacity-60 hover:opacity-100"
              }`}
              style={{
                borderColor: activeRegime === index ? regime.color : undefined,
                boxShadow: activeRegime === index ? `0 0 20px ${regime.color}40` : undefined,
              }}
            >
              <div className="text-sm font-bold" style={{ color: regime.color }}>
                {regime.name}
              </div>
              <div className="mt-1 font-courier text-xs text-zinc-400">{regime.lambda}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-zinc-700 bg-black/30 p-4 transition-all duration-500">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: stabilityRegimes[activeRegime].color }}
              aria-hidden
            />
            <span className="text-zinc-200">{stabilityRegimes[activeRegime].desc}</span>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-[#B8860B]/30 bg-[#B8860B]/5 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
            Evidence boundary on this surface
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            No sealed public benchmark, latency, uptime, or LIVE telemetry figures are published
            here. Inspect the Proof Registry and Observatory for capsule-scoped VERIFIED records.
            Production authority: NOT ESTABLISHED.
          </p>
        </div>
      </section>

      <section className="panel royal-panel mt-8 p-8">
        <h2 className="text-2xl text-gold">The 9-Layer Civilization Stack</h2>
        <p className="mb-6 mt-3 text-zinc-300">
          Conceptual stack with evidence posture labels. Expand a layer for orientation — not a
          completion meter.
        </p>
        <div className="space-y-2">
          {kernelLayers.map((layer, index) => (
            <button
              key={layer.name}
              type="button"
              onClick={() => setExpandedLayer(expandedLayer === index ? null : index)}
              className="w-full cursor-pointer rounded-lg border border-zinc-700 p-4 text-left transition-all duration-300 hover:border-gold/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-gold">{layer.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {layer.posture}
                </span>
              </div>
              {expandedLayer === index ? (
                <p className="mt-3 text-sm text-zinc-300">{layer.desc}</p>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <section className="panel royal-panel mt-8 p-8">
        <h2 className="text-2xl text-gold">Core Design Philosophy</h2>
        <p className="mt-4 text-zinc-200">
          Design doctrine frames three aspirational capabilities. These are principles, not scored
          production readiness metrics.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {designPrinciples.map((d) => (
            <div
              key={d.title}
              className="rounded-lg border border-gold/20 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-gold/50"
            >
              <div className="mb-4 text-4xl">
                <SovereignIcon icon={d.icon} className="mx-auto h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-gold">{d.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
