import type { Metadata } from "next";
import Link from "next/link";
import ObservatoryRegistry from "./ObservatoryRegistry";
import ObservatoryClient from "./ObservatoryClient";

export const metadata: Metadata = {
  title: "Evidence Observatory — Public proof registry",
  description:
    "Public index of evidence available for inspection and reproduction. VERIFIED capsules, DEMONSTRATION surfaces, and UNAVAILABLE claims — bound to the Living Evidence Manifest.",
  alternates: { canonical: "https://rastaimperium.com/observatory/" },
  openGraph: {
    title: "Evidence Observatory — Rasta Imperium",
    description:
      "Inspect the public evidence registry. Reproduce offline. Challenge invariants. No production authority claims beyond sealed capsules.",
    url: "https://rastaimperium.com/observatory/",
  },
};

export default function ObservatoryPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Evidence Observatory
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            A public index of evidence available for inspection and reproduction.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Registry records are drawn from the frontend evidence manifest aligned with the Living
            Evidence Manifest. Status is epistemic, not promotional.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                VERIFIED
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                Stated verification conditions satisfied for a sealed public capsule.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/25 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                DEMONSTRATION
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Behaviour shown within a declared scope — not broader production authority.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/25 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                UNAVAILABLE
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Not established by the public baseline (e.g. LIVE telemetry, certification).
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/verify/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Verify offline
            </Link>
            <Link
              href="/evaluate/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Evaluate the evidence
            </Link>
            <Link
              href="/challenge/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Challenge Lab
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

      <section className="container-page py-12 sm:py-14">
        <ObservatoryRegistry />
      </section>

      <section className="border-t border-zinc-900 bg-[#0b0c0b]/40">
        <div className="container-page py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Demonstration telemetry · not evidence
          </p>
          <h2 className="mt-2 font-cinzel text-xl text-zinc-200">
            Synthetic coherence stream (DEMONSTRATION)
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Local synthetic orientation only — not live agent monitoring, not sealed performance
            evidence, and not the commercial hosted Observatory module.
          </p>
          <div className="mt-8">
            <ObservatoryClient />
          </div>
        </div>
      </section>
    </main>
  );
}
