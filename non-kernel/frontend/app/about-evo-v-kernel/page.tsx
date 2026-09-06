import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About EVO-V Kernel",
  description:
    "EVO-V is the execution kernel where deterministic governance logic runs. This website documents architecture and principles; the operational system lives in separate repositories.",
  openGraph: {
    title: "About EVO-V Kernel — Rasta Imperium",
    description:
      "Public narrative vs execution layer. Kernel responsibilities and institutional engagement path.",
    url: "https://rastaimperium.com/about-evo-v-kernel/",
  },
};

export default function AboutEvoVKernelPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[10%] top-0 h-72 w-72 rounded-full bg-[#107e3e]/10 blur-3xl" />
          <div className="absolute right-[8%] top-16 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>
        <div className="container-page relative py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">EVO-V Kernel</p>
          <h1 className="mt-6 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            The execution kernel for <span className="text-gold-gradient">deterministic governance</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            EVO-V is the execution kernel where deterministic governance logic runs. This website does not host
            runtime components; it documents architecture, principles, and institutional framing for the separate
            operational system.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/technology/evo-v/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black"
            >
              EVO-V technology
            </Link>
            <Link
              href="/architecture/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-2.5 text-sm text-[#F2D675]"
            >
              Architecture split
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm text-zinc-100"
            >
              Proof Registry
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm text-zinc-100"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="royal-panel rounded-xl border p-6 sm:p-7">
            <h2 className="text-lg text-[#F2D675]">What this site is</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Public narrative and constitutional layer: architecture diagrams, codex, governance model, and
              pathways for institutions and researchers.
            </p>
          </article>
          <article className="royal-panel rounded-xl border p-6 sm:p-7">
            <h2 className="text-lg text-[#F2D675]">What this site is not</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Not the EVO-V runtime. Execution, replay engines, and operational agents live in dedicated
              repositories and deployment environments.
            </p>
          </article>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-xl text-zinc-100">From documentation to engagement</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Kernel modules are sold under written scope after pilot fit — not self-serve on this surface.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/technology/evo-v/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              EVO-V architecture
            </Link>
            <Link
              href="/blueprint/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Sovereign AI Blueprint
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Product pathway
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Design partner pilots
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
