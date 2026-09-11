import type { Metadata } from "next";
import Link from "next/link";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";
import { StatusBadge, ReproduceOffline } from "@/components/design-system";
import {
  EVIDENCE_SOURCE_INDEX,
  PRESERVATION_STEPS,
  listReproducibilityRecords,
  toExportJson,
  type ReproducibilityRecord,
} from "@/data/evidence/reproducibility";

export const metadata: Metadata = {
  title: "Evidence Export — Obtain, reproduce, preserve",
  description:
    "Obtain sealed public artifacts, inspect pure verifiers, reproduce offline, and preserve your own verification record. The website is not the authority.",
  alternates: { canonical: "https://rastaimperium.com/evidence/export/" },
  openGraph: {
    title: "Evidence Export — Rasta Imperium",
    description:
      "Independent reproduction of public AI evidence. Production authority not established.",
    url: "https://rastaimperium.com/evidence/export/",
  },
};

function RecordCard({ r }: { r: ReproducibilityRecord }) {
  const exportObj = toExportJson(r);
  const exportText = JSON.stringify(exportObj, null, 2);

  return (
    <article className="rounded-xl border border-[rgba(242,214,117,0.2)] bg-[rgba(15,18,13,0.92)] p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-[#F2D675]">{r.artifactId}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            {r.invariantId}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={r.status} />
          {r.modifiers?.includes("FROZEN") && <StatusBadge status="FROZEN" />}
          {r.modifiers?.includes("HISTORICAL") && <StatusBadge status="HISTORICAL" />}
        </div>
      </header>

      <dl className="mt-5 space-y-3 text-sm leading-6 text-zinc-300">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Invariant
          </dt>
          <dd className="mt-1 text-zinc-400">{r.invariantDescription}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Artifact hash (manifest presentation)
          </dt>
          <dd className="mt-1 font-mono text-xs text-zinc-400 break-all">
            {r.artifactHash ?? "Not established"}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Verifier
          </dt>
          <dd className="mt-1">{r.verifierImplementation}</dd>
          <dd className="mt-0.5 font-mono text-xs text-zinc-500">{r.verifierPath}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Reproduction command
          </dt>
          <dd className="mt-1">
            <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-black/40 p-3 font-mono text-xs text-zinc-300">
              {r.command}
              {r.commandAlt ? `\n${r.commandAlt}` : ""}
            </pre>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Environment
          </dt>
          <dd className="mt-1 text-zinc-400">{r.environment}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Expected / Observed
          </dt>
          <dd className="mt-1 font-mono text-xs uppercase tracking-wider text-zinc-500">
            Not established until offline pure-verifier execution
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Scope · Production authority
          </dt>
          <dd className="mt-1 text-zinc-400">
            {r.scope} ·{" "}
            <span className="font-mono text-xs uppercase tracking-wider">NOT ESTABLISHED</span>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Limitations
          </dt>
          <dd className="mt-1">
            <ul className="list-disc space-y-1 pl-4 text-zinc-400">
              {r.limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <a href={r.artifactUrl} className="text-[#F2D675] hover:underline">
          Download sealed artifact →
        </a>
        <Link href={r.receiptHref} className="text-zinc-400 hover:text-[#F2D675]">
          Verification receipt →
        </Link>
        <a
          href={r.verifierDocUrl}
          className="text-zinc-400 hover:text-[#F2D675]"
          rel="noopener noreferrer"
        >
          Verifier docs →
        </a>
        <a
          href={r.reproductionDocUrl}
          className="text-zinc-400 hover:text-[#F2D675]"
          rel="noopener noreferrer"
        >
          Reproduce offline →
        </a>
        <Link href="/verify/" className="text-zinc-500 hover:text-zinc-300">
          Verify console →
        </Link>
      </div>

      <details className="mt-5 rounded-lg border border-zinc-800 bg-black/30 p-3">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-wider text-[#d4af37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]">
          Machine-readable export template (evaluator-local)
        </summary>
        <p className="mt-2 text-xs text-zinc-500">
          Copy this JSON into your own archive. It is not a certification issued by Rasta Imperium.
          expected/observed remain null until you run the verifier offline.
        </p>
        <pre className="mt-3 max-h-64 overflow-auto rounded-md border border-zinc-800 bg-black/50 p-3 font-mono text-[11px] leading-5 text-zinc-400">
          {exportText}
        </pre>
      </details>

      <p className="mt-4 font-mono text-[10px] leading-5 text-zinc-500">
        The UI is not the authority. Inspect the sealed artifact and verifier.
      </p>
    </article>
  );
}

export default function EvidenceExportPage() {
  const records = listReproducibilityRecords();

  return (
    <main className="royal-page overflow-hidden">
      <EvidenceJourneyNav />

      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Public assurance · reproducibility
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Evidence Export
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Obtain the public artifact, inspect the verifier, reproduce the result offline, and
            preserve your own verification record. This surface indexes authoritative files — it does
            not generate fabricated evidence packages.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            No bundled zip of reconstructed results is published. Use the sealed artifact URLs and
            repository verifiers directly. Production authority remains{" "}
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              NOT ESTABLISHED
            </span>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/verify/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Verify console
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Proof Registry
            </Link>
            <Link
              href="/challenge/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Challenge Lab
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Authoritative source index
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {EVIDENCE_SOURCE_INDEX.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-lg border border-zinc-800 bg-black/25 px-4 py-3 text-sm text-[#F2D675] hover:border-[rgba(242,214,117,0.3)]"
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {item.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-cinzel text-2xl text-zinc-100">
            Capsule reproducibility records
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Workflow: obtain artifact → inspect → obtain verifier → run command → compare → preserve
            local record.
          </p>
          <div className="mt-8 space-y-6">
            {records.map((r) => (
              <RecordCard key={r.artifactId} r={r} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/30">
        <div className="container-page py-10">
          <ReproduceOffline />
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-cinzel text-2xl text-zinc-100">Preserve independently</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Rasta Imperium does not control the evaluator’s archive. Preserve what you inspected.
          </p>
          <ol className="mt-6 max-w-2xl list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-400">
            {PRESERVATION_STEPS.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-black/25 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">
              Local reproduction record (template fields)
            </p>
            <pre className="mt-3 overflow-x-auto font-mono text-xs leading-6 text-zinc-400">{`Artifact:
Invariant:
Verifier / commit:
Environment:
Command:
Expected: Not established (until offline run)
Observed: (your local result)
Exit code:
Date:
Notes:`}</pre>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
            Journey
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/proof/" className="text-[#F2D675] hover:underline">
              Proof →
            </Link>
            <Link href="/verify/" className="text-zinc-400 hover:text-[#F2D675]">
              Verify →
            </Link>
            <Link href="/challenge/" className="text-zinc-400 hover:text-[#F2D675]">
              Challenge →
            </Link>
            <Link href="/evaluate/" className="text-zinc-400 hover:text-[#F2D675]">
              Evaluate →
            </Link>
            <Link
              href="/governance-crosswalk/"
              className="text-zinc-400 hover:text-[#F2D675]"
            >
              Governance crosswalk →
            </Link>
            <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
              Limitations →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
