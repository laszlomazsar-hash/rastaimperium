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

export default function HomePage() {
  return (
    <main>
      {/* HERO — LEFT/RIGHT SPLIT */}
      <section className="container-page py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl text-gold leading-tight font-georgia">
              Deterministic Governance<br />for Civilization-Scale AI
            </h1>
            <p className="mt-4 text-zinc-300 text-xl">
              Replayable. Auditable. Sovereign.
            </p>
            <p className="mt-6 text-zinc-400">
              Rasta Imperium builds constitutional intelligence systems capable of enforcing epistemic integrity across autonomous infrastructures.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/empire" className="rounded-md bg-gold text-black px-6 py-3 font-bold hover:bg-yellow-600 transition">
                Explore Architecture
              </Link>
              <Link href="/witness" className="rounded-md border border-gold text-gold px-6 py-3 font-bold hover:bg-gold/10 transition">
                View Replay Demo
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

      {/* CORE THESIS */}
      <section className="bg-green/10 border-y border-gold/20">
        <div className="container-page py-12 text-center">
          <p className="text-2xl md:text-3xl text-gold font-georgia italic max-w-4xl mx-auto">
            &ldquo;Civilization cannot safely scale autonomous intelligence without deterministic governance.&rdquo;
          </p>
        </div>
      </section>

      {/* CIVILIZATION STACK */}
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

      {/* THREE-FACE ARCHITECTURE */}
      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">Three-Face Architecture</h2>
        <p className="text-center text-zinc-400 mt-2">Three simultaneous realities, one coherent system</p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="panel p-6 text-center">
            <p className="text-3xl">🏛️</p>
            <h3 className="text-gold text-xl mt-3">Institutional Face</h3>
            <p className="text-sm text-zinc-400 mt-1">Trust + Governance</p>
            <p className="text-sm text-zinc-300 mt-3">Governments, enterprise, compliance bodies, defense, healthcare, energy systems.</p>
          </div>
          <div className="panel p-6 text-center">
            <p className="text-3xl">⚙️</p>
            <h3 className="text-gold text-xl mt-3">Technical Face</h3>
            <p className="text-sm text-zinc-400 mt-1">Systems Engineering</p>
            <p className="text-sm text-zinc-300 mt-3">Researchers, developers, infrastructure architects. Kernels, graphs, causal systems, invariants.</p>
          </div>
          <div className="panel p-6 text-center">
            <p className="text-3xl">🦁</p>
            <h3 className="text-gold text-xl mt-3">Mythic Face</h3>
            <p className="text-sm text-zinc-400 mt-1">Meaning + Civilization</p>
            <p className="text-sm text-zinc-300 mt-3">The cosmological layer. Seven Articles, Alpha Song, symbolic governance, Lion of Judah.</p>
          </div>
        </div>
      </section>

      {/* DARWIN KERNEL */}
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

      {/* REPLAY ENGINE */}
      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">The Replay Engine</h2>
        <p className="text-center text-zinc-400 mt-2">The Crown Jewel — deterministic truth verification</p>
        <div className="panel p-8 mt-8">
          <div className="grid md:grid-cols-5 gap-4 text-center">
            <div><p className="text-gold font-bold text-sm">Input Hash</p><p className="text-xs text-zinc-400 mt-1">Submit any SHA-256</p></div>
            <div><p className="text-gold font-bold text-sm">Retrieve State</p><p className="text-xs text-zinc-400 mt-1">Historical snapshot</p></div>
            <div><p className="text-gold font-bold text-sm">Replay Timeline</p><p className="text-xs text-zinc-400 mt-1">Decision sequence</p></div>
            <div><p className="text-gold font-bold text-sm">Inspect Violations</p><p className="text-xs text-zinc-400 mt-1">Invariant checks</p></div>
            <div><p className="text-gold font-bold text-sm">Witness Causality</p><p className="text-xs text-zinc-400 mt-1">Full chain proof</p></div>
          </div>
          <p className="text-center text-zinc-400 mt-6 text-sm">This transforms mythology into legitimacy. Every claim is verifiable.</p>
        </div>
      </section>

      {/* DETERMINISTIC GOVERNANCE AGENTS */}
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

      {/* DOMAIN NETWORK */}
      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">The Domain Empire</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <a href="https://jah.rastaimperium.com" className="panel p-6 hover:bg-green/40 transition-all">
            <p className="text-xs font-courier text-zinc-500">jah.rastaimperium.com</p>
            <h3 className="text-gold text-xl mt-2">The Intelligence Field</h3>
            <p className="text-sm text-zinc-300 mt-2">AI systems, inference, orchestration, deterministic cognition. Intelligence without governance is entropy.</p>
          </a>
          <a href="https://codex.rastaimperium.com" className="panel p-6 hover:bg-green/40 transition-all">
            <p className="text-xs font-courier text-zinc-500">codex.rastaimperium.com</p>
            <h3 className="text-gold text-xl mt-2">The Constitutional Archive</h3>
            <p className="text-sm text-zinc-300 mt-2">Formal law, doctrine, whitepapers, specifications, civilization memory. Vatican library meets cryptographic repository.</p>
          </a>
          <Link href="/consulting" className="panel p-6 hover:bg-green/40 transition-all">
            <p className="text-xs font-courier text-zinc-500">consulting.rastaimperium.com</p>
            <h3 className="text-gold text-xl mt-2">The Institutional Sanctum</h3>
            <p className="text-sm text-zinc-300 mt-2">Enterprise onboarding, governance consulting, critical infrastructure integration. Zero mythology, pure institutional precision.</p>
          </Link>
          <Link href="/witness" className="panel p-6 hover:bg-green/40 transition-all">
            <p className="text-xs font-courier text-zinc-500">rastaimperium.com/witness</p>
            <h3 className="text-gold text-xl mt-2">The Witness Portal</h3>
            <p className="text-sm text-zinc-300 mt-2">Real-time system state, coherence score, invariant topology, causal flow map, replay stream. Mission control for civilization.</p>
          </Link>
        </div>
      </section>

      {/* POSITIONING */}
      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">Positioning</h2>
        <div className="panel p-8 mt-6">
          <p className="text-zinc-200 text-center text-lg">Competing in the future category of <span className="text-gold font-bold">Constitutional Intelligence Infrastructure</span></p>
          <div className="grid md:grid-cols-4 gap-4 mt-6 text-center">
            <div className="border border-gold/20 rounded-lg p-4"><p className="text-zinc-400 text-sm">Peer class</p><p className="text-gold mt-1">Palantir</p></div>
            <div className="border border-gold/20 rounded-lg p-4"><p className="text-zinc-400 text-sm">Peer class</p><p className="text-gold mt-1">Anthropic Safety</p></div>
            <div className="border border-gold/20 rounded-lg p-4"><p className="text-zinc-400 text-sm">Peer class</p><p className="text-gold mt-1">Helsing</p></div>
            <div className="border border-gold/20 rounded-lg p-4"><p className="text-zinc-400 text-sm">Differentiation</p><p className="text-gold mt-1">Replayable Epistemic Governance</p></div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
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

      {/* PUBLISHED WORKS */}
      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">Research & Publications</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <a href="https://amzn.eu/d/02iiTGT5" target="_blank" rel="noopener" className="panel p-6 hover:bg-green/40 transition-all">
            <p className="text-xs text-zinc-500">December 2025</p>
            <h3 className="text-gold text-xl mt-2">Rasta Codex</h3>
            <p className="text-zinc-300 mt-1">A King&apos;s Guide to Energetic Sovereignty</p>
            <p className="text-sm text-gold/70 mt-3">Amazon →</p>
          </a>
          <a href="https://www.amazon.co.uk/dp/B0GNFS1N62" target="_blank" rel="noopener" className="panel p-6 hover:bg-green/40 transition-all">
            <p className="text-xs text-zinc-500">February 2026</p>
            <h3 className="text-gold text-xl mt-2">RastafarAI: EVO-V</h3>
            <p className="text-zinc-300 mt-1">The Jah Light of Contained Evolution</p>
            <p className="text-sm text-gold/70 mt-3">Amazon →</p>
          </a>
        </div>
      </section>

      {/* OPEN SOURCE */}
      <section className="container-page pb-20 text-center">
        <h2 className="text-3xl text-gold">Open Source</h2>
        <p className="text-zinc-400 mt-2">Sovereign and verifiable</p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <a href="https://github.com/laszlomazsar-hash/rastaimperium" target="_blank" rel="noopener" className="panel px-5 py-3 hover:bg-green/40 transition"><span className="text-gold">rastaimperium</span></a>
          <a href="https://github.com/laszlomazsar-hash/evo-v" target="_blank" rel="noopener" className="panel px-5 py-3 hover:bg-green/40 transition"><span className="text-gold">evo-v</span></a>
          <a href="https://github.com/laszlomazsar-hash/evo-v5-laplacian-shift" target="_blank" rel="noopener" className="panel px-5 py-3 hover:bg-green/40 transition"><span className="text-gold">evo-v5-laplacian-shift</span></a>
          <a href="https://github.com/laszlomazsar-hash/evo-v-control-cloud" target="_blank" rel="noopener" className="panel px-5 py-3 hover:bg-green/40 transition"><span className="text-gold">evo-v-control-cloud</span></a>
        </div>
      </section>
    </main>
  );
}
