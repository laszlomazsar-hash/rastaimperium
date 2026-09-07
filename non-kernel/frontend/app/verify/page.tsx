import type { Metadata } from "next";
import Link from "next/link";
import {
  StatusBadge,
  ReproduceOffline,
  TrustRail,
} from "../../components/design-system";

export const metadata: Metadata = {
  title: "Verify Console",
  description:
    "Verification console for frozen L7 evidence capsules. Download, run pure offline verifiers, compare sealed hashes. Do not trust the website UI.",
};

/** Presentation only — maps pure-verifier outcomes to human language. Not a browser verifier. */
const OUTCOME_LEGEND = [
  {
    status: "VERIFIED" as const,
    title: "Hash agreement (exit 0)",
    body: "Independent pure verifier recomputed values match the sealed targets in the capsule.",
  },
  {
    status: "INVALID" as const,
    title: "Mismatch (non-zero exit)",
    body: "Declared sealed hashes do not match recomputed digests, or required fields fail checks.",
  },
  {
    status: "SPEC_DRIFT" as const,
    title: "Spec / fixture drift",
    body: "Artifact shape or expected fields do not match the verifier’s declared contract for that capsule.",
  },
  {
    status: "MALFORMED" as const,
    title: "Malformed input",
    body: "JSON cannot be parsed or required structure is absent. Distinct from a cryptographic mismatch.",
  },
  {
    status: "INDETERMINATE" as const,
    title: "Indeterminate",
    body: "Available information is insufficient for a definitive pure-verifier result (rare for frozen public capsules).",
  },
] as const;

const CAPSULES = [
  {
    id: "ART-L7-REPLAY-001",
    claim:
      "Valid-path deterministic replay (INV-001): sealed state, ledger head, and receipt hashes agree under pure replay.",
    verification:
      "Node pure verifier recomputes replay · state · ledger · receipt · double-run parity against sealed targets.",
    command: `$ node verify-art-l7-replay-001.mjs ./ART-L7-REPLAY-001.json\n# RESULT: exit 0 only if sealed hashes match`,
    download: "/evidence/artifacts/ART-L7-REPLAY-001.json",
    guide: "/verify/art-l7-replay-001/",
    proof: "/proof/#PROOF-REPLAY-001",
    limitations:
      "Does not prove production deployment health, LIVE telemetry, or full EVO-V kernel parity.",
  },
  {
    id: "ART-L7-REJECT-001",
    claim:
      "Illegal lifecycle transition is rejected under pure semantics with sealed receipt of the rejection path.",
    verification:
      "Node pure verifier expects ILLEGAL_TRANSITION, state_mutated false, and sealed rejection receipt hashes.",
    command: `$ node verify-art-l7-reject-001.mjs ./ART-L7-REJECT-001.json\n# Expect ILLEGAL_TRANSITION · state_mutated false · sealed receipt`,
    download: "/evidence/artifacts/ART-L7-REJECT-001.json",
    guide: null as string | null,
    proof: "/proof/",
    limitations:
      "Pure semantic rejection — not a production ledger write or operational enforcement claim.",
  },
] as const;

export default function VerifyConsolePage() {
  return (
    <main className="royal-page overflow-hidden">
      {/* Hero */}
      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-12 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Verify console · public surface
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Verify
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            This console explains what you supply, what the pure offline verifier checks, and how to
            reproduce the result yourself. It does not ask you to trust the website.
          </p>

          <TrustRail className="mt-8" />

          {/* Five questions */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { q: "01", t: "What did I give?", d: "A sealed capsule JSON (ART-L7-*)." },
              { q: "02", t: "What was determined?", d: "Exit code + hash agreement." },
              { q: "03", t: "Why?", d: "Declared vs recomputed digests." },
              { q: "04", t: "What supports it?", d: "Frozen artifact + pure verifier." },
              { q: "05", t: "Reproduce?", d: "Node or Python offline, no network." },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-zinc-800 bg-black/25 p-3.5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
                  {item.q}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-zinc-100">{item.t}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="border-b border-zinc-900/80" aria-labelledby="verify-flow-heading">
        <div className="container-page py-10 sm:py-12">
          <h2
            id="verify-flow-heading"
            className="font-cinzel text-xl tracking-wide text-zinc-100 sm:text-2xl"
          >
            Verification flow
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Authoritative verification runs offline in a pure verifier. The browser is not the
            decision authority.
          </p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              { n: "Input", d: "Obtain the sealed ART-L7 capsule JSON from this site or the repository." },
              { n: "Verify", d: "Run the matching pure verifier (Node or Python). No network." },
              { n: "Checks", d: "Hash, structure, and capsule-specific invariants as declared in the verifier." },
              { n: "Reproduce", d: "Exit 0 and exact sealed-hash match are the independent result." },
            ].map((step, i) => (
              <li
                key={step.n}
                className="rounded-xl border border-[rgba(242,214,117,0.18)] bg-[rgba(11,12,11,0.85)] p-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{step.n}</p>
                <p className="mt-1.5 text-xs leading-5 text-zinc-500">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Outcome legend — textual states, not color-only */}
      <section className="border-b border-zinc-900/80" aria-labelledby="outcome-legend-heading">
        <div className="container-page py-10 sm:py-12">
          <h2
            id="outcome-legend-heading"
            className="font-cinzel text-xl tracking-wide text-zinc-100 sm:text-2xl"
          >
            How to read a pure-verifier result
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Labels below describe offline verifier outcomes. They are not website-issued certificates.
            Public L7 capsules on this surface are already recorded as VERIFIED in the Living Evidence
            Manifest after independent hash agreement.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOME_LEGEND.map((row) => (
              <li
                key={row.status}
                className="rounded-xl border border-zinc-800 bg-black/30 p-4"
              >
                <StatusBadge status={row.status} size="md" />
                <p className="mt-3 text-sm font-semibold text-zinc-100">{row.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-zinc-500">{row.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Capsules — Claim → Evidence → Verification → Reproduction → Limitations */}
      <section className="border-b border-zinc-900/80" aria-labelledby="capsules-heading">
        <div className="container-page space-y-6 py-10 sm:space-y-8 sm:py-12">
          <div>
            <h2
              id="capsules-heading"
              className="font-cinzel text-xl tracking-wide text-zinc-100 sm:text-2xl"
            >
              Public capsules
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Each entry follows Claim → Evidence → Verification → Reproduction → Limitations.
              Status reflects the Living Evidence Manifest, not a live browser check.
            </p>
          </div>

          {CAPSULES.map((cap) => (
            <article
              key={cap.id}
              className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-5 sm:p-6"
              aria-labelledby={`capsule-${cap.id}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  id={`capsule-${cap.id}`}
                  className="font-mono text-sm tracking-wide text-[#F2D675] sm:text-base"
                >
                  {cap.id}
                </h3>
                <StatusBadge status="VERIFIED" />
                <StatusBadge status="FROZEN" />
              </div>

              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Claim
                  </dt>
                  <dd className="mt-1 leading-6 text-zinc-300">{cap.claim}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Evidence
                  </dt>
                  <dd className="mt-1">
                    <a className="text-[#F2D675] hover:underline" href={cap.download}>
                      Download {cap.id}.json
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Verification
                  </dt>
                  <dd className="mt-1 leading-6 text-zinc-400">{cap.verification}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Reproduction
                  </dt>
                  <dd className="mt-2">
                    <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-zinc-800 bg-black/50 p-3 font-mono text-[11px] leading-5 text-zinc-300 sm:text-xs">
                      {cap.command}
                    </pre>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Limitations
                  </dt>
                  <dd className="mt-1 leading-6 text-zinc-500">{cap.limitations}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a className="text-[#F2D675] hover:underline" href={cap.download}>
                  Download capsule
                </a>
                {cap.guide ? (
                  <Link href={cap.guide} className="text-zinc-400 hover:text-[#F2D675]">
                    Detailed guide →
                  </Link>
                ) : null}
                <Link href={cap.proof} className="text-zinc-400 hover:text-[#F2D675]">
                  Proof Registry →
                </Link>
              </div>
            </article>
          ))}

          <article className="rounded-xl border border-zinc-800 bg-black/25 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-mono text-sm text-[#F2D675]">ART-L7-PARITY-002</h3>
              <StatusBadge status="VERIFIED" />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Cross-implementation parity: Node · Python · Go exact hash agreement for the sealed L7
              path, recorded in the public evidence set.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href="/audit/" className="text-[#F2D675] hover:underline">
                Auditor handoff →
              </Link>
              <Link href="/proof/" className="text-zinc-400 hover:text-[#F2D675]">
                Proof Registry →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Reproduce */}
      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <ReproduceOffline />
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <a
              className="text-[#F2D675] hover:underline"
              href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/PURE_VERIFIER_README.md"
              target="_blank"
              rel="noreferrer"
            >
              Pure Verifier README →
            </a>
            <a
              className="text-[#F2D675] hover:underline"
              href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md"
              target="_blank"
              rel="noreferrer"
            >
              Reproduce offline (one-command) →
            </a>
            <a
              className="text-zinc-400 hover:text-[#F2D675]"
              href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/EVIDENCE_MANIFEST.md"
              target="_blank"
              rel="noreferrer"
            >
              Living Evidence Manifest →
            </a>
            <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
              Limitations →
            </Link>
          </div>
        </div>
      </section>

      {/* Scope notice */}
      <section className="container-page py-10 sm:py-12">
        <div className="rounded-xl border border-amber-900/35 bg-amber-950/15 p-5 sm:p-6">
          <h2 className="font-cinzel text-lg text-amber-100">Scope of this console</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-zinc-400">
            <li>Capsule-scoped pure verification of frozen public artifacts.</li>
            <li>Not a production LIVE telemetry console or deployment health dashboard.</li>
            <li>Not a browser-side reimplementation of the pure verifier decision engine.</li>
            <li>Epistemic statuses on public claims remain those in the Living Evidence Manifest.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
