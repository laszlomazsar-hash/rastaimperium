import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Deterministic Governance — For boards and operators",
  description:
    "A plain-language explanation of deterministic AI governance: why opaque autonomy creates institutional risk, and how reconstructible decisions and sealed evidence reduce liability.",
  keywords: [
    "deterministic AI governance",
    "AI liability",
    "auditable AI",
    "board AI risk",
    "constitutional AI",
    "why deterministic governance",
  ],
  openGraph: {
    title: "Why Deterministic Governance",
    description:
      "Opaque autonomy is a liability problem. Deterministic governance makes decisions reconstructible, bounded, and challengeable.",
    url: "https://rastaimperium.com/why-deterministic-governance/",
  },
};

const audiencePoints = [
  {
    role: "Board / executive",
    body: "You need to know whether an autonomous system can be explained after the fact — not only whether it performed well on average.",
  },
  {
    role: "CISO / risk",
    body: "You need controls that reject illegal state changes and leave an audit trail, not another dashboard of model scores.",
  },
  {
    role: "Compliance / audit",
    body: "You need artifacts you can re-run independently. Marketing claims without sealed evidence do not meet that bar.",
  },
  {
    role: "Technical lead",
    body: "You need a written boundary of what is governed, what is verified, and what remains out of scope before scale-up.",
  },
];

const contrasts = [
  {
    title: "Opaque autonomy",
    points: [
      "Decisions hard to reconstruct after the fact",
      "Policy applied as interpretation, not as enforced transition rules",
      "Trust based on vendor narrative or average metrics",
      "Performance claims without public, sealed provenance",
    ],
  },
  {
    title: "Deterministic governance",
    points: [
      "Same inputs and event order → same outcome hashes (where sealed)",
      "Illegal transitions rejected with receipts",
      "Claims labelled VERIFIED, DEMONSTRATION, or UNAVAILABLE",
      "Pilots scoped in writing before production language",
    ],
  },
];

export default function WhyDeterministicGovernancePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Explainer · non-technical
          </p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Why deterministic governance
            <span className="mt-2 block text-gold-gradient">matters to institutions</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Autonomous systems are no longer experimental tools. When they act on customers, money,
            safety, or regulated processes, institutions inherit the liability. Deterministic
            governance is a practical response: make critical decisions reconstructible, bounded,
            and challengeable — then prove what you claim.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/product/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Product pathway
            </Link>
            <Link
              href="/institutional-pilots/"
              className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Design partner pilots
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Limitations first
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          The institutional problem
        </p>
        <h2 className="mt-3 max-w-2xl font-cinzel text-2xl text-zinc-100">
          Average accuracy is not the same as accountable action
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
          Many AI programmes optimise for performance. Boards and operators also need answers to
          harder questions: What entered the decision? Which rules applied? Could the system take an
          illegal path? Can an independent party re-check the claim without trusting a slide deck?
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
          When those answers are missing, risk does not disappear — it shifts to the institution.
        </p>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Who this is for
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {audiencePoints.map((a) => (
            <div key={a.role} className="royal-panel rounded-xl border p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">{a.role}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Side by side
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Opaque vs deterministic</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {contrasts.map((c) => (
            <div key={c.title} className="royal-panel rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-[#F2D675]">{c.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                {c.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-[#B8860B]">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          What Rasta Imperium offers publicly
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Evidence before purchase language</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
          This site is the public constitutional and verification layer — not the full production
          runtime. You can inspect sealed capsules, challenge fixtures, and explicit Limitations
          before any commercial conversation.
        </p>
        <ol className="mt-8 space-y-4 max-w-2xl">
          {[
            {
              n: "01",
              t: "Inspect evidence",
              b: "Proof Registry, Evidence Explorer, and Challenge Lab — with VERIFIED only where sealed artifacts reproduce.",
              href: "/proof/",
            },
            {
              n: "02",
              t: "Read Limitations",
              b: "Performance and production claims stay UNAVAILABLE until public capsules exist. Unproven does not mean false.",
              href: "/limitations/",
            },
            {
              n: "03",
              t: "Scope a pilot",
              b: "Fixed-scope design partner engagements with written success criteria and non-goals before scale-up language.",
              href: "/institutional-pilots/",
            },
          ].map((s) => (
            <li key={s.n} className="flex gap-4 rounded-xl border border-zinc-800 bg-black/30 p-5">
              <span className="font-mono text-sm text-[#D4AF37]">{s.n}</span>
              <div>
                <p className="font-semibold text-zinc-100">{s.t}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{s.b}</p>
                <Link href={s.href} className="mt-2 inline-block text-sm text-[#F2D675]">
                  Open →
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">Next step for decision-makers</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            If opaque autonomy is already a board or risk topic, start with Limitations and Proof —
            then open a design partner conversation with a written boundary.
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
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Product pathway
            </Link>
            <Link
              href="/case-studies/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Case studies
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
