"use client";

import Link from "next/link";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";
import { useState } from "react";
import { challenges } from "../../data/evidence/manifest";
import type { Challenge } from "../../data/evidence/types";
import { ProvenanceBadge } from "../../components/evidence/ProvenanceBadge";
import { TrustStatus } from "../../components/evidence/TrustStatus";

function ChallengeDetail({ c }: { c: Challenge }) {
  return (
    <article className="rounded-xl border border-[rgba(242,214,117,0.2)] bg-[rgba(15,18,13,0.92)] p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-[#F2D675]">{c.challengeId}</p>
          <h2 className="mt-1 text-lg text-zinc-100">{c.title}</h2>
        </div>
        <ProvenanceBadge provenance={c.provenance} />
      </header>
      <dl className="mt-5 space-y-3 text-sm leading-6 text-zinc-300">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">What is tested</dt>
          <dd className="mt-1">{c.description}</dd>
        </div>
        {c.invariant && (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Invariant</dt>
            <dd className="mt-1">{c.invariant}</dd>
          </div>
        )}
        {c.expectedBehaviour && (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Expected behaviour</dt>
            <dd className="mt-1">{c.expectedBehaviour}</dd>
          </div>
        )}
        {c.resultSummary && (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Result</dt>
            <dd className="mt-1">{c.resultSummary}</dd>
          </div>
        )}
        {c.limitations && (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Does not establish</dt>
            <dd className="mt-1 text-zinc-400">{c.limitations}</dd>
          </div>
        )}
      </dl>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {c.proofId && (
          <Link href={`/proof#${c.proofId}`} className="text-[#F2D675] hover:underline">
            Related proof →
          </Link>
        )}
        <Link href="/verify/" className="text-zinc-400 hover:text-[#F2D675]">
          Verify offline →
        </Link>
        <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
          Limitations →
        </Link>
        <Link href="/evaluate/" className="text-zinc-500 hover:text-zinc-300">
          Evaluate →
        </Link>
      </div>
    </article>
  );
}

export default function ChallengeLabPage() {
  const [selectedId, setSelectedId] = useState(challenges[0]?.challengeId ?? "");
  const selected = challenges.find((c) => c.challengeId === selectedId) ?? challenges[0];

  return (
    <main className="royal-page overflow-hidden">
      <EvidenceJourneyNav />
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
              href="/verify/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Verify offline
            </Link>
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
            >
              Proof Registry
            </Link>
            <Link
              href="/evaluate/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Evaluate evidence
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Limitations
            </Link>
            <Link
              href="/observatory/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Observatory
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_1fr]">
          <nav aria-label="Challenge list">
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Challenges</p>
            <ul className="mt-3 space-y-1">
              {challenges.map((c) => (
                <li key={c.challengeId}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.challengeId)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                      selectedId === c.challengeId
                        ? "bg-[#D4AF37]/15 text-[#F2D675]"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    {c.challengeId}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div>{selected && <ChallengeDetail c={selected} />}</div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 text-sm">
          <Link href="/institutional-pilots/" className="text-[#F2D675] hover:underline">
            Institutional pilots →
          </Link>
          <Link href="/product/" className="text-zinc-400 hover:text-[#F2D675]">
            Product →
          </Link>
          <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
            Limitations →
          </Link>
        </div>
      </section>
    </main>
  );
}
