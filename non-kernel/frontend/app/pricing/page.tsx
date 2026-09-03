import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing posture — Engagement-scoped commercial terms",
  description:
    "How Rasta Imperium prices design partner pilots, audits, and runtime modules. No self-serve SaaS tiers; terms are written per engagement.",
};

const tiers = [
  {
    name: "Design partner pilot",
    range: "$50k – $150k",
    period: "Typically 8–12 weeks",
    points: [
      "Written constitution map and success criteria",
      "Invariant enforcement on an agreed subset of your stack",
      "Challenge results and evidence handoff package",
      "Production-path recommendation",
    ],
    href: "/contact/?intent=design-partner",
    cta: "Apply for pilot terms",
  },
  {
    name: "Governance audit path",
    range: "Scoped quote",
    period: "Per system under review",
    points: [
      "Verification surface and challenge battery",
      "Assessment against stated constitutional invariants",
      "Certification language only where evidence supports it",
      "Auditor handoff package",
    ],
    href: "/contact/?intent=audit",
    cta: "Discuss audit scope",
  },
  {
    name: "Runtime & hosted modules",
    range: "Enterprise terms",
    period: "After pilot fit",
    points: [
      "Execution kernel and Observatory-style dashboards",
      "Advanced epistemic modules",
      "Cloud or air-gapped packaging",
      "Not self-serve SaaS on this site",
    ],
    href: "/contact/?intent=commercial",
    cta: "Request commercial brief",
  },
];

export default function PricingPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Pricing posture
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Engagement-scoped. Evidence-first.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            There is no public self-serve price list for unlimited agents or open-ended SaaS. Commercial
            terms are written per engagement after Limitations, Proof, and a scoped pilot discussion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/institutional-pilots/"
              className="rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Design partner detail
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Product pathway
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
        <div className="grid gap-4 lg:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.name}
              className="flex flex-col rounded-xl border border-zinc-800 bg-black/30 p-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
                {t.period}
              </p>
              <h2 className="mt-2 text-xl text-zinc-100">{t.name}</h2>
              <p className="mt-2 text-2xl font-semibold text-[#F2D675]">{t.range}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-zinc-400">
                {t.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-[#B8860B]">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className="mt-6 inline-block rounded-lg border border-[#B8860B]/40 px-4 py-2 text-sm font-semibold text-[#F2D675] transition hover:bg-[#B8860B]/10"
              >
                {t.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="text-2xl text-zinc-100">Next step</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Bring decision context and success criteria. We reply with a written boundary and commercial
            outline — not a generic rate card.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Apply · design partner
            </Link>
            <Link
              href="/applications/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Applications & Genesis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
