import type { Metadata } from "next";
import Link from "next/link";
import {
  StatusBadge,
  ReproduceOffline,
  TrustRail,
  TrustLadder,
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

          <div className="mt-6">
            <TrustLadder variant="full" current="verify" />
          </div>
        </div>
      </section>

      {/* Outcome legend */}
      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/40">
        <div className="container-page py-10 sm:py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Outcome vocabulary
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">What a pure-verifier result means</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOME_LEGEND.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-800 bg-black/20 p-4"
              >
                <StatusBadge status={item.status} />
                <p className="mt-3 text-sm font-semibold text-zinc-100">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capsules */}
      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Sealed public capsules
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">What you can verify today</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Capsule-scoped only. Status labels match the Living Evidence Manifest. Download the JSON,
            run a pure verifier offline, and compare hashes — the website UI is not the proof.
          </p>

          <div className="mt-8 space-y-6">
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
                <h3 className="font-mono text-sm text-[#F2D675]">ART-L7-PARITY-001</h3>
                <StatusBadge status="VERIFIED" />
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Cross-implementation parity: independent Node and Python pure verifiers produce
                identical sealed hashes for the same L7 capsules. Capsule-scoped only — matches the
                Living Evidence Manifest.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a
                  href="/evidence/artifacts/ART-L7-PARITY-001.json"
                  className="text-[#F2D675] hover:underline"
                >
                  Download capsule →
                </a>
                <Link href="/proof/#PROOF-PARITY-001" className="text-zinc-400 hover:text-[#F2D675]">
                  Proof Registry →
                </Link>
                <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
                  Limitations →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Reproduce */}
      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <ReproduceOffline />
        </div>
      </section>

      {/* Boundary */}
      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/30">
        <div className="container-page py-10 sm:py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Boundary
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">What this console is not</h2>
          <ul className="mt-6 max-w-2xl space-y-2 text-sm leading-6 text-zinc-400">
            <li>· Not a production runtime health dashboard</li>
            <li>· Not LIVE telemetry of EVO-V fleets</li>
            <li>· Not a substitute for offline pure-verifier reproduction</li>
            <li>· Not certification or court-ready assurance language</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/limitations/" className="text-[#F2D675] hover:underline">
              Read Limitations →
            </Link>
            <Link href="/proof/" className="text-zinc-400 hover:text-[#F2D675]">
              Proof Registry →
            </Link>
            <Link href="/audit/" className="text-zinc-400 hover:text-[#F2D675]">
              Auditor handoff →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
