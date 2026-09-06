import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies — Evidence-bound AI governance methodology",
  description:
    "Methodology case studies from sealed public capsules and the publication standard for institutional design partner outcomes. No fabricated logos or unverified performance metrics.",
  keywords: [
    "AI governance case study",
    "deterministic AI evidence",
    "design partner outcomes",
    "auditable AI methodology",
  ],
  openGraph: {
    title: "Case Studies — Evidence before logos",
    description:
      "Public capsule methodology cases and the rules for publishing named institutional pilots.",
    url: "https://rastaimperium.com/case-studies/",
  },
};

export default function CaseStudiesPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Case studies · social proof
          </p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Evidence before logos.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Institutional customer names and outcome metrics appear only with sealed public artifacts
            or explicit written permission. Until design partner results are publishable under those
            rules, this page carries methodology cases grounded in public capsules — not borrowed
            logos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/institutional-pilots/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Become a design partner
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Public proof registry
            </Link>
            <Link
              href="/evidence/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Evidence Explorer
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

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          For institutional evaluators
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">What a case study must prove</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Buyers evaluating deterministic governance need a reconstructible path: problem → method →
          sealed evidence → explicit boundary.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Problem",
              body: "A decision path that cannot be reconstructed or bounded creates liability.",
            },
            {
              title: "Method",
              body: "Freeze capsules, independent verifiers, written success criteria.",
            },
            {
              title: "Boundary",
              body: "Capsule-scoped claims only. Unproven metrics stay UNAVAILABLE.",
            },
          ].map((c) => (
            <div key={c.title} className="royal-panel rounded-xl border p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">{c.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-14">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
            CS-001 · methodology
          </p>
          <span className="rounded border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-200/90">
            PUBLIC CAPSULES · VERIFIED
          </span>
        </div>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100 sm:text-3xl">
          Sealed replay & illegal-transition rejection
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          A worked example of how EVO-V evidence is expected to look when a high-stakes decision path
          must remain reconstructible and bounded.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {[
            {
              t: "01 · Problem",
              b: "Systems change state in ways operators cannot reconstruct: which rule applied, whether an illegal transition was attempted, whether the audit trail still matches live memory.",
            },
            {
              t: "02 · Approach",
              b: "Freeze public capsules for deterministic replay parity and illegal lifecycle rejection. Independent Node and Python verifiers must exit 0 on sealed hashes.",
            },
            {
              t: "03 · Evidence",
              b: "ART-L7-REPLAY-001, ART-L7-REJECT-001, ART-L7-PARITY-001 — all VERIFIED on the public Proof Registry.",
            },
            {
              t: "04 · Boundary",
              b: "Capsule-scoped only. Performance numbers remain UNAVAILABLE until sealed benchmark artifacts exist.",
            },
          ].map((x) => (
            <div key={x.t} className="royal-panel rounded-xl border p-6">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">{x.t}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{x.b}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/proof/" className="font-semibold text-[#F2D675]">
            Open Proof Registry →
          </Link>
          <Link href="/challenge/" className="text-zinc-400 hover:text-[#F2D675]">
            Challenge Lab →
          </Link>
          <Link href="/audit/" className="text-zinc-400 hover:text-[#F2D675]">
            Auditor handoff →
          </Link>
          <Link href="/evidence/" className="text-zinc-400 hover:text-[#F2D675]">
            Evidence Explorer →
          </Link>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Institutional cases
        </p>
        <div className="mt-6 royal-panel rounded-xl border p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
            UNAVAILABLE · no published named institutional case studies
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Design partner pilots are open. Named cases appear only after written permission and
            evidence review.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">Pilot first. Publish later.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Methodology cases show the evidence standard. Named outcomes require permission and
            sealed artifacts.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Apply · design partner
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Pilot pathway
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Product
            </Link>
            <Link
              href="/pricing/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
