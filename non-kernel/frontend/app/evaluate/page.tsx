import type { Metadata } from "next";
import Link from "next/link";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";
import { EvaluatorConsole } from "@/components/assurance/EvaluatorConsole";

export const metadata: Metadata = {
  title: "Evaluate — Public AI assurance evaluation path",
  description:
    "Institutional evaluator console: define a boundary, inspect sealed evidence, challenge invariants, verify offline, assess limitations, and decide the next step — without assurance scores or production claims.",
  alternates: { canonical: "https://rastaimperium.com/evaluate/" },
  openGraph: {
    title: "Evaluate — Rasta Imperium",
    description:
      "Inspect evidence, challenge boundaries, verify artifacts, assess limitations. Institutional judgement remains with the evaluator.",
    url: "https://rastaimperium.com/evaluate/",
  },
};

export default function EvaluatePage() {
  return (
    <main className="royal-page overflow-hidden">
      <EvidenceJourneyNav />

      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Institutional evaluation
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Evaluator Console
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Move from public evidence to an informed next step: define the boundary, inspect
            sealed capsules, challenge invariants, verify offline, assess limitations, and decide
            whether a bounded pilot is warranted.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Rasta Imperium supplies the evidence structure. The evaluator supplies institutional
            judgement. No assurance score is computed on this surface.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Start with evidence
            </Link>
            <Link
              href="/challenge/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Challenge Lab
            </Link>
            <Link
              href="/verify/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Verify offline
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-14">
          <EvaluatorConsole />
        </div>
      </section>

      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/40">
        <div className="container-page py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/90">
            Status discipline
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                VERIFIED
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                Sealed public capsules REPLAY-001, REJECT-001, PARITY-001 — capsule-scoped only.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/25 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                DEMONSTRATION
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Design and documentation surfaces — not production proof.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/25 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                UNAVAILABLE
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                LIVE telemetry, benchmarks, full-kernel parity, certification.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[rgba(242,214,117,0.15)] bg-[rgba(15,18,13,0.5)] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Authority boundary
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Production authority remains <strong className="text-zinc-300">NOT ESTABLISHED</strong>{" "}
              on the public surface. The UI is not the authority. Institutional approval is not
              issued by this console.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/limitations/" className="text-zinc-400 hover:text-[#F2D675]">
              Full limitations →
            </Link>
            <Link href="/institutional-pilots/" className="text-[#F2D675] hover:underline">
              Bounded pilots →
            </Link>
            <Link
              href="/contact/?intent=institutional"
              className="text-zinc-400 hover:text-[#F2D675]"
            >
              Contact →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
