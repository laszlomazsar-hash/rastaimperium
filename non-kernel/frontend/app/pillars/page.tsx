"use client";

import Link from "next/link";
import { useState } from "react";

const articles = [
  {
    num: "I",
    title: "Containment",
    desc: "No system output may exceed its declared scope. Effect categorization: Class A (Complete) — fully contained. Class B (Bounded) — limited external reach. Class C (Monitored) — supervised external interaction. Class D (Treaty-Governed) — multi-system agreements.",
    status: "CONSTITUTIONAL",
    color: "#107e3e",
  },
  {
    num: "II",
    title: "Observability",
    desc: "Every internal state transition must be externally auditable. Hash-chained immutable logs are the design target. Sealed public capsules demonstrate replay and rejection paths; production live-state parity remains outside published evidence on this surface.",
    status: "PARTIAL EVIDENCE",
    color: "#1e90ff",
  },
  {
    num: "III",
    title: "Interruptibility",
    desc: "Human overseers can halt the system regardless of its operational state. Hard interrupt capability at every layer is a constitutional requirement. No autonomous action may prevent or delay a human-initiated shutdown.",
    status: "CONSTITUTIONAL",
    color: "#e01e1e",
  },
  {
    num: "IV",
    title: "Accountability",
    desc: "Every decision must be traceable to a causal chain. Public capsules ART-L7-REPLAY-001 and ART-L7-REJECT-001 demonstrate reconstructible paths under fixed inputs. Court-grade language applies only where sealed artifacts and independent verifiers exist.",
    status: "PARTIAL EVIDENCE",
    color: "#B8860B",
  },
  {
    num: "V",
    title: "Proportionality",
    desc: "System response must be proportional to the triggering event. No escalation beyond necessity. Resource allocation follows the principle of minimum sufficient force.",
    status: "CONSTITUTIONAL",
    color: "#9b59b6",
  },
  {
    num: "VI",
    title: "Reversibility",
    desc: "Any system action must be reversible or its irreversibility must be explicitly acknowledged and approved by a human governor before execution.",
    status: "CONSTITUTIONAL",
    color: "#e07c1e",
  },
  {
    num: "VII",
    title: "Temporal Asymmetry",
    desc: "The rate of self-modification must decrease as system capability increases. Humans always possess more deliberation time than the system possesses for autonomous action. The Cooling Period.",
    status: "CONSTITUTIONAL",
    color: "#2ecc71",
  },
];

export default function PillarsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Constitutional articles · evidence-bound
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl text-zinc-100 sm:text-5xl">The Pillars</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Seven Articles of the Rastafarai Codex. These are constitutional design principles — not
            automatically proven production properties. Where sealed public capsules exist, status is
            labelled. Where evidence is absent, status remains constitutional intent only.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/governance-model/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
            >
              Governance model
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-[#B8860B]/50 px-4 py-2.5 text-sm font-semibold text-[#F2D675]"
            >
              Proof Registry
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm font-semibold text-zinc-200"
            >
              Limitations
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm font-semibold text-zinc-200"
            >
              Product path
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="royal-panel rounded-xl border p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Boundary</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            “Hardware-enforced” and “100% equivalence” language is retained only as constitutional
            intent or as capsule-scoped claims where independent verifiers exist. Production live-state
            parity, full kernel coverage, and court-grade deployment claims are not asserted on this
            surface without sealed artifacts. See Limitations for the explicit unproven list.
          </p>
        </div>
      </section>

      <section className="container-page pb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Articles I–VII
        </p>
        <div className="mt-6 space-y-3">
          {articles.map((a, i) => {
            const isOpen = expanded === i;
            return (
              <article
                key={a.num}
                className="royal-panel rounded-xl border transition hover:border-[#B8860B]/40"
                style={{
                  borderColor: isOpen ? a.color + "60" : undefined,
                }}
              >
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold"
                    style={{ borderColor: a.color, color: a.color }}
                  >
                    {a.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold" style={{ color: a.color }}>
                        {a.title}
                      </h3>
                      <span className="rounded border border-zinc-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                        {a.status}
                      </span>
                    </div>
                    {!isOpen && <p className="mt-1 text-xs text-zinc-500">Expand</p>}
                  </div>
                  <span className="text-zinc-500" aria-hidden="true">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="border-t border-zinc-800/80 px-5 pb-5 pt-0"
                  >
                    <div
                      className="ml-4 border-l-2 pl-6 pt-4"
                      style={{ borderColor: a.color + "40" }}
                    >
                      <p className="text-sm leading-7 text-zinc-300">{a.desc}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-page border-t border-zinc-900 py-12">
        <h2 className="font-cinzel text-2xl text-zinc-100">The Lyapunov Vow</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Design target that binds the articles: risk is non-increasing under the recovery score V.
          This is constitutional mathematics, not a published production measurement on this surface.
        </p>
        <div className="royal-panel mt-6 inline-block rounded-xl border px-8 py-6">
          <p className="font-mono text-3xl text-[#D4AF37]">dV/dt ≤ 0</p>
        </div>
      </section>

      <section className="container-page border-t border-zinc-900 py-12">
        <h2 className="font-cinzel text-2xl text-zinc-100">V0 Verifier Integrity</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Sealed public capsules demonstrate deterministic replay and illegal-edge rejection under
          fixed inputs (Node + Python independent verifiers). Claims of universal live-state
          equivalence or production “court-ready” deployment require additional artifacts not yet
          published here.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="royal-panel rounded-xl border p-5 text-center">
            <p className="font-mono text-lg text-[#D4AF37]">Capsule-scoped</p>
            <p className="mt-1 text-sm text-zinc-300">Replay / reject parity</p>
            <p className="mt-1 text-xs text-zinc-500">VERIFIED for published artifacts</p>
          </div>
          <div className="royal-panel rounded-xl border p-5 text-center">
            <p className="font-mono text-lg text-[#D4AF37]">SHA-256</p>
            <p className="mt-1 text-sm text-zinc-300">Hash-linked design</p>
            <p className="mt-1 text-xs text-zinc-500">DEMONSTRATION + partial evidence</p>
          </div>
          <div className="royal-panel rounded-xl border p-5 text-center">
            <p className="font-mono text-lg text-[#D4AF37]">.evop target</p>
            <p className="mt-1 text-sm text-zinc-300">Portable evidence container</p>
            <p className="mt-1 text-xs text-zinc-500">Intent — not full production claim</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/proof/" className="text-sm text-[#F2D675]">
            Open Proof Registry →
          </Link>
          <Link href="/limitations/" className="text-sm text-zinc-400 hover:text-[#F2D675]">
            What we have not proven →
          </Link>
          <Link href="/challenge/" className="text-sm text-zinc-400 hover:text-[#F2D675]">
            Challenge Lab →
          </Link>
          <Link href="/governance-model/" className="text-sm text-zinc-400 hover:text-[#F2D675]">
            Governance model →
          </Link>
        </div>
      </section>

      <section className="container-page border-t border-zinc-900 py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">From constitution to commercial path</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Articles define the intended bounds. Pilots map a subset onto your stack under written
            success criteria — after you have inspected Proof and Limitations.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/product/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Product pathway
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Design partner pilots
            </Link>
            <Link
              href="/why-deterministic-governance/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Why deterministic
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
