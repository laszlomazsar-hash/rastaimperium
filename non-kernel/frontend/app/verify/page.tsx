import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Run the proof",
  description:
    "Offline verification of frozen L7 capsules. Do not trust this website — recompute the hashes.",
};

export default function VerifyHubPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Verification
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl text-zinc-100 sm:text-5xl">Run the proof</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Do not ask this page whether the capsule passed. Download the artifact, run a pure
            verifier, and compare hashes.
          </p>
        </div>
      </section>

      <section className="container-page space-y-8 py-12">
        <article className="rounded-xl border border-zinc-800 bg-black/30 p-6">
          <h2 className="font-mono text-sm text-[#F2D675]">ART-L7-REPLAY-001</h2>
          <p className="mt-2 text-sm text-zinc-400">Valid-path deterministic replay (INV-001).</p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-black/50 p-4 font-mono text-xs text-zinc-300">{`$ node verify-art-l7-replay-001.mjs ./ART-L7-REPLAY-001.json
# Artifact replay · state · ledger · receipt · double-run parity
# RESULT: exit 0 only if sealed hashes match`}</pre>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a className="text-[#F2D675]" href="/evidence/artifacts/ART-L7-REPLAY-001.json">
              Download capsule
            </a>
            <Link href="/verify/art-l7-replay-001/" className="text-zinc-400">
              Detailed guide →
            </Link>
            <Link href="/proof/#PROOF-REPLAY-001" className="text-zinc-400">
              PROOF-REPLAY-001 →
            </Link>
          </div>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-black/30 p-6">
          <h2 className="font-mono text-sm text-[#F2D675]">ART-L7-REJECT-001</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Illegal lifecycle rejection (pure semantics — not production ledger recording).
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-black/50 p-4 font-mono text-xs text-zinc-300">{`$ node verify-art-l7-reject-001.mjs ./ART-L7-REJECT-001.json
# Expect ILLEGAL_TRANSITION · state_mutated false · sealed receipt`}</pre>
          <a className="mt-4 inline-block text-sm text-[#F2D675]" href="/evidence/artifacts/ART-L7-REJECT-001.json">
            Download capsule
          </a>
        </article>

        <article className="rounded-xl border border-zinc-800 p-6">
          <h2 className="text-lg text-zinc-100">Three implementations</h2>
          <p className="mt-2 text-sm text-zinc-400">Node · Python · Go — exact hash agreement recorded in ART-L7-PARITY-002.</p>
          <Link href="/audit/" className="mt-4 inline-block text-sm text-[#F2D675]">
            Full auditor handoff →
          </Link>
        </article>

        <p className="text-sm text-zinc-500">
          Limitations:{" "}
          <Link href="/limitations/" className="text-[#F2D675]">
            what we have not proven
          </Link>
        </p>
      </section>
    </main>
  );
}
