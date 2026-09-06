import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verification — EVO-V Technology",
  description:
    "Replay and verification path for EVO-V governed systems — linked to the public Trust, Proof, Evidence, Challenge, and Auditor surfaces.",
  openGraph: {
    title: "Verification — EVO-V Technology",
    description:
      "Prove reconstructed state is pure, deterministic, and complete. Public inspection on Trust and Proof surfaces.",
    url: "https://rastaimperium.com/technology/verification/",
  },
};

const checks = [
  {
    name: "Replay parity",
    body: "Identical inputs and event order yield matching terminal hashes for sealed capsules.",
    href: "/proof#PROOF-REPLAY-001",
  },
  {
    name: "Illegal-transition rejection",
    body: "Unauthorized lifecycle edges reject without state mutation — sealed rejection receipts.",
    href: "/proof#PROOF-ILLEGAL-001",
  },
  {
    name: "Cross-implementation parity",
    body: "Independent Node and Python pure verifiers agree on frozen capsule hashes.",
    href: "/proof#PROOF-PARITY-001",
  },
  {
    name: "Audit completeness",
    body: "Evidence records and provenance labels for claims on the public surface.",
    href: "/evidence/",
  },
  {
    name: "Ordering & adversarial fixtures",
    body: "Challenge Lab probes for mismatch, altered receipts, and illegal edges.",
    href: "/challenge/",
  },
  {
    name: "Lineage consistency",
    body: "Append-only chain integrity as documented (DEMONSTRATION until broader sealed scope).",
    href: "/proof#PROOF-CHAIN-001",
  },
];

export default function VerificationPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Technology · verification path
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl text-zinc-100 sm:text-5xl">
            Verification path
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Verification focuses on proving that reconstructed state is pure, deterministic, and
            complete. Critical failures preserve counterexample artifacts rather than silently
            repairing history. Public inspection lives on the Trust Console, Proof Registry, Evidence
            Explorer, Challenge Lab, and Auditor handoff.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black"
            >
              Proof Registry
            </Link>
            <Link
              href="/challenge/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-2.5 text-sm text-[#F2D675]"
            >
              Challenge Lab
            </Link>
            <Link
              href="/audit/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm text-zinc-100"
            >
              Auditor handoff
            </Link>
            <Link
              href="/trust/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm text-zinc-100"
            >
              Trust Console
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm text-zinc-100"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Public check surface
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">What you can inspect today</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {checks.map((check) => (
            <Link
              key={check.name}
              href={check.href}
              className="royal-panel block rounded-xl border p-5 transition hover:border-[#B8860B]/40"
            >
              <h3 className="font-semibold text-zinc-100">{check.name}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{check.body}</p>
              <p className="mt-3 text-sm text-[#F2D675]">Open →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-xl text-zinc-100">After verification review</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Reproduce offline via Auditor handoff. Commercial scope follows Limitations and written
            pilot boundaries.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/audit/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Auditor handoff
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Design partner pilots
            </Link>
            <Link
              href="/technology/evo-v/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              EVO-V kernel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
