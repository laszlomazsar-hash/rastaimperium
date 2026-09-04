"use client";

import Link from "next/link";
import { useState } from "react";

type Article = {
  num: string;
  title: string;
  subtitle: string;
  status: "CONSTITUTIONAL" | "PARTIAL EVIDENCE";
  color: string;
  intent: string;
  mechanism: string;
  effect: string;
  evomap: string;
};

const articles: Article[] = [
  {
    num: "I",
    title: "Containment",
    subtitle: "Capability boundaries",
    status: "CONSTITUTIONAL",
    color: "#107e3e",
    intent:
      "No autonomous action may exceed the explicit capability envelope defined for its context. Containment is the primary constitutional firewall against unbounded emergence.",
    mechanism:
      "Capability tokens, policy envelopes, and hardware-enforced guards limit the admissible action space before execution begins. Out-of-envelope requests are rejected with a sealed receipt. Effect classes: A (Complete), B (Bounded), C (Monitored), D (Treaty-Governed).",
    effect:
      "The system cannot silently escalate power. Every expansion of capability requires an explicit, auditable constitutional act.",
    evomap: "L8 Constitutional Layer · L3 Operational Systems",
  },
  {
    num: "II",
    title: "Observability",
    subtitle: "Lineage & drift visibility",
    status: "PARTIAL EVIDENCE",
    color: "#1e90ff",
    intent:
      "Every consequential state transition must leave an inspectable record: inputs, applied rules, resulting state, and cryptographic linkage to prior history.",
    mechanism:
      "Append-only ledger, hash-linked receipts, deterministic replay capsules, and drift metrics. Public sealed capsules (REPLAY-001, REJECT-001) demonstrate the property under fixed inputs. Production live-state parity remains outside published evidence on this surface.",
    effect:
      "No decision is opaque. Auditors and institutions can reconstruct and challenge any governed path without trusting the runtime narrative.",
    evomap: "L7 Identity + Trust · L6 Epistemic Governance",
  },
  {
    num: "III",
    title: "Interruptibility",
    subtitle: "Human & policy stop",
    status: "CONSTITUTIONAL",
    color: "#e01e1e",
    intent:
      "At every governed transition there must exist a reliable, low-latency path for a human or higher-authority policy to halt further execution.",
    mechanism:
      "Explicit interrupt edges in the lifecycle FSM, kill-switch signals treated as first-class events, and guaranteed rejection of further state mutation once interrupt is raised. No autonomous action may prevent or delay a human-initiated shutdown.",
    effect:
      "Autonomy remains subordinate. The system cannot refuse a lawful interrupt or continue after one has been asserted.",
    evomap: "L8 Constitutional · L3 Operational Systems · L1 Human Interface",
  },
  {
    num: "IV",
    title: "Accountability",
    subtitle: "Sealed receipts & challenge",
    status: "PARTIAL EVIDENCE",
    color: "#B8860B",
    intent:
      "Every high-value claim and every critical transition must be bound to a sealed, independently reproducible artifact that can be challenged.",
    mechanism:
      "Cryptographic receipts, capsule hashing, independent Node/Python/Go verifiers, and a public Challenge Lab for illegal-edge and replay tests. Public capsules ART-L7-REPLAY-001 and ART-L7-REJECT-001 demonstrate reconstructible paths under fixed inputs.",
    effect:
      "Responsibility is never diffuse. When something goes wrong, the record exists and can be examined without privileged access to the execution runtime.",
    evomap: "L7 Identity + Trust · Evidence boundary",
  },
  {
    num: "V",
    title: "Proportionality",
    subtitle: "Matched authority & risk",
    status: "CONSTITUTIONAL",
    color: "#9b59b6",
    intent:
      "The magnitude of an autonomous action must be proportional to the authority granted and the risk accepted for that context. No escalation beyond necessity.",
    mechanism:
      "Risk-tiered policy bundles, graduated capability tokens, and explicit escalation paths that require higher-order consent for high-impact moves. Resource allocation follows minimum sufficient force.",
    effect:
      "The system cannot apply maximum force by default. Force and reach scale with demonstrated need and explicit authorisation.",
    evomap: "L8 Constitutional · L2 Economic + Institutional",
  },
  {
    num: "VI",
    title: "Reversibility",
    subtitle: "Defined recovery paths",
    status: "CONSTITUTIONAL",
    color: "#e07c1e",
    intent:
      "High-stakes transitions should prefer reversible paths. Where irreversibility is required, the recovery cost and residual risk must be explicit before commitment and approved by a human governor.",
    mechanism:
      "Preferential design for undoable state changes, explicit irreversible markers, and pre-declared recovery procedures linked to the Lyapunov recovery score.",
    effect:
      "Mistakes remain recoverable whenever possible. Irreversible acts are rare, deliberate, and fully documented.",
    evomap: "L8 Constitutional · L3 Operational Systems",
  },
  {
    num: "VII",
    title: "Temporal Asymmetry",
    subtitle: "Deliberate irreversibility cost",
    status: "CONSTITUTIONAL",
    color: "#2ecc71",
    intent:
      "The rate of self-modification must decrease as system capability increases. Humans always possess more deliberation time than the system possesses for autonomous action — the Cooling Period.",
    mechanism:
      "Time-locked commitments, multi-party confirmation windows, and elevated evidence requirements for irreversible edges in the lifecycle matrix.",
    effect:
      "The system cannot rush into permanent states. Speed is reserved for reversible operations; permanence requires patience and higher consent.",
    evomap: "L8 Constitutional · L7 Identity + Trust",
  },
];

const pipeline = [
  { n: "1", label: "Intent" },
  { n: "2", label: "Constraint" },
  { n: "3", label: "Execution" },
  { n: "4", label: "Evidence" },
  { n: "5", label: "Challenge" },
];

export default function PillarsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <main className="royal-page overflow-hidden">
      {/* Hero */}
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Constitutional articles · evidence-bound
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl text-zinc-100 sm:text-5xl">The Pillars</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Seven Articles of the Rastafarai Codex. These are constitutional design principles — not
            automatically proven production properties. Where sealed public capsules exist, status is
            labelled. Where evidence is absent, status remains constitutional intent only.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proof/"
              className="rounded-lg border border-[#B8860B]/50 px-4 py-2 text-sm font-semibold text-[#F2D675] transition hover:bg-[#B8860B]/10"
            >
              Proof Registry
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
            >
              Limitations
            </Link>
            <Link
              href="/blueprint/#verifiable-stack"
              className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
            >
              Blueprint
            </Link>
          </div>
        </div>
      </section>

      {/* Boundary */}
      <section className="container-page py-10">
        <div className="rounded-xl border border-zinc-800 bg-black/30 p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Boundary</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            “Hardware-enforced” and “100% equivalence” language is retained only as constitutional
            intent or as capsule-scoped claims where independent verifiers exist. Production live-state
            parity, full kernel coverage, and court-grade deployment claims are not asserted on this
            surface without sealed artifacts. See{" "}
            <Link href="/limitations/" className="text-[#F2D675] hover:underline">
              Limitations
            </Link>{" "}
            for the explicit unproven list.
          </p>
        </div>
      </section>

      {/* Governance pipeline */}
      <section className="container-page pb-10">
        <div className="rounded-xl border border-zinc-800 bg-black/30 p-6">
          <h2 className="text-sm font-semibold text-zinc-200">Governance sequence</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {pipeline.map((step, i) => (
              <div key={step.n} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm font-medium text-zinc-200">
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded bg-zinc-100 text-[11px] font-semibold text-zinc-900">
                    {step.n}
                  </span>
                  {step.label}
                </div>
                {i < pipeline.length - 1 && (
                  <span className="hidden text-zinc-600 sm:inline" aria-hidden>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-zinc-500">
            Every high-value transition must remain reconstructible, challengeable, and bounded by the
            Articles.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="container-page pb-12">
        <div className="mb-6">
          <h2 className="text-2xl text-zinc-100">Seven Articles</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Click any article to expand intent, mechanism, effect, and EVO-V layer mapping.
          </p>
        </div>

        <div className="space-y-3">
          {articles.map((a, i) => {
            const isOpen = expanded === i;
            return (
              <article
                key={a.num}
                onClick={() => setExpanded(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpanded(isOpen ? null : i);
                  }
                  if (e.key === "Escape") setExpanded(null);
                }}
                tabIndex={0}
                role="button"
                aria-expanded={isOpen}
                className="cursor-pointer rounded-xl border border-zinc-800 bg-black/30 p-5 transition hover:border-[#B8860B]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40"
                style={{
                  borderColor: isOpen ? a.color + "70" : undefined,
                  background: isOpen ? "rgba(0,0,0,0.45)" : undefined,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition"
                    style={{
                      borderColor: a.color,
                      color: isOpen ? "#0a0a0a" : a.color,
                      background: isOpen ? a.color : "transparent",
                    }}
                  >
                    {a.num}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold" style={{ color: a.color }}>
                        {a.title}
                      </h3>
                      <span
                        className="rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                        style={{
                          borderColor: a.status === "PARTIAL EVIDENCE" ? "#B8860B55" : "#3b82f655",
                          color: a.status === "PARTIAL EVIDENCE" ? "#D4AF37" : "#93c5fd",
                          background:
                            a.status === "PARTIAL EVIDENCE"
                              ? "rgba(184,134,11,0.12)"
                              : "rgba(59,130,246,0.1)",
                        }}
                      >
                        {a.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">{a.subtitle}</p>
                    {!isOpen && <p className="mt-2 text-xs text-zinc-600">Expand →</p>}
                  </div>
                  <span className="mt-1 shrink-0 text-zinc-500" aria-hidden>
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>

                {isOpen && (
                  <div
                    className="mt-5 ml-2 space-y-4 border-l-2 pl-6 sm:ml-4"
                    style={{ borderColor: a.color + "50" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-sm leading-7 text-zinc-300">{a.intent}</p>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Mechanism
                      </p>
                      <p className="mt-1 text-sm leading-7 text-zinc-400">{a.mechanism}</p>
                    </div>
                    <div
                      className="rounded-lg border-l-[3px] px-4 py-3 text-sm leading-7 text-zinc-300"
                      style={{
                        borderColor: "#3d9b6a",
                        background: "rgba(61,155,106,0.08)",
                      }}
                    >
                      <span className="font-medium text-zinc-200">Effect — </span>
                      {a.effect}
                    </div>
                    <p className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">
                      EVO-V map → <span className="text-zinc-400">{a.evomap}</span>
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Closed-loop + Lyapunov */}
      <section className="container-page border-t border-zinc-900 py-12">
        <h2 className="text-2xl text-zinc-100">Closed-loop binding</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          The Articles interlock. Containment limits the space; Observability and Accountability make
          every move inspectable; Interruptibility and Reversibility keep recovery possible;
          Proportionality and Temporal Asymmetry prevent haste and excess. The design target that binds
          them is the Lyapunov Vow.
        </p>

        <div className="mt-6 inline-flex items-center gap-6 rounded-xl border border-[#B8860B]/30 bg-black/30 px-6 py-5">
          <p className="font-mono text-3xl text-[#D4AF37]">dV/dt ≤ 0</p>
          <p className="max-w-sm text-sm leading-6 text-zinc-400">
            Risk is non-increasing under the recovery score V. Constitutional mathematics — not a
            published production measurement on this surface.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <p className="text-sm font-semibold text-zinc-100">Prevent</p>
            <p className="mt-2 text-xs leading-6 text-zinc-500">
              Containment · Proportionality · Temporal Asymmetry keep the system inside safe envelopes.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <p className="text-sm font-semibold text-zinc-100">Detect</p>
            <p className="mt-2 text-xs leading-6 text-zinc-500">
              Observability · Accountability surface drift, illegal edges, and incomplete lineage.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <p className="text-sm font-semibold text-zinc-100">Recover</p>
            <p className="mt-2 text-xs leading-6 text-zinc-500">
              Interruptibility · Reversibility provide the stop and the path back.
            </p>
          </div>
        </div>
      </section>

      {/* V0 Verifier */}
      <section className="container-page border-t border-zinc-900 py-12">
        <h2 className="text-2xl text-zinc-100">V0 Verifier Integrity</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Sealed public capsules demonstrate deterministic replay and illegal-edge rejection under
          fixed inputs (Node + Python independent verifiers). Claims of universal live-state
          equivalence or production “court-ready” deployment require additional artifacts not yet
          published here.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5 text-center">
            <p className="font-mono text-lg text-[#D4AF37]">Capsule-scoped</p>
            <p className="mt-1 text-sm text-zinc-300">Replay / reject parity</p>
            <p className="mt-1 text-xs text-zinc-500">VERIFIED for published artifacts</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5 text-center">
            <p className="font-mono text-lg text-[#D4AF37]">SHA-256</p>
            <p className="mt-1 text-sm text-zinc-300">Hash-linked design</p>
            <p className="mt-1 text-xs text-zinc-500">DEMONSTRATION + partial evidence</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5 text-center">
            <p className="font-mono text-lg text-[#D4AF37]">.evop target</p>
            <p className="mt-1 text-sm text-zinc-300">Portable evidence container</p>
            <p className="mt-1 text-xs text-zinc-500">Intent — not full production claim</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/proof/" className="text-sm text-[#F2D675] hover:underline">
            Open Proof Registry →
          </Link>
          <Link href="/limitations/" className="text-sm text-zinc-400 hover:text-zinc-300">
            What we have not proven →
          </Link>
          <Link href="/challenge/" className="text-sm text-zinc-400 hover:text-zinc-300">
            Challenge Lab →
          </Link>
        </div>
      </section>
    </main>
  );
}
