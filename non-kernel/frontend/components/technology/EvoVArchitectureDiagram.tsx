"use client";

import { KeyboardEvent, useState } from "react";

type ArchitectureLayer = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  evidence: string;
  color: string;
};

const layers: ArchitectureLayer[] = [
  {
    id: "L9",
    title: "Cosmology",
    eyebrow: "Meaning horizon",
    description: "The civilizational frame that keeps long-term purpose, human responsibility, and system direction visible.",
    evidence: "Narrative intent and institutional charter",
    color: "from-[#107e3e]/35 via-[#107e3e]/10 to-transparent",
  },
  {
    id: "L8",
    title: "Constitution",
    eyebrow: "Governing limits",
    description: "The non-negotiable articles, permissions, and prohibitions that define admissible action before execution begins.",
    evidence: "Versioned policy bundle and transition rules",
    color: "from-[#2d7f58]/35 via-[#2d7f58]/10 to-transparent",
  },
  {
    id: "L7",
    title: "Identity + Trust",
    eyebrow: "Continuity layer",
    description: "A durable record of authority, provenance, and change history that anchors the system to a verifiable identity.",
    evidence: "Hash-linked lineage and signed state history",
    color: "from-[#64813d]/35 via-[#64813d]/10 to-transparent",
  },
  {
    id: "L6",
    title: "Epistemic Governance",
    eyebrow: "Confidence discipline",
    description: "Calibration, uncertainty, and drift checks that keep claims proportionate to evidence and expose when confidence must change.",
    evidence: "Confidence state, calibration signal, and drift posture",
    color: "from-[#9a8b23]/35 via-[#9a8b23]/10 to-transparent",
  },
  {
    id: "L5",
    title: "Deterministic Intelligence",
    eyebrow: "Reasoning controls",
    description: "A bounded intelligence layer for structured inference, causal reasoning, and decisions that can be traced back to their conditions.",
    evidence: "Canonical inputs, evaluated constraints, and decision trace",
    color: "from-[#b8860b]/35 via-[#b8860b]/10 to-transparent",
  },
  {
    id: "L4",
    title: "Agentic Infrastructure",
    eyebrow: "Coordinated agency",
    description: "Orchestration for specialized agents that assigns roles, restricts authority, and preserves accountable coordination.",
    evidence: "Role scope, task assignment, and approved handoff record",
    color: "from-[#bf7a14]/35 via-[#bf7a14]/10 to-transparent",
  },
  {
    id: "L3",
    title: "Operational Systems",
    eyebrow: "Live enforcement",
    description: "The real-time layer where policy is applied to state transitions, health signals, exceptions, and controlled recovery paths.",
    evidence: "Transition log, invariant status, and recovery event",
    color: "from-[#be5d1b]/35 via-[#be5d1b]/10 to-transparent",
  },
  {
    id: "L2",
    title: "Economic + Institutional",
    eyebrow: "Accountable adoption",
    description: "The integration layer connecting governed capability to organisations, incentives, obligations, and real-world operating contexts.",
    evidence: "Institutional mandate and compliance context",
    color: "from-[#ab3f24]/35 via-[#ab3f24]/10 to-transparent",
  },
  {
    id: "L1",
    title: "Human Interface",
    eyebrow: "Witness surface",
    description: "The interface through which people can understand, challenge, direct, and review the governed system without losing context.",
    evidence: "Decision view, intervention route, and audit receipt",
    color: "from-[#9e2830]/35 via-[#9e2830]/10 to-transparent",
  },
];

export function EvoVArchitectureDiagram() {
  const [selectedIndex, setSelectedIndex] = useState(4);
  const selected = layers[selectedIndex];

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowUp") nextIndex = Math.max(0, index - 1);
    if (event.key === "ArrowDown") nextIndex = Math.min(layers.length - 1, index + 1);
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = layers.length - 1;

    setSelectedIndex(nextIndex);
    document.getElementById(`evo-v-layer-${layers[nextIndex].id}`)?.focus();
  }

  return (
    <section className="mt-14" aria-labelledby="evo-v-diagram-title">
      <div className="relative overflow-hidden border border-[#B8860B]/30 bg-[#090a09]/85 p-4 shadow-2xl shadow-black/25 sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(16,126,62,0.16),transparent_28%),radial-gradient(circle_at_88%_90%,rgba(184,134,11,0.12),transparent_30%)]" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-col gap-4 border-b border-[#B8860B]/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-courier text-[0.68rem] uppercase tracking-[0.24em] text-[#D4AF37]">Interactive architecture map</p>
              <h3 id="evo-v-diagram-title" className="mt-3 text-2xl text-zinc-100 sm:text-3xl">EVO-V: nine layers of governed intelligence</h3>
            </div>
            <p className="max-w-sm text-sm leading-6 text-zinc-500">Select a layer to inspect its responsibility and the evidence it contributes to a governed decision.</p>
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-stretch">
            <div className="relative" role="group" aria-label="EVO-V architecture layers">
              <div className="pointer-events-none absolute bottom-5 left-7 top-5 w-px bg-gradient-to-b from-[#107e3e] via-[#D4AF37] to-[#e01e1e] sm:left-9" aria-hidden="true" />
              <div className="space-y-1.5">
                {layers.map((layer, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <button
                      key={layer.id}
                      id={`evo-v-layer-${layer.id}`}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedIndex(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      className={`group relative grid w-full grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden border px-4 py-3 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D675] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a09] sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:px-5 ${isSelected ? "border-[#D4AF37]/80 bg-[#D4AF37]/10 shadow-[0_0_24px_rgba(184,134,11,0.11)]" : "border-zinc-800/90 bg-[#0d0e0d]/80 hover:border-[#B8860B]/45 hover:bg-[#131613]"}`}
                    >
                      <span className={`absolute inset-0 bg-gradient-to-r ${layer.color} opacity-0 transition-opacity duration-200 ${isSelected ? "opacity-100" : "group-hover:opacity-70"}`} aria-hidden="true" />
                      <span className="relative font-courier text-sm text-[#D4AF37]">{layer.id}</span>
                      <span className="relative min-w-0">
                        <span className="block truncate text-sm font-semibold text-zinc-100 sm:text-base">{layer.title}</span>
                        <span className="mt-0.5 block truncate text-xs text-zinc-500">{layer.eyebrow}</span>
                      </span>
                      <span className={`relative h-2 w-2 rounded-full transition duration-200 ${isSelected ? "bg-[#F2D675] shadow-[0_0_12px_#D4AF37]" : "bg-zinc-700 group-hover:bg-[#D4AF37]/60"}`} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="relative flex min-h-72 flex-col border border-[#B8860B]/25 bg-black/30 p-6 sm:p-7" aria-live="polite">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${selected.color}`} aria-hidden="true" />
              <p className="font-courier text-[0.68rem] uppercase tracking-[0.24em] text-[#D4AF37]">Selected layer</p>
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-courier text-sm text-[#D4AF37]">{selected.id} / {selected.eyebrow}</p>
                  <h4 className="mt-3 text-3xl text-zinc-100">{selected.title}</h4>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D4AF37]/30 font-courier text-sm text-[#D4AF37]">{selected.id}</span>
              </div>
              <p className="mt-6 text-base leading-7 text-zinc-300">{selected.description}</p>
              <div className="mt-auto border-t border-[#B8860B]/20 pt-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">Governance evidence</p>
                <p className="mt-2 text-sm leading-6 text-[#F2D675]">{selected.evidence}</p>
              </div>
            </aside>
          </div>

          <p className="mt-6 text-xs leading-5 text-zinc-500">Use the arrow keys, Home, or End while focused on a layer to navigate the stack without a pointer.</p>
        </div>
      </div>
    </section>
  );
}
