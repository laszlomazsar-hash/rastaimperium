import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Investment — Accountable autonomy infrastructure",
  description:
    "Rasta Imperium is developing a constitutional and verification layer for systems whose decisions must remain inspectable, reconstructible and accountable. Review the public evidence. Discuss exploratory investment.",
  alternates: {
    canonical: "https://rastaimperium.com/investment/",
  },
  openGraph: {
    title: "Investment — Rasta Imperium",
    description:
      "Infrastructure for accountable autonomous systems. Evidence-backed verification layer. Exploratory capital discussions only.",
    url: "https://rastaimperium.com/investment/",
  },
};

const verified = [
  {
    id: "ART-L7-REPLAY-001",
    label: "Deterministic valid-path replay under sealed capsule",
  },
  {
    id: "ART-L7-REJECT-001",
    label: "Illegal lifecycle transition rejected with sealed receipt",
  },
  {
    id: "ART-L7-PARITY-001",
    label: "Exact hash agreement across independent Node and Python pure verifiers",
  },
] as const;

const capitalCategories = [
  "Verification infrastructure and pure-verifier tooling",
  "Engineering for the public evidence and governance surface",
  "Security, assurance, and independent technical review",
  "Bounded institutional pilots and documentation",
  "Research and evidence expansion under explicit status labels",
] as const;

export default function InvestmentPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-16 lg:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Investment · exploratory
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Building infrastructure for accountable autonomous systems.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            Rasta Imperium is developing a constitutional and verification layer for systems whose
            decisions must remain inspectable, reconstructible and accountable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Review the evidence
            </Link>
            <Link
              href="/contact/?intent=investment"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Discuss investment
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Limitations
            </Link>
          </div>
          <p className="mt-6 max-w-2xl text-xs leading-5 text-zinc-500">
            Investment discussions are exploratory and subject to appropriate due diligence and
            documentation. Payment instructions are shared only through a private channel after
            discussion — never published on this website. This page is not an offer of securities, a
            subscription mechanism, or a claim of completed fundraising. Submitting a contact form
            does not constitute an investment agreement.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-12 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">Thesis</p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100 sm:text-3xl">
            Autonomy increases the governance burden
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            As autonomous systems make more consequential decisions, institutions need reconstructible
            records, deterministic controls, and independent verification — not narrative assurance.
          </p>
          <ol className="mt-10 max-w-xl space-y-3 font-mono text-xs uppercase tracking-[0.14em] text-zinc-300">
            {[
              "Autonomy",
              "More decisions",
              "More governance risk",
              "Reconstructible evidence",
              "Verification",
              "Accountable deployment",
            ].map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="text-[#D4AF37]">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/40">
        <div className="container-page py-12 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/90">
            What exists now · VERIFIED
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Public evidence baseline</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Capsule-scoped only. These do not prove full EVO-V production health, LIVE telemetry, or
            certification.
          </p>
          <ul className="mt-8 space-y-3">
            {verified.map((v) => (
              <li
                key={v.id}
                className="flex flex-col gap-1 rounded-xl border border-emerald-900/40 bg-emerald-950/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono text-sm text-[#F2D675]">{v.id}</p>
                  <p className="mt-1 text-sm text-zinc-400">{v.label}</p>
                </div>
                <a
                  href={`/evidence/artifacts/${v.id}.json`}
                  className="mt-2 shrink-0 text-sm text-[#F2D675] hover:underline sm:mt-0"
                >
                  Download JSON
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/proof/" className="text-[#F2D675] hover:underline">
              Proof Registry →
            </Link>
            <Link href="/verify/" className="text-zinc-400 hover:text-[#F2D675]">
              Verify offline →
            </Link>
            <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
              Limitations →
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-black/25 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Demonstration
              </p>
              <p className="mt-2 text-sm text-zinc-300">Documented design and public narrative surfaces</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/25 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Unavailable
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                LIVE telemetry, benchmarks, full-kernel parity, certification
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/25 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Historical
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                ART-L7-PARITY-002 — not part of the current VERIFIED set
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-12 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Capital use
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Where capital would be directed</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Category-level only. No fabricated budgets, valuations, or allocation percentages.
          </p>
          <ul className="mt-8 max-w-2xl space-y-3 text-sm text-zinc-300">
            {capitalCategories.map((c) => (
              <li key={c} className="flex gap-3 border-b border-zinc-900 py-3">
                <span className="text-[#D4AF37]" aria-hidden="true">
                  ·
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/30">
        <div className="container-page py-12 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">Roadmap</p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Staged development</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                status: "Existing",
                body: "Public evidence and verification layer; offline pure verifiers; Living Evidence Manifest discipline.",
              },
              {
                status: "Developing",
                body: "EVO-V technical architecture and governance infrastructure (separate from the public verification surface).",
              },
              {
                status: "Next",
                body: "Independent technical review; bounded institutional pilots; evidence and verification coverage expansion.",
              },
              {
                status: "Later",
                body: "Production-grade deployment capabilities where independently demonstrated — not claimed in advance.",
              },
            ].map((r) => (
              <article key={r.status} className="rounded-xl border border-zinc-800 bg-black/25 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  {r.status}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{r.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-12 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Partner profile
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Who this may be for</h2>
          <ul className="mt-6 max-w-2xl space-y-2 text-sm leading-6 text-zinc-300">
            <li>· Patient technology and AI infrastructure capital</li>
            <li>· Governance, assurance, and verification-oriented investors</li>
            <li>· Institutional technology partners concerned with accountable autonomy</li>
            <li>· Research-oriented capital comfortable with evidence-bound progress</li>
          </ul>
          <h3 className="mt-10 font-cinzel text-lg text-zinc-100">Who this is not for</h3>
          <ul className="mt-4 max-w-2xl space-y-2 text-sm leading-6 text-zinc-400">
            <li>· Parties seeking immediate SaaS-scale traction claims</li>
            <li>· Buyers expecting production guarantees without sealed evidence</li>
            <li>· Mandates that require unsupported AGI or certification language</li>
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-14 text-center sm:py-20">
          <h2 className="font-cinzel text-2xl text-zinc-100 sm:text-3xl">Next step</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-400">
            Inspect the evidence. Challenge offline. If the technical boundary fits, discuss a
            bounded pilot or an exploratory investment conversation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=investment"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Discuss investment
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Institutional pilots
            </Link>
            <Link
              href="/verify/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Verify
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
