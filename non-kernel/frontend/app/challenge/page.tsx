"use client";

import Link from "next/link";
import { useState } from "react";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";
import {
  StatusBadge,
  EvidenceGraph,
  VerificationReceipt,
  ReproduceOffline,
} from "@/components/design-system";
import { getReceipt } from "@/data/evidence/receipts";
import {
  CANONICAL_CHALLENGE_ID,
  listChallengeLabRecords,
  type ChallengeLabRecord,
} from "@/data/evidence/challenges";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(7rem,10rem)_1fr] sm:gap-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4af37]">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-zinc-300">{children}</dd>
    </div>
  );
}

function ChallengeInspector({ record }: { record: ChallengeLabRecord }) {
  const receipt = record.artifactId ? getReceipt(record.artifactId) : undefined;
  const [showReceipt, setShowReceipt] = useState(record.sealedEvidence);

  return (
    <article
      className="rounded-xl border border-[rgba(242,214,117,0.24)] bg-[rgba(15,18,13,0.94)]"
      aria-labelledby={`challenge-title-${record.challengeId}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(242,214,117,0.12)] px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <p className="font-mono text-sm text-[#F2D675]">{record.challengeId}</p>
          <h2
            id={`challenge-title-${record.challengeId}`}
            className="mt-1 text-lg text-zinc-100"
          >
            {record.title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={record.evidenceStatus} />
          {record.sealedEvidence && <StatusBadge status="FROZEN" />}
          {record.provenance === "HISTORICAL" && (
            <StatusBadge status="HISTORICAL" />
          )}
        </div>
      </header>

      <dl className="space-y-3.5 px-4 py-4 sm:px-5 sm:space-y-4">
        <Field label="Boundary">{record.boundary}</Field>
        <Field label="Input">
          <span className="font-mono text-xs text-zinc-400">{record.input}</span>
        </Field>
        <Field label="Expected">{record.expected}</Field>
        <Field label="Invariant">
          {record.invariantId ? (
            <span>
              <span className="font-mono text-xs text-zinc-200">
                {record.invariantId}
              </span>
              <span className="mt-0.5 block text-zinc-400">{record.invariant}</span>
            </span>
          ) : (
            record.invariant
          )}
        </Field>
        <Field label="Result (source)">{record.result}</Field>
        <Field label="Reason">{record.reason}</Field>
        <Field label="Verification label">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            {record.verificationLabel}
          </span>
          <span className="mt-0.5 block text-xs text-zinc-500">
            Manifest execution label — not an evidence status. Evidence status
            remains {record.evidenceStatus}.
          </span>
        </Field>
        <Field label="Evidence status">
          <StatusBadge status={record.evidenceStatus} size="md" />
        </Field>
        <Field label="Scope">{record.scope}</Field>
        <Field label="Production authority">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            NOT ESTABLISHED
          </span>
        </Field>
        <Field label="Limitations">
          <ul className="list-disc space-y-1 pl-4 text-zinc-400">
            {record.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </Field>
      </dl>

      <div className="flex flex-wrap gap-2 border-t border-[rgba(242,214,117,0.12)] px-4 py-3 sm:px-5">
        {record.artifactUrl && (
          <a
            href={record.artifactUrl}
            className="inline-flex items-center rounded border border-[rgba(242,214,117,0.28)] bg-[rgba(242,214,117,0.06)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f2d675] transition hover:border-[rgba(242,214,117,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
          >
            Inspect artifact
          </a>
        )}
        {record.receiptAnchor && (
          <Link
            href={record.receiptAnchor}
            className="inline-flex items-center rounded border border-[rgba(242,214,117,0.28)] bg-[rgba(242,214,117,0.06)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f2d675] transition hover:border-[rgba(242,214,117,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d4af37]"
          >
            Open receipt
          </Link>
        )}
        {record.verifierUrl && (
          <Link
            href={record.verifierUrl}
            className="inline-flex items-center rounded border border-[rgba(242,214,117,0.28)] bg-[rgba(242,214,117,0.06)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f2d675] transition hover:border-[rgba(242,214,117,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d4af37]"
          >
            View verifier
          </Link>
        )}
        {record.reproductionUrl && (
          <Link
            href={record.reproductionUrl}
            className="inline-flex items-center rounded border border-[rgba(30,138,75,0.4)] bg-[rgba(30,138,75,0.08)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300 transition hover:border-[rgba(30,138,75,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            Reproduce offline
          </Link>
        )}
        {record.proofId && (
          <Link
            href={`/proof/#${record.proofId}`}
            className="inline-flex items-center rounded border border-zinc-700 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
          >
            Related proof
          </Link>
        )}
        <Link
          href="/verify/"
          className="inline-flex items-center rounded border border-zinc-700 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-400"
        >
          Verify console
        </Link>
        <Link
          href="/limitations/"
          className="inline-flex items-center rounded border border-zinc-700 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-400"
        >
          Limitations
        </Link>
      </div>

      {record.sealedEvidence && receipt && (
        <div className="border-t border-[rgba(242,214,117,0.1)] px-4 py-4 sm:px-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Evidence chain · {record.artifactId}
            </p>
            <button
              type="button"
              onClick={() => setShowReceipt((v) => !v)}
              className="font-mono text-[10px] uppercase tracking-wider text-[#F2D675] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
              aria-expanded={showReceipt}
            >
              {showReceipt ? "Hide receipt" : "Show receipt"}
            </button>
          </div>
          <EvidenceGraph
            artifactId={record.artifactId!}
            claimStatement={`Challenge ${record.challengeId}: ${record.boundary}`}
            evidenceDescription={`Sealed public capsule ${record.artifactId} · ${record.invariant}`}
            compact={!showReceipt}
          />
          {showReceipt && (
            <div className="mt-4">
              <VerificationReceipt data={receipt} />
            </div>
          )}
        </div>
      )}

      {!record.sealedEvidence && (
        <div className="border-t border-[rgba(242,214,117,0.08)] px-4 py-3 sm:px-5">
          <p className="font-mono text-[10px] leading-5 text-zinc-500">
            Fixture: Not established as a sealed public capsule on this surface.
            Evidence status remains {record.evidenceStatus}.
          </p>
        </div>
      )}

      <footer className="border-t border-[rgba(242,214,117,0.08)] px-4 py-2.5 sm:px-5">
        <p className="font-mono text-[10px] leading-5 text-zinc-500">
          The UI is not the authority. Inspect the sealed artifact and verifier.
        </p>
      </footer>
    </article>
  );
}

export default function ChallengeLabPage() {
  const records = listChallengeLabRecords();
  const defaultId =
    records.find((r) => r.challengeId === CANONICAL_CHALLENGE_ID)
      ?.challengeId ?? records[0]?.challengeId ?? "";
  const [selectedId, setSelectedId] = useState(defaultId);
  const selected =
    records.find((r) => r.challengeId === selectedId) ?? records[0];

  return (
    <main className="royal-page overflow-hidden">
      <EvidenceJourneyNav />

      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Public assurance · adversarial verification
          </p>
          <h1 className="mt-4 font-cinzel text-4xl text-zinc-100 sm:text-5xl">
            Challenge Lab
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Inspect deterministic challenges: boundary, input, expected
            invariant, verification method, evidence, and limitations. A
            challenge is useful only when those elements can be inspected
            independently.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            No endpoint here executes production systems or claims certification.
            The website is not the verifier.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
            >
              Proof Registry
            </Link>
            <Link
              href="/verify/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Verify offline
            </Link>
            <Link
              href="/evaluate/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Evaluate
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-400"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          Select challenge → inspect boundary → open evidence → reproduce offline
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,15rem)_1fr]">
          <nav aria-label="Challenge list">
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Challenges
            </p>
            <ul className="mt-3 space-y-1">
              {records.map((r) => {
                const active = selectedId === r.challengeId;
                return (
                  <li key={r.challengeId}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(r.challengeId)}
                      aria-pressed={active}
                      className={`w-full rounded-md px-3 py-2.5 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37] ${
                        active
                          ? "bg-[#D4AF37]/15 text-[#F2D675]"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                    >
                      <span className="block font-mono text-[11px]">
                        {r.challengeId}
                      </span>
                      <span className="mt-0.5 block text-xs text-zinc-500">
                        {r.evidenceStatus}
                        {r.sealedEvidence ? " · sealed" : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>{selected && <ChallengeInspector record={selected} />}</div>
        </div>
      </section>

      <section className="border-t border-zinc-900 bg-[#0b0c0b]/30">
        <div className="container-page py-12">
          <ReproduceOffline />
        </div>
      </section>

      <section className="border-t border-zinc-900">
        <div className="container-page py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Journey
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/proof/" className="text-[#F2D675] hover:underline">
              Proof Registry →
            </Link>
            <Link href="/verify/" className="text-zinc-400 hover:text-[#F2D675]">
              Verify →
            </Link>
            <Link href="/evaluate/" className="text-zinc-400 hover:text-[#F2D675]">
              Evaluate →
            </Link>
            <Link
              href="/limitations/"
              className="text-zinc-500 hover:text-zinc-300"
            >
              Limitations →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
