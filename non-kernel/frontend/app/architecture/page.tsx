import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Architecture — Public Narrative vs Execution Layer",
  description:
    "How Rasta Imperium separates the public constitutional layer from the EVO-V execution kernel for clarity, accountability, and implementation discipline.",
};

const separations = [
  {
    title: "Public narrative layer",
    body: "This website. Architecture diagrams, codex, governance framing, and institutional communication. No runtime execution.",
  },
  {
    title: "Execution layer (EVO-V)",
    body: "Separate repositories and operational systems. Deterministic governance logic, replay, and evidence production live here.",
  },
  {
    title: "Evidence boundary",
    body: "Replay proofs, hash-linked lineage, and .evop containers bridge the two layers without collapsing them.",
  },
];

export default function ArchitecturePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[10%] top-0 h-72 w-72 rounded-full bg-[#107e3e]/10 blur-3xl" />
          <div className="absolute right-[8%] top-16 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>
        <div className="container-page relative py-20 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">Architecture</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Split by design. <span className="text-gold-gradient">United by evidence.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            The architecture is intentionally split between a public narrative layer (this site) and a separate
            execution layer (EVO-V runtime). This separation protects clarity, governance accountability, and
            implementation discipline.
          </p>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {separations.map((s) => (
            <article key={s.title} className="panel p-6 sm:p-7">
              <h2 className="text-lg text-gold">{s.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{s.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link
            href="/blueprint"
            className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-[#F2D675]"
          >
            Sovereign AI Blueprint
          </Link>
          <Link
            href="/technology"
            className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
          >
            Technology overview
          </Link>
          <Link
            href="/technology/evo-v"
            className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
          >
            EVO-V kernel
          </Link>
        </div>
      </section>
    </main>
  );
}
