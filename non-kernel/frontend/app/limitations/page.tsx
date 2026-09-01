import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What we have not proven",
  description:
    "Explicit unproven and unavailable claims for Rasta Imperium / L7 public evidence. Unproven does not mean false.",
};

const notClaimed = [
  "Production deployment of EVO-V",
  "Production performance or benchmark figures as VERIFIED",
  "Full EVO-V kernel parity across all components",
  "Production security assurance",
  "LIVE operational telemetry",
  "External certification or formal security audit",
  "Complete adversarial / mutation coverage",
  "Production ledger recording of rejected attempts",
  "Key management / cryptographic key lifecycle on this surface",
  "Cross-cloud or multi-tenant operational evidence",
];

export default function LimitationsPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Evidence boundary
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl text-zinc-100 sm:text-5xl">
            What we have not proven
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Unproven does not mean false. It means evidence has not yet been published.
          </p>
        </div>
      </section>

      <section className="container-page space-y-10 py-12">
        <article className="rounded-xl border border-zinc-800 bg-black/30 p-6">
          <h2 className="text-lg text-zinc-100">Not currently claimed</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-400">
            {notClaimed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-black/30 p-6">
          <h2 className="text-lg text-zinc-100">What is in evidence (narrow scope)</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-400">
            <li>Sealed public capsule ART-L7-REPLAY-001 — deterministic valid-path replay</li>
            <li>Sealed public capsule ART-L7-REJECT-001 — deterministic illegal-edge rejection</li>
            <li>Independent Node, Python, and Go pure verifiers agreeing on sealed hashes</li>
            <li>Offline reproduction without the website UI</li>
            <li>Self-administered challenge and mutation suites (finite, not complete coverage)</li>
          </ul>
          <Link href="/audit/" className="mt-4 inline-block text-sm text-[#F2D675]">
            Auditor handoff →
          </Link>
        </article>

        <article className="rounded-xl border border-zinc-800 p-6">
          <h2 className="text-lg text-zinc-100">Status vocabulary</h2>
          <dl className="mt-4 space-y-3 text-sm text-zinc-400">
            <div>
              <dt className="font-mono text-xs text-zinc-500">VERIFIED</dt>
              <dd>Only for artifacts that meet the evidence gate (sealed + reproducible).</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-zinc-500">HISTORICAL</dt>
              <dd>Frozen record; do not silently rewrite.</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-zinc-500">UNAVAILABLE</dt>
              <dd>Evidence does not currently exist on this surface.</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-zinc-500">LIVE</dt>
              <dd>Only actual operational evidence — not claimed here.</dd>
            </div>
          </dl>
        </article>

        <p className="text-sm text-zinc-500">
          See also{" "}
          <Link href="/trust/" className="text-[#F2D675]">
            Trust Console
          </Link>{" "}
          and{" "}
          <a
            className="text-[#F2D675]"
            href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/EVIDENCE_BOUNDARY_L7.md"
            target="_blank"
            rel="noreferrer"
          >
            evidence boundary (repo)
          </a>
          .
        </p>
      </section>
    </main>
  );
}
