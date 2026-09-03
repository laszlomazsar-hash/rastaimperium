import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Research — Publications & Proofs",
  description:
    "Research surface for publications, sealed artifacts, repositories, and witness-style verification concepts. Evidence-bound; unproven claims labelled.",
};

const tracks = [
  {
    title: "Sealed public capsules",
    detail: "ART-L7-REPLAY-001, REJECT-001, PARITY-001 — independent Node + Python verifiers",
    href: "/proof/",
    status: "VERIFIED (capsule-scoped)",
  },
  {
    title: "Evidence Explorer",
    detail: "Claim → evidence → proof records with explicit provenance labels",
    href: "/evidence/",
    status: "OPERATIONAL",
  },
  {
    title: "Challenge Lab",
    detail: "Deterministic fixtures for illegal transitions and replay mismatch",
    href: "/challenge/",
    status: "DEMONSTRATION",
  },
  {
    title: "Constitutional articles",
    detail: "Seven pillars of the Rastafarai Codex — design principles with evidence status",
    href: "/pillars/",
    status: "CONSTITUTIONAL",
  },
  {
    title: "Blueprint stack",
    detail: "Nine-layer civilization architecture: purpose → invariants → evidence",
    href: "/blueprint/",
    status: "DOCUMENTATION",
  },
  {
    title: "Limitations",
    detail: "Explicit list of what is not claimed on this surface",
    href: "/limitations/",
    status: "REQUIRED READING",
  },
];

export default function ResearchPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Research surface
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl text-zinc-100 sm:text-5xl">
            Research, artifacts, and proofs
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Canonical path for publications, technical artifacts, open repositories, and
            replay-verifiable proof concepts. This page consolidates entry points; it does not
            invent production claims. Unproven items remain labelled on the Limitations page.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition hover:border-[#B8860B]/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
                {t.status}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-zinc-100">{t.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{t.detail}</p>
              <p className="mt-4 text-sm text-[#F2D675]">Open →</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-zinc-800 bg-black/20 p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Boundary</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            Research on this surface is evidence-oriented. Production deployment, live telemetry,
            and benchmark performance are not claimed here without sealed public artifacts. For
            institutional evaluation, begin with Limitations and the Proof Registry.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/limitations/" className="text-sm text-[#F2D675]">
              Limitations →
            </Link>
            <Link href="/library/" className="text-sm text-zinc-400">
              Library →
            </Link>
            <Link href="/audit/" className="text-sm text-zinc-400">
              Auditor handoff →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
