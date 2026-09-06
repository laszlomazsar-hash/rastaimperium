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

const tiers = [
  {
    id: "pilot",
    badge: "Recommended entry",
    title: "Design partner pilot",
    price: "$50k–$150k",
    subtitle: "Indicative · 8–12 weeks · fixed scope",
    body: "Constitution mapping, integration support on an agreed subset of decision paths, written success criteria, challenge results, and a production-path recommendation.",
    includes: [
      "Written pilot boundary and non-goals",
      "Evidence handoff package",
      "Access to public Challenge Lab fixtures",
      "Scoping aligned to your stack (cloud, on-prem, air-gapped)",
    ],
    cta: "Apply for pilot terms",
    href: "/contact/?intent=design-partner",
    primary: true,
  },
  {
    id: "audit",
    badge: "Assurance",
    title: "Governance audit path",
    price: "Scoped",
    subtitle: "Per engagement · evidence-bound",
    body: "Assessment against stated invariants using the verification surface and challenge battery. Certification language only where sealed artifacts support it.",
    includes: [
      "Invariant-focused review",
      "Explicit provenance labels",
      "No blanket court-ready claims without evidence",
    ],
    cta: "Discuss audit scope",
    href: "/contact/?intent=audit",
    primary: false,
  },
  {
    id: "runtime",
    badge: "After pilot fit",
    title: "Runtime & hosted modules",
    price: "Enterprise",
    subtitle: "Explicit scope · not self-serve",
    body: "Execution kernel, Observatory-style modules, and advanced epistemic packaging — including air-gapped options — sold after pilot fit under written commercial terms.",
    includes: [
      "Not listed as unlimited SaaS tiers",
      "Commercial brief after mutual fit",
      "Open-core: verification surface remains public",
    ],
    cta: "Request commercial brief",
    href: "/contact/?intent=commercial",
    primary: false,
  },
];

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
            This is not a self-serve SaaS price list. The default institutional path is a fixed-scope
            design partner pilot. Audits and runtime modules follow written scope — never unlimited
            public tiers on this surface.
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
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Pilot pathway detail
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Product
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Limitations
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
          Path hierarchy
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Pilot first. Runtime after fit.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Ranges orient buyers. Final terms are written per engagement. Public verification remains
          free to inspect regardless of commercial path.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.id}
              className={`royal-panel flex flex-col rounded-xl border p-6 ${
                t.primary ? "border-[#B8860B]/45 ring-1 ring-[#B8860B]/20" : ""
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">{t.badge}</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-100">{t.title}</h3>
              <p className="mt-3 text-3xl font-semibold text-[#F2D675]">{t.price}</p>
              <p className="mt-1 text-xs text-zinc-500">{t.subtitle}</p>
              <p className="mt-4 flex-1 text-sm leading-6 text-zinc-400">{t.body}</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                {t.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[#B8860B]">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className={`mt-6 inline-block rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                  t.primary
                    ? "bg-[#D4AF37] text-black"
                    : "border border-zinc-600 text-zinc-100 hover:border-[#B8860B]/40"
                }`}
              >
                {t.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          What is not sold here
        </p>
        <ul className="mt-6 max-w-2xl space-y-2 text-sm text-zinc-400">
          <li className="flex gap-2">
            <span className="text-zinc-600">·</span>
            <span>Unlimited self-serve SaaS tiers or seat-based public pricing</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-600">·</span>
            <span>Performance guarantees labelled VERIFIED without sealed public capsules</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-600">·</span>
            <span>Blanket certification language without evidence</span>
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/limitations/" className="text-[#F2D675]">
            See Limitations →
          </Link>
          <Link href="/proof/" className="text-zinc-400">
            Proof Registry →
          </Link>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">Get a written commercial outline</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Share organisation, stack, risk surface, and success criteria. We respond with boundaries
            and an indicative investment range — or a clear no-fit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Contact · pilot path
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
          </div>
        </div>
      </section>
    </main>
  );
}
