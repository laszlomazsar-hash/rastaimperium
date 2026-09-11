import type { Metadata } from "next";
import Link from "next/link";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";
import { StatusBadge } from "@/components/design-system";
import type { EvidenceStatus } from "@/components/design-system/StatusBadge";
import {
  ASSURANCE_JOURNEY,
  PILOT_DECISION_OPTIONS,
  PILOT_EVIDENCE_REQUIRED,
  PILOT_EXCLUDED,
  PILOT_INCLUDED,
  PILOT_SUCCESS_CONDITIONS,
  PILOT_TEMPLATE_FIELDS,
  listPilotReadinessRows,
  type PilotEvidenceCellStatus,
} from "@/data/evidence/pilot";

export const metadata: Metadata = {
  title: "Institutional Pilots — Bounded evaluation, not certification",
  description:
    "Evidence-led design partner pilots: inspect sealed L7 capsules, define a written boundary, reproduce offline, document gaps. Production authority remains not established on the public surface.",
  openGraph: {
    title: "Institutional Pilots — Rasta Imperium",
    description:
      "What can be independently inspected today, what remains unestablished, and what a bounded pilot would need next.",
    url: "https://rastaimperium.com/institutional-pilots/",
  },
  alternates: { canonical: "https://rastaimperium.com/institutional-pilots/" },
};

function statusBadgeFor(s: PilotEvidenceCellStatus) {
  if (s === "VERIFIED" || s === "DEMONSTRATION" || s === "UNAVAILABLE") {
    return <StatusBadge status={s as EvidenceStatus} />;
  }
  return (
    <span className="rounded border border-zinc-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
      {s.replace(/_/g, " ")}
    </span>
  );
}

const deliverables = [
  {
    title: "Duration",
    body: "Typically 8–12 weeks (extendable by mutual written agreement).",
  },
  {
    title: "Indicative investment",
    body: "Design partner pilots are scoped in the $50k–$150k range depending on stack complexity, governed decision paths, and integration depth. Not a self-serve price list.",
  },
  {
    title: "You receive",
    body: "Written boundary, success conditions limited to measurable evaluation outcomes, challenge/reproduction records, evidence handoff notes, and open-question register.",
  },
  {
    title: "You provide",
    body: "Decision context, systems in scope, compliance or audit requirements, and a technical counterpart. Institutional judgement remains yours.",
  },
];

export default function InstitutionalPilotsPage() {
  const matrix = listPilotReadinessRows();

  return (
    <main className="royal-page overflow-hidden">
      <EvidenceJourneyNav />

      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Institutional assurance · design partner pilots
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Bounded evaluation before scale
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Determine what can be independently inspected today, what remains unestablished, and what
            a scoped pilot would need to establish next. A pilot is a bounded evaluation — not a
            deployment approval or certification.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Production authority remains{" "}
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              NOT ESTABLISHED
            </span>{" "}
            on the public surface. The UI is not the authority.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/evaluate/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Evaluator Console
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Proof Registry
            </Link>
            <Link
              href="/evidence/export/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Evidence export
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-400"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Assurance journey
          </p>
          <nav aria-label="Assurance journey" className="mt-3 overflow-x-auto">
            <ol className="flex min-w-max flex-wrap gap-2 text-xs">
              {ASSURANCE_JOURNEY.map((j, i) => (
                <li key={j.label} className="flex items-center gap-2">
                  {i > 0 && <span className="text-zinc-600">→</span>}
                  <Link
                    href={j.href}
                    className="rounded border border-zinc-800 px-2 py-1 text-zinc-400 hover:border-[#B8860B]/40 hover:text-[#F2D675]"
                  >
                    {j.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-cinzel text-2xl text-zinc-100">Pilot readiness matrix</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Public evidence status only. Gaps are not automatic system failures — they mark what a
            pilot or institutional process would still need to establish.
          </p>

          <div className="mt-8 space-y-3">
            {matrix.map((row) => (
              <article
                key={row.id}
                className="rounded-xl border border-zinc-800 bg-black/25 p-4 sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto_minmax(0,1.4fr)] sm:items-start sm:gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{row.area}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Current evidence
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">{row.currentEvidence}</p>
                  {row.href && (
                    <Link href={row.href} className="mt-1 inline-block text-xs text-[#F2D675]">
                      Open →
                    </Link>
                  )}
                </div>
                <div className="mt-2 sm:mt-0">{statusBadgeFor(row.status)}</div>
                <div className="mt-2 sm:mt-0">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Next evidence required
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">{row.nextEvidence}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/30">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-cinzel text-2xl text-zinc-100">Pilot boundary</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-emerald-900/35 bg-emerald-950/10 p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                Included
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                {PILOT_INCLUDED.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald-700">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/25 p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Excluded
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                {PILOT_EXCLUDED.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-zinc-600">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-black/25 p-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#d4af37]">
              Evidence required
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {PILOT_EVIDENCE_REQUIRED.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-zinc-500">
              Decision authority: the institution decides whether evidence is sufficient. Rasta
              Imperium does not issue production approval from this site.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-cinzel text-2xl text-zinc-100">Success conditions</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Measurable evaluation outcomes only — not performance guarantees or certification.
          </p>
          <ul className="mt-6 max-w-2xl space-y-2 text-sm leading-6 text-zinc-400">
            {PILOT_SUCCESS_CONDITIONS.map((c) => (
              <li key={c}>· {c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-cinzel text-2xl text-zinc-100">Decision pathway</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Workflow choices for the evaluator — not recommendations issued as product claims.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PILOT_DECISION_OPTIONS.map((d) => (
              <li
                key={d.id}
                className="rounded-xl border border-zinc-800 bg-black/25 p-4"
              >
                <Link
                  href={d.href}
                  className="text-sm font-semibold text-[#F2D675] hover:underline"
                >
                  {d.label} →
                </Link>
                <p className="mt-1.5 text-xs leading-5 text-zinc-500">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-900/80 bg-[#0b0c0b]/30">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-cinzel text-2xl text-zinc-100">Pilot brief template</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Evaluator-owned fields. Not submitted automatically. Do not paste secrets into the public
            site.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-xl border border-zinc-800 bg-black/40 p-4 font-mono text-xs leading-6 text-zinc-400">
            {PILOT_TEMPLATE_FIELDS.map((f) => `${f}:`).join("\n")}
          </pre>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-10 sm:py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Indicative commercial terms
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Scoped, paid, evidence-bound</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Final terms are written per engagement. Ranges orient institutional buyers; they are not
            a public self-serve price list.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {deliverables.map((d) => (
              <div key={d.title} className="rounded-xl border border-zinc-800 bg-black/25 p-5">
                <h3 className="text-lg text-[#F2D675]">{d.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-12 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">
            Request pilot scoping or an evidence walkthrough
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-500">
            Bring decision context, systems in scope, and evidence requirements. No fabricated
            customers or pilot outcomes are claimed on this surface.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Contact · design partner
            </Link>
            <Link
              href="/governance-crosswalk/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Governance crosswalk
            </Link>
            <Link
              href="/evidence/export/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Reproduce offline
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
