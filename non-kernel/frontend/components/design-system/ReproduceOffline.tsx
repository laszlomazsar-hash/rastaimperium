/**
 * ReproduceOffline — consistent bridge to auditor workflow.
 * Links only to existing documentation.
 */
import React from "react";

const STEPS = [
  {
    n: "01",
    title: "Obtain capsule",
    body: "Download the sealed ART-L7 JSON artifact (or clone the repository).",
  },
  {
    n: "02",
    title: "Run verifier",
    body: "Node.js or Python pure verifier. No network required. No mutation of the artifact.",
  },
  {
    n: "03",
    title: "Compare deterministic result",
    body: "Exit code 0 and exact hash match against sealed expected values.",
  },
] as const;

export function ReproduceOffline({ className = "" }: { className?: string }) {
  return (
    <section
      className={`rounded-xl border border-[rgba(242,214,117,0.28)] bg-[rgba(15,18,13,0.92)] p-5 sm:p-6 ${className}`}
      aria-labelledby="reproduce-offline-heading"
    >
      <h2
        id="reproduce-offline-heading"
        className="font-cinzel text-lg tracking-wide text-zinc-100"
      >
        Reproduce offline
      </h2>
      <p className="mt-1 text-sm text-zinc-400">
        Independent verification. Do not trust the website UI.
      </p>

      <ol className="mt-5 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.n} className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
              {step.n}
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{step.title}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <span className="rounded border border-zinc-700 px-2.5 py-1 font-mono text-xs text-zinc-300">
          Node.js
        </span>
        <span className="rounded border border-zinc-700 px-2.5 py-1 font-mono text-xs text-zinc-300">
          Python
        </span>
        <a
          className="text-[#f2d675] hover:underline"
          href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/PURE_VERIFIER_README.md"
          target="_blank"
          rel="noreferrer"
        >
          Pure Verifier README →
        </a>
        <a
          className="text-zinc-400 hover:text-[#f2d675]"
          href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md"
          target="_blank"
          rel="noreferrer"
        >
          One-command guide →
        </a>
        <a
          className="text-zinc-500 hover:text-zinc-300"
          href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/EVIDENCE_MANIFEST.md"
          target="_blank"
          rel="noreferrer"
        >
          Living Manifest →
        </a>
      </div>
    </section>
  );
}
