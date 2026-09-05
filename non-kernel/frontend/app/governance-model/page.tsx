import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Governance Model — Deterministic & Auditable",
  description:
    "EVO-V governance as a systems property: deterministic transitions, audit lineage, replay verification, Seven Articles, and explicit evidence boundaries for institutions.",
  keywords: [
    "AI governance model",
    "deterministic governance",
    "constitutional AI",
    "Seven Articles",
    "auditable AI",
    "replay verification",
  ],
  openGraph: {
    title: "Governance Model — Systems property, not policy appendix",
    description:
      "Deterministic transitions, audit lineage, replay verification, and constitutional constraints — with labelled evidence status.",
    url: "https://rastaimperium.com/governance-model/",
  },
};

const properties = [
  {
    title: "Deterministic transitions",
    body: "State changes follow explicit semantics. Identical inputs and event order produce identical outcomes — the basis for replay and independent challenge.",
    href: "/proof/",
  },
  {
    title: "Audit lineage",
    body: "Append-only, hash-linked records connect inputs, rules applied, transitions, and outputs so decisions remain reconstructible after the fact.",
    href: "/evidence/",
  },
  {
    title: "Replay verification",
    body: "Consequential decisions can be reconstructed and checked against sealed fixtures. Published capsules are independently reproducible (Node + Python).",
    href: "/challenge/",
  },
  {
    title: "Constitutional constraints",
    body: "Policy and capability boundaries are enforced before execution, not explained after the fact. Articles define the admissible action space.",
    href: "/pillars/",
  },
];

const articles = [
  { num: "I", title: "Containment", status: "CONSTITUTIONAL", blurb: "Outputs stay inside declared scope." },
  { num: "II", title: "Observability", status: "PARTIAL EVIDENCE", blurb: "Transitions auditable; capsules demonstrate paths." },
  { num: "III", title: "Interruptibility", status: "CONSTITUTIONAL", blurb: "Human halt capability at every layer." },
  { num: "IV", title: "Accountability", status: "PARTIAL EVIDENCE", blurb: "Causal chains; replay/reject capsules." },
  { num: "V", title: "Proportionality", status: "CONSTITUTIONAL", blurb: "Response matched to trigger; minimum force." },
  { num: "VI", title: "Reversibility", status: "CONSTITUTIONAL", blurb: "Reversible or explicitly approved irreversibility." },
  { num: "VII", title: "Temporal Asymmetry", status: "CONSTITUTIONAL", blurb: "Cooling Period — human deliberation advantage." },
];

const sequence = [
  { step: "01", title: "Intent", body: "Input is bound to context and declared purpose." },
  { step: "02", title: "Constraint", body: "Policy and Articles determine admissibility." },
  { step: "03", title: "Execution", body: "State changes follow governed paths only." },
  { step: "04", title: "Evidence", body: "Lineage and fixtures remain available for review." },
];

export default function GovernanceModelPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Governance Model
          </p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Governance is a{" "}
            <span className="text-gold-gradient">systems property</span>, not a policy appendix.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            EVO-V governance emphasises deterministic transitions, audit lineage, replay verification,
            and explicit constitutional constraints. Accountability is engineered into the path — and
            only claimed where sealed evidence supports it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pillars/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Seven Articles
            </Link>
            <Link
              href="/proof/"
              className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Proof Registry
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

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Systems properties
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">What the model requires</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {properties.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="royal-panel block rounded-xl border p-6 transition hover:border-[#B8860B]/40"
            >
              <h3 className="text-lg font-semibold text-[#F2D675]">{p.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{p.body}</p>
              <p className="mt-4 text-xs text-[#D4AF37]">Inspect related surface →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Decision sequence
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Intent → Constraint → Execution → Evidence</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sequence.map((s) => (
            <div key={s.step} className="royal-panel rounded-xl border p-5">
              <p className="font-mono text-[11px] text-[#D4AF37]">{s.step}</p>
              <p className="mt-2 font-semibold text-zinc-100">{s.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Constitutional backbone
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Seven Articles at a glance</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Design principles of the Rastafarai Codex. Status labels distinguish constitutional intent
          from sealed evidence. Expand each article on the Pillars page.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <div key={a.num} className="rounded-xl border border-zinc-800 bg-black/30 p-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-[#D4AF37]">{a.num}</span>
                <span className="font-semibold text-zinc-100">{a.title}</span>
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">{a.status}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-400">{a.blurb}</p>
            </div>
          ))}
        </div>
        <Link href="/pillars/" className="mt-6 inline-block text-sm text-[#F2D675]">
          Full Pillars · expand articles →
        </Link>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Evidence boundary
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">What is proven vs labelled intent</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="royal-panel rounded-xl border p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90">VERIFIED</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Sealed public capsules (e.g. ART-L7-REPLAY-001, REJECT-001, PARITY-001) with independent
              Node + Python reproduction.
            </p>
            <Link href="/proof/" className="mt-3 inline-block text-sm text-[#F2D675]">
              Proof Registry →
            </Link>
          </div>
          <div className="royal-panel rounded-xl border p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-amber-200/80">DEMONSTRATION</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Hash-linked ledger design and FSM transition posture documented on the verification
              surface — not a live production dashboard.
            </p>
            <Link href="/evidence/" className="mt-3 inline-block text-sm text-[#F2D675]">
              Evidence Explorer →
            </Link>
          </div>
          <div className="royal-panel rounded-xl border p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">UNAVAILABLE / CONSTITUTIONAL</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Hardware-enforced articles, full kernel coverage, performance benchmarks, and court-ready
              deployment language without sealed artifacts.
            </p>
            <Link href="/limitations/" className="mt-3 inline-block text-sm text-[#F2D675]">
              Limitations →
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Architecture split
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="royal-panel rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-[#F2D675]">Public narrative layer</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              This site: governance model, Pillars, Blueprint, Codex, and verification UI. No runtime
              execution of institutional workloads.
            </p>
          </div>
          <div className="royal-panel rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-[#F2D675]">Execution layer (EVO-V)</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Separate operational systems. Deterministic governance logic, live enforcement, and
              production evidence production — engaged via scoped pilots after fit.
            </p>
          </div>
        </div>
        <Link href="/architecture/" className="mt-4 inline-block text-sm text-[#F2D675]">
          Architecture split →
        </Link>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">From model to engagement</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Institutions typically start with Limitations and Proof, then scope a design partner pilot
            against a written boundary — not a self-serve SaaS tier.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/institutional-pilots/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Design partner pilots
            </Link>
            <Link
              href="/why-deterministic-governance/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Why deterministic
            </Link>
            <Link
              href="/governance/codex/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Codex index
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
