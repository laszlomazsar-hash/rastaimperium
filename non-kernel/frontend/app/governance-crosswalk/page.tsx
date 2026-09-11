import type { Metadata } from "next";
import Link from "next/link";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";
import { StatusBadge } from "@/components/design-system";
import {
  getFramework,
  listFrameworks,
  listGovernanceMappings,
  type AlignmentStatus,
  type GovernanceMapping,
} from "@/data/evidence/governance";

export const metadata: Metadata = {
  title: "Governance Evidence Crosswalk — Evidence alignment, not compliance",
  description:
    "Inspect how public technical evidence relates to institutional AI governance concerns. Explicit scope, evidence gaps, and compliance assessment: NOT ASSESSED.",
  alternates: { canonical: "https://rastaimperium.com/governance-crosswalk/" },
  openGraph: {
    title: "Governance Evidence Crosswalk — Rasta Imperium",
    description:
      "Evidence alignment ≠ compliance. Capsule-scoped VERIFIED artifacts with production authority not established.",
    url: "https://rastaimperium.com/governance-crosswalk/",
  },
};

function alignmentLabel(a: AlignmentStatus): string {
  switch (a) {
    case "ALIGNED":
      return "ALIGNED";
    case "PARTIALLY_RELEVANT":
      return "PARTIALLY RELEVANT";
    case "NOT_ESTABLISHED":
      return "NOT ESTABLISHED";
    case "NOT_APPLICABLE":
      return "NOT APPLICABLE";
  }
}

function MappingCard({ m }: { m: GovernanceMapping }) {
  const fw = getFramework(m.frameworkId);
  return (
    <article className="rounded-xl border border-[rgba(242,214,117,0.18)] bg-[rgba(15,18,13,0.92)] p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">
            Governance concern
          </p>
          <h3 className="mt-1 text-base font-semibold text-zinc-100 sm:text-lg">
            {m.concern}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            {alignmentLabel(m.alignment)}
          </span>
          {m.evidenceStatus && <StatusBadge status={m.evidenceStatus} />}
        </div>
      </header>

      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Framework context
          </dt>
          <dd className="mt-1 text-zinc-300">
            {fw ? (
              <>
                <span className="text-zinc-200">{fw.name}</span>
                <span className="mt-0.5 block font-mono text-xs text-zinc-500">
                  {fw.version} · {fw.referenceId}
                </span>
                <a
                  href={fw.sourceUrl}
                  className="mt-1 inline-block text-xs text-[#F2D675] hover:underline"
                  rel="noopener noreferrer"
                >
                  Authoritative source →
                </a>
              </>
            ) : (
              m.frameworkId
            )}
          </dd>
        </div>

        {m.artifactId && (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Evidence
            </dt>
            <dd className="mt-1 font-mono text-xs text-[#F2D675]">{m.artifactId}</dd>
          </div>
        )}

        {m.invariantId && (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Invariant
            </dt>
            <dd className="mt-1 font-mono text-xs text-zinc-300">{m.invariantId}</dd>
          </div>
        )}

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Scope
          </dt>
          <dd className="mt-1 text-zinc-400">{m.scope}</dd>
        </div>

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Production authority
          </dt>
          <dd className="mt-1 font-mono text-xs uppercase tracking-wider text-zinc-400">
            NOT ESTABLISHED
          </dd>
        </div>

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Compliance assessment
          </dt>
          <dd className="mt-1 font-mono text-xs uppercase tracking-wider text-zinc-400">
            NOT ASSESSED
          </dd>
        </div>

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Mapping rationale
          </dt>
          <dd className="mt-1 leading-6 text-zinc-400">{m.rationale}</dd>
        </div>

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            What this informs
          </dt>
          <dd className="mt-1 leading-6 text-zinc-300">{m.whatItInforms}</dd>
        </div>

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            What it does not establish
          </dt>
          <dd className="mt-1 leading-6 text-zinc-400">{m.whatItDoesNotEstablish}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {m.receiptHref && (
          <Link href={m.receiptHref} className="text-[#F2D675] hover:underline">
            Receipt →
          </Link>
        )}
        {m.artifactHref && (
          <a href={m.artifactHref} className="text-zinc-400 hover:text-[#F2D675]">
            Artifact →
          </a>
        )}
        {m.challengeHref && (
          <Link href={m.challengeHref} className="text-zinc-400 hover:text-[#F2D675]">
            Challenge →
          </Link>
        )}
        {m.verifyHref && (
          <Link href={m.verifyHref} className="text-zinc-400 hover:text-[#F2D675]">
            Verify →
          </Link>
        )}
        <Link href="/limitations/" className="text-zinc-500 hover:text-zinc-300">
          Limitations →
        </Link>
      </div>
    </article>
  );
}

export default function GovernanceCrosswalkPage() {
  const mappings = listGovernanceMappings();
  const frameworks = listFrameworks();
  const withEvidence = mappings.filter((m) => m.artifactId);
  const gaps = mappings.filter((m) => m.alignment === "NOT_ESTABLISHED");

  return (
    <main className="royal-page overflow-hidden">
      <EvidenceJourneyNav />

      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Public assurance · evidence alignment
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Governance Evidence Crosswalk
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Which governance concerns can the existing public evidence inform — and which remain
            unestablished? This is an evidence-alignment register, not a compliance engine.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            <strong className="text-zinc-400">Evidence alignment ≠ compliance.</strong> Production
            authority remains NOT ESTABLISHED. Compliance assessment remains NOT ASSESSED. The UI is
            not the authority.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Proof Registry
            </Link>
            <Link
              href="/evaluate/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Evaluator Console
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Framework references (version-aware)
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {frameworks.map((f) => (
              <li
                key={f.id}
                className="rounded-xl border border-zinc-800 bg-black/25 p-4"
              >
                <p className="text-sm font-semibold text-zinc-200">{f.name}</p>
                <p className="mt-1 font-mono text-[10px] text-zinc-500">{f.version}</p>
                <p className="mt-2 text-xs leading-5 text-zinc-400">{f.paraphrase}</p>
                <a
                  href={f.sourceUrl}
                  className="mt-2 inline-block text-xs text-[#F2D675] hover:underline"
                  rel="noopener noreferrer"
                >
                  Source →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-cinzel text-2xl text-zinc-100">
            Mappings with public evidence
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            {withEvidence.length} mappings grounded in sealed L7 capsules. Each row includes
            rationale, scope, and explicit non-claims.
          </p>
          <div className="mt-8 space-y-6">
            {withEvidence.map((m) => (
              <MappingCard key={m.id} m={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/40">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-cinzel text-2xl text-zinc-100">Evidence gaps</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Governance concerns without supporting public technical evidence. Gaps are intentional
            outputs of this register.
          </p>
          <div className="mt-8 space-y-6">
            {gaps.map((m) => (
              <MappingCard key={m.id} m={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
            Next evaluation steps
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/evaluate/" className="text-[#F2D675] hover:underline">
              Evaluator Console →
            </Link>
            <Link href="/challenge/" className="text-zinc-400 hover:text-[#F2D675]">
              Challenge Lab →
            </Link>
            <Link href="/verify/" className="text-zinc-400 hover:text-[#F2D675]">
              Verify offline →
            </Link>
            <Link href="/institutional-pilots/" className="text-zinc-400 hover:text-[#F2D675]">
              Institutional pilots →
            </Link>
            <Link href="/governance-model/" className="text-zinc-500 hover:text-zinc-300">
              Governance model →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
