import type { Metadata } from "next";
import Link from "next/link";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";
import { StatusBadge } from "@/components/design-system";

export const metadata: Metadata = {
  title: "EVO-G — Event-Verified Operations for Government",
  description:
    "EVO-G is a pilot proposition for operational assurance in high-accountability environments: reconstructible decisions, evidence inspection, and bounded evaluation. Production authority is not established.",
  alternates: { canonical: "https://rastaimperium.com/systems/evo-g/" },
  openGraph: {
    title: "EVO-G — Event-Verified Operations for Government",
    description:
      "Operational assurance pathway for high-accountability environments. Pilot proposition only — production authority not established.",
    url: "https://rastaimperium.com/systems/evo-g/",
  },
};

const modelSteps = [
  {
    n: "01",
    title: "Observe",
    body: "Identify the operational decision, authority boundary, and evidence that must be inspectable before any claim of assurance.",
  },
  {
    n: "02",
    title: "Reconstruct",
    body: "Establish what happened: inputs, rules applied, state transitions, and which records exist for independent review.",
  },
  {
    n: "03",
    title: "Verify",
    body: "Test bounded invariants and decision behaviour using independent verification — including offline reproduction where sealed evidence exists.",
  },
  {
    n: "04",
    title: "Assess",
    body: "Translate resulting evidence into institutional evaluation, governance mapping, and a clear pilot-or-stop decision.",
  },
];

const evaluable = [
  {
    title: "Reconstructibility",
    body: "Whether identical inputs and ordered events yield identical terminal hashes for sealed public capsules (capsule-scoped).",
  },
  {
    title: "Illegal-transition rejection",
    body: "Whether disallowed lifecycle edges are refused without state mutation, with sealed rejection receipts (capsule-scoped).",
  },
  {
    title: "Cross-implementation parity",
    body: "Whether independent pure verifiers (Node + Python) agree on sealed capsule hashes.",
  },
  {
    title: "Evidence provenance",
    body: "Whether claims link to published artifacts, proof records, and explicit limitations.",
  },
  {
    title: "Governance / control mapping",
    body: "Whether public evidence can inform institutional concerns via the evidence crosswalk — without implying certification.",
  },
  {
    title: "Limitations register",
    body: "Whether UNAVAILABLE and NOT ESTABLISHED items are stated before any pilot or commercial discussion.",
  },
];

const notEstablished = [
  {
    label: "Production authority",
    status: "NOT ESTABLISHED",
    body: "EVO-G is a pilot proposition on the public surface. No production operational authority is claimed.",
  },
  {
    label: "LIVE operational telemetry",
    status: "UNAVAILABLE",
    body: "No live monitoring of production systems is published. Observatory surfaces remain DEMONSTRATION where present.",
  },
  {
    label: "Government deployment evidence",
    status: "UNAVAILABLE",
    body: "No sealed public artifact establishes a government or institutional deployment of EVO-G.",
  },
  {
    label: "Performance benchmarks",
    status: "UNAVAILABLE",
    body: "Ops/sec, latency, reliability, and workload figures are not verified on this surface until sealed benchmark capsules exist.",
  },
  {
    label: "Regulatory certification",
    status: "NOT ESTABLISHED",
    body: "No ISO, EU AI Act, NIST, or other conformity claim is made. The governance crosswalk is evidence alignment only.",
  },
];

export default function EvoGSystemsPage() {
  return (
    <main className="royal-page overflow-hidden">
      <EvidenceJourneyNav />

      {/* Hero */}
      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Systems · pilot proposition
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            EVO-G — Event-Verified Operations for Government
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Operational assurance for high-accountability environments, built around
            reconstructible decisions, evidence inspection, and bounded evaluation.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded border border-[rgba(242,214,117,0.35)] bg-[rgba(242,214,117,0.08)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F2D675]">
              Pilot proposition
            </span>
            <span className="rounded border border-zinc-700 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
              Production authority: NOT ESTABLISHED
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/evaluate/"
              className="inline-flex items-center rounded-md border border-[rgba(242,214,117,0.45)] bg-[rgba(242,214,117,0.12)] px-5 py-2.5 text-sm font-medium text-[#F2D675] transition hover:bg-[rgba(242,214,117,0.2)]"
            >
              Evaluate the evidence →
            </Link>
            <Link
              href="/institutional-pilots/"
              className="inline-flex items-center rounded-md border border-zinc-600 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-400 hover:text-white"
            >
              Discuss an institutional pilot →
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-[rgba(242,214,117,0.12)]">
        <div className="container-page py-12 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Institutional problem
          </p>
          <h2 className="mt-3 max-w-2xl font-cinzel text-2xl text-zinc-50 sm:text-3xl">
            Opaque operational decisions are hard to reconstruct and harder to assure.
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-zinc-300">
            <p>
              Institutions that rely on AI-assisted operational decisions face a recurring
              control gap: evidence is fragmented, reconstruction is difficult, governance
              boundaries are unclear, and independent parties cannot inspect what actually
              happened.
            </p>
            <p>
              EVO-G is designed as a pathway for evaluating that gap — not as a claim that
              production operational authority has already been established.
            </p>
          </div>
        </div>
      </section>

      {/* Four-part model */}
      <section className="border-b border-[rgba(242,214,117,0.12)]">
        <div className="container-page py-12 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            What EVO-G proposes
          </p>
          <h2 className="mt-3 max-w-2xl font-cinzel text-2xl text-zinc-50 sm:text-3xl">
            Observe → Reconstruct → Verify → Assess
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Aligns with the public institutional journey: Observe → Inspect → Challenge →
            Verify → Reproduce → Assess → Crosswalk → Pilot → Decide. It does not introduce a
            competing methodology.
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {modelSteps.map((s) => (
              <li
                key={s.n}
                className="rounded-xl border border-[rgba(242,214,117,0.14)] bg-[rgba(15,18,13,0.92)] p-5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
                  {s.n}
                </p>
                <h3 className="mt-2 text-base font-semibold text-zinc-100">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Bounded pilot */}
      <section className="border-b border-[rgba(242,214,117,0.12)]">
        <div className="container-page py-12 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Bounded pilot
          </p>
          <h2 className="mt-3 max-w-2xl font-cinzel text-2xl text-zinc-50 sm:text-3xl">
            Evaluation before any wider deployment decision
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-zinc-300">
            <p>
              A bounded pilot can examine a defined operational workflow, its evidence
              boundary, governance requirements, and verification questions before any wider
              deployment decision.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-zinc-400">
              <li>Scope is agreed with the institution in writing.</li>
              <li>Evidence boundaries are defined before evaluation begins.</li>
              <li>Results are reproducible where sealed public evidence applies.</li>
              <li>Limitations and non-goals are recorded explicitly.</li>
              <li>Production authority is not implied by participation in a pilot.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What can be evaluated */}
      <section className="border-b border-[rgba(242,214,117,0.12)]">
        <div className="container-page py-12 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            What can be evaluated
          </p>
          <h2 className="mt-3 max-w-2xl font-cinzel text-2xl text-zinc-50 sm:text-3xl">
            Capabilities grounded in the public evidence architecture
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            L3/L7 sealed capsules do not establish full EVO-G operational authority. Where a
            capability is capsule-scoped, that scope is stated.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {evaluable.map((e) => (
              <article
                key={e.title}
                className="rounded-xl border border-[rgba(242,214,117,0.14)] bg-[rgba(15,18,13,0.92)] p-5"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{e.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{e.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Not established */}
      <section className="border-b border-[rgba(242,214,117,0.12)]">
        <div className="container-page py-12 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            What is not currently established
          </p>
          <h2 className="mt-3 max-w-2xl font-cinzel text-2xl text-zinc-50 sm:text-3xl">
            Explicit boundaries
          </h2>
          <div className="mt-8 space-y-4">
            {notEstablished.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-zinc-800 bg-[rgba(12,14,11,0.9)] p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-sm font-semibold text-zinc-100">{item.label}</h3>
                  <span className="rounded border border-zinc-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Full register:{" "}
            <Link href="/limitations/" className="text-[#F2D675] hover:underline">
              Limitations →
            </Link>
          </p>
        </div>
      </section>

      {/* Institutional path + evidence */}
      <section className="border-b border-[rgba(242,214,117,0.12)]">
        <div className="container-page py-12 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Institutional path
          </p>
          <h2 className="mt-3 max-w-2xl font-cinzel text-2xl text-zinc-50 sm:text-3xl">
            Evaluate → Crosswalk → Pilot → Contact
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            EVO-G positioning does not create new evidence. Existing public evidence remains the
            authority.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/evaluate/", label: "Evaluate", desc: "Evaluator console" },
              { href: "/governance-crosswalk/", label: "Crosswalk", desc: "Evidence alignment" },
              { href: "/institutional-pilots/", label: "Pilot", desc: "Bounded evaluation" },
              { href: "/contact/?intent=institutional", label: "Contact", desc: "Institutional inquiry" },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="rounded-xl border border-[rgba(242,214,117,0.18)] bg-[rgba(15,18,13,0.92)] p-4 transition hover:border-[rgba(242,214,117,0.4)]"
              >
                <p className="text-sm font-semibold text-[#F2D675]">{r.label} →</p>
                <p className="mt-1 text-xs text-zinc-500">{r.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Public evidence
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href="/proof/" className="text-[#F2D675] hover:underline">
                Proof Registry →
              </Link>
              <Link href="/verify/" className="text-[#F2D675] hover:underline">
                Verify offline →
              </Link>
              <Link href="/evidence/" className="text-[#F2D675] hover:underline">
                Evidence Explorer →
              </Link>
              <Link href="/challenge/" className="text-[#F2D675] hover:underline">
                Challenge Lab →
              </Link>
              <Link href="/limitations/" className="text-[#F2D675] hover:underline">
                Limitations →
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <StatusBadge status="VERIFIED" />
              <span className="self-center font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                ART-L7-REPLAY-001 · ART-L7-REJECT-001 · ART-L7-PARITY-001 — capsule-scoped only
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
