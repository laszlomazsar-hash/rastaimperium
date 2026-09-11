import type { Metadata } from "next";
import Link from "next/link";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";
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
    receipt: "/proof/#receipt-ART-L7-REPLAY-001",
    limitations:
      "Does not prove production deployment health, LIVE telemetry, or full EVO-V kernel parity.",
  },
  {
    id: "ART-L7-REJECT-001",
    claim:
      "Illegal lifecycle transition is rejected under pure semantics with sealed receipt of the rejection path.",
    verification:
      "Node pure verifier expects ILLEGAL_TRANSITION, state_mutated false, and sealed rejection receipt hashes.",
    command: `$ node verify-art-l7-reject-001.mjs ./ART-L7-REJECT-001.json\n# RESULT: exit 0 only if rejection path matches sealed targets`,
    download: "/evidence/artifacts/ART-L7-REJECT-001.json",
    guide: "/verify/",
    proof: "/proof/#PROOF-ILLEGAL-001",
    receipt: "/proof/#receipt-ART-L7-REJECT-001",
    limitations:
      "Capsule-scoped rejection proof only. Not a general security certification.",
  },
  {
    id: "ART-L7-PARITY-001",
    claim:
      "Cross-implementation parity: independent Node and Python pure verifiers agree on sealed digests.",
    verification:
      "Parity gate runs both pure verifiers and requires exact hash agreement on the sealed capsule.",
    command: `$ node parity-art-l7.mjs --artifact ./ART-L7-PARITY-001.json\n# RESULT: exit 0 only if Node and Python agree`,
    download: "/evidence/artifacts/ART-L7-PARITY-001.json",
    guide: "/verify/",
    proof: "/proof/#PROOF-PARITY-001",
    receipt: "/proof/#receipt-ART-L7-PARITY-001",
    limitations:
      "Parity among pure verifiers for this capsule — not full-kernel parity or production runtime agreement.",
  },
] as const;

export default function VerifyPage() {
  return (
    <main className="royal-page overflow-hidden">
      <EvidenceJourneyNav />
      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Verify console · offline pure verifiers
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Verify
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Download sealed public capsules and run pure offline verifiers. The website UI is not the
            authority — recomputed hashes and exit codes are.
          </p>
          <div className="mt-8">
            <TrustRail />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Outcome legend
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Verification result states</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            States below are presentation of pure-verifier outcomes. They are not browser-run results
            and do not change the Living Evidence Manifest.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOME_LEGEND.map((o) => (
              <li
                key={o.title}
                className="rounded-xl border border-zinc-800 bg-black/25 p-4"
              >
                <div className="flex items-center gap-2">
                  <StatusBadge status={o.status === "VERIFIED" ? "VERIFIED" : o.status === "INVALID" ? "UNAVAILABLE" : "DEMONSTRATION"} />
                  <p className="font-mono text-xs text-zinc-200">{o.title}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{o.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/90">
            Public VERIFIED capsules
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Declared · inspected · recomputed</h2>
          <ul className="mt-8 space-y-6">
            {CAPSULES.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-5 sm:p-6"
              >
                <p className="font-mono text-sm font-semibold text-[#F2D675]">{c.id}</p>
                <dl className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      Claim
                    </dt>
                    <dd className="mt-1">{c.claim}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      Verification
                    </dt>
                    <dd className="mt-1">{c.verification}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      Command
                    </dt>
                    <dd className="mt-1">
                      <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-black/40 p-3 font-mono text-xs text-zinc-300">
                        {c.command}
                      </pre>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      Limitation
                    </dt>
                    <dd className="mt-1 text-zinc-400">{c.limitations}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <a href={c.download} className="text-[#F2D675] hover:underline">
                    Download JSON
                  </a>
                  <Link href={c.proof} className="text-zinc-400 hover:text-[#F2D675]">
                    Open proof record
                  </Link>
                  <Link href={c.receipt} className="text-zinc-400 hover:text-[#F2D675]">
                    View receipt
                  </Link>
                  <Link href="/challenge/" className="text-zinc-400 hover:text-[#F2D675]">
                    Challenge Lab
                  </Link>
                  <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
                    Limitations
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10">
          <ReproduceOffline />
          <div className="mt-8">
            <TrustLadder />
          </div>
        </div>
      </section>

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
            <Link href="/challenge/" className="text-[#F2D675] hover:underline">
              Challenge invariants →
            </Link>
            <Link href="/limitations/" className="text-zinc-400 hover:text-[#F2D675]">
              Read limitations →
            </Link>
            <Link href="/evaluate/" className="text-zinc-400 hover:text-[#F2D675]">
              Evaluate in institutional context →
            </Link>
            <Link href="/observatory/" className="text-zinc-500 hover:text-zinc-300">
              Evidence Observatory →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
