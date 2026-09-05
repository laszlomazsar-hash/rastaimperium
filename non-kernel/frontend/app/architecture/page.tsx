import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Architecture — Public Narrative vs Execution Layer",
  description:
    "How Rasta Imperium separates the public constitutional layer from the EVO-V execution kernel for clarity, accountability, and implementation discipline.",
  openGraph: {
    title: "Architecture — Split by design, united by evidence",
    description:
      "Public narrative layer vs EVO-V execution layer, bridged by sealed evidence without collapsing the split.",
    url: "https://rastaimperium.com/architecture/",
  },
};

const separations = [
  {
    title: "Public narrative layer",
    body: "This website. Architecture diagrams, codex, governance framing, and institutional communication. No runtime execution of institutional workloads.",
    href: "/governance-model/",
    cta: "Governance model",
  },
  {
    title: "Execution layer (EVO-V)",
    body: "Separate repositories and operational systems. Deterministic governance logic, replay, and evidence production live here — engaged via scoped pilots after fit.",
    href: "/about-evo-v-kernel/",
    cta: "About the kernel",
  },
  {
    title: "Evidence boundary",
    body: "Replay proofs, hash-linked lineage, and portable evidence containers bridge the two layers without collapsing them. Unproven claims stay labelled.",
    href: "/proof/",
    cta: "Proof Registry",
  },
];

const implications = [
  {
    title: "Clarity for buyers",
    body: "You can evaluate constitutional claims and sealed capsules without mistaking the marketing site for a production control plane.",
  },
  {
    title: "Accountability for operators",
    body: "Runtime commitments are written under pilot or enterprise scope — not implied by public telemetry labels on this surface.",
  },
  {
    title: "Discipline for implementation",
    body: "Doctrine (Articles, model) and evidence (capsules, challenge fixtures) stay separable from deployment topology.",
  },
];

export default function ArchitecturePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[10%] top-0 h-72 w-72 rounded-full bg-[#107e3e]/10 blur-3xl" />
          <div className="absolute right-[8%] top-16 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>
        <div className="container-page relative py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">Architecture</p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Split by design. <span className="text-gold-gradient">United by evidence.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            The architecture is intentionally split between a public narrative layer (this site) and a
            separate execution layer (EVO-V runtime). The split protects clarity, governance
            accountability, and implementation discipline.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/blueprint/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Sovereign Blueprint
            </Link>
            <Link
              href="/governance-model/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Governance model
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Three surfaces
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">How the split works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {separations.map((s) => (
            <article key={s.title} className="royal-panel flex flex-col rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-[#F2D675]">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-zinc-400">{s.body}</p>
              <Link href={s.href} className="mt-4 text-sm text-[#F2D675]">
                {s.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Why the split matters
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {implications.map((i) => (
            <div key={i.title} className="royal-panel rounded-xl border p-5">
              <h3 className="font-semibold text-zinc-100">{i.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{i.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">Explore related surfaces</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Blueprint for the nine-layer stack, Technology for the decision path, Product for the
            commercial engagement sequence.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/blueprint/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Blueprint
            </Link>
            <Link
              href="/technology/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Technology
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Product
            </Link>
            <Link
              href="/about-evo-v-kernel/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              EVO-V kernel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
