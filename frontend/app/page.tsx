import Link from "next/link";

const civilizationStack = [
  { layer: "L9", name: "Cosmology Layer", desc: "Mythic narrative and civilizational meaning" },
  { layer: "L8", name: "Constitutional Layer", desc: "Seven Articles — hardware-enforced governance physics" },
  { layer: "L7", name: "Identity + Trust Layer", desc: "Immutable replay ledger and cryptographic proofs" },
  { layer: "L6", name: "Epistemic Governance Layer", desc: "Bayesian calibration and drift detection" },
  { layer: "L5", name: "Deterministic Intelligence Layer", desc: "Causal modeling and symbolic reasoning" },
  { layer: "L4", name: "Agentic Infrastructure Layer", desc: "Deep Seed agent orchestration" },
  { layer: "L3", name: "Operational Systems Layer", desc: "Real-time invariant enforcement" },
  { layer: "L2", name: "Economic + Institutional Layer", desc: "Enterprise integration and compliance" },
  { layer: "L1", name: "Human Interface Layer", desc: "Progressive initiation and witness portals" },
];

const kernelLayers = [
  { layer: "L1", fn: "Real-time invariant enforcement" },
  { layer: "L2", fn: "Intent verification" },
  { layer: "L3", fn: "Agent orchestration" },
  { layer: "L4", fn: "Drift detection" },
  { layer: "L5", fn: "Causal modeling" },
  { layer: "L6", fn: "Bayesian calibration" },
  { layer: "L7", fn: "Immutable replay ledger" },
];

const agents = [
  { internal: "Seed Clerk", public: "Intake Agent", desc: "High-volume administrative triage and onboarding ingress" },
  { internal: "Seed Judge", public: "Compliance Verifier", desc: "Policy conflict resolution and constitutional enforcement" },
  { internal: "Seed Detect", public: "Drift Monitor", desc: "Real-time anomaly detection and coherence monitoring" },
  { internal: "Seed Memory", public: "Immutable Ledger Node", desc: "Cryptographically sealed state history" },
  { internal: "Seed Shepherd", public: "Recovery Coordinator", desc: "Lyapunov-stable remediation orchestration" },
];

const phases = [
  { num: "1", name: "Architecture Visibility", status: "ACTIVE" },
  { num: "2", name: "Replay Demonstrations", status: "BUILDING" },
  { num: "3", name: "Institutional Pilots", status: "NEXT" },
  { num: "4", name: "Open Constitutional APIs", status: "PLANNED" },
  { num: "5", name: "Sovereign Governance Network", status: "PLANNED" },
  { num: "6", name: "Civilization-Scale Orchestration", status: "VISION" },
];

const trustPillars = [
  "Deterministic replay under identical inputs and event order",
  "Append-only audit lineage with hash-linked chronology",
  "FSM-governed lifecycle transitions with illegal-edge rejection",
  "Counterexample generation for every critical invariant failure",
];

export default function HomePage() {
  return (
    <main>
      <section className="container-page py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Constitutional Intelligence Infrastructure</p>
            <h1 className="mt-3 text-4xl md:text-5xl text-gold-gradient leading-tight" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
              Deterministic Governance<br />for Civilization-Scale AI
            </h1>
            <p className="mt-4 text-zinc-300 text-xl">Replayable. Auditable. Sovereign.</p>
            <p className="mt-6 text-zinc-400">
              Rasta Imperium builds constitutional intelligence systems that preserve epistemic integrity across autonomous infrastructure.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/empire" className="rounded-md bg-gold text-black px-6 py-3 font-bold hover:bg-yellow-600 transition">
                Explore Architecture
              </Link>
              <Link href="/witness" className="rounded-md border border-gold text-gold px-6 py-3 font-bold hover:bg-gold/10 transition">
                View Replay Demo
              </Link>
              <Link href="/consulting" className="rounded-md border border-zinc-600 text-zinc-200 px-6 py-3 font-bold hover:border-gold hover:text-gold transition">
                Book Governance Intake
              </Link>
            </div>
          </div>
          <div className="panel p-6 font-courier text-sm">
            <p className="text-gold text-xs mb-3">LIVE GOVERNANCE STATE</p>
            <div className="space-y-2 text-zinc-300">
              <p>╔══ DARWIN KERNEL v7.2 ══╗</p>
              <p>║ coherence: <span className="text-gold">0.94</span>       ║</p>
              <p>║ invariants: <span className="text-green-400">HOLDING</span>   ║</p>
              <p>║ drift_Δ: <span className="text-gold">0.002</span>        ║</p>
              <p>║ agents: <span className="text-gold">2,048</span> active  ║</p>
              <p>║ replay: <span className="text-green-400">VERIFIED</span>     ║</p>
              <p>║ lyapunov: <span className="text-gold">dV/dt ≤ 0</span>   ║</p>
              <p>╚═══════════════════════╝</p>
              <p className="text-xs text-zinc-500 mt-3">hash: 7f3a...c91d | block: 847,291</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-2">
        <div className="grid md:grid-cols-4 gap-3">
          {trustPillars.map((pillar) => (
            <div key={pillar} className="panel p-4">
              <p className="text-sm text-zinc-200">{pillar}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-green/10 border-y border-gold/20">
        <div className="container-page py-12 text-center">
          <p className="text-2xl md:text-3xl text-gold font-georgia italic max-w-4xl mx-auto">
            &ldquo;Civilization cannot safely scale autonomous intelligence without deterministic governance.&rdquo;
          </p>
        </div>
      </section>

      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">The Civilization Stack</h2>
        <p className="text-center text-zinc-400 mt-2">9 layers of sovereign abstraction</p>
        <div className="mt-8 grid gap-2">
          {civilizationStack.map((layer) => (
            <div key={layer.layer} className="panel p-4 flex items-center gap-4">
              <span className="text-gold font-courier font-bold text-base w-10 shrink-0">{layer.layer}</span>
              <div className="flex-1">
                <span className="text-gold text-sm font-bold">{layer.name}</span>
                <span className="text-zinc-500 text-sm ml-3">{layer.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">The Darwin Kernel v7.2</h2>
        <p className="text-center text-zinc-400 mt-2">A multi-timescale deterministic governance kernel for admissible autonomous systems</p>
        <div className="panel p-6 mt-8">
          <div className="grid gap-2">
            {kernelLayers.map((k) => (
              <div key={k.layer} className="flex items-center gap-4 py-2 border-b border-gold/10 last:border-0">
                <span className="text-gold font-courier font-bold w-10">{k.layer}</span>
                <span className="text-zinc-300 text-sm">{k.fn}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">Deterministic Governance Agents</h2>
        <p className="text-center text-zinc-400 mt-2">2,000+ agents within a bounded governance field</p>
        <div className="grid md:grid-cols-5 gap-3 mt-8">
          {agents.map((a) => (
            <div key={a.public} className="panel p-4">
              <p className="text-gold font-bold text-sm">{a.public}</p>
              <p className="text-xs text-zinc-500 font-courier mt-1">{a.internal}</p>
              <p className="text-xs text-zinc-400 mt-2">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">Evolution Roadmap</h2>
        <div className="grid md:grid-cols-6 gap-3 mt-8">
          {phases.map((p) => (
            <div key={p.num} className="panel p-4 text-center">
              <p className="text-gold font-courier font-bold">Phase {p.num}</p>
              <p className="text-xs text-zinc-300 mt-2">{p.name}</p>
              <p className={`text-xs mt-2 font-bold ${p.status === "ACTIVE" ? "text-green-400" : p.status === "BUILDING" ? "text-yellow-400" : "text-zinc-500"}`}>{p.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20 text-center">
        <h2 className="text-3xl text-gold">Open Source</h2>
        <p className="text-zinc-400 mt-2">Sovereign and verifiable</p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <a href="https://github.com/laszlomazsar-hash/rastaimperium" target="_blank" rel="noopener" className="panel px-5 py-3 hover:bg-green/40 transition"><span className="text-gold">rastaimperium</span></a>
          <a href="https://github.com/laszlomazsar-hash/evo-v" target="_blank" rel="noopener" className="panel px-5 py-3 hover:bg-green/40 transition"><span className="text-gold">evo-v</span></a>
          <a href="https://github.com/laszlomazsar-hash/evo-v5-laplacian-shift" target="_blank" rel="noopener" className="panel px-5 py-3 hover:bg-green/40 transition"><span className="text-gold">evo-v5-laplacian-shift</span></a>
        </div>
      </section>
    </main>
  );
}
