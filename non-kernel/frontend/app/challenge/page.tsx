"use client";

import Link from "next/link";
import { useState } from "react";
import { challenges } from "../../data/evidence/manifest";
import type { Challenge } from "../../data/evidence/types";
import { ProvenanceBadge } from "../../components/evidence/ProvenanceBadge";
import { TrustStatus } from "../../components/evidence/TrustStatus";

function ChallengeDetail({ c }: { c: Challenge }) {
  return (
    <article className="royal-panel rounded-xl border p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] text-zinc-500">{c.challengeId}</p>
          <h2 className="mt-1 text-xl text-zinc-100">{c.title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-emerald-700/40 bg-emerald-950/30 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-300">
            {c.verification}
          </span>
          <ProvenanceBadge kind={c.provenance} />
        </div>
      </div>
      <p className="mt-3 text-sm text-zinc-400">{c.description}</p>

      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">Input</dt>
          <dd className="mt-1 rounded border border-zinc-800 bg-black/40 p-3 font-mono text-xs text-zinc-300">
            {c.input}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
            Expected
          </dt>
          <dd className="mt-1 text-zinc-300">{c.expected}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">Result</dt>
          <dd className="mt-1 text-zinc-300">{c.result}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
            Invariant
          </dt>
          <dd className="mt-1 font-mono text-xs text-zinc-300">{c.invariant}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">Reason</dt>
          <dd className="mt-1 text-zinc-300">{c.reason}</dd>
        </div>
        {c.receipt && (
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              Receipt
            </dt>
            <dd className="mt-1 font-mono text-xs text-zinc-400">{c.receipt}</dd>
          </div>
        )}
        {c.hash && (
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">Hash</dt>
            <dd className="mt-1 font-mono text-xs text-zinc-400">{c.hash}</dd>
          </div>
        )}
      </dl>

      <ul className="mt-6 flex flex-wrap gap-3 text-[11px] text-zinc-500">
        <li>deterministic</li>
        <li>non-destructive</li>
        <li>isolated from production</li>
      </ul>

      {c.proofId && (
        <Link href={`/proof#${c.proofId}`} className="mt-4 inline-block text-xs text-[#F2D675]">
          Related proof {c.proofId} →
        </Link>
      )}
    </article>
  );
}

export default function ChallengeLabPage() {
  const [selectedId, setSelectedId] = useState(challenges[0]?.challengeId ?? "");
  const selected = challenges.find((c) => c.challengeId === selectedId) ?? challenges[0];

  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Adversarial verification
          </p>
          <h1 className="mt-4 font-cinzel text-4xl text-zinc-100 sm:text-5xl">Challenge Lab</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Safe, deterministic challenge fixtures. Select a challenge and inspect input, expected
            behaviour, result, invariant, and reason. No endpoint here can modify production state.
          </p>
          <div className="mt-6">
            <TrustStatus compact />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
            >
              Proof Registry
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Limitations
            </Link>
            <Link
              href="/governance-model/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Governance model
            </Link>
            <Link
              href="/pillars/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Pillars
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <nav aria-label="Challenge list">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Challenges
            </p>
            <ul className="mt-3 space-y-2">
              {challenges.map((c) => (
                <li key={c.challengeId}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.challengeId)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      selected?.challengeId === c.challengeId
                        ? "border-[#B8860B]/50 bg-[#B8860B]/10 text-[#F2D675]"
                        : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <span className="block font-medium">{c.title}</span>
                    <span className="mt-0.5 block font-mono text-[10px] text-zinc-500">
                      {c.challengeId}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-5 text-zinc-500">
              Results are precomputed demonstration fixtures aligned with published invariants.
              Running them does not execute the EVO-V kernel in this browser.
            </p>
          </nav>

          <div>{selected && <ChallengeDetail c={selected} />}</div>
        </div>

        <div className="mt-14 rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-xl text-zinc-100">Institutional path after challenge review</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Adversarial fixtures are public and non-destructive. Scoped pilots map a written subset
            of invariants onto your stack after Limitations and Proof.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/institutional-pilots/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Design partner pilots
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Product pathway
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
