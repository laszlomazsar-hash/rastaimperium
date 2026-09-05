import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Design Partner Pilots — Institutional AI governance engagements",
  description:
    "Fixed-scope design partner pilots ($50k–$150k, 8–12 weeks) for regulated AI systems. Constitution mapping, evidence-bound success criteria, and a written path to production runtime.",
  keywords: [
    "AI governance pilot",
    "design partner program",
    "institutional AI",
    "deterministic governance",
    "auditable AI pilot",
  ],
  openGraph: {
    title: "Design Partner Pilots — Institutional AI governance",
    description:
      "Prove the system before it scales. Paid, fixed-scope pilots with written boundaries for high-accountability environments.",
    url: "https://rastaimperium.com/institutional-pilots/",
  },
};

const journey = [
  {
    step: "Problem",
    title: "Governance risk",
    body: "Autonomous systems that cannot be reconstructed, challenged, or constrained create institutional liability.",
  },
  {
    step: "Method",
    title: "Deterministic constitutional control",
    body: "EVO-V-style governance: ordered events, version bundles, legal transition matrices, and append-only lineage.",
    href: "/governance-model/",
  },
  {
    step: "Evidence",
    title: "Proof · receipts · replay",
    body: "Public claims connect to the Proof Registry and Evidence Explorer. Unavailable artifacts are labelled, not invented.",
    href: "/evidence/",
  },
  {
    step: "Challenge",
    title: "Adversarial verification",
    body: "Safe deterministic challenges exercise illegal transitions, replay mismatch, and receipt integrity.",
    href: "/challenge/",
  },
  {
    step: "Pilot",
    title: "Controlled institutional deployment",
    body: "Scoped design partner engagement in regulated environments before operational scale-up. Scope and success criteria agreed in writing.",
  },
  {
    step: "Assurance",
    title: "Ongoing audit / replay / evidence",
    body: "Continuous verification surface rather than one-time certification theatre.",
    href: "/trust/",
  },
];

const offered = [
  "Scoped pilot design against a defined governance problem",
  "Custom constitution mapping for your agent or decision stack",
  "Mapping of claims to public evidence and limitations",
  "Access to Challenge Lab fixtures and auditor handoff path",
  "Written boundary of what is and is not in scope",
  "Integration support for invariant enforcement on an agreed subset",
];

const notOffered = [
  "Production runtime guarantees without sealed artifacts",
  "Blanket certification or “court-ready” claims without evidence",
  "Open-ended SaaS deployment without institutional scope",
  "Performance benchmarks labelled VERIFIED without public capsules",
  "Unlimited agent coverage outside the written pilot boundary",
];

const deliverables = [
  {
    title: "Duration",
    body: "Typically 8–12 weeks (extendable by mutual written agreement).",
  },
  {
    title: "Indicative investment",
    body: "Design partner pilots are scoped in the $50k–$150k range depending on stack complexity, number of governed decision paths, and integration depth.",
  },
  {
    title: "You receive",
    body: "Written constitution map, pilot success criteria, challenge results, evidence handoff package, and a production-path recommendation.",
  },
  {
    title: "You provide",
    body: "Decision context, systems in scope, compliance or audit requirements, and a technical counterpart for integration windows.",
  },
];

export default function InstitutionalPilotsPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="container-page relative py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Design Partner Program
          </p>
          <h1 className="mt-6 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Prove the system <span className="text-gold-gradient">before it scales.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Paid, fixed-scope design partner pilots for regulated and high-accountability teams.
            Replay, traceability, and constitutional bounds are established in writing before any
            claim of operational adoption.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Apply for design partner pilot
            </Link>
            <Link
              href="/governance-model/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Governance model
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Read Limitations first
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Before you apply
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Doctrine and evidence first</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Pilots map a written subset of the governance model onto your stack. Start with the model,
          Articles, and proof surface so scope conversations stay evidence-bound.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/governance-model/"
            className="royal-panel block rounded-xl border p-5 transition hover:border-[#B8860B]/40"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Systems model</p>
            <p className="mt-2 font-semibold text-zinc-100">Governance model</p>
            <p className="mt-2 text-sm text-zinc-400">Transitions, lineage, replay, constraints.</p>
            <p className="mt-3 text-sm text-[#F2D675]">Open →</p>
          </Link>
          <Link
            href="/pillars/"
            className="royal-panel block rounded-xl border p-5 transition hover:border-[#B8860B]/40"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Articles</p>
            <p className="mt-2 font-semibold text-zinc-100">Seven Pillars</p>
            <p className="mt-2 text-sm text-zinc-400">Constitutional principles with status labels.</p>
            <p className="mt-3 text-sm text-[#F2D675]">Open →</p>
          </Link>
          <Link
            href="/proof/"
            className="royal-panel block rounded-xl border p-5 transition hover:border-[#B8860B]/40"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Evidence</p>
            <p className="mt-2 font-semibold text-zinc-100">Proof Registry</p>
            <p className="mt-2 text-sm text-zinc-400">Sealed capsules before commercial claims.</p>
            <p className="mt-3 text-sm text-[#F2D675]">Open →</p>
          </Link>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="royal-panel rounded-xl border p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
              What a pilot can include
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {offered.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="text-[#B8860B]">·</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="royal-panel rounded-xl border p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
              What is not offered here
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {notOffered.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="text-zinc-600">·</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Design partner terms (indicative)
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Scoped, paid, evidence-bound</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Final commercial terms are written per engagement. The ranges below orient institutional
          buyers; they are not a public price list for self-serve purchase.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {deliverables.map((d) => (
            <div key={d.title} className="royal-panel rounded-xl border p-5">
              <h3 className="text-lg text-[#F2D675]">{d.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{d.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          See{" "}
          <Link href="/pricing/" className="text-[#F2D675]">
            pricing hierarchy
          </Link>{" "}
          and{" "}
          <Link href="/product/" className="text-[#F2D675]">
            product pathway
          </Link>
          .
        </p>
      </section>

      <section className="container-page py-16 lg:py-20">
        <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Institutional journey
        </h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {journey.map((j, i) => (
            <li key={j.step} className="royal-panel rounded-xl border p-6">
              <p className="font-mono text-[11px] text-zinc-500">
                {String(i + 1).padStart(2, "0")} · {j.step}
              </p>
              <h3 className="mt-2 text-lg text-[#F2D675]">{j.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{j.body}</p>
              {j.href && (
                <Link href={j.href} className="mt-4 inline-block text-xs text-[#F2D675]">
                  Open →
                </Link>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <p className="font-cinzel text-xl text-zinc-100">Ready to apply for a design partner pilot?</p>
          <p className="mt-2 text-sm text-zinc-500">
            Bring the decision context, evidence requirements, systems in scope, and desired next
            step. We reply with a written boundary and commercial outline.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Apply · design partner
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100"
            >
              Product pathway
            </Link>
            <Link
              href="/pillars/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100"
            >
              Seven Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
