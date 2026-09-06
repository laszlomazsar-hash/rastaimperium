import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EVO-V Kernel — Technology",
  description:
    "Canonical EVO-V execution-kernel overview: deterministic transitions, hash-linked lineage, and replay — separate from the public Rasta Imperium verification surface.",
  openGraph: {
    title: "EVO-V Kernel — Technology",
    description:
      "Execution kernel framing for deterministic governance. Not hosted on this website.",
    url: "https://rastaimperium.com/technology/evo-v/",
  },
};

const responsibilities = [
  {
    title: "Lifecycle guards",
    body: "Guard state changes through explicit transition semantics. Illegal edges reject with sealed receipts where capsules exist.",
  },
  {
    title: "Audit lineage",
    body: "Preserve hash-linked chronology across committed operations so reviewers can reconstruct what entered and what changed.",
  },
  {
    title: "Deterministic replay",
    body: "Support identical terminal state, receipt, and ledger head under identical inputs, versions, and event order — capsule-scoped where VERIFIED.",
  },
];

export default function EvoVTechnologyPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Technology · execution layer
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl text-zinc-100 sm:text-5xl">EVO-V Kernel</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            EVO-V is the execution kernel where deterministic governance logic runs. This frontend does
            not host runtime components; it documents architecture, principles, and institutional
            framing for a separate operational system.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/technology/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black"
            >
              Technology overview
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
            <Link
              href="/about-evo-v-kernel/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm text-zinc-100"
            >
              About the kernel
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Kernel responsibilities
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">What the execution layer is for</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {responsibilities.map((r) => (
            <article key={r.title} className="royal-panel rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-[#F2D675]">{r.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{r.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <div className="royal-panel rounded-xl border p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Boundary</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            Public VERIFIED labels apply only to sealed capsules and pure verifiers published on this
            site. Full production fleets, LIVE telemetry, and unpublished kernel paths remain outside
            those labels until sealed artifacts exist. See Limitations.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/limitations/" className="text-[#F2D675]">
              Limitations →
            </Link>
            <Link href="/technology/verification/" className="text-zinc-400">
              Verification path →
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-xl text-zinc-100">Engage the runtime under written scope</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Kernel and hosted modules are commercial layers after design partner fit — not self-serve
            on this surface.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/product/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Product pathway
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Design partner pilots
            </Link>
            <Link
              href="/contact/?intent=commercial"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Commercial brief
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
