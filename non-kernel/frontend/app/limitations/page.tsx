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

const boundaries = [
  {
    label: "UNAVAILABLE · performance benchmarks",
    body: "Ops/sec, latency, human approval rate, and reliability figures that appeared in earlier materials are not claimed as VERIFIED on this surface. They remain labelled UNAVAILABLE until sealed public benchmark capsules are published.",
  },
  {
    label: "UNAVAILABLE · production LIVE telemetry",
    body: "Observatory and homepage status panels are DEMONSTRATION / synthetic. They are not live monitoring of production agents or the EVO-V execution runtime.",
  },
  {
    label: "BOUNDARY · capsule scope",
    body: "VERIFIED labels on ART-L7-REPLAY-001, ART-L7-REJECT-001, and ART-L7-PARITY-001 apply only to those sealed public capsules and pure verifiers — not to full production fleets or unpublished kernels.",
  },
  {
    label: "BOUNDARY · certification language",
    body: "Court-ready, hardware-enforced, and 100% equivalence language is constitutional intent or capsule-scoped where independent verifiers exist. Full production certification is not asserted without sealed artifacts and written engagement scope.",
  },
  {
    label: "BOUNDARY · commercial guarantees",
    body: "No self-serve SaaS SLA, unlimited agent coverage, or outcome guarantee is published on this surface. Design partner pilots define written success criteria and non-goals before any production path.",
  },
];

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
              href="/challenge/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Challenge Lab
            </Link>
            <Link
              href="/governance-model/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Governance model
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Explicit boundaries
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">
          What stays labelled until evidence exists
        </h2>
        <div className="mt-8 space-y-4">
          {boundaries.map((b) => (
            <div key={b.label} className="royal-panel rounded-xl border p-6">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
                {b.label}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Related surfaces
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/proof/"
            className="royal-panel block rounded-xl border p-5 transition hover:border-[#B8860B]/40"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Evidence</p>
            <p className="mt-2 font-semibold text-zinc-100">Proof Registry</p>
            <p className="mt-2 text-sm text-zinc-400">Sealed capsules and structured proof records.</p>
            <p className="mt-3 text-sm text-[#F2D675]">Open →</p>
          </Link>
          <Link
            href="/pillars/"
            className="royal-panel block rounded-xl border p-5 transition hover:border-[#B8860B]/40"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Doctrine</p>
            <p className="mt-2 font-semibold text-zinc-100">Seven Articles</p>
            <p className="mt-2 text-sm text-zinc-400">Constitutional intent vs partial evidence labels.</p>
            <p className="mt-3 text-sm text-[#F2D675]">Open →</p>
          </Link>
          <Link
            href="/why-deterministic-governance/"
            className="royal-panel block rounded-xl border p-5 transition hover:border-[#B8860B]/40"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Plain language</p>
            <p className="mt-2 font-semibold text-zinc-100">Why deterministic</p>
            <p className="mt-2 text-sm text-zinc-400">Board-facing explainer before commercial terms.</p>
            <p className="mt-3 text-sm text-[#F2D675]">Open →</p>
          </Link>
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
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Open Proof Registry
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Design partner pilots
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Product pathway
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
