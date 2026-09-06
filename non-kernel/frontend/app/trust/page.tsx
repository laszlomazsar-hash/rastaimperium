import type { Metadata } from "next";
import Link from "next/link";
import { TrustStatus } from "../../components/evidence/TrustStatus";
import { ClaimEvidence } from "../../components/evidence/ClaimEvidence";

export const metadata: Metadata = {
  title: "Trust Console — Public Verification Surface",
  description:
    "Rasta Imperium Trust Console: registry, keys, transparency, parity, adversarial, governance, and challenge status — bound to the public evidence manifest.",
};

export default function TrustPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Verification surface
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Trust Console
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Do not trust claims because Rasta Imperium says them. Inspect status, open evidence,
            and challenge invariants. This console is the public verification layer — not the EVO-V
            execution runtime.
          </p>
          <nav className="mt-8 flex flex-wrap gap-3" aria-label="Verification navigation">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black"
            >
              Proof Registry
            </Link>
            <Link
              href="/evidence/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Evidence Explorer
            </Link>
            <Link
              href="/challenge/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Challenge Lab
            </Link>
            <Link
              href="/audit/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Auditor handoff
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Limitations
            </Link>
            <Link
              href="/governance-model/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Governance model
            </Link>
          </nav>
        </div>
      </section>

      <section className="container-page py-12 lg:py-16">
        <TrustStatus />
      </section>

      <section className="container-page border-t border-zinc-900 py-12">
        <h2 className="font-cinzel text-xl text-zinc-100">High-value claims</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Each claim links to evidence and proof records. Demonstration and unavailable states are
          labelled explicitly.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ClaimEvidence claimId="CLAIM-REPLAY-001" />
          <ClaimEvidence claimId="CLAIM-LEDGER-001" />
          <ClaimEvidence claimId="CLAIM-LIFECYCLE-001" />
          <ClaimEvidence claimId="CLAIM-BENCH-REL" />
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-xl text-zinc-100">From verification to engagement</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Status panels are bound to the public evidence manifest. Commercial discussion follows
            sealed artifacts and Limitations.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/product/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Product pathway
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Design partner pilots
            </Link>
            <Link
              href="/contact/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
