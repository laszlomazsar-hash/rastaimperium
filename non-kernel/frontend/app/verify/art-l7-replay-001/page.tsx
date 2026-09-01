import type { Metadata } from "next";
import Link from "next/link";
import { ProvenanceBadge, VerificationBadge } from "../../../components/evidence/ProvenanceBadge";

export const metadata: Metadata = {
  title: "Independent reproduction — ART-L7-REPLAY-001",
  description:
    "How to independently verify the sealed L7 INV-001 replay capsule without trusting the website UI.",
};

const sealed = {
  state_hash: "5d04d74e0731853e2f2760a1047c7a8547dc860ce9d99525bf2ea715740bc31d",
  ledger_head_hash: "404e19c065afec5e11dac36db6838a5829d25244742d4eaee5c2ad3e6ff2a6de",
  receipt_hash: "3f1705c85e156b965908f9b604c432461ff105333f27481df800b3b37940dc9f",
};

export default function IndependentReproductionPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Phase 9.2 · Independent reproduction
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl text-zinc-100 sm:text-5xl">
            ART-L7-REPLAY-001
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Do not ask the website whether this capsule passed. Obtain the artifact, run the pure
            algorithm, and compare hashes yourself.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <VerificationBadge status="VERIFIED" />
            <ProvenanceBadge kind="HISTORICAL" />
            <span className="rounded border border-zinc-600 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
              FROZEN
            </span>
          </div>
        </div>
      </section>

      <section className="container-page py-12 space-y-8">
        <article className="rounded-xl border border-zinc-800 bg-black/30 p-6">
          <h2 className="text-lg text-zinc-100">1. Obtain the artifact</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>
              <a
                className="text-[#F2D675] hover:underline"
                href="/evidence/artifacts/ART-L7-REPLAY-001.json"
              >
                /evidence/artifacts/ART-L7-REPLAY-001.json
              </a>
            </li>
            <li className="font-mono text-xs text-zinc-500">
              repo: non-kernel/frontend/data/evidence/artifacts/ART-L7-REPLAY-001.json
            </li>
          </ul>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-black/30 p-6">
          <h2 className="text-lg text-zinc-100">2. Run offline verification</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Node.js ≥ 18. Exit code 0 means your independent computation matches the sealed
            expected hashes.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-black/50 p-4 font-mono text-xs text-zinc-300">
{`node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs
# or
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs ./ART-L7-REPLAY-001.json`}
          </pre>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-black/30 p-6">
          <h2 className="text-lg text-zinc-100">3. Sealed targets</h2>
          <dl className="mt-4 space-y-3 font-mono text-xs text-zinc-300">
            <div>
              <dt className="text-zinc-500">state_hash</dt>
              <dd className="break-all">{sealed.state_hash}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">ledger_head_hash</dt>
              <dd className="break-all">{sealed.ledger_head_hash}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">receipt_hash</dt>
              <dd className="break-all">{sealed.receipt_hash}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-6">
          <h2 className="text-lg text-amber-100">Freeze policy</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            This artifact is immutable. Do not mutate events or expected hashes in place. Engine or
            fixture changes require <span className="font-mono text-zinc-300">ART-L7-REPLAY-002</span>{" "}
            or later — preserving lineage.
          </p>
        </article>

        <article className="rounded-xl border border-zinc-800 p-6">
          <h2 className="text-lg text-zinc-100">Not claimed</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-500">
            <li>Production EVO-V deployment health</li>
            <li>LIVE operational telemetry</li>
            <li>Cross-implementation parity</li>
            <li>Homepage benchmark figures</li>
          </ul>
        </article>

        <div className="flex flex-wrap gap-3">
          <Link href="/proof/#PROOF-REPLAY-001" className="text-sm text-[#F2D675]">
            PROOF-REPLAY-001 →
          </Link>
          <Link href="/blueprint/#L7" className="text-sm text-zinc-400">
            L7 architecture →
          </Link>
          <Link href="/trust/" className="text-sm text-zinc-400">
            Trust Console →
          </Link>
          <a
            href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/INDEPENDENT_REPRODUCTION_ART-L7-REPLAY-001.md"
            className="text-sm text-zinc-400"
            target="_blank"
            rel="noreferrer"
          >
            Full guide on GitHub →
          </a>
        </div>
      </section>
    </main>
  );
}
