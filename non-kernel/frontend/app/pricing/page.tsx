import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Engagement-scoped AI governance pilots",
  description:
    "How Rasta Imperium prices design partner pilots, audits, and runtime modules. Indicative pilot range $50k–$150k. No self-serve SaaS tiers; commercial terms are written per engagement.",
  keywords: [
    "AI governance pricing",
    "design partner cost",
    "institutional AI pilot pricing",
    "EVO-V commercial terms",
  ],
  openGraph: {
    title: "Pricing posture — Engagement-scoped commercial terms",
    description:
      "Fixed-scope pilots and enterprise runtime terms. No unlimited self-serve tiers on the public verification surface.",
    url: "https://rastaimperium.com/pricing/",
  },
};

export default function PricingPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Commercial posture
          </p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Engagement-scoped pricing
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            This is not a self-serve SaaS price list. Design partner pilots, audits, and runtime
            modules are scoped in writing. Indicative ranges orient institutional buyers only.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Request pilot terms
            </Link>
            <Link
              href="/institutional-pilots/"
              className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Pilot pathway
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Product
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="royal-panel rounded-xl border p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Design partner pilot</p>
            <p className="mt-3 text-2xl font-semibold text-zinc-100">$50k–$150k</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Indicative fixed-scope range for 8–12 weeks. Final commercial terms written per
              engagement based on stack complexity and decision paths in scope.
            </p>
          </div>
          <div className="royal-panel rounded-xl border p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Audit / assurance</p>
            <p className="mt-3 text-2xl font-semibold text-zinc-100">Scoped</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Governance assessment against stated invariants. Certification language only where
              sealed artifacts support it.
            </p>
          </div>
          <div className="royal-panel rounded-xl border p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Runtime & hosted</p>
            <p className="mt-3 text-2xl font-semibold text-zinc-100">Enterprise</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Execution kernel, Observatory modules, air-gapped options. Sold after pilot fit under
              explicit scope — not listed as self-serve tiers.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">Get a written commercial outline</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Share context and scope. We respond with boundaries and an indicative investment range.
          </p>
          <Link
            href="/contact/?intent=design-partner"
            className="mt-6 inline-block rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
          >
            Contact · commercial path
          </Link>
        </div>
      </section>
    </main>
  );
}
