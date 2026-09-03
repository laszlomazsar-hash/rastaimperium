import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vision — Constitutional Intelligence",
  description:
    "The Rasta Imperium vision for constitutional intelligence: bounded autonomy, verifiable decisions, and accountable infrastructure.",
};

const commitments = [
  {
    number: "01",
    title: "Bounded autonomy",
    description:
      "Autonomous systems should operate within explicit constitutional limits, rather than relying on hidden intent or retrospective interpretation.",
  },
  {
    number: "02",
    title: "Verifiable history",
    description:
      "A consequential decision should leave an intelligible record: what entered the system, which rules applied, and what changed as a result.",
  },
  {
    number: "03",
    title: "Institutional legibility",
    description:
      "Governance infrastructure must be legible to engineers, operators, and decision-makers without exposing or confusing the execution runtime.",
  },
];

const principles = [
  [
    "A clear boundary",
    "Separate public meaning, institutional policy, and execution logic so responsibility remains visible.",
  ],
  [
    "A durable witness",
    "Treat replay, lineage, and auditability as first-class properties of the system—not documentation added after the fact.",
  ],
  [
    "A human horizon",
    "Build for the people who must govern, challenge, and ultimately live alongside autonomous infrastructure.",
  ],
];

export default function VisionPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-36 top-10 h-80 w-80 rounded-full bg-[#107e3e]/15 blur-3xl" />
          <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#B8860B]/12 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B8860B]/70 to-transparent" />
        </div>

        <div className="container-page relative grid gap-14 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
              Vision / 01
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl leading-[0.98] text-zinc-100 sm:text-6xl lg:text-7xl">
              Intelligence deserves a <span className="text-gold-gradient">constitution.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              Rasta Imperium imagines autonomous infrastructure that can act with discipline, account
              for its decisions, and remain understandable to the institutions it serves.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/product/"
                className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#F2D675] hover:shadow-lg hover:shadow-[#B8860B]/20 active:scale-[0.97]"
              >
                Product & pilots
              </Link>
              <Link
                href="/technology"
                className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/70 hover:text-[#F2D675] active:scale-[0.97]"
              >
                Explore the technology
              </Link>
              <Link
                href="/proof/"
                className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/70 hover:text-[#F2D675] active:scale-[0.97]"
              >
                Proof Registry
              </Link>
            </div>
          </div>

          <aside className="relative border border-[#B8860B]/30 bg-[#0b0c0b]/70 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
            <div className="absolute left-0 top-0 h-1 w-24 bg-gradient-to-r from-[#107e3e] via-[#D4AF37] to-[#e01e1e]" />
            <p className="font-courier text-[0.68rem] uppercase tracking-[0.22em] text-[#D4AF37]">
              Statement of intent
            </p>
            <p className="mt-6 text-2xl leading-snug text-zinc-100 sm:text-3xl">
              “Power without traceability becomes opacity. Intelligence without limits becomes drift.”
            </p>
            <div className="mt-8 grid grid-cols-3 border-t border-[#B8860B]/20 pt-5 text-center">
              <div className="border-r border-[#B8860B]/20 px-2">
                <p className="font-courier text-lg text-[#D4AF37]">I</p>
                <p className="mt-1 text-[0.64rem] uppercase tracking-[0.16em] text-zinc-500">Intent</p>
              </div>
              <div className="border-r border-[#B8860B]/20 px-2">
                <p className="font-courier text-lg text-[#D4AF37]">II</p>
                <p className="mt-1 text-[0.64rem] uppercase tracking-[0.16em] text-zinc-500">
                  Constraint
                </p>
              </div>
              <div className="px-2">
                <p className="font-courier text-lg text-[#D4AF37]">III</p>
                <p className="mt-1 text-[0.64rem] uppercase tracking-[0.16em] text-zinc-500">Witness</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              The proposition
            </p>
            <h2 className="mt-5 text-3xl leading-tight text-zinc-100 sm:text-4xl">
              From managed models to governed systems.
            </h2>
          </div>
          <div className="max-w-2xl space-y-5 text-lg leading-8 text-zinc-300">
            <p>
              High-consequence systems need more than quality targets. They need an operating context
              that makes authority, limits, evidence, and recovery paths explicit.
            </p>
            <p>
              EVO-V is conceived as that context: a deterministic governance architecture that turns
              principles into inspectable operational boundaries. Rasta Imperium is the public
              interface for understanding why those boundaries matter.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border border-[#B8860B]/25 bg-[#B8860B]/20 md:grid-cols-3">
          {commitments.map((commitment) => (
            <article
              key={commitment.number}
              className="group relative bg-[#0b0c0b]/95 p-7 transition duration-300 hover:bg-[#121512] sm:p-8"
            >
              <span className="font-courier text-sm text-[#D4AF37]">{commitment.number}</span>
              <h3 className="mt-8 text-2xl text-zinc-100">{commitment.title}</h3>
              <p className="mt-4 leading-7 text-zinc-400">{commitment.description}</p>
              <div className="mt-8 h-px w-10 bg-[#D4AF37]/60 transition-all duration-300 group-hover:w-20" />
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#B8860B]/15 bg-black/20">
        <div className="container-page py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              How we orient the work
            </p>
            <h2 className="mt-5 text-3xl text-zinc-100 sm:text-4xl">
              A sovereign system should be able to show its work.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {principles.map(([title, description], index) => (
              <article key={title} className="relative border-l border-[#B8860B]/45 py-2 pl-6">
                <span className="font-courier text-xs text-[#D4AF37]">0{index + 1}</span>
                <h3 className="mt-4 text-xl text-zinc-100">{title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20 text-center lg:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
          From vision to adoption
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl leading-tight text-zinc-100 sm:text-4xl">
          Inspect the evidence. Pilot under a written boundary. Then scale the runtime.
        </h2>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/product/"
            className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#F2D675] active:scale-[0.97]"
          >
            Product pathway
          </Link>
          <Link
            href="/institutional-pilots/"
            className="rounded-lg bg-[#107e3e] px-6 py-3 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#159450] active:scale-[0.97]"
          >
            Design partner pilots
          </Link>
          <Link
            href="/applications/"
            className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-200 transition duration-200 hover:border-[#D4AF37]/70 hover:text-[#F2D675] active:scale-[0.97]"
          >
            Applications & Genesis
          </Link>
          <Link
            href="/thanks-and-praise/"
            className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-200 transition duration-200 hover:border-[#D4AF37]/70 hover:text-[#F2D675] active:scale-[0.97]"
          >
            Thanks & Praise
          </Link>
        </div>
      </section>
    </main>
  );
}
