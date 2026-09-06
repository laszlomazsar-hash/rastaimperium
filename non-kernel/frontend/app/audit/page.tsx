import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Independent Auditor Handoff",
  description:
    "Reproduce or challenge frozen L7 evidence offline. No account required. No trust in this website required.",
};

const ladder = [
  { level: 1, label: "Offline reproduction", status: "EARNED", tone: "earned" },
  { level: 2, label: "External human review", status: "OPEN", tone: "open" },
  { level: 3, label: "Independent implementation (Go)", status: "EARNED", tone: "earned" },
  { level: 4, label: "Adversarial challenge + hardening", status: "EARNED", tone: "earned" },
  { level: 5, label: "Full EVO-V parity", status: "UNAVAILABLE", tone: "none" },
  { level: 6, label: "Production / LIVE evidence", status: "UNAVAILABLE", tone: "none" },
] as const;

function StatusPill({ tone, status }: { tone: string; status: string }) {
  const cls =
    tone === "earned"
      ? "border-emerald-700/50 text-emerald-300"
      : tone === "open"
        ? "border-amber-700/50 text-amber-200"
        : "border-zinc-700 text-zinc-500";
  return (
    <span className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

export default function AuditPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Phase 10.2 · Independent review
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl text-zinc-100 sm:text-5xl">
            Auditor handoff
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            You do not need to trust Rasta Imperium to reproduce this evidence.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
            No account required · No trust in this website required · Report reproduction or
            disagreement
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded border border-amber-700/50 px-2 py-0.5 font-mono text-[10px] uppercase text-amber-200">
              External review: OPEN
            </span>
            <span className="rounded border border-zinc-600 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
              Not a certification
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
            >
              Proof Registry
            </Link>
            <Link
              href="/evidence/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Evidence Explorer
            </Link>
            <Link
              href="/challenge/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Challenge Lab
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Limitations
            </Link>
            <Link
              href="/governance-model/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Governance model
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page space-y-10 py-12">
        <article className="royal-panel rounded-xl border p-6">
          <h2 className="font-cinzel text-lg text-zinc-100">Verification ladder</h2>
          <ul className="mt-4 space-y-3">
            {ladder.map((row) => (
              <li
                key={row.level}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-900 py-2 text-sm"
              >
                <span className="text-zinc-300">
                  <span className="font-mono text-zinc-500">L{row.level}</span> {row.label}
                </span>
                <StatusPill tone={row.tone} status={row.status} />
              </li>
            ))}
          </ul>
        </article>

        <article className="royal-panel rounded-xl border p-6">
          <h2 className="font-cinzel text-lg text-zinc-100">Frozen artifacts</h2>
          <ul className="mt-3 space-y-2 font-mono text-xs text-zinc-400">
            <li>ART-L7-REPLAY-001 — valid-path sealed capsule</li>
            <li>ART-L7-REJECT-001 — illegal-transition sealed capsule</li>
            <li>ART-L7-PARITY-001 — Node ↔ Python</li>
            <li>ART-L7-PARITY-002 — Node ↔ Python ↔ Go</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a className="text-[#F2D675] hover:underline" href="/evidence/artifacts/ART-L7-REPLAY-001.json">
              Download REPLAY capsule
            </a>
            <a className="text-[#F2D675] hover:underline" href="/evidence/artifacts/ART-L7-REJECT-001.json">
              Download REJECT capsule
            </a>
            <a className="text-zinc-400 hover:underline" href="/evidence/artifacts/ART-L7-PARITY-002.json">
              Parity report
            </a>
          </div>
        </article>

        <article className="royal-panel rounded-xl border p-6">
          <h2 className="font-cinzel text-lg text-zinc-100">Reproduce offline</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Implementations: Node.js · Python 3 · Go. Each computes hashes independently.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-black/50 p-4 font-mono text-xs text-zinc-300">{`# Example — Node replay
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs ./ART-L7-REPLAY-001.json
# EXIT 0 + sealed hash match required

python3 non-kernel/frontend/scripts/verify_art_l7_replay_001.py ./ART-L7-REPLAY-001.json

# Go (from scripts/impl-c)
go build -o verify_replay verify_art_l7_replay_001.go
./verify_replay ./ART-L7-REPLAY-001.json`}</pre>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/verify/" className="text-[#F2D675]">
              Verification hub →
            </Link>
            <Link href="/verify/art-l7-replay-001/" className="text-zinc-400">
              Replay capsule guide →
            </Link>
          </div>
        </article>

        <article className="royal-panel rounded-xl border p-6">
          <h2 className="font-cinzel text-lg text-zinc-100">Challenge the evidence</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Self-administered adversarial tests — not a security certification.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-400">
            <li>C1–C7 fixed probes (challenge-art-l7.mjs)</li>
            <li>16 mutation tests (mutation-art-l7.mjs)</li>
            <li>14 canonicalization edge cases (canon-edge-art-l7.mjs)</li>
          </ul>
          <Link href="/challenge/" className="mt-4 inline-block text-sm text-[#F2D675]">
            Challenge Lab →
          </Link>
        </article>

        <article className="royal-panel rounded-xl border p-6">
          <h2 className="font-cinzel text-lg text-zinc-100">Expected PASS condition</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            Independent run matches sealed expected hashes for both capsules across implementations
            you execute. Disagreement is as valuable as agreement — report environment, commands,
            and computed hashes.
          </p>
        </article>

        <article className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-6">
          <h2 className="font-cinzel text-lg text-amber-100">Not claimed</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Production deployment, LIVE telemetry, full-kernel parity, complete attack coverage,
            external certification.{" "}
            <Link href="/limitations/" className="text-[#F2D675]">
              Full limitations →
            </Link>
          </p>
        </article>

        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-xl text-zinc-100">Institutional next steps</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Independent reproduction is public. Scoped pilots and formal audit inquiries follow
            after Limitations and sealed capsules.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=audit"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Open audit inquiry
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Design partner pilots
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Product pathway
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/trust/" className="text-zinc-400">
            Trust Console →
          </Link>
          <Link href="/proof/" className="text-zinc-400">
            Proof Registry →
          </Link>
          <Link href="/evidence/" className="text-zinc-400">
            Evidence Explorer →
          </Link>
          <a
            className="text-zinc-400"
            href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/AUDITOR_INVITATION_L7.md"
            target="_blank"
            rel="noreferrer"
          >
            Invitation on GitHub →
          </a>
        </div>
      </section>
    </main>
  );
}
