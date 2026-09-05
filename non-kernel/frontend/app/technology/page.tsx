import type { Metadata } from "next";
import Link from "next/link";
import { EvoVArchitectureDiagram } from "@/components/technology/EvoVArchitectureDiagram";
import { MotionCodexGallery } from "@/components/technology/MotionCodexGallery";

export const metadata: Metadata = {
  title: "Technology — EVO-V Architecture",
  description:
    "An overview of the EVO-V deterministic governance architecture: boundaries, evidence, replay, and accountable execution.",
  openGraph: {
    title: "Technology — EVO-V Architecture",
    description:
      "Deterministic governance architecture: Intent → Constraint → Execution → Evidence.",
    url: "https://rastaimperium.com/technology/",
  },
};

const architectureLayers = [
  {
    id: "01",
    label: "Intent",
    title: "Canonical inputs",
    description:
      "The system begins from defined inputs, versioned context, and an explicit request boundary—so a decision has a stable point of reference.",
    tone: "border-[#107e3e]/60",
  },
  {
    id: "02",
    label: "Constraint",
    title: "Constitutional policy",
    description:
      "Rules, permissions, and transition conditions define what can happen before execution begins, not after an incident has occurred.",
    tone: "border-[#D4AF37]/60",
  },
  {
    id: "03",
    label: "Execution",
    title: "Deterministic runtime",
    description:
      "State changes are governed by explicit semantics designed to make outcomes inspectable, reproducible, and operationally bounded.",
    tone: "border-[#e01e1e]/60",
  },
  {
    id: "04",
    label: "Evidence",
    title: "Replay and lineage",
    description:
      "The resulting trail connects inputs, rules, transitions, and outputs—creating a durable witness for review and recovery.",
    tone: "border-[#34D399]/60",
  },
];

const engineeringPrinciples = [
  [
    "Separating narrative from runtime",
    "The public explanation layer and operational kernel serve different audiences and must not be confused.",
  ],
  [
    "Versioning what matters",
    "Critical operations carry explicit version bundles and canonical inputs to make later reconstruction possible.",
  ],
  [
    "Treating evidence as infrastructure",
    "Replay, audit completeness, and lineage verification are engineering requirements—not retrospective reporting.",
  ],
];

const pathways = [
  {
    href: "/technology/evo-v",
    eyebrow: "Core runtime",
    title: "EVO-V Kernel",
    description:
      "Explore the execution-kernel framing for deterministic governance logic and controlled state transitions.",
    action: "Open kernel overview",
  },
  {
    href: "/technology/verification",
    eyebrow: "Evidence path",
    title: "Verification",
    description:
      "Follow the replay, invariant, and lineage path that turns a system decision into inspectable evidence.",
    action: "Open verification path",
  },
  {
    href: "/governance-model/",
    eyebrow: "Governance",
    title: "Governance model",
    description:
      "Systems properties and Seven Articles map — how doctrine connects to sealed evidence.",
    action: "Open governance model",
  },
  {
    href: "/product",
    eyebrow: "Commercial path",
    title: "Product & pilots",
    description:
      "Capabilities, design partner terms, and how institutional teams adopt the stack under written scope.",
    action: "Open product pathway",
  },
];

export default function TechnologyPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[10%] top-0 h-80 w-80 rounded-full bg-[#107e3e]/10 blur-3xl" />
          <div className="absolute right-[4%] top-12 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="container-page relative py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
                Technology / 02
              </p>
              <h1 className="mt-6 max-w-4xl font-cinzel text-4xl leading-[0.98] text-zinc-100 sm:text-5xl lg:text-6xl">
                Build systems that can <span className="text-gold-gradient">account for themselves.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
                EVO-V is a deterministic governance architecture for systems where a decision must be
                bounded by policy, recoverable through replay, and legible to the people accountable
                for it.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/technology/evo-v"
                  className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
                >
                  Inspect the kernel
                </Link>
                <Link
                  href="/blueprint/"
                  className="rounded-lg border border-[#B8860B]/50 px-5 py-3 text-sm font-semibold text-[#F2D675]"
                >
                  Blueprint
                </Link>
                <Link
                  href="/governance-model/"
                  className="rounded-lg border border-zinc-600 px-5 py-3 text-sm font-semibold text-zinc-100"
                >
                  Governance model
                </Link>
              </div>
            </div>

            <div className="royal-panel relative border p-6 shadow-2xl shadow-black/30 sm:p-8">
              <div className="flex items-center justify-between border-b border-[#B8860B]/20 pb-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#D4AF37]">
                  Governance sequence
                </p>
                <span
                  className="h-2 w-2 rounded-full bg-[#34D399] shadow-[0_0_12px_#34D399]"
                  aria-label="Nominal system state"
                />
              </div>
              <ol className="mt-6 space-y-4">
                {architectureLayers.map((layer, index) => (
                  <li key={layer.id} className="grid grid-cols-[2.5rem_1fr] gap-4">
                    <span className="font-mono text-sm text-[#D4AF37]">{layer.id}</span>
                    <div className="relative border-l border-[#B8860B]/30 pl-4">
                      <p className="text-sm font-semibold text-zinc-100">{layer.label}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">
                        {index === 0
                          ? "Input is bound to context"
                          : index === 1
                            ? "Policy determines admissibility"
                            : index === 2
                              ? "State changes follow governed paths"
                              : "Evidence remains available for review"}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              The architecture
            </p>
            <h2 className="mt-5 font-cinzel text-3xl leading-tight text-zinc-100 sm:text-4xl">
              A decision path designed for evidence.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-zinc-300">
            The architecture is not a claim that every problem can be automated. It is a way to make
            automated capability more disciplined: define what the system receives, what it may do,
            how it changes state, and how that change can later be examined.
          </p>
        </div>

        <EvoVArchitectureDiagram />
      </section>
      <MotionCodexGallery />
      <section className="border-y border-[#B8860B]/15 bg-black/25">
        <div className="container-page py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Engineering posture
            </p>
            <h2 className="mt-5 font-cinzel text-3xl text-zinc-100 sm:text-4xl">
              The technical choices are governance choices.
            </h2>
          </div>
          <div className="mt-12 divide-y divide-[#B8860B]/15 border-y border-[#B8860B]/15">
            {engineeringPrinciples.map(([title, description], index) => (
              <article
                key={title}
                className="grid gap-4 py-7 sm:grid-cols-[4rem_0.75fr_1.25fr] sm:gap-6"
              >
                <span className="font-mono text-sm text-[#D4AF37]">0{index + 1}</span>
                <h3 className="text-xl text-zinc-100">{title}</h3>
                <p className="leading-7 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Explore the system
            </p>
            <h2 className="mt-5 max-w-2xl font-cinzel text-3xl leading-tight text-zinc-100 sm:text-4xl">
              Kernel, verification, governance, and the institutional path.
            </h2>
          </div>
          <Link
            href="/institutional-pilots/"
            className="shrink-0 text-sm font-semibold text-[#F2D675] transition hover:text-white"
          >
            Design partner pilots <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {pathways.map((pathway) => (
            <Link
              key={pathway.href}
              href={pathway.href}
              className="royal-panel group relative block overflow-hidden rounded-xl border p-7 transition duration-300 hover:border-[#D4AF37]/50 sm:p-8"
            >
              <div
                className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent"
                aria-hidden="true"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
                {pathway.eyebrow}
              </p>
              <h3 className="mt-5 text-2xl text-zinc-100">{pathway.title}</h3>
              <p className="mt-4 max-w-lg leading-7 text-zinc-400">{pathway.description}</p>
              <p className="mt-8 text-sm font-semibold text-[#F2D675]">
                {pathway.action} <span aria-hidden="true">→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
