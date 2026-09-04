import type { Metadata } from "next";
import Link from "next/link";
import ObservatoryClient from "./ObservatoryClient";

export const metadata: Metadata = {
  title: "Observatory — Demonstration telemetry",
  description:
    "Synthetic Observatory-style coherence and drift demo. DEMONSTRATION only — not production monitoring or live governed agents.",
};

export default function ObservatoryPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Observatory · demonstration
          </p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Coherence visibility, not production claims.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            This page runs a local synthetic telemetry stream for orientation. It is labelled
            DEMONSTRATION: not live agent monitoring, not sealed performance evidence, and not the
            commercial hosted Observatory module.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/product/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Product pathway
            </Link>
            <Link
              href="/applications/"
              className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Applications & Genesis
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

      <section className="container-page py-12">
        <ObservatoryClient />

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="royal-panel rounded-xl border p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">What this is</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              A visual stand-in for operator-facing coherence / drift panels used in product
              conversations.
            </p>
          </div>
          <div className="royal-panel rounded-xl border p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">What this is not</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Not LIVE production telemetry. Not a guarantee of agent scale, latency, or reliability.
            </p>
          </div>
          <div className="royal-panel rounded-xl border p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Commercial path</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Hosted Observatory modules are sold under enterprise terms after design partner fit.
            </p>
            <Link href="/contact/?intent=commercial" className="mt-3 inline-block text-sm text-[#F2D675]">
              Request brief →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
