import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Limitations — What AI governance claims we have not proven",
  description:
    "Explicit list of unproven and UNAVAILABLE claims for Rasta Imperium public evidence. Performance benchmarks, production telemetry, and certification language require sealed artifacts. Unproven does not mean false.",
  keywords: [
    "AI governance limitations",
    "unproven claims",
    "evidence-bound AI",
    "deterministic AI transparency",
  ],
  openGraph: {
    title: "Limitations — What we have not proven",
    description:
      "Honest boundary of the public verification surface. Inspect what is VERIFIED vs UNAVAILABLE before any commercial discussion.",
    url: "https://rastaimperium.com/limitations/",
  },
};

export default function LimitationsPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Epistemic hygiene
          </p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            What we have not proven
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Unproven does not mean false. It means sealed public artifacts are not yet attached.
            Read this page before treating any performance figure or production claim as verified.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Proof Registry
            </Link>
            <Link
              href="/evidence/"
              className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Evidence Explorer
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Product pathway
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <div className="royal-panel rounded-xl border p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
            UNAVAILABLE · performance benchmarks
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Ops/sec, latency, human approval rate, and reliability figures that appeared in earlier
            materials are not claimed as VERIFIED on this surface. They remain labelled UNAVAILABLE
            until sealed public benchmark capsules are published.
          </p>
        </div>
        <div className="mt-4 royal-panel rounded-xl border p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
            UNAVAILABLE · production LIVE telemetry
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Observatory and homepage status panels are DEMONSTRATION / synthetic. They are not live
            monitoring of production agents or the EVO-V execution runtime.
          </p>
        </div>
        <div className="mt-4 royal-panel rounded-xl border p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
            BOUNDARY · capsule scope
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            VERIFIED labels on ART-L7-REPLAY-001, ART-L7-REJECT-001, and ART-L7-PARITY-001 apply only
            to those sealed public capsules and pure verifiers — not to full production fleets or
            unpublished kernels.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">Evaluate evidence first</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Start with the Proof Registry and Challenge Lab. Commercial discussion follows evidence,
            not the other way around.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/proof/"
              className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Open Proof Registry
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
