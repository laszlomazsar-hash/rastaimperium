import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies — Evidence before logos",
  description:
    "Institutional outcomes and pilot results for EVO-V constitutional governance. Published only with sealed evidence or named permission — no fabricated social proof.",
};

export default function CaseStudiesPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Case studies · social proof
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Evidence before logos.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Rasta Imperium does not publish customer names, outcome metrics, or “used by” claims
            without sealed public artifacts or explicit written permission. This page is the
            intentional placeholder until design partner results can be shown under those rules.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/institutional-pilots/"
              className="rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
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
          Publication standard
        </p>
        <h2 className="mt-3 text-2xl text-zinc-100">What must be true before a case study appears</h2>
        <ul className="mt-6 max-w-2xl space-y-3 text-sm leading-7 text-zinc-400">
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>Named organisation permission, or fully anonymised framing agreed in writing</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>Pilot scope, success criteria, and non-goals documented</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>Claims tied to evidence (public capsules or customer-held artifacts)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>No performance or reliability figures labelled VERIFIED without sealed provenance</span>
          </li>
        </ul>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Current status
        </p>
        <div className="mt-6 rounded-xl border border-zinc-800 bg-black/30 p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
            UNAVAILABLE · no published institutional case studies
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Design partner pilots are open. The first publishable case studies will appear here after
            written permission and evidence review. Until then, evaluate the system via the Proof
            Registry, Challenge Lab, and Limitations — not via borrowed logos.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="text-2xl text-zinc-100">Pilot first. Publish later.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            If you want a governed pilot and are willing to consider a future case study under the
            rules above, start the design partner path.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Apply · design partner
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
