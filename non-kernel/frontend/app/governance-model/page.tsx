import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Governance Model — Deterministic & Auditable",
  description:
    "EVO-V governance as a systems property: deterministic transitions, audit lineage, replay verification, and explicit constitutional constraints.",
};

const properties = [
  {
    title: "Deterministic transitions",
    body: "State changes follow explicit semantics. Identical inputs and event order produce identical outcomes — the basis for replay.",
  },
  {
    title: "Audit lineage",
    body: "Append-only, hash-linked records connect inputs, rules applied, transitions, and outputs.",
  },
  {
    title: "Replay verification",
    body: "Any consequential decision can be reconstructed and checked against the immutable ledger.",
  },
  {
    title: "Constitutional constraints",
    body: "Policy and capability boundaries are enforced before execution, not explained after the fact.",
  },
];

export default function GovernanceModelPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[12%] top-0 h-72 w-72 rounded-full bg-[#107e3e]/10 blur-3xl" />
          <div className="absolute right-[6%] top-20 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>
        <div className="container-page relative py-20 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">Governance Model</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Governance is a <span className="text-gold-gradient">systems property</span>, not a policy appendix.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            EVO-V governance emphasizes deterministic transitions, audit lineage, replay verification, and
            explicit constitutional constraints. Accountability is engineered into the runtime path.
          </p>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {properties.map((p) => (
            <article key={p.title} className="panel p-6 sm:p-7">
              <h2 className="text-lg text-gold">{p.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{p.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link
            href="/governance"
            className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-[#F2D675]"
          >
            Governance overview
          </Link>
          <Link
            href="/governance/codex"
            className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
          >
            Rasta Codex
          </Link>
          <Link
            href="/blueprint"
            className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
          >
            Sovereign AI Blueprint
          </Link>
        </div>
      </section>
    </main>
  );
}
