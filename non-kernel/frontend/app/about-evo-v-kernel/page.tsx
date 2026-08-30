import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About EVO-V Kernel",
  description:
    "EVO-V is the execution kernel where deterministic governance logic runs. This website documents architecture and principles; the operational system lives in separate repositories.",
};

export default function AboutEvoVKernelPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[10%] top-0 h-72 w-72 rounded-full bg-[#107e3e]/10 blur-3xl" />
          <div className="absolute right-[8%] top-16 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>
        <div className="container-page relative py-20 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">EVO-V Kernel</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            The execution kernel for <span className="text-gold-gradient">deterministic governance</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            EVO-V is the execution kernel where deterministic governance logic runs. This website does not host
            runtime components; it documents architecture, principles, and institutional framing for the separate
            operational system.
          </p>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="panel p-6 sm:p-7">
            <h2 className="text-lg text-gold">What this site is</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Public narrative and constitutional layer: architecture diagrams, codex, governance model, and
              pathways for institutions and researchers.
            </p>
          </article>
          <article className="panel p-6 sm:p-7">
            <h2 className="text-lg text-gold">What this site is not</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Not the EVO-V runtime. Execution, replay engines, and operational agents live in dedicated
              repositories and deployment environments.
            </p>
          </article>
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link
            href="/technology/evo-v"
            className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-[#F2D675]"
          >
            EVO-V architecture
          </Link>
          <Link
            href="/blueprint"
            className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
          >
            Sovereign AI Blueprint
          </Link>
          <Link
            href="/technology"
            className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
          >
            Technology overview
          </Link>
        </div>
      </section>
    </main>
  );
}
