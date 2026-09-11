import type { Metadata } from "next";
import Link from "next/link";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";

export const metadata: Metadata = {
  title: "Evaluate — How an institution inspects Rasta Imperium",
  description:
    "A structured path for institutional evaluation: define boundary, map governance requirements, inspect VERIFIED evidence, run challenges, define a pilot, decide whether to scale.",
  alternates: { canonical: "https://rastaimperium.com/evaluate/" },
  openGraph: {
    title: "Evaluate — Rasta Imperium",
    description:
      "From public evidence to a bounded pilot decision. No production claims beyond sealed capsules.",
    url: "https://rastaimperium.com/evaluate/",
  },
};

const steps = [
  {
    n: "01",
    title: "Define the boundary",
    body: "What system, workflow, or agent domain is being evaluated? Write the decision surface before tooling.",
    href: "/product/",
    link: "Product boundary →",
  },
  {
    n: "02",
    title: "Map governance requirements",
    body: "Which rules, constraints, approvals, and audit obligations must remain enforceable and inspectable?",
    href: "/governance/",
    link: "Governance →",
  },
  {
    n: "03",
    title: "Inspect existing evidence",
    body: "Which claims are VERIFIED, DEMONSTRATION, or UNAVAILABLE? Start from the Living Evidence Manifest and sealed capsules only.",
    href: "/proof/",
    link: "Proof Registry →",
  },
  {
    n: "04",
    title: "Run deterministic challenges",
    body: "Reproduce offline with pure Node and Python verifiers. Probe illegal transitions and fixtures in Challenge Lab.",
    href: "/verify/",
    link: "Verify →",
  },
  {
    n: "05",
    title: "Define the pilot",
    body: "Write scope, success criteria, exclusions, and evidence requirements before any commercial kickoff.",
    href: "/institutional-pilots/",
    link: "Institutional pilots →",
  },
  {
    n: "06",
    title: "Decide whether to scale",
    body: "Continue, revise, or stop — only after evidence and pilot boundary justify the next step. Production is not assumed.",
    href: "/limitations/",
    link: "Limitations →",
  },
] as const;

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
            How an institution evaluates Rasta Imperium
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            A decision path from public evidence to a bounded pilot — without treating capsule-scoped
            VERIFIED results as production certification.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Start with evidence
            </Link>
            <Link
              href="/verify/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Verify offline
            </Link>
            <Link
              href="/challenge/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Challenge Lab
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-12 sm:py-16">
          <ol className="space-y-6">
            {steps.map((s) => (
              <li
                key={s.n}
                className="grid gap-3 rounded-xl border border-zinc-800 bg-black/25 p-5 sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:gap-6"
              >
                <span className="font-mono text-sm text-[#D4AF37]">{s.n}</span>
                <div>
                  <h2 className="font-cinzel text-xl text-zinc-100">{s.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{s.body}</p>
                </div>
                <Link href={s.href} className="text-sm text-[#F2D675] hover:underline sm:pt-1">
                  {s.link}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/40">
        <div className="container-page py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/90">
            Status discipline
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">VERIFIED</p>
              <p className="mt-2 text-sm text-zinc-300">
                Sealed public capsules REPLAY-001, REJECT-001, PARITY-001 — capsule-scoped only.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/25 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                DEMONSTRATION
              </p>
              <p className="mt-2 text-sm text-zinc-400">Design and documentation surfaces — not production proof.</p>
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

          <div className="mt-10 rounded-xl border border-[rgba(242,214,117,0.2)] bg-[rgba(15,18,13,0.6)] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
              Public verification receipts
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Inspect the sealed L7 evidence before any pilot discussion. The UI is not the
              authority — the sealed artifact and pure verifier are.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/proof/#receipt-ART-L7-REPLAY-001"
                  className="text-[#F2D675] hover:underline"
                >
                  ART-L7-REPLAY-001 · INV-001 · receipt
                </Link>
              </li>
              <li>
                <Link
                  href="/proof/#receipt-ART-L7-REJECT-001"
                  className="text-[#F2D675] hover:underline"
                >
                  ART-L7-REJECT-001 · INV-002 · receipt
                </Link>
              </li>
              <li>
                <Link
                  href="/proof/#receipt-ART-L7-PARITY-001"
                  className="text-[#F2D675] hover:underline"
                >
                  ART-L7-PARITY-001 · parity · receipt
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/limitations/" className="text-zinc-400 hover:text-[#F2D675]">
              Full limitations →
            </Link>
            <Link href="/institutional-pilots/" className="text-[#F2D675] hover:underline">
              Bounded pilots →
            </Link>
            <Link href="/contact/?intent=institutional" className="text-zinc-400 hover:text-[#F2D675]">
              Contact →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
