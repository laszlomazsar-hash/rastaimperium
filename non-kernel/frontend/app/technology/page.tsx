import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technology — EVO-V Architecture",
  description: "Canonical technology overview for the EVO-V deterministic governance architecture.",
};

const principles = [
  "Public narrative layer remains separate from the execution runtime.",
  "Critical operations carry explicit version bundles and canonical inputs.",
  "Replay, audit completeness, and lineage checks are treated as engineering requirements.",
];

export default function TechnologyPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Technology</p>
      <h1 className="mt-4 text-4xl font-bold md:text-5xl">Deterministic governance architecture</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
        EVO-V separates the public interpretation layer from the execution kernel so institutional
        readers can inspect principles, architecture, and governance boundaries without conflating
        them with runtime operations. The result is a system designed for replay-verifiable decisions,
        explicit state semantics, and audit-grade lineage.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {principles.map((principle) => (
          <article key={principle} className="rounded-xl border border-[#B8860B]/30 bg-black/30 p-5">
            <p className="text-zinc-200 leading-7">{principle}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Link href="/technology/evo-v" className="rounded-xl border border-zinc-800 p-6 hover:border-[#B8860B]/60">
          <h2 className="text-2xl font-semibold text-[#B8860B]">EVO-V Kernel</h2>
          <p className="mt-3 text-zinc-400">Execution-kernel framing for deterministic governance logic.</p>
        </Link>
        <Link href="/technology/verification" className="rounded-xl border border-zinc-800 p-6 hover:border-[#B8860B]/60">
          <h2 className="text-2xl font-semibold text-[#B8860B]">Verification</h2>
          <p className="mt-3 text-zinc-400">Replay, invariant, and lineage verification path.</p>
        </Link>
      </section>
    </main>
  );
}
