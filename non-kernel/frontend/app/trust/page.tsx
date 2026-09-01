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
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Trust Console
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Do not trust claims because Rasta Imperium says them. Inspect status, open evidence,
            and challenge invariants. This console is the public verification layer — not the EVO-V
            execution runtime.
          </p>
          <nav className="mt-8 flex flex-wrap gap-3" aria-label="Verification navigation">
            <Link
              href="/proof"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black"
            >
              Proof Registry
            </Link>
            <Link
              href="/evidence"
              className="royal-button royal-button-ghost rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Evidence Explorer
            </Link>
            <Link
              href="/challenge"
              className="royal-button royal-button-ghost rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Challenge Lab
            </Link>
          </nav>
        </div>
      </section>

      <section className="container-page py-12 lg:py-16">
        <TrustStatus />
      </section>

      <section className="container-page border-t border-zinc-900 py-12">
        <h2 className="text-xl text-zinc-100">High-value claims</h2>
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
    </main>
  );
}
